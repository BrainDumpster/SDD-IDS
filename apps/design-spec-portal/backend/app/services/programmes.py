from __future__ import annotations

import re
from pathlib import Path
from typing import Any

import yaml

_PROGRAMME_SLUG_RE = re.compile(r"^[a-z][a-z0-9-]{0,62}$")


def list_programmes(design_systems_dir: Path) -> list[dict[str, Any]]:
    if not design_systems_dir.is_dir():
        return []
    out: list[dict[str, Any]] = []
    for path in sorted(design_systems_dir.glob("*.yaml")):
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        slug = str(data.get("name") or path.stem).lower()
        out.append(
            {
                "slug": slug,
                "displayName": data.get("display_name") or slug.upper(),
                "componentsDir": data.get("components_dir")
                or data.get("program_components_dir"),
                "hasIdsBaseline": bool(data.get("baseline_components_dir")),
            }
        )
    return out


def validate_programme_slug(slug: str) -> str:
    normalized = slug.strip().lower()
    if not _PROGRAMME_SLUG_RE.match(normalized):
        raise ValueError(
            "Programme name must be lowercase letters/digits/hyphens "
            "(start with a letter), e.g. dap, synapse, my-programme."
        )
    return normalized


def load_programme(design_systems_dir: Path, slug: str) -> dict[str, Any]:
    """Load existing yaml or synthesize a draft config for a new programme slug."""
    slug = validate_programme_slug(slug)
    path = design_systems_dir / f"{slug}.yaml"
    if path.is_file():
        data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        data["_slug"] = str(data.get("name") or slug).lower()
        data["_path"] = str(path)
        data["_is_new"] = False
        return data

    display = slug.replace("-", " ").title()
    return {
        "name": slug,
        "display_name": display,
        "components_dir": f"components/{slug}",
        "program_components_dir": f"components/{slug}",
        "figma_map_path": f"data/{slug}-component-figma-map.json",
        "theme_css_path": f"components/{slug}-theme.css",
        "baseline_components_dir": "components/ids",
        "_slug": slug,
        "_path": None,
        "_is_new": True,
    }
