import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorCard } from "./ErrorCard";

const meta: Meta<typeof ErrorCard> = {
  title: "Spec Generated/Synapse/Error Card",
  component: ErrorCard,
};

export default meta;
type Story = StoryObj<typeof ErrorCard>;

export const NotFound: Story = {
  args: {
    title: "404 — Page Not Found",
    message: "The page you are looking for does not exist or has been moved.",
  },
};

export const GenericWithRetry: Story = {
  args: {
    title: "Something went wrong",
    message: "An unexpected error occurred while loading your data. Please try again.",
    action: { label: "Retry", onClick: () => alert("Retrying...") },
  },
};
