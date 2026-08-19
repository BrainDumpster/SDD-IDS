from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_accordion_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("accordion", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsAccordion"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsAccordion as {component_name} }} from "{import_path}";

const sampleItems = [
  {{
    value: "network",
    title: "Network configuration",
    content: "Configure network policies and service endpoints for this workspace.",
    meta: <a href="#">Learn how network policies work</a>,
  }},
  {{
    value: "security",
    title: "Security controls",
    content: "Manage access rules, authentication options, and audit controls.",
  }},
  {{
    value: "integrations",
    title: "Integrations",
    content: "Connect external systems and event pipelines.",
    disabled: true,
  }},
];

const formItems = [
  {{
    value: "contact",
    title: "Primary contact",
    content: "Provide owner details for service notifications.",
    formSlot: (
      <div className="sbFormSlot">
        <label>
          Name
          <input className="sbInput" defaultValue="Muthu" />
        </label>
      </div>
    ),
  }},
  {{
    value: "alerts",
    title: "Alert preferences",
    content: "Select channels for critical and warning notifications.",
    formSlot: (
      <div className="sbFormSlot">
        <label>
          Channel
          <select className="sbInput" defaultValue="email">
            <option value="email">Email</option>
            <option value="slack">Slack</option>
            <option value="pagerduty">PagerDuty</option>
          </select>
        </label>
      </div>
    ),
  }},
];

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Accordion",
  component: {component_name},
  parameters: {{ layout: "padded" }},
  args: {{
    items: sampleItems,
    multiple: false,
    defaultValue: ["network"],
    variant: "default",
    chevronPosition: "left",
  }},
  argTypes: {{
    multiple: {{ control: "boolean" }},
    defaultValue: {{ control: "object" }},
    variant: {{ control: "select", options: ["default", "form"] }},
    chevronPosition: {{ control: "select", options: ["left", "right"] }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

export const Playground: Story = {{
  render: (args) => <{component_name} {{...args}} />,
}};

export const ChevronPositions: Story = {{
  render: () => (
    <div className="sbAccordionGrid">
      <div>
        <div className="sbLabel">Left chevron</div>
        <{component_name}
          items={{sampleItems}}
          defaultValue={{["network"]}}
          chevronPosition="left"
        />
      </div>
      <div>
        <div className="sbLabel">Right chevron</div>
        <{component_name}
          items={{sampleItems}}
          defaultValue={{["network"]}}
          chevronPosition="right"
        />
      </div>
    </div>
  ),
}};

export const SingleAndMultipleExpand: Story = {{
  render: () => (
    <div className="sbAccordionGrid">
      <div>
        <div className="sbLabel">Single expand</div>
        <{component_name}
          items={{sampleItems}}
          defaultValue={{["network"]}}
          multiple={{false}}
        />
      </div>
      <div>
        <div className="sbLabel">Multiple expand</div>
        <{component_name}
          items={{sampleItems}}
          defaultValue={{["network", "security"]}}
          multiple
        />
      </div>
    </div>
  ),
}};

export const FormVariant: Story = {{
  render: () => (
    <div className="sbAccordionSingle">
      <{component_name}
        items={{formItems}}
        variant="form"
        multiple
        defaultValue={{["contact"]}}
      />
    </div>
  ),
}};

export const LayoutTokens: Story = {{
  render: () => (
    <style>{{
      `
      .sbAccordionGrid {{
        display: grid;
        grid-template-columns: repeat(2, minmax(360px, 1fr));
        gap: 24px;
        align-items: start;
      }}
      .sbAccordionSingle {{
        max-width: 760px;
      }}
      .sbLabel {{
        font-size: 12px;
        opacity: 0.85;
        margin-bottom: 8px;
      }}
      .sbFormSlot {{
        margin-top: 12px;
      }}
      .sbFormSlot label {{
        display: grid;
        gap: 6px;
        font-size: 14px;
      }}
      .sbInput {{
        border: 1px solid var(--color-border-gray-neutral-base);
        padding: 6px 8px;
        border-radius: 2px;
        background: var(--color-background-surface-component);
      }}
      `
    }}</style>
  ),
}};
"""
