"""Resolve ids-fork programme specs to IDS baseline + programme delta paths."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional


@dataclass(frozen=True)
class SpecInheritanceResolution:
    """Machine-readable ids-fork resolution for codegen and indexing."""

    programme: str
    slug: str
    pattern: str  # ids-fork | standalone | dap-style
    programme_spec_path: str
    ids_baseline_spec_path: Optional[str]
    ids_baseline_slug: Optional[str]
    layer_precedence: str
    resolution_order: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "programme": self.programme,
            "slug": self.slug,
            "pattern": self.pattern,
            "programme_spec_path": self.programme_spec_path,
            "ids_baseline_spec_path": self.ids_baseline_spec_path,
            "ids_baseline_slug": self.ids_baseline_slug,
            "layer_precedence": self.layer_precedence,
            "resolution_order": self.resolution_order,
        }


def _normalize_slug(slug: str) -> str:
    return re.sub(r"[_\s]+", "-", slug.strip().lower())


def _load_json_list(path: Path) -> List[Dict[str, Any]]:
    if not path.is_file():
        return []
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return [row for row in data if isinstance(row, dict)]
    if isinstance(data, dict):
        components = data.get("components")
        if isinstance(components, list):
            return [row for row in components if isinstance(row, dict)]
    return []


class SpecInheritanceResolver:
    """
    Resolve programme component slugs to layered spec paths.

    Priority:
    1. programme-inheritance-registry.json (authoritative for ids-fork)
    2. programme figma map `designSpecPath` + `idsBaselineSpecPath`
    3. Same slug under baseline_components_dir / programme_components_dir
    """

    LAYER_PRECEDENCE = (
        "program_component_delta > program_root_delta > ids_component > ids_root"
    )
    RESOLUTION_ORDER_IDS_FORK = [
        "Load IDS baseline design-spec.md",
        "Apply programme design-spec.md (deltas + Synapse-only slots)",
        "Load programme theme CSS over IDS theme",
        "Compose child specs referenced in programme spec",
    ]

    def __init__(
        self,
        project_root: Path,
        programme: str,
        *,
        registry_path: str = "data/programme-inheritance-registry.json",
        figma_map_path: Optional[str] = None,
        alias_path: Optional[str] = None,
        baseline_components_dir: str = "components/ids",
        programme_components_dir: Optional[str] = None,
    ) -> None:
        self.project_root = project_root.resolve()
        self.programme = programme.lower()
        self.registry_path = self.project_root / registry_path
        self.figma_map_path = (
            self.project_root / figma_map_path if figma_map_path else None
        )
        self.alias_path = self.project_root / alias_path if alias_path else None
        self.baseline_components_dir = self.project_root / baseline_components_dir
        self.programme_components_dir = (
            self.project_root / programme_components_dir
            if programme_components_dir
            else self.project_root / f"components/{self.programme}"
        )
        self._alias_to_canonical = self._build_alias_index()

    def _build_alias_index(self) -> Dict[str, str]:
        index: Dict[str, str] = {}
        if not self.alias_path or not self.alias_path.is_file():
            return index
        data = json.loads(self.alias_path.read_text(encoding="utf-8"))
        aliases = data.get("aliases") if isinstance(data, dict) else None
        if not isinstance(aliases, dict):
            return index
        for canonical, variants in aliases.items():
            canon = _normalize_slug(canonical)
            index[canon] = canon
            if not isinstance(variants, list):
                continue
            for variant in variants:
                index[_normalize_slug(str(variant))] = canon
        return index

    def canonical_slug(self, slug: str) -> str:
        normalized = _normalize_slug(slug)
        return self._alias_to_canonical.get(normalized, normalized)

    def _registry_rows(self) -> List[Dict[str, Any]]:
        if not self.registry_path.is_file():
            return []
        data = json.loads(self.registry_path.read_text(encoding="utf-8"))
        components = data.get("components") if isinstance(data, dict) else None
        if not isinstance(components, list):
            return []
        return [
            row
            for row in components
            if isinstance(row, dict) and str(row.get("programme", "")).lower() == self.programme
        ]

    def _registry_match(self, slug: str) -> Optional[Dict[str, Any]]:
        canonical = self.canonical_slug(slug)
        normalized = _normalize_slug(slug)
        for row in self._registry_rows():
            row_slug = _normalize_slug(str(row.get("slug", "")))
            registry_slug = _normalize_slug(str(row.get("registrySlug", "")))
            if row_slug in {canonical, normalized} or registry_slug in {canonical, normalized}:
                return row
        return None

    def _figma_map_rows(self) -> List[Dict[str, Any]]:
        if not self.figma_map_path or not self.figma_map_path.is_file():
            return []
        return _load_json_list(self.figma_map_path)

    def _figma_map_match(self, slug: str) -> Optional[Dict[str, Any]]:
        canonical = self.canonical_slug(slug)
        normalized = _normalize_slug(slug)
        candidates: List[Dict[str, Any]] = []
        for row in self._figma_map_rows():
            spec_path = str(row.get("designSpecPath", ""))
            if not spec_path:
                continue
            spec_slug = Path(spec_path).parent.name
            spec_slug_norm = _normalize_slug(spec_slug)
            if spec_slug_norm in {canonical, normalized}:
                candidates.append(row)
        if not candidates:
            return None
        # Prefer programme components_dir path when duplicates exist (Components vs Navigation).
        programme_prefix = f"components/{self.programme}/"
        for row in candidates:
            if str(row.get("designSpecPath", "")).startswith(programme_prefix):
                return row
        return candidates[0]

    def _default_programme_spec_path(self, slug: str) -> Path:
        canonical = self.canonical_slug(slug)
        return self.programme_components_dir / canonical / "design-spec.md"

    def _default_baseline_spec_path(self, slug: str) -> Path:
        canonical = self.canonical_slug(slug)
        return self.baseline_components_dir / canonical / "design-spec.md"

    def resolve(self, slug: str) -> SpecInheritanceResolution:
        canonical = self.canonical_slug(slug)
        registry = self._registry_match(slug)
        figma = self._figma_map_match(slug)

        programme_spec = ""
        baseline_spec: Optional[str] = None
        baseline_slug: Optional[str] = None
        pattern = "standalone"

        if registry:
            pattern = str(registry.get("pattern") or "ids-fork")
            programme_spec = str(registry.get("programmeSpecPath") or "")
            baseline_spec = registry.get("idsBaselineSpecPath")
            baseline_slug = registry.get("idsBaselineSlug")
            if baseline_spec:
                baseline_spec = str(baseline_spec)
            if baseline_slug:
                baseline_slug = str(baseline_slug)

        if figma:
            if not programme_spec:
                programme_spec = str(figma.get("designSpecPath") or "")
            if not baseline_spec and figma.get("idsBaselineSpecPath"):
                baseline_spec = str(figma["idsBaselineSpecPath"])
            if figma.get("specPattern"):
                pattern = str(figma["specPattern"])

        if not programme_spec:
            programme_spec = str(self._default_programme_spec_path(canonical))

        programme_path = self.project_root / programme_spec
        if not programme_path.is_file():
            programme_spec = str(self._default_programme_spec_path(canonical))

        if pattern == "ids-fork" and not baseline_spec:
            default_baseline = self._default_baseline_spec_path(
                baseline_slug or canonical
            )
            if default_baseline.is_file():
                baseline_spec = str(default_baseline.relative_to(self.project_root))
                baseline_slug = baseline_slug or canonical

        resolution_order = (
            list(self.RESOLUTION_ORDER_IDS_FORK)
            if pattern == "ids-fork" and baseline_spec
            else ["Load programme design-spec.md only"]
        )

        return SpecInheritanceResolution(
            programme=self.programme,
            slug=canonical,
            pattern=pattern,
            programme_spec_path=programme_spec,
            ids_baseline_spec_path=baseline_spec,
            ids_baseline_slug=baseline_slug,
            layer_precedence=self.LAYER_PRECEDENCE,
            resolution_order=resolution_order,
        )

    def resolve_paths(self, slug: str) -> Dict[str, Path]:
        """Return absolute paths for compiler layers."""
        resolution = self.resolve(slug)
        paths: Dict[str, Path] = {
            "programme_spec": self.project_root / resolution.programme_spec_path,
        }
        if resolution.ids_baseline_spec_path:
            paths["ids_baseline_spec"] = (
                self.project_root / resolution.ids_baseline_spec_path
            )
        return paths
