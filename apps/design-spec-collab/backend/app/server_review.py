"""Rule-based (and optional Ollama) review of client artifacts."""

from __future__ import annotations

import logging
import re
from typing import Any

from .config import settings
from .session_models import Artifact, CollabSession, ReviewVerdict

logger = logging.getLogger(__name__)

REQUIRED_HEADINGS = [
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


def _slug_to_pascal(slug: str) -> str:
    return "".join(part.capitalize() for part in str(slug or "Component").split("-") if part)


def storybook_requested(preview: dict[str, Any] | None) -> bool:
    p = preview or {}
    return bool(p.get("storybook_examples") or p.get("storybookExamples"))


def expected_storybook_paths(preview: dict[str, Any] | None) -> list[str]:
    """Canonical Storybook artifact paths when storybookExamples is enabled."""
    p = preview or {}
    if not storybook_requested(p):
        return []
    programme = str(p.get("programme") or "ids")
    slug = str(p.get("slug") or "component")
    pascal = _slug_to_pascal(slug)
    return [
        f"storybook-generated/{programme}/src/components/{pascal}.stories.tsx",
        "storybook/.storybook/main.ts",
    ]


def _find_design_spec_artifact(artifacts: list[Artifact]) -> Artifact | None:
    for a in artifacts:
        name = (a.name or "").lower()
        if name.endswith("design-spec.md") or name == "outline.md" or "design-spec" in name:
            return a
    for a in artifacts:
        if (a.name or "").endswith(".md"):
            return a
    return None


def _find_design_spec(artifacts: list[Artifact]) -> str | None:
    art = _find_design_spec_artifact(artifacts)
    return art.content if art else None


def extract_design_spec_payload(session: CollabSession) -> dict[str, Any] | None:
    """Return {path, name, content, turn} for operator preview when client submitted a spec."""
    art = _find_design_spec_artifact(session.artifacts)
    if not art or not (art.content or "").strip():
        return None
    preview = session.preview or {}
    path = preview.get("design_spec_path") or preview.get("designSpecPath") or art.name
    return {
        "path": str(path),
        "name": art.name,
        "content": art.content,
        "turn": session.turn,
        "charCount": len(art.content),
    }


def _missing_sections(content: str) -> list[str]:
    missing = []
    for h in REQUIRED_HEADINGS:
        pattern = rf"^##\s+{re.escape(h)}\s*$"
        if not re.search(pattern, content, flags=re.MULTILINE):
            missing.append(h)
    return missing


def _artifact_names(artifacts: list[Artifact]) -> list[str]:
    return [(a.name or "").replace("\\", "/").lstrip("./") for a in artifacts if a.name]


def _has_storybook_stories(artifacts: list[Artifact], preview: dict[str, Any]) -> bool:
    programme = str(preview.get("programme") or "")
    names = _artifact_names(artifacts)
    for name in names:
        lower = name.lower()
        if not lower.endswith(".stories.tsx") and not lower.endswith(".stories.ts"):
            continue
        if "storybook-generated" in lower:
            if programme and f"storybook-generated/{programme}/" in lower:
                return True
            if not programme:
                return True
        if "/" not in name:
            return True
    return False


def _missing_storybook_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    if not storybook_requested(preview):
        return []
    missing: list[str] = []
    expected = expected_storybook_paths(preview)
    if not _has_storybook_stories(artifacts, preview):
        missing.append(
            "storybook stories missing — submit "
            + (expected[0] if expected else "*.stories.tsx under storybook-generated/")
        )
    names = [n.lower() for n in _artifact_names(artifacts)]
    has_main = any(
        n.endswith("storybook/.storybook/main.ts") or n.endswith(".storybook/main.ts")
        for n in names
    )
    if not has_main:
        missing.append(
            "storybook/.storybook/main.ts missing (required for Spec Generated discovery)"
        )
    return missing


def _truthy(preview: dict[str, Any], *keys: str) -> bool:
    for k in keys:
        if k in preview:
            return bool(preview.get(k))
    return False


def _preview_path(preview: dict[str, Any], *keys: str) -> str | None:
    for k in keys:
        v = preview.get(k)
        if v:
            return str(v)
    return None


def foundation_paths(preview: dict[str, Any]) -> list[str]:
    """Theme / root-spec / programme yaml when foundation bootstrap is required."""
    need = _truthy(preview, "generate_theme_assets", "generateThemeAssets") or _truthy(
        preview, "programme_is_new", "programmeIsNew"
    )
    theme_exists = _truthy(preview, "theme_css_exists", "themeCssExists")
    root_exists = _truthy(preview, "root_spec_exists", "rootSpecExists")
    paths: list[str] = []
    programme = preview.get("programme") or "ids"
    if need or not theme_exists:
        p = _preview_path(preview, "theme_css_path", "themeCssPath")
        if p:
            paths.append(p)
    if need or not root_exists:
        p = _preview_path(preview, "root_spec_path", "rootSpecPath")
        if p:
            paths.append(p)
    if need or _truthy(preview, "programme_is_new", "programmeIsNew"):
        paths.append(f"config/design_systems/{programme}.yaml")
    # de-dupe
    seen: set[str] = set()
    out: list[str] = []
    for p in paths:
        if p not in seen:
            seen.add(p)
            out.append(p)
    return out


def registry_paths(preview: dict[str, Any]) -> list[str]:
    """Data-map / registry artifacts expected for every intake run."""
    paths: list[str] = []
    fmap = _preview_path(preview, "figma_map_path", "figmaMapPath")
    if fmap:
        paths.append(fmap)
    # Standalone / inheritance registry updates
    pattern = str(preview.get("spec_pattern") or preview.get("specPattern") or "")
    programme = str(preview.get("programme") or "")
    if programme and programme != "ids":
        paths.append("data/programme-inheritance-registry.json")
    elif pattern in ("standalone", "ids-fork", "programme_inheritance"):
        paths.append("data/programme-inheritance-registry.json")
    return paths


def _has_artifact_path(artifacts: list[Artifact], expected: str) -> bool:
    exp = expected.replace("\\", "/").lstrip("./").lower()
    base = exp.rsplit("/", 1)[-1]
    for name in _artifact_names(artifacts):
        n = name.lower()
        if n == exp or n.endswith("/" + exp) or n == base:
            return True
        # allow basename match for map/registry json
        if base.endswith(".json") and n.endswith(base):
            return True
        if base.endswith(".css") and n.endswith(base):
            return True
        if base.endswith(".yaml") and n.endswith(base):
            return True
        if base.endswith("root-spec.md") and n.endswith("root-spec.md"):
            return True
    return False


def _missing_foundation_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    missing: list[str] = []
    for path in foundation_paths(preview):
        if not _has_artifact_path(artifacts, path):
            missing.append(f"missing foundation artifact `{path}`")
    return missing


def _missing_registry_criteria(
    artifacts: list[Artifact], preview: dict[str, Any]
) -> list[str]:
    missing: list[str] = []
    for path in registry_paths(preview):
        if not _has_artifact_path(artifacts, path):
            missing.append(f"missing data/registry artifact `{path}`")
    return missing


def review_session(
    session: CollabSession,
    *,
    artifacts: list[Artifact],
) -> ReviewVerdict:
    preview = session.preview or {}
    content = _find_design_spec(artifacts)
    if not content or not content.strip():
        return ReviewVerdict(
            decision="revise",
            score=0.0,
            feedback="No design-spec markdown artifact found. Produce design-spec.md with required ## sections.",
            missing_criteria=["design-spec.md missing or empty"],
        )

    missing = _missing_sections(content)
    story_missing = _missing_storybook_criteria(artifacts, preview)
    foundation_missing = _missing_foundation_criteria(artifacts, preview)
    registry_missing = _missing_registry_criteria(artifacts, preview)
    all_extra = story_missing + foundation_missing + registry_missing
    denom = max(
        len(REQUIRED_HEADINGS)
        + (1 if storybook_requested(preview) else 0)
        + (1 if foundation_paths(preview) else 0)
        + (1 if registry_paths(preview) else 0),
        1,
    )
    score = max(0.0, 1.0 - ((len(missing) + len(all_extra)) / denom))

    if (
        settings.stub_force_revise_once
        and session.revise_count == 0
        and (settings.figma_mode or "stub") == "stub"
    ):
        return ReviewVerdict(
            decision="revise",
            score=score,
            feedback=(
                "Server stub review: please strengthen Slot geometry notes under "
                "Layout & Measurements and ensure Source Mapping cites file key + node ids. "
                "Resubmit an updated design-spec.md."
            ),
            missing_criteria=missing
            + all_extra
            + (["stub_forced_revise"] if not missing and not all_extra else []),
        )

    if missing or all_extra:
        parts = []
        if missing:
            parts.append("Missing required sections: " + ", ".join(missing))
        if foundation_missing:
            parts.append("Programme foundation: " + "; ".join(foundation_missing))
        if registry_missing:
            parts.append("Data/registry: " + "; ".join(registry_missing))
        if story_missing:
            parts.append("Storybook requirements: " + "; ".join(story_missing))
        return ReviewVerdict(
            decision="revise",
            score=score,
            feedback=" ".join(parts),
            missing_criteria=missing + all_extra,
        )

    if settings.server_review_mode == "ollama":
        soft = _ollama_soft_review(content)
        if soft and soft.get("decision") == "revise":
            return ReviewVerdict(
                decision="revise",
                score=float(soft.get("score") or score),
                feedback=str(soft.get("feedback") or "Ollama requested revisions."),
                missing_criteria=list(soft.get("missing_criteria") or []),
            )

    return ReviewVerdict(
        decision="accept",
        score=1.0,
        feedback="All required design-spec, foundation, registry, and Storybook artifacts present.",
        missing_criteria=[],
    )


def _ollama_soft_review(content: str) -> dict[str, Any] | None:
    try:
        import json

        import requests

        prompt = (
            "You are a design-spec reviewer. Reply JSON only: "
            '{"decision":"accept"|"revise","score":0-1,"feedback":"...","missing_criteria":[]} .\n'
            "Require the standard IDS design-spec ## sections.\n\n"
            + content[:12000]
        )
        r = requests.post(
            f"{settings.ollama_host}/api/generate",
            json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "format": "json",
            },
            timeout=60,
        )
        r.raise_for_status()
        raw = r.json().get("response") or "{}"
        return json.loads(raw)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Ollama review skipped: %s", exc)
        return None


def build_initial_requests(preview: dict[str, Any]) -> list[dict[str, str]]:
    """
    Mirror design-spec-intake-wizard run-phase deliverables (not spec-only).
    Client must return artifacts for every expected_artifact path.
    """
    slug = preview.get("slug") or "component"
    programme = preview.get("programme") or "ids"
    display = (
        preview.get("component_display_name")
        or preview.get("componentDisplayName")
        or slug
    )
    theme_css = _preview_path(preview, "theme_css_path", "themeCssPath") or ""
    design_path = (
        _preview_path(preview, "design_spec_path", "designSpecPath") or "design-spec.md"
    )
    skill = preview.get("skill_route") or preview.get("skillRoute") or "design-spec-intake-wizard"
    requests: list[dict[str, str]] = [
        {
            "id": "req-write-spec",
            "kind": "write_design_spec",
            "instruction": (
                f"Follow the `{skill}` run-phase rules (same as design-spec-intake-wizard). "
                f"Using server-packaged figma_evidence only, write production-ready "
                f"`{design_path}` for {programme}/{slug} (`{display}`). Include every "
                f"required ## section + Slot geometry (Figma-verified). Use var(--...). "
                f"Do not connect client Figma MCP. Return artifact name `{design_path}`."
            ),
            "expected_artifact": str(design_path),
        }
    ]

    foundations = foundation_paths(preview)
    if foundations:
        donor = _preview_path(preview, "donor_theme_css_path", "donorThemeCssPath") or "components/ids-theme.css"
        donor_root = (
            _preview_path(preview, "donor_root_spec_path", "donorRootSpecPath")
            or "components/ids/root-spec.md"
        )
        paths_txt = ", ".join(f"`{p}`" for p in foundations)
        requests.append(
            {
                "id": "req-programme-foundation",
                "kind": "write_programme_foundation",
                "instruction": (
                    f"Programme foundation files are REQUIRED for this job. Submit these "
                    f"artifacts (full paths as names): {paths_txt}. "
                    f"If creating theme CSS, prefer a thin wrapper that `@import`s donor "
                    f"`{donor}` unless variables-library generation was requested. "
                    f"If creating root-spec.md, inherit/document donor `{donor_root}`. "
                    f"If creating `config/design_systems/{programme}.yaml`, include "
                    f"components_dir, figma_map_path, theme_css_path, root_spec_path, display_name. "
                    f"Skip inventing paths outside write_path_allowlist."
                ),
                "expected_artifact": foundations[0],
            }
        )

    regs = registry_paths(preview)
    if regs:
        fmap = regs[0]
        requests.append(
            {
                "id": "req-data-registry",
                "kind": "write_data_registry",
                "instruction": (
                    f"Data/map updates are REQUIRED. Submit full-file artifacts for: "
                    + ", ".join(f"`{p}`" for p in regs)
                    + f". For `{fmap}`, upsert an entry for slug `{slug}` using "
                    f"prompt_package.confirmed_payload.mapEntrySketch (designSpecPath, "
                    f"figmaUrl, fileKey, nodeId/mainComponentSetNodeId, specPattern, "
                    f"elements/states node ids). Keep existing unrelated entries. "
                    f"For `data/programme-inheritance-registry.json`, upsert "
                    f"`pattern: standalone` (or inheritance fields if skill is inheritance) "
                    f"for programme `{programme}` / slug `{slug}`."
                ),
                "expected_artifact": fmap,
            }
        )

    if storybook_requested(preview):
        story_paths = expected_storybook_paths(preview)
        stories_path = story_paths[0]
        main_ts = story_paths[1]
        programme_display = (
            preview.get("programme_display_name")
            or preview.get("programmeDisplayName")
            or str(programme).title()
        )
        theme_rule = (
            f"Import theme CSS exactly from `{theme_css}`."
            if theme_css
            else "Import the programme theme CSS from confirmed_payload.themeCssPath."
        )
        requests.append(
            {
                "id": "req-write-storybook",
                "kind": "write_storybook_examples",
                "instruction": (
                    f"Storybook Spec Accurate Design is REQUIRED. Submit:\n"
                    f"1. `{stories_path}` — meta.title `Spec Generated/{programme_display}/{display}`. "
                    f"{theme_rule}\n"
                    f"2. `{main_ts}` — include glob `storybook-generated/*/src/**/*.stories.@(ts|tsx)`.\n"
                    f"3. Optionally update files under `generation/deterministic_storybook/` "
                    f"if needed for the gate (allowlisted)."
                ),
                "expected_artifact": stories_path,
            }
        )
    return requests


def build_revise_requests(
    session: CollabSession, verdict: ReviewVerdict
) -> list[dict[str, str]]:
    preview = session.preview or {}
    required = (
        [
            _preview_path(preview, "design_spec_path", "designSpecPath")
            or "design-spec.md"
        ]
        + foundation_paths(preview)
        + registry_paths(preview)
        + expected_storybook_paths(preview)
    )
    required = [p for p in required if p]
    return [
        {
            "id": f"req-revise-{session.turn + 1}",
            "kind": "revise_sections",
            "instruction": (
                "Revise ALL required intake artifacts based on server feedback "
                "(design-spec-intake-wizard run-phase parity — not design-spec.md alone). "
                f"Feedback: {verdict.feedback}. "
                f"Missing/criteria: {', '.join(verdict.missing_criteria) or 'n/a'}. "
                "Resubmit full contents for every required path: "
                + ", ".join(f"`{p}`" for p in required)
                + "."
            ),
            "expected_artifact": required[0] if required else "design-spec.md",
        }
    ]
