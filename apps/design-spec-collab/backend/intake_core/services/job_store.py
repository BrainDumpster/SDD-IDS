"""Job + session persistence for Phase 2."""

from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

from ..models.jobs import JobRecord, JobStatus


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _today() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%d")


class JobStore:
    def __init__(self, jobs_dir: Path, sessions_dir: Path) -> None:
        self.jobs_dir = jobs_dir
        self.sessions_dir = sessions_dir
        self.jobs_dir.mkdir(parents=True, exist_ok=True)
        self.sessions_dir.mkdir(parents=True, exist_ok=True)

    def _job_path(self, job_id: str) -> Path:
        return self.jobs_dir / f"{job_id}.json"

    def create(
        self,
        *,
        request: dict[str, Any],
        preview: dict[str, Any],
        prompt_package: dict[str, Any],
        session: dict[str, Any],
        job_id: str | None = None,
        actor: str | None = None,
        locked_repo_url: str | None = None,
    ) -> JobRecord:
        job_id = job_id or str(uuid.uuid4())
        session = {**session, "jobId": job_id}
        session_path = self._write_session(job_id, session)
        record = JobRecord(
            job_id=job_id,
            status=JobStatus.pending,
            created_at=_utc_now(),
            updated_at=_utc_now(),
            request=request,
            preview=preview,
            prompt_package=prompt_package,
            session_path=session_path,
            actor=actor,
            locked_repo_url=locked_repo_url,
        )
        self.save(record)
        return record

    def save(self, record: JobRecord) -> None:
        record.updated_at = _utc_now()
        path = self._job_path(record.job_id)
        tmp = path.with_suffix(f".{uuid.uuid4().hex}.tmp")
        payload = json.dumps(record.model_dump(mode="json"), indent=2) + "\n"
        tmp.write_text(payload, encoding="utf-8")
        os.replace(tmp, path)

    def get(self, job_id: str) -> JobRecord | None:
        path = self._job_path(job_id)
        if not path.is_file() or path.stat().st_size == 0:
            return None
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return None
        return JobRecord.model_validate(data)

    def list_jobs(self, limit: int = 50) -> list[JobRecord]:
        files = sorted(self.jobs_dir.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True)
        out: list[JobRecord] = []
        for path in files[:limit]:
            try:
                out.append(JobRecord.model_validate(json.loads(path.read_text(encoding="utf-8"))))
            except Exception:
                continue
        return out

    def _write_session(self, job_id: str, session: dict[str, Any]) -> str:
        slug = str(session.get("slug") or "component")
        short = job_id.split("-")[0]
        filename = f"{slug}-{_today()}-{short}.yaml"
        path = self.sessions_dir / filename
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(
                yaml.safe_dump(session, sort_keys=False, allow_unicode=True),
                encoding="utf-8",
            )
            return str(path)
        except OSError:
            # Repo may be read-only (Docker); fall back next to jobs_dir
            fallback = self.jobs_dir / "sessions" / filename
            fallback.parent.mkdir(parents=True, exist_ok=True)
            fallback.write_text(
                yaml.safe_dump(session, sort_keys=False, allow_unicode=True),
                encoding="utf-8",
            )
            return str(fallback)
