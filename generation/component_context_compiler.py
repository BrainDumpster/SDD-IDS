import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

from generation.spec_inheritance_resolver import SpecInheritanceResolver


def _load_json_safe(path_str: str):
    p = Path(path_str)
    if not p.exists():
        return {}
    data = json.load(open(p))
    return data if isinstance(data, dict) else {}


class ComponentContextCompiler:

    def __init__(self, config=None, enable_rag: bool = True):
        """
        Args:
            config: Optional DesignSystemConfig. If None, loads from settings.
        """
        if config is None:
            try:
                from config.settings import settings
                config = settings.design_system_config
            except Exception:
                config = None

        self._config = config

        collection = config.qdrant_collection if config else None
        self.rag = None
        if enable_rag:
            try:
                # RAG is optional for strict spec-driven workflows.
                from rag.design_rag import DesignRAG  # local import to avoid hard dependency
                self.rag = DesignRAG(collection_name=collection)
            except Exception:
                self.rag = None

        registry_path = config.component_registry_path if config else "component_registry.json"
        self.registry = _load_json_safe(registry_path)

        self._spec_dir = Path(config.components_dir) if config else Path("components/ids")
        self._project_root = config.project_root if config else Path(".")
        self._baseline_components_dir = (
            Path(config.baseline_components_dir) if config else Path("components/ids")
        )
        self._program_components_dir = (
            Path(config.program_components_dir) if config and config.program_components_dir else self._spec_dir
        )
        self._baseline_root_spec_path = (
            self._resolve_optional_path(config.baseline_root_spec_path) if config else Path("components/ids/root-spec.md")
        )
        self._program_root_spec_path = (
            self._resolve_optional_path(config.program_root_spec_path) if config else None
        )
        self._baseline_theme_css_path = (
            self._resolve_optional_path(config.baseline_theme_css_path) if config else Path("components/ids-theme.css")
        )
        self._program_theme_css_path = (
            self._resolve_optional_path(config.program_theme_css_path)
            if config and config.program_theme_css_path
            else (self._resolve_optional_path(config.theme_css_path) if config else None)
        )
        self._inherits_marker = "<!-- ds:inherits root-spec -->"
        programme_name = config.name if config else "ids"
        self._inheritance_resolver: Optional[SpecInheritanceResolver] = None
        if programme_name and programme_name.lower() != "ids":
            self._inheritance_resolver = SpecInheritanceResolver(
                project_root=self._project_root,
                programme=programme_name,
                figma_map_path=config.figma_map_path if config else None,
                alias_path=config.alias_path if config else None,
                baseline_components_dir=config.baseline_components_dir if config else "components/ids",
                programme_components_dir=config.program_components_dir if config else None,
            )

    def _resolve_optional_path(self, relative_path: Optional[str]) -> Optional[Path]:
        if not relative_path:
            return None
        candidate = Path(relative_path)
        if candidate.is_absolute():
            return candidate
        return self._project_root / candidate

    @staticmethod
    def _read_text_if_exists(path: Optional[Path]) -> str:
        if not path:
            return ""
        return path.read_text() if path.exists() else ""

    def _spec_layer(self, layer: str, path: Optional[Path], required: bool = False) -> Dict[str, Any]:
        text = self._read_text_if_exists(path)
        return {
            "layer": layer,
            "path": str(path) if path else "",
            "exists": bool(path and path.exists()),
            "required": required,
            "content": text,
        }

    def resolve_spec_inheritance(self, component: str) -> Optional[Dict[str, Any]]:
        if self._inheritance_resolver is None:
            return None
        resolution = self._inheritance_resolver.resolve(component)
        return resolution.to_dict()

    def load_layered_specs(self, component: str) -> List[Dict[str, Any]]:
        inheritance = self.resolve_spec_inheritance(component)
        if inheritance:
            baseline_component_path = (
                self._project_root / inheritance["ids_baseline_spec_path"]
                if inheritance.get("ids_baseline_spec_path")
                else None
            )
            program_component_path = self._project_root / inheritance["programme_spec_path"]
            pattern = inheritance.get("pattern", "standalone")
            ids_component_required = (
                pattern == "ids-fork" and bool(inheritance.get("ids_baseline_spec_path"))
            )
        else:
            baseline_component_path = self._baseline_components_dir / component / "design-spec.md"
            program_component_path = self._program_components_dir / component / "design-spec.md"
            baseline_spec_exists = baseline_component_path.is_file()
            program_spec_exists = program_component_path.is_file()
            ids_component_required = baseline_spec_exists or not program_spec_exists

        layers = [
            self._spec_layer("ids_root", self._baseline_root_spec_path, required=True),
        ]
        if baseline_component_path:
            layers.append(
                self._spec_layer(
                    "ids_component",
                    baseline_component_path,
                    required=ids_component_required,
                )
            )

        if self._program_root_spec_path and self._program_root_spec_path != self._baseline_root_spec_path:
            layers.append(self._spec_layer("program_root_delta", self._program_root_spec_path))

        if program_component_path and (
            not baseline_component_path or program_component_path != baseline_component_path
        ):
            layers.append(self._spec_layer("program_component_delta", program_component_path))

        return layers

    @staticmethod
    def _compose_layered_text(layers: List[Dict[str, Any]]) -> str:
        sections: List[str] = []
        for layer in layers:
            if not layer.get("content"):
                continue
            sections.append(
                "\n".join(
                    [
                        f"<!-- layer: {layer['layer']} -->",
                        f"<!-- source: {layer['path']} -->",
                        layer["content"],
                    ]
                )
            )
        return "\n\n".join(sections)

    def load_layered_theme_css(self) -> List[Dict[str, Any]]:
        layers = [
            self._spec_layer("ids_theme", self._baseline_theme_css_path),
        ]
        if self._program_theme_css_path and self._program_theme_css_path != self._baseline_theme_css_path:
            layers.append(self._spec_layer("program_theme_delta", self._program_theme_css_path))
        return layers

    def _validate_spec_layers(self, layers: List[Dict[str, Any]]) -> List[str]:
        issues: List[str] = []

        for layer in layers:
            if layer.get("required") and not layer.get("exists"):
                issues.append(f"Missing required layer: {layer['layer']} ({layer['path']})")

        for layer in layers:
            if layer["layer"] not in {"program_root_delta", "program_component_delta"}:
                continue
            content = layer.get("content", "")
            if not content:
                continue
            if self._inherits_marker not in content:
                issues.append(
                    f"{layer['layer']} missing inherits marker '{self._inherits_marker}' ({layer['path']})"
                )
            if self._has_hardcoded_visual_values(content):
                issues.append(
                    f"{layer['layer']} contains potential hardcoded visual values ({layer['path']})"
                )

        return issues

    @staticmethod
    def _has_hardcoded_visual_values(text: str) -> bool:
        stripped = re.sub(r"`var\(--[^`]+\)`", "", text)
        tokenized = re.sub(r"var\(--[^)]+\)", "", stripped)
        hardcoded_color = re.search(r"#(?:[0-9a-fA-F]{3}){1,2}\b|rgba?\(", tokenized)
        hardcoded_px = re.search(r"\b\d+(\.\d+)?px\b", tokenized)
        return bool(hardcoded_color or hardcoded_px)

    def load_tokens(self, component):
        path = Path(f"design-system-knowledge/components/{component}_tokens.md")
        return path.read_text() if path.exists() else ""

    def load_spec(self, component):
        # Try design-spec.md in the component dir first
        spec_path = self._spec_dir / component / "design-spec.md"
        if spec_path.exists():
            return spec_path.read_text()
        # Fallback to legacy path
        legacy = Path(f"design-system-knowledge/components/{component}.md")
        return legacy.read_text() if legacy.exists() else ""

    def compile(self, component: str, request: str):
        spec_layers = self.load_layered_specs(component)
        spec = self._compose_layered_text(spec_layers)
        theme_layers = self.load_layered_theme_css()
        theme_css = self._compose_layered_text(theme_layers)
        validation_issues = self._validate_spec_layers(spec_layers)
        tokens = self.load_tokens(component)

        knowledge = ""
        if self.rag is not None:
            try:
                knowledge = self.rag.query(
                    f"Provide complete design rules and behavior for {component}"
                )
            except Exception:
                knowledge = ""

        anatomy = self.registry.get(component, {}).get("anatomy", [])

        inheritance = self.resolve_spec_inheritance(component)
        layer_precedence = (
            inheritance.get("layer_precedence")
            if inheritance
            else "program_component_delta > program_root_delta > ids_component > ids_root"
        )

        return {
            "component": component,
            "request": request,
            "spec": spec,
            "spec_layers": spec_layers,
            "theme_layers": theme_layers,
            "theme_css": theme_css,
            "spec_inheritance": inheritance,
            "layer_precedence": layer_precedence,
            "validation_issues": validation_issues,
            "tokens": tokens,
            "rules": knowledge,
            "anatomy": anatomy
        }