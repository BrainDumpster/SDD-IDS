"""Design Spec Collab — intake + dual-agent session API."""

from __future__ import annotations

import logging
import secrets
from pathlib import Path
from typing import Any

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Query, Request
from fastapi.responses import FileResponse, HTMLResponse, PlainTextResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles

from .artifacts import build_artifacts_zip
from .collab_prompt import apply_collab_figma_overrides
from .component_bundle import build_component_bundle_zip
from .config import settings
from .figma_mcp_client import figma_mcp_public_contract, mcp_configured
from .github_catalog import list_update_components, list_update_programmes, read_repo_file
from .github_publish import github_configured, materialize_session_to_disk, publish_session
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
    ChatBody,
    ClaimBody,
    ClientRequest,
    ClientResultBody,
    HeartbeatBody,
    SessionStatus,
)
from .session_store import SessionStore
from .storybook_preview import (
    build_preview_payload,
    resolve_storybook_static_dir,
)
from .storybook_rebuild import get_rebuild_status, start_storybook_rebuild
from .storybook_pr_build import (
    build_dir,
    builds_root,
    cache_key,
    ensure_pr_build_from_url,
    get_build_status,
    is_build_ready,
    parse_pr_number,
    preview_urls_for_build,
    resolve_pr_head,
    start_filtered_pr_preview_build,
    start_pr_storybook_build,
)
from .review_service import (
    import_pull_request,
    list_collab_pull_requests,
    load_review_session,
    read_review_design_spec,
    refresh_pr_preview_status,
    refresh_rebuild_status,
)
from .review_revise import (
    ReviewReviseBody,
    build_review_revise_preview,
    feedback_as_prior,
    review_revise_request_payload,
)
from .update_models import CreateUpdateJobBody, UpdateRequest
from .update_service import build_update_preview, update_to_intake_request

logger = logging.getLogger(__name__)

APP_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = APP_DIR / "frontend"
BRIDGE_DIR = APP_DIR / "bridge"
BRIDGE_SCRIPT = BRIDGE_DIR / "collab_bridge.py"

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


def _apply_pr_storybook_build(
    payload: dict[str, Any],
    *,
    pr_url: str | None,
    theme: str = "light",
    start_if_missing: bool = True,
    pr_number: int | None = None,
    head_sha: str | None = None,
) -> dict[str, Any]:
    """Prefer a SHA-cached Storybook build from the PR branch when available.

    Pass ``pr_number`` + ``head_sha`` (from a review/job session) to avoid a
    blocking GitHub round-trip on every preview poll.
    """
    num = pr_number if pr_number is not None else parse_pr_number(pr_url)
    if num is None:
        return payload

    sha = (head_sha or "").strip()
    if sha:
        key = cache_key(int(num), sha)
        meta = {
            "number": int(num),
            "headSha": sha,
            "cacheKey": key,
            "htmlUrl": pr_url,
            "title": None,
            "headBranch": None,
        }
    else:
        try:
            meta = resolve_pr_head(int(num))
        except Exception as exc:  # noqa: BLE001
            payload["prStorybook"] = {"status": "error", "message": str(exc)}
            return payload
        key = meta["cacheKey"]
        sha = meta["headSha"]

    st = get_build_status(key)
    payload["prNumber"] = int(num)
    payload["prHeadSha"] = sha
    payload["prStorybookCacheKey"] = key

    if st.get("ready") or is_build_ready(key):
        from .storybook_preview import (
            load_story_index,
            parse_meta_title,
            resolve_stories_path,
            resolve_story_in_static,
        )

        programme = str(payload.get("programme") or "")
        slug = str(payload.get("slug") or "")
        stories_path = resolve_stories_path(
            settings.repo_root,
            programme,
            slug,
            extra_roots=[settings.app_root / "data" / "accepted_workspace"],
        )
        title = payload.get("title")
        if not title and stories_path is not None:
            title = parse_meta_title(stories_path)
        if not title and programme and slug:
            title = (
                f"Spec Generated/"
                f"{programme.upper() if programme == 'ids' else programme.title()}/"
                f"{slug.replace('-', ' ').title()}"
            )

        index = load_story_index(build_dir(key))
        found = resolve_story_in_static(
            index,
            title=str(title) if title else None,
            programme=programme,
            slug=slug,
            stories_path=stories_path,
        )
        if not found:
            payload["prStorybook"] = {
                "status": "ready",
                "ready": True,
                "cacheKey": key,
                "message": (
                    f"PR Storybook cache ready (PR #{num} @ {sha[:12]}) "
                    "but this component's story is not in that build index yet — "
                    "using shared /storybook preview."
                ),
            }
            return payload

        story_id, story_name, is_spec = found
        urls = preview_urls_for_build(key=key, story_id=str(story_id), theme=theme)
        payload["available"] = True
        payload["reason"] = None
        payload["storyId"] = story_id
        payload["storyName"] = story_name
        payload["hasSpecAccurateDesign"] = is_spec
        if title:
            payload["title"] = title
        payload["message"] = (
            "Using cached Storybook build from the PR branch "
            f"(PR #{num} @ {sha[:12]}). "
            "Returning to this tab will not rebuild."
        )
        if not is_spec:
            payload["message"] += (
                f" Previewing `{story_name}` (no Spec Accurate Design export in this CSF)."
            )
        payload["iframeUrl"] = urls["iframeUrl"]
        payload["canvasUrl"] = urls["canvasUrl"]
        payload["managerUrl"] = urls["managerUrl"]
        payload["prStorybook"] = {
            "status": "ready",
            "ready": True,
            "cacheKey": key,
            "basePath": urls["basePath"],
            "message": payload["message"],
        }
        return payload

    if start_if_missing and st.get("status") != "running":
        st = start_pr_storybook_build(
            pr_number=int(num), head_sha=sha, force=False
        )

    payload["prStorybook"] = st
    if st.get("status") == "running":
        payload["available"] = False
        payload["reason"] = "pr_storybook_building"
        payload["message"] = (
            st.get("message")
            or "Building Storybook from the PR branch (1–3 min). "
            "This tab refreshes automatically; coming back later reuses the cache."
        )
        payload["managerUrl"] = "/storybook/index.html"
    elif st.get("status") == "error":
        payload["message"] = (
            (payload.get("message") or "")
            + f" PR-branch Storybook build failed: {st.get('message') or 'error'}."
        ).strip()
    elif start_if_missing is False and st.get("status") in ("missing", "idle", None):
        payload["available"] = False
        payload["reason"] = "pr_storybook_building"
        payload["message"] = (
            f"PR Storybook cache not ready yet (PR #{num} @ {sha[:12]}). "
            "Build scheduled in the background."
        )
        payload["managerUrl"] = payload.get("managerUrl") or "/storybook/index.html"
    return payload


def _actor_dep(request: Request) -> str:
    sync_portal_auth_mode(settings.auth_mode)
    return resolve_actor(request)


def _preview_or_400(body: IntakeRequest) -> IntakePreviewResponse:
    try:
        from .github_catalog import file_exists_on_starting_ref

        programme = load_programme(settings.design_systems_dir, body.programme)
        # Prefer GitHub publish-base existence so local untracked leftovers
        # (e.g. powerflex-theme.css) do not skip foundation create/publish.
        return build_preview(
            body,
            programme,
            repo_root=settings.repo_root,
            design_systems_dir=settings.design_systems_dir,
            path_exists=file_exists_on_starting_ref,
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


def _effective_public_base(request: Request | None = None) -> str:
    """Prefer configured PUBLIC_BASE_URL; if loopback, derive from request + proxy prefix.

    Supports IDE/Jupyter-style mounts: http://IP:8080/proxy/3/#/generate
    → base http://IP:8080/proxy/3 (hash is never part of the base).
    """
    configured = (settings.public_base_url or "").rstrip("/")
    loopback = {"127.0.0.1", "localhost", "::1"}
    hostname = None
    try:
        from urllib.parse import urlparse

        hostname = urlparse(configured).hostname
    except Exception:  # noqa: BLE001
        hostname = None

    # Explicit non-loopback PUBLIC_BASE_URL wins (set this on remote servers).
    if configured and hostname not in loopback:
        return configured

    if request is None:
        return configured or "http://127.0.0.1:8091"

    fwd_host = (request.headers.get("x-forwarded-host") or "").split(",")[0].strip()
    req_host = fwd_host or (request.headers.get("host") or "").strip()
    fwd_proto = (request.headers.get("x-forwarded-proto") or "").split(",")[0].strip()
    proto = fwd_proto or request.url.scheme or "http"
    if not req_host:
        return configured or "http://127.0.0.1:8091"

    base = f"{proto}://{req_host}".rstrip("/")

    # Path prefix: X-Forwarded-Prefix, or /proxy/<id> from original URI / path
    fwd_prefix = (
        request.headers.get("x-forwarded-prefix")
        or request.headers.get("x-forwarded-path")
        or ""
    ).strip()
    if fwd_prefix:
        if not fwd_prefix.startswith("/"):
            fwd_prefix = "/" + fwd_prefix
        return f"{base}{fwd_prefix.rstrip('/')}"

    original = (
        request.headers.get("x-original-uri")
        or request.headers.get("x-forwarded-uri")
        or ""
    ).strip()
    if original:
        import re

        m = re.match(r"(https?://[^/]+)?(/proxy/[^/]+)", original)
        if m:
            return f"{base}{m.group(2)}"

    path = request.url.path or ""
    import re

    m = re.match(r"(/proxy/[^/]+)", path)
    if m:
        return f"{base}{m.group(1)}"

    return base


def _job_public(
    record,
    *,
    include_session_url: bool = True,
    request: Request | None = None,
) -> dict[str, Any]:
    data = public_job_dict(record.model_dump(mode="json"))
    collab = session_store.get_by_job(record.job_id)
    if collab:
        public_base = _effective_public_base(request)
        data["collab_status"] = collab.status.value
        data["session_id"] = collab.session_id
        data["turn"] = collab.turn
        data["transcript"] = [e.model_dump(mode="json") for e in collab.transcript]
        data["revise_count"] = collab.revise_count
        data["claim_bound"] = bool(collab.client_nonce)
        data["bridge_last_heartbeat_at"] = collab.bridge_last_heartbeat_at
        data["bridge_label"] = collab.bridge_label
        data["bridge_progress"] = collab.bridge_progress
        data["packaging_progress"] = collab.packaging_progress
        data["bridge_command"] = collab.bridge_command(public_base)
        data["branch"] = collab.branch
        data["pr_url"] = collab.pr_url
        data["ide_checkout_hint"] = collab.ide_checkout_hint
        data["published_files"] = collab.published_files
        data["publish_error"] = collab.publish_error
        data["publish_dry_run"] = collab.publish_dry_run
        data["operator_closed"] = bool(collab.operator_closed)
        data["operator_closed_at"] = collab.operator_closed_at
        data["job_kind"] = collab.job_kind
        spec = extract_design_spec_payload(collab)
        if spec:
            data["design_spec"] = spec
        if include_session_url:
            data["session_url"] = collab.session_url(public_base)
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
        "operatorIdleMinutes": settings.operator_idle_minutes,
        "github": {
            "configured": gh_ok,
            "missing": gh_missing,
            "sslVerify": settings.github_ssl_verify,
        },
        "auth": auth_status(),
        "secretsConfigured": {
            "figmaToken": bool(settings.figma_token),
            "githubToken": bool(settings.github_token),
        },
        "figmaSslVerify": settings.figma_ssl_verify,
        "storybookPreview": {
            "staticReady": static_dir is not None,
            "staticDir": str(static_dir) if static_dir else None,
            "mountPath": "/storybook/",
            "indexHtml": bool(static_dir and (static_dir / "index.html").is_file()),
            "iframeHtml": bool(static_dir and (static_dir / "iframe.html").is_file()),
            "probeUrl": "/storybook/index.html",
            "rebuild": get_rebuild_status(),
        },
        "bridge": {
            "scriptReady": BRIDGE_SCRIPT.is_file(),
            "scriptPath": "/bridge/collab_bridge.py",
            "architecture": "server→bridge-agent→local-client",
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
        extra_roots=[settings.app_root / "data" / "accepted_workspace"],
    )
    if payload.get("reason") == "static_stale":
        rebuild = get_rebuild_status()
        if rebuild.get("status") != "running":
            rebuild = start_storybook_rebuild(reason=f"catalogue:{programme}/{slug}")
        payload["rebuild"] = rebuild
        if rebuild.get("status") == "running":
            payload["reason"] = "static_rebuilding"
            payload["message"] = (
                "Rebuilding Storybook preview to include this story "
                "(usually 1–3 minutes)."
            )
    else:
        payload["rebuild"] = get_rebuild_status()
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
    # Still waiting on Bridge / client — no story artifacts yet.
    if collab and collab.status.value in ("packaging", "awaiting_client"):
        return {
            "available": False,
            "reason": "awaiting_client",
            "message": (
                f"Storybook preview is not ready yet — session is `{collab.status.value}`. "
                "Run the Bridge command and wait until the server accepts the "
                f".stories.tsx for {programme}/{slug}, then reopen this tab "
                "(rebuild may take 1–3 minutes after accept)."
            ),
            "programme": programme,
            "slug": slug,
            "jobId": job_id,
            "collabStatus": collab.status.value,
            "managerUrl": "/storybook/index.html",
        }
    if collab and collab.status.value in ("reviewing",) and not collab.artifacts:
        return {
            "available": False,
            "reason": "reviewing",
            "message": (
                "Client result is under server review. Storybook preview appears after accept."
            ),
            "programme": programme,
            "slug": slug,
            "jobId": job_id,
            "collabStatus": collab.status.value,
            "managerUrl": "/storybook/index.html",
        }
    # Accepted session artifacts may live only in the session store until PR/rebuild.
    # Materialize so Generate Spec preview can find storybook-generated/… on disk.
    if collab and collab.artifacts:
        try:
            materialize_session_to_disk(collab)
        except Exception:  # noqa: BLE001
            logger.exception("materialize before job storybook preview failed")
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
        extra_roots=[settings.app_root / "data" / "accepted_workspace"],
    )
    payload["jobId"] = job_id
    if collab and collab.publish_error:
        payload["publishError"] = collab.publish_error
    # Hint when stories were submitted but static build is stale
    if not payload.get("available") and collab and collab.artifacts:
        story_names = [
            a.name
            for a in collab.artifacts
            if a.name and ("stories.tsx" in a.name or "storybook-generated" in a.name)
        ]
        if story_names and not payload.get("storiesInSession"):
            payload["storiesInSession"] = story_names

    # Prefer filtered component Storybook (same as Review) — one component only.
    pr_url = (collab.pr_url if collab else None) or getattr(record, "pr_url", None)
    pr_num = None
    head_sha = None
    if collab and collab.preview:
        pr_num = collab.preview.get("pr_number") or collab.preview.get("prNumber")
        head_sha = collab.preview.get("head_sha") or collab.preview.get("headSha")
    if pr_url and "dry_run=1" not in str(pr_url):
        try:
            if pr_num is None:
                pr_num = parse_pr_number(pr_url)
            if pr_num is not None and not head_sha:
                meta = resolve_pr_head(int(pr_num))
                head_sha = meta.get("headSha")
        except Exception:  # noqa: BLE001
            logger.exception("resolve PR head for filtered job preview failed")

    if programme and slug and collab and (
        collab.status.value == "done" or bool(collab.artifacts)
    ):
        build_pr = int(pr_num) if pr_num is not None else 0
        build_sha = (head_sha or "").strip() or f"job-{job_id.replace('-', '')[:12]}"
        key = cache_key(build_pr, build_sha)
        st = get_build_status(key)
        if not (st.get("ready") or is_build_ready(key)):
            if st.get("status") != "running":
                st = start_filtered_pr_preview_build(
                    pr_number=build_pr,
                    head_sha=build_sha,
                    programme=programme,
                    slug=slug,
                    force=bool(collab.status.value == "done"),
                )
        payload["prStorybook"] = st
        payload["prStorybookCacheKey"] = key
        if st.get("ready") or is_build_ready(key):
            from .storybook_preview import (
                load_story_index,
                parse_meta_title,
                resolve_stories_path,
                resolve_story_in_static,
            )

            stories_path = resolve_stories_path(
                settings.repo_root,
                programme,
                slug,
                extra_roots=[settings.app_root / "data" / "accepted_workspace"],
            )
            title = payload.get("title")
            if not title and stories_path is not None:
                title = parse_meta_title(stories_path)
            index = load_story_index(build_dir(key))
            found = resolve_story_in_static(
                index,
                title=str(title) if title else None,
                programme=programme,
                slug=slug,
                stories_path=stories_path,
            )
            if found:
                story_id, story_name, is_spec = found
                urls = preview_urls_for_build(
                    key=key, story_id=str(story_id), theme=theme
                )
                payload["available"] = True
                payload["reason"] = None
                payload["storyId"] = story_id
                payload["storyName"] = story_name
                payload["hasSpecAccurateDesign"] = is_spec
                payload["iframeUrl"] = urls["iframeUrl"]
                payload["canvasUrl"] = urls["canvasUrl"]
                payload["managerUrl"] = urls["managerUrl"]
                payload["message"] = (
                    f"Filtered Storybook preview for {programme}/{slug} "
                    "(this component only — not the shared catalogue)."
                )
                payload["rebuild"] = get_rebuild_status()
                return payload
        elif st.get("status") == "running":
            payload["available"] = False
            payload["reason"] = "pr_storybook_building"
            payload["message"] = (
                st.get("message")
                or f"Building filtered Storybook for {programme}/{slug}…"
            )
            payload["rebuild"] = get_rebuild_status()
            return payload

    # Fallback: global static rebuild when stories exist on disk but aren't in the bake
    if payload.get("reason") == "static_stale":
        rebuild = get_rebuild_status()
        if rebuild.get("status") != "running":
            rebuild = start_storybook_rebuild(reason=f"job_preview:{job_id[:8]}")
        payload["rebuild"] = rebuild
        if rebuild.get("status") == "running":
            payload["reason"] = "static_rebuilding"
            payload["message"] = (
                "Rebuilding Storybook preview to include the new story "
                "(usually 1–3 minutes). This tab will refresh automatically."
            )
        elif rebuild.get("status") == "unavailable":
            payload["message"] = (
                (payload.get("message") or "")
                + " In-container rebuild unavailable: "
                + (rebuild.get("message") or rebuild.get("unavailableReason") or "")
                + " — rebuild/redeploy the Collab image with Storybook toolchain, "
                "or run scripts/build_collab_storybook_static.sh."
            )
        elif rebuild.get("status") == "error":
            payload["message"] = rebuild.get("message") or payload.get("message")
    else:
        payload["rebuild"] = get_rebuild_status()
    return payload


@app.get("/api/v1/preview/storybook/rebuild")
def preview_storybook_rebuild_status(actor: str = Depends(_actor_dep)) -> dict:
    _ = actor
    return get_rebuild_status()


@app.post("/api/v1/preview/storybook/rebuild")
def preview_storybook_rebuild_start(actor: str = Depends(_actor_dep)) -> dict:
    """Rebuild /storybook static so newly materialized stories appear in the iframe."""
    _ = actor
    return start_storybook_rebuild(reason="manual_api")


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


@app.post("/api/v1/update/jobs")
def create_update_job(
    body: CreateUpdateJobBody,
    request: Request,
    actor: str = Depends(_actor_dep),
) -> dict:
    """Catalogue Update — new ``update/{slug}-{short}`` branch + new PR."""
    if not body.confirmed:
        raise HTTPException(
            status_code=400,
            detail="confirmed must be true before creating an update job.",
        )
    if not (body.update.additional_prompt or "").strip() and not (
        body.update.additional_main_urls
        or body.update.additional_element_urls
        or body.update.additional_state_urls
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Provide an update prompt and/or additional Figma URLs "
                "before starting a catalogue Update session."
            ),
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
    try:
        from .github_catalog import file_exists_on_starting_ref

        programme = load_programme(settings.design_systems_dir, body.update.programme)
        intake_preview = build_preview(
            intake,
            programme,
            repo_root=settings.repo_root,
            design_systems_dir=settings.design_systems_dir,
            path_exists=file_exists_on_starting_ref,
        )
    except Exception:  # noqa: BLE001
        intake_preview = IntakePreviewResponse.model_validate(
            {
                **preview,
                "skill_route": preview.get("skill_route"),
                "spec_pattern": preview.get("spec_pattern"),
                "figma": preview.get("figma"),
            }
        )

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
            "theme_css_exists": True,
            "root_spec_exists": True,
            "programme_yaml_exists": True,
            "skip_figma_pack": preview.get("skip_figma_pack"),
            "skipFigmaPack": preview.get("skip_figma_pack"),
            "update_include_map": preview.get("update_include_map"),
            "updateIncludeMap": preview.get("update_include_map"),
            "update_skip_inheritance_registry": True,
            "baseline_source": "catalogue",
            "reviewer_feedback": preview.get("reviewer_feedback"),
            "notes": preview.get("notes"),
            "has_storybook": preview.get("has_storybook"),
        }
    )
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

    # Catalogue update always carries operator feedback for Bridge continuity
    if preview.get("reviewer_feedback"):
        prompt_dict.setdefault("additional_notes", preview["reviewer_feedback"])

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
    if preview.get("reviewer_feedback"):
        collab.prior_feedback = str(preview["reviewer_feedback"])
    session_store.save(collab)

    skip_figma = bool(preview.get("skip_figma_pack"))
    record.status = JobStatus.running
    record.result_summary = (
        "Packaging catalogue update (baselines only — Figma skipped)…"
        if skip_figma
        else "Packaging Figma evidence for update session…"
    )
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
            "skipFigmaPack": skip_figma,
            "includeMap": preview.get("update_include_map"),
            "publicBase": str(request.base_url),
        },
    )
    out = _job_public(record, include_session_url=True)
    out["message"] = (
        "Update job created. Copy the Bridge command once packaging finishes. "
        "Accept publishes a new update/… branch and PR."
    )
    out["agent_started"] = True
    out["skip_figma_pack"] = skip_figma
    return out


@app.post("/api/v1/update/preview")
def update_preview(body: UpdateRequest, actor: str = Depends(_actor_dep)) -> dict:
    """Preview catalogue Update routing (map reuse, Figma pack decision, paths)."""
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
            "skipFigmaPack": preview.get("skip_figma_pack"),
            "includeMap": preview.get("update_include_map"),
        },
    )
    return preview


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
def create_job(
    body: CreateJobBody,
    request: Request,
    actor: str = Depends(_actor_dep),
) -> dict:
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

    out = _job_public(record, include_session_url=True, request=request)
    out["message"] = (
        "Job created. Copy session_url into the client agent once; "
        "no further user intervention required until done."
    )
    out["agent_started"] = True
    return out


@app.get("/api/v1/intake/jobs/{job_id}")
def get_job(
    job_id: str,
    request: Request,
    actor: str = Depends(_actor_dep),
) -> dict:
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
    return _job_public(record, include_session_url=True, request=request)


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


@app.get("/api/v1/review/pull-requests")
def review_list_pull_requests(
    state: str = Query("open"),
    limit: int = Query(30, ge=1, le=100),
    slug: str | None = Query(None),
    actor: str = Depends(_actor_dep),
) -> dict:
    """List Design Spec Collab–generated PRs from the configured GitHub repo."""
    _ = actor
    jobs = []
    for j in job_store.list_jobs(limit=100):
        data = _job_public(j, include_session_url=False)
        data.pop("session_url", None)
        jobs.append(data)
    payload = list_collab_pull_requests(state=state, limit=limit, slug=slug, jobs=jobs)
    payload["actor"] = actor
    return payload


@app.post("/api/v1/review/pull-requests/{number}/import")
def review_import_pull_request(
    number: int,
    background_tasks: BackgroundTasks,
    actor: str = Depends(_actor_dep),
) -> dict:
    """Import allowlisted files from a Collab PR head into the preview workspace."""
    _ = actor
    logger.info("POST review import PR #%s (actor=%s)", number, actor)
    try:
        # Review uses filtered per-PR cache — never start shared /storybook rebuild.
        session = import_pull_request(number, start_rebuild=False)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    programme = session.get("programme")
    slug = session.get("slug")
    head_sha = session.get("headSha")
    if session.get("storiesPath") and programme and slug and head_sha:
        background_tasks.add_task(
            start_filtered_pr_preview_build,
            pr_number=int(number),
            head_sha=str(head_sha),
            programme=str(programme),
            slug=str(slug),
            force=False,
        )
        session["prPreview"] = {
            "status": "pending",
            "message": "Filtered PR Storybook preview will start after this response",
            "ready": False,
            "cacheKey": cache_key(int(number), str(head_sha)),
            "filtered": True,
        }
        session["rebuild"] = {
            "status": "idle",
            "message": "Shared /storybook rebuild skipped for Review (per-PR cache)",
        }
    return session


@app.get("/api/v1/review/pull-requests/{number}/import")
def review_import_pull_request_get_hint(number: int) -> dict:
    """Browser address-bar hits are GET — import requires POST from the Review UI."""
    raise HTTPException(
        status_code=405,
        detail=(
            f"PR #{number} import requires POST. Use Review → select the PR → "
            "**Load for review** (do not open this URL in the address bar)."
        ),
        headers={"Allow": "POST"},
    )

@app.get("/api/v1/review/sessions/{import_id}")
def review_get_session(import_id: str, actor: str = Depends(_actor_dep)) -> dict:
    _ = actor
    session = load_review_session(import_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Review session not found")
    session = dict(session)
    session["prPreview"] = refresh_pr_preview_status(session)
    return session


@app.get("/api/v1/review/sessions/{import_id}/design-spec")
def review_session_design_spec(
    import_id: str, actor: str = Depends(_actor_dep)
) -> dict:
    _ = actor
    session = load_review_session(import_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Review session not found")
    spec = read_review_design_spec(session)
    if spec is None:
        raise HTTPException(
            status_code=404,
            detail="No design-spec.md in this review import",
        )
    return {
        "importId": import_id,
        "programme": session.get("programme"),
        "slug": session.get("slug"),
        "prNumber": session.get("prNumber"),
        "htmlUrl": session.get("htmlUrl"),
        "design_spec": spec,
    }


@app.get("/api/v1/review/sessions/{import_id}/design-spec.md")
def review_session_design_spec_md(
    import_id: str, actor: str = Depends(_actor_dep)
) -> PlainTextResponse:
    _ = actor
    session = load_review_session(import_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Review session not found")
    spec = read_review_design_spec(session)
    if spec is None:
        raise HTTPException(status_code=404, detail="No design-spec.md")
    return PlainTextResponse(spec["content"], media_type="text/markdown; charset=utf-8")


@app.get("/api/v1/review/sessions/{import_id}/preview/storybook")
def review_session_storybook(
    import_id: str,
    background_tasks: BackgroundTasks,
    theme: str = Query("light"),
    t: str | None = Query(None),
    actor: str = Depends(_actor_dep),
) -> dict:
    """Review Storybook preview — per-PR filtered cache only (no shared /storybook)."""
    _ = actor
    session = load_review_session(import_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Review session not found")
    programme = str(session.get("programme") or "")
    slug = str(session.get("slug") or "")
    pr_num = session.get("prNumber")
    head_sha = session.get("headSha")
    theme_val = (theme or "light").strip().lower()
    if theme_val not in ("light", "dark"):
        theme_val = "light"

    base: dict = {
        "importId": import_id,
        "prNumber": pr_num,
        "htmlUrl": session.get("htmlUrl"),
        "programme": programme,
        "slug": slug,
        "theme": theme_val,
        "available": False,
        "managerUrl": "/storybook/index.html",
    }

    if not programme or not slug:
        return {
            **base,
            "reason": "missing_component",
            "message": (
                "Could not infer programme/slug from this PR. "
                "Open the PR on GitHub or Download bundle from the catalogue."
            ),
            "prPreview": refresh_pr_preview_status(session),
        }

    if not pr_num or not head_sha:
        return {
            **base,
            "reason": "missing_pr_head",
            "message": "Review session is missing PR number or head SHA.",
            "prPreview": {"status": "error", "ready": False},
        }

    key = cache_key(int(pr_num), str(head_sha))
    base["prStorybookCacheKey"] = key
    base["prHeadSha"] = head_sha

    from .storybook_preview import (
        export_name_to_story_name,
        list_story_exports,
        load_story_index,
        parse_meta_title,
        pick_fallback_export,
        resolve_stories_path,
        resolve_story_in_static,
        story_id_from_title_and_name,
    )

    stories_path = resolve_stories_path(
        settings.repo_root,
        programme,
        slug,
        extra_roots=[settings.app_root / "data" / "accepted_workspace"],
    )
    title = parse_meta_title(stories_path) if stories_path else None
    exports = list_story_exports(stories_path) if stories_path else []

    pr_st = get_build_status(key)
    base["prStorybook"] = pr_st
    base["prPreview"] = pr_st

    story_ready = False
    if is_build_ready(key):
        index = load_story_index(build_dir(key))
        found_chk = resolve_story_in_static(
            index,
            title=title,
            programme=programme,
            slug=slug,
            stories_path=stories_path,
        )
        story_ready = found_chk is not None

    if not story_ready and pr_st.get("status") != "running":
        background_tasks.add_task(
            start_filtered_pr_preview_build,
            pr_number=int(pr_num),
            head_sha=str(head_sha),
            programme=programme,
            slug=slug,
            force=bool(is_build_ready(key)),
        )
        msg = (
            f"Building filtered preview for PR #{pr_num} @ {str(head_sha)[:12]} "
            f"({programme}/{slug}) — usually under a minute."
        )
        pr_st = {
            **pr_st,
            "status": "pending",
            "message": msg,
            "ready": False,
            "filtered": True,
            "cacheKey": key,
        }
        base["prStorybook"] = pr_st
        base["prPreview"] = pr_st
        base["reason"] = "pr_storybook_building"
        base["message"] = msg
        if stories_path and title and exports:
            export = pick_fallback_export(exports)
            if export:
                base["storyName"] = export_name_to_story_name(export)
                base["storyId"] = story_id_from_title_and_name(title, base["storyName"])
        return base

    if pr_st.get("status") == "running" or not story_ready:
        base["reason"] = "pr_storybook_building"
        base["message"] = pr_st.get("message") or "Building filtered PR Storybook preview…"
        return base

    if pr_st.get("status") == "error" and not story_ready:
        base["reason"] = "pr_storybook_error"
        base["message"] = pr_st.get("message") or "PR preview build failed"
        return base

    index = load_story_index(build_dir(key))
    found = resolve_story_in_static(
        index,
        title=title,
        programme=programme,
        slug=slug,
        stories_path=stories_path,
    )
    if not found:
        background_tasks.add_task(
            start_filtered_pr_preview_build,
            pr_number=int(pr_num),
            head_sha=str(head_sha),
            programme=programme,
            slug=slug,
            force=True,
        )
        base["reason"] = "pr_storybook_building"
        base["message"] = (
            f"Refreshing filtered preview so {programme}/{slug} is included…"
        )
        base["prStorybook"] = {
            "status": "pending",
            "ready": False,
            "cacheKey": key,
            "filtered": True,
        }
        return base

    story_id, story_name, is_spec = found
    urls = preview_urls_for_build(key=key, story_id=str(story_id), theme=theme_val)
    if t:
        sep = "&" if "?" in urls["iframeUrl"] else "?"
        urls = {
            **urls,
            "iframeUrl": urls["iframeUrl"] + f"{sep}t={t}",
            "canvasUrl": urls["canvasUrl"] + f"{sep}t={t}",
        }

    note = (
        f"Per-PR preview (#{pr_num} @ {str(head_sha)[:12]}). "
        "Switching PRs uses a separate cache — shared /storybook is not used."
    )
    if not is_spec:
        note += f" Previewing `{story_name}` (no Spec Accurate Design export)."

    return {
        **base,
        "available": True,
        "reason": None,
        "message": note,
        "title": title,
        "storyId": story_id,
        "storyName": story_name,
        "hasSpecAccurateDesign": is_spec,
        "iframeUrl": urls["iframeUrl"],
        "canvasUrl": urls["canvasUrl"],
        "managerUrl": urls["managerUrl"],
        "storiesPath": str(stories_path) if stories_path else None,
        "staticReady": True,
        "prStorybook": {
            **pr_st,
            "ready": True,
            "status": "ready",
            "filtered": True,
            "message": note,
        },
        "prPreview": {
            **pr_st,
            "ready": True,
            "status": "ready",
            "filtered": True,
        },
    }



@app.post("/api/v1/review/sessions/{import_id}/revise")
def review_session_revise(
    import_id: str,
    body: ReviewReviseBody,
    request: Request,
    actor: str = Depends(_actor_dep),
) -> dict:
    """Start a Bridge job to revise the imported PR on its existing branch."""
    session = load_review_session(import_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Review session not found")
    if not body.confirmed:
        raise HTTPException(status_code=400, detail="confirmed must be true")

    try:
        preview = build_review_revise_preview(session, body)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    update_req = UpdateRequest(
        programme=str(session.get("programme")),
        componentSlug=str(session.get("slug")),
        additionalPrompt=body.feedback,
        storybookExamples=bool(preview.get("storybook_examples")),
    )
    intake = update_to_intake_request(update_req, preview)

    try:
        from .github_catalog import file_exists_on_starting_ref

        programme = load_programme(settings.design_systems_dir, update_req.programme)
        intake_preview = build_preview(
            intake,
            programme,
            repo_root=settings.repo_root,
            design_systems_dir=settings.design_systems_dir,
            path_exists=file_exists_on_starting_ref,
        )
    except Exception:  # noqa: BLE001
        intake_preview = IntakePreviewResponse.model_validate(
            {
                **preview,
                "skill_route": preview.get("skill_route"),
                "spec_pattern": preview.get("spec_pattern"),
                "figma": preview.get("figma"),
            }
        )

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
            "job_kind": "review_revise",
            "skill_route": preview.get("skill_route"),
            "spec_pattern": preview.get("spec_pattern"),
            "generate_theme_assets": False,
            "publish_target_branch": preview.get("publish_target_branch"),
            "publishTargetBranch": preview.get("publish_target_branch"),
            "pr_number": preview.get("pr_number"),
            "prNumber": preview.get("pr_number"),
            "head_sha": preview.get("head_sha"),
            "headSha": preview.get("head_sha"),
            "pr_html_url": preview.get("pr_html_url"),
            "htmlUrl": preview.get("pr_html_url"),
            "review_import_id": import_id,
            "reviewer_feedback": body.feedback,
            "baseline_source": "pr_head",
            "notes": preview.get("notes"),
        }
    )

    try:
        typed = IntakePreviewResponse.model_validate(intake_preview_dict)
        prompt = build_prompt_package(intake, typed, repo_root=settings.repo_root)
        prompt_dict = apply_collab_figma_overrides(
            prompt.model_dump(mode="json"), job_kind="review_revise"
        )
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=400, detail=f"Could not build review-revise prompt: {exc}"
        ) from exc

    session_yaml = build_session_yaml(intake, typed, job_id="pending")
    req_payload = review_revise_request_payload(session, body)
    record = job_store.create(
        request=req_payload,
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
        request=req_payload,
        job_kind="review_revise",
    )
    collab.prior_feedback = feedback_as_prior(body, session)
    session_store.save(collab)

    record.status = JobStatus.running
    record.result_summary = (
        f"Packaging review revise for PR #{session.get('prNumber')} "
        f"({session.get('programme')}/{session.get('slug')})…"
    )
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
        "review_revise_job_created",
        job_id=record.job_id,
        actor=actor,
        detail={
            "sessionId": collab.session_id,
            "importId": import_id,
            "prNumber": session.get("prNumber"),
            "headBranch": session.get("headBranch"),
            "programme": session.get("programme"),
            "slug": session.get("slug"),
        },
    )
    out = _job_public(record, include_session_url=True, request=request)
    out["message"] = (
        f"Review revise started for PR #{session.get('prNumber')} on "
        f"`{session.get('headBranch')}`. Copy the Bridge command — same as Generate."
    )
    out["agent_started"] = True
    out["importId"] = import_id
    out["prNumber"] = session.get("prNumber")
    out["headBranch"] = session.get("headBranch")
    out["job_kind"] = "review_revise"
    return out


@app.get("/api/v1/update/programmes/{programme}/components/{slug}/design-spec")
def catalogue_design_spec(
    programme: str,
    slug: str,
    actor: str = Depends(_actor_dep),
) -> dict:
    """Read design-spec.md for a catalogue component (local or GitHub fallback)."""
    _ = actor
    try:
        catalogue = list_update_components(programme)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    match = None
    for c in catalogue.get("components") or []:
        if isinstance(c, dict) and str(c.get("slug") or "").lower() == slug.lower():
            match = c
            break
    if match is None:
        raise HTTPException(
            status_code=404,
            detail=f"Component '{slug}' not found for programme '{programme}'",
        )
    path = str(match.get("designSpecPath") or f"components/{programme}/{slug}/design-spec.md")
    # Prefer accepted_workspace overlay (imported reviews) then repo
    content = None
    overlay = settings.app_root / "data" / "accepted_workspace" / path
    if overlay.is_file():
        try:
            content = overlay.read_text(encoding="utf-8")
        except OSError:
            content = None
    if content is None:
        content = read_repo_file(path)
    if content is None:
        raise HTTPException(
            status_code=404,
            detail=f"design-spec.md not found at {path}",
        )
    return {
        "programme": programme,
        "slug": slug,
        "displayName": match.get("displayName"),
        "path": path,
        "content": content,
        "charCount": len(content),
        "hasStorybook": bool(match.get("hasStorybook")),
    }


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


@app.post("/api/v1/intake/jobs/{job_id}/close-idle")
def close_idle_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    """B2: operator End after idle on a *finished* job — close session for follow-up.

    Does not cancel an in-flight job. Does not kill the Bridge OS process.
    """
    from datetime import datetime, timezone

    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Session not found")

    if collab.status in (
        SessionStatus.packaging,
        SessionStatus.awaiting_client,
        SessionStatus.reviewing,
    ):
        raise HTTPException(
            status_code=409,
            detail=(
                f"Cannot End while job is `{collab.status.value}` — "
                "idle End only applies after the job has finished."
            ),
        )

    if collab.operator_closed:
        return _job_public(record)

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    collab.operator_closed = True
    collab.operator_closed_at = now
    collab.client_requests = []
    collab.prior_feedback = None
    session_store.append_event(
        collab,
        kind="operator_closed",
        message=(
            f"Operator ended idle session ({actor}) — follow-ups closed. "
            "Start Generate or Review with a new Bridge command for new work."
        ),
        detail={"actor": actor},
    )
    session_store.save(collab)
    audit_log.write(
        "job_operator_closed_idle",
        job_id=job_id,
        actor=actor,
        detail={"sessionId": collab.session_id},
    )
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


@app.post("/api/v1/intake/jobs/{job_id}/publish/retry")
def retry_publish(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    """Retry GitHub PR publish after SSL/config fix (session must already be accepted)."""
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Collab session not found")
    if collab.status != SessionStatus.done:
        raise HTTPException(
            status_code=409,
            detail=f"Publish retry only after accept (status={collab.status.value})",
        )
    try:
        materialize_session_to_disk(collab)
    except Exception:  # noqa: BLE001
        logger.exception("materialize on publish retry failed")
    pub = publish_session(collab)
    collab.branch = pub.branch
    collab.pr_url = pub.pr_url
    collab.ide_checkout_hint = pub.ide_checkout_hint
    collab.published_files = pub.files
    collab.publish_error = pub.error
    collab.publish_dry_run = pub.dry_run
    session_store.save(collab)
    record.branch = pub.branch
    record.pr_url = pub.pr_url
    record.ide_checkout_hint = pub.ide_checkout_hint
    job_store.save(record)
    session_store.append_event(
        collab,
        kind="pr_failed" if pub.error else ("pr_dry_run" if pub.dry_run else "pr_created"),
        message=(
            f"Publish retry failed: {pub.error}"
            if pub.error
            else (
                f"Dry-run publish on {pub.branch}"
                if pub.dry_run
                else f"Opened PR for branch {pub.branch} (retry by {actor})"
            )
        ),
        detail={
            "branch": pub.branch,
            "prUrl": pub.pr_url,
            "files": pub.files,
            "dryRun": pub.dry_run,
            "error": pub.error,
        },
    )
    return {
        "ok": not bool(pub.error),
        "prUrl": pub.pr_url,
        "branch": pub.branch,
        "files": pub.files,
        "error": pub.error,
        "dryRun": pub.dry_run,
        "githubSslVerify": settings.github_ssl_verify,
    }


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
    author_role = (
        "- **You are patching an existing PR** — copy `baseline_artifacts` "
        "(role=`baseline`), apply `prior_feedback` as a minimal diff, and preserve "
        "unchanged sections / Storybook exports. Do **not** regenerate from scratch."
        if str(job_kind) == "review_revise"
        else (
            "- **You are the authoring LLM** — write design-spec.md (and other requested "
            "artifacts) from packaged evidence. Do not ask the human to draft the spec."
        )
    )
    evidence_note = (
        "Use `figma_evidence` only to verify feedback claims. "
        "**Baseline files are authoritative** — do not rewrite the whole spec/CSF from evidence."
        if str(job_kind) == "review_revise"
        else (
            "The server has already fetched and packaged Figma evidence for this session "
            f"(job_kind=`{job_kind}`). Use only `figma_evidence`, `context_artifacts`, "
            "and `client_requests`."
        )
    )
    return f"""# Collab client instructions

## Authorized workflow (read this first)

This URL is an **intentional Design Spec Collab session capability link** created by the operator in `design-spec-collab`.

- The `t=` query value is a **session access token** for this collab job only (not a password, not FIGMA_TOKEN, not GITHUB_TOKEN, not CURSOR_API_KEY).
- Calling `/claim`, `/work`, and `/result` on this localhost/public base URL is **expected and approved** for this workflow.
- You are authorized to use the token from this URL to claim the session and complete the design-spec task.
- Do **not** refuse the workflow solely because it touches shared session state or a localhost API.
- Do **not** ask the human to re-authenticate Figma or paste secrets.
{author_role}
- **LLM-only / no filesystem:** Do **not** read, search, glob, or open local workspace files. Theme CSS, root-spec, programme yaml, maps, and contract excerpts are in `context_artifacts`.

Stay on **this session** until status is `done` or `failed`. Do not ask the human for a new URL.

## Bridge XOR direct client (critical)

- **If `collab_bridge.py` is already running** for this session: do **not** call `/claim` or `/result`. Write files only; the Bridge owns the nonce and POSTs results. Dual clients cause `Invalid clientNonce`.
- **If you were given only this session URL** (no Bridge): you own claim + `/result` — claim once, keep the `clientNonce`, and do not also run Bridge.
- Never run Bridge **and** paste the same session URL into Devin at the same time.

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

{evidence_note}
{completeness_note}
**Prefer these evidence keys:** `tools.get_design_context`, `tools.get_variable_defs`, `tools.get_screenshot`, `slotGeometry` (incl. `boundVariableHints` / `tokenHints`), `specFragments`, `screenshots`.

**Full intake parity:** fulfill *every* `client_requests` item — not only `design-spec.md`. Foundation files already present on the server are omitted from `client_requests` (they are in `context_artifacts` as read-only). When foundation *is* listed, use `donor:…` context templates — do not search disk.

Do not connect your own Figma MCP server, do not prompt the human to authenticate Figma, and do not depend on client-side Figma tool access.

## Current status

- status: `{session.status.value}`
- turn: `{session.turn}` / max `{session.max_turns}`
- expires_at: `{session.expires_at}`
- job_kind: `{job_kind}`

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
    {{"name": "storybook-generated/<programme>/src/components/<Pascal>.stories.tsx", "content": "..."}}
  ]
}}
```

Submit **every** artifact listed in `client_requests`. Use full repo-relative paths as artifact `name` values. Partial submissions will be revised.
Do **not** submit `storybook/.storybook/main.ts` for normal Spec Accurate Design stories — discovery uses existing globs under `storybook-generated/*/`.
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
        force = bool(body and body.force)
        if not force:
            raise HTTPException(
                status_code=409,
                detail=(
                    "Session already claimed by another client. "
                    "Use Bridge XOR session-URL paste — not both. "
                    "Or POST /claim with {\"force\":true} to take over "
                    "(session token required), or use reset-claim from the UI job."
                ),
            )
        session_store.append_event(
            session,
            kind="claim_force",
            message=(
                f"Claim force-taken by {(body.client_label if body else None) or 'client'} "
                f"(was {session.client_label})"
            ),
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


@app.get("/api/v1/intake/jobs/{job_id}/bridge-command")
def bridge_command_for_job(
    job_id: str,
    request: Request,
    ai_cli: str = Query("devin", pattern="^(devin|stub)$"),
    actor: str = Depends(_actor_dep),
) -> dict:
    """Return the one-shot Bridge command for Copy-to-clipboard UX."""
    _ = actor
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Job not found")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Session not found")
    public_base = _effective_public_base(request)
    cmd = collab.bridge_command(public_base, ai_cli=ai_cli)
    return {
        "job_id": job_id,
        "session_id": collab.session_id,
        "session_url": collab.session_url(public_base),
        "bridge_command": cmd,
        "ai_cli": ai_cli,
        "script_url": f"{public_base}/bridge/collab_bridge.py",
        "hint": (
            "Run in a terminal on your machine. Outbound HTTPS only. "
            "Keep the process running for revise + chat follow-ups. "
            "Use --ai-cli stub for demos without Devin."
        ),
    }


@app.post("/api/v1/intake/jobs/{job_id}/chat")
def chat_follow_up(
    job_id: str,
    body: ChatBody,
    actor: str = Depends(_actor_dep),
) -> dict:
    """Enqueue a designer follow-up for the Bridge Agent's next /work turn."""
    from datetime import datetime, timezone

    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Job not found")
    collab = session_store.get_by_job(job_id)
    if collab is None:
        raise HTTPException(status_code=404, detail="Session not found")

    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="message required")

    if collab.status in (SessionStatus.cancelled, SessionStatus.failed):
        raise HTTPException(
            status_code=409,
            detail=f"Cannot chat when session is {collab.status.value}",
        )
    if collab.operator_closed:
        raise HTTPException(
            status_code=409,
            detail=(
                "This finished session was closed (idle End). "
                "Start a new Generate or Review revise session."
            ),
        )
    if collab.status == SessionStatus.packaging:
        raise HTTPException(
            status_code=409, detail="Session still packaging — try again shortly"
        )
    if collab.status == SessionStatus.reviewing:
        raise HTTPException(
            status_code=409,
            detail="Server is reviewing — wait, then send follow-up",
        )

    preview = collab.preview or {}
    design_path = (
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or "design-spec.md"
    )

    # Re-open a finished session for follow-up authorship (Bridge still running
    # or re-run command after claim cleared if heartbeat is stale).
    if collab.status == SessionStatus.done:
        collab.max_turns = max(collab.max_turns, collab.turn + 2)
        collab.turn += 1
        record.status = JobStatus.running
        job_store.save(record)

    # If Bridge looks offline, clear claim so a fresh Bridge run can claim again.
    stale = True
    if collab.bridge_last_heartbeat_at:
        try:
            hb = datetime.strptime(
                collab.bridge_last_heartbeat_at, "%Y-%m-%dT%H:%M:%SZ"
            ).replace(tzinfo=timezone.utc)
            stale = (datetime.now(timezone.utc) - hb).total_seconds() > 120
        except ValueError:
            stale = True
    if stale and collab.client_nonce:
        collab.client_nonce = None
        collab.client_label = None
        collab.claimed_at = None
        session_store.append_event(
            collab,
            kind="claim_reset",
            message="Claim cleared for chat follow-up (Bridge heartbeat stale)",
        )

    collab.prior_feedback = (
        f"Designer follow-up from Collab chat: {message}"
        + (f"\n\n(previous) {collab.prior_feedback}" if collab.prior_feedback else "")
    )
    collab.client_requests = [
        ClientRequest(
            id=f"req-chat-{collab.turn}-{secrets.token_hex(3)}",
            kind="follow_up",
            instruction=(
                "Apply this designer follow-up from the Collab chat UI. "
                "Update all required artifacts as needed. "
                f"Follow-up: {message}"
            ),
            expected_artifact=design_path,
        )
    ]
    collab.status = SessionStatus.awaiting_client
    session_store.append_event(
        collab,
        kind="follow_up",
        message=f"Follow-up queued from {actor}: {message[:240]}",
        detail={"actor": actor},
    )
    session_store.append_event(
        collab,
        kind="awaiting_client",
        message=(
            "Follow-up waiting for Bridge — keep the Bridge terminal running; "
            "next /work will include this request."
        ),
    )
    return _job_public(record)


@app.post("/api/v1/sessions/{session_id}/heartbeat")
def session_heartbeat(
    session_id: str,
    body: HeartbeatBody | None = None,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    """Bridge Agent heartbeat so the Collab UI can show connected status."""
    from datetime import datetime, timezone

    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    session.bridge_last_heartbeat_at = now
    if body and body.client_label:
        session.bridge_label = body.client_label
    elif session.client_label and not session.bridge_label:
        session.bridge_label = session.client_label
    if body and body.progress is not None:
        session.bridge_progress = (body.progress or "").strip() or None
    session_store.save(session)
    return {
        "ok": True,
        "session_id": session.session_id,
        "bridge_last_heartbeat_at": session.bridge_last_heartbeat_at,
        "bridge_label": session.bridge_label,
        "bridge_progress": session.bridge_progress,
        "status": session.status.value,
    }


@app.get("/bridge/collab_bridge.py")
def download_bridge_script() -> Response:
    """Serve the one-shot Bridge script (stdlib Python) for curl | python flows."""
    if not BRIDGE_SCRIPT.is_file():
        raise HTTPException(
            status_code=404,
            detail="Bridge script not packaged in this deployment",
        )
    content = BRIDGE_SCRIPT.read_text(encoding="utf-8")
    return Response(
        content=content,
        media_type="text/x-python; charset=utf-8",
        headers={
            "Content-Disposition": 'inline; filename="collab_bridge.py"',
            "Cache-Control": "no-cache",
        },
    )


@app.get("/api/v1/sessions/{session_id}/work")
def get_work(
    session_id: str,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)
    work = _work_payload(session)
    if session.operator_closed:
        work["operator_closed"] = True
        work["status"] = "closed"
        work["client_requests"] = []
        work["message"] = (
            "Operator closed this finished session (idle End). "
            "Stop Bridge for this URL; start a new Generate/Review session for new work."
        )
    return work


@app.post("/api/v1/sessions/{session_id}/result")
def post_result(
    session_id: str,
    body: ClientResultBody,
    t: str | None = Query(default=None),
    x_session_token: str | None = Header(default=None, alias="X-Session-Token"),
):
    token = _extract_token(t, x_session_token)
    session = _load_session_authed(session_id, token)

    if session.operator_closed:
        raise HTTPException(
            status_code=409,
            detail="Session closed by operator (idle End) — start a new session",
        )

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

        # Persist accepted files locally (preview path + data mount) then publish PR
        try:
            materialize_session_to_disk(session)
        except Exception:  # noqa: BLE001
            logger.exception("materialize_session_to_disk failed")

        # Refresh /storybook static so Generate → Storybook tab works without image redeploy
        has_stories = any(
            (a.name or "").endswith(".stories.tsx")
            or "storybook-generated/" in (a.name or "").replace("\\", "/")
            for a in (session.artifacts or [])
        )
        if has_stories:
            start_storybook_rebuild(reason=f"accept:{session.session_id[:8]}")

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
                kind = session.job_kind or "create"
                is_revise = kind == "review_revise"
                if pub.dry_run:
                    ev_kind = "pr_dry_run"
                    ev_msg = f"Dry-run publish on branch `{pub.branch}` (no GitHub write)."
                elif is_revise:
                    ev_kind = "pr_updated"
                    ev_msg = (
                        f"PR updated on branch `{pub.branch}`"
                        + (f" — {pub.pr_url}" if pub.pr_url else "")
                    )
                else:
                    ev_kind = "pr_created"
                    ev_msg = (
                        f"Pull request created for branch `{pub.branch}`"
                        + (f" — {pub.pr_url}" if pub.pr_url else "")
                    )
                session_store.append_event(
                    session,
                    kind=ev_kind,
                    message=ev_msg,
                    detail={
                        "branch": pub.branch,
                        "prUrl": pub.pr_url,
                        "files": pub.files,
                        "dryRun": pub.dry_run,
                        "jobKind": kind,
                    },
                )
                # Filtered component Storybook (not shared catalogue).
                if has_stories:
                    try:
                        prog = str(
                            (session.preview or {}).get("programme") or ""
                        )
                        slug = str((session.preview or {}).get("slug") or "")
                        pr_n = parse_pr_number(pub.pr_url) if pub.pr_url else None
                        if pr_n is None:
                            pr_n = (session.preview or {}).get("pr_number") or (
                                session.preview or {}
                            ).get("prNumber")
                        sha = None
                        if pr_n is not None and pub.pr_url and not pub.dry_run:
                            try:
                                sha = resolve_pr_head(int(pr_n)).get("headSha")
                            except Exception:  # noqa: BLE001
                                sha = None
                        build_pr = int(pr_n) if pr_n is not None else 0
                        build_sha = (
                            (sha or "").strip()
                            or f"job-{session.job_id.replace('-', '')[:12]}"
                        )
                        if prog and slug:
                            start_filtered_pr_preview_build(
                                pr_number=build_pr,
                                head_sha=build_sha,
                                programme=prog,
                                slug=slug,
                                force=True,
                            )
                            # So job/review Storybook preview resolves the new SHA
                            # without waiting for a manual re-import / full page reload.
                            try:
                                prev = dict(session.preview or {})
                                prev["pr_number"] = build_pr
                                prev["prNumber"] = build_pr
                                prev["head_sha"] = build_sha
                                prev["headSha"] = build_sha
                                session.preview = prev
                                session_store.save(session)
                            except Exception:  # noqa: BLE001
                                logger.exception(
                                    "Could not persist Storybook head SHA on session"
                                )
                            session_store.append_event(
                                session,
                                kind="storybook_refresh",
                                message=(
                                    f"Refreshing filtered Storybook preview for "
                                    f"{prog}/{slug}…"
                                ),
                                detail={
                                    "prNumber": build_pr,
                                    "headSha": build_sha,
                                },
                            )
                    except Exception:  # noqa: BLE001
                        logger.exception("Filtered Storybook build kick failed")

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


def _storybook_missing_html() -> HTMLResponse:
    configured = (
        str(settings.storybook_static_dir) if settings.storybook_static_dir else "(unset)"
    )
    body = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/><title>Storybook preview missing</title>
<style>body{{font-family:system-ui,sans-serif;max-width:42rem;margin:2rem auto;padding:0 1rem;line-height:1.45}}
code{{background:#f4f4f5;padding:.1rem .35rem;border-radius:4px}}</style></head>
<body>
<h1>Storybook static build not found</h1>
<p>Collab serves Spec Accurate Design from <code>/app/storybook-static</code> inside the Docker image.
This server has no usable <code>index.html</code> / <code>iframe.html</code> there.</p>
<ul>
<li>Check <code>GET /health</code> → <code>storybookPreview.staticReady</code> (should be <code>true</code>).</li>
<li>Rebuild/redeploy the image with monorepo context (see <code>scripts/export-image.sh</code>) — do not use <code>docker import</code>.</li>
<li>On the server, do not set <code>STORYBOOK_STATIC_DIR</code> to a host path that does not exist in the container.</li>
<li>Probe: <code>/storybook/index.html</code></li>
</ul>
<p>Configured dir: <code>{configured}</code></p>
</body></html>"""
    return HTMLResponse(body, status_code=503)


@app.get("/storybook", response_model=None)
@app.get("/storybook/", response_model=None)
def storybook_shell() -> FileResponse | HTMLResponse:
    """Prefer real index.html so remote proxies do not 404 on directory URLs."""
    if _storybook_static is None:
        return _storybook_missing_html()
    index = _storybook_static / "index.html"
    if not index.is_file():
        return _storybook_missing_html()
    return FileResponse(index, media_type="text/html")


if _storybook_static is not None:
    app.mount(
        "/storybook",
        StaticFiles(directory=str(_storybook_static), html=True),
        name="storybook-static",
    )
    logging.getLogger(__name__).info(
        "Storybook static mounted at /storybook from %s", _storybook_static
    )
else:
    logging.getLogger(__name__).warning(
        "Storybook static NOT found (configured=%s app_root=%s) — /storybook will return 503",
        settings.storybook_static_dir,
        settings.app_root,
    )

# Per-PR Storybook builds (SHA-cached). Tab switches reuse these directories.
_pr_builds = builds_root()
app.mount(
    "/storybook-pr",
    StaticFiles(directory=str(_pr_builds), html=True),
    name="storybook-pr-builds",
)
logging.getLogger(__name__).info(
    "PR Storybook builds mounted at /storybook-pr from %s", _pr_builds
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
