from __future__ import annotations

from pathlib import Path
from typing import Optional

from generation.deterministic_storybook.helpers import prefixed_component_export_name
from generation.deterministic_storybook.models import DeterministicStorybookOptions
from validation.spec_contract_parser import SpecContract


def generate_ids_tooltip_story(
    *,
    repo_root: Path,
    story_path: Path,
    contract: SpecContract,
    options: Optional[DeterministicStorybookOptions] = None,
) -> str:
    options = options or DeterministicStorybookOptions()
    component_name = prefixed_component_export_name("tooltip", options.component_prefix)
    import_path = "../../../../storybook/src/components/IdsTooltip"

    return f"""import type {{ Meta, StoryObj }} from "@storybook/react";
import {{ IdsTooltip as {component_name} }} from "{import_path}";

const meta: Meta<typeof {component_name}> = {{
  title: "{options.title_prefix}/Tooltip",
  component: {component_name},
  parameters: {{ layout: "centered" }},
  args: {{
    content: "Tooltip body content",
    title: "Tooltip title",
    side: "top",
    align: "center",
    showArrow: true,
    closable: false,
  }},
  argTypes: {{
    title: {{ control: "text" }},
    content: {{ control: "text" }},
    side: {{ control: "select", options: ["top", "bottom", "left", "right"] }},
    align: {{ control: "select", options: ["start", "center", "end"] }},
    showArrow: {{ control: "boolean" }},
    closable: {{ control: "boolean" }},
  }},
}};

export default meta;
type Story = StoryObj<typeof {component_name}>;

function TooltipStoryStyles() {{
  return (
    <style>{{
      `
      .sbTooltipCanvas {{
        display: flex;
        min-height: 180px;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }}
      .sbTooltipRow {{
        display: flex;
        gap: 28px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        min-height: 180px;
      }}
      .sbTooltipGrid {{
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;
        min-width: 860px;
        max-width: 1100px;
        padding: 8px;
      }}
      .sbTooltipSideRow {{
        display: grid;
        grid-template-columns: 88px repeat(3, minmax(220px, 1fr));
        gap: 14px;
        align-items: stretch;
      }}
      .sbTooltipSideTitle {{
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        opacity: 0.9;
        padding-left: 4px;
      }}
      .sbTooltipCell {{
        display: grid;
        gap: 10px;
        justify-items: center;
        align-content: center;
        min-height: 120px;
        padding: 8px;
        border: 1px dashed var(--color-border-neutral-light, #c5c5c5);
        border-radius: 6px;
        background: var(--color-background-component, #ffffff);
      }}
      .sbTooltipLabel {{
        font-size: 12px;
        opacity: 0.9;
        text-transform: capitalize;
      }}
      .sbTooltipTrigger {{
        padding: 7px 14px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-component);
        color: var(--color-text-neutral-strong);
        border-radius: 2px;
        font-size: 14px;
      }}
      `
    }}</style>
  );
}}

export const Playground: Story = {{
  render: (args) => (
    <div className="sbTooltipCanvas">
      <TooltipStoryStyles />
      <{component_name} {{...args}}>
        <button type="button" className="sbTooltipTrigger">Hover / Focus me</button>
      </{component_name}>
    </div>
  ),
}};

export const StandardAndClosable: Story = {{
  render: () => (
    <div className="sbTooltipRow">
      <TooltipStoryStyles />
      <{component_name}
        title="Standard"
        content="Standard tooltip closes on leave/blur."
        side="top"
        align="center"
      >
        <button type="button" className="sbTooltipTrigger">Standard</button>
      </{component_name}>
      <{component_name}
        title="Closable"
        content="Closable tooltip stays open until close icon is clicked."
        closable
        side="top"
        align="center"
      >
        <button type="button" className="sbTooltipTrigger">Closable</button>
      </{component_name}>
    </div>
  ),
}};

export const PlacementMatrix: Story = {{
  render: () => {{
    const sides = ["top", "bottom", "left", "right"] as const;
    const aligns = ["start", "center", "end"] as const;
    return (
      <div className="sbTooltipGrid">
        <TooltipStoryStyles />
        {{sides.map((side) => (
          <div key={{side}} className="sbTooltipSideRow">
            <div className="sbTooltipSideTitle">{{side}}</div>
            {{aligns.map((align) => (
              <div key={{`${{side}}-${{align}}`}} className="sbTooltipCell">
                <div className="sbTooltipLabel">{{align}}</div>
                <{component_name}
                  side={{side}}
                  align={{align}}
                  title="Tooltip"
                  content={{"Placement: " + side + "-" + align}}
                >
                  <button type="button" className="sbTooltipTrigger">Trigger</button>
                </{component_name}>
              </div>
            ))}}
          </div>
        ))}}
      </div>
    );
  }},
}};

export const BodyOnly: Story = {{
  render: () => (
    <div className="sbTooltipCanvas">
      <TooltipStoryStyles />
      <{component_name}
        content="Body-only tooltip content with no title."
        side="right"
        align="center"
      >
        <button type="button" className="sbTooltipTrigger">Body only</button>
      </{component_name}>
    </div>
  ),
}};

export const LayoutTokens: Story = {{
  render: () => (
    <TooltipStoryStyles />
  ),
}};
"""
