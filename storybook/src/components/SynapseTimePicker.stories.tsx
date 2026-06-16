import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseTimePicker } from "./SynapseTimePicker";
import {
  SYNAPSE_TIME_PICKER_CONTROL_RADIUS_ALIAS,
  SYNAPSE_TIME_PICKER_DESIGN_SPEC_PATH,
  SYNAPSE_TIME_PICKER_FOCUS_RING_RADIUS_ALIAS,
  SYNAPSE_TIME_PICKER_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TIME_PICKER_MAIN_NODE_ID,
} from "../spec-contracts/synapse-time-picker.contract";

const specAccurateArgs = {
  size: "large" as const,
  label: "Time",
  value: "09:30 PM",
  formatHint: "HH:MM AM/PM",
  placeholder: "HH:MM AM/PM",
  clockType: "12h" as const,
  showSeconds: false,
};

const meta: Meta<typeof SynapseTimePicker> = {
  title: "Spec Generated/Synapse/Time Picker",
  component: SynapseTimePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Time Picker (IDS contract). Source: \`${SYNAPSE_TIME_PICKER_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_TIME_PICKER_IDS_BASELINE_SPEC_PATH}\`.`,
          `Synapse deltas: \`${SYNAPSE_TIME_PICKER_CONTROL_RADIUS_ALIAS}\`, \`${SYNAPSE_TIME_PICKER_FOCUS_RING_RADIUS_ALIAS}\` → \`radius-4\` (4px) per Figma \`${SYNAPSE_TIME_PICKER_MAIN_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. Time popup inherits IDS.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTimePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

export const CornerRadiusOverride: Story = {
  name: "Corner Radius Override (4px)",
  render: () => (
    <div
      style={{
        padding: 24,
        maxWidth: 360,
        background: "var(--color-background-surface-1)",
      }}
    >
      <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-neutral)" }}>
        Synapse: <code>{SYNAPSE_TIME_PICKER_CONTROL_RADIUS_ALIAS}</code> resolves to 4px on field and
        time popup via synapse-theme.css. IDS baseline is square (0px).
      </p>
      <SynapseTimePicker
        size="large"
        label="Time"
        value="09:30 PM"
        formatHint="HH:MM AM/PM"
        clockType="12h"
      />
    </div>
  ),
};
