from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import (
    prefixed_component_export_name,
    storybook_theme_import_line,
)
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_scroll_bar_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("scroll-bar", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsScrollBar"

    return f"""{storybook_theme_import_line(options.design_system_slug)}
import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsScrollBar as {component_name} }} from "{import_path}";

const DESIGN_SPEC_PATH = "components/ids/scroll-bar/design-spec.md";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Scroll Bar",
  component: {component_name},
  parameters: {{
    docs: {{
      description: {{
        component: `Spec-driven IDS Scroll Bar. Source of truth: ${{DESIGN_SPEC_PATH}}.`,
      }},
    }},
  }},
  argTypes: {{
    type: {{ control: "select", options: ["vertical", "horizontal"] }},
    scrollThumb: {{ control: "select", options: ["start", "middle", "end"] }},
  }},
  args: {{
    type: "vertical",
    scrollThumb: "start",
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: {{
    type: "vertical",
    scrollThumb: "start",
  }},
}};

export const Horizontal: Story = {{
  args: {{
    type: "horizontal",
    scrollThumb: "middle",
  }},
}};

export const VariantMatrix: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 32, alignItems: "center", padding: 16 }}}}>
      <{component_name} type="vertical" scrollThumb="start" />
      <{component_name} type="vertical" scrollThumb="middle" />
      <{component_name} type="vertical" scrollThumb="end" />
      <{component_name} type="horizontal" scrollThumb="start" />
      <{component_name} type="horizontal" scrollThumb="middle" />
      <{component_name} type="horizontal" scrollThumb="end" />
    </div>
  ),
}};
"""
