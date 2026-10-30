from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.emitters.angular_csf import emit_angular_csf
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from generation.deterministic_storybook.story_model import build_accordion_story_model
from validation.spec_contract_parser import SpecContract


def generate_ids_accordion_story_angular(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions(framework="angular")
    model = build_accordion_story_model(options=options)
    return emit_angular_csf(
        model=model,
        component_import_path="./ids-accordion.component",
        component_class_name="IdsAccordionComponent",
        docs_description=(
            f"{model.docs_description} Angular standalone (`storybook-angular` port 6007)."
        ),
    )
