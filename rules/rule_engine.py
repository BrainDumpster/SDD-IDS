import json


class RuleEngine:

    def __init__(self):

        with open("rules.json") as f:

            self.rules = json.load(f)

    def validate_component(self, component_name):

        violations = []

        for rule in self.rules:

            if rule["component"] == component_name:

                violations.append(rule)

        return violations