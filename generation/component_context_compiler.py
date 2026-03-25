import json
from pathlib import Path
from rag.design_rag import DesignRAG


def _load_json_safe(path_str: str):
    p = Path(path_str)
    if not p.exists():
        return {}
    data = json.load(open(p))
    return data if isinstance(data, dict) else {}


class ComponentContextCompiler:

    def __init__(self, config=None):
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
        self.rag = DesignRAG(collection_name=collection)

        registry_path = config.component_registry_path if config else "component_registry.json"
        self.registry = _load_json_safe(registry_path)

        self._spec_dir = Path(config.components_dir) if config else Path("components")

    def load_tokens(self, component):
        path = Path(f"design-system-knowledge/components/{component}_tokens.md")
        return path.read_text() if path.exists() else ""

    def load_spec(self, component):
        # Try design-spec.mdx in the component dir first
        spec_path = self._spec_dir / component / "design-spec.mdx"
        if spec_path.exists():
            return spec_path.read_text()
        # Fallback to legacy path
        legacy = Path(f"design-system-knowledge/components/{component}.md")
        return legacy.read_text() if legacy.exists() else ""

    def compile(self, component: str, request: str):

        spec = self.load_spec(component)
        tokens = self.load_tokens(component)

        knowledge = self.rag.query(
            f"Provide complete design rules and behavior for {component}"
        )

        anatomy = self.registry.get(component, {}).get("anatomy", [])

        return {
            "component": component,
            "request": request,
            "spec": spec,
            "tokens": tokens,
            "rules": knowledge,
            "anatomy": anatomy
        }