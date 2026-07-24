"""Route intake payloads to the correct design-spec skill (backend owns inheritance)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..models.intake import (
    InheritsIds,
    IntakePreviewResponse,
    IntakeRequest,
    SkillRoute,
    SpecPattern,
    ThemeFoundationMode,
    parse_figma_url,
    parse_variables_library_url,
    slugify,
)
from .programmes import load_programme


def _skill_path(repo_root: Path, skill: SkillRoute) -> str:
    return str(repo_root / ".cursor" / "skills" / skill.value / "SKILL.md")


def resolve_component_slug(
    display_name: str,
    programme: dict[str, Any],
    *,
    repo_root: Path,
) -> tuple[str, str | None]:
    """Return (slug, alias_source_note). Prefer alias_path figma_to_slug when present."""
    default = slugify(display_name)
    alias_rel = programme.get("alias_path") or ""
    if not alias_rel:
        return default, None
    alias_path = repo_root / str(alias_rel)
    if not alias_path.is_file():
        return default, None
    try:
        data = json.loads(alias_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return default, None
    mapping = data.get("figma_to_slug") or data.get("aliases") or {}
    if not isinstance(mapping, dict):
        return default, None
    if display_name in mapping:
        return str(mapping[display_name]), f"alias_path:{alias_rel}"
    lowered = {str(k).lower(): v for k, v in mapping.items()}
    hit = lowered.get(display_name.strip().lower())
    if hit:
        return str(hit), f"alias_path:{alias_rel}"
    return default, None


def resolve_route(
    programme_slug: str,
    inherits: InheritsIds,
    same_anatomy_as_ids: bool | None,
) -> tuple[SkillRoute, SpecPattern, list[str], bool]:
    """Return skill, pattern, notes, ready_for_agent."""
    notes: list[str] = []

    if programme_slug == "ids":
        return (
            SkillRoute.intake_wizard,
            SpecPattern.ids_native,
            notes,
            True,
        )

    if inherits == InheritsIds.yes:
        notes.append(
            "Backend routed to design-spec-programme-inheritance (IDS fork / deltas)."
        )
        return SkillRoute.programme_inheritance, SpecPattern.ids_fork, notes, True

    if inherits == InheritsIds.no:
        notes.append("Programme-native component → standalone intake wizard.")
        return SkillRoute.intake_wizard, SpecPattern.standalone, notes, True

    if same_anatomy_as_ids is True:
        notes.append("inheritsIds=unknown + sameAnatomyAsIds=true → inheritance skill.")
        return SkillRoute.programme_inheritance, SpecPattern.ids_fork, notes, True
    if same_anatomy_as_ids is False:
        notes.append("inheritsIds=unknown + sameAnatomyAsIds=false → standalone intake.")
        return SkillRoute.intake_wizard, SpecPattern.standalone, notes, True

    notes.append(
        "inheritsIds=unknown — set sameAnatomyAsIds or choose yes/no before running the agent."
    )
    return SkillRoute.intake_wizard, SpecPattern.standalone, notes, False


def _donor_paths(
    design_systems_dir: Path,
    donor_slug: str,
) -> tuple[str, str, str]:
    """Return (theme_css_path, root_spec_path, display_name) for a donor programme."""
    donor = load_programme(design_systems_dir, donor_slug)
    if donor.get("_is_new"):
        return (
            "components/ids-theme.css",
            "components/ids/root-spec.md",
            "IDS",
        )
    theme = (
        donor.get("theme_css_path")
        or donor.get("program_theme_css_path")
        or "components/ids-theme.css"
    )
    root = (
        donor.get("root_spec_path")
        or donor.get("program_root_spec_path")
        or donor.get("baseline_root_spec_path")
        or "components/ids/root-spec.md"
    )
    display = str(donor.get("display_name") or donor_slug)
    return str(theme), str(root), display


def resolve_theme_foundation(
    body: IntakeRequest,
    programme: dict[str, Any],
    *,
    design_systems_dir: Path,
    repo_root: Path,
) -> dict[str, Any]:
    """
    Resolve programme-local theme CSS + root-spec.

    Rules:
    - IDS / paths that already exist on disk → do not recreate.
    - Missing files + themeFoundation=reuse → create programme files that
      @import / inherit the donor theme + root-spec.
    - Missing files + generateFromFigma → create from variables library URL.
    - Storybook always imports the programme themeCssPath (not the donor directly).
    """
    components_dir = (
        programme.get("components_dir")
        or programme.get("program_components_dir")
        or f"components/{body.programme}"
    )
    components_dir = str(components_dir).rstrip("/")

    if body.programme == "ids":
        theme = (
            programme.get("theme_css_path")
            or programme.get("program_theme_css_path")
            or "components/ids-theme.css"
        )
        root = (
            programme.get("root_spec_path")
            or programme.get("program_root_spec_path")
            or "components/ids/root-spec.md"
        )
        return {
            "theme_css_path": str(theme),
            "root_spec_path": str(root),
            "theme_foundation": None,
            "theme_reuse_programme": None,
            "donor_theme_css_path": None,
            "donor_root_spec_path": None,
            "variables_library": None,
            "generate_theme_assets": False,
            "theme_css_exists": (repo_root / str(theme)).is_file(),
            "root_spec_exists": (repo_root / str(root)).is_file(),
            "notes": [],
        }

    # Programme-local targets (always — Storybook imports these)
    local_theme = (
        programme.get("theme_css_path")
        or programme.get("program_theme_css_path")
        or f"components/{body.programme}-theme.css"
    )
    local_root = (
        programme.get("root_spec_path")
        or programme.get("program_root_spec_path")
        or f"{components_dir}/root-spec.md"
    )
    # New programmes must own their files under the expected paths
    if programme.get("_is_new"):
        local_theme = f"components/{body.programme}-theme.css"
        local_root = f"{components_dir}/root-spec.md"

    theme_exists = (repo_root / str(local_theme)).is_file()
    root_exists = (repo_root / str(local_root)).is_file()
    need_create = not (theme_exists and root_exists)

    if not need_create:
        return {
            "theme_css_path": str(local_theme),
            "root_spec_path": str(local_root),
            "theme_foundation": body.theme_foundation,
            "theme_reuse_programme": body.theme_reuse_programme,
            "donor_theme_css_path": None,
            "donor_root_spec_path": None,
            "variables_library": None,
            "generate_theme_assets": False,
            "theme_css_exists": True,
            "root_spec_exists": True,
            "notes": [
                f"Theme/root already exist (`{local_theme}`, `{local_root}`) — do not recreate.",
                f"Storybook MUST import `{local_theme}`.",
            ],
        }

    mode = body.theme_foundation or ThemeFoundationMode.reuse
    notes = [
        f"Missing theme/root assets "
        f"(theme exists={theme_exists}, root exists={root_exists}) — will create.",
    ]

    if mode == ThemeFoundationMode.generate_from_figma:
        lib = parse_variables_library_url(body.variables_library_url)
        notes.extend(
            [
                f"Generate `{local_theme}` + `{local_root}` from Figma variables "
                f"library `{lib.file_key}` (Tokens > Primitive > Density Primitive).",
                "Write yaml theme_css_path / root_spec_path / figma_variables_library_key "
                "to these programme paths.",
                f"Storybook MUST import exactly `{local_theme}` (not a donor theme).",
            ]
        )
        return {
            "theme_css_path": str(local_theme),
            "root_spec_path": str(local_root),
            "theme_foundation": mode,
            "theme_reuse_programme": None,
            "donor_theme_css_path": None,
            "donor_root_spec_path": None,
            "variables_library": lib,
            "generate_theme_assets": True,
            "theme_css_exists": theme_exists,
            "root_spec_exists": root_exists,
            "notes": notes,
        }

    donor_slug = (body.theme_reuse_programme or "ids").strip().lower() or "ids"
    donor_theme, donor_root, donor_display = _donor_paths(
        design_systems_dir, donor_slug
    )
    notes.extend(
        [
            f"Reuse {donor_display}: create programme files that wrap the donor.",
            f"Create `{local_theme}` with `@import` (or equivalent) of `{donor_theme}` "
            f"plus `[data-design-system=\"{body.programme}\"]` scope if needed; "
            "do not leave Storybook pointing only at the donor file.",
            f"Create `{local_root}` that inherits/references `{donor_root}` "
            "(e.g. `<!-- ds:inherits root-spec -->` + programme identity table).",
            "Only create files that are missing; leave existing ones untouched.",
            f"Yaml theme_css_path=`{local_theme}`, root_spec_path=`{local_root}`.",
            f"Storybook MUST import exactly `{local_theme}` "
            f"(which pulls in {donor_display} via CSS import).",
        ]
    )
    return {
        "theme_css_path": str(local_theme),
        "root_spec_path": str(local_root),
        "theme_foundation": ThemeFoundationMode.reuse,
        "theme_reuse_programme": donor_slug,
        "donor_theme_css_path": donor_theme,
        "donor_root_spec_path": donor_root,
        "variables_library": None,
        "generate_theme_assets": True,
        "theme_css_exists": theme_exists,
        "root_spec_exists": root_exists,
        "notes": notes,
    }


def build_preview(
    body: IntakeRequest,
    programme: dict[str, Any],
    *,
    repo_root: Path,
    design_systems_dir: Path | None = None,
) -> IntakePreviewResponse:
    slug, alias_note = resolve_component_slug(
        body.component_display_name.strip(),
        programme,
        repo_root=repo_root,
    )
    skill, pattern, notes, ready = resolve_route(
        body.programme,
        body.inherits_ids,
        body.same_anatomy_as_ids,
    )
    if alias_note:
        notes.append(f"Slug resolved via {alias_note} → `{slug}`.")

    components_dir = (
        programme.get("components_dir")
        or programme.get("program_components_dir")
        or f"components/{body.programme}"
    )
    design_spec_path = f"{str(components_dir).rstrip('/')}/{slug}/design-spec.md"
    figma_map = programme.get("figma_map_path") or "data/component-figma-map.json"

    ds_dir = design_systems_dir or (repo_root / "config" / "design_systems")
    theme_info = resolve_theme_foundation(
        body,
        programme,
        design_systems_dir=ds_dir,
        repo_root=repo_root,
    )
    notes.extend(theme_info["notes"])

    figma = {
        "main": [parse_figma_url(u, "main") for u in body.main_urls],
        "elements": [parse_figma_url(u, "elements") for u in body.element_urls],
        "states": [parse_figma_url(u, "states") for u in body.state_urls],
    }
    primary = figma["main"][0]

    is_new = bool(programme.get("_is_new"))
    if is_new:
        notes.append(
            f"New programme '{body.programme}' — bootstrap "
            f"config/design_systems/{body.programme}.yaml before/with the agent run."
        )
    if pattern == SpecPattern.ids_fork and not programme.get("baseline_components_dir"):
        notes.append(
            "Warning: programme yaml has no baseline_components_dir — confirm IDS baseline exists."
        )

    map_entry: dict[str, Any] = {
        "designSpecPath": design_spec_path,
        "figmaUrl": primary.url,
        "fileKey": primary.file_key,
        "nodeId": primary.node_id,
        "mainComponentSetNodeId": primary.node_id,
        "specPattern": pattern.value,
        "displayName": body.component_display_name.strip(),
    }
    if pattern == SpecPattern.ids_fork:
        map_entry["idsBaselineSpecPath"] = f"components/ids/{slug}/design-spec.md"

    return IntakePreviewResponse(
        programme=body.programme,
        programme_display_name=str(programme.get("display_name") or body.programme),
        programme_is_new=is_new,
        component_display_name=body.component_display_name.strip(),
        slug=slug,
        skill_route=skill,
        skill_path=_skill_path(repo_root, skill),
        spec_pattern=pattern,
        design_spec_path=design_spec_path,
        components_dir=str(components_dir),
        figma_map_path=str(figma_map),
        theme_css_path=theme_info["theme_css_path"],
        root_spec_path=theme_info["root_spec_path"],
        theme_foundation=theme_info["theme_foundation"],
        theme_reuse_programme=theme_info["theme_reuse_programme"],
        donor_theme_css_path=theme_info.get("donor_theme_css_path"),
        donor_root_spec_path=theme_info.get("donor_root_spec_path"),
        variables_library=theme_info["variables_library"],
        generate_theme_assets=bool(theme_info["generate_theme_assets"]),
        theme_css_exists=bool(theme_info.get("theme_css_exists")),
        root_spec_exists=bool(theme_info.get("root_spec_exists")),
        storybook_examples=body.storybook_examples,
        figma=figma,
        primary_file_key=primary.file_key,
        primary_node_id=primary.node_id,
        map_entry_sketch=map_entry,
        notes=notes,
        ready_for_agent=ready,
    )
