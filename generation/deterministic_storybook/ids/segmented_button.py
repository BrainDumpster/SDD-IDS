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
    """Wire hand-maintained Docs stories from storybook/src (no bare re-exports)."""
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("segmented-button", options.component_prefix)
    composition_path = "../../../../storybook/src/components/SegmentedButtonComposition"
    definitions_path = "../../../../storybook/src/components/SegmentedButton.story-definitions"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ SegmentedButtons as {component_name} }} from "{composition_path}";
import {{
  SEGMENTED_BUTTON_DOCS_DESCRIPTION,
  iconModesStory,
  specAccurateDesignStory,
}} from "{definitions_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "Spec Generated/IDS/Segmented Button",
  component: {component_name},
  tags: ["autodocs"],
  parameters: {{
    layout: "padded",
    docs: {{
      canvas: {{ sourceState: "open" }},
      description: {{ component: SEGMENTED_BUTTON_DOCS_DESCRIPTION }},
    }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = specAccurateDesignStory;
export const IconModes: Story = iconModesStory;
"""
