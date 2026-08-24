from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_alert_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("alert", options.component_prefix)
    alert_import = "../../../../storybook/src/components/Alert"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Alert as {component_name} }} from "{alert_import}";

/**
 * Deterministic gate harness only. Canonical Spec Generated stories (composition API,
 * variant matrix, Angular parity) live in `storybook/src/components/Alert.stories.tsx`.
 */
const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Alert/Overview",
  component: {component_name},
  parameters: {{ layout: "padded", docs: {{ disable: true }} }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const LayoutTokens: Story = {{
  render: () => null,
}};
"""
