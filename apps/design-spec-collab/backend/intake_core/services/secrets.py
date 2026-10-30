"""Secret redaction for logs and API responses."""

from __future__ import annotations

import copy
import re
from typing import Any

from ..config import settings

_SECRET_KEYS = frozenset(
    {
        "authorization",
        "api_key",
        "apikey",
        "cursor_api_key",
        "figma_token",
        "github_token",
        "token",
        "password",
        "secret",
        "bearer",
    }
)

_TOKEN_PATTERNS = [
    re.compile(r"(?i)(authorization\s*:\s*bearer\s+)(\S+)"),
    re.compile(r"(?i)(bearer\s+)([a-z0-9_\-\.]{12,})"),
    re.compile(r"(?i)\b(cursor_[a-z0-9_\-]{8,})\b"),
    re.compile(r"(?i)\b(figd_[a-z0-9_\-]{8,})\b"),
    re.compile(r"(?i)\b(ghp_[a-z0-9]{20,})\b"),
    re.compile(r"(?i)\b(gho_[a-z0-9]{20,})\b"),
]


def _known_secret_values() -> list[str]:
    vals: list[str] = []
    for v in (settings.cursor_api_key, settings.figma_token, settings.github_token):
        if v and len(v) >= 8:
            vals.append(v)
    return vals


def redact_text(text: str | None) -> str | None:
    if not text:
        return text
    out = text
    for secret in _known_secret_values():
        out = out.replace(secret, "[REDACTED]")
    for pat in _TOKEN_PATTERNS:
        out = pat.sub(r"\1[REDACTED]", out)
    return out


def redact_obj(value: Any) -> Any:
    if isinstance(value, dict):
        out: dict[str, Any] = {}
        for k, v in value.items():
            if str(k).lower().replace("-", "_") in _SECRET_KEYS:
                out[k] = "[REDACTED]"
            else:
                out[k] = redact_obj(v)
        return out
    if isinstance(value, list):
        return [redact_obj(v) for v in value]
    if isinstance(value, str):
        return redact_text(value)
    return value


def public_job_dict(record_dump: dict[str, Any]) -> dict[str, Any]:
    """Return a copy safe for API clients (no secrets; truncate huge prompt if needed)."""
    data = redact_obj(copy.deepcopy(record_dump))
    pkg = data.get("prompt_package")
    if isinstance(pkg, dict) and isinstance(pkg.get("prompt_text"), str):
        # Keep enough for debug; full text stays on disk in job JSON
        text = pkg["prompt_text"]
        if len(text) > 6000:
            pkg["prompt_text"] = text[:6000] + "\n…[truncated for API response]"
    return data
