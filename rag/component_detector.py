import re
from knowledge.component_registry import ComponentRegistry


class ComponentDetector:

    def __init__(self):

        self.registry = ComponentRegistry()

        # Sort longest first to avoid partial match conflicts
        self.components = sorted(
            self.registry.get_components(),
            key=lambda x: len(x),
            reverse=True
        )

    def detect(self, query: str):

        q = query.lower()

        for comp in self.components:

            # whole word match
            if re.search(rf"\b{re.escape(comp.lower())}\b", q):
                return comp

        return None