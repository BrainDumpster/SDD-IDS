from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract

DESIGN_SPEC_PATH = "components/powerflex/toggle-switch/design-spec.md"


def generate_powerflex_toggle_switch_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("toggle-switch", options.component_prefix)
    theme_import = storybook_theme_import_line(options.design_system_slug)
    import_path = "../../../../storybook/src/components/PowerflexToggleSwitch"

    return f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ PowerflexToggleSwitch as {component_name} }} from "{import_path}";
import {{
  POWERFLEX_TOGGLE_SWITCH_COMPONENT_SET_NODE_ID,
  POWERFLEX_TOGGLE_SWITCH_DESIGN_SPEC_PATH,
  POWERFLEX_TOGGLE_SWITCH_SAMPLE_LABEL,
  POWERFLEX_TOGGLE_SWITCH_SPEC_ACCURATE_NODE_ID,
}} from "../../../../storybook/src/spec-contracts/powerflex-toggle-switch.contract";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Toggle Switch",
  component: {component_name},
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component: [
          `Spec-driven Powerflex Toggle Switch (standalone). Source: \\`${{POWERFLEX_TOGGLE_SWITCH_DESIGN_SPEC_PATH}}\\`.`,
          `Primary story: **off / default** (Figma \\`${{POWERFLEX_TOGGLE_SWITCH_SPEC_ACCURATE_NODE_ID}}\\`).`,
          "Theme: `components/ids-theme.css` (IDS foundation reuse).",
        ].join(" "),
      }},
    }},
  }},
  argTypes: {{
    disabled: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Canonical spec defaults: off default (Figma `8505:14390` / set `8505:14389`). */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    label: POWERFLEX_TOGGLE_SWITCH_SAMPLE_LABEL,
    defaultChecked: false,
    disabled: false,
  }},
  parameters: {{
    docs: {{
      description: {{
        story: `Mirrors Figma cell \\`${{POWERFLEX_TOGGLE_SWITCH_SPEC_ACCURATE_NODE_ID}}\\` on component set \\`${{POWERFLEX_TOGGLE_SWITCH_COMPONENT_SET_NODE_ID}}\\`.`,
      }},
    }},
  }},
}};

export const OnDefault: Story = {{
  args: {{
    label: POWERFLEX_TOGGLE_SWITCH_SAMPLE_LABEL,
    defaultChecked: true,
  }},
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
        <{component_name}
          label={{POWERFLEX_TOGGLE_SWITCH_SAMPLE_LABEL}}
          checked={{checked}}
          onCheckedChange={{setChecked}}
        />
        <span style={{{{ color: "var(--color-text-neutral)" }}}}>
          Checked: {{checked ? "true" : "false"}}
        </span>
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
