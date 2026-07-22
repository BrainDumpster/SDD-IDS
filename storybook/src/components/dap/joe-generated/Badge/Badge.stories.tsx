import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import Badge from "./Badge";

/**
 * Joe-Generated Badge — uses only:
 * - storybook/src/components/dap/joe-generated/Badge/Badge.tsx
 * - storybook/src/components/dap/joe-generated/Badge/Badge.css (imported by Badge.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Badge/badge.mdx
 */

const meta: Meta<typeof Badge> = {
  title: "Spec Generated/DAP/Joe-Generated/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Badge. Implementation: `storybook/src/components/dap/joe-generated/Badge/Badge.tsx` + `Badge.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Badge/badge.mdx`.",
      },
    },
  },
  argTypes: {
    type: {
      control: "select",
      options: ["default", "critical", "warning", "disabled", "success"],
    },
    value: { control: "text" },
    as: { control: "text" },
    ariaLabel: { control: "text" },
  },
  args: {
    value: "1",
    type: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    value: "1",
    type: "default",
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      {(
        ["default", "critical", "warning", "disabled", "success"] as const
      ).map((type) => (
        <Badge key={type} type={type} value="1" ariaLabel={`${type} badge`} />
      ))}
    </div>
  ),
};

export const Critical: Story = {
  args: { value: "3", type: "critical" },
};

export const Warning: Story = {
  args: { value: "5", type: "warning" },
};

export const Disabled: Story = {
  args: { value: "0", type: "disabled" },
};

export const Success: Story = {
  args: { value: "9", type: "success" },
};

export const StringValue: Story = {
  args: {
    value: "New",
    type: "default",
    ariaLabel: "New items",
  },
};

export const WithAriaLabel: Story = {
  args: {
    value: "12",
    type: "critical",
    ariaLabel: "12 unread notifications",
  },
};

/**
 * Showcase-only context from MDX (not a runtime prop): warning border can be
 * overridden via `--ids-badge-warning-border-color` for White/Gray backgrounds.
 */
export const WarningOnGrayBackground: Story = {
  args: {
    value: "1",
    type: "warning",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          padding: 16,
          background: "var(--color-background-surface-1, #f4f4f4)",
          // Host override documented in MDX
          ["--ids-badge-warning-border-color" as string]:
            "var(--color-border-alerting-minor-transparent, #9c622e)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
