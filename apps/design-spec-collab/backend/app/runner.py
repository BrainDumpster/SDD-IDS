"""Background packaging after job create."""

from __future__ import annotations

import logging
import threading
from typing import TYPE_CHECKING

from .config import settings
from .figma_packager import build_figma_evidence
from .server_review import build_initial_requests
from .session_models import ClientRequest, SessionStatus

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

        evidence = build_figma_evidence(session.preview)
        session.figma_evidence = evidence
        session.turn = 1
        session.client_requests = [
            ClientRequest.model_validate(r) for r in build_initial_requests(session.preview)
        ]
        session.status = SessionStatus.awaiting_client
        session_store.save(session)
        session_store.append_event(
            session,
            kind="packaged",
            message="Figma evidence packaged; awaiting client LLM on session URL.",
            detail={
                "turn": session.turn,
                "figmaMode": evidence.get("mode"),
                "requestCount": len(session.client_requests),
            },
        )

        job.status = JobStatus.running
        job.result_summary = (
            f"Session ready. Paste session URL into client agent. "
            f"turn={session.turn} figma={evidence.get('mode')}"
        )
        job_store.save(job)

        if audit:
            audit.write(
                "collab_packaged",
                job_id=job_id,
                actor=actor,
                detail={"sessionId": session_id, "turn": session.turn},
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
