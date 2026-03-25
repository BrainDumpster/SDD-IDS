import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";

const meta: Meta<typeof Tag> = {
  title: "Synapse/Tag",
  component: Tag,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "error"],
    },
    dismissible: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: { label: "Tag" },
};

export const Dismissible: Story = {
  args: { label: "Removable", dismissible: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag label="Default" />
      <Tag label="Info" variant="info" />
      <Tag label="Success" variant="success" />
      <Tag label="Warning" variant="warning" />
      <Tag label="Error" variant="error" />
    </div>
  ),
};

export const DismissibleVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <Tag label="Filter A" dismissible />
      <Tag label="Active" variant="success" dismissible />
      <Tag label="Pending" variant="warning" dismissible />
      <Tag label="Failed" variant="error" dismissible />
    </div>
  ),
};
