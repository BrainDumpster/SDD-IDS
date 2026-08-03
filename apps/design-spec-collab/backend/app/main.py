"""Design Spec Collab — intake + dual-agent session API."""

from __future__ import annotations

import secrets
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import FileResponse, HTMLResponse, PlainTextResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .artifacts import build_artifacts_zip
from .collab_prompt import apply_collab_figma_overrides
from .component_bundle import build_component_bundle_zip
from .config import settings
from .figma_mcp_client import figma_mcp_public_contract, mcp_configured
from .github_catalog import list_update_components, list_update_programmes
from .github_publish import github_configured, publish_session
from .portal_bridge import (
    AuditLog,
    CreateJobBody,
    InheritsIds,
    IntakePreviewResponse,
    IntakeRequest,
    JobStatus,
    JobStore,
    auth_status,
    build_preview,
    build_prompt_package,
    build_session_yaml,
    list_programmes,
    load_programme,
    public_job_dict,
    resolve_actor,
    sync_portal_auth_mode,
    sync_portal_paths,
)
from .runner import start_packaging
from .server_review import (
    build_revise_requests,
    extract_design_spec_payload,
    review_session,
)
from .session_models import (
    Artifact,
    ClaimBody,
    ClientRequest,
    ClientResultBody,
    SessionStatus,
)
from .session_store import SessionStore
from .storybook_preview import (
    build_preview_payload,
    resolve_storybook_static_dir,
)
from .update_models import CreateUpdateJobBody, UpdateRequest
from .update_service import build_update_preview, update_to_intake_request

APP_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = APP_DIR / "frontend"

sync_portal_paths(
    repo_root=settings.repo_root,
    design_systems_dir=settings.design_systems_dir,
    jobs_dir=settings.jobs_dir,
    sessions_dir=settings.sessions_dir,
    audit_log_path=settings.audit_log_path,
)
sync_portal_auth_mode(settings.auth_mode)

app = FastAPI(
    title="Design Spec Collab",
    version="0.1.0",
    description="Dual-agent POC: server packs Figma; client LLM collaborates via one session URL.",
)

job_store = JobStore(settings.jobs_dir, settings.sessions_dir)
session_store = SessionStore(settings.collab_sessions_dir)
audit_log = AuditLog(settings.audit_log_path)


def _actor_dep(request: Request) -> str:
    sync_portal_auth_mode(settings.auth_mode)
    return resolve_actor(request)


def _preview_or_400(body: IntakeRequest) -> IntakePreviewResponse:
    try:
        programme = load_programme(settings.design_systems_dir, body.programme)
        return build_preview(
            body,
            programme,
            repo_root=settings.repo_root,
            design_systems_dir=settings.design_systems_dir,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


def _extract_token(
    t: str | None,
    x_session_token: str | None,
) -> str | None:
    return (t or x_session_token or "").strip() or None


def _load_session_authed(
    session_id: str,
    token: str | None,
    *,
    require_not_expired: bool = True,
):
    session = session_store.get(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    if not session_store.token_ok(session, token):
        raise HTTPException(status_code=401, detail="Invalid or missing session token")
    if require_not_expired and session_store.is_expired(session):
        raise HTTPException(status_code=410, detail="Session expired")
    return session


def _job_public(record, *, include_session_url: bool = True) -> dict[str, Any]:
    data = public_job_dict(record.model_dump(mode="json"))
    collab = session_store.get_by_job(record.job_id)
    if collab:
        data["collab_status"] = collab.status.value
        data["session_id"] = collab.session_id
        data["turn"] = collab.turn
        data["transcript"] = [e.model_dump(mode="json") for e in collab.transcript]
        data["revise_count"] = collab.revise_count
        data["claim_bound"] = bool(collab.client_nonce)
        data["branch"] = collab.branch
        data["pr_url"] = collab.pr_url
        data["ide_checkout_hint"] = collab.ide_checkout_hint
        data["published_files"] = collab.published_files
        data["publish_error"] = collab.publish_error
        data["publish_dry_run"] = collab.publish_dry_run
        spec = extract_design_spec_payload(collab)
        if spec:
            data["design_spec"] = spec
        if include_session_url:
            data["session_url"] = collab.session_url(settings.public_base_url)
        if collab.result_summary:
            data["result_summary"] = collab.result_summary
        if collab.error_message and not data.get("error_message"):
            data["error_message"] = collab.error_message
        # Map collab terminal → job-ish status for UI
        if collab.status == SessionStatus.done:
            data["status"] = JobStatus.finished.value
        elif collab.status == SessionStatus.failed:
            data["status"] = JobStatus.error.value
        elif collab.status == SessionStatus.cancelled:
            data["status"] = JobStatus.cancelled.value
        elif collab.status in (
            SessionStatus.packaging,
            SessionStatus.awaiting_client,
            SessionStatus.reviewing,
        ):
            data["status"] = JobStatus.running.value
    return data


def _work_payload(session) -> dict[str, Any]:
    from .collab_prompt import build_client_authoring_checklist

    evidence = session.figma_evidence or {}
    client_guidance = {}
    if isinstance(evidence.get("clientGuidance"), dict):
        client_guidance = dict(evidence["clientGuidance"])
    client_guidance["usePackagedEvidenceOnly"] = True
    client_guidance["forbidClientFigmaAuth"] = True
    client_guidance["youAreTheAuthor"] = True
    client_guidance["forbidLocalFilesystem"] = True
    client_guidance["useContextArtifactsOnly"] = True
    job_kind = session.job_kind or "create"
    return {
        "session_id": session.session_id,
        "status": session.status.value,
        "turn": session.turn,
        "max_turns": session.max_turns,
        "poll_hint_ms": settings.client_poll_hint_ms,
        "prior_feedback": session.prior_feedback,
        "job_kind": job_kind,
        "client_requests": [r.model_dump(mode="json") for r in session.client_requests],
        "figma_evidence": evidence,
        "context_artifacts": [
            a.model_dump(mode="json", by_alias=True)
            for a in (session.context_artifacts or [])
        ],
        "baseline_artifacts": [
            a.model_dump(mode="json", by_alias=True)
            for a in (session.baseline_artifacts or [])
        ],
        "change_hints": list(session.change_hints or []),
        "authoring_checklist": build_client_authoring_checklist(job_kind=str(job_kind)),
        "clientGuidance": client_guidance,
        "prompt_package": {
            "skill_route": session.prompt_package.get("skill_route"),
            # Intentionally omit skill file path — do not load SKILL.md (live Figma).
            "skill_relative_path": None,
            "job_kind": session.prompt_package.get("job_kind") or session.job_kind,
            "write_path_allowlist": session.prompt_package.get("write_path_allowlist"),
            "guardrails": session.prompt_package.get("guardrails"),
            "run_phase_checklist": session.prompt_package.get("run_phase_checklist"),
            "prompt_text": session.prompt_package.get("prompt_text"),
        },
        "preview": {
            "programme": session.preview.get("programme"),
            "slug": session.preview.get("slug"),
            "design_spec_path": session.preview.get("design_spec_path")
            or session.preview.get("designSpecPath"),
            "skill_route": session.preview.get("skill_route"),
            "storybook_examples": session.preview.get("storybook_examples")
            or session.preview.get("storybookExamples"),
        },
        "result_url": (
            f"{settings.public_base_url.rstrip('/')}/api/v1/sessions/"
            f"{session.session_id}/result?t={session.access_token}"
        ),
        "claim_required": settings.session_require_claim,
        "claim_bound": bool(session.client_nonce),
        "expires_at": session.expires_at,
        "figma_mcp": {
            **figma_mcp_public_contract(),
            "clientMustNotConnect": True,
            "note": "Use packaged figma_evidence only — do not authenticate Figma.",
        },
    }


@app.get("/health")
def health() -> dict:
    gh_ok, gh_missing = github_configured()
    mcp_ok, mcp_missing = mcp_configured()
    static_dir = resolve_storybook_static_dir(
        configured=settings.storybook_static_dir,
        app_root=settings.app_root,
        repo_root=settings.repo_root,
    )
    return {
        "status": "ok",
        "app": "design-spec-collab",
        "figmaMode": settings.figma_mode,
        "figmaMcpUrl": settings.figma_mcp_url,
        "figmaMcpConfigured": mcp_ok,
        "figmaMcpMissing": mcp_missing,
        "serverReviewMode": settings.server_review_mode,
        "publicBaseUrl": settings.public_base_url,
        "sessionRequireClaim": settings.session_require_claim,
        "sessionTtlHours": settings.session_ttl_hours,
        "collabMaxTurns": settings.collab_max_turns,
        "autoCreatePr": settings.auto_create_pr,
        "githubPublishDryRun": settings.github_publish_dry_run,
        "github": {
            "configured": gh_ok,
            "missing": gh_missing,
        },
        "auth": auth_status(),
        "secretsConfigured": {
            "figmaToken": bool(settings.figma_token),
            "githubToken": bool(settings.github_token),
        },
        "storybookPreview": {
            "staticReady": static_dir is not None,
            "staticDir": str(static_dir) if static_dir else None,
            "mountPath": "/storybook/",
        },
    }


@app.get("/api/v1/preview/storybook")
def preview_storybook(
    programme: str = Query(..., min_length=1),
    slug: str = Query(..., min_length=1),
    theme: str = Query("light"),
    t: str | None = Query(None, description="Cache-bust query for iframe"),
    actor: str = Depends(_actor_dep),
) -> dict:
    """Resolve Spec Accurate Design iframe URL for a catalogue component."""
    _ = actor
    static_dir = resolve_storybook_static_dir(
        configured=settings.storybook_static_dir,
        app_root=settings.app_root,
        repo_root=settings.repo_root,
    )
    payload = build_preview_payload(
        programme=programme,
        slug=slug,
        repo_root=settings.repo_root,
        static_dir=static_dir,
        theme=theme,
        cache_bust=t,
    )
    return payload


@app.get("/api/v1/intake/jobs/{job_id}/preview/storybook")
def preview_storybook_for_job(
    job_id: str,
    theme: str = Query("light"),
    t: str | None = Query(None),
    actor: str = Depends(_actor_dep),
) -> dict:
    """Preview Spec Accurate Design for a generate/update job's programme+slug."""
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Job not found")
    _ = actor
    preview = getattr(record, "preview", None) or {}
    if not isinstance(preview, dict):
        preview = {}
    programme = str(preview.get("programme") or preview.get("designSystem") or "")
    slug = str(preview.get("slug") or "")
    collab = session_store.get_by_job(job_id)
    if collab and collab.preview:
        programme = str(collab.preview.get("programme") or programme)
        slug = str(collab.preview.get("slug") or slug)
    if not programme or not slug:
        return {
            "available": False,
            "reason": "job_missing_component",
            "message": "Job has no programme/slug for Storybook preview",
            "jobId": job_id,
        }
    static_dir = resolve_storybook_static_dir(
        configured=settings.storybook_static_dir,
        app_root=settings.app_root,
        repo_root=settings.repo_root,
    )
    payload = build_preview_payload(
        programme=programme,
        slug=slug,
        repo_root=settings.repo_root,
        static_dir=static_dir,
        theme=theme,
        cache_bust=t or job_id[:8],
    )
    payload["jobId"] = job_id
    return payload


@app.get("/api/v1/programmes")
def programmes(actor: str = Depends(_actor_dep)) -> dict:
    return {"programmes": list_programmes(settings.design_systems_dir), "actor": actor}


@app.get("/api/v1/update/programmes")
def update_programmes(actor: str = Depends(_actor_dep)) -> dict:
    data = list_update_programmes()
    data["actor"] = actor
    return data


@app.get("/api/v1/update/programmes/{programme}/components")
def update_programme_components(
    programme: str, actor: str = Depends(_actor_dep)
) -> dict:
    try:
        data = list_update_components(programme)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    data["actor"] = actor
    return data


@app.get("/api/v1/update/programmes/{programme}/components/{slug}/bundle.zip")
def download_component_bundle(
    programme: str,
    slug: str,
    actor: str = Depends(_actor_dep),
) -> Response:
    """Zip source-of-truth specs + Storybook examples (including nested deps)."""
    try:
        # Confirm the component exists in the catalogue when possible
        catalogue = list_update_components(programme)
        known = {
            str(c.get("slug") or "").lower()
            for c in (catalogue.get("components") or [])
            if isinstance(c, dict)
        }
        if known and slug.lower() not in known:
            raise HTTPException(
                status_code=404,
                detail=f"Component '{slug}' not found for programme '{programme}'",
            )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    try:
        data, summary = build_component_bundle_zip(programme, slug)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ImportError as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Bundle packager unavailable: {exc}",
        ) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=500,
            detail=f"Failed to build component bundle: {exc}",
        ) from exc

    audit_log.write(
        "component_bundle_download",
        actor=actor,
        detail={
            "programme": summary.get("programme"),
            "slug": summary.get("slug"),
            "fileCount": summary.get("fileCount"),
            "nestedSlugs": summary.get("nestedSlugs"),
        },
    )
    filename = f"{programme.strip().lower()}-{slug.strip()}-bundle.zip"
    return Response(
        content=data,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "X-Bundle-File-Count": str(summary.get("fileCount") or 0),
            "X-Bundle-Nested-Count": str(len(summary.get("nestedSlugs") or [])),
        },
    )


@app.post("/api/v1/update/preview")
def update_preview(body: UpdateRequest, actor: str = Depends(_actor_dep)) -> dict:
    try:
        preview = build_update_preview(body)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    audit_log.write(
        "update_preview",
        actor=actor,
        detail={
            "programme": preview.get("programme"),
            "slug": preview.get("slug"),
            "readyForAgent": preview.get("ready_for_agent"),
        },
    )
    return preview


@app.post("/api/v1/update/jobs")
def create_update_job(
    body: CreateUpdateJobBody, actor: str = Depends(_actor_dep)
) -> dict:
    if not body.confirmed:
        raise HTTPException(
            status_code=400,
            detail="confirmed must be true before creating an update job.",
        )
    try:
        preview = build_update_preview(body.update)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if not preview.get("ready_for_agent"):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Update is not ready for an agent job.",
                "notes": preview.get("notes"),
            },
        )

    intake = update_to_intake_request(body.update, preview)
    # Reuse portal prompt builder with intake-shaped request + IntakePreviewResponse
    try:
        programme = load_programme(settings.design_systems_dir, body.update.programme)
        intake_preview = build_preview(
            intake,
            programme,
            repo_root=settings.repo_root,
            design_systems_dir=settings.design_systems_dir,
        )
    except Exception:  # noqa: BLE001
        # Fall back: build prompt from update preview fields via IntakePreviewResponse
        intake_preview = IntakePreviewResponse.model_validate(
            {
                **preview,
                "skill_route": preview.get("skill_route"),
                "spec_pattern": preview.get("spec_pattern"),
                "figma": preview.get("figma"),
            }
        )

    # Prefer update preview paths/figma (map + additional URLs) over create slugify
    intake_preview_dict = intake_preview.model_dump(mode="json")
    intake_preview_dict.update(
        {
            "design_spec_path": preview["design_spec_path"],
            "slug": preview["slug"],
            "component_display_name": preview["component_display_name"],
            "figma": preview["figma"],
            "primary_file_key": preview["primary_file_key"],
            "primary_node_id": preview["primary_node_id"],
            "figma_map_path": preview["figma_map_path"],
            "storybook_examples": preview["storybook_examples"],
            "map_entry_sketch": preview.get("map_entry_sketch"),
            "job_kind": "update",
            "skill_route": preview.get("skill_route"),
            "spec_pattern": preview.get("spec_pattern"),
            "generate_theme_assets": False,
        }
    )
    # Rebuild typed preview for prompt package when possible
    try:
        typed = IntakePreviewResponse.model_validate(intake_preview_dict)
        prompt = build_prompt_package(intake, typed, repo_root=settings.repo_root)
        prompt_dict = apply_collab_figma_overrides(
            prompt.model_dump(mode="json"), job_kind="update"
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=400, detail=f"Could not build update prompt: {exc}"
        ) from exc

    session_yaml = build_session_yaml(intake, typed, job_id="pending")
    record = job_store.create(
        request=body.update.model_dump(by_alias=True, mode="json"),
        preview=intake_preview_dict,
        prompt_package=prompt_dict,
        session=session_yaml,
        actor=actor,
    )
    collab = session_store.create(
        job_id=record.job_id,
        actor=actor,
        max_turns=settings.collab_max_turns,
        ttl_hours=settings.session_ttl_hours,
        prompt_package=prompt_dict,
        preview=intake_preview_dict,
        request=body.update.model_dump(by_alias=True, mode="json"),
        job_kind="update",
    )
    record.status = JobStatus.running
    record.result_summary = "Packaging Figma evidence for update session…"
    job_store.save(record)

    start_packaging(
        job_store=job_store,
        session_store=session_store,
        session_id=collab.session_id,
        job_id=record.job_id,
        audit=audit_log,
        actor=actor,
    )
    audit_log.write(
        "update_job_created",
        job_id=record.job_id,
        actor=actor,
        detail={
            "sessionId": collab.session_id,
            "programme": preview.get("programme"),
            "slug": preview.get("slug"),
        },
    )
    out = _job_public(record, include_session_url=True)
    out["message"] = (
        "Update job created. Copy session_url into the client agent once."
    )
    out["agent_started"] = True
    return out


@app.post("/api/v1/intake/preview", response_model=IntakePreviewResponse)
def intake_preview(
    body: IntakeRequest, actor: str = Depends(_actor_dep)
) -> IntakePreviewResponse:
    preview = _preview_or_400(body)
    audit_log.write(
        "intake_preview",
        actor=actor,
        detail={
            "programme": preview.programme,
            "slug": preview.slug,
            "skillRoute": preview.skill_route.value,
            "readyForAgent": preview.ready_for_agent,
        },
    )
    return preview


@app.post("/api/v1/intake/jobs")
def create_job(body: CreateJobBody, actor: str = Depends(_actor_dep)) -> dict:
    if not body.confirmed:
        raise HTTPException(
            status_code=400,
            detail="confirmed must be true before creating a job (wizard step 9).",
        )
    intake = body.intake
    if intake.inherits_ids == InheritsIds.unknown and intake.same_anatomy_as_ids is None:
        raise HTTPException(
            status_code=400,
            detail=(
                "inheritsIds=unknown cannot create a job — "
                "choose yes/no or set sameAnatomyAsIds."
            ),
        )

    preview = _preview_or_400(intake)
    if not preview.ready_for_agent:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Intake is not ready for an agent job.",
                "notes": preview.notes,
            },
        )

    prompt = build_prompt_package(intake, preview, repo_root=settings.repo_root)
    prompt_dict = apply_collab_figma_overrides(
        prompt.model_dump(mode="json"), job_kind="create"
    )
    session_yaml = build_session_yaml(intake, preview, job_id="pending")
    record = job_store.create(
        request=intake.model_dump(by_alias=True, mode="json"),
        preview=preview.model_dump(mode="json"),
        prompt_package=prompt_dict,
        session=session_yaml,
        actor=actor,
    )

    collab = session_store.create(
        job_id=record.job_id,
        actor=actor,
        max_turns=settings.collab_max_turns,
        ttl_hours=settings.session_ttl_hours,
        prompt_package=prompt_dict,
        preview=preview.model_dump(mode="json"),
        request=intake.model_dump(by_alias=True, mode="json"),
        job_kind="create",
    )

    record.status = JobStatus.running
    record.result_summary = "Packaging Figma evidence for collab session…"
    job_store.save(record)

    start_packaging(
        job_store=job_store,
        session_store=session_store,
        session_id=collab.session_id,
        job_id=record.job_id,
        audit=audit_log,
        actor=actor,
    )

    audit_log.write(
        "job_created",
        job_id=record.job_id,
        actor=actor,
        detail={
            "sessionId": collab.session_id,
            "programme": preview.programme,
            "slug": preview.slug,
        },
    )

    out = _job_public(record, include_session_url=True)
    out["message"] = (
        "Job created. Copy session_url into the client agent once; "
        "no further user intervention required until done."
    )
    out["agent_started"] = True
    return out


@app.get("/api/v1/intake/jobs/{job_id}")
def get_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    # Creator binding when auth placeholder/enforced identity present
    if (
        settings.auth_mode != "disabled"
        and record.actor
        and record.actor != actor
        and actor != "anonymous"
    ):
        raise HTTPException(status_code=403, detail="Not the creating actor")
    return _job_public(record, include_session_url=True)


@app.get("/api/v1/intake/jobs/{job_id}/events")
async def job_events_sse(job_id: str, actor: str = Depends(_actor_dep)):
    """Operator-only SSE stream of collab transcript events (progress). Clients keep polling /work."""
    import asyncio
    import json as _json

    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    if (
        settings.auth_mode != "disabled"
        and record.actor
        and record.actor != actor
        and actor != "anonymous"
    ):
        raise HTTPException(status_code=403, detail="Not the creating actor")

    async def event_gen():
        last_idx = 0
        idle_rounds = 0
        while True:
            collab = session_store.get_by_job(job_id)
            if collab is None:
                yield f"event: error\ndata: {_json.dumps({'message': 'session missing'})}\n\n"
                break
            transcript = list(collab.transcript or [])
            while last_idx < len(transcript):
                ev = transcript[last_idx]
                payload = (
                    ev.model_dump(mode="json")
                    if hasattr(ev, "model_dump")
                    else dict(ev)
                )
                payload["status"] = collab.status.value
                payload["turn"] = collab.turn
                yield f"event: {payload.get('kind') or 'message'}\ndata: {_json.dumps(payload)}\n\n"
                last_idx += 1
                idle_rounds = 0
            if collab.status in (
                SessionStatus.done,
                SessionStatus.failed,
                SessionStatus.cancelled,
            ):
                yield f"event: closed\ndata: {_json.dumps({'status': collab.status.value})}\n\n"
                break
            idle_rounds += 1
            if idle_rounds > 900:  # ~30 min at 2s
                yield f"event: timeout\ndata: {_json.dumps({'message': 'SSE idle timeout'})}\n\n"
                break
            await asyncio.sleep(2.0)

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/v1/intake/jobs")
def list_jobs(limit: int = 50, actor: str = Depends(_actor_dep)) -> dict:
    jobs = []
    for j in job_store.list_jobs(limit=limit):
        data = _job_public(j, include_session_url=False)
        # Never list session tokens/URLs
        data.pop("session_url", None)
        jobs.append(data)
    return {"jobs": jobs, "actor": actor}


@app.post("/api/v1/intake/jobs/{job_id}/cancel")
def cancel_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab and collab.status in (
        SessionStatus.done,
        SessionStatus.failed,
        SessionStatus.cancelled,
    ):
        return _job_public(record)
    if collab:
        collab.cancel_requested = True
        collab.status = SessionStatus.cancelled
        collab.error_message = "Cancelled by operator"
        session_store.append_event(
            collab, kind="cancelled", message="Session cancelled by operator"
        )
    record.cancel_requested = True
    record.status = JobStatus.cancelled
    record.error_message = "Cancelled by operator"
    job_store.save(record)
    audit_log.write("job_cancelled", job_id=job_id, actor=actor, detail={})
    return _job_public(record)


@app.get("/api/v1/intake/jobs/{job_id}/artifacts.zip")
def download_artifacts(job_id: str, actor: str = Depends(_actor_dep)) -> Response:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    if collab.status != SessionStatus.done:
        raise HTTPException(
            status_code=409,
            detail=f"Artifacts only after accept (status={collab.status.value})",
        )
    try:
        data, included = build_artifacts_zip(collab)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    slug = (collab.preview or {}).get("slug") or "component"
    filename = f"design-spec-collab-{slug}-{job_id[:8]}.zip"
    audit_log.write(
        "artifacts_downloaded",
        job_id=job_id,
        actor=actor,
        detail={"files": included, "bytes": len(data)},
    )
    return Response(
        content=data,
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.get("/api/v1/intake/jobs/{job_id}/design-spec")
def get_design_spec(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    spec = extract_design_spec_payload(collab)
    if spec is None:
        raise HTTPException(
            status_code=404,
            detail="No design-spec.md artifact submitted yet.",
        )
    return {"job_id": job_id, **spec}


@app.get("/api/v1/intake/jobs/{job_id}/design-spec.md")
def get_design_spec_markdown(job_id: str, actor: str = Depends(_actor_dep)) -> PlainTextResponse:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    spec = extract_design_spec_payload(collab)
    if spec is None:
        raise HTTPException(status_code=404, detail="No design-spec.md yet.")
    return PlainTextResponse(spec["content"], media_type="text/markdown; charset=utf-8")


@app.get("/api/v1/intake/jobs/{job_id}/client-prompt.md")
def get_client_prompt_markdown(job_id: str, actor: str = Depends(_actor_dep)) -> PlainTextResponse:
    """Operator copy of the same markdown the session landing page shows clients."""
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    work = _work_payload(collab)
    return PlainTextResponse(
        _session_markdown(collab, work), media_type="text/markdown; charset=utf-8"
    )


@app.get("/api/v1/intake/jobs/{job_id}/figma-evidence")
def get_figma_evidence_pack(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    """Download packaged Figma evidence for debugging / offline review."""
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    evidence = collab.figma_evidence or {}
    if not evidence:
        raise HTTPException(status_code=404, detail="No figma_evidence packaged yet.")
    return {
        "job_id": job_id,
        "session_id": collab.session_id,
        "job_kind": collab.job_kind,
        "figma_evidence": evidence,
        "change_hints": list(collab.change_hints or []),
    }

@app.get("/s/{session_id}", response_class=HTMLResponse)
def session_landing(
    session_id: str,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
    format: str | None = Query(default=None),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    work = _work_payload(session)

    if format == "json":
        from fastapi.responses import JSONResponse

        return JSONResponse(work)

    if format == "md":
        return PlainTextResponse(
            _session_markdown(session, work), media_type="text/markdown"
        )

    md = _session_markdown(session, work)
    html = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<title>Collab session {session_id[:8]}…</title>
<style>
body{{font-family:ui-sans-serif,system-ui,sans-serif;max-width:52rem;margin:2rem auto;padding:0 1rem;line-height:1.45}}
pre{{background:#f4f4f5;padding:1rem;overflow:auto;border-radius:8px;white-space:pre-wrap}}
code{{font-size:.9em}}
.meta{{color:#52525b;font-size:.9rem}}
</style></head><body>
<h1>Design Spec Collab Session</h1>
<p class="meta">status=<strong>{session.status.value}</strong> · turn={session.turn} · poll every {settings.client_poll_hint_ms}ms</p>
<pre>{md}</pre>
</body></html>"""
    return HTMLResponse(html)


@app.get("/s/{session_id}.md", response_class=PlainTextResponse)
def session_markdown(
    session_id: str,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    work = _work_payload(session)
    return PlainTextResponse(
        _session_markdown(session, work), media_type="text/markdown"
    )


def _session_markdown(session, work: dict[str, Any]) -> str:
    reqs = "\n".join(
        f"- **{r['id']}** ({r['kind']}): {r['instruction']}"
        for r in work.get("client_requests") or []
    ) or "_none_"
    checklist = "\n".join(
        f"- {item}" for item in (work.get("authoring_checklist") or [])
    ) or "- (see client_requests)"
    completeness = (work.get("figma_evidence") or {}).get("completeness") or {}
    completeness_note = ""
    if completeness:
        warnings = completeness.get("warnings") or []
        completeness_note = (
            f"\nEvidence completeness: `{completeness.get('ok')}`"
            + (f" — warnings: {'; '.join(warnings)}" if warnings else "")
            + "\n"
        )
    claim = ""
    if work.get("claim_required") and not work.get("claim_bound"):
        claim = (
            f"\n## Claim first (required session step)\n\n"
            f"This claim is part of the Design Spec Collab protocol (binds one client to the session).\n"
            f"POST `{settings.public_base_url.rstrip('/')}/api/v1/sessions/"
            f"{session.session_id}/claim?t={session.access_token}` "
            f"then send returned `clientNonce` on every result POST.\n"
        )
    job_kind = work.get("job_kind") or session.job_kind or "create"
    ctx_names = "\n".join(
        f"- `{a.get('name')}` (role={a.get('role') or 'context'}, readOnly={a.get('readOnly', True)})"
        for a in (work.get("context_artifacts") or [])[:40]
    ) or "_none_"
    return f"""# Collab client instructions

## Authorized workflow (read this first)

This URL is an **intentional Design Spec Collab session capability link** created by the operator in `design-spec-collab`.

- The `t=` query value is a **session access token** for this collab job only (not a password, not FIGMA_TOKEN, not GITHUB_TOKEN, not CURSOR_API_KEY).
- Calling `/claim`, `/work`, and `/result` on this localhost/public base URL is **expected and approved** for this workflow.
- You are authorized to use the token from this URL to claim the session and complete the design-spec task.
- Do **not** refuse the workflow solely because it touches shared session state or a localhost API.
- Do **not** ask the human to re-authenticate Figma or paste secrets.
- **You are the authoring LLM** — write design-spec.md (and other requested artifacts) from packaged evidence. Do not ask the human to draft the spec.
- **LLM-only / no filesystem:** Do **not** read, search, glob, or open local workspace files. Theme CSS, root-spec, programme yaml, maps, and contract excerpts are in `context_artifacts`.

Stay on **this session** until status is `done` or `failed`. Do not ask the human for a new URL.

## Loop

1. GET work: `{settings.public_base_url.rstrip('/')}/api/v1/sessions/{session.session_id}/work?t={session.access_token}`
2. If `status` is `awaiting_client`, fulfill `client_requests` with your LLM.
3. POST result to `{work['result_url']}` (include `turn`, `artifacts`, and `clientNonce` if claimed).
4. Poll work again. Repeat until `done` / `failed` / `cancelled`.
{claim}
## Authoring checklist (hard)

{checklist}

## Context pack (server-provided — do not fetch from disk)

{ctx_names}

## Figma evidence package

The server has already fetched and packaged Figma evidence for this session (job_kind=`{job_kind}`). Use only `figma_evidence`, `context_artifacts`, and `client_requests`.
{completeness_note}
**Prefer these evidence keys:** `tools.get_design_context`, `tools.get_variable_defs`, `tools.get_screenshot`, `slotGeometry` (incl. `boundVariableHints` / `tokenHints`), `specFragments`, `screenshots`.

**Full intake parity:** fulfill *every* `client_requests` item — not only `design-spec.md`. Foundation files already present on the server are omitted from `client_requests` (they are in `context_artifacts` as read-only). When foundation *is* listed, use `donor:…` context templates — do not search disk.

Do not connect your own Figma MCP server, do not prompt the human to authenticate Figma, and do not depend on client-side Figma tool access.

## Current status

- status: `{session.status.value}`
- turn: `{session.turn}` / max `{session.max_turns}`
- expires_at: `{session.expires_at}`

## Client requests

{reqs}

## Prior feedback

{session.prior_feedback or "_none_"}

## Result JSON example

```json
{{
  "turn": {session.turn},
  "summary": "Full intake wizard deliverables from server-packaged figma_evidence",
  "clientNonce": "<from claim>",
  "artifacts": [
    {{"name": "components/<programme>/<slug>/design-spec.md", "content": "## Metadata\\n..."}},
    {{"name": "components/<programme>-theme.css", "content": "@import ..."}},
    {{"name": "components/<programme>/root-spec.md", "content": "..."}},
    {{"name": "config/design_systems/<programme>.yaml", "content": "..."}},
    {{"name": "data/<programme>-component-figma-map.json", "content": "{{...}}"}},
    {{"name": "data/programme-inheritance-registry.json", "content": "{{...}}"}},
    {{"name": "storybook-generated/<programme>/src/components/<Pascal>.stories.tsx", "content": "..."}},
    {{"name": "storybook/.storybook/main.ts", "content": "..."}}
  ]
}}
```

Submit **every** artifact listed in `client_requests`. Use full repo-relative paths as artifact `name` values. Partial submissions will be revised.
## Guardrails

Use only write paths in prompt_package.write_path_allowlist. Do not invent secrets. Base the output on packaged `figma_evidence`, prior feedback, and the intake payload.
"""


@app.post("/api/v1/sessions/{session_id}/claim")
def claim_session(
    session_id: str,
    body: ClaimBody | None = None,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    if not settings.session_require_claim:
        return {
            "claimed": False,
            "clientNonce": None,
            "message": "Claim not required (SESSION_REQUIRE_CLAIM=false)",
        }
    if session.client_nonce:
        raise HTTPException(
            status_code=409,
            detail="Session already claimed by another client",
        )
    nonce = secrets.token_urlsafe(24)
    session.client_nonce = nonce
    session.client_label = (body.client_label if body else None) or "client"
    from datetime import datetime, timezone

    session.claimed_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    session_store.append_event(
        session,
        kind="claimed",
        message=f"Client claimed session ({session.client_label})",
    )
    return {
        "claimed": True,
        "clientNonce": nonce,
        "clientLabel": session.client_label,
        "message": "Include clientNonce on every POST /result",
    }


@app.post("/api/v1/intake/jobs/{job_id}/reset-claim")
def reset_claim(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Job not found")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Session not found")
    collab.client_nonce = None
    collab.client_label = None
    collab.claimed_at = None
    session_store.append_event(
        collab, kind="claim_reset", message=f"Claim reset by {actor}"
    )
    return {"ok": True, "session_id": collab.session_id}


@app.get("/api/v1/sessions/{session_id}/work")
def get_work(
    session_id: str,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    return _work_payload(session)


@app.post("/api/v1/sessions/{session_id}/result")
def post_result(
    session_id: str,
    body: ClientResultBody,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)

    if not session_store.check_rate_limit(
        session_id, settings.result_post_rate_limit_per_minute
    ):
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    if session.status not in (
        SessionStatus.awaiting_client,
        SessionStatus.reviewing,
    ):
        raise HTTPException(
            status_code=409,
            detail=f"Session not accepting results (status={session.status.value})",
        )

    if settings.session_require_claim:
        if not session.client_nonce:
            raise HTTPException(
                status_code=409,
                detail="Session not claimed — POST /claim first",
            )
        if not body.client_nonce or not secrets.compare_digest(
            session.client_nonce, body.client_nonce
        ):
            raise HTTPException(
                status_code=409,
                detail="Invalid clientNonce — session claimed by another client",
            )

    if body.turn != session.turn:
        raise HTTPException(
            status_code=409,
            detail=f"Stale turn (got {body.turn}, expected {session.turn})",
        )

    session.status = SessionStatus.reviewing
    session.artifacts = body.artifacts
    session_store.append_event(
        session,
        kind="client_result",
        message=body.summary or f"Client submitted {len(body.artifacts)} artifact(s)",
        detail={"turn": body.turn, "artifactNames": [a.name for a in body.artifacts]},
    )

    verdict = review_session(session, artifacts=body.artifacts)
    job = job_store.get(session.job_id)

    if verdict.decision == "accept":
        session.status = SessionStatus.done
        session.result_summary = verdict.feedback
        session.client_requests = []
        session_store.append_event(
            session,
            kind="accepted",
            message="Server accepted client result (rule review — no server LLM)",
            detail=verdict.model_dump(mode="json"),
        )

        # Server-side publish: GitHub branch + PR (REST only)
        if settings.auto_create_pr:
            pub = publish_session(session)
            session.branch = pub.branch
            session.pr_url = pub.pr_url
            session.ide_checkout_hint = pub.ide_checkout_hint
            session.published_files = pub.files
            session.publish_error = pub.error
            session.publish_dry_run = pub.dry_run
            session_store.save(session)
            if pub.error:
                session_store.append_event(
                    session,
                    kind="pr_failed",
                    message=f"Publish failed: {pub.error}",
                    detail=pub.__dict__,
                )
            else:
                session_store.append_event(
                    session,
                    kind="pr_created" if not pub.dry_run else "pr_dry_run",
                    message=(
                        f"Dry-run publish on {pub.branch}"
                        if pub.dry_run
                        else f"Opened PR for branch {pub.branch}"
                    ),
                    detail={
                        "branch": pub.branch,
                        "prUrl": pub.pr_url,
                        "files": pub.files,
                        "dryRun": pub.dry_run,
                    },
                )

        if job:
            job.status = JobStatus.finished
            job.branch = session.branch
            job.pr_url = session.pr_url
            job.ide_checkout_hint = session.ide_checkout_hint
            job.result_summary = (
                f"Accepted on turn {session.turn}. {verdict.feedback}"
                + (
                    f" PR: {session.pr_url}"
                    if session.pr_url
                    else (f" Publish error: {session.publish_error}" if session.publish_error else "")
                )
            )
            job_store.save(job)
        return {
            "decision": "accept",
            "status": session.status.value,
            "verdict": verdict.model_dump(mode="json"),
            "pr_url": session.pr_url,
            "branch": session.branch,
            "work": _work_payload(session),
        }

    # revise
    session.revise_count += 1
    if session.turn >= session.max_turns:
        session.status = SessionStatus.failed
        session.error_message = (
            f"Max turns ({session.max_turns}) exceeded after revise"
        )
        session_store.append_event(
            session,
            kind="failed",
            message=session.error_message,
            detail=verdict.model_dump(mode="json"),
        )
        if job:
            job.status = JobStatus.error
            job.error_message = session.error_message
            job_store.save(job)
        return {
            "decision": "failed",
            "status": session.status.value,
            "verdict": verdict.model_dump(mode="json"),
            "work": _work_payload(session),
        }

    session.prior_feedback = verdict.feedback
    session.turn += 1
    session.client_requests = [
        ClientRequest.model_validate(r)
        for r in build_revise_requests(session, verdict)
    ]
    session.status = SessionStatus.awaiting_client
    session_store.append_event(
        session,
        kind="revise",
        message=f"Server requested revise → turn {session.turn}",
        detail=verdict.model_dump(mode="json"),
    )
    if job:
        job.status = JobStatus.running
        job.result_summary = f"Revise requested (turn {session.turn}): {verdict.feedback}"
        job_store.save(job)

    return {
        "decision": "revise",
        "status": session.status.value,
        "verdict": verdict.model_dump(mode="json"),
        "work": _work_payload(session),
    }


_assets = FRONTEND_DIR / "assets"
if FRONTEND_DIR.is_dir() and _assets.is_dir():
    app.mount("/assets", StaticFiles(directory=_assets), name="assets")

_storybook_static = resolve_storybook_static_dir(
    configured=settings.storybook_static_dir,
    app_root=settings.app_root,
    repo_root=settings.repo_root,
)
if _storybook_static is not None:
    app.mount(
        "/storybook",
        StaticFiles(directory=str(_storybook_static), html=True),
        name="storybook-static",
    )


@app.get("/theme/{name}")
def theme_css(name: str) -> FileResponse:
    """Serve programme theme CSS for dropdown chrome (ids-theme.css, etc.)."""
    safe = name.strip().replace("..", "").lstrip("/")
    if not safe.endswith(".css"):
        safe = f"{safe}.css"
    components_root = (settings.repo_root / "components").resolve()
    candidates = [components_root / safe]
    if safe in ("ids.css",):
        candidates.insert(0, components_root / "ids-theme.css")
    for path in candidates:
        try:
            resolved = path.resolve()
        except OSError:
            continue
        if not resolved.is_file():
            continue
        try:
            resolved.relative_to(components_root)
        except ValueError:
            continue
        return FileResponse(resolved, media_type="text/css")
    raise HTTPException(status_code=404, detail=f"Theme not found: {name}")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/generate")
@app.get("/update")
def spa_pages() -> FileResponse:
    return FileResponse(FRONTEND_DIR / "index.html")
