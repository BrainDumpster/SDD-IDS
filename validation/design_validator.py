import json
from pathlib import Path

from validation.rule_validator import RuleValidator
from validation.token_validator import TokenValidator
from validation.structure_validator import StructureValidator
from validation.severity_engine import SeverityEngine
from validation.report_builder import ReportBuilder


def _load_json(path_str: str):
    """Load JSON, returning empty list/dict if file missing."""
    p = Path(path_str)
    if not p.exists():
        return []
    return json.load(open(p))


class DesignValidator:

    def __init__(self, rules_path=None, registry_path=None, tokens_path=None):
        # Resolve paths from design system config when not explicitly provided
        try:
            from config.settings import settings
            cfg = settings.design_system_config
            rules_path = rules_path or cfg.rules_path
            registry_path = registry_path or cfg.component_registry_path
            tokens_path = tokens_path or cfg.allowed_tokens_path
        except Exception:
            rules_path = rules_path or "rules.json"
            registry_path = registry_path or "component_registry.json"
            tokens_path = tokens_path or "allowed_tokens.json"

        self.rules = _load_json(rules_path)
        self.registry = _load_json(registry_path)
        self.tokens = _load_json(tokens_path)

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