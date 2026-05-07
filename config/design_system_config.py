"""
Design System Configuration
----------------------------
Abstracts all design-system-specific values so the pipeline can
serve IDS, Synapse, or any future design system by switching one env var.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional

import yaml


# ---------------------------------------------------------------------------
# Token CSS transform functions (Figma path -> CSS variable)
# ---------------------------------------------------------------------------

def ids_token_transform(name: str) -> str:
    """IDS default: lowercase, replace spaces/slashes with dashes."""
    return f"--{name.lower().replace(' ', '-').replace('/', '-')}"


def synapse_token_transform(name: str) -> str:
    """
    Synapse naming convention:
      Color/Background/Surface 1  -> --color-background-surface-1
      Spacing/space-8             -> --spacing-space-8
      Corner Radius/radius-4      -> --corner-radius-radius-4
      Font Size/body-1            -> --font-size-body-1
      Shadow/Drop Shadow 8        -> --shadow-drop-shadow-8
    """
    return f"--{name.lower().replace(' ', '-').replace('/', '-')}"


_TOKEN_TRANSFORMS: Dict[str, Callable[[str], str]] = {
    "ids": ids_token_transform,
    "synapse": synapse_token_transform,
}


# ---------------------------------------------------------------------------
# Dataclass
# ---------------------------------------------------------------------------

@dataclass
class DesignSystemConfig:
    """Encapsulates every design-system-specific value the pipeline needs."""

    # Identity
    name: str
    display_name: str

    # Figma source
    figma_file_key: str = ""

    # Data file paths (relative to project root)
    figma_map_path: str = "data/component-figma-map.json"
    rules_path: str = "rules.json"
    allowed_tokens_path: str = "allowed_tokens.json"
    component_registry_path: str = "component_registry.json"
    theme_css_path: str = "components/theme.css"
    base_ui_mapping_path: str = ""

    # Directories
    components_dir: str = "components/ids"

    # Qdrant
    qdrant_collection: str = "design_knowledge"

    # Framework
    framework_layer: str = ""  # e.g. "base-ui" for Synapse React

    # Root spec & aliases
    root_spec_path: str = ""
    baseline_components_dir: str = "components/ids"
    baseline_root_spec_path: str = "components/ids/root-spec.mdx"
    baseline_theme_css_path: str = "components/theme.css"
    program_components_dir: str = ""
    program_root_spec_path: str = ""
    program_theme_css_path: str = ""
    alias_path: str = ""
    interaction_templates_path: str = ""
    layout_cache_path: str = ""

    # Framework options
    framework_options: List[Dict[str, str]] = field(default_factory=list)

    # Typography
    typography: Dict[str, Any] = field(default_factory=dict)

    # Layout system
    breakpoints: Dict[str, str] = field(default_factory=dict)
    elevation_levels: Dict[str, str] = field(default_factory=dict)

    # Token transform name (looked up at runtime)
    _token_transform_name: str = "ids"

    @property
    def token_css_transform(self) -> Callable[[str], str]:
        return _TOKEN_TRANSFORMS.get(self._token_transform_name, ids_token_transform)

    # Convenience helpers
    @property
    def project_root(self) -> Path:
        return Path(__file__).resolve().parent.parent

    def resolve(self, relative: str) -> Path:
        """Resolve a config-relative path against the project root."""
        return self.project_root / relative


# ---------------------------------------------------------------------------
# YAML loader
# ---------------------------------------------------------------------------

def _load_yaml(path: Path) -> dict:
    with open(path) as f:
        return yaml.safe_load(f) or {}


def load_design_system(name: str) -> DesignSystemConfig:
    """
    Factory: load a DesignSystemConfig from
    ``config/design_systems/<name>.yaml``.
    """
    yaml_dir = Path(__file__).resolve().parent / "design_systems"
    yaml_path = yaml_dir / f"{name}.yaml"

    if not yaml_path.exists():
        raise FileNotFoundError(
            f"Design system config not found: {yaml_path}"
        )

    data = _load_yaml(yaml_path)

    transform_name = data.pop("token_transform", name)

    return DesignSystemConfig(
        name=data.get("name", name),
        display_name=data.get("display_name", name.title()),
        figma_file_key=data.get("figma_file_key", ""),
        figma_map_path=data.get("figma_map_path", "data/component-figma-map.json"),
        rules_path=data.get("rules_path", "rules.json"),
        allowed_tokens_path=data.get("allowed_tokens_path", "allowed_tokens.json"),
        component_registry_path=data.get("component_registry_path", "component_registry.json"),
        theme_css_path=data.get("theme_css_path", "components/theme.css"),
        base_ui_mapping_path=data.get("base_ui_mapping_path", ""),
        components_dir=data.get("components_dir", "components/ids"),
        qdrant_collection=data.get("qdrant_collection", "design_knowledge"),
        framework_layer=data.get("framework_layer", ""),
        root_spec_path=data.get("root_spec_path", ""),
        baseline_components_dir=data.get("baseline_components_dir", "components/ids"),
        baseline_root_spec_path=data.get("baseline_root_spec_path", "components/ids/root-spec.mdx"),
        baseline_theme_css_path=data.get("baseline_theme_css_path", "components/theme.css"),
        program_components_dir=data.get("program_components_dir", ""),
        program_root_spec_path=data.get("program_root_spec_path", ""),
        program_theme_css_path=data.get("program_theme_css_path", ""),
        alias_path=data.get("alias_path", ""),
        interaction_templates_path=data.get("interaction_templates_path", ""),
        layout_cache_path=data.get("layout_cache_path", ""),
        framework_options=data.get("framework_options", []),
        typography=data.get("typography", {}),
        breakpoints=data.get("breakpoints", {}),
        elevation_levels=data.get("elevation_levels", {}),
        _token_transform_name=transform_name,
    )
