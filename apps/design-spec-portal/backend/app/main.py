"""Design Spec Portal — Phase 4 (PR + zip) + Phase 3 guardrails."""

from __future__ import annotations

from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, Response
from fastapi.staticfiles import StaticFiles

from .config import settings
from .models.intake import InheritsIds, IntakeRequest, IntakePreviewResponse
from .models.jobs import CreateJobBody, CreateJobResponse, JobRecord, JobStatus
from .services.agent_runner import cloud_agent_configured, request_cancel
from .services.artifacts import build_artifacts_zip
from .services.audit import AuditLog
from .services.auth_placeholder import auth_status, resolve_actor
from .services.github_api import (
    github_configured,
    list_branches,
    parse_github_repo,
    starting_ref_status,
)
from .services.job_runner import start_job_in_background
from .services.job_store import JobStore
from .services.programmes import list_programmes, load_programme
from .services.prompt_builder import build_prompt_package, build_session_yaml
from .services.repo_lock import repo_lock_status
from .services.secrets import public_job_dict
from .services.skill_router import build_preview

APP_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = APP_DIR / "frontend"

app = FastAPI(
    title="Design Spec Portal",
    version="0.4.0",
    description="Phase 4: PR + artifact zip; Phase 3 cloud agent + guardrails.",
)

job_store = JobStore(settings.jobs_dir, settings.sessions_dir)
audit_log = AuditLog(settings.audit_log_path)


def _actor_dep(request: Request) -> str:
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


def _job_response(record: JobRecord) -> dict:
    return public_job_dict(record.model_dump(mode="json"))


@app.get("/health")
def health() -> dict:
    ok, missing = cloud_agent_configured()
    gh_ok, gh_missing = github_configured()
    gh = parse_github_repo()
    # Validate CLOUD_STARTING_REF against GitHub when token is available
    starting = starting_ref_status() if gh_ok else {
        "startingRef": settings.cloud_starting_ref,
        "checked": False,
        "exists": None,
        "defaultBranch": None,
        "repo": gh.full_name if gh else None,
        "error": "Skipped — set GITHUB_TOKEN to verify branches",
    }
    return {
        "status": "ok",
        "phase": "4",
        "jobsDir": str(settings.jobs_dir),
        "sessionsDir": str(settings.sessions_dir),
        "cloudAgentConfigured": ok,
        "cloudAgentMissing": missing,
        "cloudAgentDryRun": settings.cloud_agent_dry_run,
        "cloudAutoCreatePr": settings.cloud_auto_create_pr,
        "cloudStartingRef": settings.cloud_starting_ref,
        "cloudStartingRefStatus": starting,
        "cursorModel": settings.cursor_model,
        "auth": auth_status(),
        "repoLock": repo_lock_status(),
        "github": {
            "configured": gh_ok,
            "missing": gh_missing,
            "repo": gh.full_name if gh else None,
            "startingRefExists": starting.get("exists"),
            "defaultBranch": starting.get("defaultBranch"),
        },
        "secretsConfigured": {
            "cursorApiKey": bool(settings.cursor_api_key),
            "figmaToken": bool(settings.figma_token),
            "githubToken": bool(settings.github_token),
        },
    }


@app.get("/api/v1/github/branches")
def github_branches(
    actor: str = Depends(_actor_dep),
    limit: int = 100,
) -> dict:
    """List branches on CLOUD_REPO_URL and report whether CLOUD_STARTING_REF exists."""
    ok, missing = github_configured()
    if not ok:
        raise HTTPException(
            status_code=400,
            detail=f"GitHub not configured. Missing: {', '.join(missing)}",
        )
    try:
        repo = parse_github_repo()
        assert repo is not None
        names = list_branches(repo, per_page=min(max(limit, 1), 100))
        starting = starting_ref_status()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {
        "repo": repo.full_name,
        "defaultBranch": starting.get("defaultBranch"),
        "startingRef": starting.get("startingRef"),
        "startingRefExists": starting.get("exists"),
        "branches": names,
        "branchCount": len(names),
        "actor": actor,
        "error": starting.get("error"),
    }


@app.get("/api/v1/programmes")
def programmes(actor: str = Depends(_actor_dep)) -> dict:
    return {"programmes": list_programmes(settings.design_systems_dir), "actor": actor}


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
    session = build_session_yaml(intake, preview, job_id="pending")
    record = job_store.create(
        request=intake.model_dump(by_alias=True, mode="json"),
        preview=preview.model_dump(mode="json"),
        prompt_package=prompt.model_dump(mode="json"),
        session=session,
        actor=actor,
        locked_repo_url=settings.cloud_repo_url,
    )

    audit_log.write(
        "job_created",
        job_id=record.job_id,
        actor=actor,
        detail={
            "programme": preview.programme,
            "slug": preview.slug,
            "skillRoute": preview.skill_route.value,
            "lockedRepoUrl": record.locked_repo_url,
        },
    )

    should_start = (
        settings.cloud_agent_auto_start
        if body.start_agent is None
        else body.start_agent
    )
    agent_started = False
    message = "Job created (pending)."
    if should_start:
        ok, missing = cloud_agent_configured()
        if not ok:
            record.status = JobStatus.error
            record.error_message = (
                "Cannot start cloud agent. Missing env: " + ", ".join(missing)
            )
            job_store.save(record)
            message = record.error_message
            audit_log.write(
                "agent_error",
                job_id=record.job_id,
                actor=actor,
                detail={"error": message, "startupFailure": True},
            )
        else:
            agent_started = start_job_in_background(
                job_store, record.job_id, audit=audit_log, actor=actor
            )
            record = job_store.get(record.job_id) or record
            if record.status == JobStatus.pending and agent_started:
                record.status = JobStatus.running
                job_store.save(record)
            message = (
                "Cloud agent started (dry-run)."
                if settings.cloud_agent_dry_run
                else "Cloud agent started."
            )

    resp = CreateJobResponse(
        job_id=record.job_id,
        status=record.status,
        preview=preview,
        prompt_package=prompt,
        session_path=record.session_path,
        agent_started=agent_started,
        message=message,
    )
    out = resp.model_dump(mode="json")
    out["prompt_package"] = public_job_dict(
        {"prompt_package": out["prompt_package"]}
    )["prompt_package"]
    return out


@app.post("/api/v1/intake/jobs/{job_id}/run")
def run_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    if record.status == JobStatus.running:
        return _job_response(record)
    if record.status == JobStatus.cancelled and record.cancel_requested:
        record.cancel_requested = False

    ok, missing = cloud_agent_configured()
    if not ok:
        raise HTTPException(
            status_code=400,
            detail=f"Cloud agent not configured. Missing: {', '.join(missing)}",
        )

    started = start_job_in_background(
        job_store, job_id, audit=audit_log, actor=actor
    )
    record = job_store.get(job_id) or record
    if record.status in (
        JobStatus.pending,
        JobStatus.error,
        JobStatus.finished,
        JobStatus.cancelled,
    ):
        record.status = JobStatus.running
        record.error_message = None
        record.actor = actor
        job_store.save(record)
    audit_log.write(
        "agent_run_requested",
        job_id=job_id,
        actor=actor,
        detail={"started": started},
    )
    return _job_response(job_store.get(job_id) or record)


@app.post("/api/v1/intake/jobs/{job_id}/cancel")
def cancel_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")

    if record.status in (JobStatus.finished, JobStatus.error, JobStatus.cancelled):
        return _job_response(record)

    record.cancel_requested = True
    if record.status == JobStatus.pending:
        record.status = JobStatus.cancelled
        record.error_message = "Cancelled before start"
        job_store.save(record)
        audit_log.write(
            "agent_cancelled",
            job_id=job_id,
            actor=actor,
            detail={"phase": "pending"},
        )
        return _job_response(record)

    request_cancel(job_id)
    job_store.save(record)
    audit_log.write(
        "agent_cancel_requested",
        job_id=job_id,
        actor=actor,
        detail={"status": record.status.value},
    )
    return _job_response(record)


@app.get("/api/v1/intake/jobs/{job_id}")
def get_job(job_id: str, actor: str = Depends(_actor_dep)) -> dict:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    return _job_response(record)


@app.get("/api/v1/intake/jobs/{job_id}/artifacts.zip")
def download_artifacts(job_id: str, actor: str = Depends(_actor_dep)) -> Response:
    record = job_store.get(job_id)
    if record is None:
        raise HTTPException(status_code=404, detail=f"Job not found: {job_id}")
    if record.status != JobStatus.finished:
        raise HTTPException(
            status_code=409,
            detail=f"Job is not finished (status={record.status.value}).",
        )
    try:
        data, included = build_artifacts_zip(record)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=502, detail=f"Failed to build artifacts zip: {exc}"
        ) from exc

    slug = (record.preview or {}).get("slug") or "component"
    filename = f"design-spec-{slug}-{job_id[:8]}.zip"
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


@app.get("/api/v1/intake/jobs")
def list_jobs(limit: int = 50, actor: str = Depends(_actor_dep)) -> dict:
    return {
        "jobs": [_job_response(j) for j in job_store.list_jobs(limit=limit)],
        "actor": actor,
    }


@app.get("/api/v1/audit")
def get_audit(limit: int = 100, actor: str = Depends(_actor_dep)) -> dict:
    return {"events": audit_log.read_tail(limit=limit), "actor": actor}


_assets = FRONTEND_DIR / "assets"
if FRONTEND_DIR.is_dir() and _assets.is_dir():
    app.mount("/assets", StaticFiles(directory=_assets), name="assets")

    @app.get("/")
    def index() -> FileResponse:
        return FileResponse(FRONTEND_DIR / "index.html")
