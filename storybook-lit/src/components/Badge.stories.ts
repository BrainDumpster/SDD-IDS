/**
 * Storybook: IDS Lit Badge from `lib/lit/ids/badge`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/badge/design-spec.md
 * API: lib/react/ids/badge
 *
 * Blue / White-Gray backgrounds are showcase context only (not a runtime prop).
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/badge/register.js";
import {
  BADGE_DOCS_DESCRIPTION,
  BADGE_SOURCE_CODE,
} from "./ids-badge.developer-usage";

const meta: Meta = {
  title: "Spec Generated/IDS/Badge",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: { component: BADGE_DOCS_DESCRIPTION },
      source: { code: BADGE_SOURCE_CODE, language: "html" },
    },
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
  args: {
    value: 8,
    type: "default",
    ariaLabel: "",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma Badge set `11446:99238` / Default `11446:99237`. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-badge
      .value=${args.value}
      type=${args.type}
      ariaLabel=${args.ariaLabel || ""}
    ></ids-badge>
  `,
};

export const Types: Story = {
  name: "Types",
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <ids-badge .value=${1} type="default"></ids-badge>
      <ids-badge .value=${4} type="critical"></ids-badge>
      <ids-badge .value=${12} type="warning"></ids-badge>
      <ids-badge .value=${7} type="disabled"></ids-badge>
      <ids-badge .value=${99} type="success"></ids-badge>
    </div>
  `,
};

export const ContentSizing: Story = {
  name: "Content Sizing",
  render: () => html`
    <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap">
      <ids-badge .value=${1} type="default"></ids-badge>
      <ids-badge .value=${12} type="default"></ids-badge>
      <ids-badge .value=${128} type="default"></ids-badge>
      <ids-badge
        .value=${999}
        type="default"
        ariaLabel="999 notifications"
      ></ids-badge>
      <ids-badge
        .value=${1250}
        type="critical"
        ariaLabel="1250 notifications"
      ></ids-badge>
    </div>
  `,
};

/** Showcase-only Blue | White/Gray surfaces — not a Badge runtime axis. */
export const BackgroundShowcase: Story = {
  name: "Background Showcase",
  render: () => html`
    <div style="display: grid; gap: 12px">
      <div
        style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; padding: 12px; border-radius: 6px; background: var(--color-background-brand-base)"
      >
        <ids-badge .value=${3} type="default"></ids-badge>
        <ids-badge .value=${8} type="critical"></ids-badge>
        <ids-badge .value=${12} type="warning"></ids-badge>
      </div>
      <div
        style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap; padding: 12px; border-radius: 6px; background: var(--color-background-surface-primary); border: 1px solid var(--color-border-gray-neutral-light); --ids-badge-warning-border-color: var(--color-border-alerting-minor-base)"
      >
        <ids-badge .value=${3} type="default"></ids-badge>
        <ids-badge .value=${8} type="critical"></ids-badge>
        <ids-badge .value=${12} type="warning"></ids-badge>
      </div>
    </div>
  `,
};
