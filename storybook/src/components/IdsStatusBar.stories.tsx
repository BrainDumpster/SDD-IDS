import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../../../components/ids-theme.css";
import { IdsStatusBar } from "./IdsStatusBar";
import {
  IDS_STATUS_BAR_DESIGN_SPEC_PATH,
  IDS_STATUS_BAR_FIGMA_NODES,
  type IdsStatusBarItemData,
} from "../spec-contracts/ids-status-bar.contract";

const longSeverityItems: IdsStatusBarItemData[] = [
  { kind: "severity", id: "critical", value: 10, category: "Alerts", label: "Critical", severity: "critical" },
  { kind: "severity", id: "warning", value: 10, category: "Alerts", label: "Warning", severity: "warning" },
  { kind: "severity", id: "success", value: 10, category: "Alerts", label: "Success", severity: "success" },
  { kind: "severity", id: "in-progress", value: 10, category: "Alerts", label: "In Progress", severity: "in-progress" },
  { kind: "severity", id: "scheduled", value: 10, category: "Alerts", label: "Scheduled", severity: "scheduled" },
  { kind: "severity", id: "canceling", value: 10, category: "Alerts", label: "Canceling", severity: "canceling" },
  { kind: "severity", id: "canceled", value: 10, category: "Alerts", label: "Canceled", severity: "canceled" },
  { kind: "severity", id: "skipped", value: 10, category: "Alerts", label: "Skipped", severity: "skipped" },
  { kind: "severity", id: "unknown", value: 10, category: "Alerts", label: "Unknown", severity: "unknown" },
];

const inventoryItemsWithIcons: IdsStatusBarItemData[] = [
  { kind: "inventory", id: "in-progress", value: 10, label: "Category", iconShapeName: "docs-bundle", status: "in-progress" },
  { kind: "inventory", id: "warning", value: 10, label: "Category 2", iconShapeName: "docs-bundle", status: "warning" },
  { kind: "inventory", id: "critical", value: 10, label: "Category 3", iconShapeName: "docs-bundle", status: "critical" },
  { kind: "inventory", id: "warning-2", value: 10, label: "Category 4", iconShapeName: "docs-bundle", status: "warning" },
];

const inventoryOverflowItems: IdsStatusBarItemData[] = [
  ...inventoryItemsWithIcons,
  { kind: "inventory", id: "a", value: 10, label: "Category 5", iconShapeName: "docs-bundle", status: "in-progress" },
  { kind: "inventory", id: "b", value: 10, label: "Category 6", iconShapeName: "docs-bundle", status: "warning" },
  { kind: "inventory", id: "c", value: 10, label: "Category 7", iconShapeName: "docs-bundle", status: "critical" },
  { kind: "inventory", id: "d", value: 10, label: "Category 8", iconShapeName: "docs-bundle", status: "warning" },
];

const severityStateItems: IdsStatusBarItemData[] = [
  { kind: "severity", id: "default", value: 10, category: "Alerts", label: "Critical", severity: "critical", state: "default" },
  { kind: "severity", id: "hover", value: 10, category: "Alerts", label: "Warning", severity: "warning", state: "hover" },
  { kind: "severity", id: "press", value: 10, category: "Alerts", label: "Success", severity: "success", state: "press" },
  { kind: "severity", id: "selected", value: 10, category: "Alerts", label: "In Progress", severity: "in-progress", state: "selected" },
  { kind: "severity", id: "disabled", value: 0, category: "Alerts", label: "Scheduled", severity: "scheduled", state: "disabled" },
];

const inventoryStateItems: IdsStatusBarItemData[] = [
  { kind: "inventory", id: "default", value: 10, label: "Category 1", iconShapeName: "docs-bundle", status: "in-progress", state: "default" },
  { kind: "inventory", id: "hover", value: 10, label: "Category 5", iconShapeName: "docs-bundle", state: "hover" },
  { kind: "inventory", id: "press", value: 10, label: "Category 2", iconShapeName: "docs-bundle", status: "warning", state: "press" },
  { kind: "inventory", id: "selected", value: 10, label: "Category 3", iconShapeName: "docs-bundle", status: "critical", state: "selected" },
  { kind: "inventory", id: "disabled", value: 0, label: "Category 4", iconShapeName: "docs-bundle", state: "disabled" },
];

const stateStoryDescription =
  "Forced `state` per item for visual QA (Figma state matrix). Hover other stories to see runtime `:hover` / `:active`.";

const meta: Meta<typeof IdsStatusBar> = {
  title: "Spec Generated/IDS/Status Bar",
  component: IdsStatusBar,
  parameters: {
    docs: {
      description: {
        component: `IDS Status Bar aligned to \`${IDS_STATUS_BAR_DESIGN_SPEC_PATH}\`. Figma: main \`${IDS_STATUS_BAR_FIGMA_NODES.main}\`, severity with total \`${IDS_STATUS_BAR_FIGMA_NODES.severityWithTotal}\`, inventory overflow \`${IDS_STATUS_BAR_FIGMA_NODES.inventoryOverflowBeginning}\`.`,
      },
    },
  },
  args: {
    barType: "severity-health-large",
    total: { value: 90, category: "Alerts", label: "Total" },
    items: longSeverityItems,
  },
};

export default meta;
type Story = StoryObj<typeof IdsStatusBar>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityWithTotal: Story = {
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityNoTotal: Story = {
  args: {
    total: undefined,
    items: longSeverityItems.slice(0, 5),
  },
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityOverflowBeginning: Story = {
  args: {
    overflowScenario: "beginning",
    items: longSeverityItems,
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityOverflowMiddle: Story = {
  args: {
    overflowScenario: "middle",
    items: longSeverityItems,
    total: { value: 50, category: "Alerts", label: "Total" },
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityHealthSmall: Story = {
  args: {
    barType: "severity-health-small",
    items: longSeverityItems.slice(0, 3),
    total: { value: 30, label: "Total" },
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryWithIcons: Story = {
  args: {
    barType: "inventory",
    total: undefined,
    showIcons: true,
    items: inventoryItemsWithIcons,
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryNoIcons: Story = {
  args: {
    barType: "inventory",
    showIcons: false,
    items: inventoryItemsWithIcons.map(({ iconShapeName: _icon, status: _status, ...item }) => item),
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryOverflowBeginning: Story = {
  args: {
    barType: "inventory",
    showIcons: true,
    items: inventoryOverflowItems,
    overflowScenario: "auto",
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const SeverityItemStates: Story = {
  name: "Severity Item States",
  parameters: {
    docs: { description: { story: `${stateStoryDescription} Figma \`${IDS_STATUS_BAR_FIGMA_NODES.severityStates}\`.` } },
  },
  args: {
    total: { value: 40, category: "Alerts", label: "Total" },
    items: severityStateItems,
  },
  render: (args) => (
    <div style={{ maxWidth: 980 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

export const InventoryItemStates: Story = {
  name: "Inventory Item States",
  parameters: {
    docs: { description: { story: `${stateStoryDescription} Figma \`${IDS_STATUS_BAR_FIGMA_NODES.inventoryStates}\`.` } },
  },
  args: {
    barType: "inventory",
    showIcons: true,
    total: undefined,
    items: inventoryStateItems,
  },
  render: (args) => (
    <div style={{ maxWidth: 980 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};

/** Runtime single selection (radio-like). Figma selected chrome: `15405:10991`. */
export const SingleSelection: Story = {
  name: "Single Selection",
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(["warning"]);
    const items: IdsStatusBarItemData[] = [
      { kind: "severity", id: "critical", value: 10, category: "Alerts", label: "Critical", severity: "critical" },
      { kind: "severity", id: "warning", value: 10, category: "Alerts", label: "Warning", severity: "warning" },
      { kind: "severity", id: "success", value: 10, category: "Alerts", label: "Success", severity: "success" },
      { kind: "severity", id: "in-progress", value: 10, category: "Alerts", label: "In Progress", severity: "in-progress" },
    ];

    return (
      <div style={{ maxWidth: 900 }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          `selectionMode="single"` — one item at a time (radio). Selected: {selectedIds.join(", ") || "none"}
        </p>
        <IdsStatusBar
          total={{ value: 40, category: "Alerts", label: "Total" }}
          items={items}
          selectionMode="single"
          selectedItemIds={selectedIds}
          onSelectionChange={({ selectedIds: next }) => setSelectedIds(next)}
        />
      </div>
    );
  },
};

/** Runtime multiple selection (checkbox-like). Figma inventory states: `15405:9692`. */
export const MultipleSelection: Story = {
  name: "Multiple Selection",
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(["warning"]);
    const items = inventoryItemsWithIcons;

    return (
      <div style={{ maxWidth: 900 }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "var(--color-text-neutral)" }}>
          `selectionMode="multiple"` — toggle items (checkbox). Selected: {selectedIds.join(", ") || "none"}
        </p>
        <IdsStatusBar
          barType="inventory"
          showIcons
          items={items}
          selectionMode="multiple"
          selectedItemIds={selectedIds}
          onSelectionChange={({ selectedIds: next }) => setSelectedIds(next)}
        />
      </div>
    );
  },
};

/** @deprecated Use SingleSelection */
export const InteractiveSelection: Story = {
  ...SingleSelection,
};

/** @deprecated Use SeverityItemStates */
export const ItemStates: Story = {
  ...SeverityItemStates,
};
