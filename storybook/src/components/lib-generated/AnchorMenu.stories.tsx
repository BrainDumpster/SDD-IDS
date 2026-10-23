/**
 * Storybook: design-spec–generated Anchor Menu from `lib/react/ids/anchor-menu`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy / Codegen slots:
 *   AnchorMenuRoot → AnchorMenuHeader? → AnchorMenuItem[] (+ AnchorActiveIndicator)
 *
 * Composition & API: items, title?, header?, sticky?, onItemClick?
 * Theme: components/ids-theme.css
 * Spec: components/ids/anchor-menu/design-spec.md
 */
import React, { type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  ANCHOR_MENU_DOCS_DESCRIPTION,
  ANCHOR_MENU_SOURCE_CODE,
} from "./ids-anchor-menu.developer-usage";
import {
  IdsAnchorMenu,
  type IdsAnchorMenuItem,
} from "@ids/react/anchor-menu";

const DESIGN_SPEC_PATH = "components/ids/anchor-menu/design-spec.md";

/** Figma `AnchorMenu-Example` (`11955:229709`) — first section selected. */
const specAccurateItems: IdsAnchorMenuItem[] = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Types", href: "#types" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
];

const onItemClick = (href: string) => {
  console.log("onItemClick", href);
};

const specAccurateArgs: ComponentProps<typeof IdsAnchorMenu> = {
  items: specAccurateItems,
  title: "On this page",
  header: true,
  sticky: true,
  nativeTooltip: false,
  onItemClick,
};

const meta: Meta<typeof IdsAnchorMenu> = {
  tags: ["autodocs"],
  title: "Components/IDS/Anchor Menu",
  component: IdsAnchorMenu,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: ANCHOR_MENU_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: ANCHOR_MENU_SOURCE_CODE,
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    nativeTooltip: {
      control: { type: "boolean" },
      description:
        "Reveal truncated labels with the browser's native `title` tooltip instead of the branded `IdsTooltip`.",
      table: { defaultValue: { summary: "false" } },
    },
  },
};

export default meta;
type Story = StoryObj<typeof IdsAnchorMenu>;

/** Spec Accurate Design — Figma example labels, first item active, default API. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: specAccurateArgs,
};

export const HeaderHidden: Story = {
  args: {
    ...specAccurateArgs,
    header: false,
  },
};

export const MiddleActive: Story = {
  args: {
    ...specAccurateArgs,
    items: specAccurateItems.map((item, index) => ({
      ...item,
      active: index === 2,
    })),
  },
};

export const EmptyItems: Story = {
  args: {
    ...specAccurateArgs,
    items: [],
  },
};

export const StickyWithPageContent: Story = {
  name: "Sticky With Page Content",
  // Full-bleed so the content and menu both start at the 24px padding — which
  // equals the sticky top — so the menu is pinned from the very first pixel and
  // doesn't visibly settle upward on the first scroll.
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 32,
        padding: 24,
        alignItems: "flex-start",
        background: "var(--color-background-surface-primary)",
        minHeight: "200vh",
      }}
    >
      <div
        style={{
          flex: 1,
          color: "var(--color-text-gray-neutral-strong)",
          // Trailing space so the final sections have room to scroll up to the
          // same top offset as the rest instead of stopping short at page end.
          paddingBottom: "100vh",
        }}
      >
        {specAccurateItems.map((item) => (
          <section
            key={item.href}
            id={item.href.replace("#", "")}
            style={{ marginBottom: 160, minHeight: 120 }}
          >
            <h2 style={{ margin: 0 }}>{item.label}</h2>
            <p style={{ color: "var(--color-text-gray-neutral)" }}>
              Section content for scroll-spy and smooth scroll.
            </p>
          </section>
        ))}
      </div>
      <IdsAnchorMenu {...args} />
    </div>
  ),
  args: specAccurateArgs,
};

const longLabelItems = [
  { label: "Overview", href: "#overview" },
  { label: "Types and classifications of anchor menu patterns", href: "#types" },
  { label: "A deliberately extremely long anchor menu section title that overflows the two-line clamp and shows an ellipsis on the third line", href: "#anatomy", active: true },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
];

export const LongLabel: Story = {
  name: "Long Label",
  args: {
    items: longLabelItems,
  },
};

/**
 * Long header: the heading grows to the rail's max width and wraps to a second
 * line; anything past two lines truncates with an ellipsis and reveals the full
 * text in a tooltip on hover.
 */
export const LongHeader: Story = {
  name: "Long Header",
  args: {
    ...specAccurateArgs,
    title:
      "On this deliberately long page section heading that overflows two lines and truncates",
  },
};

/**
 * Menu on a right-hand rail: the IdsTooltip auto-flips to `side="left"` so it
 * opens toward the page instead of overflowing off the right edge.
 */
export const RightRailLongLabel: Story = {
  name: "Right Rail (Long Label)",
  args: {
    items: longLabelItems,
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 32,
        padding: 24,
        alignItems: "flex-start",
        justifyContent: "flex-end",
        background: "var(--color-background-surface-primary)",
      }}
    >
      <div style={{ flex: 1, color: "var(--color-text-gray-neutral-strong)" }}>
        Page content on the left; anchor menu pinned to the right edge.
      </div>
      <IdsAnchorMenu {...args} />
    </div>
  ),
};

/** Figma `AnchorMenu-Main` allows 3–16 sections — the upper bound. */
const manySectionItems: IdsAnchorMenuItem[] = Array.from(
  { length: 16 },
  (_, i) => ({
    label: `Section ${i + 1}`,
    href: `#section-${i + 1}`,
    active: i === 0,
  }),
);

/**
 * Many sections (16 — the Figma upper bound). When the menu is taller than the
 * viewport it scrolls internally (its own scrollbar) so every item stays
 * reachable, while still pinning below the top and scroll-spying page content.
 */
export const ManySections: Story = {
  name: "Many Sections",
  parameters: { layout: "fullscreen" },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: 32,
        padding: 24,
        alignItems: "flex-start",
        background: "var(--color-background-surface-primary)",
      }}
    >
      <div
        style={{
          flex: 1,
          color: "var(--color-text-gray-neutral-strong)",
          paddingBottom: "100vh",
        }}
      >
        {manySectionItems.map((item) => (
          <section
            key={item.href}
            id={item.href.replace("#", "")}
            style={{ marginBottom: 120, minHeight: 120 }}
          >
            <h2 style={{ margin: 0 }}>{item.label}</h2>
            <p style={{ color: "var(--color-text-gray-neutral)" }}>
              Section content for scroll-spy and smooth scroll.
            </p>
          </section>
        ))}
      </div>
      <IdsAnchorMenu {...args} items={manySectionItems} />
    </div>
  ),
  args: {
    ...specAccurateArgs,
    items: manySectionItems,
  },
};
