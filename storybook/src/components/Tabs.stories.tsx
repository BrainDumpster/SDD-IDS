import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Synapse/Tabs",
  component: Tabs,
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    items: [
      { value: "overview", label: "Overview", content: "Overview panel content. This shows the high-level summary of the selected item." },
      { value: "details", label: "Details", content: "Details panel content with more granular information about configuration and settings." },
      { value: "activity", label: "Activity", content: "Recent activity log showing the latest events and changes." },
    ],
  },
};

export const WithDisabled: Story = {
  args: {
    items: [
      { value: "active", label: "Active", content: "This tab is active." },
      { value: "pending", label: "Pending", content: "This tab is pending." },
      { value: "archived", label: "Archived", content: "Archived content.", disabled: true },
    ],
  },
};

export const ManyTabs: Story = {
  args: {
    items: [
      { value: "1", label: "Dashboard", content: "Dashboard content" },
      { value: "2", label: "Analytics", content: "Analytics content" },
      { value: "3", label: "Reports", content: "Reports content" },
      { value: "4", label: "Settings", content: "Settings content" },
      { value: "5", label: "Users", content: "Users content" },
    ],
  },
};
