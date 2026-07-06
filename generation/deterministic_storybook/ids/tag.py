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
    tags_import_path = "../../../../storybook/src/components/Tags"

    return f"""import React from "react";
import type {{ Meta, StoryObj }} from "@storybook/react";
import "../../../../components/ids-theme.css";
import {{ Tag as {component_name} }} from "{import_path}";
import {{ Tags }} from "{tags_import_path}";
import {{
  IDS_TAG_DESIGN_SPEC_PATH,
  TAG_SPEC_ACCURATE_DEFAULTS,
  TAG_SIZES,
  TAG_TONES,
  TAG_TYPES,
}} from "../../../../component-contracts/ids/tag.contract";

const specAccurateArgs = {{
  label: TAG_SPEC_ACCURATE_DEFAULTS.label,
  type: TAG_SPEC_ACCURATE_DEFAULTS.type,
  tone: TAG_SPEC_ACCURATE_DEFAULTS.tone,
  size: TAG_SPEC_ACCURATE_DEFAULTS.size,
  selected: TAG_SPEC_ACCURATE_DEFAULTS.selected,
  disabled: TAG_SPEC_ACCURATE_DEFAULTS.disabled,
  error: TAG_SPEC_ACCURATE_DEFAULTS.error,
  focusVisible: TAG_SPEC_ACCURATE_DEFAULTS.focusVisible,
  focusOnText: TAG_SPEC_ACCURATE_DEFAULTS.focusOnText,
  showLabel: TAG_SPEC_ACCURATE_DEFAULTS.showLabel,
  labelPrefix: TAG_SPEC_ACCURATE_DEFAULTS.labelPrefix,
  badgeValue: TAG_SPEC_ACCURATE_DEFAULTS.badgeValue,
}};

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tag",
  component: {component_name},
  parameters: {{
    layout: "centered",
    docs: {{
      description: {{
        component: `IDS Tag per \\`${{IDS_TAG_DESIGN_SPEC_PATH}}\\`. Use \\`Tags\\` to lay out multiple tag items with group gap.`,
      }},
    }},
  }},
  args: specAccurateArgs,
  argTypes: {{
    label: {{ control: "text" }},
    tone: {{ control: "select", options: [...TAG_TONES] }},
    type: {{ control: "select", options: [...TAG_TYPES] }},
    size: {{ control: "select", options: [...TAG_SIZES] }},
    selected: {{ control: "boolean" }},
    disabled: {{ control: "boolean" }},
    error: {{ control: "boolean" }},
    focusVisible: {{ control: "boolean" }},
    focusOnText: {{ control: "boolean" }},
    demoHover: {{ control: "boolean" }},
    showLabel: {{ control: "boolean" }},
    labelPrefix: {{ control: "text" }},
    badgeValue: {{ control: "text" }},
    leadingIconSlug: {{ control: "text" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const SpecAccurateDesign: Story = {{
  name: "Spec Accurate Design",
  args: specAccurateArgs,
}};

export const MainComponent: Story = {{
  parameters: {{ controls: {{ disable: true }} }},
  render: () => (
    <Tags>
      <{component_name} type="read-only" label="Tag" tone="none" size="small" />
      <{component_name} type="clickable" label="Tag" tone="none" size="large" />
      <{component_name} type="editable" label="Tag" tone="none" size="large" showLabel labelPrefix="Label" />
      <{component_name} type="badge" label="Tag" tone="none" size="large" showLabel labelPrefix="Label" badgeValue={{1}} />
    </Tags>
  ),
}};

export const ReadOnlyAndAlerting: Story = {{
  parameters: {{ controls: {{ disable: true }} }},
  render: () => (
    <Tags ariaLabel="Alerting tag examples">
      <{component_name} type="read-only" label="Tag" tone="none" size="small" />
      <{component_name} type="read-only" label="Tag" tone="critical" size="small" />
      <{component_name} type="read-only" label="Tag" tone="major" size="small" />
      <{component_name} type="read-only" label="Tag" tone="minor" size="small" />
      <{component_name} type="read-only" label="Tag" tone="success" size="small" />
      <{component_name} type="read-only" label="Tag" tone="informational" size="small" />
    </Tags>
  ),
}};

export const ClickableStates: Story = {{
  parameters: {{ controls: {{ disable: true }} }},
  render: () => (
    <Tags ariaLabel="Clickable tag states">
      <{component_name} type="clickable" label="Tag" tone="none" size="large" />
      <{component_name} type="clickable" label="Tag" tone="none" size="large" demoHover />
      <{component_name} type="clickable" label="Tag" tone="none" size="large" focusVisible />
      <{component_name} type="clickable" label="Tag" tone="none" size="large" selected />
      <{component_name} type="clickable" label="Tag" tone="none" size="large" selected demoHover />
    </Tags>
  ),
}};

export const EditableAndBadgeStates: Story = {{
  parameters: {{ controls: {{ disable: true }} }},
  render: () => (
    <div style={{{{ display: "grid", gap: 16 }}}}>
      <Tags ariaLabel="Editable tag states">
        <{component_name} type="editable" label="Tag" tone="none" size="large" />
        <{component_name} type="editable" label="Tag" tone="critical" size="large" error />
        <{component_name} type="editable" label="Tag" tone="none" size="large" disabled />
        <{component_name} type="editable" label="Tag" tone="none" size="large" focusOnText showLabel labelPrefix="Label" />
      </Tags>
      <Tags ariaLabel="Badge tag states">
        <{component_name} type="badge" label="Tag" size="large" showLabel labelPrefix="Label" badgeValue={{1}} />
        <{component_name} type="badge" label="Tag" size="large" showLabel labelPrefix="Label" badgeValue={{1}} focusVisible />
        <{component_name} type="badge" label="Tag" size="large" showLabel labelPrefix="Label" badgeValue={{1}} error />
      </Tags>
    </div>
  ),
}};

export const NonAlertingLargeStates: Story = {{
  name: "Non-Alerting Large States",
  parameters: {{ controls: {{ disable: true }} }},
  render: () => (
    <Tags ariaLabel="Non-alerting large tag states">
      <{component_name} type="read-only" label="Tag" tone="none" size="large" />
      <{component_name} type="read-only" label="Tag" tone="none" size="large" error />
      <{component_name} type="read-only" label="Tag" tone="none" size="large" focusVisible />
    </Tags>
  ),
}};
"""
