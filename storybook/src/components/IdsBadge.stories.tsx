import type { Meta, StoryObj } from "@storybook/react";
import { IdsBadge } from "./IdsBadge";

const meta: Meta<typeof IdsBadge> = {
  title: "IDS/Badge",
  component: IdsBadge,
  args: {
    value: 8,
    type: "default",
  },
  argTypes: {
    value: { control: "text" },
    type: {
      control: "select",
      options: ["default", "critical", "warning", "disabled", "success"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsBadge>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
      <IdsBadge value={1} type="default" />
      <IdsBadge value={4} type="critical" />
      <IdsBadge value={12} type="warning" />
      <IdsBadge value={99} type="success" />
      <IdsBadge value={7} type="disabled" />
    </div>
  ),
};

export const BackgroundShowcase: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-brand-base)",
        }}
      >
        <IdsBadge value={3} type="default" />
        <IdsBadge value={8} type="critical" />
        <IdsBadge value={12} type="warning" />
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-gray-subtle)",
          border: "1px solid var(--color-border-subtle)",
          ["--ids-badge-warning-border-color" as string]:
            "var(--color-border-alerting-minor-transparent)",
        }}
      >
        <IdsBadge value={3} type="default" />
        <IdsBadge value={8} type="critical" />
        <IdsBadge value={12} type="warning" />
      </div>
    </div>
  ),
};
