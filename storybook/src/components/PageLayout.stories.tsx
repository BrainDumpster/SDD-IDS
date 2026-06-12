import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import { PageLayout } from "./PageLayout";

const meta: Meta<typeof PageLayout> = {
  title: "Spec Generated/Synapse/Page Layout",
  component: PageLayout,
};

export default meta;
type Story = StoryObj<typeof PageLayout>;

function SampleMasthead() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
      <strong style={{ fontSize: 16, color: "#252525" }}>Synapse</strong>
      <nav style={{ display: "flex", gap: 16, marginLeft: "auto", fontSize: 14, color: "#4d4d4d" }}>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Home</a>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Reports</a>
        <a href="#" style={{ color: "inherit", textDecoration: "none" }}>Settings</a>
      </nav>
    </div>
  );
}

function SampleSidebar() {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {["Dashboard", "Analytics", "Users", "Notifications", "Settings"].map(
        (item) => (
          <a
            key={item}
            href="#"
            style={{
              display: "block",
              padding: "8px 12px",
              borderRadius: 4,
              fontSize: 14,
              color: "#4d4d4d",
              textDecoration: "none",
            }}
          >
            {item}
          </a>
        ),
      )}
    </nav>
  );
}

function SampleContent() {
  return (
    <div>
      <h2 style={{ margin: "0 0 8px", fontSize: 20, color: "#252525" }}>Dashboard</h2>
      <p style={{ margin: 0, fontSize: 14, color: "#4d4d4d", lineHeight: 1.5 }}>
        Welcome to your dashboard. Here you can view an overview of system metrics,
        recent activity, and quick actions. Use the sidebar to navigate to other sections.
      </p>
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    masthead: <SampleMasthead />,
    sidebar: <SampleSidebar />,
    children: <SampleContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 480, border: "1px solid var(--color-border-neutral-light)", borderRadius: 4 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithMastheadAndSidebar: Story = {
  args: {
    masthead: <SampleMasthead />,
    sidebar: <SampleSidebar />,
    children: <SampleContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 480, border: "1px solid #e0e0e0", borderRadius: 4 }}>
        <Story />
      </div>
    ),
  ],
};

export const MastheadOnly: Story = {
  args: {
    masthead: <SampleMasthead />,
    children: <SampleContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 320, border: "1px solid #e0e0e0", borderRadius: 4 }}>
        <Story />
      </div>
    ),
  ],
};

export const SidebarOnly: Story = {
  args: {
    sidebar: <SampleSidebar />,
    children: <SampleContent />,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 320, border: "1px solid #e0e0e0", borderRadius: 4 }}>
        <Story />
      </div>
    ),
  ],
};

export const ContentOnly: Story = {
  args: {
    children: <SampleContent />,
  },
};
