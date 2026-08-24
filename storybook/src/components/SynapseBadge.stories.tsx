import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { BADGE_SPEC_ACCURATE_DEFAULTS, BADGE_TYPES } from "@component-contracts/ids/badge.contract";
import { SPEC_ACCURATE_DESIGN_STORY } from "../../../component-contracts/common/story-meta";
import { SynapseBadge } from "./SynapseBadge";
import {
  SYNAPSE_BADGE_COMPONENT_SET_NODE_ID,
  SYNAPSE_BADGE_DESIGN_SPEC_PATH,
  SYNAPSE_BADGE_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-badge.contract";

const rowStyle = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
} as const;

const meta: Meta<typeof SynapseBadge> = {
  title: "Components/Synapse/Badge",
  component: SynapseBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Badge (IDS-fork). Source: \`${SYNAPSE_BADGE_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Spec Accurate Design** (Figma \`${SYNAPSE_BADGE_SPEC_ACCURATE_NODE_ID}\`). Matrix: \`${SYNAPSE_BADGE_COMPONENT_SET_NODE_ID}\`.`,
        ].join(" "),
      },
    },
  },
  args: {
    value: BADGE_SPEC_ACCURATE_DEFAULTS.value,
    type: BADGE_SPEC_ACCURATE_DEFAULTS.type,
    ariaLabel: BADGE_SPEC_ACCURATE_DEFAULTS.ariaLabel,
  },
  argTypes: {
    value: { control: "text" },
    type: { control: "select", options: [...BADGE_TYPES] },
    ariaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseBadge>;

export const SpecAccurateDesign: Story = {
  name: SPEC_ACCURATE_DESIGN_STORY,
};

export const Types: Story = {
  render: () => (
    <div style={rowStyle}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={4} type="critical" />
      <SynapseBadge value={12} type="warning" />
      <SynapseBadge value={99} type="success" />
      <SynapseBadge value={7} type="disabled" />
    </div>
  ),
};

export const ContentSizing: Story = {
  render: () => (
    <div style={rowStyle}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={12} type="default" />
      <SynapseBadge value={128} type="default" />
      <SynapseBadge value="999+" type="default" ariaLabel="Nine hundred ninety nine plus notifications" />
    </div>
  ),
};

export const LayoutGeometry: Story = {
  name: "Layout Geometry",
  parameters: {
    docs: {
      description: {
        story:
          "Single-digit badge: 18×18px content box + 1px border on each side = 20×20px total outer size.",
      },
    },
  },
  render: () => (
    <div style={{ display: "grid", gap: 16, fontFamily: "inherit" }}>
      <div style={{ ...rowStyle, gap: 16 }}>
        <SynapseBadge value={1} type="default" />
        <SynapseBadge value={12} type="default" />
        <SynapseBadge value={128} type="default" />
      </div>
      <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-subtle)", maxWidth: "36rem" }}>
        Content box: <strong>18px</strong> × <strong>18px</strong> (single digit) · border{" "}
        <strong>1px</strong> on all sides via <code>var(--border-width-border-1)</code> · total outer{" "}
        <strong>20px</strong> × <strong>20px</strong> (<code>box-sizing: content-box</code>).
      </p>
    </div>
  ),
};
