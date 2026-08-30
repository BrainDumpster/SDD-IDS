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
