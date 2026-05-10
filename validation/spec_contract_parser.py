from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Dict, List


@dataclass
class SpecContract:
    component: str = ""
    slots: List[str] = field(default_factory=list)
    variants: List[str] = field(default_factory=list)
    states: List[str] = field(default_factory=list)
    icon_mappings: Dict[str, str] = field(default_factory=dict)
    interactions: List[str] = field(default_factory=list)
    accessibility: List[str] = field(default_factory=list)


class SpecContractParser:
    REQUIRED_SECTIONS = [
        "Metadata",
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
