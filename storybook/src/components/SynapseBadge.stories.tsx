import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseBadge } from "./SynapseBadge";
import {
  SYNAPSE_BADGE_COMPONENT_SET_NODE_ID,
  SYNAPSE_BADGE_DESIGN_SPEC_PATH,
  SYNAPSE_BADGE_SAMPLE_VALUE,
  SYNAPSE_BADGE_SPEC_ACCURATE_NODE_ID,
} from "../spec-contracts/synapse-badge.contract";

const meta: Meta<typeof SynapseBadge> = {
  title: "Spec Generated/Synapse/Badge",
  component: SynapseBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Badge (IDS-fork). Source: \`${SYNAPSE_BADGE_DESIGN_SPEC_PATH}\`.`,
          `Primary story: **Default** (Figma \`${SYNAPSE_BADGE_SPEC_ACCURATE_NODE_ID}\`). Matrix: \`${SYNAPSE_BADGE_COMPONENT_SET_NODE_ID}\`.`,
        ].join(" "),
      },
    },
  },
  args: {
    value: SYNAPSE_BADGE_SAMPLE_VALUE,
    type: "default",
  },
  argTypes: {
    value: { control: "text" },
    type: {
      control: "select",
      options: ["default", "critical", "warning", "disabled", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseBadge>;

export const SpecAccurateDefault: Story = {
  name: "Spec Accurate / Default",
};

export const TypeMatrix: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={4} type="critical" />
      <SynapseBadge value={12} type="warning" />
      <SynapseBadge value={99} type="success" />
      <SynapseBadge value={7} type="disabled" />
    </div>
  ),
};

export const DigitWidths: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={12} type="default" />
      <SynapseBadge value={128} type="default" />
    </div>
  ),
};
