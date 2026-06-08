import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Tracker } from "./Tracker";

const meta: Meta<typeof Tracker> = {
  title: "Spec Generated/Synapse/Tracker",
  component: Tracker,
};

export default meta;
type Story = StoryObj<typeof Tracker>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: [
      { label: "Planning", status: "complete" },
      { label: "Design", status: "complete" },
      { label: "Development", status: "active" },
      { label: "Testing", status: "pending" },
      { label: "Release", status: "pending" },
    ],
  },
};

export const MixedStatus: Story = {
  args: {
    items: [
      { label: "Planning", status: "complete" },
      { label: "Design", status: "complete" },
      { label: "Development", status: "active" },
      { label: "Testing", status: "pending" },
      { label: "Release", status: "pending" },
    ],
  },
};

export const AllComplete: Story = {
  args: {
    items: [
      { label: "Step 1", status: "complete" },
      { label: "Step 2", status: "complete" },
      { label: "Step 3", status: "complete" },
    ],
  },
};

export const AllPending: Story = {
  args: {
    items: [
      { label: "Phase A", status: "pending" },
      { label: "Phase B", status: "pending" },
      { label: "Phase C", status: "pending" },
      { label: "Phase D", status: "pending" },
    ],
  },
};
