"""Publish accepted client artifacts to GitHub (branch + commit + PR). No LLM."""

from __future__ import annotations

import base64
import logging
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx

from .config import settings
from .session_models import CollabSession

logger = logging.getLogger(__name__)

_GITHUB_HTTPS = re.compile(
    r"(?:https?://)?(?:www\.)?github\.com[/:](?P<owner>[^/]+)/(?P<repo>[^/.]+)(?:\.git)?/?$",
    re.IGNORECASE,
)
# GitHub ref short name: no spaces, no leading ., no path escape.
_BRANCH_RE = re.compile(r"^[A-Za-z0-9._/-]{1,200}$")


def _validate_git_branch_name(branch: str) -> str:
    """Guardrail: refuse unsafe branch names before any GitHub git/ref write."""
    b = (branch or "").strip()
    if not b or not _BRANCH_RE.match(b):
        raise ValueError(f"Invalid git branch name: {branch!r}")
    if b.startswith("/") or b.endswith("/") or "//" in b or ".." in b.split("/"):
        raise ValueError(f"Unsafe git branch name: {branch!r}")
    if b in (".", "..") or b.startswith("refs/"):
        raise ValueError(f"Refusing git branch name: {branch!r}")
    return b


def _safe_repo_rel_path(rel: str) -> str:
    """Normalize allowlisted relative paths; reject escapes."""
    p = (rel or "").replace("\\", "/").strip().lstrip("/")
    if not p or p.startswith("../") or "/../" in f"/{p}/" or ".." in Path(p).parts:
        raise ValueError(f"Unsafe repo-relative path: {rel!r}")
    return p


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


def _httpx_verify() -> bool | str:
    """TLS verify for GitHub REST — honor GITHUB_SSL_VERIFY / CA bundle paths."""
    if not settings.github_ssl_verify:
        return False
    for key in ("REQUESTS_CA_BUNDLE", "SSL_CERT_FILE", "CURL_CA_BUNDLE"):
        path = (os.environ.get(key) or "").strip()
        if path and Path(path).is_file():
            return path
    return True


def _httpx_client(timeout: float) -> httpx.Client:
    return httpx.Client(timeout=timeout, verify=_httpx_verify())


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
    from .server_review import (
        expected_storybook_paths,
        foundation_paths,
        registry_paths,
    )

    allow = [
        str(p).replace("\\", "/").lstrip("./")
        for p in (session.prompt_package or {}).get("write_path_allowlist")
        or (session.prompt_package or {}).get("writePathAllowlist")
        or []
    ]
    norm = path.replace("\\", "/").lstrip("./")
    preview = session.preview or {}
    canonical = set(
        foundation_paths(preview)
        + registry_paths(preview)
        + expected_storybook_paths(preview)
    )
    if norm in canonical or norm.startswith("storybook-generated/"):
        return True
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
    """Return [(repo_path, content), ...] for allowed artifacts.

    Always ensure programme foundation paths that are missing from the GitHub
    publish base are included (from session artifacts, context pack, or local /
    donor synthesis) so a new programme PR cannot ship yaml without theme/root-spec.
    """
    from .github_catalog import file_exists_on_starting_ref
    from .server_review import foundation_paths

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

    preview = session.preview or {}
    required = list(foundation_paths(preview))
    # Even if preview flags drifted, yaml-referenced theme/root must land on the PR
    for key in ("theme_css_path", "themeCssPath", "root_spec_path", "rootSpecPath"):
        p = str(preview.get(key) or "").replace("\\", "/").lstrip("./")
        if p and p not in required:
            required.append(p)
    programme = str(preview.get("programme") or "").lower()
    if programme and programme != "ids":
        yp = f"config/design_systems/{programme}.yaml"
        if yp not in required:
            required.append(yp)

    for path in required:
        if not path or path in seen:
            continue
        if file_exists_on_starting_ref(path):
            continue
        content = _resolve_foundation_content(session, path)
        if content is None:
            logger.warning(
                "Foundation path %s missing from artifacts and could not be synthesized",
                path,
            )
            continue
        if not _path_allowed(path, session):
            # Force-allow missing foundation onto the PR
            pass
        seen.add(path)
        out.append((path, content))
        logger.info("Ensured foundation file in publish plan: %s", path)

    return out


def _resolve_foundation_content(session: CollabSession, path: str) -> str | None:
    """Find foundation file content for publish when the client omitted it."""
    from .github_catalog import read_repo_file

    path = path.replace("\\", "/").lstrip("./")
    base = path.rsplit("/", 1)[-1]
    for art in session.artifacts:
        name = (art.name or "").replace("\\", "/").lstrip("./")
        if name == path or name.endswith("/" + base) or name == base:
            return art.content
    for art in session.context_artifacts or []:
        name = (art.name or "").replace("\\", "/").lstrip("./")
        if name == path or name.endswith("/" + path) or (
            not name.startswith("donor:") and name.endswith("/" + base)
        ):
            return art.content
        if name.startswith("donor:"):
            donor = name[len("donor:") :]
            if path.endswith(("-theme.css", "theme.css")) and donor.endswith(
                ("-theme.css", "theme.css", "ids-theme.css")
            ):
                return _wrap_theme_from_donor(
                    path, donor, art.content, session.preview or {}
                )
            if path.endswith("root-spec.md") and donor.endswith("root-spec.md"):
                return _wrap_root_from_donor(path, donor, session.preview or {})
            if path.endswith((".yaml", ".yml")) and donor.endswith((".yaml", ".yml")):
                return art.content
    # Local disk (may have good leftovers that never made it into artifacts)
    local = read_repo_file(path)
    if local is not None:
        return local
    # Last-resort stubs so the PR is not missing yaml-referenced paths
    preview = session.preview or {}
    programme = str(preview.get("programme") or "programme")
    if path.endswith(("-theme.css", "theme.css")):
        donor = (
            str(preview.get("donor_theme_css_path") or "components/ids-theme.css")
            .replace("\\", "/")
        )
        donor_text = read_repo_file(donor) or "/* donor theme missing */\n"
        return _wrap_theme_from_donor(path, donor, donor_text, preview)
    if path.endswith("root-spec.md"):
        donor = str(
            preview.get("donor_root_spec_path") or "components/ids/root-spec.md"
        ).replace("\\", "/")
        return _wrap_root_from_donor(path, donor, preview)
    if path.endswith((".yaml", ".yml")):
        return (
            f"name: {programme}\n"
            f"display_name: {preview.get('programme_display_name') or programme}\n"
            f"components_dir: components/{programme}\n"
            f"theme_css_path: components/{programme}-theme.css\n"
            f"root_spec_path: components/{programme}/root-spec.md\n"
            f"figma_map_path: data/{programme}-component-figma-map.json\n"
            f"baseline_components_dir: components/ids\n"
            f"baseline_root_spec_path: components/ids/root-spec.md\n"
            f"baseline_theme_css_path: components/ids-theme.css\n"
        )
    return None


def _wrap_theme_from_donor(
    path: str, donor_path: str, donor_content: str, preview: dict[str, Any]
) -> str:
    programme = str(preview.get("programme") or "programme")
    display = str(preview.get("programme_display_name") or programme)
    # Prefer a thin wrapper when donor is IDS-sized; avoid duplicating full IDS CSS.
    rel_import = "./ids-theme.css" if donor_path.endswith("ids-theme.css") else donor_path
    if "ids-theme.css" in donor_path or len(donor_content) > 8000:
        return (
            f"/* {display} Design System — Global Theme Tokens\n"
            f" * Thin wrapper around donor `{donor_path}`.\n"
            f" * Import with data-design-system=\"{programme}\" on html/body.\n"
            f" */\n\n"
            f"@import url('{rel_import}');\n\n"
            f"html[data-design-system=\"{programme}\"],\n"
            f"body[data-design-system=\"{programme}\"] {{\n"
            f"  /* Programme overrides — extend from Figma tokens as needed */\n"
            f"}}\n"
        )
    return donor_content


def _wrap_root_from_donor(path: str, donor_path: str, preview: dict[str, Any]) -> str:
    programme = str(preview.get("programme") or "programme")
    display = str(preview.get("programme_display_name") or programme)
    theme = str(
        preview.get("theme_css_path") or f"components/{programme}-theme.css"
    )
    return (
        f"# {display} Design System — Root Spec\n\n"
        f"> {display} inherits `{donor_path}` as its baseline. "
        f"This document records programme identity and overrides.\n\n"
        f"## Design System Identity\n\n"
        f"| Property | Value |\n"
        f"|---|---|\n"
        f"| Name | {display} |\n"
        f"| Baseline design system | `{donor_path}` |\n"
        f"| Programme theme CSS | `{theme}` |\n"
        f"| Components directory | `components/{programme}/` |\n\n"
        f"### Inheritance statement\n\n"
        f"All sections not explicitly overridden below are inherited from `{donor_path}`.\n"
    )


def materialize_session_to_disk(session: CollabSession) -> list[str]:
    """Write accepted artifacts under repo_root + persistent data overlay.

    Storybook preview looks for ``storybook-generated/…`` on disk. Docker image
    only has files baked at build time; this makes accept-time files visible
    without waiting for a PR merge + image rebuild (iframe still needs rebuild).
    """
    from .storybook_rebuild import normalize_story_source

    files = build_file_plan(session)
    if not files:
        return []
    roots = [
        settings.repo_root,
        settings.app_root / "data" / "accepted_workspace",
    ]
    written: list[str] = []
    for rel, content in files:
        try:
            rel_safe = _safe_repo_rel_path(rel)
        except ValueError as exc:
            logger.warning("%s", exc)
            continue
        text = content
        if "stories." in rel_safe and rel_safe.endswith((".tsx", ".ts")):
            text = normalize_story_source(content)
        for root in roots:
            dest = (root / rel_safe).resolve()
            try:
                # Stay under materialize root (no symlink escape)
                if not str(dest).startswith(str(root.resolve()) + os.sep):
                    logger.warning("Refusing path escape: %s", rel_safe)
                    continue
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_text(text, encoding="utf-8")
                written.append(str(dest))
            except OSError as exc:
                logger.warning("Could not materialize %s under %s: %s", rel_safe, root, exc)
    return written


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
    kind = session.job_kind or (session.preview or {}).get("job_kind") or "create"
    preview = session.preview or {}
    target_branch = (
        (preview.get("publish_target_branch") or preview.get("publishTargetBranch") or "")
        .strip()
    )
    if target_branch and kind == "review_revise":
        branch = target_branch
    else:
        prefix = "update" if kind in ("update", "review_revise") else "collab"
        branch = f"{prefix}/{slug}-{short}"
    try:
        branch = _validate_git_branch_name(branch)
    except ValueError as exc:
        return PublishResult(
            dry_run=False,
            branch=None,
            pr_url=None,
            files=[p for p, _ in files],
            error=str(exc),
        )

    if settings.github_publish_dry_run or not settings.github_token:
        fake_pr = (
            (preview.get("pr_html_url") or preview.get("htmlUrl") or "")
            or f"https://github.com/example/repo/pull/0?dry_run=1&branch={branch}"
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
    pr_num = preview.get("pr_number") or preview.get("prNumber")
    if kind == "review_revise":
        pr_title = f"Review revise: {slug}" + (f" (PR #{pr_num})" if pr_num else "")
        pr_body = (
            "Review revise via Design Spec Collab — commits land on the **existing** "
            f"PR branch `{branch}`.\n\n"
            f"- Session: `{session.session_id}`\n"
            f"- Job: `{session.job_id}`\n"
            f"- Kind: `{kind}`\n"
            f"- Files: {', '.join(f'`{p}`' for p, _ in files)}\n"
        )
        if preview.get("reviewer_feedback"):
            fb = str(preview["reviewer_feedback"]).strip()
            if len(fb) > 800:
                fb = fb[:800] + "…"
            pr_body += f"\n### Reviewer feedback\n\n{fb}\n"
    elif kind == "update":
        pr_title = f"Update design-spec: {slug}"
        pr_body = (
            f"Update design-spec via Design Spec Collab.\n\n"
            "Server performed packaging + rule review only (no heavy LLM on server).\n"
            f"- Session: `{session.session_id}`\n"
            f"- Job: `{session.job_id}`\n"
            f"- Kind: `{kind}`\n"
            f"- Files: {', '.join(f'`{p}`' for p, _ in files)}\n"
        )
    else:
        pr_title = f"design-spec-collab: {slug}"
        pr_body = (
            "Create design-spec via Design Spec Collab.\n\n"
            "Server performed packaging + rule review only (no heavy LLM on server).\n"
            f"- Session: `{session.session_id}`\n"
            f"- Job: `{session.job_id}`\n"
            f"- Kind: `{kind}`\n"
            f"- Files: {', '.join(f'`{p}`' for p, _ in files)}\n"
        )
    try:
        from .storybook_rebuild import normalize_story_source

        # Existing PR branch: create-ref is a no-op if the branch already exists.
        # Never force-update / reset an open PR branch to base (Contents API only).
        if kind == "review_revise":
            if not _branch_exists(repo, branch):
                # Last resort: create from base only if the PR head ref is missing.
                _create_branch_from_base(repo, branch=branch, base=base)
        else:
            _create_branch_from_base(repo, branch=branch, base=base)
        for path, content in files:
            path = _safe_repo_rel_path(path)
            text = content
            # Must normalize before GitHub write — Review re-imports from the PR,
            # and materialize-only fixes never reach the remote stories.
            if "stories." in path and path.endswith((".tsx", ".ts")):
                text = normalize_story_source(content)
            _put_file(
                repo,
                path=path,
                content=text,
                branch=branch,
                message=(
                    f"collab: review revise {path}"
                    if kind == "review_revise"
                    else f"collab: add {path}"
                ),
            )
        known_pr = preview.get("pr_html_url") or preview.get("htmlUrl")
        pr_url = _ensure_pr(
            repo,
            branch=branch,
            base=base,
            title=pr_title,
            body=pr_body,
        ) or (str(known_pr) if known_pr else None)
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
        err = str(exc)
        if "CERTIFICATE_VERIFY_FAILED" in err or "SSL" in err:
            err += (
                " — set GITHUB_SSL_VERIFY=false (or mount org CA via "
                "REQUESTS_CA_BUNDLE) and restart; then POST …/publish/retry"
            )
        return PublishResult(
            dry_run=False,
            branch=branch,
            pr_url=None,
            files=[p for p, _ in files],
            error=err,
        )


def _branch_exists(repo: GithubRepo, branch: str) -> bool:
    branch = _validate_git_branch_name(branch)
    with _httpx_client(30.0) as client:
        url = f"{repo.api_base}/repos/{repo.full_name}/git/ref/heads/{branch}"
        res = client.get(url, headers=_headers())
        return res.status_code == 200


def _create_branch_from_base(repo: GithubRepo, *, branch: str, base: str) -> None:
    branch = _validate_git_branch_name(branch)
    base = _validate_git_branch_name(base)
    with _httpx_client(45.0) as client:
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
            # Intentionally do NOT PATCH/update the ref to base — that would
            # reset an open PR branch and drop prior commits.
            return
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
    path = _safe_repo_rel_path(path)
    branch = _validate_git_branch_name(branch)
    encoded_path = "/".join(part for part in path.split("/") if part)
    url = f"{repo.api_base}/repos/{repo.full_name}/contents/{encoded_path}"
    b64 = base64.b64encode(content.encode("utf-8")).decode("ascii")
    payload: dict[str, Any] = {
        "message": message,
        "content": b64,
        "branch": branch,
    }
    with _httpx_client(60.0) as client:
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
    with _httpx_client(45.0) as client:
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
        existing2 = client.get(
            list_url,
            headers=_headers(),
            params={"head": f"{repo.owner}:{branch}", "state": "open", "per_page": 5},
        )
        if existing2.status_code == 200 and existing2.json():
            return existing2.json()[0].get("html_url")
        raise RuntimeError(f"GitHub PR create failed: {res.status_code} {res.text[:300]}")
