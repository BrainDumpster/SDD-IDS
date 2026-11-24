/**
 * Storybook: IDS Lit Tooltip from `lib/lit/ids/tooltip`
 * Spec: components/ids/tooltip/design-spec.md
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/tooltip/register.js";
import "@ids/core/badge/register.js";

const meta: Meta = {
  title: "Spec Generated/IDS/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma Tooltip-Main `38201:109592` (side top / hug). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: () => html`
    <ids-tooltip hugcontent side="top">
      <ids-tooltip-trigger>
        <button type="button">Hover me</button>
      </ids-tooltip-trigger>
      <ids-tooltip-panel>
        <ids-tooltip-body>Tooltip body content</ids-tooltip-body>
      </ids-tooltip-panel>
    </ids-tooltip>
  `,
};

/** Closable — `ids-tooltip-close` is an IDS Icon Button (ghost neutral · small) docked top-right. */
export const Closable: Story = {
  name: "Closable",
  render: () => html`
    <ids-tooltip closable hugcontent side="top">
      <ids-tooltip-trigger>
        <button type="button">Hover me</button>
      </ids-tooltip-trigger>
      <ids-tooltip-panel>
        <ids-tooltip-header>Tooltip Title</ids-tooltip-header>
        <ids-tooltip-body>Tooltip body content</ids-tooltip-body>
        <ids-tooltip-close></ids-tooltip-close>
      </ids-tooltip-panel>
    </ids-tooltip>
  `,
};

export const WithBadgeOverflow: Story = {
  name: "With Badge Overflow",
  render: () => html`
    <div style="display: flex; gap: 16px; align-items: center; padding: 48px">
      <ids-badge .value=${1250} type="default"></ids-badge>
      <span style="font-size: 12px; color: var(--color-text-gray-neutral)"
        >Hover the badge — shows full value in hugContent tooltip</span
      >
    </div>
  `,
};
