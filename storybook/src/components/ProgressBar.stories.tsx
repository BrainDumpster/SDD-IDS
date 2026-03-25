import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Synapse/ProgressBar",
  component: ProgressBar,
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100 } },
    size: { control: "select", options: ["sm", "md"] },
    showValue: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 60 },
};

export const WithLabel: Story = {
  args: { value: 45, label: "Uploading files...", showValue: true },
};

export const Complete: Story = {
  args: { value: 100, label: "Upload complete", showValue: true },
};

export const Small: Story = {
  args: { value: 30, size: "sm" },
};

export const Steps: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 400 }}>
      <ProgressBar value={25} label="Step 1 of 4" showValue />
      <ProgressBar value={50} label="Step 2 of 4" showValue />
      <ProgressBar value={75} label="Step 3 of 4" showValue />
      <ProgressBar value={100} label="Complete" showValue />
    </div>
  ),
};
