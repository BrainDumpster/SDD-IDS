"""Review → revise on the same PR branch.

Creates a collab job (same Bridge/client loop as Generate/Update) scoped to the
imported PR head, with reviewer feedback as primary instruction. Publish targets
``headBranch`` so PR #N updates in place — no new ``update/…`` branch.

Catalogue Update (``job_kind=update``) remains available from the Dashboard for
new-branch updates against the catalogue baseline.
"""

from __future__ import annotations

import logging
import re
from typing import Any

from pydantic import BaseModel, Field, field_validator

from intake_core.services.additional_notes import MAX_ADDITIONAL_NOTES_CHARS

from .config import settings
from .github_catalog import _read_for_context
from .portal_bridge import sanitize_additional_notes
from .update_models import UpdateRequest
from .update_service import build_update_preview

logger = logging.getLogger(__name__)

_FIGMA_URL_RE = re.compile(
    r"https://(?:www\.)?figma\.com/(?:design|file)/[^\s\)\]\"'`]+",
    re.IGNORECASE,
)
_FILE_KEY_RE = re.compile(
    r"(?:figma\s+)?file[_ ]?key\s*[:=]\s*`?([a-zA-Z0-9]{10,})`?",
    re.IGNORECASE,
)
_NODE_ID_RE = re.compile(
    r"(?:primary\s+)?node[_ -]?id\s*[:=]\s*`?([\d:-]+)`?",
    re.IGNORECASE,
)
_PRIMARY_FIGMA_LINE_RE = re.compile(
    r"(?im)^[-\s]*Primary Figma[^\n]*?:\s*(https://(?:www\.)?figma\.com/[^\s]+)",
)


class ReviewReviseBody(BaseModel):
    feedback: str = Field(..., min_length=1, max_length=MAX_ADDITIONAL_NOTES_CHARS)
    storybook_examples: bool | None = Field(default=None, alias="storybookExamples")
    confirmed: bool = True

    model_config = {"populate_by_name": True}

    @field_validator("feedback")
    @classmethod
    def clean_feedback(cls, v: str) -> str:
        cleaned = sanitize_additional_notes(v)
        if not cleaned or not str(cleaned).strip():
            raise ValueError("feedback is required")
        return str(cleaned).strip()


def is_revise_kind(job_kind: str | None) -> bool:
    return (job_kind or "").strip().lower() in ("update", "review_revise")


def _spec_figma_urls(design_spec_path: str) -> list[str]:
    """Pull Figma URLs (or synthesize from Metadata / Source Mapping) from the PR-head spec."""
    text = _read_for_context(design_spec_path, prefer_accepted=True) or ""
    urls: list[str] = []
    for m in _PRIMARY_FIGMA_LINE_RE.finditer(text):
        urls.append(m.group(1).rstrip(").,;"))
    urls.extend(_FIGMA_URL_RE.findall(text))
    if urls:
        return list(dict.fromkeys(urls))[:8]
    file_keys = _FILE_KEY_RE.findall(text)
    node_ids = _NODE_ID_RE.findall(text)
    if file_keys and node_ids:
        fk = file_keys[0]
        nid = node_ids[0].replace(":", "-")
        return [f"https://www.figma.com/design/{fk}/Review?node-id={nid}"]
    return []


def _preview_from_spec_fallback(
    *,
    programme: str,
    slug: str,
    design_spec_path: str,
    storybook: bool,
    feedback: str,
) -> dict[str, Any]:
    """When the figma map has no entry, still allow Review revise from the PR spec."""
    urls = _spec_figma_urls(design_spec_path)
    if not urls:
        raise ValueError(
            f"No figma map entry for {design_spec_path} (checked accepted_workspace "
            f"and repo `{programme}` map), and the imported design-spec has no Figma URL / "
            "file key + node id in Metadata or Source Mapping. "
            "Add a `components` map entry for this slug under "
            f"`data/{programme}-component-figma-map.json` (or ensure the PR imports it), "
            "or cite Primary Figma / file key + node id in the design-spec before revising."
        )
    from intake_core.models.intake import parse_figma_url

    main = [parse_figma_url(u, "main") for u in urls[:1]]
    primary = main[0]
    theme_css = f"components/{programme}-theme.css"
    if not (settings.repo_root / theme_css).is_file():
        theme_css = "components/ids-theme.css"
    return {
        "programme": programme,
        "programme_display_name": programme,
        "programme_is_new": False,
        "component_display_name": slug,
        "slug": slug,
        "skill_route": "design-spec-intake-wizard",
        "skill_path": None,
        "spec_pattern": "standalone" if programme != "ids" else "ids-native",
        "design_spec_path": design_spec_path,
        "components_dir": f"components/{programme}",
        "figma_map_path": f"data/{programme}-component-figma-map.json",
        "theme_css_path": theme_css,
        "root_spec_path": "",
        "theme_foundation": None,
        "theme_reuse_programme": None,
        "donor_theme_css_path": None,
        "donor_root_spec_path": None,
        "variables_library": None,
        "generate_theme_assets": False,
        "theme_css_exists": True,
        "root_spec_exists": False,
        "storybook_examples": storybook,
        "figma": {
            "main": [n.model_dump(mode="json") for n in main],
            "elements": [],
            "states": [],
        },
        "primary_file_key": primary.file_key,
        "primary_node_id": primary.node_id,
        "notes": [
            "Review revise fallback: Figma URLs taken from imported design-spec "
            "(no map entry).",
            f"Feedback length: {len(feedback)} chars.",
        ],
        "ready_for_agent": True,
        "map_entry_sketch": {
            "designSpecPath": design_spec_path,
            "figmaUrl": primary.url,
            "fileKey": primary.file_key,
            "nodeId": primary.node_id,
        },
        "job_kind": "review_revise",
        "has_storybook": storybook,
        "mapped_figma_url": primary.url,
        "mapped_node_id": primary.node_id,
    }


def build_review_revise_preview(
    session: dict[str, Any],
    body: ReviewReviseBody,
) -> dict[str, Any]:
    """Build an Update-shaped preview pinned to the Review import / PR head."""
    programme = str(session.get("programme") or "").strip()
    slug = str(session.get("slug") or "").strip()
    if not programme or not slug:
        raise ValueError(
            "Review session is missing programme/slug — re-import the PR first."
        )
    head_branch = str(session.get("headBranch") or "").strip()
    if not head_branch:
        raise ValueError(
            "Review session is missing headBranch — cannot publish back to the PR."
        )
    pr_number = session.get("prNumber")
    if not pr_number:
        raise ValueError("Review session is missing prNumber.")

    storybook = body.storybook_examples
    if storybook is None:
        storybook = bool(session.get("storiesPath"))

    design_spec_path = str(
        session.get("designSpecPath") or f"components/{programme}/{slug}/design-spec.md"
    )

    update_req = UpdateRequest(
        programme=programme,
        componentSlug=slug,
        additionalPrompt=body.feedback,
        storybookExamples=bool(storybook),
    )
    try:
        # Prefer PR/accepted_workspace map (object-shaped programme maps included).
        preview = build_update_preview(update_req, prefer_accepted_map=True)
    except ValueError as exc:
        logger.info(
            "Review revise: accepted/map preview failed (%s) — trying repo map",
            exc,
        )
        try:
            preview = build_update_preview(update_req, prefer_accepted_map=False)
        except ValueError as exc2:
            logger.info(
                "Review revise: repo map preview failed (%s) — trying spec Metadata/Source Mapping",
                exc2,
            )
            preview = _preview_from_spec_fallback(
                programme=programme,
                slug=slug,
                design_spec_path=design_spec_path,
                storybook=bool(storybook),
                feedback=body.feedback,
            )

    preview["job_kind"] = "review_revise"
    preview["storybook_examples"] = bool(storybook)
    preview["publish_target_branch"] = head_branch
    preview["publishTargetBranch"] = head_branch
    preview["pr_number"] = int(pr_number)
    preview["prNumber"] = int(pr_number)
    preview["head_sha"] = session.get("headSha")
    preview["headSha"] = session.get("headSha")
    preview["pr_html_url"] = session.get("htmlUrl")
    preview["htmlUrl"] = session.get("htmlUrl")
    preview["review_import_id"] = session.get("importId")
    preview["reviewer_feedback"] = body.feedback
    preview["baseline_source"] = "pr_head"
    preview["notes"] = [
        f"Review revise — edit in place on PR #{pr_number} branch `{head_branch}`.",
        "Baseline is the imported PR head (accepted_workspace), not a new branch.",
        "Address reviewer feedback; keep stable contracts unless Figma proves a change.",
        *(preview.get("notes") or [])[:4],
    ]
    preview["ready_for_agent"] = True
    return preview


def review_revise_request_payload(
    session: dict[str, Any], body: ReviewReviseBody
) -> dict[str, Any]:
    return {
        "programme": session.get("programme"),
        "componentSlug": session.get("slug"),
        "additionalPrompt": body.feedback,
        "storybookExamples": body.storybook_examples
        if body.storybook_examples is not None
        else bool(session.get("storiesPath")),
        "prNumber": session.get("prNumber"),
        "headBranch": session.get("headBranch"),
        "headSha": session.get("headSha"),
        "htmlUrl": session.get("htmlUrl"),
        "importId": session.get("importId"),
        "jobKind": "review_revise",
    }


def feedback_as_prior(body: ReviewReviseBody, session: dict[str, Any]) -> str:
    pr = session.get("prNumber")
    branch = session.get("headBranch")
    return (
        f"## Reviewer feedback (PR #{pr} · `{branch}`)\n\n"
        f"{body.feedback.strip()}\n\n"
        "Apply these changes as a **minimal patch** on the existing design-spec and "
        "Storybook from `baseline_artifacts` (this PR’s head). Preserve unchanged "
        "sections and story exports. Do not invent a new component slug or open a "
        "separate PR. Do not regenerate the whole component from Figma."
    )
