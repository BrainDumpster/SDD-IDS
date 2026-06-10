import React from "react";
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTooltip } from "../../../../storybook/src/components/SynapseTooltip";
import {
  SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS,
  SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH,
  SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TOOLTIP_MAIN_NODE_ID,
  SYNAPSE_TOOLTIP_SAMPLE_BODY,
  SYNAPSE_TOOLTIP_SAMPLE_TITLE,
  SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-tooltip.contract";

const specAccurateArgs = {
  title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
  content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
  side: "top" as const,
  arrowAlign: "start" as const,
  showArrow: true,
  closable: false,
};

const meta: Meta<typeof SynapseTooltip> = {
  title: "Spec Generated/Synapse/Tooltip",
  component: SynapseTooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Tooltip (IDS contract). Source: \`${SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary story layout: Figma \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID}\`; Synapse delta: \`${SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}\` → \`radius-8\` (8px) per Figma \`${SYNAPSE_TOOLTIP_MAIN_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. All other tooltip chrome inherits IDS.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    title: { control: "text" },
    content: { control: "text" },
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    arrowAlign: { control: "select", options: ["start", "center", "end"] },
    showArrow: { control: "boolean" },
    closable: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseTooltip>;

function TooltipStoryStyles() {
  return (
    <style>{`
      .sbTooltipCanvas {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 220px;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }
      .sbTooltipRow {
        display: flex;
        gap: 28px;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        min-height: 180px;
      }
      .sbTooltipGrid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;
        min-width: 860px;
        max-width: 1100px;
        padding: 8px;
      }
      .sbTooltipSideRow {
        display: grid;
        grid-template-columns: 88px repeat(3, minmax(220px, 1fr));
        gap: 14px;
        align-items: stretch;
      }
      .sbTooltipSideTitle {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        opacity: 0.9;
        padding-left: 4px;
      }
      .sbTooltipCell {
        display: grid;
        gap: 10px;
        justify-items: center;
        align-content: center;
        min-height: 120px;
        padding: 8px;
        border: 1px dashed var(--color-border-neutral-light, #c5c5c5);
        border-radius: 6px;
        background: var(--color-background-component, #ffffff);
      }
      .sbTooltipLabel {
        font-size: 12px;
        opacity: 0.9;
        text-transform: capitalize;
      }
      .sbTooltipTrigger {
        padding: 7px 14px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-component);
        color: var(--color-text-neutral-strong);
        border-radius: 2px;
        font-size: 14px;
      }
      .sbTooltipRadiusEvidence {
        display: grid;
        gap: 6px;
        justify-items: center;
        font-size: 12px;
        color: var(--color-text-neutral);
      }
      .sbTooltipRadiusSwatch {
        width: 120px;
        height: 48px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-surface-2);
        border-radius: var(--tooltip-control-radius);
      }
    `}</style>
  );
}

/** IDS Figma `38201:109592` layout; Synapse delta: 8px panel radius via theme. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div className="sbTooltipCanvas">
      <TooltipStoryStyles />
      <SynapseTooltip {...args}>
        <button type="button" className="sbTooltipTrigger">
          Hover / Focus me
        </button>
      </SynapseTooltip>
      <div className="sbTooltipRadiusEvidence">
        <span>
          Synapse panel radius: <code>{SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}</code> → 8px
        </span>
        <div className="sbTooltipRadiusSwatch" aria-hidden />
      </div>
    </div>
  ),
};

export const Playground: Story = {
  render: (args) => (
    <div className="sbTooltipCanvas">
      <TooltipStoryStyles />
      <SynapseTooltip {...args}>
        <button type="button" className="sbTooltipTrigger">
          Hover / Focus me
        </button>
      </SynapseTooltip>
    </div>
  ),
};

export const StandardAndClosable: Story = {
  render: () => (
    <div className="sbTooltipRow">
      <TooltipStoryStyles />
      <SynapseTooltip
        title="Standard"
        content="Standard tooltip closes on leave/blur."
        side="top"
        arrowAlign="center"
      >
        <button type="button" className="sbTooltipTrigger">
          Standard
        </button>
      </SynapseTooltip>
      <SynapseTooltip
        title="Closable"
        content="Closable tooltip stays open until close icon is clicked."
        closable
        side="top"
        arrowAlign="center"
      >
        <button type="button" className="sbTooltipTrigger">
          Closable
        </button>
      </SynapseTooltip>
    </div>
  ),
};

export const PlacementMatrix: Story = {
  render: () => {
    const sides = ["top", "bottom", "left", "right"] as const;
    const aligns = ["start", "center", "end"] as const;
    return (
      <div className="sbTooltipGrid">
        <TooltipStoryStyles />
        {sides.map((side) => (
          <div key={side} className="sbTooltipSideRow">
            <div className="sbTooltipSideTitle">{side}</div>
            {aligns.map((align) => (
              <div key={`${side}-${align}`} className="sbTooltipCell">
                <div className="sbTooltipLabel">{align}</div>
                <SynapseTooltip
                  side={side}
                  arrowAlign={align}
                  title="Tooltip"
                  content={`Placement: ${side}-${align}`}
                >
                  <button type="button" className="sbTooltipTrigger">
                    Trigger
                  </button>
                </SynapseTooltip>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const BodyOnly: Story = {
  render: () => (
    <div className="sbTooltipCanvas">
      <TooltipStoryStyles />
      <SynapseTooltip content="Body-only tooltip content with no title." side="right" arrowAlign="center">
        <button type="button" className="sbTooltipTrigger">
          Body only
        </button>
      </SynapseTooltip>
    </div>
  ),
};

const specTokens = [
  SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS,
  "--color-background-surface-2",
  "--color-border-accessible",
  "--color-text-neutral-strong",
  "--color-text-neutral",
] as const;

export const TokenInspector: Story = {
  render: () => (
    <div className="sbTokenInspector">
      <style>{`
        .sbTokenInspector {
          display: grid;
          gap: 8px;
          max-width: 880px;
          padding: 16px;
        }
        .sbTokenHeader {
          font-size: 12px;
          opacity: 0.8;
        }
        .sbTokenRow {
          display: grid;
          grid-template-columns: minmax(260px, 1fr) 72px 120px;
          align-items: center;
          gap: 12px;
          padding: 6px 8px;
          border: 1px solid var(--color-border-neutral-light, #c5c5c5);
          border-radius: 4px;
          background: var(--color-background-component, #ffffff);
        }
        .sbTokenCode {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 12px;
        }
        .sbTokenSwatch {
          width: 64px;
          height: 20px;
          border: 1px solid var(--color-border-accessible, #757575);
          background: transparent;
        }
        .sbTokenSample {
          font-size: 12px;
        }
      `}</style>
      <div className="sbTokenHeader">
        Synapse tooltip tokens — programme delta: {SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS} (8px panel radius)
      </div>
      {specTokens.map((token) => (
        <div key={token} className="sbTokenRow">
          <span className="sbTokenCode">{`var(${token})`}</span>
          <span
            className="sbTokenSwatch"
            style={{
              background: token === SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS ? undefined : `var(${token})`,
              borderRadius: token === SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS ? `var(${token})` : "2px",
            }}
          />
          <span className="sbTokenSample" style={{ color: `var(--color-text-neutral)` }}>
            {token === SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS ? "panel radius" : "Sample"}
          </span>
        </div>
      ))}
    </div>
  ),
};
