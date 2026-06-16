import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseAlert } from "./SynapseAlert";
import {
  SYNAPSE_ALERT_DESIGN_SPEC_PATH,
  SYNAPSE_ALERT_GLOBAL_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_ALERT_INLINE_SPEC_ACCURATE_NODE_ID,
  SYNAPSE_ALERT_SAMPLE_GLOBAL_MESSAGE,
  SYNAPSE_ALERT_SAMPLE_INLINE_MESSAGE,
  SYNAPSE_ALERT_SAMPLE_INLINE_TITLE,
} from "../spec-contracts/synapse-alert.contract";

const meta: Meta<typeof SynapseAlert> = {
  title: "Spec Generated/Synapse/Alert",
  component: SynapseAlert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Alert (IDS-fork). Source: \`${SYNAPSE_ALERT_DESIGN_SPEC_PATH}\`.`,
          "Unified `display`: `global` | `inline`. Alert actions use `--alert-action-control-radius` (2px), not `--button-control-radius`.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    display: { control: "select", options: ["global", "inline"] },
    severity: {
      control: "select",
      options: ["informational", "success", "warning-minor", "warning-major", "critical"],
    },
    density: { control: "select", options: ["compact", "detailed"], if: { arg: "display", eq: "inline" } },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseAlert>;

export const SpecAccurateGlobalInformational: Story = {
  name: "Spec Accurate / Global Informational",
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_ALERT_GLOBAL_SPEC_ACCURATE_NODE_ID}\`.` } },
  },
  args: {
    display: "global",
    severity: "informational",
    message: SYNAPSE_ALERT_SAMPLE_GLOBAL_MESSAGE,
    linkLabel: "Learn more",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const SpecAccurateInlineDetailedCritical: Story = {
  name: "Spec Accurate / Inline Detailed Critical",
  parameters: {
    docs: { description: { story: `Figma \`${SYNAPSE_ALERT_INLINE_SPEC_ACCURATE_NODE_ID}\`.` } },
  },
  args: {
    display: "inline",
    severity: "critical",
    density: "detailed",
    title: SYNAPSE_ALERT_SAMPLE_INLINE_TITLE,
    message: SYNAPSE_ALERT_SAMPLE_INLINE_MESSAGE,
    actionLabel: "Action",
    dismissible: true,
  },
};

export const InlineSuccessCompact: Story = {
  args: {
    display: "inline",
    severity: "success",
    density: "compact",
    message: "Operation completed successfully.",
    dismissible: true,
  },
};

export const GlobalCriticalDismissOnly: Story = {
  args: {
    display: "global",
    severity: "critical",
    message: "Critical application message requiring attention.",
    dismissible: true,
  },
};
