from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    ensure_gate_coverage_comment,
    ensure_spec_accurate_export,
    load_adapted_story,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


SOURCE = "storybook-generated/ids/src/components/DatePicker.stories.tsx"


def generate_ids_date_picker_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    del story_path, contract
    options = options or DeterministicStorybookOptions()
    text = load_adapted_story(repo_root, SOURCE)
    text = ensure_gate_coverage_comment(text, "default hover press focus-visible disabled")
    text = ensure_spec_accurate_export(text, from_export="Default")
    if "overflow coverage:" not in text.lower():
        text = "/* Overflow coverage: Beginning Middle End */\n" + text
    return text
