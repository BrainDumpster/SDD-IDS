import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../tokens.css";
import Alert from "./Alert";

/**
 * Joe-Generated Alert — uses only:
 * - storybook/src/components/dap/joe-generated/Alert/Alert.tsx
 * - storybook/src/components/dap/joe-generated/Alert/Alert.css (imported by Alert.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Alert/alert.mdx
 */
const meta: Meta<typeof Alert> = {
  title: "Spec Generated/DAP/Joe-Generated/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Alert. Implementation: `storybook/src/components/dap/joe-generated/Alert/Alert.tsx` + `Alert.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Alert/alert.mdx`.",
      },
    },
  },
  argTypes: {
    display: { control: "select", options: ["global", "inline"] },
    severity: {
      control: "select",
      options: [
        "informational",
        "success",
        "warning-minor",
        "warning-major",
        "critical",
      ],
    },
    density: { control: "select", options: ["compact", "detailed"] },
    dismissible: { control: "boolean" },
    onAction: { action: "onAction" },
    onDismiss: { action: "onDismiss" },
    onLinkClick: { action: "onLinkClick" },
  },
  args: {
    display: "inline",
    message: "Alert message",
    severity: "informational",
    density: "compact",
    dismissible: true,
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    display: "inline",
    message: "Alert message",
    severity: "informational",
    density: "compact",
  },
};

export const InlineSeverities: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      {(
        [
          "informational",
          "success",
          "warning-minor",
          "warning-major",
          "critical",
        ] as const
      ).map((severity) => (
        <Alert
          key={severity}
          display="inline"
          severity={severity}
          density="compact"
          message={`${severity} inline alert`}
          dismissible={severity !== "critical"}
        />
      ))}
    </div>
  ),
};

export const InlineDetailedAllSlots: Story = {
  args: {
    display: "inline",
    density: "detailed",
    severity: "critical",
    title: "Alert title",
    message: "Detailed inline alert with title, message, link, and action.",
    link: { label: "Learn more", href: "https://example.com" },
    actionLabel: "Action",
    dismissible: false,
  },
};

export const InlineCompactWithActionAndDismiss: Story = {
  args: {
    display: "inline",
    density: "compact",
    severity: "informational",
    message: "Compact inline alert with action and dismiss.",
    actionLabel: "Action",
    dismissible: true,
  },
};

export const GlobalSeverities: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 12, width: "100%" }}>
      {(
        [
          "informational",
          "warning-major",
          "warning-minor",
          "critical",
        ] as const
      ).map((severity) => (
        <Alert
          key={severity}
          display="global"
          severity={severity}
          message={`${severity} global alert`}
          dismissible={true}
        />
      ))}
    </div>
  ),
};

export const GlobalWithAction: Story = {
  args: {
    display: "global",
    severity: "informational",
    message: "Global alert with action and dismiss.",
    actionLabel: "Action",
    link: { label: "Details", href: "https://example.com" },
    dismissible: true,
  },
};

export const GlobalCarousel: Story = {
  render: function GlobalCarouselStory() {
    const [currentItem, setCurrentItem] = useState(1);
    const totalItems = 3;
    const messages = [
      "First global alert in carousel.",
      "Second global alert in carousel.",
      "Third global alert in carousel.",
    ];
    return (
      <Alert
        display="global"
        severity="informational"
        message={messages[currentItem - 1]}
        dismissible={true}
        carousel={{
          currentItem,
          totalItems,
          onPrevious: () => setCurrentItem((n) => Math.max(1, n - 1)),
          onNext: () => setCurrentItem((n) => Math.min(totalItems, n + 1)),
        }}
      />
    );
  },
};
