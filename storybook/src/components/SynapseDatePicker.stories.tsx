import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { SynapseDatePicker } from "./SynapseDatePicker";
import {
  SYNAPSE_DATE_PICKER_CONTROL_RADIUS_ALIAS,
  SYNAPSE_DATE_PICKER_DESIGN_SPEC_PATH,
  SYNAPSE_DATE_PICKER_FOCUS_RING_RADIUS_ALIAS,
  SYNAPSE_DATE_PICKER_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_DATE_PICKER_MAIN_NODE_ID,
} from "../spec-contracts/synapse-date-picker.contract";

const meta: Meta<typeof SynapseDatePicker> = {
  title: "Spec Generated/Synapse/Date Picker",
  component: SynapseDatePicker,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Date Picker (IDS contract). Source: \`${SYNAPSE_DATE_PICKER_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_DATE_PICKER_IDS_BASELINE_SPEC_PATH}\`.`,
          `Synapse deltas: \`${SYNAPSE_DATE_PICKER_CONTROL_RADIUS_ALIAS}\`, \`${SYNAPSE_DATE_PICKER_FOCUS_RING_RADIUS_ALIAS}\` → \`radius-4\` (4px) per Figma \`${SYNAPSE_DATE_PICKER_MAIN_NODE_ID}\`.`,
          "Theme: `components/synapse-theme.css`. Calendar popup inherits IDS.",
        ].join(" "),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SynapseDatePicker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => (
    <div style={{ padding: 24, maxWidth: 360 }}>
      <SynapseDatePicker size="large" label="Start date" placeholder="MM/DD/YYYY" />
    </div>
  ),
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
        Synapse: <code>{SYNAPSE_DATE_PICKER_CONTROL_RADIUS_ALIAS}</code> resolves to 4px on field,
        calendar popup, and month/year dropdowns via synapse-theme.css. IDS baseline is square (0px).
      </p>
      <SynapseDatePicker size="large" label="Date" placeholder="MM/DD/YYYY" />
    </div>
  ),
};
