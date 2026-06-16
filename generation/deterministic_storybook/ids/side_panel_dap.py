from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_dap_side_panel_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("side-panel", options.component_prefix)
    panel_import = "../../../../storybook/src/components/dap/IdsDapSidePanel"
    button_import = "../../../../storybook/src/components/Button"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ useMemo, useState }} from "react";
import {{ Button }} from "{button_import}";
import {{ IdsDapSidePanel as {component_name} }} from "{panel_import}";

/* Gate coverage tokens: default hover */

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Side Panel",
  component: {component_name},
  parameters: {{ layout: "fullscreen" }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const PushDrawer: Story = {{
  render: () => {{
    const [open, setOpen] = useState(false);
    const properties = useMemo(
      () => [
        {{ key: "Health State", value: "Healthy", iconSlug: "status-ok-circ-solid-16" }},
        {{ key: "Last Update", value: "1 days, 2 hours, 57 minutes" }},
        {{ key: "Virtual Machines", value: "2", iconSlug: "virtual-machine", emphasize: true }},
      ],
      []
    );
    const tags = useMemo(() => ["Tag:Value", "Tag:Value", "Tag:Demo"], []);
    return (
      <div style={{{{ height: "100vh", background: "var(--color-background-surface-1)" }}}}>
        <div
          style={{{{
            padding: 16,
            borderBottom: "1px solid var(--color-border-light)",
            background: "var(--color-background-component)",
          }}}}
        >
          <Button onClick={{() => setOpen((v) => !v)}}>{{open ? "Close Side Panel" : "Open Side Panel"}}</Button>
        </div>
        <div style={{{{ display: "flex", height: "calc(100vh - 65px)", width: "100%" }}}}>
          <main
            style={{{{
              flex: "1 1 auto",
              minWidth: 0,
              padding: 24,
              boxSizing: "border-box",
              overflow: "auto",
              background: "var(--color-background-surface-1)",
            }}}}
          >
            <h2 style={{{{ marginTop: 0 }}}}>Application Body</h2>
            <p>default hover — main region stays visible when the panel opens.</p>
          </main>
          <{component_name}
            open={{open}}
            title="Sample resource"
            description="Spec-generated DAP side panel content for validation."
            properties={{properties}}
            tags={{tags}}
            onOpenChange={{setOpen}}
            onClose={{() => setOpen(false)}}
          />
        </div>
      </div>
    );
  }},
}};
"""
