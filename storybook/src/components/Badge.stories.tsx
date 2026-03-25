import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { Button } from "./Button";

const meta: Meta<typeof Badge> = {
  title: "Synapse/Badge",
  component: Badge,
  argTypes: {
    count: { control: "number" },
    dot: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const WithCount: Story = {
  args: {
    count: 5,
    children: (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 4,
          background: "var(--color-background-surface-1)",
        }}
      >
        <BellIcon />
      </span>
    ),
  },
};

export const DotOnly: Story = {
  args: {
    dot: true,
    children: (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 4,
          background: "var(--color-background-surface-1)",
        }}
      >
        <BellIcon />
      </span>
    ),
  },
};

export const HighCount: Story = {
  args: {
    count: 150,
    children: (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: 4,
          background: "var(--color-background-surface-1)",
        }}
      >
        <BellIcon />
      </span>
    ),
  },
};

export const OnButton: Story = {
  render: () => (
    <Badge count={3}>
      <Button variant="secondary">Notifications</Button>
    </Badge>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
      <Badge count={4}>
        <IconBox />
      </Badge>
      <Badge count={99}>
        <IconBox />
      </Badge>
      <Badge count={150}>
        <IconBox />
      </Badge>
      <Badge dot>
        <IconBox />
      </Badge>
      <Badge count={2}>
        <Button variant="primary">Messages</Button>
      </Badge>
    </div>
  ),
};

function IconBox() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        borderRadius: 4,
        background: "var(--color-background-surface-1)",
      }}
    >
      <BellIcon />
    </span>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 5.33C12 4.27 11.58 3.25 10.83 2.5C10.08 1.75 9.06 1.33 8 1.33C6.94 1.33 5.92 1.75 5.17 2.5C4.42 3.25 4 4.27 4 5.33C4 10 2 11.33 2 11.33H14C14 11.33 12 10 12 5.33Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.15 13.33C9.03 13.55 8.86 13.73 8.65 13.86C8.44 13.99 8.2 14.05 7.96 14.05C7.72 14.05 7.48 13.99 7.27 13.86C7.06 13.73 6.89 13.55 6.77 13.33"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
