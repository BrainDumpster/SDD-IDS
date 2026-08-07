"""Review Workspace: list Collab-generated PRs and import head files for Spec/Storybook preview."""

from __future__ import annotations

import base64
import json
import logging
import re
import secrets
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
from .storybook_pr_build import (
    cache_key,
    get_build_status,
    start_filtered_pr_preview_build,
)
from .storybook_rebuild import get_rebuild_status

logger = logging.getLogger(__name__)

_COLLAB_BRANCH = re.compile(r"^(collab|update)/", re.IGNORECASE)
_COLLAB_TITLE = re.compile(
    r"(design-spec-collab:|Update design-spec:|Design Spec Collab)",
    re.IGNORECASE,
)
_DESIGN_SPEC_PATH = re.compile(
    r"^components/([^/]+)/([^/]+)/design-spec\.md$",
    re.IGNORECASE,
)
_STORIES_PATH = re.compile(
    r"^storybook-generated/([^/]+)/src/components/([^/]+)\.stories\.tsx?$",
    re.IGNORECASE,
)

_MAX_FILE_BYTES = 1_500_000
_MAX_FILES = 80

_ALLOW_SUFFIXES = (
    "/design-spec.md",
    ".stories.tsx",
    ".stories.ts",
    "-theme.css",
    "/root-spec.md",
)
_ALLOW_PREFIXES = (
    "components/",
    "storybook-generated/",
    "data/",
    "config/design_systems/",
)
_ALLOW_NAME_SUFFIXES = (
    "-component-figma-map.json",
    "programme-inheritance-registry.json",
)


def review_sessions_dir() -> Path:
    d = settings.app_root / "data" / "review_sessions"
    d.mkdir(parents=True, exist_ok=True)
    return d


def accepted_workspace_root() -> Path:
    d = settings.app_root / "data" / "accepted_workspace"
    d.mkdir(parents=True, exist_ok=True)
    return d


def _utc_now() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _is_collab_pr(pr: dict[str, Any]) -> bool:
    head = ((pr.get("head") or {}).get("ref") or "").strip()
    title = (pr.get("title") or "").strip()
    body = (pr.get("body") or "").strip()
    if _COLLAB_BRANCH.match(head):
        return True
    if _COLLAB_TITLE.search(title) or _COLLAB_TITLE.search(body):
        return True
    return False


def _infer_from_paths(paths: list[str]) -> tuple[str | None, str | None, str | None]:
    """Return programme, slug, design_spec_path from changed paths."""
    design_path = None
    programme = None
    slug = None
    for p in paths:
        m = _DESIGN_SPEC_PATH.match(p.replace("\\", "/"))
        if m:
            programme = m.group(1).lower()
            slug = m.group(2).lower()
            design_path = p.replace("\\", "/")
            break
    if not slug:
        for p in paths:
            m = _STORIES_PATH.match(p.replace("\\", "/"))
            if m:
                programme = m.group(1).lower()
                pascal = m.group(2)
                # ToggleSwitch -> toggle-switch (best-effort)
                slug = re.sub(r"(?<!^)(?=[A-Z])", "-", pascal).lower()
                break
    # Branch collab/toggle-switch-abc12345
    return programme, slug, design_path


def _infer_from_branch(branch: str) -> tuple[str | None, str | None]:
    # collab/toggle-switch-dxE2kzUh or update/text-box-deadbeef
    m = re.match(r"^(?:collab|update)/([a-z0-9-]+)-([a-zA-Z0-9_-]{6,})$", branch or "")
    if m:
        return None, m.group(1).lower()
    m2 = re.match(r"^(?:collab|update)/([a-z0-9-]+)$", branch or "")
    if m2:
        return None, m2.group(1).lower()
    return None, None


def _path_allowed(path: str) -> bool:
    norm = path.replace("\\", "/").lstrip("./")
    if ".." in norm.split("/"):
        return False
    if not any(norm.startswith(p) for p in _ALLOW_PREFIXES):
        return False
    if any(norm.endswith(s) for s in _ALLOW_SUFFIXES):
        return True
    if any(norm.endswith(s) for s in _ALLOW_NAME_SUFFIXES):
        return True
    if "/src/spec-contracts/" in norm and norm.endswith(".json"):
        return True
    return False


def _enrich_from_jobs(
    items: list[dict[str, Any]], jobs: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    by_url: dict[str, dict[str, Any]] = {}
    by_num: dict[int, dict[str, Any]] = {}
    for j in jobs:
        url = (j.get("pr_url") or "").strip()
        if not url or "dry_run=1" in url:
            continue
        by_url[url.rstrip("/")] = j
        m = re.search(r"/pull/(\d+)", url)
        if m:
            by_num[int(m.group(1))] = j
    for item in items:
        j = by_url.get((item.get("htmlUrl") or "").rstrip("/")) or by_num.get(
            int(item.get("number") or 0)
        )
        if not j:
            continue
        prev = j.get("preview") or {}
        item["jobId"] = j.get("job_id")
        item["programme"] = item.get("programme") or prev.get("programme")
        item["slug"] = item.get("slug") or prev.get("slug")
        item["componentDisplayName"] = (
            prev.get("component_display_name")
            or prev.get("componentDisplayName")
            or item.get("slug")
        )
    return items


def list_collab_pull_requests(
    *,
    state: str = "open",
    limit: int = 30,
    slug: str | None = None,
    jobs: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    ok, missing = github_configured()
    repo = parse_github_repo()
    if not ok or repo is None:
        return {
            "available": False,
            "missing": missing,
            "pullRequests": [],
            "message": "GitHub is not configured (GITHUB_TOKEN + repo).",
        }

    state_q = state if state in ("open", "closed", "all") else "open"
    per_page = min(max(limit * 2, 30), 100)
    url = f"{repo.api_base}/repos/{repo.full_name}/pulls"
    try:
        with _httpx_client(45.0) as client:
            res = client.get(
                url,
                headers=_headers(),
                params={
                    "state": state_q,
                    "per_page": per_page,
                    # Latest first (GitHub default for created is desc; be explicit).
                    "sort": "created",
                    "direction": "desc",
                },
            )
            res.raise_for_status()
            raw = res.json()
    except Exception as exc:  # noqa: BLE001
        logger.exception("list pull requests failed")
        return {
            "available": False,
            "missing": [],
            "pullRequests": [],
            "message": f"GitHub list PRs failed: {exc}",
        }

    items: list[dict[str, Any]] = []
    slug_l = (slug or "").strip().lower() or None
    for pr in raw if isinstance(raw, list) else []:
        if not isinstance(pr, dict) or not _is_collab_pr(pr):
            continue
        head = (pr.get("head") or {}) if isinstance(pr.get("head"), dict) else {}
        branch = str(head.get("ref") or "")
        _, branch_slug = _infer_from_branch(branch)
        title = str(pr.get("title") or "")
        # Prefer slug from title "design-spec-collab: foo" / "Update design-spec: foo"
        title_slug = None
        tm = re.search(
            r"(?:design-spec-collab:|Update design-spec:)\s*([a-z0-9-]+)",
            title,
            re.IGNORECASE,
        )
        if tm:
            title_slug = tm.group(1).lower()
        inferred_slug = title_slug or branch_slug
        if slug_l and inferred_slug and inferred_slug != slug_l:
            continue
        if slug_l and not inferred_slug and slug_l not in title.lower() and slug_l not in branch.lower():
            continue
        items.append(
            {
                "number": pr.get("number"),
                "title": title,
                "htmlUrl": pr.get("html_url"),
                "headBranch": branch,
                "headSha": head.get("sha"),
                "state": pr.get("state"),
                "draft": bool(pr.get("draft")),
                "updatedAt": pr.get("updated_at"),
                "createdAt": pr.get("created_at"),
                "user": ((pr.get("user") or {}) or {}).get("login"),
                "programme": None,
                "slug": inferred_slug,
                "jobId": None,
                "componentDisplayName": inferred_slug,
            }
        )
        if len(items) >= limit * 3:
            # Fetch a bit more before sorting/trimming so filters still yield latest.
            break

    # Latest first: PR number desc (newest Collab PRs), then createdAt.
    items.sort(
        key=lambda row: (
            int(row.get("number") or 0),
            str(row.get("createdAt") or ""),
        ),
        reverse=True,
    )
    items = items[:limit]

    if jobs:
        items = _enrich_from_jobs(items, jobs)

    return {
        "available": True,
        "repo": repo.full_name,
        "state": state_q,
        "pullRequests": items,
        "count": len(items),
    }


def _list_pr_files(repo_full: str, api_base: str, number: int) -> list[str]:
    url = f"{api_base}/repos/{repo_full}/pulls/{number}/files"
    paths: list[str] = []
    page = 1
    with _httpx_client(60.0) as client:
        while page <= 5:
            res = client.get(
                url,
                headers=_headers(),
                params={"per_page": 100, "page": page},
            )
            res.raise_for_status()
            batch = res.json()
            if not isinstance(batch, list) or not batch:
                break
            for row in batch:
                if isinstance(row, dict) and row.get("filename"):
                    paths.append(str(row["filename"]).replace("\\", "/"))
            if len(batch) < 100:
                break
            page += 1
    return paths


def _fetch_file_content(
    repo_full: str, api_base: str, path: str, ref: str
) -> str | None:
    url = f"{api_base}/repos/{repo_full}/contents/{path}"
    with _httpx_client(60.0) as client:
        res = client.get(url, headers=_headers(), params={"ref": ref})
        if res.status_code == 404:
            return None
        res.raise_for_status()
        data = res.json()
    if not isinstance(data, dict):
        return None
    if data.get("encoding") == "base64" and data.get("content"):
        raw = base64.b64decode(data["content"])
        if len(raw) > _MAX_FILE_BYTES:
            raise ValueError(f"File too large: {path} ({len(raw)} bytes)")
        return raw.decode("utf-8")
    if isinstance(data.get("content"), str) and not data.get("encoding"):
        return data["content"]
    # Fallback: download_url
    dl = data.get("download_url")
    if dl:
        with _httpx_client(60.0) as client:
            r2 = client.get(dl, headers=_headers())
            r2.raise_for_status()
            raw = r2.content
            if len(raw) > _MAX_FILE_BYTES:
                raise ValueError(f"File too large: {path}")
            return raw.decode("utf-8")
    return None


def _write_workspace(rel: str, content: str) -> list[str]:
    written: list[str] = []
    text = content
    rel_norm = rel.replace("\\", "/")
    if "stories." in rel_norm and rel_norm.endswith((".tsx", ".ts")):
        from .storybook_rebuild import normalize_story_source

        text = normalize_story_source(content)
    roots = [accepted_workspace_root()]
    # Also try repo_root when writable (local dev)
    try:
        roots.append(settings.repo_root)
    except Exception:  # noqa: BLE001
        pass
    for root in roots:
        dest = root / rel
        try:
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(text, encoding="utf-8")
            written.append(str(dest))
        except OSError as exc:
            logger.warning("Could not write %s under %s: %s", rel, root, exc)
    return written


def import_pull_request(number: int, *, start_rebuild: bool = True) -> dict[str, Any]:
    ok, missing = github_configured()
    repo = parse_github_repo()
    if not ok or repo is None:
        raise RuntimeError("GitHub is not configured: " + ", ".join(missing))

    logger.info("Review import: fetching PR #%s…", number)
    with _httpx_client(45.0) as client:
        pr_res = client.get(
            f"{repo.api_base}/repos/{repo.full_name}/pulls/{number}",
            headers=_headers(),
        )
        if pr_res.status_code == 404:
            raise FileNotFoundError(f"Pull request #{number} not found")
        pr_res.raise_for_status()
        pr = pr_res.json()

    if not _is_collab_pr(pr):
        raise ValueError(
            f"PR #{number} does not look like a Design Spec Collab PR "
            "(expected collab/ or update/ branch, or Collab title/body)."
        )

    head = pr.get("head") or {}
    sha = str(head.get("sha") or "")
    branch = str(head.get("ref") or "")
    if not sha:
        raise RuntimeError(f"PR #{number} has no head SHA")

    logger.info("Review import: listing files for PR #%s @ %s…", number, sha[:12])
    all_paths = _list_pr_files(repo.full_name, repo.api_base, number)
    allowed = [p for p in all_paths if _path_allowed(p)]
    if len(allowed) > _MAX_FILES:
        allowed = allowed[:_MAX_FILES]

    imported: list[str] = []
    errors: list[str] = []
    for path in allowed:
        try:
            content = _fetch_file_content(repo.full_name, repo.api_base, path, sha)
            if content is None:
                errors.append(f"missing: {path}")
                continue
            _write_workspace(path, content)
            imported.append(path)
        except Exception as exc:  # noqa: BLE001
            logger.warning("import %s failed: %s", path, exc)
            errors.append(f"{path}: {exc}")

    programme, slug, design_path = _infer_from_paths(imported or all_paths)
    if not slug:
        _, slug = _infer_from_branch(branch)
    if not design_path and programme and slug:
        design_path = f"components/{programme}/{slug}/design-spec.md"

    stories_path = next(
        (p for p in imported if p.endswith(".stories.tsx") or p.endswith(".stories.ts")),
        None,
    )

    import_id = f"pr-{number}-{secrets.token_hex(4)}"
    # Review preview is per-PR filtered cache — never kick shared /storybook rebuild.
    pr_preview: dict[str, Any] = {
        "status": "idle",
        "message": "PR preview not started yet",
        "ready": False,
    }
    if stories_path and programme and slug and start_rebuild:
        pr_preview = start_filtered_pr_preview_build(
            pr_number=number,
            head_sha=sha,
            programme=programme,
            slug=slug,
            force=False,
        )
    elif stories_path and programme and slug:
        pr_preview = {
            "status": "pending",
            "message": "Filtered PR Storybook preview scheduled after import response",
            "ready": False,
            "cacheKey": cache_key(number, sha),
        }

    session = {
        "importId": import_id,
        "createdAt": _utc_now(),
        "prNumber": number,
        "htmlUrl": pr.get("html_url"),
        "title": pr.get("title"),
        "headBranch": branch,
        "headSha": sha,
        "programme": programme,
        "slug": slug,
        "designSpecPath": design_path,
        "storiesPath": stories_path,
        "importedFiles": imported,
        "skippedOrErrors": errors,
        "rebuild": {"status": "idle", "message": "Shared /storybook rebuild not used for Review"},
        "prPreview": pr_preview,
        "prStorybookCacheKey": cache_key(number, sha),
    }
    (review_sessions_dir() / f"{import_id}.json").write_text(
        json.dumps(session, indent=2), encoding="utf-8"
    )
    logger.info(
        "Review import done: PR #%s → %s (%s files)",
        number,
        import_id,
        len(imported),
    )
    return session


def load_review_session(import_id: str) -> dict[str, Any] | None:
    path = review_sessions_dir() / f"{import_id}.json"
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def read_review_design_spec(session: dict[str, Any]) -> dict[str, Any] | None:
    rel = session.get("designSpecPath")
    if not rel:
        # find any design-spec in imported list
        for p in session.get("importedFiles") or []:
            if str(p).endswith("design-spec.md"):
                rel = p
                break
    if not rel:
        return None
    for root in (accepted_workspace_root(), settings.repo_root):
        path = root / rel
        if path.is_file():
            content = path.read_text(encoding="utf-8")
            return {
                "path": rel,
                "content": content,
                "charCount": len(content),
            }
    return None


def refresh_rebuild_status(session: dict[str, Any]) -> dict[str, Any]:
    """Refresh shared rebuild status (Generate path). Review uses prPreview."""
    status = get_rebuild_status()
    session["rebuild"] = status
    import_id = session.get("importId")
    if import_id:
        path = review_sessions_dir() / f"{import_id}.json"
        try:
            path.write_text(json.dumps(session, indent=2), encoding="utf-8")
        except OSError:
            pass
    return status


def refresh_pr_preview_status(session: dict[str, Any]) -> dict[str, Any]:
    """Refresh filtered PR preview status for a Review session."""
    pr_num = session.get("prNumber")
    head_sha = session.get("headSha")
    if not pr_num or not head_sha:
        st = {
            "status": "missing",
            "message": "Session has no PR number / head SHA",
            "ready": False,
        }
        session["prPreview"] = st
        return st
    key = cache_key(int(pr_num), str(head_sha))
    st = get_build_status(key)
    session["prPreview"] = st
    session["prStorybookCacheKey"] = key
    import_id = session.get("importId")
    if import_id:
        path = review_sessions_dir() / f"{import_id}.json"
        try:
            path.write_text(json.dumps(session, indent=2), encoding="utf-8")
        except OSError:
            pass
    return st
