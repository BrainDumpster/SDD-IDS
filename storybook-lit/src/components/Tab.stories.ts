/**
 * Storybook: IDS Lit Tab from `lib/lit/ids/tab`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/tab/design-spec.md
 * API: lib/react/ids/tab
 * Examples: storybook/src/components/lib-generated/Tab.stories.tsx
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { useArgs } from "@storybook/preview-api";
import "@ids/core/tab/register.js";
import type { IdsTabItemInput } from "@ids/core/tab";
import {
  TAB_DOCS_DESCRIPTION,
  TAB_SOURCE_CODE,
} from "./ids-tab.developer-usage";

const baseItems: IdsTabItemInput[] = [
  {
    id: "overview",
    label: "Overview",
    content: "Overview tab content area.",
  },
  {
    id: "security",
    label: "Security",
    content: "Security tab content area.",
    iconSlug: "shield-encrypt-alt",
  },
  {
    id: "alerts",
    label: "Alerts",
    content: "Alerts tab content area with related data.",
  },
];

const overflowItems: IdsTabItemInput[] = [
  { id: "summary", label: "Summary", content: "Summary content." },
  { id: "details", label: "Details", content: "Details content." },
  { id: "settings", label: "Settings", content: "Settings content." },
  { id: "activity", label: "Activity", content: "Activity content." },
  { id: "audit", label: "Audit Trail", content: "Audit trail content." },
  {
    id: "integrations",
    label: "Integrations",
    content: "Integrations content.",
  },
  { id: "policies", label: "Policies", content: "Policies content." },
];

type TabArgs = {
  items: IdsTabItemInput[];
  type: "primary" | "secondary";
  surface: "elevated" | "transparent";
  allowAddTab: boolean;
  addTabLabel: string;
  overflow: boolean;
  moreLabel: string;
  defaultActiveItemId: string;
};

function renderTabs(
  args: TabArgs,
  overrides: Partial<{
    items: IdsTabItemInput[];
    onAddTab?: () => void;
    onItemsChange?: (items: IdsTabItemInput[]) => void;
  }> = {},
) {
  const items = overrides.items ?? args.items;
  return html`
    <ids-tabs
      .items=${items}
      type=${args.type}
      surface=${args.surface}
      ?allowaddtab=${args.allowAddTab}
      addtablabel=${args.addTabLabel}
      ?overflow=${args.overflow}
      morelabel=${args.moreLabel}
      defaultactiveitemid=${args.defaultActiveItemId}
      @add-tab=${() => overrides.onAddTab?.()}
      @items-change=${(e: CustomEvent<IdsTabItemInput[]>) =>
        overrides.onItemsChange?.(e.detail)}
    ></ids-tabs>
  `;
}

const meta: Meta<TabArgs> = {
  title: "Spec Generated/IDS/Tab",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: { component: TAB_DOCS_DESCRIPTION },
      source: { code: TAB_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    type: { control: "select", options: ["primary", "secondary"] },
    surface: { control: "select", options: ["elevated", "transparent"] },
    allowAddTab: { control: "boolean" },
    overflow: { control: "boolean" },
    addTabLabel: { control: "text" },
    moreLabel: { control: "text" },
    items: { control: false },
  },
  args: {
    items: baseItems,
    type: "secondary",
    surface: "elevated",
    allowAddTab: false,
    addTabLabel: "Add Tab",
    overflow: true,
    moreLabel: "More",
    defaultActiveItemId: "overview",
  },
};

export default meta;
type Story = StoryObj<TabArgs>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    type: "secondary",
    items: baseItems,
    defaultActiveItemId: "overview",
  },
  render: (args) => renderTabs(args),
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => html`
    <ids-tabs type="secondary" defaultactiveitemid="overview">
      <ids-tab id="overview">
        <ids-tab-button>Overview</ids-tab-button>
        <ids-tab-content>Overview tab content area.</ids-tab-content>
      </ids-tab>
      <ids-tab id="security" iconslug="shield-encrypt-alt">
        <ids-tab-button>Security</ids-tab-button>
        <ids-tab-content>Security tab content area.</ids-tab-content>
      </ids-tab>
      <ids-tab id="alerts">
        <ids-tab-button>Alerts</ids-tab-button>
        <ids-tab-content>Alerts tab content area with related data.</ids-tab-content>
      </ids-tab>
    </ids-tabs>
  `,
};

export const PrimaryVariant: Story = {
  args: {
    type: "primary",
    items: baseItems,
  },
  render: (args) => renderTabs(args),
};

export const TransparentOnGray: Story = {
  args: {
    type: "secondary",
    surface: "transparent",
    items: baseItems,
  },
  render: (args) => html`
    <div
      style="max-width: 720px; padding: 16px; background: var(--color-background-gray-light);"
    >
      ${renderTabs(args)}
    </div>
  `,
};

export const OverflowResponsive: Story = {
  args: {
    items: overflowItems,
    type: "secondary",
    allowAddTab: false,
    overflow: true,
  },
  render: (args) => html`
    <div style="max-width: 560px">${renderTabs(args)}</div>
  `,
};

export const AddTabDynamic: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();
    const items = (args.items?.length ? args.items : overflowItems.slice(0, 4)) as IdsTabItemInput[];

    return html`
      <div style="max-width: 700px">
        ${renderTabs(
          {
            ...args,
            type: "secondary",
            allowAddTab: true,
            addTabLabel: "Add Tab",
            items,
          },
          {
            items,
            onAddTab: () => {
              const nextIndex = items.length + 1;
              const id = `new-${nextIndex}`;
              const next = [
                ...items,
                {
                  id,
                  label: `Tab ${nextIndex}`,
                  content: `Dynamic tab content for Tab ${nextIndex}.`,
                },
              ];
              updateArgs({ items: next });
            },
            onItemsChange: (next) => updateArgs({ items: next }),
          },
        )}
      </div>
    `;
  },
  args: {
    items: overflowItems.slice(0, 4),
    allowAddTab: true,
  },
};

export const IconAndBadge: Story = {
  args: {
    type: "primary",
    items: [
      {
        id: "overview",
        label: "Overview",
        content: "Overview tab content area.",
        iconSlug: "shield-encrypt-alt",
        badgeCount: 5,
        closable: true,
      },
      {
        id: "security",
        label: "Security",
        content: "Security tab content area.",
        iconSlug: "shield-encrypt-alt",
        badgeCount: 3,
        closable: true,
      },
      {
        id: "alerts",
        label: "Alerts",
        content: "Alerts tab content area with related data.",
        iconSlug: "shield-encrypt-alt",
        badgeCount: 1,
        hasAlert: true,
        closable: true,
      },
      {
        id: "settings",
        label: "Settings",
        content: "Settings content area.",
        iconSlug: "shield-encrypt-alt",
        badgeCount: 0,
        closable: true,
      },
    ],
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return renderTabs(args, {
      onItemsChange: (next) => updateArgs({ items: next }),
    });
  },
};
