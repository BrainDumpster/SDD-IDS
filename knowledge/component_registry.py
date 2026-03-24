import json
from pathlib import Path


class ComponentRegistry:

    def __init__(self, path="component_registry.json"):

        self.path = Path(path)

        self.components = self._load()

    def _load(self):

        if not self.path.exists():
            return []

        data = json.load(open(self.path))

        # registry structure may be dict of components
        if isinstance(data, dict):
            return list(data.keys())

        if isinstance(data, list):
            return data

        return []

    def get_components(self):

        return self.components