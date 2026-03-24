import json
from pathlib import Path
from rag.design_rag import DesignRAG


class ComponentContextCompiler:

    def __init__(self):
        self.rag = DesignRAG()
        self.registry = json.load(open("component_registry.json"))

    def load_tokens(self, component):
        path = Path(f"design-system-knowledge/components/{component}_tokens.md")
        return path.read_text() if path.exists() else ""

    def load_spec(self, component):
        path = Path(f"design-system-knowledge/components/{component}.md")
        return path.read_text() if path.exists() else ""

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