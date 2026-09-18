/**
 * Storybook: design-spec–generated Status Bar from `lib/react/synapse/status-bar`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Theme: components/synapse-theme.css
 * Spec: components/ids/status-bar/design-spec.md
 *
 * Nested hierarchy (Ids-prefixed, root = StatusBar not StatusBarRoot):
 * SynapseStatusBar → SynapseStatusBarTotalItem? → SynapseStatusBarContentViewport →
 * SynapseStatusBarItem[] → IconSlot / Value / Meta / Divider → OverflowLayer?
 *
 * CSS selectors: synapse-status-bar, synapse-status-bar-item, …
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_STATUS_BAR_DOCS_DESCRIPTION,
  SYNAPSE_STATUS_BAR_SOURCE_CODE,
} from "./synapse-status-bar.developer-usage";
import { SynapseIcon } from "@synapse/react/icon";
import {
  SynapseStatusBar,
  SynapseStatusBarContentViewport,
  SynapseStatusBarInventoryMainIcon,
  SynapseStatusBarInventoryStatusBadge,
  SynapseStatusBarItem,
  SynapseStatusBarItemDivider,
  SynapseStatusBarItemIconSlot,
  SynapseStatusBarItemMeta,
  SynapseStatusBarItemValue,
  SynapseStatusBarOverflowLayer,
  SynapseStatusBarOverflowLeft,
  SynapseStatusBarOverflowRight,
  SynapseStatusBarTotalItem,
  type SynapseStatusBarItemInput,
  type SynapseStatusBarProps,
} from "@synapse/react/status-bar";

const longItems: SynapseStatusBarItemInput[] = [
  { id: "critical", value: 10, category: "<Category>", label: "Critical", severity: "critical" },
  { id: "warning", value: 10, category: "<Category>", label: "Warning", severity: "warning" },
  { id: "success", value: 10, category: "<Category>", label: "Success", severity: "success" },
  { id: "in-progress", value: 10, category: "<Category>", label: "In Progress", severity: "in-progress" },
  { id: "scheduled", value: 10, category: "<Category>", label: "Scheduled", severity: "scheduled" },
  { id: "canceling", value: 10, category: "<Category>", label: "Canceling", severity: "canceling" },
  { id: "canceled", value: 10, category: "<Category>", label: "Canceled", severity: "canceled" },
  { id: "skipped", value: 10, category: "<Category>", label: "Skipped", severity: "skipped" },
  { id: "unknown", value: 10, category: "<Category>", label: "Unknown", severity: "unknown" },
];

const meta: Meta<SynapseStatusBarProps> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Status Bar",
  component: SynapseStatusBar,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_STATUS_BAR_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_STATUS_BAR_SOURCE_CODE,
      },
    },
  },
  args: {
    type: "status-large",
    total: 90,
    totalCategory: "Alerts",
    totalLabel: "Total",
    items: longItems,
  },
  argTypes: {
    type: { control: "radio", options: ["status-large", "status-small", "inventory"] },
    overflowState: { control: "radio", options: ["auto", "beginning", "middle", "end"] },
  },
};

export default meta;
type Story = StoryObj<SynapseStatusBarProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <SynapseStatusBar type="status-large" total={90} overflowState="beginning">
        <SynapseStatusBarTotalItem>
          <SynapseStatusBarItemDivider side="left" />
          <SynapseStatusBarItemValue>90</SynapseStatusBarItemValue>
          <SynapseStatusBarItemMeta category="Alerts">Total</SynapseStatusBarItemMeta>
          <SynapseStatusBarItemDivider side="right" />
        </SynapseStatusBarTotalItem>
        <SynapseStatusBarContentViewport>
          <SynapseStatusBarItem itemId="critical">
            <SynapseStatusBarItemDivider side="left" />
            <SynapseStatusBarItemIconSlot>
              <SynapseIcon shape="status-critical-square-solid" size={32} variant="img" />
            </SynapseStatusBarItemIconSlot>
            <SynapseStatusBarItemValue>10</SynapseStatusBarItemValue>
            <SynapseStatusBarItemMeta category="<Category>">Critical</SynapseStatusBarItemMeta>
            <SynapseStatusBarItemDivider side="right" />
          </SynapseStatusBarItem>
          <SynapseStatusBarItem itemId="warning">
            <SynapseStatusBarItemIconSlot>
              <SynapseIcon shape="status-warn-tri-solid" size={32} variant="img" />
            </SynapseStatusBarItemIconSlot>
            <SynapseStatusBarItemValue>10</SynapseStatusBarItemValue>
            <SynapseStatusBarItemMeta category="<Category>">Warning</SynapseStatusBarItemMeta>
            <SynapseStatusBarItemDivider side="right" />
          </SynapseStatusBarItem>
          <SynapseStatusBarItem itemId="success">
            <SynapseStatusBarItemIconSlot>
              <SynapseIcon shape="status-ok-circ-solid" size={32} variant="img" />
            </SynapseStatusBarItemIconSlot>
            <SynapseStatusBarItemValue>10</SynapseStatusBarItemValue>
            <SynapseStatusBarItemMeta category="<Category>">Success</SynapseStatusBarItemMeta>
            <SynapseStatusBarItemDivider side="right" />
          </SynapseStatusBarItem>
          <SynapseStatusBarOverflowLayer>
            <SynapseStatusBarOverflowLeft />
            <SynapseStatusBarOverflowRight />
          </SynapseStatusBarOverflowLayer>
        </SynapseStatusBarContentViewport>
      </SynapseStatusBar>
    </div>
  ),
};

export const StatusSmall: Story = {
  args: {
    type: "status-small",
    items: longItems.slice(0, 3),
    total: 10,
    totalLabel: "Total",
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const Inventory: Story = {
  args: {
    type: "inventory",
    total: undefined,
    items: [
      { id: "default", value: 10, category: "Category", label: "Default", iconShapeName: "docs-bundle" },
      {
        id: "warning",
        value: 10,
        category: "Category",
        label: "Warning",
        severity: "warning",
        iconShapeName: "docs-bundle",
      },
      {
        id: "critical",
        value: 10,
        category: "Category",
        label: "Critical",
        severity: "critical",
        iconShapeName: "docs-bundle",
      },
      {
        id: "in-progress",
        value: 10,
        category: "Category",
        label: "In Progress",
        severity: "in-progress",
        iconShapeName: "docs-bundle",
      },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const InventoryNestedHierarchy: Story = {
  name: "Inventory Nested Hierarchy",
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <SynapseStatusBar type="inventory">
        <SynapseStatusBarContentViewport>
          <SynapseStatusBarItem itemId="default">
            <SynapseStatusBarItemDivider side="left" />
            <SynapseStatusBarItemIconSlot>
              <SynapseStatusBarInventoryMainIcon shape="docs-bundle" />
            </SynapseStatusBarItemIconSlot>
            <SynapseStatusBarItemValue>10</SynapseStatusBarItemValue>
            <SynapseStatusBarItemMeta category="Category">Default</SynapseStatusBarItemMeta>
            <SynapseStatusBarItemDivider side="right" />
          </SynapseStatusBarItem>
          <SynapseStatusBarItem itemId="warning">
            <SynapseStatusBarItemIconSlot>
              <SynapseStatusBarInventoryMainIcon shape="docs-bundle" />
              <SynapseStatusBarInventoryStatusBadge severity="warning" />
            </SynapseStatusBarItemIconSlot>
            <SynapseStatusBarItemValue>10</SynapseStatusBarItemValue>
            <SynapseStatusBarItemMeta category="Category">Warning</SynapseStatusBarItemMeta>
            <SynapseStatusBarItemDivider side="right" />
          </SynapseStatusBarItem>
        </SynapseStatusBarContentViewport>
      </SynapseStatusBar>
    </div>
  ),
};

export const ItemStates: Story = {
  args: {
    type: "status-large",
    total: 90,
    items: [
      { id: "default", value: 10, category: "<Category>", label: "Critical", severity: "critical", state: "default" },
      { id: "hover", value: 10, category: "<Category>", label: "Warning", severity: "warning", state: "hover" },
      { id: "press", value: 10, category: "<Category>", label: "Success", severity: "success", state: "press" },
      {
        id: "selected",
        value: 10,
        category: "<Category>",
        label: "In Progress",
        severity: "in-progress",
        state: "selected",
      },
      {
        id: "disabled",
        value: 10,
        category: "<Category>",
        label: "Scheduled",
        severity: "scheduled",
        state: "disabled",
      },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const OverflowBeginning: Story = {
  name: "Overflow Beginning",
  args: {
    overflowState: "beginning",
    items: longItems,
    total: 90,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const OverflowMiddle: Story = {
  name: "Overflow Middle",
  args: {
    overflowState: "middle",
    items: longItems,
    total: 90,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const OverflowEnd: Story = {
  name: "Overflow End",
  args: {
    overflowState: "end",
    items: longItems,
    total: 90,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};
