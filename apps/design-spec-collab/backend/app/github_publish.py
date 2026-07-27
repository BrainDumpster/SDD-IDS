"""Publish accepted client artifacts to GitHub (branch + commit + PR). No LLM."""

from __future__ import annotations

import base64
import logging
import re
from dataclasses import dataclass
from typing import Any

import httpx

from .config import settings
from .session_models import Artifact, CollabSession

logger = logging.getLogger(__name__)

_GITHUB_HTTPS = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com[/:](?P<owner>[^/]+)/(?P<repo>[^/.]+)(?:\.git)?/?$",
    re.IGNORECASE,
)


@dataclass
class GithubRepo:
    owner: str
    repo: str
    api_base: str = "https://api.github.com"

    @property
    def full_name(self) -> str:
        return f"{self.owner}/{self.repo}"


@dataclass
class PublishResult:
    dry_run: bool
    branch: str | None
    pr_url: str | None
    files: list[str]
    error: str | None = None
    ide_checkout_hint: str | None = None


def github_configured() -> tuple[bool, list[str]]:
    missing: list[str] = []
    if not settings.github_token:
        missing.append("GITHUB_TOKEN")
    if parse_github_repo() is None:
        missing.append("GITHUB_REPO_URL or GITHUB_OWNER/GITHUB_REPO")
    return (len(missing) == 0, missing)


def parse_github_repo() -> GithubRepo | None:
    raw = (settings.github_repo_url or "").strip()
    if raw:
        m = _GITHUB_HTTPS.search(raw)
        if m:
            return GithubRepo(owner=m.group("owner"), repo=m.group("repo"))
        if raw.startswith("git@github.com:"):
            path = raw.split(":", 1)[1].removesuffix(".git")
            parts = [p for p in path.split("/") if p]
            if len(parts) >= 2:
                return GithubRepo(owner=parts[0], repo=parts[1])
    owner = (settings.github_owner or "").strip()
    repo = (settings.github_repo or "").strip().removesuffix(".git")
    if "/" in repo:
        parts = [p for p in repo.split("/") if p]
        if len(parts) >= 2:
            return GithubRepo(owner=parts[0], repo=parts[1])
    if owner and repo and "/" not in repo:
        return GithubRepo(owner=owner, repo=repo)
    return None


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.github_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "design-spec-collab",
    }


def resolve_repo_paths(session: CollabSession) -> dict[str, str]:
    """Map artifact basename / relative name → allowlisted repo-relative path."""
    from .server_review import (
        expected_storybook_paths,
        foundation_paths,
        registry_paths,
    )

    preview = session.preview or {}
    pkg = session.prompt_package or {}
    allow = [
        str(p).replace("\\", "/").lstrip("./")
        for p in (pkg.get("write_path_allowlist") or pkg.get("writePathAllowlist") or [])
        if p and not str(p).endswith("/")
    ]
    design = (
        preview.get("design_spec_path")
        or preview.get("designSpecPath")
        or next((p for p in allow if p.endswith("design-spec.md")), None)
    )
    mapping: dict[str, str] = {}
    if design:
        mapping["design-spec.md"] = str(design).replace("\\", "/")
        mapping["outline.md"] = str(design).replace("\\", "/")
    for p in allow:
        mapping[p.rsplit("/", 1)[-1]] = p
        mapping[p] = p

    # Canonical intake paths (wizard parity) even when allowlist is directory-only
    for p in (
        foundation_paths(preview)
        + registry_paths(preview)
        + expected_storybook_paths(preview)
    ):
        mapping[p] = p
        mapping[p.rsplit("/", 1)[-1]] = p
    return mapping


def _path_allowed(path: str, session: CollabSession) -> bool:
    allow = [
        str(p).replace("\\", "/").lstrip("./")
        for p in (session.prompt_package or {}).get("write_path_allowlist")
        or (session.prompt_package or {}).get("writePathAllowlist")
        or []
    ]
    norm = path.replace("\\", "/").lstrip("./")
    if not allow:
        return norm.endswith("design-spec.md")
    for a in allow:
        if a.endswith("/"):
            if norm.startswith(a) or norm.startswith(a.rstrip("/") + "/"):
                return True
        elif norm == a:
            return True
    return False


def build_file_plan(session: CollabSession) -> list[tuple[str, str]]:
    """Return [(repo_path, content), ...] for allowed artifacts."""
    mapping = resolve_repo_paths(session)
    out: list[tuple[str, str]] = []
    seen: set[str] = set()
    for art in session.artifacts:
        name = (art.name or "").strip()
        if not name:
            continue
        cand = name.replace("\\", "/").lstrip("./")
        base = cand.rsplit("/", 1)[-1]
        path = mapping.get(cand) or mapping.get(base) or mapping.get(name)
        if not path:
            path = cand if _path_allowed(cand, session) else None
        if not path or not _path_allowed(path, session):
            logger.warning("Skipping artifact outside allowlist: %s", name)
            continue
        if path in seen:
            continue
        seen.add(path)
        out.append((path, art.content))
    return out


def publish_session(session: CollabSession) -> PublishResult:
    files = build_file_plan(session)
    if not files:
        return PublishResult(
            dry_run=True,
            branch=None,
            pr_url=None,
            files=[],
            error="No allowlisted artifacts to publish",
        )

    slug = (session.preview or {}).get("slug") or "component"
    short = session.session_id[:8]
    branch = f"collab/{slug}-{short}"

    if settings.github_publish_dry_run or not settings.github_token:
        fake_pr = (
            f"https://github.com/example/repo/pull/0"
            f"?dry_run=1&branch={branch}"
        )
        return PublishResult(
            dry_run=True,
            branch=branch,
            pr_url=fake_pr,
            files=[p for p, _ in files],
            ide_checkout_hint=(
                f"# DRY-RUN — no GitHub write\n"
                f"# Would push branch {branch} with: {', '.join(p for p, _ in files)}"
            ),
        )

    repo = parse_github_repo()
    ok, missing = github_configured()
    if not ok or repo is None:
        return PublishResult(
            dry_run=False,
            branch=None,
            pr_url=None,
            files=[p for p, _ in files],
            error="GitHub not configured: " + ", ".join(missing),
        )

    base = (settings.github_starting_ref or "master").strip()
    try:
        _create_branch_from_base(repo, branch=branch, base=base)
        for path, content in files:
            _put_file(repo, path=path, content=content, branch=branch, message=f"collab: add {path}")
        pr_url = _ensure_pr(
            repo,
            branch=branch,
            base=base,
            title=f"design-spec-collab: {slug}",
            body=(
                "Opened by Design Spec Collab after server accepted the client artifact.\n\n"
                "Server performed packaging + rule review only (no heavy LLM on server).\n"
                f"- Session: `{session.session_id}`\n"
                f"- Job: `{session.job_id}`\n"
                f"- Files: {', '.join(f'`{p}`' for p, _ in files)}\n"
            ),
        )
        hint = (
            f"git fetch origin && git checkout {branch}\n"
            f"# Fine-tune in IDE, then push / update PR as needed.\n"
            + (f"# PR: {pr_url}\n" if pr_url else "")
        )
        return PublishResult(
            dry_run=False,
            branch=branch,
            pr_url=pr_url,
            files=[p for p, _ in files],
            ide_checkout_hint=hint,
        )
    except Exception as exc:  # noqa: BLE001
        logger.exception("GitHub publish failed")
        return PublishResult(
            dry_run=False,
            branch=branch,
            pr_url=None,
            files=[p for p, _ in files],
            error=str(exc),
        )


def _create_branch_from_base(repo: GithubRepo, *, branch: str, base: str) -> None:
    with httpx.Client(timeout=45.0) as client:
        ref_url = f"{repo.api_base}/repos/{repo.full_name}/git/ref/heads/{base}"
        res = client.get(ref_url, headers=_headers())
        res.raise_for_status()
        sha = (res.json().get("object") or {}).get("sha")
        if not sha:
            raise RuntimeError(f"Could not resolve base branch SHA for {base}")

        create_url = f"{repo.api_base}/repos/{repo.full_name}/git/refs"
        payload = {"ref": f"refs/heads/{branch}", "sha": sha}
        cres = client.post(create_url, headers=_headers(), json=payload)
        if cres.status_code in (200, 201):
            return
        if cres.status_code == 422 and "already exists" in (cres.text or "").lower():
            return
        # 422 Reference already exists
        if cres.status_code == 422:
            return
        cres.raise_for_status()


def _put_file(
    repo: GithubRepo,
    *,
    path: str,
    content: str,
    branch: str,
    message: str,
) -> None:
    encoded_path = "/".join(part for part in path.split("/") if part)
    url = f"{repo.api_base}/repos/{repo.full_name}/contents/{encoded_path}"
    b64 = base64.b64encode(content.encode("utf-8")).decode("ascii")
    payload: dict[str, Any] = {
        "message": message,
        "content": b64,
        "branch": branch,
    }
    with httpx.Client(timeout=60.0) as client:
        # If file exists on branch, need sha
        existing = client.get(url, headers=_headers(), params={"ref": branch})
        if existing.status_code == 200:
            data = existing.json()
            if isinstance(data, dict) and data.get("sha"):
                payload["sha"] = data["sha"]
        res = client.put(url, headers=_headers(), json=payload)
        res.raise_for_status()


def _ensure_pr(
    repo: GithubRepo,
    *,
    branch: str,
    base: str,
    title: str,
    body: str,
) -> str | None:
    with httpx.Client(timeout=45.0) as client:
        list_url = f"{repo.api_base}/repos/{repo.full_name}/pulls"
        existing = client.get(
            list_url,
            headers=_headers(),
            params={"head": f"{repo.owner}:{branch}", "state": "open", "per_page": 5},
        )
        if existing.status_code == 200 and existing.json():
            return existing.json()[0].get("html_url")

        res = client.post(
            list_url,
            headers=_headers(),
            json={"title": title, "head": branch, "base": base, "body": body},
        )
        if res.status_code in (200, 201):
            return res.json().get("html_url")
        logger.warning("create PR failed %s: %s", res.status_code, res.text[:400])
        # retry find
        existing2 = client.get(
            list_url,
            headers=_headers(),
            params={"head": f"{repo.owner}:{branch}", "state": "open", "per_page": 5},
        )
        if existing2.status_code == 200 and existing2.json():
            return existing2.json()[0].get("html_url")
        raise RuntimeError(f"GitHub PR create failed: {res.status_code} {res.text[:300]}")
