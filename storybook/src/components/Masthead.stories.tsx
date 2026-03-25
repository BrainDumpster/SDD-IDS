import type { Meta, StoryObj } from "@storybook/react";
import { Masthead } from "./Masthead";

const meta: Meta<typeof Masthead> = {
  title: "Synapse/Masthead",
  component: Masthead,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Masthead>;

export const Default: Story = {
  args: {
    logo: <span style={{ fontSize: 16, fontWeight: 500 }}>Synapse</span>,
    navItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "Reports", href: "/reports" },
      { label: "Settings", href: "/settings" },
    ],
  },
};

export const WithActions: Story = {
  args: {
    logo: <span style={{ fontSize: 16, fontWeight: 500 }}>Synapse</span>,
    navItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "Reports", href: "/reports" },
      { label: "Analytics", href: "/analytics" },
      { label: "Settings", href: "/settings" },
    ],
    actions: (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.4)",
            color: "#fff",
            borderRadius: 4,
            padding: "4px 12px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        >
          Help
        </button>
        <button
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            color: "#fff",
            borderRadius: 4,
            padding: "4px 12px",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 14,
          }}
        >
          Profile
        </button>
      </div>
    ),
  },
};

export const LogoOnly: Story = {
  args: {
    logo: <span style={{ fontSize: 16, fontWeight: 500 }}>Synapse Platform</span>,
  },
};
