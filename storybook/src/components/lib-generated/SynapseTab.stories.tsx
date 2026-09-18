/**
 * Storybook: design-spec–generated Tab from `lib/react/synapse/tab`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/tab/design-spec.md
 *
 * Nested hierarchy (Ids-prefixed):
 * SynapseTabs → SynapseTab (repeatable) → SynapseTabButton / SynapseTabContent
 *
 * CSS selectors: synapse-tabs, synapse-tab-button, synapse-tab-content, …
 */
import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TAB_DOCS_DESCRIPTION,
  SYNAPSE_TAB_SOURCE_CODE,
} from "./synapse-tab.developer-usage";
import {
  SynapseTab,
  SynapseTabButton,
  SynapseTabContent,
  SynapseTabs,
  type SynapseTabItemInput,
  type SynapseTabsProps,
} from "@synapse/react/tab";

const baseItems: SynapseTabItemInput[] = [
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

const overflowItems: SynapseTabItemInput[] = [
  { id: "summary", label: "Summary", content: "Summary content." },
  { id: "details", label: "Details", content: "Details content." },
  { id: "settings", label: "Settings", content: "Settings content." },
  { id: "activity", label: "Activity", content: "Activity content." },
  { id: "audit", label: "Audit Trail", content: "Audit trail content." },
  { id: "integrations", label: "Integrations", content: "Integrations content." },
  { id: "policies", label: "Policies", content: "Policies content." },
];

const meta: Meta<SynapseTabsProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Tab",
  component: SynapseTabs,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TAB_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TAB_SOURCE_CODE,
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
type Story = StoryObj<SynapseTabsProps>;

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
    <SynapseTabs type="secondary" defaultActiveItemId="overview">
      <SynapseTab id="overview">
        <SynapseTabButton>Overview</SynapseTabButton>
        <SynapseTabContent>Overview tab content area.</SynapseTabContent>
      </SynapseTab>
      <SynapseTab id="security" iconSlug="shield-encrypt-alt">
        <SynapseTabButton>Security</SynapseTabButton>
        <SynapseTabContent>Security tab content area.</SynapseTabContent>
      </SynapseTab>
      <SynapseTab id="alerts">
        <SynapseTabButton>Alerts</SynapseTabButton>
        <SynapseTabContent>Alerts tab content area with related data.</SynapseTabContent>
      </SynapseTab>
    </SynapseTabs>
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
      <SynapseTabs {...args} />
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
      <SynapseTabs {...args} />
    </div>
  ),
};

export const AddTabDynamic: Story = {
  render: () => {
    const [items, setItems] = useState(overflowItems.slice(0, 4));

    return (
      <div style={{ maxWidth: 700 }}>
        <SynapseTabs
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
      <SynapseTabs
        {...args}
        items={items}
        onItemsChange={setItems}
      />
    );
  },
};
