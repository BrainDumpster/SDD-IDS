import uuid
from knowledge.rule_model import DesignRule


class RuleExtractor:

    def extract_rules(self, component):

        rules = []

        name = component["component"]

        # violations
        for v in component.get("violations", []):

            rules.append(
                DesignRule(
                    rule_id=str(uuid.uuid4()),
                    component=name,
                    category="violation",
                    description=v,
                    severity="high",
                    source_section="violations"
                )
            )

        # best practices
        for g in component.get("best_practices", []):

            rules.append(
                DesignRule(
                    rule_id=str(uuid.uuid4()),
                    component=name,
                    category="best_practice",
                    description=g,
                    severity="medium",
                    source_section="best_practices"
                )
            )

        # accessibility
        for a in component.get("accessibility", []):

            rules.append(
                DesignRule(
                    rule_id=str(uuid.uuid4()),
                    component=name,
                    category="accessibility",
                    description=a,
                    severity="high",
                    source_section="accessibility"
                )
            )

        # layout rules
        for r in component.get("layout_rules", []):

            rules.append(
                DesignRule(
                    rule_id=str(uuid.uuid4()),
                    component=name,
                    category="layout",
                    description=r,
                    severity="medium",
                    source_section="layout_rules"
                )
            )

        return rules