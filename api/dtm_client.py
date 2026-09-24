"""Call the Node Design Token Manager from Python generation routes."""

from __future__ import annotations

import os
import re
from typing import Any
from urllib import request, error
import json


def dtm_base_url() -> str:
    return os.environ.get("DTM_URL", "http://127.0.0.1:8110").rstrip("/")


def resolve_design_tokens(text: str, programme: str = "ids") -> dict[str, Any] | None:
    """Ask the DTM which var(--name) tokens are available.

    Returns None when the DTM is not running. Generation continues either way.
    """
    names = sorted(set(re.findall(r"--[A-Za-z0-9-]+", text or "")))
    if not names:
        return {"results": []}
    payload = json.dumps({"names": names, "programme": programme, "createMissing": False}).encode()
    req = request.Request(
        f"{dtm_base_url()}/design/tokens/resolve",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=2) as response:
            return json.loads(response.read().decode())
    except (error.URLError, TimeoutError, json.JSONDecodeError):
        return None
