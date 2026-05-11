from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class DeterministicStorybookOptions:
    title_prefix: str = "Spec Generated/IDS"
    include_state_harness: bool = True
    component_prefix: str = "Ids"
    design_system_slug: str = "ids"
    apply_program_deltas: bool = False
    # Full layered design-spec.mdx text for spec-derived codegen (CSS, demo strings).
    spec_text: str = ""
