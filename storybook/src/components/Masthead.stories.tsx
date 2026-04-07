import type { Meta, StoryObj } from "@storybook/react";
import { Masthead } from "./Masthead";
import { AppLauncher } from "./AppLauncher";

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

/** App launcher is embedded in masthead actions (help -> launcher -> user), per design-spec integration. */
export const WithAppLauncherExample: Story = {
  args: {
    logo: <span style={{ fontSize: 16, fontWeight: 500 }}>Synapse</span>,
    navItems: [
      { label: "Dashboard", href: "/", active: true },
      { label: "Reports", href: "/reports" },
      { label: "Analytics", href: "/analytics" },
    ],
    actions: (
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: 4,
            border: "none",
            background: "transparent",
            color: "var(--color-text-white)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          aria-label="Help"
        >
          ?
        </button>
        <AppLauncher
          products={[
            { id: "p1", name: "Product Name 1", href: "#" },
            { id: "p2", name: "Product Name 2", href: "#" },
            { id: "p3", name: "Product Name 3", href: "#" },
            { id: "p4", name: "Product Name 4", href: "#" },
          ]}
          options={[
            { id: "o1", label: "Option" },
            { id: "o2", label: "Option" },
            { id: "o3", label: "Option" },
            { id: "o4", label: "Option" },
          ]}
        />
        <button
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.12)",
            color: "var(--color-text-white)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
          }}
          aria-label="User profile"
        >
          YK
        </button>
      </div>
    ),
  },
};
