from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_segmented_button_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    """Re-export hand-maintained stories from storybook/src."""
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("segmented-button", options.component_prefix)
    import_path = "../../../../storybook/src/components/SegmentedButton"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ SegmentedButton as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Segmented Button",
  component: {component_name},
  parameters: {{ layout: "centered" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export {{
  StateMatrixText,
  StateMatrixIcon,
  StateMatrixTextDark,
  SpecAccurateDesign,
  TextThreeOptions,
  TextTwoAndFiveOptions,
  IconListTreeGrid,
  IconModes,
  TextTwoOptions,
  TextThreeToFiveOptions,
  IconCustomSlot,
  DisabledStates,
  OnChangePayload,
}} from "../../../../storybook/src/components/SegmentedButton.stories";
"""
