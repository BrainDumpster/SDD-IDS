/**
 * Storybook: design-spec–generated Badge from `lib/react/ids/badge`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/badge/design-spec.md
 *
 * Composition: values ≥ 999 wrap lib `IdsTooltip` (`hugContent`) for full value.
 * Blue / White-Gray backgrounds are showcase context only (not a runtime prop).
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  BADGE_DOCS_DESCRIPTION,
  BADGE_SOURCE_CODE,
} from "./ids-badge.developer-usage";
import {
  IdsBadge,
  type IdsBadgeProps,
} from "@ids/react/badge";

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const meta: Meta<IdsBadgeProps> = {
  tags: ["autodocs"],
  title: "Components/IDS/Badge",
  component: IdsBadge,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: BADGE_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: BADGE_SOURCE_CODE,
      },
    },
  },
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
    as: { control: false },
    ariaLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<IdsBadgeProps>;

export const Playground: Story = {
  render: (args) => <IdsBadge {...args} />,
};

export const Types: Story = {
  name: "Types",
  render: () => (
    <div style={rowStyle}>
      <IdsBadge value={1} type="default" />
      <IdsBadge value={4} type="critical" />
      <IdsBadge value={12} type="warning" />
      <IdsBadge value={7} type="disabled" />
      <IdsBadge value={99} type="success" />
    </div>
  ),
};

export const ContentSizing: Story = {
  name: "Content Sizing",
  render: () => (
    <div style={rowStyle}>
      <IdsBadge value={1} type="default" />
      <IdsBadge value={12} type="default" />
      <IdsBadge value={128} type="default" />
      <IdsBadge value={999} type="default" ariaLabel="999 notifications" />
    </div>
  ),
};

/** Showcase-only Blue | White/Gray surfaces — not a Badge runtime axis. */
export const BackgroundShowcase: Story = {
  name: "Background Showcase",
  render: () => (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          ...rowStyle,
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
          ...rowStyle,
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-surface-primary)",
          border: "1px solid var(--color-border-gray-neutral-light)",
          // Host override for White/Gray warning border showcase parity.
          ["--ids-badge-warning-border-color" as string]:
            "var(--color-border-alerting-minor-base)",
        }}
      >
        <IdsBadge value={3} type="default" />
        <IdsBadge value={8} type="critical" />
        <IdsBadge value={12} type="warning" />
      </div>
    </div>
  ),
};
