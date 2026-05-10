import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/ids-theme.css";
import { IdsStatusBar } from "./IdsStatusBar";
import {
  IDS_STATUS_BAR_DESIGN_SPEC_PATH,
  IDS_STATUS_BAR_FIGMA_NODES,
  type IdsStatusBarItemContract,
} from "../spec-contracts/ids-status-bar.contract";

const longItems: IdsStatusBarItemContract[] = [
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

const meta: Meta<typeof IdsStatusBar> = {
  title: "IDS/Status Bar",
  component: IdsStatusBar,
  parameters: {
    docs: {
      description: {
        component: `IDS Status Bar aligned to \`${IDS_STATUS_BAR_DESIGN_SPEC_PATH}\` with Figma nodes \`${IDS_STATUS_BAR_FIGMA_NODES.main}\`, \`${IDS_STATUS_BAR_FIGMA_NODES.elementsSmall}\`, \`${IDS_STATUS_BAR_FIGMA_NODES.elementsCategory}\`, \`${IDS_STATUS_BAR_FIGMA_NODES.overflowContainer}\`, and \`${IDS_STATUS_BAR_FIGMA_NODES.variations}\`.`,
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
};

export default meta;
type Story = StoryObj<typeof IdsStatusBar>;

export const StatusLarge: Story = {
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
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
      { id: "warning", value: 10, category: "Category", label: "Warning", severity: "warning", iconShapeName: "docs-bundle" },
      { id: "critical", value: 10, category: "Category", label: "Critical", severity: "critical", iconShapeName: "docs-bundle" },
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

export const ItemStates: Story = {
  args: {
    type: "status-large",
    total: 90,
    items: [
      { id: "default", value: 10, category: "<Category>", label: "Critical", severity: "critical", state: "default" },
      { id: "hover", value: 10, category: "<Category>", label: "Warning", severity: "warning", state: "hover" },
      { id: "press", value: 10, category: "<Category>", label: "Success", severity: "success", state: "press" },
      { id: "selected", value: 10, category: "<Category>", label: "In Progress", severity: "in-progress", state: "selected" },
      { id: "disabled", value: 10, category: "<Category>", label: "Scheduled", severity: "scheduled", state: "disabled" },
    ],
  },
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <IdsStatusBar {...args} />
    </div>
  ),
};
