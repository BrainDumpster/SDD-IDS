from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_dap_masthead_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("masthead-dap", options.component_prefix)
    import_path = "../../../../storybook/src/components/dap/IdsMastheadDap"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ IdsMastheadDap as {component_name} }} from "{import_path}";

/* Gate coverage tokens: default hover press focus-visible (from spec state tables) */

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Masthead",
  component: {component_name},
  parameters: {{ layout: "fullscreen" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{
  render: (args) => {{
    const [lastAction, setLastAction] = useState("No selection yet");
    return (
      <div style={{{{ background: "var(--color-background-surface-primary)", minHeight: 360 }}}}>
        <{component_name}
          {{...args}}
          onHelpSelect={{(label) => setLastAction(`Help: ${{label}}`)}}
          onLauncherProductSelect={{(id) => setLastAction(`Launcher Product: ${{id}}`)}}
          onLauncherOptionSelect={{(id) => setLastAction(`Launcher Option: ${{id}}`)}}
        />
        <div
          style={{{{
            padding: "16px 24px",
            color: "var(--color-text-gray-neutral-strong)",
            fontSize: "var(--font-size-body-2)",
            lineHeight: "var(--font-line-height-line-height-20)",
          }}}}
        >
          Last interaction: {{lastAction}}
        </div>
      </div>
    );
  }},
}};

export const ProductLabels: Story = {{
  render: () => (
    <div style={{{{ background: "var(--color-background-surface-primary)" }}}}>
      <{component_name}
        productName="Dell Automation Platform"
        productAreaLabel="Portal"
        userInitials="YK"
      />
    </div>
  ),
}};
"""
