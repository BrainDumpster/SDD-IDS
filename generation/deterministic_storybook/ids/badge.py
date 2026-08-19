from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_badge_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("badge", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsBadge"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{
  BADGE_SPEC_ACCURATE_DEFAULTS,
  BADGE_TYPES,
  IDS_BADGE_DESIGN_SPEC_PATH,
}} from "@component-contracts/ids/badge.contract";
import {{ SPEC_ACCURATE_DESIGN_STORY }} from "@component-contracts/common/story-meta";
import {{ IdsBadge as {component_name} }} from "{import_path}";

const rowStyle = {{
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
}} as const;

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Badge",
  component: {component_name},
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component: `IDS Badge per ${{IDS_BADGE_DESIGN_SPEC_PATH}}.`,
      }},
    }},
  }},
  args: {{
    value: BADGE_SPEC_ACCURATE_DEFAULTS.value,
    type: BADGE_SPEC_ACCURATE_DEFAULTS.type,
    ariaLabel: BADGE_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  }},
  argTypes: {{
    value: {{ control: "text" }},
    type: {{ control: "select", options: [...BADGE_TYPES] }},
    ariaLabel: {{ control: "text" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: SPEC_ACCURATE_DESIGN_STORY,
}};

export const Types: Story = {{
  render: () => (
    <div style={{rowStyle}}>
      <{component_name} value={{1}} type="default" />
      <{component_name} value={{4}} type="critical" />
      <{component_name} value={{12}} type="warning" />
      <{component_name} value={{99}} type="success" />
      <{component_name} value={{7}} type="disabled" />
    </div>
  ),
}};

export const ContentSizing: Story = {{
  render: () => (
    <div style={{rowStyle}}>
      <{component_name} value={{1}} type="default" />
      <{component_name} value={{12}} type="default" />
      <{component_name} value={{128}} type="default" />
      <{component_name} value={{999}} type="default" ariaLabel="999 notifications" />
    </div>
  ),
}};

export const LayoutGeometry: Story = {{
  name: "Layout Geometry",
  parameters: {{
    docs: {{
      description: {{
        story:
          "Single-digit badge: 18×18px content box + 1px border on each side = 20×20px total outer size.",
      }},
    }},
  }},
  render: () => (
    <div style={{{{ display: "grid", gap: 16, fontFamily: "inherit" }}}}>
      <div style={{{{ ...rowStyle, gap: 16 }}}}>
        <{component_name} value={{1}} type="default" />
        <{component_name} value={{12}} type="default" />
        <{component_name} value={{128}} type="default" />
      </div>
      <p style={{{{ margin: 0, fontSize: 12, color: "var(--color-text-subtle)", maxWidth: "36rem" }}}}>
        Content box: <strong>18px</strong> × <strong>18px</strong> (single digit) · border{" "}
        <strong>1px</strong> on all sides via <code>var(--border-width-border-1)</code> · total outer{" "}
        <strong>20px</strong> × <strong>20px</strong> (<code>box-sizing: content-box</code>).
      </p>
    </div>
  ),
}};

export const BackgroundShowcase: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 12 }}}}>
      <div
        style={{{{
          ...rowStyle,
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-brand-base)",
        }}}}
      >
        <{component_name} value={{3}} type="default" />
        <{component_name} value={{8}} type="critical" />
        <{component_name} value={{12}} type="warning" />
      </div>
      <div
        style={{{{
          ...rowStyle,
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-gray-subtle)",
          border: "1px solid var(--color-border-subtle)",
          ["--ids-badge-warning-border-color" as string]:
            "var(--color-border-alerting-minor-transparent)",
        }}}}
      >
        <{component_name} value={{3}} type="default" />
        <{component_name} value={{8}} type="critical" />
        <{component_name} value={{12}} type="warning" />
      </div>
    </div>
  ),
}};
"""
