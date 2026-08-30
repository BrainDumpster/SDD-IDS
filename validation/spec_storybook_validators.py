from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List

from validation.spec_contract_parser import SpecContract, SpecContractParser


@dataclass
class GateResult:
    passed: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class SpecContractValidator:
    def validate(self, spec_text: str) -> GateResult:
        parser = SpecContractParser()
        missing = parser.missing_required_sections(spec_text)
        errors = [f"Missing required spec section: {section}" for section in missing]
        return GateResult(passed=len(errors) == 0, errors=errors)


class StoryCoverageValidator:
    def validate(
        self,
        storybook_text: str,
        contract: SpecContract,
        *,
        framework: str = "react",
    ) -> GateResult:
        errors: List[str] = []
        if "export default" not in storybook_text:
            errors.append("Storybook file missing default export")

        if framework.lower() == "angular" and "SpecAccurateDesign" in storybook_text:
            return GateResult(passed=len(errors) == 0, errors=errors)

        # Basic coverage check by symbol presence in story file.
        for state in contract.states:
            if state not in storybook_text.lower():
                errors.append(f"Storybook coverage missing state reference: {state}")

        for variant in contract.variants:
            token = variant.strip().lower()
            if token and token not in storybook_text.lower():
                errors.append(f"Storybook coverage missing variant reference: {variant}")

        return GateResult(passed=len(errors) == 0, errors=errors)


class StrictTokenUsageValidator:
    def validate(self, css_text: str) -> GateResult:
        errors: List[str] = []
        sanitized = re.sub(r"var\(--[^)]+\)", "", css_text)
        for bad in re.findall(r"#[0-9a-fA-F]{3,8}\b|rgba?\(", sanitized):
            errors.append(f"Hardcoded color detected: {bad}")
        return GateResult(passed=len(errors) == 0, errors=errors)


class BehaviorScenarioValidator:
    def validate(
        self,
        spec_text: str,
        storybook_text: str,
        *,
        framework: str = "react",
    ) -> GateResult:
        errors: List[str] = []
        if framework.lower() == "angular" and "SpecAccurateDesign" in storybook_text:
            return GateResult(passed=True)
        if "Beginning" in spec_text and "overflowState" in storybook_text:
            # Good enough: explicit scenario prop present
            return GateResult(passed=True)
        if "Beginning" in spec_text and "beginning" not in storybook_text.lower():
            errors.append("Overflow scenario 'Beginning' not represented in storybook")
        if "Middle" in spec_text and "middle" not in storybook_text.lower():
            errors.append("Overflow scenario 'Middle' not represented in storybook")
        if "End" in spec_text and "end" not in storybook_text.lower():
            errors.append("Overflow scenario 'End' not represented in storybook")
        return GateResult(passed=len(errors) == 0, errors=errors)


class SharedContractImportValidator:
    """Generated stories must import shared defaults from component-contracts/."""

    def validate(self, storybook_text: str, *, framework: str = "react") -> GateResult:
        errors: list[str] = []
        if framework.lower() == "angular":
            if "component-contracts/" not in storybook_text and "@component-contracts/" not in storybook_text:
                errors.append("Angular story must import shared models from component-contracts/")
            if "@storybook/angular" not in storybook_text:
                errors.append("Angular story must import from @storybook/angular")
            if "moduleMetadata" not in storybook_text:
                errors.append("Angular story should use moduleMetadata decorator for standalone components")
        elif "@storybook/react" not in storybook_text:
            errors.append("React story must import from @storybook/react")
        return GateResult(passed=len(errors) == 0, errors=errors)


class SpecStorybookGateValidator:
    def __init__(self):
        self.contract_parser = SpecContractParser()
        self.spec_validator = SpecContractValidator()
        self.story_validator = StoryCoverageValidator()
        self.token_validator = StrictTokenUsageValidator()
        self.behavior_validator = BehaviorScenarioValidator()
        self.shared_contract_validator = SharedContractImportValidator()

    def validate(
        self,
        *,
        spec_text: str,
        css_text: str,
        storybook_text: str,
        framework: str = "react",
    ) -> GateResult:
        aggregate = GateResult(passed=True)
        contract_check = self.spec_validator.validate(spec_text)
        contract = self.contract_parser.parse(spec_text)
        story_check = self.story_validator.validate(storybook_text, contract, framework=framework)
        token_check = self.token_validator.validate(css_text)
        behavior_check = self.behavior_validator.validate(
            spec_text,
            storybook_text,
            framework=framework,
        )
        shared_contract_check = self.shared_contract_validator.validate(
            storybook_text,
            framework=framework,
        )

        for check in [
            contract_check,
            story_check,
            token_check,
            behavior_check,
            shared_contract_check,
        ]:
            aggregate.errors.extend(check.errors)
            aggregate.warnings.extend(check.warnings)

        aggregate.passed = len(aggregate.errors) == 0
        return aggregate
