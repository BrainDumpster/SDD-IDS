import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedButton } from "./SegmentedButton";

const meta: Meta<typeof SegmentedButton> = {
  title: "Synapse/SegmentedButton",
  component: SegmentedButton,
};

export default meta;
type Story = StoryObj<typeof SegmentedButton>;

export const ThreeOptions: Story = {
  render: () => {
    const [value, setValue] = useState("monthly");
    return (
      <SegmentedButton
        options={[
          { value: "daily", label: "Daily" },
          { value: "weekly", label: "Weekly" },
          { value: "monthly", label: "Monthly" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const Preselected: Story = {
  args: {
    options: [
      { value: "list", label: "List" },
      { value: "grid", label: "Grid" },
      { value: "kanban", label: "Kanban" },
    ],
    value: "grid",
  },
};
