#!/usr/bin/env python3
"""Simulate a capable client agent against one collab session URL.

Usage:
  python scripts/simulate_client.py 'http://127.0.0.1:8091/s/SESSION?t=TOKEN'
"""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

REQUIRED = [
    "Metadata",
    "Layout & Measurements",
    "Tokens",
    "States (Light Theme)",
    "States (Dark Theme)",
    "Interactions",
    "Composition & API (runtime)",
    "Codegen Contract (Framework-Agnostic Blueprint)",
    "Source Mapping",
]


def _spec_md(*, strengthen: bool = False) -> str:
    parts = []
    for h in REQUIRED:
        body = f"Content for {h}.\n\nUse `var(--color-text-primary)`.\n"
        if strengthen and h == "Layout & Measurements":
            body += (
                "\n### Slot geometry (Figma-verified)\n\n"
                "| Slot | Property | Value | Node |\n"
                "| --- | --- | --- | --- |\n"
                "| Container | border-radius | `var(--radius-md)` | stub-main |\n"
            )
        if strengthen and h == "Source Mapping":
            body += "\nFile key + node ids from figma_evidence (stub).\n"
        parts.append(f"## {h}\n\n{body}")
    return "\n".join(parts)


def _parse_session_url(url: str) -> tuple[str, str, str]:
    parsed = urllib.parse.urlparse(url)
    qs = urllib.parse.parse_qs(parsed.query)
    token = (qs.get("t") or [None])[0]
    if not token:
        raise SystemExit("session URL must include ?t= access token")
    # /s/{session_id}
    parts = [p for p in parsed.path.split("/") if p]
    if len(parts) < 2 or parts[0] != "s":
        raise SystemExit("expected path /s/{session_id}")
    session_id = parts[1].removesuffix(".md")
    base = f"{parsed.scheme}://{parsed.netloc}"
    return base, session_id, token


def _req(method: str, url: str, body: dict | None = None) -> dict:
    data = None
    headers = {"Accept": "application/json"}
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"{method} {url} → {exc.code}: {detail}") from exc


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    base, session_id, token = _parse_session_url(sys.argv[1])
    q = urllib.parse.urlencode({"t": token})

    # wait until packaged
    work_url = f"{base}/api/v1/sessions/{session_id}/work?{q}"
    for _ in range(30):
        work = _req("GET", work_url)
        if work["status"] == "awaiting_client":
            break
        if work["status"] in ("done", "failed", "cancelled"):
            print(json.dumps(work, indent=2))
            return
        time.sleep(0.5)
    else:
        raise SystemExit(f"timeout waiting for work: {work.get('status')}")

    claim = _req(
        "POST",
        f"{base}/api/v1/sessions/{session_id}/claim?{q}",
        {"clientLabel": "simulate_client"},
    )
    nonce = claim.get("clientNonce")
    print("claimed", claim)

    turn_index = 0
    while True:
        work = _req("GET", work_url)
        status = work["status"]
        print("status", status, "turn", work.get("turn"))
        if status in ("done", "failed", "cancelled"):
            print(json.dumps(work, indent=2))
            return
        if status != "awaiting_client":
            time.sleep(0.5)
            continue

        turn = work["turn"]
        strengthen = turn_index > 0
        payload = {
            "turn": turn,
            "summary": f"sim client turn {turn}",
            "clientNonce": nonce,
            "artifacts": [
                {
                    "name": "design-spec.md",
                    "content": _spec_md(strengthen=strengthen),
                }
            ],
        }
        result = _req(
            "POST",
            f"{base}/api/v1/sessions/{session_id}/result?{q}",
            payload,
        )
        print("decision", result.get("decision"), result.get("verdict", {}).get("feedback"))
        turn_index += 1
        if result.get("decision") == "accept":
            print("DONE")
            return
        if result.get("decision") == "failed":
            print("FAILED")
            return
        time.sleep(0.3)


if __name__ == "__main__":
    main()
