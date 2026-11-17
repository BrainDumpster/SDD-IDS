"""Build and cache Storybook static previews from a GitHub PR head (by SHA).

Cache key = ``{pr_number}-{sha12}``. If that build already exists on disk, preview
reuses it — switching tabs / revisiting does not rebuild.
"""

from __future__ import annotations

import io
import json
import logging
import os
import re
import shutil
import subprocess
import tarfile
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .config import settings
from .github_publish import (
    _headers,
    _httpx_client,
    github_configured,
    parse_github_repo,
)

logger = logging.getLogger(__name__)

_lock = threading.Lock()
# key -> status dict
_builds: dict[str, dict[str, Any]] = {}

_PR_NUM_RE = re.compile(r"/pull/(\d+)")
_SHA_RE = re.compile(r"^[0-9a-f]{7,40}$", re.IGNORECASE)


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _validate_pr_build_inputs(*, pr_number: int, head_sha: str) -> str:
    """Guardrails before any GitHub download / workdir write."""
    if not isinstance(pr_number, int) or pr_number < 1:
        raise ValueError(f"Invalid PR number: {pr_number!r}")
    sha = (head_sha or "").strip().lower()
    if not _SHA_RE.match(sha):
        raise ValueError(
            f"Invalid head SHA for PR build (expected 7–40 hex chars): {head_sha!r}"
        )
    return sha


def _safe_extract_tar(tar: tarfile.TarFile, dest: Path) -> None:
    """Extract tarball under ``dest`` only — never escape via ``../`` members.

    Does **not** touch the Collab monorepo git checkout; work is isolated under
    ``data/storybook_pr_work/``.
    """
    dest = dest.resolve()
    dest.mkdir(parents=True, exist_ok=True)
    # Python 3.12+ data_filter; fall back to member-path checks.
    if hasattr(tarfile, "data_filter"):
        tar.extractall(dest, filter="data")  # type: ignore[call-arg]
        return
    for member in tar.getmembers():
        name = member.name.replace("\\", "/")
        if name.startswith("/") or ".." in Path(name).parts:
            raise RuntimeError(f"Refusing unsafe tar member path: {member.name!r}")
        target = (dest / member.name).resolve()
        if not str(target).startswith(str(dest) + os.sep) and target != dest:
            raise RuntimeError(f"Tar member escapes workdir: {member.name!r}")
        tar.extract(member, dest)


def _persist_build_error(key: str, message: str, log_chunks: list[str] | None) -> Path:
    """Write last failure under builds root so operators can inspect without docker logs."""
    path = builds_root() / f"{key}.error.log"
    try:
        body = [
            f"cacheKey={key}",
            f"at={_utc_now()}",
            f"message={message}",
            "--- log ---",
            *(log_chunks or []),
        ]
        path.write_text("\n".join(body)[-120000:], encoding="utf-8")
    except OSError as exc:
        logger.warning("Could not write Storybook error log %s: %s", path, exc)
    return path


def _summarize_storybook_failure(err_s: str, out_s: str) -> str:
    blob = (err_s or "") + "\n" + (out_s or "")
    lines = [ln.strip() for ln in blob.splitlines() if ln.strip()]
    interesting = [
        ln
        for ln in lines
        if any(
            k in ln.lower()
            for k in (
                "error",
                "failed",
                "unable",
                "cannot",
                "enoent",
                "module not found",
                "syntaxerror",
                "ts(",
                "vite",
            )
        )
    ]
    pick = interesting[-12:] if interesting else lines[-12:]
    return " | ".join(pick)[-900:] if pick else (blob[-400:] or "no stdout/stderr")


def _preflight_story_files(paths: list[Path], *, programme: str, slug: str) -> None:
    """Fail fast with a clear message before invoking Storybook (sub-second failures)."""
    if not paths:
        raise RuntimeError(
            f"No story file for {programme}/{slug} under accepted_workspace or repo"
        )
    for p in paths:
        raw = p.read_text(encoding="utf-8")
        if not raw.strip():
            raise RuntimeError(f"Story file is empty: {p}")
        if "export" not in raw:
            raise RuntimeError(
                f"Story file has no exports (invalid CSF): {p.name}"
            )
        # Classic JSX needs a React binding (normalize_story_source should add it).
        has_jsx = bool(
            re.search(r"=>\s*\(?\s*<", raw)
            or re.search(r"return\s*\(?\s*<", raw)
            or re.search(r"^\s*<[A-Za-z/]", raw, re.MULTILINE)
        )
        if has_jsx and not re.search(
            r"""import\s+React\b|import\s*\*\s*as\s+React\b""",
            raw,
        ):
            raise RuntimeError(
                f"Story CSF uses JSX but has no `import React` "
                f"(would fail Storybook Vite build): {p.name}"
            )


def builds_root() -> Path:
    d = settings.app_root / "data" / "storybook_pr_builds"
    d.mkdir(parents=True, exist_ok=True)
    return d


def cache_key(pr_number: int, head_sha: str) -> str:
    sha = (head_sha or "").strip().lower()
    short = sha[:12] if len(sha) >= 12 else sha or "unknown"
    return f"{int(pr_number)}-{short}"


def parse_pr_number(pr_url: str | None) -> int | None:
    if not pr_url:
        return None
    m = _PR_NUM_RE.search(pr_url)
    return int(m.group(1)) if m else None


def build_dir(key: str) -> Path:
    return builds_root() / key


def is_build_ready(key: str) -> bool:
    return (build_dir(key) / "iframe.html").is_file()


def mount_base_path(key: str) -> str:
    return f"/storybook-pr/{key}/"


def get_build_status(key: str) -> dict[str, Any]:
    with _lock:
        st = dict(_builds.get(key) or {})
    ready = is_build_ready(key)
    if ready and st.get("status") not in ("running",):
        st.update(
            {
                "status": "ready",
                "message": "Storybook build cached for this PR commit",
                "cacheKey": key,
                "basePath": mount_base_path(key),
                "ready": True,
            }
        )
        return st
    if not st:
        st = {
            "status": "missing",
            "message": "No cached Storybook build for this PR commit yet",
            "cacheKey": key,
            "ready": False,
        }
    else:
        st["cacheKey"] = key
        st["ready"] = False
        st["basePath"] = mount_base_path(key)
    return st


def resolve_pr_head(pr_number: int) -> dict[str, Any]:
    ok, missing = github_configured()
    repo = parse_github_repo()
    if not ok or repo is None:
        raise RuntimeError("GitHub not configured: " + ", ".join(missing))
    with _httpx_client(45.0) as client:
        res = client.get(
            f"{repo.api_base}/repos/{repo.full_name}/pulls/{pr_number}",
            headers=_headers(),
        )
        if res.status_code == 404:
            raise FileNotFoundError(f"PR #{pr_number} not found")
        res.raise_for_status()
        pr = res.json()
    head = pr.get("head") or {}
    sha = str(head.get("sha") or "")
    if not sha:
        raise RuntimeError(f"PR #{pr_number} has no head SHA")
    return {
        "number": pr_number,
        "htmlUrl": pr.get("html_url"),
        "title": pr.get("title"),
        "headBranch": head.get("ref"),
        "headSha": sha,
        "cacheKey": cache_key(pr_number, sha),
    }


def start_pr_storybook_build(
    *,
    pr_number: int,
    head_sha: str | None = None,
    force: bool = False,
) -> dict[str, Any]:
    """Build Storybook from PR head tarball. No-op if cache hit (unless force)."""
    if head_sha:
        try:
            head_sha = _validate_pr_build_inputs(
                pr_number=pr_number, head_sha=head_sha
            )
        except ValueError as exc:
            return {
                "status": "error",
                "message": str(exc),
                "ready": False,
            }
        key = cache_key(pr_number, head_sha)
        meta = {
            "number": pr_number,
            "headSha": head_sha,
            "cacheKey": key,
            "htmlUrl": None,
            "title": None,
            "headBranch": None,
        }
    else:
        meta = resolve_pr_head(pr_number)
        key = meta["cacheKey"]
        head_sha = meta["headSha"]

    if not force and is_build_ready(key):
        st = get_build_status(key)
        st["message"] = "Using cached Storybook build for this PR commit (no rebuild)"
        return st

    with _lock:
        cur = _builds.get(key) or {}
        if cur.get("status") == "running":
            return get_build_status(key)
        _builds[key] = {
            "status": "running",
            "message": f"Building Storybook from PR #{pr_number} @ {head_sha[:12]}…",
            "startedAt": _utc_now(),
            "finishedAt": None,
            "logTail": "",
            "prNumber": pr_number,
            "headSha": head_sha,
            "cacheKey": key,
            "ready": False,
            "basePath": mount_base_path(key),
        }

    t = threading.Thread(
        target=_run_pr_build,
        kwargs={"pr_number": pr_number, "head_sha": head_sha, "key": key},
        daemon=True,
        name=f"storybook-pr-{key}",
    )
    t.start()
    return get_build_status(key)


def ensure_pr_build_from_url(pr_url: str | None, *, force: bool = False) -> dict[str, Any] | None:
    num = parse_pr_number(pr_url)
    if num is None:
        return None
    try:
        meta = resolve_pr_head(num)
        return start_pr_storybook_build(
            pr_number=num, head_sha=meta["headSha"], force=force
        )
    except Exception as exc:  # noqa: BLE001
        logger.warning("ensure_pr_build_from_url failed: %s", exc)
        return {
            "status": "error",
            "message": str(exc),
            "ready": False,
        }


def _story_in_pr_build(key: str, *, programme: str, slug: str) -> bool:
    """True when the cached PR build index contains this programme/slug story."""
    if not is_build_ready(key):
        return False
    try:
        from .storybook_preview import (
            load_story_index,
            parse_meta_title,
            resolve_stories_path,
            resolve_story_in_static,
        )
    except Exception:  # noqa: BLE001
        return False

    index = load_story_index(build_dir(key))
    if not index:
        return False
    stories_path = resolve_stories_path(
        settings.repo_root,
        programme,
        slug,
        extra_roots=[settings.app_root / "data" / "accepted_workspace"],
    )
    title = parse_meta_title(stories_path) if stories_path else None
    found = resolve_story_in_static(
        index,
        title=title,
        programme=programme,
        slug=slug,
        stories_path=stories_path,
    )
    return found is not None


def start_filtered_pr_preview_build(
    *,
    pr_number: int,
    head_sha: str,
    programme: str,
    slug: str,
    force: bool = False,
) -> dict[str, Any]:
    """Build a **filtered** Storybook for one PR component from the Review workspace.

    Unlike ``start_pr_storybook_build`` (full GitHub tarball), this:
    - uses only the imported CSF + theme CSS already on disk
    - never mutates shared ``/storybook``
    - caches immutably under ``/storybook-pr/{pr}-{sha12}/``

    Same PR commit + same component = cache hit (no rebuild).
    """
    try:
        sha = _validate_pr_build_inputs(pr_number=pr_number, head_sha=head_sha)
    except ValueError as exc:
        return {
            "status": "error",
            "message": str(exc),
            "ready": False,
        }
    key = cache_key(pr_number, sha)
    prog = (programme or "").strip()
    slug_s = (slug or "").strip()
    if not prog or not slug_s:
        return {
            "status": "error",
            "message": "programme/slug required for filtered PR preview",
            "cacheKey": key,
            "ready": False,
        }

    if not force and _story_in_pr_build(key, programme=prog, slug=slug_s):
        st = get_build_status(key)
        st["message"] = (
            f"Using cached PR preview for #{pr_number} @ {sha[:12]} "
            f"({prog}/{slug_s}) — no rebuild"
        )
        st["filtered"] = True
        st["programme"] = prog
        st["slug"] = slug_s
        return st

    with _lock:
        cur = _builds.get(key) or {}
        if cur.get("status") == "running":
            return get_build_status(key)
        _builds[key] = {
            "status": "running",
            "message": (
                f"Building filtered preview for PR #{pr_number} "
                f"@ {sha[:12]} ({prog}/{slug_s})…"
            ),
            "startedAt": _utc_now(),
            "finishedAt": None,
            "logTail": "",
            "prNumber": pr_number,
            "headSha": sha,
            "cacheKey": key,
            "ready": False,
            "basePath": mount_base_path(key),
            "filtered": True,
            "programme": prog,
            "slug": slug_s,
        }

    t = threading.Thread(
        target=_run_filtered_pr_build,
        kwargs={
            "pr_number": pr_number,
            "head_sha": sha,
            "key": key,
            "programme": prog,
            "slug": slug_s,
        },
        daemon=True,
        name=f"storybook-pr-filtered-{key}",
    )
    t.start()
    return get_build_status(key)


def preview_urls_for_build(
    *,
    key: str,
    story_id: str,
    theme: str = "light",
) -> dict[str, str]:
    base = mount_base_path(key).rstrip("/")
    qs = f"id={story_id}&viewMode=story&globals=theme:{theme}"
    iframe = f"{base}/iframe.html?{qs}"
    manager = (
        f"{base}/index.html?path=/story/{story_id}"
        f"&globals=theme:{theme}&panel=bottom"
        f"&addonPanel=sdd-ids%2Fscratchpad%2Fpanel"
    )
    return {"iframeUrl": iframe, "canvasUrl": iframe, "managerUrl": manager, "basePath": base + "/"}


def _pascal(slug: str) -> str:
    return "".join(p.capitalize() for p in slug.split("-") if p)


def _copy_tree_files(src: Path, dest: Path) -> int:
    n = 0
    if not src.is_dir():
        return 0
    for path in src.rglob("*"):
        if not path.is_file():
            continue
        rel = path.relative_to(src)
        out = dest / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, out)
        n += 1
    return n


def _prepare_filtered_workdir(
    work: Path,
    *,
    programme: str,
    slug: str,
) -> tuple[Path, list[str]]:
    """Create a mini monorepo with only this component's stories + themes.

    Returns ``(storybook_dir, copied_story_rels)``.
    """
    from .storybook_preview import storybook_programme_dir
    from .storybook_rebuild import normalize_story_source

    prog_dir = storybook_programme_dir(programme)
    pascal = _pascal(slug)
    overlay = settings.app_root / "data" / "accepted_workspace"
    repo = settings.repo_root

    # --- stories: ONLY this component (never sibling CSF from overlay) ---
    # Copying every overlay story under the programme made "filtered" builds fail
    # when an unrelated sibling (e.g. Toggle) had broken CSF while building TextBox.
    story_dest_root = work / "storybook-generated"
    copied: list[str] = []
    candidates: list[Path] = []
    for root in (overlay, repo):
        base = root / "storybook-generated" / prog_dir / "src" / "components"
        for name in (f"{pascal}.stories.tsx", f"{pascal}.stories.ts"):
            exact = base / name
            if exact.is_file() and exact not in candidates:
                candidates.append(exact)

    # Prefer accepted_workspace when both exist (same basename).
    by_name: dict[str, Path] = {}
    for src in candidates:
        if src.name not in by_name:
            by_name[src.name] = src

    dest_paths: list[Path] = []
    seen: set[str] = set()
    for src in by_name.values():
        parts = src.parts
        if "storybook-generated" in parts:
            i = parts.index("storybook-generated")
            rel = Path(*parts[i + 1 :])
        else:
            rel = Path(prog_dir) / "src" / "components" / src.name
        rel_key = str(rel).replace("\\", "/")
        if rel_key in seen:
            continue
        seen.add(rel_key)
        dest = story_dest_root / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        raw = src.read_text(encoding="utf-8")
        dest.write_text(normalize_story_source(raw), encoding="utf-8")
        copied.append(f"storybook-generated/{rel_key}")
        dest_paths.append(dest)

    _preflight_story_files(dest_paths, programme=programme, slug=slug)

    if not copied:
        raise RuntimeError(
            f"No story file found for {programme}/{slug} "
            f"(expected `{pascal}.stories.tsx` under "
            "accepted_workspace or repo storybook-generated/)"
        )

    # --- theme CSS ---
    comp_dest = work / "components"
    comp_dest.mkdir(parents=True, exist_ok=True)
    theme_names = {
        "ids-theme.css",
        "synapse-theme.css",
        "dap-theme.css",
        "theme.css",
        f"{programme.lower()}-theme.css",
        f"{prog_dir}-theme.css",
    }
    for root in (overlay, repo):
        cdir = root / "components"
        if not cdir.is_dir():
            continue
        for name in theme_names:
            src = cdir / name
            if src.is_file():
                shutil.copy2(src, comp_dest / name)
        # programme component folder tokens if present (css only)
        prog_comp = cdir / programme
        if prog_comp.is_dir():
            for css in prog_comp.rglob("*.css"):
                rel = css.relative_to(cdir)
                out = comp_dest / rel
                out.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(css, out)

    # --- assets (icons) ---
    assets_src = repo / "assets"
    assets_dest = work / "assets"
    if assets_src.is_dir():
        try:
            if assets_dest.exists() or assets_dest.is_symlink():
                if assets_dest.is_symlink() or assets_dest.is_file():
                    assets_dest.unlink()
                else:
                    shutil.rmtree(assets_dest, ignore_errors=True)
            os.symlink(str(assets_src), str(assets_dest))
        except OSError:
            _copy_tree_files(assets_src / "icons", assets_dest / "icons")

    # --- storybook package (config + linked node_modules) ---
    src_sb = repo / "storybook"
    if not (src_sb / "package.json").is_file():
        raise RuntimeError(f"Missing Collab storybook package at {src_sb}")
    work_sb = work / "storybook"
    work_sb.mkdir(parents=True, exist_ok=True)
    for name in ("package.json", "tsconfig.json", "tsconfig.node.json", ".npmrc"):
        src = src_sb / name
        if src.is_file():
            shutil.copy2(src, work_sb / name)
    sb_config = src_sb / ".storybook"
    if sb_config.is_dir():
        dest_cfg = work_sb / ".storybook"
        if dest_cfg.exists():
            shutil.rmtree(dest_cfg, ignore_errors=True)
        shutil.copytree(sb_config, dest_cfg)

    nm_src = src_sb / "node_modules"
    nm_dest = work_sb / "node_modules"
    if not nm_src.is_dir():
        raise RuntimeError(
            "Storybook node_modules missing in image — rebuild Collab image "
            "with Storybook toolchain"
        )
    if nm_dest.exists() or nm_dest.is_symlink():
        if nm_dest.is_symlink() or nm_dest.is_file():
            nm_dest.unlink()
        else:
            shutil.rmtree(nm_dest, ignore_errors=True)
    try:
        os.symlink(str(nm_src), str(nm_dest))
    except OSError:
        shutil.copytree(nm_src, nm_dest, symlinks=True)

    return work_sb, copied


def _run_filtered_pr_build(
    *,
    pr_number: int,
    head_sha: str,
    key: str,
    programme: str,
    slug: str,
) -> None:
    """Build from accepted_workspace + image storybook toolchain — no git checkout.

    Isolated under ``data/storybook_pr_work/{key}``; never mutates the monorepo
    working tree or runs ``git`` commands.
    """
    try:
        sha = _validate_pr_build_inputs(pr_number=pr_number, head_sha=head_sha)
    except ValueError as exc:
        _fail(key, str(exc), [])
        return

    work = settings.app_root / "data" / "storybook_pr_work" / key
    staging = settings.app_root / "data" / "storybook_pr_staging" / key
    out = build_dir(key)
    log_chunks: list[str] = []

    def _note(msg: str) -> None:
        log_chunks.append(msg)
        with _lock:
            if key in _builds:
                _builds[key]["logTail"] = "\n".join(log_chunks[-40:])
                _builds[key]["message"] = msg

    try:
        # Guardrail: never point work at the real repo root
        if work.resolve() == settings.repo_root.resolve():
            raise RuntimeError("Refusing to use repo_root as Storybook workdir")

        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(staging, ignore_errors=True)
        work.mkdir(parents=True, exist_ok=True)
        staging.mkdir(parents=True, exist_ok=True)

        _note(
            f"Preparing filtered worktree for {programme}/{slug} "
            f"(PR #{pr_number} @ {sha[:12]}; no git — accepted_workspace + image)…"
        )
        storybook_dir, copied = _prepare_filtered_workdir(
            work, programme=programme, slug=slug
        )
        _note(f"Included {len(copied)} story file(s): {', '.join(copied[:4])}")

        env = os.environ.copy()
        env["CI"] = "1"
        env["STORYBOOK_DISABLE_TELEMETRY"] = "1"
        env["STORYBOOK_BASE_PATH"] = mount_base_path(key)
        env["COLLAB_STORYBOOK_SPEC_ONLY"] = "1"

        _note("Building filtered Storybook (usually <1 min)…")
        if shutil.which("pnpm"):
            build_cmd = ["pnpm", "exec", "storybook", "build", "-o", str(staging)]
        else:
            build_cmd = ["npx", "storybook", "build", "-o", str(staging)]
        proc = subprocess.run(
            build_cmd,
            cwd=str(storybook_dir),
            env=env,
            capture_output=True,
            text=True,
            timeout=600,
            check=False,
        )
        out_s = (proc.stdout or "")[-8000:]
        err_s = (proc.stderr or "")[-8000:]
        log_chunks.append(out_s)
        log_chunks.append(err_s)
        if proc.returncode != 0:
            detail = _summarize_storybook_failure(err_s, out_s)
            raise RuntimeError(
                f"filtered storybook build failed (rc={proc.returncode}): {detail}"
            )
        if not (staging / "iframe.html").is_file():
            raise RuntimeError("Filtered build finished but iframe.html missing")

        # Write build meta for operators / future cache checks
        meta = {
            "prNumber": pr_number,
            "headSha": sha,
            "cacheKey": key,
            "programme": programme,
            "slug": slug,
            "filtered": True,
            "stories": copied,
            "builtAt": _utc_now(),
        }
        (staging / ".collab-preview.json").write_text(
            json.dumps(meta, indent=2), encoding="utf-8"
        )

        # Atomic replace of this key only (does not touch shared /storybook)
        _note("Publishing filtered preview cache…")
        final_tmp = out.parent / f".{key}.publishing"
        shutil.rmtree(final_tmp, ignore_errors=True)
        shutil.move(str(staging), str(final_tmp))
        if out.exists():
            shutil.rmtree(out, ignore_errors=True)
        shutil.move(str(final_tmp), str(out))
        # Clear prior error log on success
        err_log = builds_root() / f"{key}.error.log"
        if err_log.is_file():
            err_log.unlink(missing_ok=True)

        with _lock:
            _builds[key] = {
                "status": "ready",
                "message": (
                    f"Filtered PR preview ready (#{pr_number} @ {sha[:12]} "
                    f"— {programme}/{slug})"
                ),
                "startedAt": _builds.get(key, {}).get("startedAt"),
                "finishedAt": _utc_now(),
                "logTail": "\n".join(log_chunks[-40:]),
                "prNumber": pr_number,
                "headSha": sha,
                "cacheKey": key,
                "ready": True,
                "basePath": mount_base_path(key),
                "filtered": True,
                "programme": programme,
                "slug": slug,
            }
        logger.info("Filtered PR Storybook ready %s → %s", key, out)
    except Exception as exc:  # noqa: BLE001
        logger.exception("Filtered PR Storybook build failed for %s", key)
        _fail(key, str(exc), log_chunks)
    finally:
        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(staging, ignore_errors=True)


def _run_pr_build(*, pr_number: int, head_sha: str, key: str) -> None:
    """Full PR Storybook via GitHub **tarball** (no ``git clone`` / checkout).

    Isolated under ``data/storybook_pr_work/{key}``. Never runs git against
    ``settings.repo_root``.
    """
    try:
        sha = _validate_pr_build_inputs(pr_number=pr_number, head_sha=head_sha)
    except ValueError as exc:
        _fail(key, str(exc), [])
        return

    repo = parse_github_repo()
    if repo is None:
        _fail(key, "GitHub repo not configured")
        return

    work = settings.app_root / "data" / "storybook_pr_work" / key
    staging = settings.app_root / "data" / "storybook_pr_staging" / key
    out = build_dir(key)
    log_chunks: list[str] = []

    def _note(msg: str) -> None:
        log_chunks.append(msg)
        with _lock:
            if key in _builds:
                _builds[key]["logTail"] = "\n".join(log_chunks[-40:])
                _builds[key]["message"] = msg

    try:
        if work.resolve() == settings.repo_root.resolve():
            raise RuntimeError("Refusing to use repo_root as Storybook workdir")

        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(staging, ignore_errors=True)
        work.mkdir(parents=True, exist_ok=True)
        staging.mkdir(parents=True, exist_ok=True)

        _note(f"Downloading PR #{pr_number} tree @ {sha[:12]} (tarball; no git)…")
        # GitHub API returns 302 → codeload.github.com; must follow redirects.
        # Cross-host redirects drop Authorization; Location usually carries a
        # short-lived token (required for private repos).
        tarball_url = (
            f"{repo.api_base}/repos/{repo.full_name}/tarball/{sha}"
        )
        with _httpx_client(180.0) as client:
            with client.stream(
                "GET",
                tarball_url,
                headers=_headers(),
                follow_redirects=True,
            ) as res:
                res.raise_for_status()
                buf = io.BytesIO()
                for chunk in res.iter_bytes():
                    buf.write(chunk)
                buf.seek(0)
                with tarfile.open(fileobj=buf, mode="r:gz") as tar:
                    # GitHub wraps in owner-repo-sha/ — extract safely only under work
                    _safe_extract_tar(tar, work)

        roots = [p for p in work.iterdir() if p.is_dir()]
        if not roots:
            raise RuntimeError("Empty tarball from GitHub")
        src_root = roots[0]
        # Guardrail: extracted tree must stay under work
        if not str(src_root.resolve()).startswith(str(work.resolve()) + os.sep):
            raise RuntimeError("Extracted tarball root escaped workdir")
        storybook_dir = src_root / "storybook"
        if not (storybook_dir / "package.json").is_file():
            raise RuntimeError("PR tree has no storybook/package.json")

        # Reuse image node_modules when present (fast path) — read-only link
        image_nm = settings.repo_root / "storybook" / "node_modules"
        target_nm = storybook_dir / "node_modules"
        if image_nm.is_dir() and not target_nm.exists():
            _note("Linking Storybook node_modules from Collab image…")
            try:
                os.symlink(str(image_nm), str(target_nm))
            except OSError:
                _note("Symlink failed — copying node_modules (slow)…")
                shutil.copytree(image_nm, target_nm, symlinks=True)

        env = os.environ.copy()
        env["CI"] = "1"
        env["STORYBOOK_DISABLE_TELEMETRY"] = "1"
        env["STORYBOOK_BASE_PATH"] = mount_base_path(key)
        env["COLLAB_STORYBOOK_SPEC_ONLY"] = "1"

        if not (storybook_dir / "node_modules" / "storybook").exists():
            _note("Installing Storybook dependencies…")
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
            log_chunks.append((proc.stdout or "")[-1500:])
            log_chunks.append((proc.stderr or "")[-1500:])
            if proc.returncode != 0:
                raise RuntimeError(
                    f"pnpm/npm install failed: {(proc.stderr or proc.stdout or '')[-400:]}"
                )

        _note("Building Storybook static from PR branch (1–3 min)…")
        if shutil.which("pnpm"):
            build_cmd = ["pnpm", "exec", "storybook", "build", "-o", str(staging)]
        else:
            build_cmd = ["npx", "storybook", "build", "-o", str(staging)]
        proc = subprocess.run(
            build_cmd,
            cwd=str(storybook_dir),
            env=env,
            capture_output=True,
            text=True,
            timeout=900,
            check=False,
        )
        out_s = (proc.stdout or "")[-8000:]
        err_s = (proc.stderr or "")[-8000:]
        log_chunks.append(out_s)
        log_chunks.append(err_s)
        if proc.returncode != 0:
            detail = _summarize_storybook_failure(err_s, out_s)
            raise RuntimeError(
                f"storybook build failed (rc={proc.returncode}): {detail}"
            )
        if not (staging / "iframe.html").is_file():
            raise RuntimeError("Build finished but iframe.html missing")

        if out.exists():
            shutil.rmtree(out, ignore_errors=True)
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(str(staging), str(out))
        err_log = builds_root() / f"{key}.error.log"
        if err_log.is_file():
            err_log.unlink(missing_ok=True)

        with _lock:
            _builds[key] = {
                "status": "ready",
                "message": "Storybook build ready (cached for this PR commit)",
                "startedAt": _builds.get(key, {}).get("startedAt"),
                "finishedAt": _utc_now(),
                "logTail": "\n".join(log_chunks[-40:]),
                "prNumber": pr_number,
                "headSha": sha,
                "cacheKey": key,
                "ready": True,
                "basePath": mount_base_path(key),
            }
        _note("Storybook PR build cached — tab switches will reuse this build")
    except Exception as exc:  # noqa: BLE001
        logger.exception("PR Storybook build failed for %s", key)
        _fail(key, str(exc), log_chunks)
    finally:
        shutil.rmtree(work, ignore_errors=True)
        shutil.rmtree(staging, ignore_errors=True)


def _fail(key: str, message: str, log_chunks: list[str] | None = None) -> None:
    err_path = _persist_build_error(key, message, log_chunks)
    with _lock:
        prev = _builds.get(key) or {}
        _builds[key] = {
            "status": "error",
            "message": message,
            "startedAt": prev.get("startedAt"),
            "finishedAt": _utc_now(),
            "logTail": "\n".join((log_chunks or [])[-40:]),
            "cacheKey": key,
            "ready": False,
            "basePath": mount_base_path(key),
            "errorLog": str(err_path.name),
        }
