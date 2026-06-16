import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTooltip } from "./SynapseTooltip";
import {
  SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS,
  SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH,
  SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TOOLTIP_MAIN_NODE_ID,
  SYNAPSE_TOOLTIP_SAMPLE_BODY,
  SYNAPSE_TOOLTIP_SAMPLE_TITLE,
  SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_TOOLTIP_SPEC_ACCURATE_VARIANT_NODE_ID,
} from "../spec-contracts/synapse-tooltip.contract";

const meta: Meta<typeof SynapseTooltip> = {
  title: "Spec Generated/Synapse/Tooltip",
  component: SynapseTooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Tooltip (IDS-fork). Source: \`${SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline layout/anatomy: \`${SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH}\` (Figma \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID}\`).`,
          `Synapse programme delta: \`${SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}\` → 8px panel radius (Figma \`${SYNAPSE_TOOLTIP_MAIN_NODE_ID}\`).`,
          "Arrow geometry and 12-placement calibration inherit IDS; theme: `components/synapse-theme.css`.",
        ].join(" "),
      },
    },
  },
  render: (args) => (
    <SynapseTooltip {...args}>
      <button type="button" className="sbSynapseTooltipTrigger">
        {String(args.children ?? "Hover over me")}
      </button>
    </SynapseTooltip>
  ),
  args: {
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    side: "top",
    arrowAlign: "start",
    closable: false,
    children: "Hover over me",
  },
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    arrowAlign: { control: "select", options: ["start", "center", "end"] },
    align: { control: "select", options: ["start", "center", "end"] },
    closable: { control: "boolean" },
    title: { control: "text" },
    content: { control: "text" },
    children: { control: "text" },
    onClose: { action: "onClose" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseTooltip>;

function TooltipStoryStyles() {
  return (
    <style>{`
      .sbSynapseTooltipTrigger {
        padding: 7px 14px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-component);
        color: var(--color-text-neutral-strong);
        border-radius: 2px;
        font-size: 14px;
        cursor: default;
      }
      .sbSynapseTooltipCanvas {
        display: flex;
        flex-direction: column;
        gap: 16px;
        align-items: center;
        justify-content: center;
        padding: 32px;
      }
      .sbSynapseTooltipRadiusEvidence {
        display: grid;
        gap: 6px;
        justify-items: center;
        font-size: 12px;
        color: var(--color-text-neutral);
      }
      .sbSynapseTooltipRadiusSwatch {
        width: 120px;
        height: 48px;
        border: 1px solid var(--color-border-accessible);
        background: var(--color-background-surface-2);
        border-radius: var(--tooltip-control-radius);
      }
      .sbSynapseTooltipMatrix {
        display: grid;
        grid-template-columns: repeat(3, minmax(220px, 1fr));
        gap: 20px;
        padding: 24px;
      }
      .sbSynapseTooltipMatrixCell {
        display: flex;
        justify-content: center;
      }
    `}</style>
  );
}

/** IDS Figma `38201:109593` (Arrow Pointing=Down, Start) + Synapse 8px panel radius. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate / Down Start",
  parameters: {
    docs: {
      description: {
        story: `Figma variant \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_VARIANT_NODE_ID}\` within \`${SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID}\`.`,
      },
    },
  },
  args: {
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    side: "top",
    arrowAlign: "start",
    closable: false,
    children: "Hover over me",
  },
  render: (args) => (
    <div className="sbSynapseTooltipCanvas">
      <TooltipStoryStyles />
      <SynapseTooltip {...args}>
        <button type="button" className="sbSynapseTooltipTrigger">
          Hover over me
        </button>
      </SynapseTooltip>
      <div className="sbSynapseTooltipRadiusEvidence">
        <span>
          Synapse panel radius: <code>{SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS}</code>
        </span>
        <div className="sbSynapseTooltipRadiusSwatch" aria-hidden />
      </div>
    </div>
  ),
};

export const NormalNoHeader: Story = {
  args: {
    title: "",
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    closable: false,
    side: "top",
    arrowAlign: "start",
    children: "Hover over me",
  },
};

export const WithHeader: Story = {
  args: {
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: SYNAPSE_TOOLTIP_SAMPLE_BODY,
    closable: false,
    side: "top",
    arrowAlign: "center",
    children: "Hover over me",
  },
};

export const Closable: Story = {
  args: {
    title: SYNAPSE_TOOLTIP_SAMPLE_TITLE,
    content: "This tooltip stays open until the user clicks the close icon.",
    closable: true,
    side: "top",
    arrowAlign: "end",
    children: "Hover over me",
    onClose: () => undefined,
  },
};

export const RichContent: Story = {
  args: {
    title: "Custom Content",
    closable: false,
    side: "right",
    arrowAlign: "center",
    children: "Hover over me",
    content: (
      <div>
        <p style={{ margin: 0 }}>Any content can be rendered here.</p>
        <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
          <li>Text</li>
          <li>Lists</li>
          <li>Inline formatting</li>
        </ul>
      </div>
    ),
  },
};

export const ArrowMatrix: Story = {
  render: () => (
    <>
      <TooltipStoryStyles />
      <div className="sbSynapseTooltipMatrix">
        {(["bottom", "top", "right", "left"] as const).flatMap((side) =>
          (["start", "center", "end"] as const).map((align) => (
            <div key={`${side}-${align}`} className="sbSynapseTooltipMatrixCell">
              <SynapseTooltip
                title={SYNAPSE_TOOLTIP_SAMPLE_TITLE}
                content={SYNAPSE_TOOLTIP_SAMPLE_BODY}
                side={side}
                arrowAlign={align}
              >
                <button type="button" className="sbSynapseTooltipTrigger">{`${side}-${align}`}</button>
              </SynapseTooltip>
            </div>
          ))
        )}
      </div>
    </>
  ),
};
