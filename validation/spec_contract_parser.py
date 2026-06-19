from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List

from scripts.design_spec_template import SLOT_GEOMETRY_HEADING, SLOT_GEOMETRY_TABLE_HEADER


@dataclass
class SpecContract:
    component: str = ""
    slots: List[str] = field(default_factory=list)
    variants: List[str] = field(default_factory=list)
    states: List[str] = field(default_factory=list)
    icon_mappings: Dict[str, str] = field(default_factory=dict)
    interactions: List[str] = field(default_factory=list)
    accessibility: List[str] = field(default_factory=list)


@dataclass
class GeometryGateResult:
    ok: bool
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class SpecContractParser:
    REQUIRED_SECTIONS = [
        "Metadata",
        "Anatomy",
        "Layout & Measurements",
        "Tokens",
        "States (Light Theme)",
        "States (Dark Theme)",
        "Interactions",
        "Composition & API (runtime)",
        "Codegen Contract (Framework-Agnostic Blueprint)",
        "Source Mapping",
    ]

    def parse(self, spec_text: str) -> SpecContract:
        contract = SpecContract()
        contract.component = self._extract_component_name(spec_text)
        contract.slots = self._extract_codegen_slots(spec_text)
        contract.variants = self._extract_variant_matrix(spec_text)
        contract.states = self._extract_state_tokens(spec_text)
        contract.icon_mappings = self._extract_icon_mappings(spec_text)
        contract.interactions = self._extract_list_under(spec_text, "## Interactions")
        contract.accessibility = self._extract_accessibility(spec_text)
        return contract

    def missing_required_sections(self, spec_text: str) -> List[str]:
        missing = []
        for section in self.REQUIRED_SECTIONS:
            if f"## {section}" not in spec_text:
                missing.append(section)
        return missing

    def validate_slot_geometry_gate(self, spec_text: str, *, strict: bool = True) -> GeometryGateResult:
        """Ensure per-slot geometry is Figma-verified, not theme-alias-only."""
        errors: List[str] = []
        warnings: List[str] = []

        if SLOT_GEOMETRY_HEADING not in spec_text:
            msg = f"Missing required subsection `{SLOT_GEOMETRY_HEADING}` under Layout & Measurements"
            (errors if strict else warnings).append(msg)
            return GeometryGateResult(ok=not errors, errors=errors, warnings=warnings)

        if SLOT_GEOMETRY_TABLE_HEADER not in spec_text:
            errors.append("Slot geometry table header must include: Slot / layer | Property | Token / contract | Figma node | Live evidence")
            return GeometryGateResult(ok=False, errors=errors, warnings=warnings)

        block_match = re.search(
            rf"{re.escape(SLOT_GEOMETRY_HEADING)}(.*?)(?:\n### |\n## |\Z)",
            spec_text,
            re.DOTALL,
        )
        block = block_match.group(1) if block_match else ""
        data_rows = [
            ln
            for ln in block.splitlines()
            if ln.strip().startswith("|") and "---" not in ln and "Slot / layer" not in ln
        ]
        if not data_rows:
            errors.append("Slot geometry table has no data rows")
            return GeometryGateResult(ok=False, errors=errors, warnings=warnings)

        radius_rows = [ln for ln in data_rows if re.search(r"border-radius|radius", ln, re.I)]
        if not radius_rows:
            warnings.append("No border-radius rows in slot geometry table (add rows when component has rounded shells)")

        for row in data_rows:
            cells = [c.strip() for c in row.strip("|").split("|")]
            if len(cells) < 5:
                errors.append(f"Slot geometry row must have 5 columns: {row}")
                continue
            _slot, _prop, token_cell, figma_node, evidence = cells[0], cells[1], cells[2], cells[3], cells[4]
            if figma_node.upper() in {"TODO", "TBD", ""}:
                errors.append(f"Slot geometry row missing Figma node: {row}")
            if evidence.upper() in {"TODO", "TBD", ""}:
                errors.append(f"Slot geometry row missing live evidence: {row}")
            if re.search(r"border-radius|radius", _prop, re.I):
                if "figma" not in evidence.lower() and "get_variable_defs" not in evidence.lower() and "get_design_context" not in evidence.lower():
                    errors.append(f"Radius row must cite Figma MCP method in Live evidence: {row}")
                if re.search(r"theme alias|ids-theme|assumed|convention|button", token_cell, re.I):
                    errors.append(f"Radius row must not be documented from theme/convention alone: {row}")

        return GeometryGateResult(ok=not errors, errors=errors, warnings=warnings)

    def is_production_ready(self, spec_text: str) -> GeometryGateResult:
        missing = self.missing_required_sections(spec_text)
        errors = [f"Missing section: ## {s}" for s in missing]
        geometry = self.validate_slot_geometry_gate(spec_text, strict=True)
        errors.extend(geometry.errors)
        warnings = list(geometry.warnings)
        if re.search(r"Status:\s*active", spec_text, re.I) and "TODO" in spec_text:
            warnings.append("Status is active but spec still contains TODO placeholders")
        return GeometryGateResult(ok=not errors, errors=errors, warnings=warnings)

    @staticmethod
    def _extract_component_name(spec_text: str) -> str:
        match = re.search(r"-\s*Component:\s*(.+)", spec_text)
        return match.group(1).strip() if match else ""

    @staticmethod
    def _extract_codegen_slots(spec_text: str) -> List[str]:
        block_match = re.search(
            r"## Codegen Contract \(Framework-Agnostic Blueprint\)(.*?)(?:\n## |\Z)",
            spec_text,
            re.DOTALL,
        )
        if not block_match:
            return []
        block = block_match.group(1)
        slots = re.findall(r"`([A-Za-z0-9_-]+)`", block)
        return list(dict.fromkeys(slots))

    @staticmethod
    def _extract_variant_matrix(spec_text: str) -> List[str]:
        variants: List[str] = []

        # Preferred: explicit variant row in matrix bullets.
        for line in spec_text.splitlines():
            line_match = re.search(r"-\s*`?variant`?\s*:\s*`([^`]+)`", line, re.I)
            if line_match:
                raw = line_match.group(1)
                variants.extend([part.strip() for part in raw.split("|") if part.strip()])

        # Fallback: union type in Composition/API section.
        unions = re.findall(r'variant\?:\s*([^\\n]+)', spec_text)
        for union in unions:
            quoted = re.findall(r'"([^"]+)"', union)
            if quoted:
                variants.extend(quoted)

        # Fallback: `type` prop bullet (e.g. Toast: `info | critical | ...`).
        type_bullet = re.search(r"^\s*-\s*`type`\s*:\s*`([^`]+)`", spec_text, re.MULTILINE)
        if type_bullet:
            variants.extend(
                [p.strip() for p in type_bullet.group(1).split("|") if p.strip()]
            )

        # Fallback: "Supported types: `a`, `b`, ..." in variant matrix (common in layered program specs).
        for line in spec_text.splitlines():
            if re.search(r"supported types\s*:", line, re.I):
                variants.extend(re.findall(r"`([^`]+)`", line))

        return list(dict.fromkeys(variants))

    @staticmethod
    def _extract_state_tokens(spec_text: str) -> List[str]:
        states = re.findall(r"\|\s*[^|]+\|\s*(default|hover|press|selected|disabled|focus-visible)\s*\|", spec_text, re.I)
        return sorted(set(s.lower() for s in states))

    @staticmethod
    def _extract_icon_mappings(spec_text: str) -> Dict[str, str]:
        out: Dict[str, str] = {}
        for line in spec_text.splitlines():
            m = re.search(r"-\s*([a-z0-9 _/-]+)\s*[-:>]+\s*`([a-z0-9-]+)`", line, re.I)
            if m:
                out[m.group(1).strip().lower()] = m.group(2).strip()
        return out

    @staticmethod
    def _extract_list_under(spec_text: str, heading: str) -> List[str]:
        match = re.search(rf"{re.escape(heading)}(.*?)(?:\n## |\Z)", spec_text, re.DOTALL)
        if not match:
            return []
        block = match.group(1)
        return [ln.strip()[2:].strip() for ln in block.splitlines() if ln.strip().startswith("- ")]

    @staticmethod
    def _extract_accessibility(spec_text: str) -> List[str]:
        block = re.search(r"Accessibility contract:(.*?)(?:\n[A-Z][^\n]*:|\n\n|\Z)", spec_text, re.DOTALL)
        if not block:
            block = re.search(r"## Accessibility(.*?)(?:\n## |\Z)", spec_text, re.DOTALL)
        if not block:
            return []
        return [ln.strip()[2:].strip() for ln in block.group(1).splitlines() if ln.strip().startswith("- ")]
