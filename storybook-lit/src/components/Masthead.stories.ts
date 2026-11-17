/**
 * Storybook: IDS Lit Masthead from `lib/lit/ids/masthead`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/masthead/design-spec.md
 * API: lib/react/ids/masthead · storybook/src/components/lib-generated/Masthead.stories.tsx
 *
 * Live Figma verified (file `0bHk3XhrjFhowgFkz9yLr4`):
 *   Masthead-Main `10130:29493`
 *   Product Icon=No `10130:29494` · Yes `10130:29512`
 *   User Initials `10130:29944`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/masthead/register.js";
import "@ids/core/icon/register.js";
import "@ids/core/app-launcher/register.js";
import type { IdsAppLauncherProduct } from "@ids/core/app-launcher";
import {
  MASTHEAD_DOCS_DESCRIPTION,
  MASTHEAD_SOURCE_CODE,
} from "./ids-masthead.developer-usage";

type MastheadArgs = {
  productName: string;
};

const sampleProducts: IdsAppLauncherProduct[] = [
  { id: "p1", name: "Product Name 1" },
  { id: "p2", name: "Product Name 2" },
];

const productLogo = html`
  <ids-icon
    slot="logo"
    shape="appic-dp-cloud-blue"
    variant="img"
    size="32"
    title="Product logo"
  ></ids-icon>
`;

/** Figma reference sample for icons slot — Storybook only; not a runtime default. */
const figmaSampleIcons = html`
  <ids-masthead-action-button-container slot="icons">
    <ids-masthead-action-icon-button
      arialabel="Search"
      iconslug="search-16"
    ></ids-masthead-action-icon-button>
    <ids-masthead-action-icon-button
      arialabel="Alerts, 3 unread"
      iconslug="alert-bell-16"
      badgecount="3"
      badgetype="critical"
    ></ids-masthead-action-icon-button>
    <ids-masthead-action-icon-button
      arialabel="Jobs queue, 2 active"
      iconslug="jobs-queue-stack"
      badgecount="2"
      badgetype="success"
    ></ids-masthead-action-icon-button>
    <ids-masthead-action-icon-button
      arialabel="Settings"
      iconslug="setting-gear-16"
    ></ids-masthead-action-icon-button>
    <ids-masthead-action-icon-button
      arialabel="Help"
      iconslug="help-circ-16"
    ></ids-masthead-action-icon-button>
  </ids-masthead-action-button-container>
`;

const sampleAppLauncher = html`
  <ids-app-launcher
    slot="app-launcher"
    triggervariant="masthead"
    sideoffset="0"
    .products=${sampleProducts}
  ></ids-app-launcher>
`;

const sampleAvatar = html`
  <ids-masthead-avatar
    slot="avatar"
    initials="DT"
    arialabel="User settings"
  ></ids-masthead-avatar>
`;

const meta: Meta<MastheadArgs> = {
  title: "Spec Generated/IDS/Masthead",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: { component: MASTHEAD_DOCS_DESCRIPTION },
      source: { code: MASTHEAD_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    productName: { control: "text" },
  },
  args: {
    productName: "Product Name",
  },
};

export default meta;
type Story = StoryObj<MastheadArgs>;

/** Figma `Product Icon=No` — `10130:29494` — product name only. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-masthead productname=${args.productName ?? "Product Name"}></ids-masthead>
  `,
};

export const ConvenienceProductNameOnly: Story = {
  name: "Convenience Product Name Only",
  render: () => html`<ids-masthead productname="Product Name"></ids-masthead>`,
};

/** Figma `Show Product Icon=Yes` — `10130:29512`. */
export const WithProductLogo: Story = {
  render: () => html`
    <ids-masthead productname="Product Name">${productLogo}</ids-masthead>
  `,
};

export const WithFigmaSampleActions: Story = {
  name: "With Figma sample actions",
  render: () => html`
    <ids-masthead productname="Product Name">${figmaSampleIcons}</ids-masthead>
  `,
};

export const WithAppLauncher: Story = {
  render: () => html`
    <ids-masthead productname="Product Name">${sampleAppLauncher}</ids-masthead>
  `,
};

export const WithAvatarInitials: Story = {
  render: () => html`
    <ids-masthead productname="Product Name">${sampleAvatar}</ids-masthead>
  `,
};

/** Figma `User Settings=Icon` (`user-single` 16×16). */
export const UserIconAvatar: Story = {
  render: () => html`
    <ids-masthead productname="Product Name">
      <ids-masthead-avatar
        slot="avatar"
        iconslug="user-single"
        arialabel="User settings"
      ></ids-masthead-avatar>
    </ids-masthead>
  `,
};

/** Full host composition — all optional slots supplied by the consumer. */
export const FullHostComposition: Story = {
  name: "Full host composition",
  render: () => html`
    <ids-masthead productname="Product Name">
      ${productLogo} ${figmaSampleIcons} ${sampleAppLauncher} ${sampleAvatar}
    </ids-masthead>
  `,
};

export const LongProductNameTooltip: Story = {
  name: "Long product name tooltip",
  render: () => html`
    <ids-masthead
      productname="Very Long Product Name That Exceeds Forty Five Characters For Tooltip"
    ></ids-masthead>
  `,
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => html`
    <ids-masthead productname="Product Name">
      ${productLogo} ${figmaSampleIcons} ${sampleAppLauncher} ${sampleAvatar}
    </ids-masthead>
  `,
};
