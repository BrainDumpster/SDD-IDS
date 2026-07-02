from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_tooltip_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("tooltip", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsTooltip"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsTooltip as {component_name} }} from "{import_path}";

/**
 * Deterministic gate harness only. Canonical Spec Generated stories (composition API,
 * Angular parity) live in `storybook/src/components/IdsTooltip.stories.tsx`.
 */
const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tooltip",
  component: {component_name},
  parameters: {{ layout: "centered", docs: {{ disable: true }} }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const LayoutTokens: Story = {{
  render: () => null,
}};
"""
