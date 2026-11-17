"""Build update preview + intake-shaped prompt inputs from map + additional URLs."""

from __future__ import annotations

import re
from pathlib import Path
from typing import Any
from urllib.parse import quote

from intake_core.models.intake import (
    InheritsIds,
    IntakeRequest,
    SkillRoute,
    SpecPattern,
    parse_figma_url,
)
from intake_core.services.programmes import load_programme

from .config import settings
from .github_catalog import (
    _load_map_entries,
    _match_map_entry,
    list_update_components,
)
from .update_models import UpdateRequest


_FIGMA_RECHECK_RE = re.compile(
    r"\b("
    r"re-?check|re-?fetch|refetch|re-?verify|re-?inspect|"
    r"from\s+figma|against\s+figma|figma\s+(design|update|change)|"
    r"visual\s+(check|review|refresh)|refresh\s+(from\s+)?(design|figma)|"
    r"layout\s+change|token\s+change|state\s+matrix|anatomy|"
    r"screenshot|design\s+changed|outdated\s+spec"
    r")\b",
    re.IGNORECASE,
)


def update_needs_figma_pack(body: UpdateRequest) -> bool:
    """True when optional URLs were provided or the prompt asks to recheck design/Figma."""
    if (
        body.additional_main_urls
        or body.additional_element_urls
        or body.additional_state_urls
    ):
        return True
    prompt = (body.additional_prompt or "").strip()
    if not prompt:
        return False
    return bool(_FIGMA_RECHECK_RE.search(prompt))


def update_include_map(body: UpdateRequest) -> bool:
    """Map file is only required on the new PR when operator supplied extra Figma URLs."""
    return bool(
        body.additional_main_urls
        or body.additional_element_urls
        or body.additional_state_urls
    )


def _skill_path(repo_root: Path, skill: SkillRoute) -> str:
    rel = f".cursor/skills/{skill.value}/SKILL.md"
    return str((repo_root / rel).resolve()) if (repo_root / rel).is_file() else rel


def _node_url(file_key: str, node_id: str) -> str:
    """Build a Figma URL with node-id (hyphen form for query)."""
    nid = str(node_id).replace(":", "-")
    return (
        f"https://www.figma.com/design/{file_key}/Component"
        f"?node-id={quote(nid)}"
    )


def _urls_from_map_entry(entry: dict[str, Any]) -> dict[str, list[str]]:
    file_key = str(entry.get("fileKey") or "")
    main: list[str] = []
    elements: list[str] = []
    states: list[str] = []

    primary = str(entry.get("figmaUrl") or "").strip()
    if primary:
        main.append(primary)
    elif file_key and (entry.get("nodeId") or entry.get("mainComponentSetNodeId")):
        nid = entry.get("mainComponentSetNodeId") or entry.get("nodeId")
        main.append(_node_url(file_key, str(nid)))

    # Supplemental node ids commonly present on map rows
    element_keys = (
        "elementNodeId",
        "elementsNodeId",
        "menuElementsNodeId",
        "fieldStatesMatrixNodeId",
    )
    state_keys = (
        "stateMatrixNodeId",
        "optionStatesNodeId",
        "showcaseNodeId",
    )
    for k in element_keys:
        nid = entry.get(k)
        if nid and file_key:
            elements.append(_node_url(file_key, str(nid)))
    for k in state_keys:
        nid = entry.get(k)
        if nid and file_key:
            states.append(_node_url(file_key, str(nid)))

    return {"main": main, "elements": elements, "states": states}


def build_update_preview(
    body: UpdateRequest, *, prefer_accepted_map: bool = False
) -> dict[str, Any]:
    """Return a dict compatible with collab packaging (mirrors IntakePreviewResponse + extras)."""
    catalogue = list_update_components(body.programme)
    match = next(
        (c for c in catalogue["components"] if c["slug"] == body.component_slug),
        None,
    )
    design_spec_path = (
        str(match["designSpecPath"])
        if match
        else f"components/{body.programme}/{body.component_slug}/design-spec.md"
    )
    map_path = str(
        (match or {}).get("mapPath")
        or catalogue.get("figmaMapPath")
        or f"data/{body.programme}-component-figma-map.json"
    )
    components_dir = str(catalogue.get("componentsDir") or f"components/{body.programme}")
    entries = _load_map_entries(map_path, prefer_accepted=prefer_accepted_map)
    entry = _match_map_entry(
        entries,
        programme=body.programme,
        components_dir=components_dir,
        slug=body.component_slug,
        design_spec_path=design_spec_path,
    )
    if entry is None and match is None and not prefer_accepted_map:
        raise ValueError(
            f"Component '{body.component_slug}' not found under programme "
            f"'{body.programme}' (no design-spec.md)."
        )
    if entry is None:
        raise ValueError(
            f"No figma map entry for {design_spec_path} in {map_path}. "
            "Cannot update without mapped Figma URLs."
        )

    return _preview_from_map_entry(
        body=body,
        entry=entry,
        design_spec_path=design_spec_path,
        map_path=map_path,
        components_dir=components_dir,
        catalogue=catalogue,
        match=match,
    )


def _preview_from_map_entry(
    *,
    body: UpdateRequest,
    entry: dict[str, Any],
    design_spec_path: str,
    map_path: str,
    components_dir: str,
    catalogue: dict[str, Any] | None = None,
    match: dict[str, Any] | None = None,
) -> dict[str, Any]:
    catalogue = catalogue or {}
    match = match or {}
    mapped = _urls_from_map_entry(entry)
    main_urls = list(mapped["main"]) + list(body.additional_main_urls)
    element_urls = list(mapped["elements"]) + list(body.additional_element_urls)
    state_urls = list(mapped["states"]) + list(body.additional_state_urls)
    # Object-map elements/states nested dicts → URLs
    file_key = str(entry.get("fileKey") or "")
    elements_obj = entry.get("elements")
    if isinstance(elements_obj, dict) and file_key:
        for nid in elements_obj.values():
            if nid:
                element_urls.append(_node_url(file_key, str(nid)))
    states_obj = entry.get("states")
    if isinstance(states_obj, dict) and file_key:
        for nid in states_obj.values():
            if nid:
                state_urls.append(_node_url(file_key, str(nid)))
    # de-dupe preserve order
    def _dedupe(urls: list[str]) -> list[str]:
        seen: set[str] = set()
        out: list[str] = []
        for u in urls:
            if u and u not in seen:
                seen.add(u)
                out.append(u)
        return out

    main_urls = _dedupe(main_urls)
    element_urls = _dedupe(element_urls)
    state_urls = _dedupe(state_urls)
    if not main_urls:
        raise ValueError("Map entry has no figmaUrl/nodeId and no additionalMainUrls.")

    # Validate all URLs
    figma = {
        "main": [parse_figma_url(u, "main") for u in main_urls],
        "elements": [parse_figma_url(u, "elements") for u in element_urls],
        "states": [parse_figma_url(u, "states") for u in state_urls],
    }
    primary = figma["main"][0]

    spec_pattern_raw = str(
        entry.get("specPattern") or match.get("specPattern") or ""
    ).strip()
    if spec_pattern_raw == "ids-fork" or entry.get("idsBaselineSpecPath"):
        skill = SkillRoute.programme_inheritance
        pattern = SpecPattern.ids_fork
        inherits = InheritsIds.yes
    elif body.programme == "ids":
        skill = SkillRoute.intake_wizard
        pattern = SpecPattern.ids_native
        inherits = InheritsIds.skipped
    else:
        skill = SkillRoute.intake_wizard
        pattern = SpecPattern.standalone
        inherits = InheritsIds.no

    try:
        programme_cfg = load_programme(settings.design_systems_dir, body.programme)
    except Exception:  # noqa: BLE001
        programme_cfg = {
            "name": body.programme,
            "display_name": body.programme,
            "components_dir": components_dir,
            "figma_map_path": map_path,
            "theme_css_path": catalogue.get("themeCssPath") or "components/ids-theme.css",
            "_is_new": False,
        }

    display = str(
        entry.get("component")
        or entry.get("displayName")
        or match.get("displayName")
        or body.component_slug
    )
    storybook = bool(body.storybook_examples)

    theme_css = str(
        programme_cfg.get("theme_css_path")
        or catalogue.get("themeCssPath")
        or "components/ids-theme.css"
    )
    root_spec = str(programme_cfg.get("root_spec_path") or "")

    map_entry_sketch = {
        "designSpecPath": design_spec_path,
        "figmaUrl": primary.url,
        "fileKey": primary.file_key,
        "nodeId": primary.node_id,
        "mainComponentSetNodeId": primary.node_id,
        "specPattern": pattern.value,
        "displayName": display,
    }
    if pattern == SpecPattern.ids_fork:
        map_entry_sketch["idsBaselineSpecPath"] = (
            entry.get("idsBaselineSpecPath")
            or f"components/ids/{body.component_slug}/design-spec.md"
        )

    notes = [
        "Catalogue Update — new branch `update/{slug}-{sessionShort}` and new PR "
        "(not an existing Review PR).",
        f"Map: `{map_path}`.",
        "Programme foundation (theme/root-spec/yaml) is context-only — do not recreate.",
        "Do not modify data/programme-inheritance-registry.json.",
    ]
    need_figma = update_needs_figma_pack(body)
    include_map = update_include_map(body)
    if need_figma:
        notes.append("Figma evidence will be packed (extra URLs and/or recheck prompt).")
    else:
        notes.append(
            "Figma pack skipped — apply additional prompt against baseline only "
            "(no recheck keywords / no extra URLs)."
        )
    if include_map:
        notes.append("Figma map update is in scope (extra URLs provided).")
    else:
        notes.append("Figma map file not required on this PR (reuse existing map entry).")
    if match.get("hasStorybook"):
        notes.append("Existing Storybook stories detected for this component.")

    preview = {
        "programme": body.programme,
        "programme_display_name": str(
            programme_cfg.get("display_name") or body.programme
        ),
        "programme_is_new": False,
        "component_display_name": display,
        "slug": body.component_slug,
        "skill_route": skill.value,
        "skill_path": _skill_path(settings.repo_root, skill),
        "spec_pattern": pattern.value,
        "design_spec_path": design_spec_path,
        "components_dir": components_dir,
        "figma_map_path": map_path,
        "theme_css_path": theme_css,
        "root_spec_path": root_spec,
        "theme_foundation": None,
        "theme_reuse_programme": None,
        "donor_theme_css_path": None,
        "donor_root_spec_path": None,
        "variables_library": None,
        "generate_theme_assets": False,
        "theme_css_exists": True,
        "root_spec_exists": bool(root_spec),
        "programme_yaml_exists": True,
        "storybook_examples": storybook,
        "figma": {
            k: [n.model_dump(mode="json") for n in v] for k, v in figma.items()
        },
        "primary_file_key": primary.file_key,
        "primary_node_id": primary.node_id,
        "notes": notes,
        "ready_for_agent": True,
        "map_entry_sketch": map_entry_sketch,
        "job_kind": "update",
        "has_storybook": bool(match.get("hasStorybook") or storybook),
        "mapped_figma_url": primary.url,
        "mapped_node_id": primary.node_id,
        "inherits_ids": inherits.value if hasattr(inherits, "value") else str(inherits),
        "skip_figma_pack": not need_figma,
        "skipFigmaPack": not need_figma,
        "update_include_map": include_map,
        "updateIncludeMap": include_map,
        "update_skip_inheritance_registry": True,
        "baseline_source": "catalogue",
        "reviewer_feedback": (body.additional_prompt or "").strip() or None,
    }
    return preview


def update_to_intake_request(body: UpdateRequest, preview: dict[str, Any]) -> IntakeRequest:
    """Build IntakeRequest so we can reuse build_prompt_package."""
    figma = preview.get("figma") or {}
    main = [x["url"] for x in figma.get("main") or []]
    elements = [x["url"] for x in figma.get("elements") or []]
    states = [x["url"] for x in figma.get("states") or []]
    pattern = preview.get("spec_pattern") or "standalone"
    if pattern == "ids-fork":
        inherits = InheritsIds.yes
    elif preview.get("programme") == "ids":
        inherits = InheritsIds.skipped
    else:
        inherits = InheritsIds.no

    return IntakeRequest(
        programme=body.programme,
        componentDisplayName=str(preview.get("component_display_name") or body.component_slug),
        inheritsIds=inherits,
        mainUrls=main,
        elementUrls=elements,
        stateUrls=states,
        storybookExamples=body.storybook_examples,
        additionalNotes=body.additional_prompt,
    )
