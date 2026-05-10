from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_spinner_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("spinner", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsSpinner"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsSpinner as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Spinner",
  component: {component_name},
  argTypes: {{
    size: {{ control: "select", options: ["sm", "md", "lg"] }},
    labelVisibility: {{ control: "select", options: ["sr-only", "inline", "below"] }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Small: Story = {{
  args: {{ size: "sm", labelVisibility: "inline", label: "Loading..." }},
}};

export const Medium: Story = {{
  args: {{ size: "md", labelVisibility: "below", label: "Loading..." }},
}};

export const Large: Story = {{
  args: {{ size: "lg", labelVisibility: "sr-only", label: "Loading..." }},
}};

export const FigmaUsageFrame: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 24, alignItems: "center", padding: 16 }}}}>
      <{component_name} size="sm" labelVisibility="inline" label="Loading..." />
      <{component_name} size="md" labelVisibility="below" label="Loading..." />
      <{component_name} size="lg" labelVisibility="sr-only" label="Loading..." />
    </div>
  ),
}};
"""
