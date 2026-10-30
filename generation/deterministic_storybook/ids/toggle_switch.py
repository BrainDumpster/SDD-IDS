from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_toggle_switch_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("toggle-switch", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsToggleSwitch"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ IdsToggleSwitch as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Toggle Switch",
  component: {component_name},
  argTypes: {{
    disabled: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Off: Story = {{
  args: {{ label: "Enable alerts", defaultChecked: false }},
}};

export const On: Story = {{
  args: {{ label: "Enable alerts", defaultChecked: true }},
}};

export const DisabledOffAndOn: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 24 }}}}>
      <{component_name} label="Disabled Off" disabled defaultChecked={{false}} />
      <{component_name} label="Disabled On" disabled defaultChecked />
    </div>
  ),
}};

export const Controlled: Story = {{
  render: () => {{
    const [checked, setChecked] = useState(false);
    return (
      <div style={{{{ display: "grid", gap: 8 }}}}>
        <{component_name} label="Enable alerts" checked={{checked}} onCheckedChange={{setChecked}} />
        <span style={{{{ color: "var(--color-text-gray-neutral)" }}}}>Checked: {{checked ? "true" : "false"}}</span>
      </div>
    );
  }},
}};

export const StateMatrixDark: Story = {{
  parameters: {{
    globals: {{ theme: "dark" }},
    backgrounds: {{ default: "dark" }},
  }},
  render: () => (
    <div style={{{{ display: "grid", gap: 12 }}}}>
      <div style={{{{ display: "flex", gap: 24 }}}}>
        <{component_name} label="Off" defaultChecked={{false}} />
        <{component_name} label="On" defaultChecked />
      </div>
      <div style={{{{ display: "flex", gap: 24 }}}}>
        <{component_name} label="Disabled Off" disabled defaultChecked={{false}} />
        <{component_name} label="Disabled On" disabled defaultChecked />
      </div>
    </div>
  ),
}};
"""
