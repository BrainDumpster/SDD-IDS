import json
from pathlib import Path

REGISTRY_FILE = "index_registry.json"


class DocumentRegistry:

    def __init__(self):

        if Path(REGISTRY_FILE).exists():
            self.registry = json.load(open(REGISTRY_FILE))
        else:
            self.registry = {}

    def is_changed(self, path, new_hash):

        entry = self.registry.get(path)

        if not entry:
            return True

        return entry["hash"] != new_hash

    def update(self, path, file_hash, chunks):

        self.registry[path] = {
            "hash": file_hash,
            "chunks": chunks
        }

    def save(self):

        json.dump(self.registry, open(REGISTRY_FILE, "w"), indent=2)
    
    def clear(self):
        """Clear all registry entries"""
        self.registry = {}
        self.save()
        print("✅ Document registry cleared")