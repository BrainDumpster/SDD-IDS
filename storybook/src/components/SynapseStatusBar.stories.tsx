import type { Meta, StoryObj } from "@storybook/react";
import "../../../components/synapse-theme.css";
import { SynapseStatusBar } from "./SynapseStatusBar";
import {
  SYNAPSE_STATUS_BAR_DESIGN_SPEC_PATH,
  SYNAPSE_STATUS_BAR_IDS_MAIN_NODE_ID,
  IDS_STATUS_BAR_FIGMA_NODES,
  type IdsStatusBarItemData,
} from "../spec-contracts/synapse-status-bar.contract";

const severityItems: IdsStatusBarItemData[] = [
  { kind: "severity", id: "critical", value: 10, category: "Alerts", label: "Critical", severity: "critical" },
  { kind: "severity", id: "warning", value: 10, category: "Alerts", label: "Warning", severity: "warning" },
  { kind: "severity", id: "success", value: 10, category: "Alerts", label: "Success", severity: "success" },
  { kind: "severity", id: "in-progress", value: 10, category: "Alerts", label: "In Progress", severity: "in-progress" },
];

const inventoryItems: IdsStatusBarItemData[] = [
  { kind: "inventory", id: "a", value: 10, label: "Category", iconShapeName: "docs-bundle", status: "in-progress" },
  { kind: "inventory", id: "b", value: 10, label: "Category 2", iconShapeName: "docs-bundle", status: "warning" },
  { kind: "inventory", id: "c", value: 10, label: "Category 3", iconShapeName: "docs-bundle", status: "critical" },
  { kind: "inventory", id: "d", value: 10, label: "Category 4", iconShapeName: "docs-bundle", status: "warning" },
];

const meta: Meta<typeof SynapseStatusBar> = {
  title: "Spec Generated/Synapse/Status Bar",
  component: SynapseStatusBar,
  parameters: {
    docs: {
      description: {
        component: `Synapse Status Bar (IDS-fork) aligned to \`${SYNAPSE_STATUS_BAR_DESIGN_SPEC_PATH}\`. IDS Figma main \`${SYNAPSE_STATUS_BAR_IDS_MAIN_NODE_ID}\`; theme via \`components/synapse-theme.css\`.`,
      },
    },
  },
  args: {
    barType: "severity-health-large",
    total: { value: 40, category: "Alerts", label: "Total" },
    items: severityItems,
  },
};

export default meta;
type Story = StoryObj<typeof SynapseStatusBar>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const SeverityWithTotal: Story = {
  render: (args) => (
    <div style={{ maxWidth: 900 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const InventoryWithIcons: Story = {
  args: {
    barType: "inventory",
    total: undefined,
    showIcons: true,
    items: inventoryItems,
  },
  render: (args) => (
    <div style={{ maxWidth: 760 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};

export const SeverityOverflowMiddle: Story = {
  args: {
    overflowScenario: "middle",
    items: [
      ...severityItems,
      { kind: "severity", id: "scheduled", value: 5, category: "Alerts", label: "Scheduled", severity: "scheduled" },
      { kind: "severity", id: "canceled", value: 2, category: "Alerts", label: "Canceled", severity: "canceled" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `Overflow middle scenario — IDS Figma \`${IDS_STATUS_BAR_FIGMA_NODES.severityOverflowMiddle}\`.`,
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: 520 }}>
      <SynapseStatusBar {...args} />
    </div>
  ),
};
