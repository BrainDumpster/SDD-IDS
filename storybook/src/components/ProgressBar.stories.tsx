import type { Meta, StoryObj } from "@storybook/react";
import { IdsProgressBar } from "./IdsProgressBar";

const meta: Meta<typeof IdsProgressBar> = {
  title: "IDS/ProgressBar",
  component: IdsProgressBar,
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
};

export default meta;
type Story = StoryObj<typeof IdsProgressBar>;

export const Default: Story = {
  args: { value: 60, type: "inline", thickness: "medium", state: "in-progress" },
};

export const WithLabel: Story = {
  args: {
    value: 45,
    label: "Label",
    type: "with-label",
    thickness: "medium",
    state: "in-progress",
  },
};

export const WithLabelThinHelperInProgress: Story = {
  args: {
    value: 30,
    label: "Label",
    type: "with-label",
    thickness: "thin",
    state: "in-progress",
    showHelperText: true,
    helperText: "Helper text (time estimate)",
  },
};

export const ThicknessReference: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <IdsProgressBar
        value={30}
        label="Thin"
        type="with-label"
        thickness="thin"
        state="in-progress"
        showHelperText
        helperText="4px track + 1px border"
      />
      <IdsProgressBar
        value={30}
        label="Medium"
        type="with-label"
        thickness="medium"
        state="in-progress"
        showHelperText
        helperText="8px track + 1px border"
      />
      <IdsProgressBar
        value={30}
        label="Thick"
        type="with-label"
        thickness="thick"
        state="in-progress"
        showHelperText
        helperText="16px track + 1px border"
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
      <IdsProgressBar
        value={35}
        label="In Progress"
        type="with-label"
        state="in-progress"
        showHelperText
        helperText="No status icon for in-progress"
      />
      <IdsProgressBar
        value={100}
        label="Completed/Success"
        type="with-label"
        state="completed-success"
        showHelperText
        helperText="Success with status-ok-circ-solid"
      />
      <IdsProgressBar
        value={100}
        label="Completed with Exceptions/Warning"
        type="with-label"
        state="completed-warning"
        showHelperText
        helperText="Warning with status-warn-tri-solid"
      />
      <IdsProgressBar
        value={100}
        label="Failed/Error"
        type="with-label"
        state="failed-error"
        showHelperText
        helperText="Error with status-critical-square-solid"
      />
    </div>
  ),
};

export const Indeterminate: Story = {
  args: {
    label: "Processing...",
    type: "indeterminate",
    thickness: "medium",
    state: "in-progress",
    showHelperText: true,
    helperText: "Estimated time unavailable",
  },
};

export const SpecMatchedExample: Story = {
  args: {
    value: 30,
    label: "Label",
    type: "with-label",
    thickness: "thin",
    state: "in-progress",
    showHelperText: true,
    helperText: "Helper text (time estimate)",
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <IdsProgressBar {...args} />
    </div>
  ),
};
