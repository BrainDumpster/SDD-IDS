/**
 * Storybook: design-spec–generated Badge from `lib/react/synapse/badge`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/badge/design-spec.md
 *
 * Composition: values ≥ 999 wrap lib `SynapseTooltip` (`hugContent`) for full value.
 * Blue / White-Gray backgrounds are showcase context only (not a runtime prop).
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_BADGE_DOCS_DESCRIPTION,
  SYNAPSE_BADGE_SOURCE_CODE,
} from "./synapse-badge.developer-usage";
import {
  SynapseBadge,
  type SynapseBadgeProps,
} from "@synapse/react/badge";

const rowStyle: React.CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "center",
  flexWrap: "wrap",
};

const meta: Meta<SynapseBadgeProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Badge",
  component: SynapseBadge,
  parameters: {
    layout: "centered",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_BADGE_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_BADGE_SOURCE_CODE,
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
type Story = StoryObj<SynapseBadgeProps>;

export const Playground: Story = {
  render: (args) => <SynapseBadge {...args} />,
};

export const Types: Story = {
  name: "Types",
  render: () => (
    <div style={rowStyle}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={4} type="critical" />
      <SynapseBadge value={12} type="warning" />
      <SynapseBadge value={7} type="disabled" />
      <SynapseBadge value={99} type="success" />
    </div>
  ),
};

export const ContentSizing: Story = {
  name: "Content Sizing",
  render: () => (
    <div style={rowStyle}>
      <SynapseBadge value={1} type="default" />
      <SynapseBadge value={12} type="default" />
      <SynapseBadge value={128} type="default" />
      <SynapseBadge value={999} type="default" ariaLabel="999 notifications" />
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
        <SynapseBadge value={3} type="default" />
        <SynapseBadge value={8} type="critical" />
        <SynapseBadge value={12} type="warning" />
      </div>
      <div
        style={{
          ...rowStyle,
          padding: 12,
          borderRadius: 6,
          background: "var(--color-background-surface-primary)",
          border: "1px solid var(--color-border-gray-neutral-light)",
          // Host override for White/Gray warning border showcase parity.
          ["--synapse-badge-warning-border-color" as string]:
            "var(--color-border-alerting-minor-base)",
        }}
      >
        <SynapseBadge value={3} type="default" />
        <SynapseBadge value={8} type="critical" />
        <SynapseBadge value={12} type="warning" />
      </div>
    </div>
  ),
};
