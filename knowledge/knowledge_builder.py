from knowledge.schema_builder import SchemaBuilder


class KnowledgeBuilder:

    def __init__(self):

        self.schema = SchemaBuilder()

    def build_component(self, component_name, sections):

        component = {
            "component": component_name,
            "overview": [],
            "structure": [],
            "types": [],
            "general_use": [],
            "related_links": [],
            "states": [],
            "accessibility": [],
            "layout_rules": [],
            "guidelines": [],
            "best_practices": [],
            "violations": [],
            "tokens": [],
            "other": []
        }

        for s in sections:

            category = self.schema.map_section(s["section"])

            component[category].append(s["content"])

        return component