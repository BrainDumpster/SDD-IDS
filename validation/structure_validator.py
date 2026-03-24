class StructureValidator:

    def __init__(self, component_registry):
        self.registry = component_registry

    def validate(self, component_name: str, content: str):

        component = self.registry.get(component_name)

        if not component:
            return []

        required = component.get("anatomy", [])

        violations = []

        for element in required:
            if element.lower() not in content.lower():
                violations.append({
                    "type": "structure_violation",
                    "element": element,
                    "message": f"Missing required element: {element}"
                })

        return violations