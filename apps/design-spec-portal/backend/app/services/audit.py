"""Append-only audit log (JSONL)."""

from __future__ import annotations

import json
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .secrets import redact_obj

_lock = threading.Lock()


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


class AuditLog:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def write(
        self,
        event: str,
        *,
        job_id: str | None = None,
        actor: str = "anonymous",
        detail: dict[str, Any] | None = None,
    ) -> None:
        row = {
            "ts": _utc_now(),
            "event": event,
            "actor": actor,
            "jobId": job_id,
            "detail": redact_obj(detail or {}),
        }
        line = json.dumps(row, ensure_ascii=False) + "\n"
        with _lock:
            with self.path.open("a", encoding="utf-8") as fh:
                fh.write(line)

    def read_tail(self, limit: int = 100) -> list[dict[str, Any]]:
        if not self.path.is_file():
            return []
        with _lock:
            lines = self.path.read_text(encoding="utf-8").splitlines()
        out: list[dict[str, Any]] = []
        for line in lines[-limit:]:
            try:
                out.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        return out
