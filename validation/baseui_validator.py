"""
Base UI Compliance Validator
Checks generated React code for correct Base UI usage patterns.
"""

import re
from typing import Dict, List, Any


class BaseUIValidator:
    """Validates generated code against Base UI best practices."""

    # Conflicting UI libraries that should NOT appear
    CONFLICTING_IMPORTS = [
        "@mui/material",
        "@mui/base",
        "@radix-ui",
        "@headlessui",
        "@chakra-ui",
        "antd",
        "react-bootstrap",
    ]

    # Known Base UI compound components and their expected parts
    COMPOUND_PATTERNS = {
        "Select": ["Root", "Trigger", "Positioner", "Popup", "Option"],
        "Dialog": ["Root", "Backdrop", "Popup", "Title", "Close"],
        "Tabs": ["Root", "List", "Tab", "Panel"],
        "Accordion": ["Root", "Item", "Header", "Trigger", "Panel"],
        "Tooltip": ["Root", "Trigger", "Positioner", "Popup"],
        "Menu": ["Root", "Trigger", "Positioner", "Popup", "Item"],
        "Checkbox": ["Root", "Indicator"],
        "Switch": ["Root", "Thumb"],
        "Slider": ["Root", "Control", "Track", "Indicator", "Thumb"],
        "Progress": ["Root", "Track", "Indicator"],
        "Toast": ["Provider", "Viewport", "Root", "Title", "Description", "Close"],
        "AlertDialog": ["Root", "Trigger", "Backdrop", "Popup", "Title", "Close"],
        "Popover": ["Root", "Trigger", "Positioner", "Popup"],
        "Collapsible": ["Root", "Trigger", "Panel"],
        "ScrollArea": ["Root", "Viewport", "Scrollbar", "Thumb"],
        "RadioGroup": [],
        "Radio": ["Root", "Indicator"],
        "Field": ["Root", "Label", "Control", "Description", "Error"],
    }

    # Expected data-* attributes for state styling
    DATA_ATTRIBUTES = [
        "data-checked",
        "data-selected",
        "data-open",
        "data-disabled",
        "data-highlighted",
        "data-invalid",
        "data-pressed",
        "data-focus-visible",
    ]

    def validate(self, code: str, component_type: str = "") -> Dict[str, Any]:
        """
        Validate generated code for Base UI compliance.

        Returns dict with score, issues, and warnings.
        """
        result = {
            "score": 100,
            "issues": [],
            "warnings": [],
            "checks": {},
        }

        self._check_imports(code, result)
        self._check_conflicting_libs(code, result)
        self._check_compound_structure(code, component_type, result)
        self._check_data_attribute_styling(code, result)
        self._check_className_callbacks(code, result)
        self._check_no_hardcoded_values(code, result)

        result["score"] = max(0, result["score"])
        return result

    def _check_imports(self, code: str, result: Dict):
        """Check for correct Base UI import paths."""
        has_baseui = bool(re.search(r"from\s+['\"]@base-ui-components/react", code))

        if has_baseui:
            result["checks"]["base_ui_imports"] = True
        else:
            # Only flag if this looks like a React component (not Angular)
            if "import React" in code or "from 'react'" in code or 'from "react"' in code:
                result["issues"].append("No imports from @base-ui-components/react found")
                result["score"] -= 20

    def _check_conflicting_libs(self, code: str, result: Dict):
        """Check that no conflicting UI libraries are imported."""
        for lib in self.CONFLICTING_IMPORTS:
            if lib in code:
                result["issues"].append(f"Conflicting UI library import: {lib}")
                result["score"] -= 15

        result["checks"]["no_conflicting_libs"] = len([
            i for i in result["issues"] if "Conflicting" in i
        ]) == 0

    def _check_compound_structure(
        self, code: str, component_type: str, result: Dict
    ):
        """Check for correct compound component usage."""
        found_compounds = []

        for component, parts in self.COMPOUND_PATTERNS.items():
            root_pattern = rf"{component}\.Root"
            if re.search(root_pattern, code):
                found_compounds.append(component)

                # Check that required parts are used
                missing = []
                for part in parts:
                    part_pattern = rf"{component}\.{part}"
                    if not re.search(part_pattern, code):
                        missing.append(f"{component}.{part}")

                if missing:
                    result["warnings"].append(
                        f"Compound component {component} may be missing parts: {', '.join(missing)}"
                    )

        if found_compounds:
            result["checks"]["compound_components"] = True
        else:
            # Only a warning — some components are simple (Button, Link)
            result["checks"]["compound_components"] = False

    def _check_data_attribute_styling(self, code: str, result: Dict):
        """Check for data-* attribute usage in CSS/styling."""
        data_attr_usage = sum(
            1 for attr in self.DATA_ATTRIBUTES if attr in code
        )

        if data_attr_usage > 0:
            result["checks"]["data_attribute_styling"] = True
        else:
            result["warnings"].append(
                "No data-* attribute selectors found. Base UI uses data attributes for state styling."
            )

    def _check_className_callbacks(self, code: str, result: Dict):
        """Check for className callback pattern usage."""
        # Pattern: className={(state) => ...} or className={({open}) => ...}
        callback_pattern = r"className=\{[\s]*\([\w\s{},]*\)\s*=>"
        has_callbacks = bool(re.search(callback_pattern, code))

        result["checks"]["className_callbacks"] = has_callbacks
        if not has_callbacks:
            result["warnings"].append(
                "No className callbacks found. Consider using className={(state) => ...} for dynamic styling."
            )

    def _check_no_hardcoded_values(self, code: str, result: Dict):
        """Check that CSS doesn't contain hardcoded color/spacing values."""
        # Check for hardcoded hex colors in CSS sections
        hex_pattern = r":\s*#[0-9a-fA-F]{3,8}\b"
        hex_matches = re.findall(hex_pattern, code)

        if hex_matches:
            result["issues"].append(
                f"Found {len(hex_matches)} hardcoded hex color(s). Use Synapse CSS variables instead."
            )
            result["score"] -= min(15, len(hex_matches) * 3)

        result["checks"]["no_hardcoded_values"] = len(hex_matches) == 0


def validate_baseui_compliance(
    code: str, component_type: str = ""
) -> Dict[str, Any]:
    """Convenience function for Base UI validation."""
    return BaseUIValidator().validate(code, component_type)
