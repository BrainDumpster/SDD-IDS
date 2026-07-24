"""Build downloadable zip of design-spec artifacts for a finished job."""

from __future__ import annotations

import io
import logging
import zipfile
from pathlib import Path
from typing import Any

from ..config import settings
from ..models.jobs import JobRecord
from .github_api import (
    get_file_content,
    github_configured,
    list_pr_files,
    parse_github_repo,
    parse_pr_number,
)

logger = logging.getLogger(__name__)


def candidate_paths(record: JobRecord) -> list[str]:
    """Paths we always try to include (preview / write allowlist)."""
    preview = record.preview or {}
    pkg = record.prompt_package or {}
    paths: list[str] = []

    for key in ("design_spec_path", "designSpecPath"):
        p = preview.get(key) or pkg.get("confirmed_payload", {}).get(key)
        if p:
            paths.append(str(p))

    figma_map = preview.get("figma_map_path") or preview.get("figmaMapPath")
    if figma_map:
        paths.append(str(figma_map))

    allow = pkg.get("write_path_allowlist") or pkg.get("writePathAllowlist") or []
    for p in allow:
        s = str(p)
        if s.endswith("/"):
            continue  # directories — skip for zip seed list
        paths.append(s)

    # Storybook hints
    storybook = preview.get("storybook_examples") or preview.get("storybookExamples")
    programme = preview.get("programme")
    slug = preview.get("slug")
    if storybook and programme and slug:
        # PascalCase-ish guess from slug
        pascal = "".join(part.capitalize() for part in str(slug).split("-"))
        paths.append(
            f"storybook-generated/{programme}/src/components/{pascal}.stories.tsx"
        )

    # de-dupe
    seen: set[str] = set()
    out: list[str] = []
    for p in paths:
        if p and p not in seen:
            seen.add(p)
            out.append(p)
    return out


def _filter_relevant(paths: list[str], record: JobRecord) -> list[str]:
    """Keep design-spec / map / storybook / session related paths."""
    slug = str((record.preview or {}).get("slug") or "")
    keys = (
        "design-spec.md",
        "figma-map",
        "component-figma-map",
        "storybook-generated",
        "deterministic_storybook",
        "programme-inheritance-registry",
        f"/{slug}/" if slug else None,
        "design-spec-intake/sessions",
    )
    out: list[str] = []
    for p in paths:
        pl = p.lower()
        if any(k and k.lower() in pl for k in keys if k):
            out.append(p)
    return out or paths


def build_artifacts_zip(record: JobRecord) -> tuple[bytes, list[str]]:
    """
    Return (zip_bytes, included_paths).
    Prefer GitHub branch/PR contents; fall back to local repo_root (dry-run / offline).
    """
    if record.status.value != "finished":
        raise ValueError(f"Artifacts only available for finished jobs (status={record.status})")

    included: list[str] = []
    buf = io.BytesIO()

    with zipfile.ZipFile(buf, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        # Manifest
        manifest = (
            f"job_id: {record.job_id}\n"
            f"branch: {record.branch}\n"
            f"pr_url: {record.pr_url}\n"
            f"programme: {(record.preview or {}).get('programme')}\n"
            f"slug: {(record.preview or {}).get('slug')}\n"
            f"design_spec_path: {(record.preview or {}).get('design_spec_path')}\n"
        )
        zf.writestr("MANIFEST.txt", manifest)

        fetched = _fetch_from_github(record)
        if not fetched:
            fetched = _fetch_from_local(record)

        if not fetched:
            # Still useful: list expected paths
            expected = "\n".join(candidate_paths(record)) or "(none)"
            zf.writestr(
                "README-MISSING.txt",
                "No artifact files found on the branch or local workspace.\n"
                "Expected paths:\n"
                f"{expected}\n",
            )
        else:
            for path, data in fetched.items():
                zf.writestr(path, data)
                included.append(path)

    return buf.getvalue(), included


def _fetch_from_github(record: JobRecord) -> dict[str, bytes]:
    ok, _ = github_configured()
    if not ok or not record.branch:
        return {}
    repo = parse_github_repo(record.locked_repo_url)
    if repo is None:
        return {}

    paths: list[str] = []
    if record.pr_url:
        n = parse_pr_number(record.pr_url)
        if n:
            try:
                paths = _filter_relevant(list_pr_files(repo, n), record)
            except Exception as exc:  # noqa: BLE001
                logger.warning("list_pr_files failed: %s", exc)

    if not paths:
        paths = candidate_paths(record)

    out: dict[str, bytes] = {}
    for path in paths:
        try:
            data = get_file_content(repo, path, ref=record.branch)
        except Exception as exc:  # noqa: BLE001
            logger.warning("get_file_content %s failed: %s", path, exc)
            continue
        if data is not None:
            out[path] = data
    return out


def _fetch_from_local(record: JobRecord) -> dict[str, bytes]:
    """Dry-run / local fallback: read from mounted monorepo."""
    root = settings.repo_root
    out: dict[str, bytes] = {}
    for path in candidate_paths(record):
        full = root / path
        if full.is_file():
            out[path] = full.read_bytes()
    # If design-spec missing, write a stub so zip is non-empty for dry-run demos
    design = (record.preview or {}).get("design_spec_path")
    if design and design not in out and settings.cloud_agent_dry_run:
        out[str(design)] = (
            f"# Placeholder (dry-run)\n\n"
            f"Job `{record.job_id}` finished in dry-run mode.\n"
            f"Real cloud runs zip this path from branch `{record.branch}`.\n"
        ).encode("utf-8")
    return out
