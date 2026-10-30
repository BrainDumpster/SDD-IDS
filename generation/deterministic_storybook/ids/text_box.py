from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_text_box_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("text-box", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsTextBox"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Text Box",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  argTypes: {{
    componentType: {{ control: "select", options: ["text-input", "text-area"] }},
    size: {{ control: "select", options: ["large", "small"] }},
    state: {{ control: "select", options: ["default", "hover", "selected", "focus", "disabled", "error"] }},
    disabled: {{ control: "boolean" }},
    invalid: {{ control: "boolean" }},
    showIcon: {{ control: "boolean" }},
    showHelperText: {{ control: "boolean" }},
  }},
  args: {{
    componentType: "text-input",
    size: "large",
    state: "default",
    placeholder: "Placeholder Text",
    helperText: "Helper text",
    showHelperText: true,
    showIcon: true,
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Playground: Story = {{
  render: (args) => <{component_name} {{...args}} />,
}};

export const StateMatrix: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gridTemplateColumns: "repeat(2, minmax(280px, 300px))", gap: 16 }}}}>
      <{component_name} state="default" value="Filled Text" helperText="Helper text" />
      <{component_name} state="hover" value="Filled Text" helperText="Helper text" />
      <{component_name} state="selected" value="Filled Text" helperText="Helper text" />
      <{component_name} state="focus" value="Filled Text" helperText="Helper text" />
      <{component_name} disabled value="Filled Text" helperText="Helper text" />
      <{component_name} state="error" placeholder="Placeholder Text" errorText="Error message" />
    </div>
  ),
}};

export const TextAreaVariants: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16, maxWidth: 300 }}}}>
      <{component_name} componentType="text-area" state="default" placeholder="Default text-area" helperText="Helper text" />
      <{component_name} componentType="text-area" state="hover" placeholder="Hover text-area" helperText="Helper text" />
      <{component_name} componentType="text-area" state="error" placeholder="Error text-area" errorText="Error message" />
    </div>
  ),
}};

export const SizeScale: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16, maxWidth: 300 }}}}>
      <{component_name} size="large" placeholder="Large (40)" helperText="Helper text" />
      <{component_name} size="small" placeholder="Small (32)" helperText="Helper text" />
    </div>
  ),
}};

export const FocusVisibleAndPointerFocus: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 12, maxWidth: 300 }}}}>
      <p style={{{{ margin: 0, fontSize: 12, color: "var(--color-text-gray-neutral)" }}}}>
        pointer focus and focus-visible: click inside input for pointer focus; use Tab for focus-visible ring.
      </p>
      <{component_name} value="Focus behavior demo" helperText="Helper text" />
    </div>
  ),
}};
"""
