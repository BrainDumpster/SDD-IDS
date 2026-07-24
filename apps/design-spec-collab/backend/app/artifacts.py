"""Build downloadable zip from accepted session artifacts (no LLM)."""

from __future__ import annotations

import io
import json
import zipfile

from .github_publish import build_file_plan
from .session_models import CollabSession, SessionStatus


def build_artifacts_zip(session: CollabSession) -> tuple[bytes, list[str]]:
    if session.status != SessionStatus.done:
        raise ValueError(
            f"Artifacts only available when session is done (status={session.status.value})"
        )

    included: list[str] = []
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        manifest = {
            "session_id": session.session_id,
            "job_id": session.job_id,
            "branch": session.branch,
            "pr_url": session.pr_url,
            "programme": (session.preview or {}).get("programme"),
            "slug": (session.preview or {}).get("slug"),
            "result_summary": session.result_summary,
        }
        zf.writestr("MANIFEST.json", json.dumps(manifest, indent=2) + "\n")
        included.append("MANIFEST.json")

        planned = build_file_plan(session)
        if planned:
            for path, content in planned:
                zf.writestr(path, content)
                included.append(path)
        else:
            for art in session.artifacts:
                name = (art.name or "artifact.txt").replace("\\", "/")
                zf.writestr(f"artifacts/{name}", art.content)
                included.append(f"artifacts/{name}")

        # Compact transcript for operators
        lines = [
            f"{e.at} {e.kind} — {e.message}" for e in session.transcript
        ]
        zf.writestr("TRANSCRIPT.txt", "\n".join(lines) + "\n")
        included.append("TRANSCRIPT.txt")

    return buf.getvalue(), included
