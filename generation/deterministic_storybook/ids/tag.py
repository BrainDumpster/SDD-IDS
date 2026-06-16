from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_tag_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("tag", options.component_prefix)
    import_path = "../../../../storybook/src/components/Tag"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ Tag as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tag",
  component: {component_name},
  argTypes: {{
    tone: {{ control: "select", options: ["non-alerting", "info", "success", "minor", "major", "critical"] }},
    type: {{ control: "select", options: ["read-only", "clickable", "editable", "badge"] }},
    size: {{ control: "select", options: ["sm", "lg"] }},
    selected: {{ control: "boolean" }},
    showLabel: {{ control: "boolean" }},
    closable: {{ control: "boolean" }},
    visualState: {{ control: "select", options: ["default", "hover", "focus", "error", "disabled"] }},
    badgeCount: {{ control: "number" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const MainComponent: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 16, flexWrap: "wrap" }}}}>
      <{component_name} type="read-only" label="Tag" tone="non-alerting" size="sm" />
      <{component_name} type="clickable" label="Tag" tone="non-alerting" size="lg" />
      <{component_name} type="editable" label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" closable />
      <{component_name} type="badge" label="Tag" tone="non-alerting" size="lg" showLabel labelPrefix="Label:" badgeCount={{1}} />
    </div>
  ),
}};

export const ReadOnlyAndAlerting: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 8, flexWrap: "wrap" }}}}>
      <{component_name} type="read-only" label="Tag" tone="non-alerting" size="sm" />
      <{component_name} type="read-only" label="Tag" tone="critical" size="sm" />
      <{component_name} type="read-only" label="Tag" tone="major" size="sm" />
      <{component_name} type="read-only" label="Tag" tone="minor" size="sm" />
      <{component_name} type="read-only" label="Tag" tone="success" size="sm" />
      <{component_name} type="read-only" label="Tag" tone="info" size="sm" />
    </div>
  ),
}};

export const ClickableStates: Story = {{
  render: () => (
    <div style={{{{ display: "flex", gap: 8, flexWrap: "wrap" }}}}>
      <{component_name} type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="default" />
      <{component_name} type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="hover" />
      <{component_name} type="clickable" label="Tag" tone="non-alerting" size="lg" visualState="focus" />
      <{component_name} type="clickable" label="Tag" tone="non-alerting" size="lg" selected visualState="default" />
    </div>
  ),
}};

export const EditableAndBadgeStates: Story = {{
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <div style={{{{ display: "flex", gap: 8, flexWrap: "wrap" }}}}>
        <{component_name} type="editable" label="Tag" tone="non-alerting" size="lg" closable />
        <{component_name} type="editable" label="Tag" tone="critical" size="lg" visualState="error" closable />
        <{component_name} type="editable" label="Tag" tone="non-alerting" size="lg" visualState="disabled" closable />
      </div>
      <div style={{{{ display: "flex", gap: 8, flexWrap: "wrap" }}}}>
        <{component_name} type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={{1}} />
        <{component_name} type="badge" label="Tag" size="lg" showLabel labelPrefix="Label:" badgeCount={{1}} visualState="focus" />
      </div>
    </div>
  ),
}};
"""
