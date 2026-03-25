import type { Meta, StoryObj } from "@storybook/react";
import { GlobalAlert } from "./GlobalAlert";

const meta: Meta<typeof GlobalAlert> = {
  title: "Synapse/GlobalAlert",
  component: GlobalAlert,
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "error"],
    },
    dismissible: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalAlert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "System maintenance scheduled",
    description: "The platform will be unavailable on Saturday from 2:00 AM to 4:00 AM EST.",
    dismissible: true,
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Deployment complete",
    description: "Version 2.4.1 has been successfully deployed to production.",
    dismissible: true,
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "API rate limit approaching",
    description: "You have used 90% of your monthly API quota.",
    dismissible: true,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Service disruption detected",
    description: "Some users may experience intermittent errors. Our team is investigating.",
    dismissible: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <GlobalAlert variant="info" title="Info: System update available" dismissible />
      <GlobalAlert variant="success" title="Success: All services operational" dismissible />
      <GlobalAlert variant="warning" title="Warning: Disk usage at 85%" dismissible />
      <GlobalAlert variant="error" title="Error: Database connection failed" dismissible />
    </div>
  ),
};
