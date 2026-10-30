"""JSON-file store for collab sessions."""

from __future__ import annotations

import json
import os
import secrets
import threading
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from .session_models import CollabSession, SessionStatus, TranscriptEvent


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _utc_now_str() -> str:
    return _utc_now().strftime("%Y-%m-%dT%H:%M:%SZ")


class SessionStore:
    def __init__(self, sessions_dir: Path) -> None:
        self.sessions_dir = sessions_dir
        self.sessions_dir.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._post_timestamps: dict[str, list[float]] = {}

    def _path(self, session_id: str) -> Path:
        return self.sessions_dir / f"{session_id}.json"

    def create(
        self,
        *,
        job_id: str,
        actor: str | None,
        max_turns: int,
        ttl_hours: float,
        prompt_package: dict[str, Any],
        preview: dict[str, Any],
        request: dict[str, Any],
        job_kind: str = "create",
    ) -> CollabSession:
        now = _utc_now()
        session = CollabSession(
            session_id=secrets.token_urlsafe(24),
            access_token=secrets.token_urlsafe(32),
            job_id=job_id,
            status=SessionStatus.packaging,
            created_at=now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            updated_at=now.strftime("%Y-%m-%dT%H:%M:%SZ"),
            expires_at=(now + timedelta(hours=ttl_hours)).strftime(
                "%Y-%m-%dT%H:%M:%SZ"
            ),
            actor=actor,
            max_turns=max_turns,
            prompt_package=prompt_package,
            preview=preview,
            request=request,
            job_kind=job_kind,
            transcript=[
                TranscriptEvent(
                    at=_utc_now_str(),
                    kind="created",
                    message="Collab session created; packaging Figma evidence.",
                )
            ],
        )
        self.save(session)
        return session

    def save(self, session: CollabSession) -> None:
        session.updated_at = _utc_now_str()
        path = self._path(session.session_id)
        tmp = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
        payload = json.dumps(session.model_dump(mode="json"), indent=2) + "\n"
        tmp.write_text(payload, encoding="utf-8")
        os.replace(tmp, path)

    def get(self, session_id: str) -> CollabSession | None:
        path = self._path(session_id)
        if not path.is_file() or path.stat().st_size == 0:
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return None
        return CollabSession.model_validate(data)

    def get_by_job(self, job_id: str) -> CollabSession | None:
        for path in self.sessions_dir.glob("*.json"):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except Exception:
                continue
            if data.get("job_id") == job_id:
                return CollabSession.model_validate(data)
        return None

    def append_event(
        self,
        session: CollabSession,
        *,
        kind: str,
        message: str,
        detail: dict[str, Any] | None = None,
    ) -> None:
        session.transcript.append(
            TranscriptEvent(
                at=_utc_now_str(),
                kind=kind,
                message=message,
                detail=detail or {},
            )
        )
        self.save(session)

    def token_ok(self, session: CollabSession, token: str | None) -> bool:
        if not token:
            return False
        return secrets.compare_digest(session.access_token, token)

    def is_expired(self, session: CollabSession) -> bool:
        try:
            exp = datetime.strptime(session.expires_at, "%Y-%m-%dT%H:%M:%SZ").replace(
                tzinfo=timezone.utc
            )
        except ValueError:
            return True
        return _utc_now() > exp

    def check_rate_limit(self, session_id: str, limit_per_minute: int) -> bool:
        """Return True if allowed."""
        import time

        now = time.time()
        with self._lock:
            bucket = self._post_timestamps.setdefault(session_id, [])
            bucket[:] = [t for t in bucket if now - t < 60.0]
            if len(bucket) >= limit_per_minute:
                return False
            bucket.append(now)
            return True
