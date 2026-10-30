"""Cursor Cloud agent runner (Phase 3) with cancel + repo lock."""

from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass
from typing import Any, Callable

from ..config import settings
from .repo_lock import assert_repo_lock
from .secrets import redact_text

logger = logging.getLogger(__name__)

_active_lock = threading.Lock()
# job_id -> cancel callback / run handle metadata
_active: dict[str, dict[str, Any]] = {}
_cancel_flags: dict[str, bool] = {}


@dataclass
class AgentRunOutcome:
    agent_id: str | None
    run_id: str | None
    status: str  # finished | error | cancelled
    result_summary: str | None = None
    error_message: str | None = None
    startup_failure: bool = False
    dry_run: bool = False
    locked_repo_url: str | None = None
    branch: str | None = None
    pr_url: str | None = None
    ide_checkout_hint: str | None = None


def _git_from_result(result: Any, *, locked_url: str | None) -> tuple[str | None, str | None, str | None]:
    """Extract (branch, pr_url, ide_checkout_hint) from RunResult.git."""
    git = getattr(result, "git", None)
    if not git:
        return None, None, None
    branches = list(getattr(git, "branches", None) or [])
    if not branches:
        return None, None, None
    # Prefer first branch that matches locked repo, else first entry
    chosen = branches[0]
    if locked_url:
        for b in branches:
            repo = (getattr(b, "repo_url", None) or "").rstrip("/")
            lock = locked_url.rstrip("/").removesuffix(".git")
            if lock in repo or repo in lock or repo.rstrip(".git") == lock:
                chosen = b
                break
    branch = getattr(chosen, "branch", None) or None
    pr_url = getattr(chosen, "pr_url", None) or None
    hint = None
    if branch:
        hint = (
            f"git fetch origin && git checkout {branch}\n"
            f"# Fine-tune in Cursor IDE on this branch, then push / open PR as needed."
        )
        if pr_url:
            hint += f"\n# PR: {pr_url}"
    return branch, pr_url, hint


def _outcome_with_git(
    *,
    agent_id: str | None,
    run_id: str | None,
    status: str,
    result: Any | None = None,
    result_summary: str | None = None,
    error_message: str | None = None,
    startup_failure: bool = False,
    dry_run: bool = False,
    locked_repo_url: str | None = None,
    branch: str | None = None,
    pr_url: str | None = None,
    ide_checkout_hint: str | None = None,
) -> AgentRunOutcome:
    if result is not None and branch is None:
        branch, pr_url, ide_checkout_hint = _git_from_result(
            result, locked_url=locked_repo_url
        )
    return AgentRunOutcome(
        agent_id=agent_id,
        run_id=run_id,
        status=status,
        result_summary=result_summary,
        error_message=error_message,
        startup_failure=startup_failure,
        dry_run=dry_run,
        locked_repo_url=locked_repo_url,
        branch=branch,
        pr_url=pr_url,
        ide_checkout_hint=ide_checkout_hint,
    )


def cloud_agent_configured() -> tuple[bool, list[str]]:
    missing: list[str] = []
    if settings.cloud_agent_dry_run:
        return True, []
    if not settings.cursor_api_key:
        missing.append("CURSOR_API_KEY")
    if not settings.cloud_repo_url:
        missing.append("CLOUD_REPO_URL")
    if not settings.figma_token:
        missing.append("FIGMA_TOKEN")
    return (len(missing) == 0), missing


def request_cancel(job_id: str) -> bool:
    """Mark job cancelled and invoke active run.cancel() when available."""
    with _active_lock:
        _cancel_flags[job_id] = True
        meta = _active.get(job_id)
    if not meta:
        return True
    cancel_fn: Callable[[], None] | None = meta.get("cancel")
    if cancel_fn:
        try:
            cancel_fn()
            return True
        except Exception as exc:  # noqa: BLE001
            logger.warning("Cancel invoke failed for %s: %s", job_id, redact_text(str(exc)))
            return False
    return True


def is_cancel_requested(job_id: str) -> bool:
    with _active_lock:
        return bool(_cancel_flags.get(job_id))


def clear_cancel_state(job_id: str) -> None:
    with _active_lock:
        _cancel_flags.pop(job_id, None)
        _active.pop(job_id, None)


def _register_active(job_id: str, *, cancel: Callable[[], None] | None = None) -> None:
    with _active_lock:
        _active[job_id] = {"cancel": cancel}


def run_cloud_agent(prompt_text: str, *, job_id: str) -> AgentRunOutcome:
    """Start a Cursor Cloud agent with Figma MCP and wait for the run."""
    ok, missing = cloud_agent_configured()
    if not ok:
        return AgentRunOutcome(
            agent_id=None,
            run_id=None,
            status="error",
            error_message=f"Cloud agent not configured. Missing: {', '.join(missing)}",
            startup_failure=True,
        )

    try:
        if settings.cloud_agent_dry_run and not settings.cloud_repo_url:
            locked_url = "(dry-run: CLOUD_REPO_URL unset)"
        else:
            locked_url = assert_repo_lock()
    except ValueError as exc:
        return AgentRunOutcome(
            agent_id=None,
            run_id=None,
            status="error",
            error_message=str(exc),
            startup_failure=True,
        )

    if settings.cloud_agent_dry_run:
        logger.info("CLOUD_AGENT_DRY_RUN for job %s repo=%s", job_id, locked_url)
        _register_active(job_id)
        total = min(max(settings.cloud_agent_dry_run_seconds, 0.1), 10.0)
        steps = max(int(total / 0.2), 1)
        for _ in range(steps):
            if is_cancel_requested(job_id):
                clear_cancel_state(job_id)
                return AgentRunOutcome(
                    agent_id=f"dry-agent-{job_id[:8]}",
                    run_id=f"dry-run-{job_id[:8]}",
                    status="cancelled",
                    result_summary="[dry-run] Cancelled before completion.",
                    dry_run=True,
                    locked_repo_url=locked_url,
                )
            time.sleep(total / steps)
        clear_cancel_state(job_id)
        dry_branch = f"design-spec-portal/{job_id[:8]}"
        dry_pr = None
        hint = (
            f"git fetch origin && git checkout {dry_branch}\n"
            "# (dry-run sample branch name — real cloud runs return the agent branch)"
        )
        if settings.cloud_auto_create_pr:
            # Sample PR URL shape for UI testing (not a real PR)
            from .github_api import parse_github_repo

            gh = parse_github_repo(locked_url if locked_url.startswith("http") else None)
            if gh:
                dry_pr = f"https://github.com/{gh.full_name}/pull/0-dry-run"
                hint += f"\n# PR (dry-run placeholder): {dry_pr}"
        return AgentRunOutcome(
            agent_id=f"dry-agent-{job_id[:8]}",
            run_id=f"dry-run-{job_id[:8]}",
            status="finished",
            result_summary=(
                "[dry-run] Skipped Cursor Cloud. Prompt package was built; "
                "set CLOUD_AGENT_DRY_RUN=false with CURSOR_API_KEY, CLOUD_REPO_URL, "
                "FIGMA_TOKEN to run for real."
            ),
            dry_run=True,
            locked_repo_url=locked_url,
            branch=dry_branch,
            pr_url=dry_pr,
            ide_checkout_hint=hint,
        )

    try:
        from cursor_sdk import (
            Agent,
            AgentOptions,
            CloudAgentOptions,
            CloudRepository,
            CursorAgentError,
            HttpMcpServerConfig,
        )
    except ImportError as exc:
        return AgentRunOutcome(
            agent_id=None,
            run_id=None,
            status="error",
            error_message=f"cursor-sdk not installed: {exc}",
            startup_failure=True,
        )

    mcp_servers: dict[str, Any] = {
        "figma": HttpMcpServerConfig(
            url=settings.figma_mcp_url,
            type="http",
            headers={"Authorization": f"Bearer {settings.figma_token}"},
        ),
    }

    # Normalize repo URL (Cursor sometimes prefers without trailing .git)
    cloud_url = locked_url.rstrip("/")
    if cloud_url.endswith(".git"):
        cloud_url_alt = cloud_url[: -len(".git")]
    else:
        cloud_url_alt = cloud_url

    starting_meta: dict[str, Any] = {"startingRef": settings.cloud_starting_ref}
    try:
        from .github_api import resolve_cloud_starting_ref

        starting_meta = resolve_cloud_starting_ref()
        if starting_meta.get("portalSeesBranch") is False:
            return AgentRunOutcome(
                agent_id=None,
                run_id=None,
                status="error",
                error_message=redact_text(
                    "CLOUD_STARTING_REF not found on GitHub via GITHUB_TOKEN: "
                    + str(starting_meta.get("error") or starting_meta.get("startingRef"))
                ),
                startup_failure=True,
                locked_repo_url=locked_url,
            )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Could not pre-resolve starting ref: %s", exc)

    resolved_ref = str(
        starting_meta.get("resolvedRef") or settings.cloud_starting_ref or "master"
    )

    try:
        # mcp_servers lives on AgentOptions (not a top-level Agent.create kwarg).
        options = AgentOptions(
            model=settings.cursor_model,
            api_key=settings.cursor_api_key,
            name=f"design-spec-portal:{job_id[:8]}",
            cloud=CloudAgentOptions(
                repos=[
                    CloudRepository(
                        url=cloud_url_alt or cloud_url,
                        starting_ref=resolved_ref,
                    )
                ],
                auto_create_pr=settings.cloud_auto_create_pr,
                skip_reviewer_request=True,
            ),
            mcp_servers=mcp_servers,
        )
        with Agent.create(options) as agent:
            agent_id = getattr(agent, "agent_id", None) or None
            run = agent.send(prompt_text)
            run_id = getattr(run, "id", None) or None

            def _cancel() -> None:
                if hasattr(run, "supports") and run.supports("cancel"):
                    run.cancel()
                elif hasattr(run, "cancel"):
                    run.cancel()

            _register_active(job_id, cancel=_cancel)

            if is_cancel_requested(job_id):
                try:
                    _cancel()
                except Exception:  # noqa: BLE001
                    pass
                clear_cancel_state(job_id)
                return AgentRunOutcome(
                    agent_id=agent_id,
                    run_id=run_id,
                    status="cancelled",
                    result_summary="Cancel requested before wait.",
                    locked_repo_url=locked_url,
                )

            # Poll wait with cancel — SDK wait blocks; prefer wait() then check flag
            # For long runs, cancel() from another thread is the mechanism.
            result = run.wait()
            if is_cancel_requested(job_id):
                clear_cancel_state(job_id)
                return AgentRunOutcome(
                    agent_id=agent_id or result.agent_id,
                    run_id=run_id or result.id,
                    status="cancelled",
                    result_summary=redact_text((result.result or "")[:4000]),
                    locked_repo_url=locked_url,
                )

            status_val = getattr(result.status, "value", None) or str(result.status)
            status_norm = str(status_val).lower()
            clear_cancel_state(job_id)
            summary = redact_text((result.result or "")[:4000])
            if status_norm in ("finished", "completed", "success", "ok"):
                return _outcome_with_git(
                    agent_id=agent_id or result.agent_id,
                    run_id=run_id or result.id,
                    status="finished",
                    result=result,
                    result_summary=summary,
                    locked_repo_url=locked_url,
                )
            if status_norm in ("cancelled", "canceled"):
                return _outcome_with_git(
                    agent_id=agent_id or result.agent_id,
                    run_id=run_id or result.id,
                    status="cancelled",
                    result=result,
                    result_summary=summary,
                    locked_repo_url=locked_url,
                )
            return _outcome_with_git(
                agent_id=agent_id or result.agent_id,
                run_id=run_id or result.id,
                status="error",
                result=result,
                result_summary=summary,
                error_message=redact_text(
                    f"Cloud agent run ended with status={status_val}"
                ),
                startup_failure=False,
                locked_repo_url=locked_url,
            )
    except CursorAgentError as exc:
        clear_cancel_state(job_id)
        retryable = getattr(exc, "is_retryable", None)
        msg = redact_text(getattr(exc, "message", None) or str(exc))
        hint = ""
        low = (msg or "").lower()
        if "failed to verify existence of branch" in low or "default branch" in low:
            portal_ok = starting_meta.get("portalSeesBranch")
            hint = (
                " | Hint: portal GITHUB_TOKEN "
                + ("CAN see this branch" if portal_ok else "could not verify the branch")
                + f" (ref={starting_meta.get('startingRef')}, sha={starting_meta.get('sha')}). "
                "This usually means the Cursor account behind CURSOR_API_KEY cannot access "
                "the private GitHub repo via Cursor's GitHub App. Fix: Cursor Dashboard → "
                "Integrations → reconnect GitHub for the BrainDumpster org / SDD-IDS repo "
                "(same GitHub user that owns CURSOR_API_KEY). Also try Privacy Mode "
                "(non-Legacy). GITHUB_TOKEN alone does not grant Cursor Cloud repo access."
            )
        return AgentRunOutcome(
            agent_id=None,
            run_id=None,
            status="error",
            error_message=f"CursorAgentError (startup): {msg} (retryable={retryable}){hint}",
            startup_failure=True,
            locked_repo_url=locked_url,
        )
    except Exception as exc:  # noqa: BLE001
        clear_cancel_state(job_id)
        logger.exception("Cloud agent failed for job %s", job_id)
        return AgentRunOutcome(
            agent_id=None,
            run_id=None,
            status="error",
            error_message=redact_text(f"Unexpected agent failure: {exc}"),
            startup_failure=True,
            locked_repo_url=locked_url,
        )
