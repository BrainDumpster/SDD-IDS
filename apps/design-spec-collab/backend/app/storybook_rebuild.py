"""Rebuild Collab Storybook static preview after new stories are materialized.

Requires Node + pnpm + storybook node_modules in the image (see Dockerfile).
"""

from __future__ import annotations

import logging
import os
import re
import shutil
import subprocess
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import settings

logger = logging.getLogger(__name__)

_ANSI_RE = re.compile(r"\x1b\[[0-9;]*[mK]|[\x1b\[][0-9;]*[A-Za-z]")

_lock = threading.Lock()
_state: dict[str, Any] = {
    "status": "idle",  # idle | running | ok | error | unavailable
    "message": "",
    "startedAt": None,
    "finishedAt": None,
    "logTail": "",
    "enabled": None,
}


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _strip_ansi(text: str) -> str:
    return _ANSI_RE.sub("", text or "")


def _persist_log(text: str) -> None:
    try:
        path = settings.app_root / "data" / "storybook_rebuild_last.log"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text[-100_000:], encoding="utf-8")
    except OSError as exc:
        logger.warning("Could not persist storybook rebuild log: %s", exc)


def _extract_build_failure(stdout: str, stderr: str) -> str:
    """Pick the actionable Vite/rollup line; ignore generic 'Build failed in Xs'."""
    combined = _strip_ansi(f"{stderr or ''}\n{stdout or ''}").strip()
    if not combined:
        return "(no storybook stdout/stderr captured)"

    lines = [ln.strip() for ln in combined.splitlines() if ln.strip()]
    prefer: list[str] = []
    secondary: list[str] = []
    for ln in lines:
        low = ln.lower()
        if "build failed in" in low and "could not resolve" not in low:
            continue
        if "✗" in ln and "build failed" in low:
            continue
        if "could not resolve" in low or "enoent" in low or "module not found" in low:
            prefer.append(ln)
        elif "failed to resolve" in low or "error when" in low:
            prefer.append(ln)
        elif low.startswith("error:") or "error ts" in low or "rollup failed" in low:
            secondary.append(ln)

    picked = prefer or secondary
    if picked:
        # Keep unique, last/most specific first
        seen: set[str] = set()
        uniq: list[str] = []
        for ln in reversed(picked):
            if ln in seen:
                continue
            seen.add(ln)
            uniq.append(ln)
            if len(uniq) >= 4:
                break
        return " | ".join(reversed(uniq))

    # Fallback: last non-empty lines that aren't pure chrome
    useful = [
        ln
        for ln in lines
        if "building" not in ln.lower()
        and "vite v" not in ln.lower()
        and "transforming" not in ln.lower()
    ]
    return "\n".join(useful[-12:])[-1500:]


def _assets_preflight() -> None:
    """Stories import ../../../../assets/icons/* — fail fast with a clear message."""
    icons = settings.repo_root / "assets" / "icons"
    probe = icons / "logo-delltech-horiz.svg"
    if probe.is_file():
        return
    raise RuntimeError(
        f"Missing {probe}. In-container Storybook rebuild needs assets/icons "
        "(Synapse About / Masthead stories). Rebuild the Collab image "
        "(Dockerfile COPY assets → /workspace/assets) or mount the monorepo "
        "assets folder at /workspace/assets."
    )


def _normalize_story_theme_imports(text: str) -> str:
    """Rewrite bare ``components/*-theme.css`` imports to repo-relative paths.

    Client agents often emit ``import 'components/powerflex-theme.css'`` which
    Vite/Rollup cannot resolve without an alias. Spec-generated stories live at
    ``storybook-generated/<prog>/src/components/*.stories.tsx`` → four levels up.
    """
    return re.sub(
        r"""import\s+(['"])components/([^'"]+-theme\.css)\1\s*;?""",
        r'import "../../../../components/\2";',
        text,
    )


def _ensure_react_import(text: str) -> str:
    """Add ``import React from "react"`` when JSX / ``React.*`` needs the default.

    Named-only imports (``import type { … } from "react"``, ``import { useState }``)
    are **not** enough for classic JSX — Storybook still throws ``React is not defined``.
    """
    if re.search(
        r"""import\s+React\b|import\s*\*\s*as\s+React\b""",
        text,
    ):
        return text
    needs = ("React." in text) or bool(
        re.search(r"return\s*\(\s*<|=>\s*\(\s*<|=>\s*<\w", text)
    )
    if not needs:
        # Heuristic: CSF with JSX tags (render / args children)
        needs = bool(re.search(r"<\w[\w.-]*(\s|>|/)", text)) and (
            "StoryObj" in text or "Meta<" in text or "satisfies Meta" in text
        )
    if not needs:
        # Any .stories.tsx-shaped file with JSX-looking markup
        needs = bool(re.search(r"export\s+const\s+\w+.*=.*<", text, re.DOTALL))
    if not needs:
        return text
    return 'import React from "react";\n' + text


def normalize_story_source(text: str) -> str:
    """Apply all Collab story source fixes before materialize / rebuild."""
    return _ensure_react_import(_normalize_story_theme_imports(text))


def _sync_accepted_workspace() -> None:
    """Copy accepted_workspace stories + theme CSS into REPO_ROOT before build."""
    overlay_root = settings.app_root / "data" / "accepted_workspace"
    if not overlay_root.is_dir():
        return

    # Programme themes and any nested design-spec paths needed by stories
    overlay_components = overlay_root / "components"
    dest_components = settings.repo_root / "components"
    if overlay_components.is_dir():
        for src in overlay_components.rglob("*"):
            if not src.is_file():
                continue
            rel = src.relative_to(overlay_components)
            dest = dest_components / rel
            try:
                dest.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dest)
            except OSError as exc:
                logger.warning("Could not sync accepted component file %s: %s", rel, exc)

    overlay_stories = overlay_root / "storybook-generated"
    dest_stories = settings.repo_root / "storybook-generated"
    if not overlay_stories.is_dir():
        return
    for src in overlay_stories.rglob("*.stories.*"):
        if not src.is_file():
            continue
        rel = src.relative_to(overlay_stories)
        dest = dest_stories / rel
        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            raw = src.read_text(encoding="utf-8")
            fixed = normalize_story_source(raw)
            dest.write_text(fixed, encoding="utf-8")
            if fixed != raw:
                logger.info("Normalized story source for %s", rel)
        except OSError as exc:
            logger.warning("Could not sync accepted story %s: %s", rel, exc)


def rebuild_toolchain_available() -> tuple[bool, str]:
    """True when we can run an in-container Storybook static build."""
    storybook_dir = settings.repo_root / "storybook"
    if not (storybook_dir / "package.json").is_file():
        return False, f"Missing {storybook_dir / 'package.json'}"
    node = shutil.which("node")
    pnpm = shutil.which("pnpm")
    npx = shutil.which("npx")
    if not node:
        return False, "node not found on PATH (rebuild image with Storybook toolchain)"
    if not pnpm and not npx:
        return False, "pnpm/npx not found on PATH"
    icons = settings.repo_root / "assets" / "icons" / "logo-delltech-horiz.svg"
    if not icons.is_file():
        return (
            False,
            "Missing /workspace/assets/icons (needed for Storybook rebuild). "
            "Rebuild image or mount monorepo assets at /workspace/assets.",
        )
    return True, "ok"


def get_rebuild_status() -> dict[str, Any]:
    with _lock:
        out = dict(_state)
    available, reason = rebuild_toolchain_available()
    out["toolchainAvailable"] = available
    if not available and out.get("status") == "idle":
        out["enabled"] = False
        out["unavailableReason"] = reason
    else:
        out["enabled"] = available and settings.storybook_rebuild_enabled
    # Expose last on-disk log path for operators
    log_path = settings.app_root / "data" / "storybook_rebuild_last.log"
    if log_path.is_file():
        out["logFile"] = str(log_path)
    return out


def start_storybook_rebuild(*, reason: str = "manual") -> dict[str, Any]:
    """Kick off a background static rebuild; no-op if already running."""
    if not settings.storybook_rebuild_enabled:
        st = get_rebuild_status()
        st["status"] = "unavailable"
        st["message"] = "STORYBOOK_REBUILD_ENABLED=false"
        return st

    available, why = rebuild_toolchain_available()
    if not available:
        with _lock:
            _state.update(
                {
                    "status": "unavailable",
                    "message": why,
                    "finishedAt": _utc_now(),
                }
            )
        return get_rebuild_status()

    with _lock:
        if _state.get("status") == "running":
            return get_rebuild_status()
        _state.update(
            {
                "status": "running",
                "message": f"Rebuilding Storybook static preview ({reason})…",
                "startedAt": _utc_now(),
                "finishedAt": None,
                "logTail": "",
                "reason": reason,
            }
        )

    t = threading.Thread(
        target=_run_rebuild,
        kwargs={"reason": reason},
        daemon=True,
        name="storybook-rebuild",
    )
    t.start()
    return get_rebuild_status()


def _publish_static_overlay(staging: Path, out_dir: Path) -> None:
    """Copy a finished Storybook build onto the live static root safely.

    Strategy:
    1. Overlay-copy every file from staging → out_dir (add/overwrite only).
    2. Copy entrypoints (index.json / iframe.html) last so the browser never
       resolves a story id whose chunk is not on disk yet.
    3. Then prune files in out_dir that are absent from staging.

    Never deletes the ``out_dir`` inode and never empties ``assets/`` before the
    new files land — that race produced missing CSF chunks and wedged uvicorn.
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    entrypoint_names = {
        "index.json",
        "stories.json",
        "iframe.html",
        "index.html",
        "project.json",
        "nunjucks.js",
    }

    def _copy_file(src: Path, dest: Path) -> None:
        dest.parent.mkdir(parents=True, exist_ok=True)
        tmp = dest.with_name(dest.name + ".publishing")
        try:
            shutil.copy2(src, tmp)
            tmp.replace(dest)
        finally:
            if tmp.exists():
                try:
                    tmp.unlink()
                except OSError:
                    pass

    files = [p for p in staging.rglob("*") if p.is_file()]
    files.sort(
        key=lambda p: (
            1 if p.name in entrypoint_names and p.parent == staging else 0,
            str(p.relative_to(staging)),
        )
    )
    for src in files:
        rel = src.relative_to(staging)
        try:
            _copy_file(src, out_dir / rel)
        except OSError as exc:
            raise RuntimeError(f"Failed to publish {rel}: {exc}") from exc

    staging_files = {p.relative_to(staging) for p in files}
    for dest in list(out_dir.rglob("*")):
        if not dest.is_file():
            continue
        rel = dest.relative_to(out_dir)
        if rel in staging_files:
            continue
        try:
            dest.unlink()
        except OSError as exc:
            logger.warning("Could not prune stale static file %s: %s", rel, exc)

    for dest in sorted(
        (p for p in out_dir.rglob("*") if p.is_dir()),
        key=lambda p: len(p.parts),
        reverse=True,
    ):
        try:
            dest.rmdir()
        except OSError:
            pass


def _run_rebuild(*, reason: str) -> None:
    storybook_dir = settings.repo_root / "storybook"
    out_dir = (
        settings.storybook_static_dir
        if settings.storybook_static_dir is not None
        else settings.app_root / "storybook-static"
    )
    staging = settings.app_root / "storybook-static.building"
    env = os.environ.copy()
    env["CI"] = "1"
    env["STORYBOOK_DISABLE_TELEMETRY"] = "1"
    env["STORYBOOK_BASE_PATH"] = "/storybook/"
    # Belt-and-suspenders with main.ts: only storybook-generated Spec Accurate Design
    # (never storybook/src hand stories / joe-generated broken imports).
    env["COLLAB_STORYBOOK_SPEC_ONLY"] = "1"

    log_chunks: list[str] = []

    def _note(msg: str) -> None:
        log_chunks.append(msg)
        with _lock:
            _state["logTail"] = "\n".join(log_chunks[-40:])
            _state["message"] = msg

    try:
        _assets_preflight()
        _sync_accepted_workspace()

        if staging.exists():
            shutil.rmtree(staging, ignore_errors=True)
        staging.mkdir(parents=True, exist_ok=True)

        # Ensure deps (image usually ships node_modules)
        if not (storybook_dir / "node_modules" / "storybook").exists():
            _note("Installing Storybook dependencies (first rebuild)…")
            install_cmd = (
                ["pnpm", "install", "--no-frozen-lockfile"]
                if shutil.which("pnpm")
                else ["npm", "install"]
            )
            proc = subprocess.run(
                install_cmd,
                cwd=str(storybook_dir),
                env=env,
                capture_output=True,
                text=True,
                timeout=600,
                check=False,
            )
            log_chunks.append(_strip_ansi((proc.stdout or "")[-2000:]))
            log_chunks.append(_strip_ansi((proc.stderr or "")[-2000:]))
            if proc.returncode != 0:
                raise RuntimeError(
                    f"Dependency install failed (rc={proc.returncode}). "
                    f"{_strip_ansi((proc.stderr or proc.stdout or ''))[-500:]}"
                )

        _note("Building Storybook static (may take 1–3 minutes)…")
        if shutil.which("pnpm"):
            build_cmd = [
                "pnpm",
                "exec",
                "storybook",
                "build",
                "-o",
                str(staging),
            ]
        else:
            build_cmd = [
                "npx",
                "storybook",
                "build",
                "-o",
                str(staging),
            ]
        proc = subprocess.run(
            build_cmd,
            cwd=str(storybook_dir),
            env=env,
            capture_output=True,
            text=True,
            timeout=900,
            check=False,
        )
        out_s = _strip_ansi(proc.stdout or "")
        err_s = _strip_ansi(proc.stderr or "")
        log_chunks.append(out_s[-8000:])
        log_chunks.append(err_s[-8000:])
        _persist_log(f"reason={reason}\nexit={proc.returncode}\n\nSTDERR:\n{err_s}\n\nSTDOUT:\n{out_s}\n")
        if proc.returncode != 0:
            raise RuntimeError(
                f"storybook build failed (rc={proc.returncode}). "
                f"{_extract_build_failure(out_s, err_s)}"
            )
        if not (staging / "iframe.html").is_file():
            raise RuntimeError("Build finished but iframe.html missing")

        # Overlay publish into the live static dir. Do NOT rmtree/rename ``out_dir``
        # itself (StaticFiles keeps that path open — deleting the inode wedges
        # uvicorn). Also avoid wiping ``assets/`` before copy: concurrent iframe
        # requests mid-delete cause missing modules / "Couldn't find story id".
        _note("Publishing Storybook static into live preview dir…")
        _publish_static_overlay(staging, out_dir)
        shutil.rmtree(staging, ignore_errors=True)

        with _lock:
            _state.update(
                {
                    "status": "ok",
                    "message": "Storybook preview rebuilt — refresh the Storybook tab.",
                    "finishedAt": _utc_now(),
                    "logTail": "\n".join(log_chunks[-40:]),
                    "reason": reason,
                }
            )
        logger.info("Storybook static rebuild ok (%s) → %s", reason, out_dir)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Storybook static rebuild failed")
        msg = f"Storybook rebuild failed: {exc}"
        with _lock:
            _state.update(
                {
                    "status": "error",
                    "message": msg,
                    "finishedAt": _utc_now(),
                    "logTail": "\n".join(log_chunks[-40:]),
                }
            )
        _persist_log(msg + "\n\n" + "\n".join(log_chunks[-80:]))
        # Leave previous static dir intact if swap failed mid-way
        if staging.exists() and not (out_dir / "iframe.html").is_file():
            shutil.rmtree(staging, ignore_errors=True)
