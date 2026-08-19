from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_anchor_menu_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("anchor-menu", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsAnchorMenu"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsAnchorMenu as {component_name} }} from "{import_path}";

const items = [
  {{ label: "Overview", href: "#overview", active: true }},
  {{ label: "Installation", href: "#installation" }},
  {{ label: "Usage", href: "#usage" }},
  {{ label: "API Reference", href: "#api-reference" }},
  {{ label: "Examples", href: "#examples" }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Anchor Menu",
  component: {component_name},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const FiveSections: Story = {{ args: {{ items }} }};

export const MiddleActive: Story = {{
  args: {{
    items: items.map((item, index) => ({{ ...item, active: index === 2 }})),
  }},
}};

export const WithPageContent: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 32, padding: 24 }}}}>
      <div style={{{{ flex: 1, color: "var(--color-text-gray-neutral-strong)" }}}}>
        <h2 id="overview" style={{{{ marginBottom: 120 }}}}>Overview</h2>
        <h2 id="installation" style={{{{ marginBottom: 120 }}}}>Installation</h2>
        <h2 id="usage" style={{{{ marginBottom: 120 }}}}>Usage</h2>
        <h2 id="api-reference" style={{{{ marginBottom: 120 }}}}>API Reference</h2>
        <h2 id="examples" style={{{{ marginBottom: 120 }}}}>Examples</h2>
      </div>
      <{component_name} items={{items}} />
    </div>
  ),
}};
"""
