"""GitHub helpers — parse repo, open/find PRs, fetch file blobs for zip."""

from __future__ import annotations

import base64
import logging
import os
import re
from dataclasses import dataclass
from typing import Any
from urllib.parse import urlparse

import httpx

from ..config import settings

logger = logging.getLogger(__name__)

_GITHUB_HTTPS = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com[/:](?P<owner>[^/]+)/(?P<repo>[^/.]+)(?:\.git)?/?$",
    re.IGNORECASE,
)


@dataclass
class GithubRepo:
    owner: str
    repo: str  # without .git
    api_base: str = "https://api.github.com"

    @property
    def full_name(self) -> str:
        return f"{self.owner}/{self.repo}"


def parse_github_repo(url: str | None = None) -> GithubRepo | None:
    """Resolve owner/repo from URL arg, CLOUD_REPO_URL, or GITHUB_OWNER/GITHUB_REPO."""

    def _from_raw(raw: str) -> GithubRepo | None:
        raw = raw.strip()
        if not raw:
            return None
        m = _GITHUB_HTTPS.search(raw)
        if m:
            return GithubRepo(owner=m.group("owner"), repo=m.group("repo"))
        # SSH form git@github.com:owner/repo.git
        if raw.startswith("git@github.com:"):
            path = raw.split(":", 1)[1].removesuffix(".git")
            parts = [p for p in path.split("/") if p]
            if len(parts) >= 2:
                return GithubRepo(owner=parts[0], repo=parts[1])
        return None

    # Prefer explicit / cloud repo URL (avoids bad GITHUB_REPO path overrides)
    parsed = _from_raw(url or "") or _from_raw(settings.cloud_repo_url or "")
    if parsed:
        return parsed

    owner = (settings.github_owner or "").strip()
    repo = (settings.github_repo or "").strip().removesuffix(".git")
    if not repo:
        return None
    if "/" in repo:
        parts = [p for p in repo.split("/") if p]
        if len(parts) >= 2:
            return GithubRepo(owner=parts[0], repo=parts[1])
        return None
    if owner:
        return GithubRepo(owner=owner, repo=repo)
    return None


def _headers() -> dict[str, str]:
    token = settings.github_token
    if not token:
        raise ValueError("GITHUB_TOKEN is not set")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "design-spec-portal",
    }


def find_pr_for_branch(repo: GithubRepo, branch: str) -> str | None:
    """Return html_url of an open PR for head branch, if any."""
    url = f"{repo.api_base}/repos/{repo.full_name}/pulls"
    params = {"head": f"{repo.owner}:{branch}", "state": "open", "per_page": 5}
    with httpx.Client(timeout=30.0) as client:
        res = client.get(url, headers=_headers(), params=params)
        if res.status_code == 404:
            return None
        res.raise_for_status()
        items = res.json()
        if not items:
            # also try without owner prefix
            res2 = client.get(
                url,
                headers=_headers(),
                params={"head": branch, "state": "open", "per_page": 5},
            )
            res2.raise_for_status()
            items = res2.json()
        if items:
            return items[0].get("html_url")
    return None


def ensure_pr_for_branch(
    repo: GithubRepo,
    branch: str,
    *,
    base: str | None = None,
    title: str | None = None,
    body: str | None = None,
) -> str | None:
    """Find existing PR or create one. Returns PR html_url."""
    existing = find_pr_for_branch(repo, branch)
    if existing:
        return existing
    base_ref = base or settings.cloud_starting_ref or "master"
    payload = {
        "title": title or f"design-spec-portal: {branch}",
        "head": branch,
        "base": base_ref,
        "body": body
        or (
            "Opened by Design Spec Portal after a Cursor Cloud agent run.\n\n"
            "Review the generated design-spec and fine-tune on this branch in the IDE."
        ),
    }
    url = f"{repo.api_base}/repos/{repo.full_name}/pulls"
    with httpx.Client(timeout=45.0) as client:
        res = client.post(url, headers=_headers(), json=payload)
        if res.status_code in (200, 201):
            return res.json().get("html_url")
        # 422 often means PR already exists or no commits
        logger.warning(
            "GitHub create PR failed %s: %s",
            res.status_code,
            res.text[:500],
        )
        # retry find
        return find_pr_for_branch(repo, branch)


def list_pr_files(repo: GithubRepo, pr_number: int) -> list[str]:
    url = f"{repo.api_base}/repos/{repo.full_name}/pulls/{pr_number}/files"
    paths: list[str] = []
    page = 1
    with httpx.Client(timeout=45.0) as client:
        while True:
            res = client.get(
                url,
                headers=_headers(),
                params={"per_page": 100, "page": page},
            )
            res.raise_for_status()
            batch = res.json()
            if not batch:
                break
            for item in batch:
                if item.get("filename"):
                    paths.append(item["filename"])
            if len(batch) < 100:
                break
            page += 1
    return paths


def parse_pr_number(pr_url: str) -> int | None:
    # https://github.com/owner/repo/pull/123
    m = re.search(r"/pull/(\d+)", pr_url or "")
    return int(m.group(1)) if m else None


def get_branch_commit_sha(branch: str, repo: GithubRepo | None = None) -> str | None:
    """Return tip commit SHA for a branch, or None if missing."""
    repo = repo or parse_github_repo()
    if repo is None:
        raise ValueError("GitHub repo is not configured")
    name = (branch or "").strip()
    if not name:
        return None
    url = f"{repo.api_base}/repos/{repo.full_name}/git/ref/heads/{name}"
    with httpx.Client(timeout=30.0) as client:
        res = client.get(url, headers=_headers())
        if res.status_code == 404:
            return None
        res.raise_for_status()
        obj = res.json().get("object") or {}
        sha = obj.get("sha")
        return str(sha) if sha else None


def resolve_cloud_starting_ref() -> dict[str, Any]:
    """
    Resolve CLOUD_STARTING_REF for Cursor CloudAgentOptions.
    Prefers branch name; optionally uses tip commit SHA (CLOUD_STARTING_REF_AS_SHA).
    """
    ref = (settings.cloud_starting_ref or "").strip() or "master"
    out: dict[str, Any] = {
        "startingRef": ref,
        "resolvedRef": ref,
        "asSha": False,
        "sha": None,
        "portalSeesBranch": None,
        "error": None,
    }
    ok, missing = github_configured()
    if not ok:
        out["error"] = "GitHub not configured: " + ", ".join(missing)
        return out
    try:
        exists = branch_exists(ref)
        out["portalSeesBranch"] = exists
        if not exists:
            st = starting_ref_status()
            out["error"] = st.get("error") or f"Branch '{ref}' not found via GITHUB_TOKEN"
            return out
        sha = get_branch_commit_sha(ref)
        out["sha"] = sha
        use_sha = (os.environ.get("CLOUD_STARTING_REF_AS_SHA") or "").strip().lower() in {
            "1",
            "true",
            "yes",
            "on",
        }
        if use_sha and sha:
            out["resolvedRef"] = sha
            out["asSha"] = True
    except Exception as exc:  # noqa: BLE001
        out["error"] = str(exc)
    return out


def get_file_content(repo: GithubRepo, path: str, *, ref: str) -> bytes | None:
    """Fetch raw file bytes from a branch/ref via Contents API."""
    encoded = "/".join(part for part in path.split("/") if part)
    url = f"{repo.api_base}/repos/{repo.full_name}/contents/{encoded}"
    with httpx.Client(timeout=45.0) as client:
        res = client.get(url, headers=_headers(), params={"ref": ref})
        if res.status_code == 404:
            return None
        res.raise_for_status()
        data = res.json()
        if isinstance(data, list):
            return None  # directory
        content = data.get("content")
        encoding = data.get("encoding")
        if encoding == "base64" and content:
            return base64.b64decode(content)
        download_url = data.get("download_url")
        if download_url:
            raw = client.get(download_url, headers=_headers(), follow_redirects=True)
            raw.raise_for_status()
            return raw.content
    return None


def github_configured() -> tuple[bool, list[str]]:
    missing: list[str] = []
    if not settings.github_token:
        missing.append("GITHUB_TOKEN")
    if parse_github_repo() is None:
        missing.append("CLOUD_REPO_URL or GITHUB_OWNER/GITHUB_REPO")
    return (len(missing) == 0), missing


def get_repo_info(repo: GithubRepo | None = None) -> dict[str, Any]:
    """Return default_branch and basic repo metadata."""
    repo = repo or parse_github_repo()
    if repo is None:
        raise ValueError("GitHub repo is not configured")
    url = f"{repo.api_base}/repos/{repo.full_name}"
    with httpx.Client(timeout=30.0) as client:
        res = client.get(url, headers=_headers())
        res.raise_for_status()
        data = res.json()
    return {
        "fullName": data.get("full_name") or repo.full_name,
        "defaultBranch": data.get("default_branch"),
        "private": data.get("private"),
        "htmlUrl": data.get("html_url"),
    }


def branch_exists(branch: str, repo: GithubRepo | None = None) -> bool:
    """True if the named branch exists on the configured repo."""
    repo = repo or parse_github_repo()
    if repo is None:
        raise ValueError("GitHub repo is not configured")
    name = (branch or "").strip()
    if not name:
        return False
    url = f"{repo.api_base}/repos/{repo.full_name}/branches/{name}"
    with httpx.Client(timeout=30.0) as client:
        res = client.get(url, headers=_headers())
        if res.status_code == 404:
            return False
        res.raise_for_status()
        return True


def list_branches(
    repo: GithubRepo | None = None,
    *,
    per_page: int = 100,
    max_pages: int = 5,
) -> list[str]:
    """List branch names (capped) for the configured repo."""
    repo = repo or parse_github_repo()
    if repo is None:
        raise ValueError("GitHub repo is not configured")
    url = f"{repo.api_base}/repos/{repo.full_name}/branches"
    names: list[str] = []
    page = 1
    with httpx.Client(timeout=45.0) as client:
        while page <= max_pages:
            res = client.get(
                url,
                headers=_headers(),
                params={"per_page": min(per_page, 100), "page": page},
            )
            res.raise_for_status()
            batch = res.json()
            if not batch:
                break
            for item in batch:
                if item.get("name"):
                    names.append(item["name"])
            if len(batch) < min(per_page, 100):
                break
            page += 1
    return names


def starting_ref_status() -> dict[str, Any]:
    """
    Check CLOUD_STARTING_REF against GitHub (for /health and diagnostics).
    Does not raise — returns structured status.
    """
    ref = (settings.cloud_starting_ref or "").strip() or "master"
    ok, missing = github_configured()
    base: dict[str, Any] = {
        "startingRef": ref,
        "checked": False,
        "exists": None,
        "defaultBranch": None,
        "repo": None,
        "error": None,
    }
    if not ok:
        base["error"] = "GitHub not configured: " + ", ".join(missing)
        return base
    try:
        repo = parse_github_repo()
        assert repo is not None
        base["repo"] = repo.full_name
        info = get_repo_info(repo)
        base["defaultBranch"] = info.get("defaultBranch")
        base["exists"] = branch_exists(ref, repo)
        base["checked"] = True
        if not base["exists"]:
            base["error"] = (
                f"Branch '{ref}' not found on {repo.full_name}. "
                f"Default branch is '{base['defaultBranch']}'. "
                "Set CLOUD_STARTING_REF to an existing branch."
            )
    except Exception as exc:  # noqa: BLE001
        base["error"] = str(exc)
    return base
