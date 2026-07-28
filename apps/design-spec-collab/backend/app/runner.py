"""Background packaging after job create."""

from __future__ import annotations

import json
import logging
import threading
from typing import TYPE_CHECKING, Any

from .collab_prompt import (
    apply_collab_figma_overrides,
    build_change_hints,
    rewrite_client_requests_for_collab,
)
from .config import settings
from .figma_packager import build_figma_evidence
from .github_catalog import load_context_pack
from .server_review import build_initial_requests
from .session_models import Artifact, ClientRequest, SessionStatus

if TYPE_CHECKING:
    from .portal_bridge import AuditLog, JobStore
    from .session_store import SessionStore

logger = logging.getLogger(__name__)


def start_packaging(
    *,
    job_store: "JobStore",
    session_store: "SessionStore",
    session_id: str,
    job_id: str,
    audit: "AuditLog | None" = None,
    actor: str | None = None,
) -> None:
    t = threading.Thread(
        target=_pack,
        kwargs={
            "job_store": job_store,
            "session_store": session_store,
            "session_id": session_id,
            "job_id": job_id,
            "audit": audit,
            "actor": actor,
        },
        daemon=True,
        name=f"collab-pack-{session_id[:8]}",
    )
    t.start()


def _artifact_from_pack(row: dict[str, Any]) -> Artifact:
    return Artifact.model_validate(
        {
            "name": row["name"],
            "content": row["content"],
            "role": row.get("role") or "context",
            "readOnly": bool(row.get("readOnly", True)),
        }
    )


def _pack(
    *,
    job_store: "JobStore",
    session_store: "SessionStore",
    session_id: str,
    job_id: str,
    audit: "AuditLog | None",
    actor: str | None,
) -> None:
    from .portal_bridge import JobStatus

    session = session_store.get(session_id)
    job = job_store.get(job_id)
    if session is None or job is None:
        return
    try:
        if session.cancel_requested:
            session.status = SessionStatus.cancelled
            session.error_message = "Cancelled during packaging"
            session_store.save(session)
            job.status = JobStatus.cancelled
            job.error_message = session.error_message
            job_store.save(job)
            return

        job_kind = session.job_kind or (session.preview or {}).get("job_kind") or "create"

        # Collab-only: strip live-Figma instructions from prompt package
        session.prompt_package = apply_collab_figma_overrides(
            session.prompt_package, job_kind=str(job_kind)
        )

        preview = dict(session.preview or {})
        packed = load_context_pack(preview, job_kind=str(job_kind))

        existing_paths: list[str] = []
        context_rows: list[dict[str, Any]] = []
        for row in packed:
            if row.get("role") == "meta" and row.get("name") == "__context_pack_meta__":
                try:
                    meta = json.loads(row.get("content") or "{}")
                    existing_paths = list(meta.get("existing_paths") or [])
                except json.JSONDecodeError:
                    existing_paths = []
                continue
            context_rows.append(row)

        # Mark foundation that already exists so we do not ask the client to rewrite it
        preview["context_pack_existing_paths"] = existing_paths
        theme_path = str(
            preview.get("theme_css_path") or preview.get("themeCssPath") or ""
        ).replace("\\", "/")
        root_path = str(
            preview.get("root_spec_path") or preview.get("rootSpecPath") or ""
        ).replace("\\", "/")
        if theme_path and theme_path in existing_paths:
            preview["theme_css_exists"] = True
            preview["themeCssExists"] = True
        if root_path and root_path in existing_paths:
            preview["root_spec_exists"] = True
            preview["rootSpecExists"] = True
        yaml_path = f"config/design_systems/{str(preview.get('programme') or 'ids').lower()}.yaml"
        if yaml_path in existing_paths:
            preview["programme_yaml_exists"] = True
            preview["programmeYamlExists"] = True
        session.preview = preview

        session.context_artifacts = [_artifact_from_pack(r) for r in context_rows]
        session.baseline_artifacts = [
            a for a in session.context_artifacts if (a.role or "") == "baseline"
        ]

        evidence = build_figma_evidence(session.preview)
        session.figma_evidence = evidence

        baseline_spec = None
        for art in session.baseline_artifacts:
            if art.name.endswith("design-spec.md"):
                baseline_spec = art.content
                break
        session.change_hints = build_change_hints(
            baseline_spec=baseline_spec, figma_evidence=evidence
        )

        raw_reqs = build_initial_requests(session.preview)
        raw_reqs = rewrite_client_requests_for_collab(
            raw_reqs, job_kind=str(job_kind)
        )
        session.client_requests = [
            ClientRequest.model_validate(r) for r in raw_reqs
        ]
        session.turn = 1
        session.status = SessionStatus.awaiting_client
        completeness = evidence.get("completeness") or {}
        warn = completeness.get("warnings") or []
        session_store.save(session)
        session_store.append_event(
            session,
            kind="packaged",
            message=(
                "Figma evidence + context pack ready; awaiting client LLM "
                "(no client Figma / no local filesystem)."
                + (f" Warnings: {'; '.join(warn)}" if warn else "")
            ),
            detail={
                "turn": session.turn,
                "figmaMode": evidence.get("mode"),
                "requestCount": len(session.client_requests),
                "jobKind": job_kind,
                "baselineCount": len(session.baseline_artifacts),
                "contextCount": len(session.context_artifacts),
                "contextExistingPaths": existing_paths,
                "completeness": completeness,
            },
        )

        job.status = JobStatus.running
        warn_note = f" warnings={len(warn)}" if warn else ""
        job.result_summary = (
            f"Session ready. Paste session URL into client agent. "
            f"turn={session.turn} figma={evidence.get('mode')} kind={job_kind} "
            f"context={len(session.context_artifacts)}{warn_note}"
        )
        # Persist overridden prompt on job too
        if isinstance(job.prompt_package, dict) or hasattr(job, "prompt_package"):
            try:
                job.prompt_package = session.prompt_package  # type: ignore[assignment]
            except Exception:  # noqa: BLE001
                pass
        job_store.save(job)

        if audit:
            audit.write(
                "collab_packaged",
                job_id=job_id,
                actor=actor,
                detail={
                    "sessionId": session_id,
                    "turn": session.turn,
                    "jobKind": job_kind,
                    "contextCount": len(session.context_artifacts),
                },
            )
    except Exception as exc:  # noqa: BLE001
        logger.exception("Packaging failed for %s", session_id)
        session = session_store.get(session_id) or session
        session.status = SessionStatus.failed
        session.error_message = f"Packaging failed: {exc}"
        session_store.append_event(
            session,
            kind="error",
            message=session.error_message,
        )
        job = job_store.get(job_id)
        if job:
            job.status = JobStatus.error
            job.error_message = session.error_message
            job_store.save(job)
