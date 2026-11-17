/**
 * Storybook: IDS Lit Anchor Menu from `lib/lit/ids/anchor-menu`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/anchor-menu/design-spec.md
 * API: lib/react/ids/anchor-menu
 * Examples: storybook/src/components/IdsAnchorMenu.stories.tsx
 *           storybook/src/components/lib-generated/AnchorMenu.stories.tsx
 *
 * Live Figma: VZJ48bbVYrIynw8DdSukWw — Example `11955:229709`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "@ids/core/anchor-menu/register.js";
import {
  ANCHOR_MENU_SPEC_DEMO_ITEMS,
  type IdsAnchorMenuItem,
} from "@ids/core/anchor-menu";
import {
  ANCHOR_MENU_DOCS_DESCRIPTION,
  ANCHOR_MENU_SOURCE_CODE,
} from "./ids-anchor-menu.developer-usage";

/** Figma `AnchorMenu-Example` (`11955:229709`) — first section selected. */
const specAccurateItems: IdsAnchorMenuItem[] = [
  ...ANCHOR_MENU_SPEC_DEMO_ITEMS,
];

const onItemClick = (event: Event) => {
  const detail = (event as CustomEvent<{ href: string }>).detail;
  console.log("ids-item-click", detail?.href);
};

const meta: Meta = {
  title: "Spec Generated/IDS/Anchor Menu",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: ANCHOR_MENU_DOCS_DESCRIPTION },
      source: { code: ANCHOR_MENU_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    items: { control: "object" },
    title: { control: "text" },
    header: { control: "boolean" },
    sticky: { control: "boolean" },
    scrollOffset: { control: "number" },
    nativeTooltip: { control: "boolean" },
  },
  args: {
    items: specAccurateItems,
    title: "On this page",
    header: false,
    sticky: true,
    scrollOffset: 24,
    nativeTooltip: false,
  },
};

export default meta;
type Story = StoryObj;

/** Spec Accurate Design — Figma `11955:229709` (header layer hidden). */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => html`
    <ids-anchor-menu
      title=${args.title}
      scrolloffset=${args.scrollOffset}
      ?nativetooltip=${args.nativeTooltip}
      .header=${args.header}
      .sticky=${args.sticky}
      .items=${args.items}
      @ids-item-click=${onItemClick}
    ></ids-anchor-menu>
  `,
};

export const HeaderVisible: Story = {
  name: "Header Visible",
  args: {
    header: true,
  },
  render: SpecAccurateDesign.render,
};

export const MiddleActive: Story = {
  name: "Middle Active",
  args: {
    items: specAccurateItems.map((item, index) => ({
      ...item,
      active: index === 2,
    })),
  },
  render: SpecAccurateDesign.render,
};

export const EmptyItems: Story = {
  name: "Empty Items",
  args: {
    items: [],
  },
  render: SpecAccurateDesign.render,
};

export const StickyWithPageContent: Story = {
  name: "Sticky With Page Content",
  parameters: { layout: "fullscreen" },
  render: (args) => html`
    <div
      style="
        display: flex;
        gap: 32px;
        padding: 24px;
        align-items: flex-start;
        background: var(--color-background-surface-primary);
        min-height: 200vh;
      "
    >
      <div
        style="
          flex: 1;
          color: var(--color-text-gray-neutral-strong);
          padding-bottom: 100vh;
        "
      >
        ${specAccurateItems.map(
          (item) => html`
            <section
              id=${item.href.replace("#", "")}
              style="margin-bottom: 160px; min-height: 120px;"
            >
              <h2 style="margin: 0;">${item.label}</h2>
              <p style="color: var(--color-text-gray-neutral);">
                Section content for scroll-spy and smooth scroll.
              </p>
            </section>
          `,
        )}
      </div>
      <ids-anchor-menu
        title=${args.title}
        scrolloffset=${args.scrollOffset}
        ?nativetooltip=${args.nativeTooltip}
        .header=${args.header}
        .sticky=${args.sticky}
        .items=${args.items}
        @ids-item-click=${onItemClick}
      ></ids-anchor-menu>
    </div>
  `,
};

const longLabelItems: IdsAnchorMenuItem[] = [
  { label: "Overview", href: "#overview" },
  {
    label: "Types and classifications of anchor menu patterns",
    href: "#types",
  },
  {
    label:
      "A deliberately extremely long anchor menu section title that overflows the two-line clamp and shows an ellipsis on the third line",
    href: "#anatomy",
    active: true,
  },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
];

export const LongLabel: Story = {
  name: "Long Label",
  args: {
    items: longLabelItems,
  },
  render: SpecAccurateDesign.render,
};

export const LongHeader: Story = {
  name: "Long Header",
  args: {
    header: true,
    title:
      "On this deliberately long page section heading that overflows two lines and truncates",
  },
  render: SpecAccurateDesign.render,
};

export const RightRailLongLabel: Story = {
  name: "Right Rail (Long Label)",
  args: {
    items: longLabelItems,
  },
  render: (args) => html`
    <div
      style="
        display: flex;
        gap: 32px;
        padding: 24px;
        align-items: flex-start;
        justify-content: flex-end;
        background: var(--color-background-surface-primary);
      "
    >
      <div style="flex: 1; color: var(--color-text-gray-neutral-strong);">
        Page content on the left; anchor menu pinned to the right edge.
      </div>
      <ids-anchor-menu
        title=${args.title}
        scrolloffset=${args.scrollOffset}
        ?nativetooltip=${args.nativeTooltip}
        .header=${args.header}
        .sticky=${args.sticky}
        .items=${args.items}
        @ids-item-click=${onItemClick}
      ></ids-anchor-menu>
    </div>
  `,
};

const manySectionItems: IdsAnchorMenuItem[] = Array.from(
  { length: 16 },
  (_, i) => ({
    label: `Section ${i + 1}`,
    href: `#section-${i + 1}`,
    active: i === 0,
  }),
);

export const ManySections: Story = {
  name: "Many Sections",
  parameters: { layout: "fullscreen" },
  args: {
    items: manySectionItems,
  },
  render: (args) => html`
    <div
      style="
        display: flex;
        gap: 32px;
        padding: 24px;
        align-items: flex-start;
        background: var(--color-background-surface-primary);
      "
    >
      <div
        style="
          flex: 1;
          color: var(--color-text-gray-neutral-strong);
          padding-bottom: 100vh;
        "
      >
        ${manySectionItems.map(
          (item) => html`
            <section
              id=${item.href.replace("#", "")}
              style="margin-bottom: 120px; min-height: 120px;"
            >
              <h2 style="margin: 0;">${item.label}</h2>
              <p style="color: var(--color-text-gray-neutral);">
                Section content for scroll-spy and smooth scroll.
              </p>
            </section>
          `,
        )}
      </div>
      <ids-anchor-menu
        title=${args.title}
        scrolloffset=${args.scrollOffset}
        ?nativetooltip=${args.nativeTooltip}
        .header=${args.header}
        .sticky=${args.sticky}
        .items=${manySectionItems}
        @ids-item-click=${onItemClick}
      ></ids-anchor-menu>
    </div>
  `,
};
