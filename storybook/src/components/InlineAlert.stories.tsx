import type { Meta, StoryObj } from "@storybook/react";
import { InlineAlert } from "./InlineAlert";

const meta: Meta<typeof InlineAlert> = {
  title: "Synapse/InlineAlert",
  component: InlineAlert,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof InlineAlert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "New features available",
    description: "Check out the latest updates in the changelog.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Changes saved",
    description: "Your profile has been updated successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Unsaved changes",
    description: "You have unsaved changes that will be lost if you navigate away.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Validation failed",
    description: "Please correct the errors below before submitting.",
  },
};

export const Dismissible: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <InlineAlert variant="info" title="Dismissible info alert" description="Click the X to dismiss." dismissible />
      <InlineAlert variant="success" title="Dismissible success alert" dismissible />
      <InlineAlert variant="warning" title="Dismissible warning alert" description="This can be closed." dismissible />
      <InlineAlert variant="error" title="Dismissible error alert" dismissible />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <InlineAlert variant="info" title="Info" description="Informational message for the user." />
      <InlineAlert variant="success" title="Success" description="Operation completed." />
      <InlineAlert variant="warning" title="Warning" description="Proceed with caution." />
      <InlineAlert variant="error" title="Error" description="Something went wrong." />
    </div>
  ),
};
