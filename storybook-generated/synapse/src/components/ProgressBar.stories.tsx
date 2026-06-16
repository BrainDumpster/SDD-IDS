import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import { SynapseProgressBar } from "../../../../storybook/src/components/SynapseProgressBar";
import {
  SYNAPSE_PROGRESS_BAR_DESIGN_SPEC_PATH,
  SYNAPSE_PROGRESS_BAR_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_PROGRESS_BAR_SPEC_ACCURATE_NODE_ID,
} from "../../../../storybook/src/spec-contracts/synapse-progress-bar.contract";

/** IDS Figma `11099:57210` layout; Synapse delta: `--progress-bar-control-radius` → 2px. */
const specAccurateArgs: ComponentProps<typeof SynapseProgressBar> = {
  value: 30,
  label: "Label",
  type: "with-label",
  thickness: "thin",
  state: "in-progress",
  showHelperText: true,
  helperText: "Helper text (time estimate)",
};

const meta: Meta<typeof SynapseProgressBar> = {
  title: "Spec Generated/Synapse/Progress Bar",
  component: SynapseProgressBar,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Progress Bar (IDS contract). Source: \`${SYNAPSE_PROGRESS_BAR_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_PROGRESS_BAR_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary story layout: Figma \`${SYNAPSE_PROGRESS_BAR_SPEC_ACCURATE_NODE_ID}\`; Synapse delta: \`--progress-bar-control-radius\` → \`radius-2\` (2px).`,
          "Theme: `components/synapse-theme.css`. All other chrome inherits IDS.",
        ].join(" "),
      },
    },
  },
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    type: { control: "select", options: ["with-label", "inline", "indeterminate"] },
    thickness: { control: "select", options: ["thin", "medium", "thick"] },
    state: {
      control: "select",
      options: ["in-progress", "completed-success", "completed-warning", "failed-error"],
    },
    showHelperText: { control: "boolean" },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseProgressBar>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
  render: (args) => (
    <div style={{ maxWidth: 300, width: "100%" }}>
      <SynapseProgressBar {...args} />
    </div>
  ),
};

/** Figma `11099:57186` — inline medium (inherits IDS; Synapse 2px radius via theme). */
export const InlineType: Story = {
  args: {
    value: 30,
    type: "inline",
    thickness: "medium",
    state: "in-progress",
  },
  render: (args) => (
    <div style={{ maxWidth: 300, width: "100%" }}>
      <SynapseProgressBar {...args} />
    </div>
  ),
};

export const StateMatrix: Story = {
  name: "State Matrix",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 300 }}>
      <SynapseProgressBar value={30} label="In progress" type="with-label" thickness="thin" />
      <SynapseProgressBar
        value={100}
        label="Success"
        type="with-label"
        thickness="thin"
        state="completed-success"
        showHelperText
        helperText="Completed successfully"
      />
      <SynapseProgressBar
        value={100}
        label="Warning"
        type="with-label"
        thickness="thin"
        state="completed-warning"
        showHelperText
        helperText="Completed with exceptions"
      />
      <SynapseProgressBar
        value={45}
        label="Error"
        type="with-label"
        thickness="thin"
        state="failed-error"
        showHelperText
        helperText="Failed"
      />
      <SynapseProgressBar type="indeterminate" thickness="medium" />
    </div>
  ),
};
