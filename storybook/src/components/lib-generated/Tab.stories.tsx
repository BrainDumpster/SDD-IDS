/**
 * Storybook: design-spec–generated Tab from `lib/react/ids/tab`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/tab/design-spec.md
 *
 * Nested hierarchy (Ids-prefixed):
 * IdsTabs → IdsTab (repeatable) → IdsTabButton / IdsTabContent
 *
 * CSS selectors: ids-tabs, ids-tab-button, ids-tab-content, …
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsTab,
  IdsTabButton,
  IdsTabContent,
  IdsTabs,
  type IdsTabItemInput,
  type IdsTabsProps,
} from "../../../../lib/react/ids/tab";

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
  { id: "integrations", label: "Integrations", content: "Integrations content." },
  { id: "policies", label: "Policies", content: "Policies content." },
];

const meta: Meta<IdsTabsProps> = {
  title: "Components/IDS/Tab",
  component: IdsTabs,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Tab from `components/ids/tab/design-spec.md`. " +
          "Composition: IdsTabs → IdsTab → IdsTabButton / IdsTabContent. " +
          "Selectors: `ids-tabs`, `ids-tab-button`, `ids-tab-content`. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
      },
    },
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
  argTypes: {
    type: { control: "select", options: ["primary", "secondary"] },
    variant: { control: "select", options: ["primary", "secondary"] },
    surface: { control: "select", options: ["elevated", "transparent"] },
    allowAddTab: { control: "boolean" },
    overflow: { control: "boolean" },
    addTabLabel: { control: "text" },
    moreLabel: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<IdsTabsProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    type: "secondary",
    items: baseItems,
    defaultActiveItemId: "overview",
  },
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => (
    <IdsTabs type="secondary" defaultActiveItemId="overview">
      <IdsTab id="overview">
        <IdsTabButton>Overview</IdsTabButton>
        <IdsTabContent>Overview tab content area.</IdsTabContent>
      </IdsTab>
      <IdsTab id="security" iconSlug="shield-encrypt-alt">
        <IdsTabButton>Security</IdsTabButton>
        <IdsTabContent>Security tab content area.</IdsTabContent>
      </IdsTab>
      <IdsTab id="alerts">
        <IdsTabButton>Alerts</IdsTabButton>
        <IdsTabContent>Alerts tab content area with related data.</IdsTabContent>
      </IdsTab>
    </IdsTabs>
  ),
};

export const PrimaryVariant: Story = {
  args: {
    type: "primary",
    items: baseItems,
  },
};

export const TransparentOnGray: Story = {
  args: {
    type: "secondary",
    surface: "transparent",
    items: baseItems,
  },
  render: (args) => (
    <div
      style={{
        maxWidth: 720,
        padding: 16,
        background: "var(--color-background-gray-light)",
      }}
    >
      <IdsTabs {...args} />
    </div>
  ),
};

export const OverflowResponsive: Story = {
  args: {
    items: overflowItems,
    type: "secondary",
    allowAddTab: false,
    overflow: true,
  },
  render: (args) => (
    <div style={{ maxWidth: 560 }}>
      <IdsTabs {...args} />
    </div>
  ),
};

export const AddTabDynamic: Story = {
  render: () => {
    const [items, setItems] = useState(overflowItems.slice(0, 4));

    return (
      <div style={{ maxWidth: 700 }}>
        <IdsTabs
          items={items}
          type="secondary"
          allowAddTab
          addTabLabel="Add Tab"
          onItemsChange={setItems}
          onAddTab={() => {
            const nextIndex = items.length + 1;
            const id = `new-${nextIndex}`;
            setItems((prev) => [
              ...prev,
              {
                id,
                label: `Tab ${nextIndex}`,
                content: `Dynamic tab content for Tab ${nextIndex}.`,
              },
            ]);
          }}
        />
      </div>
    );
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
    const [items, setItems] = useState(args.items ?? []);
    return (
      <IdsTabs
        {...args}
        items={items}
        onItemsChange={setItems}
      />
    );
  },
};
