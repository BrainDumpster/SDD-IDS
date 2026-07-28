#!/usr/bin/env python3
"""Simulate a capable client agent against one collab session URL.

Works for create and update sessions. Uses packaged figma_evidence +
context_artifacts only (no client Figma, no local filesystem).

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
        if h == "Layout & Measurements":
            body += (
                "\n### Slot geometry (Figma-verified)\n\n"
                "| Slot | Property | Value | Node |\n"
                "| --- | --- | --- | --- |\n"
                "| Container | border-radius | `var(--radius-md)` | stub-main / get_variable_defs |\n"
            )
        if h == "States (Light Theme)":
            body = (
                "| State | Background | Border | Text/Icon |\n"
                "| --- | --- | --- | --- |\n"
                "| default | `var(--color-bg-primary)` | `var(--color-border)` | `var(--color-text-primary)` |\n"
            )
        if h == "Codegen Contract (Framework-Agnostic Blueprint)":
            body = (
                "### Slot / anatomy schema\n- root, label\n\n"
                "### Variant / option matrix\n- default\n\n"
                "### Accessibility\n- role + aria\n\n"
                "### Fallback / error rules\n- unknown variant → default\n\n"
                "### Validation checklist\n- [ ] sections present\n"
            )
        if h == "Source Mapping":
            body = (
                "- file key: stubFileKeyABCDEFGH\n"
                "- node id: 1:2\n"
                "- verification method: Figma REST API\n"
            )
            if strengthen:
                body += "\nStrengthened Source Mapping after revise.\n"
        parts.append(f"## {h}\n\n{body}")
    return "\n".join(parts)


def _parse_session_url(url: str) -> tuple[str, str, str]:
    parsed = urllib.parse.urlparse(url)
    qs = urllib.parse.parse_qs(parsed.query)
    token = (qs.get("t") or [None])[0]
    if not token:
        raise SystemExit("session URL must include ?t= access token")
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
    work_url = f"{base}/api/v1/sessions/{session_id}/work?{q}"

    work = None
    for _ in range(60):
        work = _req("GET", work_url)
        status = work.get("status")
        print(
            f"status={status} turn={work.get('turn')} kind={work.get('job_kind')}"
        )
        if status == "awaiting_client":
            break
        if status in ("done", "failed", "cancelled"):
            print(json.dumps(work, indent=2)[:800])
            return
        time.sleep(1)
    else:
        raise SystemExit("timeout waiting for awaiting_client")

    ctx = work.get("context_artifacts") or []
    if not ctx:
        raise SystemExit(
            "FAIL: expected context_artifacts in /work (theme/root/map pack)"
        )
    guidance = work.get("clientGuidance") or {}
    if not guidance.get("forbidLocalFilesystem"):
        raise SystemExit("FAIL: clientGuidance.forbidLocalFilesystem missing")
    print(
        "context_artifacts=",
        len(ctx),
        "names=",
        [c.get("name") for c in ctx[:8]],
    )

    claim = _req(
        "POST",
        f"{base}/api/v1/sessions/{session_id}/claim?{q}",
        {"clientLabel": "simulate_client"},
    )
    nonce = claim.get("clientNonce")
    print("claimed", claim.get("claimed"), "nonce", bool(nonce))

    job_kind = work.get("job_kind") or "create"
    preview = work.get("preview") or {}
    design_path = (
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or "design-spec.md"
    )
    print(
        "figma_evidence mode=",
        (work.get("figma_evidence") or {}).get("mode"),
        "baselines=",
        len(work.get("baseline_artifacts") or []),
    )
    if guidance.get("usePackagedEvidenceOnly"):
        print("clientGuidance: usePackagedEvidenceOnly (no client Figma auth)")

    strengthen = False
    while True:
        work = _req("GET", work_url)
        status = work["status"]
        print("status", status, "turn", work.get("turn"))
        if status in ("done", "failed", "cancelled"):
            print(json.dumps(work, indent=2)[:600])
            return
        if status != "awaiting_client":
            time.sleep(0.5)
            continue

        turn = work["turn"]
        artifacts = [
            {
                "name": design_path,
                "content": _spec_md(strengthen=True),
            }
        ]
        # Honor extra client_requests using packaged context when possible
        for req in work.get("client_requests") or []:
            expected = req.get("expected_artifact")
            if not expected or expected == design_path:
                continue
            if any(a["name"] == expected for a in artifacts):
                continue
            donor = None
            for c in work.get("context_artifacts") or []:
                name = c.get("name") or ""
                if name == expected or name.endswith("/" + expected.split("/")[-1]):
                    donor = c.get("content")
                    break
                if name.startswith("donor:") and expected.split("/")[-1] in name:
                    donor = c.get("content")
            artifacts.append(
                {
                    "name": expected,
                    "content": donor or f"/* simulate_client stub for {expected} */\n",
                }
            )

        if job_kind == "update":
            for b in work.get("baseline_artifacts") or []:
                name = b.get("name") or ""
                if name.endswith(".stories.tsx") or name.endswith("main.ts"):
                    if any(a["name"] == name for a in artifacts):
                        continue
                    artifacts.append(
                        {
                            "name": name,
                            "content": b.get("content") or "// stub\n",
                        }
                    )

        result = _req(
            "POST",
            f"{base}/api/v1/sessions/{session_id}/result?{q}",
            {
                "turn": turn,
                "summary": f"simulate_client {job_kind} turn {turn} (context pack only)",
                "clientNonce": nonce,
                "artifacts": artifacts,
            },
        )
        print(
            "decision",
            result.get("decision"),
            (result.get("verdict") or {}).get("feedback"),
        )
        strengthen = True
        if result.get("decision") == "accept":
            print("DONE", result.get("pr_url"), result.get("branch"))
            return
        if result.get("decision") == "failed":
            print("FAILED")
            return
        time.sleep(0.3)


if __name__ == "__main__":
    main()
