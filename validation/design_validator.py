import json

from validation.rule_validator import RuleValidator
from validation.token_validator import TokenValidator
from validation.structure_validator import StructureValidator
from validation.severity_engine import SeverityEngine
from validation.report_builder import ReportBuilder


class DesignValidator:

    def __init__(self):

        self.rules = json.load(open("rules.json"))
        self.registry = json.load(open("component_registry.json"))
        self.tokens = json.load(open("allowed_tokens.json"))

        self.rule_validator = RuleValidator(self.rules)
        self.token_validator = TokenValidator(self.tokens)
        self.structure_validator = StructureValidator(self.registry)
        self.severity_engine = SeverityEngine()
        self.report_builder = ReportBuilder()

    def validate(self, component_name: str, content: str):

        violations = []

        violations.extend(
            self.rule_validator.validate(component_name, content)
        )

        violations.extend(
            self.token_validator.validate(content)
        )

        violations.extend(
            self.structure_validator.validate(component_name, content)
        )

        violations = self.severity_engine.score(violations)

        return self.report_builder.build(violations)