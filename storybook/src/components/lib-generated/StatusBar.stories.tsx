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
import {
  STATUS_BAR_DOCS_DESCRIPTION,
  STATUS_BAR_SOURCE_CODE,
} from "./ids-status-bar.developer-usage";
import { IdsIcon } from "@ids/react/icon";
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
} from "@ids/react/status-bar";

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
  tags: ["autodocs"],
  title: "Components/IDS/Status Bar",
  component: IdsStatusBar,
  parameters: {
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: STATUS_BAR_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: STATUS_BAR_SOURCE_CODE,
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
              <IdsIcon shape="status-critical-square-solid" size={24} variant="img" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="<Category>">Critical</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarItem itemId="warning">
            <IdsStatusBarItemIconSlot>
              <IdsIcon shape="status-warn-tri-solid" size={24} variant="img" />
            </IdsStatusBarItemIconSlot>
            <IdsStatusBarItemValue>10</IdsStatusBarItemValue>
            <IdsStatusBarItemMeta category="<Category>">Warning</IdsStatusBarItemMeta>
            <IdsStatusBarItemDivider side="right" />
          </IdsStatusBarItem>
          <IdsStatusBarItem itemId="success">
            <IdsStatusBarItemIconSlot>
              <IdsIcon shape="status-ok-circ-solid" size={24} variant="img" />
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

const inventoryOverflowItems: IdsStatusBarItemInput[] = [
  { id: "inv-default", value: 10, category: "Category", label: "Category", iconShapeName: "docs-bundle" },
  { id: "inv-in-progress", value: 10, category: "Category", label: "Category 2", severity: "in-progress", iconShapeName: "docs-bundle" },
  { id: "inv-warning", value: 10, category: "Category", label: "Category 3", severity: "warning", iconShapeName: "docs-bundle" },
  { id: "inv-critical", value: 10, category: "Category", label: "Category 4", severity: "critical", iconShapeName: "docs-bundle" },
  { id: "inv-5", value: 10, category: "Category", label: "Category 5", iconShapeName: "docs-bundle" },
  { id: "inv-6", value: 10, category: "Category", label: "Category 6", iconShapeName: "docs-bundle" },
  { id: "inv-7", value: 10, category: "Category", label: "Category 7", iconShapeName: "docs-bundle" },
];

export const InventoryOverflow: Story = {
  name: "Inventory Overflow",
  args: {
    type: "inventory",
    total: undefined,
    overflowState: "auto",
    items: inventoryOverflowItems,
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryNoIcon: Story = {
  name: "Inventory No Icon",
  args: {
    type: "inventory",
    total: undefined,
    showIcons: false,
    items: [
      { id: "ni-1", value: 10, category: "Category", label: "Category" },
      { id: "ni-2", value: 10, category: "Category", label: "Category" },
      { id: "ni-3", value: 10, category: "Category", label: "Category" },
      { id: "ni-4", value: 10, category: "Category", label: "Category" },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

// All item states shown at once in a single non-overflowing inventory bar, with
// the state name noted under each cell (mirrors the Figma "States" reference).
const inventoryStateItems: IdsStatusBarItemInput[] = [
  { id: "st-default", value: 10, category: "Category", label: "Category 1", severity: "in-progress", iconShapeName: "docs-bundle", state: "default" },
  { id: "st-hover", value: 10, category: "Category", label: "Category 5", iconShapeName: "docs-bundle", state: "hover" },
  { id: "st-press", value: 10, category: "Category", label: "Category 2", severity: "warning", iconShapeName: "docs-bundle", state: "press" },
  { id: "st-selected", value: 10, category: "Category", label: "Category 3", severity: "critical", iconShapeName: "docs-bundle", state: "selected" },
  { id: "st-disabled", value: 0, category: "Category", label: "Category 4", iconShapeName: "docs-bundle", state: "disabled" },
];

const STATE_NOTES = ["Default", "Hover", "Press", "Selected", "Disabled"];

export const InventoryStates: Story = {
  name: "Inventory States",
  render: () => (
    // width: max-content keeps all five cells on one bar (never overflows into
    // the scroll arrows); the page scrolls instead if the canvas is narrow.
    <div style={{ width: "max-content", maxWidth: "none" }}>
      <IdsStatusBar type="inventory" items={inventoryStateItems} />
      <div style={{ display: "flex", marginTop: "var(--spacing-space-8, 8px)" }}>
        {STATE_NOTES.map((note) => (
          <span
            key={note}
            style={{
              flex: "1 1 0",
              textAlign: "center",
              fontFamily: "var(--typography-font-style-primary, 'Roboto', sans-serif)",
              fontSize: "var(--font-size-body-2, 14px)",
              lineHeight: "var(--font-line-height-line-height-20, 20px)",
              color: "var(--color-text-gray-neutral, #4d4d4d)",
            }}
          >
            {note}
          </span>
        ))}
      </div>
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

// One scrollable bar: the arrows appear from the scroll position (auto). In
// Figma "Beginning / Middle / End" are just snapshots of this same bar at
// different scroll offsets, not separate variants.
export const Overflow: Story = {
  args: {
    overflowState: "auto",
    items: longItems,
    total: 90,
  },
  render: (args) => (
    <div style={{ maxWidth: 640 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};
