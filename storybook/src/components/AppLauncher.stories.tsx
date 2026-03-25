import type { Meta, StoryObj } from "@storybook/react";
import { AppLauncher } from "./AppLauncher";

const meta: Meta<typeof AppLauncher> = {
  title: "Synapse/AppLauncher",
  component: AppLauncher,
};

export default meta;
type Story = StoryObj<typeof AppLauncher>;

export const SixApps: Story = {
  args: {
    apps: [
      { name: "Dashboard", href: "#" },
      { name: "Analytics", href: "#" },
      { name: "Reports", href: "#" },
      { name: "Settings", href: "#" },
      { name: "Users", href: "#" },
      { name: "Docs", href: "#" },
    ],
  },
};

export const WithCustomIcons: Story = {
  args: {
    apps: [
      {
        name: "Mail",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: "Calendar",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 3V5M16 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        name: "Files",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 6C4 4.89543 4.89543 4 6 4H10L12 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      { name: "Tasks" },
      { name: "Chat" },
      { name: "Admin" },
    ],
  },
};
