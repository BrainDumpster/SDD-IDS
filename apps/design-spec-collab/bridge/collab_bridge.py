#!/usr/bin/env python3
"""Collab Bridge — one-shot outbound agent (Server → Bridge → local AI CLI).

Stdlib-only. No pip install. Outbound HTTPS to Collab only (no local listen port).

Usage:
  python3 collab_bridge.py doctor
  python3 collab_bridge.py run 'https://collab.example/s/SESSION?t=TOKEN'
  python3 collab_bridge.py run '…' --ai-cli stub          # demo without Devin
  python3 collab_bridge.py run '…' --ai-cli devin         # default
  python3 collab_bridge.py run '…' --once                 # single turn then exit
  python3 collab_bridge.py run '…' --dry-run              # write sandbox, no AI/POST

Exit codes: 0 done/cancel, 1 failed, 2 preflight, 130 interrupted.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import select
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

__version__ = "0.1.4"

REQUIRED_SPEC_SECTIONS = [
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


def _log(msg: str) -> None:
    print(f"[collab-bridge] {msg}", flush=True)


def parse_session_url(url: str) -> tuple[str, str, str]:
    """Return (api_base, session_id, token).

    Supports path prefixes used by IDE/Jupyter proxies, e.g.
    ``http://host:8080/proxy/3/s/{id}?t=…`` → base ``http://host:8080/proxy/3``.
    Also collapses accidental repeated ``/proxy/N/proxy/N`` prefixes.
    """
    parsed = urllib.parse.urlparse(url.strip().strip("'\""))
    qs = urllib.parse.parse_qs(parsed.query)
    token = (qs.get("t") or [None])[0]
    if not token:
        raise SystemExit("session URL must include ?t= access token")
    parts = [p for p in parsed.path.split("/") if p]
    # Collapse proxy/N/proxy/N…
    collapsed: list[str] = []
    i = 0
    while i < len(parts):
        if parts[i].lower() == "proxy" and i + 1 < len(parts):
            seg = [parts[i], parts[i + 1]]
            if collapsed[-2:] != seg:
                collapsed.extend(seg)
            i += 2
            continue
        collapsed.append(parts[i])
        i += 1
    parts = collapsed
    try:
        s_idx = parts.index("s")
    except ValueError as exc:
        raise SystemExit(
            "expected path …/s/{session_id} (optionally under /proxy/N/)"
        ) from exc
    if s_idx + 1 >= len(parts):
        raise SystemExit("expected path …/s/{session_id}")
    session_id = parts[s_idx + 1].removesuffix(".md")
    prefix_parts = parts[:s_idx]
    prefix = ("/" + "/".join(prefix_parts)) if prefix_parts else ""
    base = f"{parsed.scheme}://{parsed.netloc}{prefix}".rstrip("/")
    return base, session_id, token


def http_json(
    method: str,
    url: str,
    body: dict | None = None,
    *,
    timeout: float = 120.0,
) -> dict:
    data = None
    headers = {
        "Accept": "application/json",
        "User-Agent": f"collab-bridge/{__version__}",
    }
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    request = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=timeout) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"{method} {url} → {exc.code}: {detail}") from exc


def stub_spec_md(*, strengthen: bool = False, follow_up: str | None = None) -> str:
    parts = []
    for h in REQUIRED_SPEC_SECTIONS:
        body = f"Content for {h}.\n\nUse `var(--color-text-primary)`.\n"
        if h == "Layout & Measurements":
            body += (
                "\n### Slot geometry (Figma-verified)\n\n"
                "| Slot | Property | Value | Node |\n"
                "| --- | --- | --- | --- |\n"
                "| Container | border-radius | `var(--radius-md)` "
                "| stub-main / get_variable_defs |\n"
            )
            if follow_up:
                body += f"\n<!-- bridge follow-up applied: {follow_up[:200]} -->\n"
        if h == "States (Light Theme)":
            body = (
                "| State | Background | Border | Text/Icon |\n"
                "| --- | --- | --- | --- |\n"
                "| default | `var(--color-bg-primary)` | `var(--color-border)` | "
                "`var(--color-text-primary)` |\n"
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


def build_work_prompt(work: dict, sandbox: Path) -> str:
    checklist = work.get("authoring_checklist") or []
    checklist_txt = (
        "\n".join(f"- {c}" for c in checklist)
        if checklist
        else "- (see client_requests)"
    )
    reqs = work.get("client_requests") or []
    req_lines = []
    for r in reqs:
        req_lines.append(
            f"- id={r.get('id')} kind={r.get('kind')} "
            f"artifact={r.get('expected_artifact')}\n"
            f"  {(r.get('instruction') or '')[:2000]}"
        )
    guidance = work.get("clientGuidance") or {}
    preview = work.get("preview") or {}
    feedback = work.get("prior_feedback") or "(none)"
    return f"""# Collab Bridge authoring task

You are the **client author** for Design Spec Collab.
The server already packaged Figma evidence.

## Hard rules
- Work **only** inside this sandbox directory: `{sandbox}`
- Use **only** `figma_evidence.json`, `context/`, and `prior/` —
  do **not** search the monorepo
- Do **not** call Figma MCP / authenticate to Figma
- Write outputs under `out/` using the exact repo-relative paths
  from client_requests
- `forbidLocalFilesystem`={guidance.get('forbidLocalFilesystem')}
- `usePackagedEvidenceOnly`={guidance.get('usePackagedEvidenceOnly')}
- **Do not HTTP call Collab** (`/claim`, `/work`, `/result`, session URLs).
  The Bridge process already claimed this session and will POST `/result`
  with the correct `clientNonce`. Dual posting causes
  `Invalid clientNonce — session claimed by another client`.
- Do **not** write artifacts into the human's real monorepo workspace —
  only under this sandbox `out/`.

## Job
- job_kind: {work.get('job_kind')}
- turn: {work.get('turn')} / max {work.get('max_turns')}
- programme: {preview.get('programme')}  slug: {preview.get('slug')}
- design_spec_path: {preview.get('design_spec_path') or preview.get('designSpecPath')}

## Prior server feedback
{feedback}

## Client requests
{chr(10).join(req_lines) or '- (none)'}

## Required artifact paths (submit ALL)
{chr(10).join('- `' + p + '`' for p in expected_artifact_paths(work)) or '- (see client_requests)'}

## Authoring checklist
{checklist_txt}

## Deliverable
Write every required artifact under `out/<repo-relative-path>` using file-write tools
(this Bridge runs Devin with `--permission-mode` that allows writes in the sandbox).
Programme theme CSS (selected): `{preview.get('theme_css_path') or preview.get('themeCssPath') or '—'}`.
If that path is listed under Required artifact paths, write it under `out/` — adapt from
`context/donor_*` files when present (donors are templates only; never name an artifact `donor:…`).
When finished writing files under `out/`, exit 0 immediately.
The Bridge — not you — POSTs artifacts to Collab.
"""


def materialize_sandbox(work: dict, sandbox: Path) -> Path:
    sandbox.mkdir(parents=True, exist_ok=True)
    (sandbox / "context").mkdir(exist_ok=True)
    (sandbox / "prior").mkdir(exist_ok=True)
    out = sandbox / "out"
    out.mkdir(exist_ok=True)

    (sandbox / "figma_evidence.json").write_text(
        json.dumps(work.get("figma_evidence") or {}, indent=2),
        encoding="utf-8",
    )
    for art in work.get("context_artifacts") or []:
        name = str(art.get("name") or "context.txt").replace("..", "_")
        safe = name.replace(":", "_").replace("/", "__")
        (sandbox / "context" / safe).write_text(
            str(art.get("content") or ""), encoding="utf-8"
        )
    for art in work.get("baseline_artifacts") or []:
        name = str(art.get("name") or "baseline.txt").replace("..", "_")
        safe = name.replace("/", "__")
        (sandbox / "prior" / safe).write_text(
            str(art.get("content") or ""), encoding="utf-8"
        )

    prompt = build_work_prompt(work, sandbox)
    (sandbox / "WORK_PROMPT.md").write_text(prompt, encoding="utf-8")
    return out


def _is_file_artifact_path(path: str) -> bool:
    """True for submit-able file paths; false for directories / donors / fragments."""
    p = (path or "").strip().replace("\\", "/").lstrip("./")
    if not p or p.endswith("/"):
        return False
    # context_artifacts templates are read-only — never submit as artifact names
    if p.startswith("donor:") or p.startswith("donor/"):
        return False
    # Doc excerpts / anchors are not write targets
    if "#" in p:
        return False
    # Common allowlist directory prefixes mentioned in instructions (no filename)
    if p in (
        "generation/deterministic_storybook",
        "data/design-spec-intake/sessions",
        "storybook-generated",
    ):
        return False
    name = p.rsplit("/", 1)[-1]
    if "." not in name:
        # No extension → treat as directory (e.g. generation/deterministic_storybook)
        return False
    return True


def expected_artifact_paths(work: dict) -> list[str]:
    """Union of design-spec + every client_request path (+ paths mentioned in instructions)."""
    preview = work.get("preview") or {}
    design_path = (
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or "design-spec.md"
    )
    expected: list[str] = []

    def _add(p: str | None) -> None:
        if not p:
            return
        p = str(p).strip().replace("\\", "/").lstrip("./").rstrip("/")
        # Instruction backticks may wrap donor:… — never treat as submit path
        if p.startswith("donor:"):
            return
        if not _is_file_artifact_path(p):
            return
        if p and p not in expected:
            expected.append(p)

    _add(design_path)
    # Always include selected programme theme + root-spec when client must create foundation
    theme_path = (
        preview.get("theme_css_path")
        or preview.get("themeCssPath")
        or ""
    )
    theme_exists = bool(
        preview.get("theme_css_exists")
        or preview.get("themeCssExists")
    )
    if theme_path and not theme_exists:
        _add(str(theme_path))
    root_path = (
        preview.get("root_spec_path")
        or preview.get("rootSpecPath")
        or ""
    )
    root_exists = bool(
        preview.get("root_spec_exists")
        or preview.get("rootSpecExists")
    )
    if root_path and not root_exists:
        _add(str(root_path))

    for req in work.get("client_requests") or []:
        _add(req.get("expected_artifact"))
        instruction = req.get("instruction") or ""
        for m in re.findall(r"`([^`]+)`", instruction):
            if "/" in m or m.endswith(
                (".md", ".css", ".yaml", ".yml", ".json", ".tsx", ".ts", ".py")
            ):
                _add(m)
    allow = (work.get("prompt_package") or {}).get("write_path_allowlist") or []
    if isinstance(allow, list):
        # do not require every allowlist path — only those already requested
        pass
    return expected


def _context_content_for_path(work: dict, expected: str) -> str | None:
    """Resolve file content from context/baseline, including donor:* templates."""
    expected = (expected or "").replace("\\", "/").lstrip("./")
    if expected.startswith("donor:"):
        expected = expected[len("donor:") :]
    base = expected.rsplit("/", 1)[-1]
    for c in work.get("context_artifacts") or []:
        name = str(c.get("name") or "").replace("\\", "/")
        if name == expected or name.endswith("/" + expected) or (
            not name.startswith("donor:") and name.endswith("/" + base)
        ):
            return str(c.get("content") or "")
        if name.startswith("donor:"):
            donor_path = name[len("donor:") :]
            if donor_path == expected or donor_path.endswith("/" + base):
                return str(c.get("content") or "")
            # Programme foundation ← IDS (or other) donor template
            if expected.endswith(("-theme.css", "theme.css")) and donor_path.endswith(
                ("-theme.css", "theme.css", "ids-theme.css")
            ):
                return str(c.get("content") or "")
            if expected.endswith("root-spec.md") and donor_path.endswith("root-spec.md"):
                return str(c.get("content") or "")
            if expected.endswith((".yaml", ".yml")) and donor_path.endswith(
                (".yaml", ".yml")
            ):
                return str(c.get("content") or "")
    for b in work.get("baseline_artifacts") or []:
        name = str(b.get("name") or "").replace("\\", "/")
        if name == expected or name.endswith("/" + expected) or name.endswith(base):
            return str(b.get("content") or "")
    return None


def collect_artifacts(work: dict, out_dir: Path) -> list[dict]:
    expected = expected_artifact_paths(work)
    artifacts: list[dict] = []
    for path in expected:
        candidates = [
            out_dir / path,
            out_dir / Path(path).name,
            out_dir / path.replace("/", "__"),
        ]
        # Devin sometimes writes at sandbox root instead of out/
        sandbox = out_dir.parent
        candidates.extend(
            [
                sandbox / path,
                sandbox / Path(path).name,
            ]
        )
        content = None
        for c in candidates:
            if c.is_file():
                content = c.read_text(encoding="utf-8")
                break
        if content is None:
            # recursive basename search under out/
            base = Path(path).name
            for hit in out_dir.rglob(base):
                if hit.is_file():
                    content = hit.read_text(encoding="utf-8")
                    break
        if content is None:
            continue
        artifacts.append({"name": path, "content": content})
    return artifacts


def fill_missing_artifacts(work: dict, out_dir: Path, artifacts: list[dict]) -> list[dict]:
    """Fill gaps from packaged context/donors so revise does not spin on foundation."""
    have = {a["name"] for a in artifacts}
    for path in expected_artifact_paths(work):
        if path in have:
            continue
        if not _is_file_artifact_path(path) or path.startswith("donor:"):
            continue
        donor = _context_content_for_path(work, path)
        if donor is None:
            # minimal placeholders for required extensions
            if path.endswith(".yaml") or path.endswith(".yml"):
                programme = (work.get("preview") or {}).get("programme") or "programme"
                donor = (
                    f"slug: {programme}\n"
                    f"display_name: {programme}\n"
                    f"components_dir: components/{programme}\n"
                    f"theme_css_path: components/{programme}-theme.css\n"
                    f"root_spec_path: components/{programme}/root-spec.md\n"
                    f"figma_map_path: data/{programme}-component-figma-map.json\n"
                )
            elif path.endswith(".json"):
                donor = "{}\n"
            elif path.endswith(".css"):
                donor = (
                    "/* collab-bridge: thin theme wrapper — replace with real tokens */\n"
                    '@import "../ids-theme.css";\n'
                )
            elif path.endswith("root-spec.md"):
                donor = (
                    "# Root spec (bridge placeholder)\n\n"
                    "Inherit IDS root-spec; replace via Devin using donor context.\n"
                )
            else:
                continue
        dest = out_dir / path
        if dest.is_dir():
            _log(f"skip fill — path is a directory (not a file artifact): {path}")
            continue
        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(donor, encoding="utf-8")
        except IsADirectoryError:
            _log(f"skip fill — IsADirectoryError for {path}")
            continue
        except OSError as exc:
            _log(f"skip fill — could not write {path}: {exc}")
            continue
        artifacts.append({"name": path, "content": donor})
        _log(f"filled missing artifact from context/donor: {path}")
        have.add(path)
    return artifacts


def follow_up_text(work: dict) -> str | None:
    for req in work.get("client_requests") or []:
        if req.get("kind") in ("follow_up", "chat_follow_up", "revise_sections"):
            return str(req.get("instruction") or "")
    return None


def invoke_stub(work: dict, out_dir: Path, *, strengthen: bool) -> None:
    preview = work.get("preview") or {}
    design_path = (
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or "design-spec.md"
    )
    fu = follow_up_text(work)
    target = out_dir / design_path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        stub_spec_md(strengthen=strengthen, follow_up=fu), encoding="utf-8"
    )
    for path in expected_artifact_paths(work):
        if path == design_path:
            continue
        if not _is_file_artifact_path(path):
            continue
        dest = out_dir / path
        if dest.is_dir():
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.is_file():
            continue
        donor = _context_content_for_path(work, path)
        try:
            dest.write_text(
                donor
                if donor is not None
                else f"/* collab-bridge stub for {path} */\n",
                encoding="utf-8",
            )
        except (IsADirectoryError, OSError) as exc:
            _log(f"stub skip write {path}: {exc}")
            continue
    job_kind = work.get("job_kind") or "create"
    if job_kind in ("update", "review_revise"):
        for b in work.get("baseline_artifacts") or []:
            name = b.get("name") or ""
            if name.endswith(".stories.tsx") or name.endswith("main.ts"):
                dest = out_dir / name
                dest.parent.mkdir(parents=True, exist_ok=True)
                if not dest.is_file():
                    dest.write_text(
                        b.get("content") or "// stub\n", encoding="utf-8"
                    )


def invoke_devin(
    sandbox: Path,
    prompt_path: Path,
    timeout: int,
    *,
    permission_mode: str = "dangerous",
    on_tick=None,
) -> int:
    """Run Devin headlessly. Non-interactive -p rejects writes unless permission-mode allows them.

    Flag order matters: put options *before* ``-p``. If ``-p`` comes first,
    Devin may treat the next token (e.g. ``--permission-mode``) as the prompt
    and appear to hang with no useful work.
    """
    prompt_file = sandbox / "WORK_PROMPT.md"
    if not prompt_file.is_file():
        prompt_file = Path(prompt_path)
    # Options first, then --prompt-file, then -p last (no inline prompt arg).
    cmd = [
        "devin",
        "--permission-mode",
        permission_mode,
        "--respect-workspace-trust",
        "false",
        "--prompt-file",
        str(prompt_file),
        "-p",
    ]
    _log(
        f"invoking: {' '.join(cmd[:6])} … -p  (cwd={sandbox}, timeout={timeout}s)"
    )
    _log(
        "Devin may take several minutes with little output at first — "
        "Bridge streams its stdout/stderr below and keeps Collab heartbeats alive."
    )
    try:
        proc = subprocess.Popen(
            cmd,
            cwd=str(sandbox),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1,
        )
    except FileNotFoundError:
        _log(
            "ERROR: `devin` not found on PATH. "
            "Install Devin CLI or use --ai-cli stub"
        )
        return 2

    started = time.time()
    deadline = started + max(30, timeout)
    last_tick = 0.0
    last_activity = started
    assert proc.stdout is not None
    out_fd = proc.stdout.fileno()
    try:
        while True:
            now = time.time()
            if now > deadline:
                _log(f"ERROR: Devin timed out after {timeout}s — killing")
                proc.kill()
                try:
                    proc.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    pass
                return 1
            elapsed = int(now - started)
            if on_tick and now - last_tick >= 15:
                try:
                    on_tick(elapsed)
                except TypeError:
                    try:
                        on_tick()
                    except Exception:  # noqa: BLE001
                        pass
                except Exception:  # noqa: BLE001
                    pass
                last_tick = now
            ready, _, _ = select.select([out_fd], [], [], 1.0)
            if ready:
                line = proc.stdout.readline()
                if line:
                    sys.stderr.write(line)
                    if not line.endswith("\n"):
                        sys.stderr.write("\n")
                    sys.stderr.flush()
                    last_activity = time.time()
                elif proc.poll() is not None:
                    break
            elif proc.poll() is not None:
                rest = proc.stdout.read()
                if rest:
                    sys.stderr.write(rest)
                    if not rest.endswith("\n"):
                        sys.stderr.write("\n")
                    sys.stderr.flush()
                break
            elif time.time() - last_activity > 30:
                _log(
                    f"still waiting on Devin (pid={proc.pid}, "
                    f"elapsed={elapsed}s)…"
                )
                last_activity = time.time()  # throttle pings
        rc = proc.wait(timeout=5)
        _log(f"Devin exited rc={rc}")
        return int(rc)
    except KeyboardInterrupt:
        _log("interrupted — killing Devin")
        proc.kill()
        raise


def post_heartbeat(
    base: str,
    session_id: str,
    token: str,
    label: str,
    *,
    progress: str | None = None,
) -> None:
    q = urllib.parse.urlencode({"t": token})
    url = f"{base}/api/v1/sessions/{session_id}/heartbeat?{q}"
    body: dict = {"clientLabel": label}
    if progress:
        body["progress"] = progress[:500]
    try:
        http_json("POST", url, body, timeout=15)
    except Exception as exc:  # noqa: BLE001 — best-effort
        _log(f"heartbeat skipped: {exc}")


def cmd_doctor(args: argparse.Namespace) -> int:
    _log(f"version {__version__}")
    _log(f"python {sys.version.split()[0]} ({sys.executable})")
    ok = True
    if args.ai_cli == "devin":
        path = shutil.which("devin")
        if path:
            _log(f"devin: {path}")
        else:
            _log("devin: NOT FOUND (use --ai-cli stub for demos)")
            ok = False
    if args.session_url:
        try:
            base, sid, _tok = parse_session_url(args.session_url)
            _log(f"session parse ok: base={base} id={sid}")
            health = http_json("GET", f"{base}/health", timeout=15)
            _log(f"collab /health: {json.dumps(health)[:200]}")
        except Exception as exc:  # noqa: BLE001
            _log(f"collab check failed: {exc}")
            ok = False
    return 0 if ok else 2


def cmd_run(args: argparse.Namespace) -> int:
    base, session_id, token = parse_session_url(args.session_url)
    q = urllib.parse.urlencode({"t": token})
    work_url = f"{base}/api/v1/sessions/{session_id}/work?{q}"
    claim_url = f"{base}/api/v1/sessions/{session_id}/claim?{q}"
    result_url = f"{base}/api/v1/sessions/{session_id}/result?{q}"
    label = f"collab-bridge/{args.ai_cli}"

    sandbox_root = (
        Path(args.sandbox).resolve()
        if args.sandbox
        else Path(tempfile.mkdtemp(prefix=f"collab-bridge-{session_id[:8]}-"))
    )
    _log(f"sandbox={sandbox_root}")

    work: dict | None = None
    for i in range(args.wait_packaging):
        work = http_json("GET", work_url)
        status = work.get("status")
        _log(f"status={status} turn={work.get('turn')} kind={work.get('job_kind')}")
        if status == "awaiting_client":
            break
        if status in ("done", "failed", "cancelled"):
            _log(json.dumps(work, indent=2)[:800])
            return 0 if status in ("done", "cancelled") else 1
        if i == 0 or i % 3 == 0:
            post_heartbeat(
                base,
                session_id,
                token,
                label,
                progress=f"Waiting for server packaging (status={status})…",
            )
        time.sleep(max(0.5, args.poll_ms / 1000.0))
    else:
        _log("timeout waiting for awaiting_client")
        return 1

    assert work is not None
    guidance = work.get("clientGuidance") or {}
    if not guidance.get("forbidLocalFilesystem"):
        _log("WARN: clientGuidance.forbidLocalFilesystem missing — continuing")

    try:
        claim = http_json(
            "POST",
            claim_url,
            {"clientLabel": label, "force": True},
        )
    except RuntimeError as exc:
        _log(f"claim failed: {exc}")
        return 1
    nonce = claim.get("clientNonce")
    _log(f"claimed={claim.get('claimed')} nonce={bool(nonce)} label={label}")
    post_heartbeat(
        base, session_id, token, label, progress="Claimed session — preparing sandbox"
    )

    strengthen = False
    try:
        while True:
            work = http_json("GET", work_url)
            status = work["status"]
            _log(f"loop status={status} turn={work.get('turn')}")
            if status in ("done", "failed", "cancelled"):
                if status == "failed":
                    return 1
                return 0
            if status != "awaiting_client":
                post_heartbeat(
                    base,
                    session_id,
                    token,
                    label,
                    progress=f"Waiting for server (status={status})…",
                )
                time.sleep(max(0.3, args.poll_ms / 1000.0))
                continue

            turn = int(work["turn"])
            post_heartbeat(
                base,
                session_id,
                token,
                label,
                progress=f"Turn {turn}: materializing sandbox…",
            )
            out_dir = materialize_sandbox(work, sandbox_root)

            if args.dry_run:
                _log("dry-run: sandbox written; exiting without AI/POST")
                _log(f"prompt={sandbox_root / 'WORK_PROMPT.md'}")
                return 0

            if args.ai_cli == "stub":
                post_heartbeat(
                    base,
                    session_id,
                    token,
                    label,
                    progress=f"Turn {turn}: running stub author…",
                )
                invoke_stub(work, out_dir, strengthen=strengthen)
            elif args.ai_cli == "devin":
                def _tick(elapsed: int = 0) -> None:
                    post_heartbeat(
                        base,
                        session_id,
                        token,
                        label,
                        progress=(
                            f"Turn {turn}: Devin running "
                            f"({elapsed}s elapsed)…"
                        ),
                    )

                post_heartbeat(
                    base,
                    session_id,
                    token,
                    label,
                    progress=f"Turn {turn}: starting Devin…",
                )
                rc = invoke_devin(
                    sandbox_root,
                    sandbox_root / "WORK_PROMPT.md",
                    timeout=args.ai_timeout,
                    permission_mode=args.devin_permission_mode,
                    on_tick=_tick,
                )
                if rc == 2:
                    return 2
                arts = collect_artifacts(work, out_dir)
                if not arts:
                    _log(
                        "no artifacts under out/ after Devin — "
                        "if Devin said writes were rejected, ensure "
                        f"--devin-permission-mode={args.devin_permission_mode} "
                        "(try 'dangerous'). Using stub fallback for this turn."
                    )
                    invoke_stub(work, out_dir, strengthen=strengthen)
            else:
                _log(f"unknown --ai-cli {args.ai_cli}")
                return 2

            post_heartbeat(
                base,
                session_id,
                token,
                label,
                progress=f"Turn {turn}: collecting & submitting artifacts…",
            )
            artifacts = collect_artifacts(work, out_dir)
            if not artifacts:
                invoke_stub(work, out_dir, strengthen=strengthen)
                artifacts = collect_artifacts(work, out_dir)
            artifacts = fill_missing_artifacts(work, out_dir, artifacts)
            _log(
                "submitting artifacts: "
                + ", ".join(a["name"] for a in artifacts)[:500]
            )

            result = http_json(
                "POST",
                result_url,
                {
                    "turn": turn,
                    "summary": f"collab-bridge {args.ai_cli} turn {turn}",
                    "clientNonce": nonce,
                    "artifacts": artifacts,
                },
            )
            decision = result.get("decision")
            verdict = result.get("verdict") or {}
            feedback = verdict.get("feedback")
            missing = verdict.get("missing_criteria") or []
            _log(f"decision={decision} feedback={feedback}")
            if missing:
                _log("missing_criteria=" + "; ".join(str(m) for m in missing)[:800])
            strengthen = True
            if decision == "accept":
                _log(f"DONE pr={result.get('pr_url')} branch={result.get('branch')}")
                post_heartbeat(
                    base,
                    session_id,
                    token,
                    label,
                    progress="Accepted — session complete",
                )
                if args.linger_sec <= 0:
                    return 0
                _log(
                    f"lingering {args.linger_sec}s for Collab chat follow-ups "
                    "(Ctrl+C to exit)"
                )
                linger_deadline = time.time() + args.linger_sec
                while time.time() < linger_deadline:
                    time.sleep(max(1.0, args.poll_ms / 1000.0))
                    left = int(linger_deadline - time.time())
                    post_heartbeat(
                        base,
                        session_id,
                        token,
                        label,
                        progress=f"Idle — waiting for chat follow-up ({left}s left)",
                    )
                    work = http_json("GET", work_url)
                    st = work.get("status")
                    if st == "awaiting_client":
                        _log("follow-up work available — continuing")
                        strengthen = True
                        break
                    if st in ("failed", "cancelled"):
                        return 0 if st == "cancelled" else 1
                else:
                    _log("linger timeout — exiting")
                    return 0
                continue
            if decision == "failed":
                _log(
                    "SESSION FAILED (often max turns exceeded while revise criteria "
                    "remain). Start a NEW session in Collab; increase COLLAB_MAX_TURNS "
                    "and set STUB_FORCE_REVISE_ONCE=false for Devin runs. Do not POST "
                    "to this session again (409)."
                )
                return 1
            post_heartbeat(
                base,
                session_id,
                token,
                label,
                progress=f"Turn {turn}: revise requested — preparing next turn…",
            )
            if args.once:
                _log("--once: exiting after single turn")
                return 0
            time.sleep(0.3)
    except KeyboardInterrupt:
        _log("interrupted")
        return 130
    finally:
        if not args.keep_sandbox and not args.sandbox:
            shutil.rmtree(sandbox_root, ignore_errors=True)
        elif args.keep_sandbox:
            _log(f"kept sandbox at {sandbox_root}")


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="collab-bridge",
        description="One-shot Collab Bridge (outbound poll → local AI CLI)",
    )
    p.add_argument("--version", action="version", version=f"%(prog)s {__version__}")
    sub = p.add_subparsers(dest="command", required=True)

    d = sub.add_parser("doctor", help="Check python / network / AI CLI")
    d.add_argument("--ai-cli", default="devin", choices=("devin", "stub"))
    d.add_argument("session_url", nargs="?", help="Optional session URL to ping")
    d.set_defaults(func=cmd_doctor)

    r = sub.add_parser("run", help="Claim session and fulfill work until done")
    r.add_argument("session_url", help="Collab session URL including ?t=")
    r.add_argument(
        "--ai-cli",
        default=os.environ.get("COLLAB_BRIDGE_AI_CLI", "devin"),
        choices=("devin", "stub"),
    )
    r.add_argument(
        "--poll-ms",
        type=int,
        default=int(os.environ.get("COLLAB_BRIDGE_POLL_MS", "2000")),
    )
    r.add_argument("--once", action="store_true", help="Single turn then exit")
    r.add_argument("--dry-run", action="store_true")
    r.add_argument("--sandbox", help="Reuse this sandbox directory")
    r.add_argument("--keep-sandbox", action="store_true")
    r.add_argument("--ai-timeout", type=int, default=900)
    r.add_argument(
        "--devin-permission-mode",
        default=os.environ.get("COLLAB_BRIDGE_DEVIN_PERMISSION_MODE", "dangerous"),
        choices=("normal", "accept-edits", "smart", "dangerous", "bypass", "autonomous"),
        help=(
            "Devin --permission-mode for headless -p (default: dangerous). "
            "Without this, file writes are auto-rejected in non-interactive mode."
        ),
    )
    r.add_argument(
        "--linger-sec",
        type=int,
        default=int(os.environ.get("COLLAB_BRIDGE_LINGER_SEC", "1800")),
        help="After accept, keep polling for chat follow-ups (0=exit immediately)",
    )
    r.add_argument(
        "--wait-packaging",
        type=int,
        default=120,
        help="Max polls while waiting for awaiting_client",
    )
    r.set_defaults(func=cmd_run)
    return p


def main(argv: list[str] | None = None) -> int:
    raw = list(argv if argv is not None else sys.argv[1:])
    if raw and raw[0] == "--":
        raw = raw[1:]
    parser = build_parser()
    args = parser.parse_args(raw)
    return int(args.func(args))


if __name__ == "__main__":
    sys.exit(main())
