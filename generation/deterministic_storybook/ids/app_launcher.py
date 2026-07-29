from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_app_launcher_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("app-launcher", options.component_prefix)
    import_path = "../../../../storybook/src/components/AppLauncher"

    theme_import = storybook_theme_import_line(options.design_system_slug)
    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ AppLauncher as {component_name} }} from "{import_path}";
{theme_import}

const products = [
  {{ id: "p1", name: "Product Name 1", href: "#" }},
  {{ id: "p2", name: "Product Name 2", href: "#" }},
  {{ id: "p3", name: "Product Name 3", href: "#" }},
  {{ id: "p4", name: "Product Name 4", href: "#" }},
];

const optionsList = [
  {{ id: "o1", label: "Option" }},
  {{ id: "o2", label: "Option" }},
  {{ id: "o3", label: "Option" }},
  {{ id: "o4", label: "Option" }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/App Launcher",
  component: {component_name},
  args: {{ triggerVariant: "masthead", sideOffset: 0, columns: 2 }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const UsageMastheadAttached: Story = {{
  args: {{ products, options: optionsList }},
}};

export const ComponentDetailMatrix: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16, alignItems: "start" }}}}>
      <{component_name} products={{products.slice(0, 1)}} panelOnly />
      <{component_name} products={{products.slice(0, 2)}} panelOnly />
      <{component_name} products={{products.slice(0, 3)}} panelOnly />
      <{component_name} products={{products}} panelOnly />
      <div style={{{{ gridColumn: "span 2" }}}}>
        <{component_name} products={{products}} options={{optionsList}} panelOnly />
      </div>
    </div>
  ),
}};

export const OptionTextOverflow: Story = {{
  render: () => (
    <{component_name}
      products={{products.slice(0, 2)}}
      options={{[
        {{ id: "o1", label: "Option" }},
        {{ id: "o2", label: "This is a very long option label that truncates with an ellipsis instead of wrapping" }},
        {{ id: "o3", label: "Option" }},
      ]}}
      panelOnly
    />
  ),
}};
"""
