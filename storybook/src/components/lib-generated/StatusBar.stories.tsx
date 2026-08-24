/**
 * Storybook: design-spec–generated Status Bar from `lib/react/ids/status-bar`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/status-bar/design-spec.md
 *
 * Nested hierarchy (Ids-prefixed, root = StatusBar not StatusBarRoot):
 * IdsStatusBar → IdsStatusBarTotalItem? → IdsStatusBarContentViewport →
 * IdsStatusBarItem[] → IconSlot / Value / Meta / Divider → OverflowLayer?
 *
 * CSS selectors: ids-status-bar, ids-status-bar-item, …
 */
import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import { IdsIcon } from "../../../../lib/react/ids/icon";
import {
  IdsStatusBar,
  IdsStatusBarContentViewport,
  IdsStatusBarInventoryMainIcon,
  IdsStatusBarInventoryStatusBadge,
  IdsStatusBarItem,
  IdsStatusBarItemDivider,
  IdsStatusBarItemIconSlot,
  IdsStatusBarItemMeta,
  IdsStatusBarItemValue,
  IdsStatusBarOverflowLayer,
  IdsStatusBarOverflowLeft,
  IdsStatusBarOverflowRight,
  IdsStatusBarTotalItem,
  type IdsStatusBarItemInput,
  type IdsStatusBarProps,
} from "../../../../lib/react/ids/status-bar";

const longItems: IdsStatusBarItemInput[] = [
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

const meta: Meta<IdsStatusBarProps> = {
  title: "Components/IDS/Status Bar",
  component: IdsStatusBar,
  parameters: {
    docs: {
      description: {
        component:
          "React IDS Status Bar from `components/ids/status-bar/design-spec.md`. " +
          "Root slot is `StatusBar` (`IdsStatusBar`), not `StatusBarRoot`. " +
          "Parts: TotalItem, ContentViewport, Item, ItemIconSlot, ItemValue, ItemMeta, " +
          "ItemDivider, OverflowLayer / Left / Right, InventoryMainIcon, InventoryStatusBadge. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<IdsStatusBarProps>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const NestedHierarchy: Story = {
  name: "Nested Hierarchy",
  render: () => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar type="status-large" total={90} overflowState="beginning">
        <IdsStatusBarTotalItem>
          <IdsStatusBarItemDivider side="left" />
          <IdsStatusBarItemValue>90</IdsStatusBarItemValue>
          <IdsStatusBarItemMeta category="Alerts">Total</IdsStatusBarItemMeta>
          <IdsStatusBarItemDivider side="right" />
        </IdsStatusBarTotalItem>
        <IdsStatusBarContentViewport>
          <IdsStatusBarItem itemId="critical">
            <IdsStatusBarItemDivider side="left" />
            <IdsStatusBarItemIconSlot>
              <IdsIcon shape="status-critical-square-solid" size={32} variant="img" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="<Category>">Critical</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarItem itemId="warning">
            <IdsStatusBarItemIconSlot>
              <IdsIcon shape="status-warn-tri-solid" size={32} variant="img" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="<Category>">Warning</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarItem itemId="success">
            <IdsStatusBarItemIconSlot>
              <IdsIcon shape="status-ok-circ-solid" size={32} variant="img" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="<Category>">Success</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarOverflowLayer>
            <IdsStatusBarOverflowLeft />
            <IdsStatusBarOverflowRight />
          </IdsStatusBarOverflowLayer>
        </IdsStatusBarContentViewport>
      </IdsStatusBar>
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
      <IdsStatusBar {...args} />
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
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryNestedHierarchy: Story = {
  name: "Inventory Nested Hierarchy",
  render: () => (
    <div style={{ maxWidth: 760 }}>
      <IdsStatusBar type="inventory">
        <IdsStatusBarContentViewport>
          <IdsStatusBarItem itemId="default">
            <IdsStatusBarItemDivider side="left" />
            <IdsStatusBarItemIconSlot>
              <IdsStatusBarInventoryMainIcon shape="docs-bundle" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="Category">Default</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarItem itemId="warning">
            <IdsStatusBarItemIconSlot>
              <IdsStatusBarInventoryMainIcon shape="docs-bundle" />
              <IdsStatusBarInventoryStatusBadge severity="warning" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="Category">Warning</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
        </IdsStatusBarContentViewport>
      </IdsStatusBar>
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
      <IdsStatusBar {...args} />
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
      <IdsStatusBar {...args} />
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
      <IdsStatusBar {...args} />
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
      <IdsStatusBar {...args} />
    </div>
  ),
};
