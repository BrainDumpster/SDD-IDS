class RuleValidator:

    def __init__(self, rules):
        self.rules = rules

    def validate(self, component_name: str, content: str):

        violations = []

        for rule in self.rules:
            if rule["component"] != component_name:
                continue

            rule_text = rule["normalized"]

            # simple containment heuristic (extend later)
            if "must not" in rule_text and rule_text.split("must not")[-1].strip() in content.lower():
                violations.append(rule)

            if "must" in rule_text and rule_text.split("must")[-1].strip() not in content.lower():
                violations.append(rule)

        return violations