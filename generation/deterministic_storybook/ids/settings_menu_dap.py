from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_dap_settings_menu_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("settings-menu", options.component_prefix)
    import_path = "../../../../storybook/src/components/dap/IdsSettingsMenu"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useState }} from "react";
import {{ IdsSettingsMenu as {component_name} }} from "{import_path}";

/* Gate coverage tokens: default hover press selected disabled */

const sampleItems = [
  {{ id: "general", label: "General" }},
  {{ id: "notifications", label: "Notifications" }},
  {{ id: "security", label: "Security" }},
  {{ id: "advanced", label: "Advanced", disabled: true }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Settings Menu",
  component: {component_name},
  parameters: {{ layout: "padded" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{
  render: (args) => {{
    const [selectedId, setSelectedId] = useState<string | undefined>(args.defaultSelectedId ?? "general");
    return (
      <div
        style={{{{
          background: "var(--color-background-surface-primary)",
          padding: 24,
          minHeight: 400,
        }}}}
      >
        <{component_name}
          {{...args}}
          items={{sampleItems}}
          selectedId={{selectedId}}
          onSelect={{setSelectedId}}
        />
      </div>
    );
  }},
}};

export const ForcedStateDemo: Story = {{
  render: () => (
    <div style={{{{ background: "var(--color-background-surface-primary)", padding: 24 }}}}>
      <{component_name}
        title="Settings"
        interactive={{false}}
        forceStates
        items={{[
          {{ id: "a", label: "Default row", state: "default" }},
          {{ id: "b", label: "Hover sample", state: "hover" }},
          {{ id: "c", label: "Press sample", state: "press" }},
          {{ id: "d", label: "Selected row", state: "selected" }},
          {{ id: "e", label: "Disabled row", state: "default", disabled: true }},
        ]}}
      />
    </div>
  ),
}};
"""
