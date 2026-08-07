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
import {{ IdsBadge as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Badge",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  args: {{
    value: 8,
    type: "default",
  }},
  argTypes: {{
    value: {{ control: "text" }},
    type: {{
      control: "select",
      options: ["default", "critical", "warning", "disabled", "success"],
    }},
    ariaLabel: {{ control: "text" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Playground: Story = {{
  render: (args) => <{component_name} {{...args}} />,
}};

export const Types: Story = {{
  render: () => (
    <div className="sbBadgeRow">
      <{component_name} value={{1}} type="default" />
      <{component_name} value={{4}} type="critical" />
      <{component_name} value={{12}} type="warning" />
      <{component_name} value={{7}} type="disabled" />
      <{component_name} value={{99}} type="success" />
    </div>
  ),
}};

export const ContentSizing: Story = {{
  render: () => (
    <div className="sbBadgeRow">
      <{component_name} value={{1}} type="default" />
      <{component_name} value={{12}} type="default" />
      <{component_name} value={{128}} type="default" />
      <{component_name} value={{999}} type="default" ariaLabel="999 notifications" />
    </div>
  ),
}};

export const BackgroundShowcase: Story = {{
  render: () => (
    <div className="sbBadgeCol">
      <div className="sbBadgeSurfaceBlue">
        <{component_name} value={{3}} type="default" />
        <{component_name} value={{8}} type="critical" />
        <{component_name} value={{12}} type="warning" />
      </div>
      <div className="sbBadgeSurfaceGray">
        <{component_name} value={{3}} type="default" />
        <{component_name} value={{8}} type="critical" />
        <{component_name} value={{12}} type="warning" />
      </div>
    </div>
  ),
}};

export const LayoutTokens: Story = {{
  render: () => (
    <style>{{
      `
      .sbBadgeRow {{
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }}
      .sbBadgeCol {{
        display: grid;
        gap: 12px;
      }}
      .sbBadgeSurfaceBlue {{
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        padding: 12px;
        border-radius: 6px;
        background: var(--color-background-brand-base);
      }}
      .sbBadgeSurfaceGray {{
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        padding: 12px;
        border-radius: 6px;
        background: var(--color-background-gray-subtle);
        border: 1px solid var(--color-border-subtle);
        --ids-badge-warning-border-color: var(--color-border-alerting-minor-transparent);
      }}
      `
    }}</style>
  ),
}};
"""
