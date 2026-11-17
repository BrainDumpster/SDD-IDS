/**
 * Storybook: IDS Lit Breadcrumb from `lib/lit/ids/breadcrumb`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/breadcrumb/design-spec.md
 * API: storybook/src/components/IdsBreadcrumb.tsx
 *      (lib/react/ids/breadcrumb does not exist)
 * Examples: storybook/src/components/IdsBreadcrumb.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/breadcrumb/register.js";
import "@ids/core/button/register.js";
import {
  BREADCRUMB_DOCS_DESCRIPTION,
  BREADCRUMB_SOURCE_CODE,
} from "./ids-breadcrumb.developer-usage";

const DEFAULT_ITEMS = [
  { label: "Breadcrumb 1", href: "#" },
  { label: "Breadcrumb 2", href: "#" },
  { label: "Breadcrumb 3", href: "#" },
  { label: "Breadcrumb 4", href: "#" },
];

const resizeBox = (content: unknown) => html`
  <div
    style="
      position: relative;
      resize: both;
      overflow: auto;
      max-width: 100%;
      min-width: 200px;
      padding: 16px;
      border: 1px dashed var(--color-border-gray-neutral-base, #757575);
      border-radius: 4px;
    "
  >
    <ids-button style="position: absolute; top: 8px; right: 8px;"
      >Action</ids-button
    >
    ${content}
  </div>
`;

const meta: Meta = {
  title: "Spec Generated/IDS/Breadcrumb",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: BREADCRUMB_DOCS_DESCRIPTION },
      source: { code: BREADCRUMB_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    items: { control: "object" },
    currentPage: { control: "text" },
    maxVisibleItems: { control: "number" },
  },
  args: {
    items: DEFAULT_ITEMS,
    currentPage: "Current Page",
    maxVisibleItems: 3,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma Two lines Number=4 `11067:56646` (with default maxVisibleItems truncates at 4). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: DEFAULT_ITEMS,
    currentPage: "Current Page",
    maxVisibleItems: 4,
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      maxvisibleitems=${args.maxVisibleItems}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const Default: Story = {
  name: "Default",
  render: (args) =>
    resizeBox(html`
      <ids-breadcrumb
        currentpage=${args.currentPage ?? ""}
        maxvisibleitems=${args.maxVisibleItems}
        .items=${args.items}
      ></ids-breadcrumb>
    `),
};

export const Truncation: Story = {
  name: "Truncation",
  args: {
    items: [
      {
        label:
          "This is an extremely long breadcrumb label that should be truncated",
        href: "#",
      },
      {
        label:
          "Another very long label for testing overflow behavior with long text",
        href: "#",
      },
      { label: "Short", href: "#" },
      { label: "Current", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) =>
    resizeBox(html`
      <ids-breadcrumb
        currentpage=${args.currentPage ?? ""}
        maxvisibleitems=${args.maxVisibleItems}
        .items=${args.items}
      ></ids-breadcrumb>
    `),
};

export const MixedLengths: Story = {
  name: "Mixed Lengths",
  args: {
    items: [
      {
        label:
          "This breadcrumb is exactly seventy characters in the total length now!",
        href: "#",
      },
      { label: "Thirty character breadcrumb!!!", href: "#" },
      { label: "Fifteen chars!!", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) =>
    resizeBox(html`
      <ids-breadcrumb
        currentpage=${args.currentPage ?? ""}
        maxvisibleitems=${args.maxVisibleItems}
        .items=${args.items}
      ></ids-breadcrumb>
    `),
};

export const OneItem: Story = {
  name: "One Item",
  args: {
    items: [{ label: "Breadcrumb 1", href: "#" }],
    currentPage: "Current Page",
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const TwoItems: Story = {
  name: "Two Items",
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const ThreeItems: Story = {
  name: "Three Items",
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
    ],
    currentPage: "Current Page",
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const FourItems: Story = {
  name: "Four Items",
  args: {
    items: DEFAULT_ITEMS,
    currentPage: "Current Page",
    maxVisibleItems: 4,
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      maxvisibleitems=${args.maxVisibleItems}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const TruncatedWithOverflow: Story = {
  name: "Truncated With Overflow",
  args: {
    items: [
      { label: "Breadcrumb 1", href: "#" },
      { label: "Breadcrumb 2", href: "#" },
      { label: "Breadcrumb 3", href: "#" },
      { label: "Breadcrumb 4", href: "#" },
      { label: "Breadcrumb 5", href: "#" },
    ],
    currentPage: "Current Page",
    maxVisibleItems: 3,
  },
  render: (args) => html`
    <ids-breadcrumb
      currentpage=${args.currentPage ?? ""}
      maxvisibleitems=${args.maxVisibleItems}
      .items=${args.items}
    ></ids-breadcrumb>
  `,
};

export const VariantsMatrix: Story = {
  name: "Variants Matrix",
  render: () => html`
    <div style="display: grid; gap: 32px;">
      <div>
        <h3>1 Item</h3>
        <ids-breadcrumb
          currentpage="Current Page"
          .items=${[{ label: "Breadcrumb 1", href: "#" }]}
        ></ids-breadcrumb>
      </div>
      <div>
        <h3>2 Items</h3>
        <ids-breadcrumb
          currentpage="Current Page"
          .items=${[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
          ]}
        ></ids-breadcrumb>
      </div>
      <div>
        <h3>3 Items</h3>
        <ids-breadcrumb
          currentpage="Current Page"
          .items=${[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
          ]}
        ></ids-breadcrumb>
      </div>
      <div>
        <h3>4 Items (no overflow)</h3>
        <ids-breadcrumb
          currentpage="Current Page"
          maxvisibleitems=${4}
          .items=${DEFAULT_ITEMS}
        ></ids-breadcrumb>
      </div>
      <div>
        <h3>5 Items (overflow)</h3>
        <ids-breadcrumb
          currentpage="Current Page"
          .items=${[
            { label: "Breadcrumb 1", href: "#" },
            { label: "Breadcrumb 2", href: "#" },
            { label: "Breadcrumb 3", href: "#" },
            { label: "Breadcrumb 4", href: "#" },
            { label: "Breadcrumb 5", href: "#" },
          ]}
        ></ids-breadcrumb>
      </div>
    </div>
  `,
};
