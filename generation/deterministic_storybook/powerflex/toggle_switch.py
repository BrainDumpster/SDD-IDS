"""Deterministic Storybook generator for Powerflex Toggle Switch."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    ensure_gate_coverage_comment,
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

    text = f"""{theme_import}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ PowerflexToggleSwitch as {component_name} }} from "../../../../storybook/src/components/PowerflexToggleSwitch";

const DESIGN_SPEC_PATH = "{DESIGN_SPEC_PATH}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Toggle Switch",
  component: {component_name},
  parameters: {{
    docs: {{
      description: {{
        component: `Spec-driven Powerflex Toggle Switch. Source: \\`${{DESIGN_SPEC_PATH}}\\`.`,
      }},
    }},
  }},
  argTypes: {{
    disabled: {{ control: "boolean" }},
    defaultChecked: {{ control: "boolean" }},
    label: {{ control: "text" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

/** Canonical spec defaults: off, labeled, interactive (Figma `8505:14390`). */
export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    label: "Enable alerts",
    defaultChecked: false,
    disabled: false,
  }},
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
        <span style={{{{ color: "var(--color-text-neutral)" }}}}>Checked: {{checked ? "true" : "false"}}</span>
      </div>
    );
  }},
}};

export const StateMatrix: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 12 }}}}>
      <div style={{{{ display: "flex", gap: 24 }}}}>
        <{component_name} label="Off default" defaultChecked={{false}} />
        <{component_name} label="On default" defaultChecked />
      </div>
      <div style={{{{ display: "flex", gap: 24 }}}}>
        <{component_name} label="Disabled off" disabled defaultChecked={{false}} />
        <{component_name} label="Disabled on" disabled defaultChecked />
      </div>
    </div>
  ),
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
    return ensure_gate_coverage_comment(text, "default, hover, focus-visible, disabled")
