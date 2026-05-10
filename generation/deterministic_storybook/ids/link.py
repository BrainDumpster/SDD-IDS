from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_link_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("link", options.component_prefix)
    import_path = "../../../../storybook/src/components/Link"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Link as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Link",
  component: {component_name},
  argTypes: {{
    type: {{ control: "select", options: ["standalone", "inline", "dark-bg"] }},
    demoState: {{ control: "select", options: ["default", "hover", "press", "focus-visible"] }},
    showExternalLinkIcon: {{ control: "boolean" }},
    disabled: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Default: Story = {{ args: {{ href: "#", children: "This is a link", type: "standalone", demoState: "default" }} }};
export const WithExternalIcon: Story = {{ args: {{ href: "https://example.com", children: "This is a link", type: "standalone", showExternalLinkIcon: true }} }};

export const DarkBackground: Story = {{
  args: {{ href: "#", children: "This is a link", type: "dark-bg", demoState: "default" }},
  decorators: [(Story) => <div style={{{{ background: "var(--color-background-controls-brand-base)", padding: 16 }}}}><Story /></div>],
}};

export const StateMatrixWithIcon: Story = {{
  render: () => (
    <div style={{{{ background: "var(--color-background-surface-1)", padding: 24 }}}}>
      <div style={{{{ display: "grid", gridTemplateColumns: "1fr 1fr 134px", columnGap: 56 }}}}>
        <div style={{{{ display: "flex", flexDirection: "column", gap: 14 }}}}>
          <{component_name} href="#" type="standalone" demoState="default">This is a link</{component_name}>
          <{component_name} href="#" type="standalone" demoState="hover">This is a link</{component_name}>
          <{component_name} href="#" type="standalone" demoState="press">This is a link</{component_name}>
          <{component_name} href="#" type="standalone" demoState="focus-visible">This is a link</{component_name}>
        </div>
        <div style={{{{ display: "flex", flexDirection: "column", gap: 14 }}}}>
          <{component_name} href="#" type="inline" demoState="default">This is a link</{component_name}>
          <{component_name} href="#" type="inline" demoState="hover">This is a link</{component_name}>
          <{component_name} href="#" type="inline" demoState="press">This is a link</{component_name}>
          <{component_name} href="#" type="inline" demoState="focus-visible">This is a link</{component_name}>
        </div>
        <div style={{{{ background: "var(--color-background-controls-brand-base)", padding: "2px 18px", display: "flex", flexDirection: "column", gap: 14 }}}}>
          <{component_name} href="#" type="dark-bg" demoState="default">This is a link</{component_name}>
          <{component_name} href="#" type="dark-bg" demoState="hover">This is a link</{component_name}>
          <{component_name} href="#" type="dark-bg" demoState="press">This is a link</{component_name}>
          <{component_name} href="#" type="dark-bg" demoState="focus-visible">This is a link</{component_name}>
        </div>
      </div>
    </div>
  ),
}};
"""
