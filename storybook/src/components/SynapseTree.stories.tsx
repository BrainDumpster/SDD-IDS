/* Components — Synapse Tree (IDS-fork) */
import "../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import {
  SynapseTree,
  SynapseTreeItem,
  SynapseTreeItemLabel,
  type SynapseTreeItemClickDetail,
} from "./SynapseTree";
import {
  SYNAPSE_TREE_DESIGN_SPEC_PATH,
  SYNAPSE_TREE_HIERARCHY_ITEMS,
  SYNAPSE_TREE_IDS_BASELINE_SPEC_PATH,
  SYNAPSE_TREE_MAIN_NODE_ID,
  SYNAPSE_TREE_SAMPLE_ITEMS,
} from "../spec-contracts/synapse-tree.contract";

const onTreeItemClick = (detail: SynapseTreeItemClickDetail) => {
  console.log("onTreeItemClick", detail);
};

const specAccurateArgs: ComponentProps<typeof SynapseTree> = {
  items: [...SYNAPSE_TREE_SAMPLE_ITEMS],
  defaultSelectedId: "row-2",
  showIcon: true,
  showBadge: true,
  onTreeItemClick,
};

const meta: Meta<typeof SynapseTree> = {
  title: "Components/Synapse/Tree",
  component: SynapseTree,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven Synapse Tree (IDS-fork). Source: \`${SYNAPSE_TREE_DESIGN_SPEC_PATH}\`.`,
          `IDS baseline: \`${SYNAPSE_TREE_IDS_BASELINE_SPEC_PATH}\`.`,
          `Primary Figma node: \`${SYNAPSE_TREE_MAIN_NODE_ID}\`.`,
          "Mode A: `items[]`. Mode B: nested `SynapseTreeItem` / `SynapseTreeItemLabel`.",
          "Theme: `components/synapse-theme.css` + `[data-theme=\"dark\"]`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTree>;

function TreeFrame(props: ComponentProps<typeof SynapseTree>) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--color-background-surface-1)",
        maxWidth: 320,
      }}
    >
      <SynapseTree onTreeItemClick={onTreeItemClick} {...props} />
    </div>
  );
}

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <TreeFrame {...args} />,
  args: specAccurateArgs,
};

export const WithHierarchy: Story = {
  render: () => (
    <TreeFrame
      items={[...SYNAPSE_TREE_HIERARCHY_ITEMS]}
      defaultSelectedId="branch-a-2"
      defaultExpandedIds={["branch-a"]}
      showIcon
      showBadge
    />
  ),
};

export const SelectedBranchRow: Story = {
  render: () => (
    <TreeFrame
      items={[
        {
          id: "only",
          label: "Text",
          badgeCount: 1,
          children: [{ id: "child", label: "Text", badgeCount: 1 }],
        },
      ]}
      defaultSelectedId="only"
      defaultExpandedIds={["only"]}
    />
  ),
};

export const WithoutBadgeOrIcon: Story = {
  name: "Without Badge Or Icon",
  render: () => (
    <TreeFrame
      items={[
        { id: "a", label: "Tree without extras" },
        { id: "b", label: "Second row" },
      ]}
      showIcon={false}
      showBadge={false}
      defaultSelectedId="a"
    />
  ),
};

export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  render: () => (
    <TreeFrame defaultSelectedId="t1" defaultExpandedIds={["t1"]}>
      <SynapseTreeItem id="t1" iconShape="folder-closed" badgeCount={1}>
        <SynapseTreeItemLabel>Tree1</SynapseTreeItemLabel>
        <SynapseTreeItem id="t1-1" badgeCount={2}>
          <SynapseTreeItemLabel>Tree 1.1</SynapseTreeItemLabel>
        </SynapseTreeItem>
      </SynapseTreeItem>
      <SynapseTreeItem id="t2">
        <SynapseTreeItemLabel>Tree2</SynapseTreeItemLabel>
      </SynapseTreeItem>
    </TreeFrame>
  ),
};

export const LabelBadgeSpacing: Story = {
  name: "Label Badge Spacing",
  render: () => (
    <TreeFrame
      items={[
        {
          id: "long",
          label: "Very long tree label that should ellipsize before the badge moves away",
          badgeCount: 99,
        },
      ]}
      defaultSelectedId="long"
    />
  ),
};
