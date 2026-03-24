import json


class RuleRegistry:

    def __init__(self):

        self.rules = []

    def add_rules(self, rules):

        for r in rules:

            self.rules.append(r.dict())

    def save(self):

        with open("rules.json", "w") as f:

            json.dump(self.rules, f, indent=2)