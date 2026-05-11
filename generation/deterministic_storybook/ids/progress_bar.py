from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_progress_bar_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("progress-bar", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsProgressBar"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsProgressBar as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/ProgressBar",
  component: {component_name},
  argTypes: {{
    value: {{ control: {{ type: "range", min: 0, max: 100 }} }},
    type: {{ control: "select", options: ["with-label", "inline", "indeterminate"] }},
    thickness: {{ control: "select", options: ["thin", "medium", "thick"] }},
    state: {{ control: "select", options: ["in-progress", "completed-success", "completed-warning", "failed-error"] }},
    showHelperText: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{
  args: {{ value: 60, type: "inline", thickness: "medium", state: "in-progress" }},
}};

export const WithLabelThinHelperInProgress: Story = {{
  args: {{
    value: 30,
    label: "Label",
    type: "with-label",
    thickness: "thin",
    state: "in-progress",
    showHelperText: true,
    helperText: "Helper text (time estimate)",
  }},
}};

export const ThicknessReference: Story = {{
  render: () => (
    <div style={{{{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}}}>
      <{component_name} value={{30}} label="Thin" type="with-label" thickness="thin" state="in-progress" showHelperText helperText="Track height var(--sizing-size-4) + var(--border-width-border-default) stroke" />
      <{component_name} value={{30}} label="Medium" type="with-label" thickness="medium" state="in-progress" showHelperText helperText="Track height var(--sizing-size-8) + var(--border-width-border-default) stroke" />
      <{component_name} value={{30}} label="Thick" type="with-label" thickness="thick" state="in-progress" showHelperText helperText="Track height var(--sizing-size-16) + var(--border-width-border-default) stroke" />
    </div>
  ),
}};

export const States: Story = {{
  render: () => (
    <div style={{{{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}}}>
      <{component_name} value={{35}} label="In Progress" type="with-label" state="in-progress" showHelperText helperText="No status icon for in-progress" />
      <{component_name} value={{100}} label="Completed/Success" type="with-label" state="completed-success" showHelperText helperText="Success with status-ok-circ-solid" />
      <{component_name} value={{100}} label="Completed with Exceptions/Warning" type="with-label" state="completed-warning" showHelperText helperText="Warning with status-warn-tri-solid" />
      <{component_name} value={{100}} label="Failed/Error" type="with-label" state="failed-error" showHelperText helperText="Error with status-critical-square-solid" />
    </div>
  ),
}};

export const Indeterminate: Story = {{
  args: {{
    label: "Processing...",
    type: "indeterminate",
    thickness: "medium",
    state: "in-progress",
    showHelperText: true,
    helperText: "Estimated time unavailable",
  }},
}};
"""
