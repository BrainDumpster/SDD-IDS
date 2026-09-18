/**
 * Storybook: design-spec–generated Tree from `lib/react/synapse/tree`
 * (IDS-fork reexport façade — React + CSS Modules).
 *
 * Anatomy:
 *   SynapseTree → SynapseTreeItem[] → SynapseTreeItemLabel
 *   Row: TreeRowRoot → ExpandChevron? → NodeIcon? → LabelCluster(NodeLabel + CountBadge?)
 *
 * Theme: components/synapse-theme.css
 * Spec: components/synapse/tree/design-spec.md
 */
import React, { type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/synapse-theme.css";
import {
  SYNAPSE_TREE_DOCS_DESCRIPTION,
  SYNAPSE_TREE_SOURCE_CODE,
} from "./synapse-tree.developer-usage";
import {
  SynapseTree,
  SynapseTreeItem,
  SynapseTreeItemLabel,
  type SynapseTreeNode,
  type SynapseTreeItemClickDetail,
} from "@synapse/react/tree";

const DESIGN_SPEC_PATH = "components/synapse/tree/design-spec.md";

const onTreeItemClick = (detail: SynapseTreeItemClickDetail) => {
  console.log("onTreeItemClick", detail);
};

/** Spec Accurate Design — six flat rows, defaultSelectedId row-2 (Figma 18571:102051). */
const specAccurateItems: SynapseTreeNode[] = [
  { id: "row-1", label: "Text", badgeCount: 1 },
  { id: "row-2", label: "Text", badgeCount: 1 },
  { id: "row-3", label: "Text", badgeCount: 1 },
  { id: "row-4", label: "Text", badgeCount: 1 },
  { id: "row-5", label: "Text", badgeCount: 1 },
  { id: "row-6", label: "Text", badgeCount: 1 },
];

const hierarchyItems: SynapseTreeNode[] = [
  {
    id: "branch-a",
    label: "Text",
    badgeCount: 1,
    children: [
      { id: "branch-a-1", label: "Text", badgeCount: 1 },
      {
        id: "branch-a-2",
        label: "Text",
        badgeCount: 1,
        children: [{ id: "leaf-a-2-1", label: "Text", badgeCount: 1 }],
      },
    ],
  },
  { id: "branch-b", label: "Text", badgeCount: 1 },
  { id: "leaf-c", label: "Text", badgeCount: 1 },
];

const specAccurateArgs: ComponentProps<typeof SynapseTree> = {
  items: specAccurateItems,
  defaultSelectedId: "row-2",
  showIcon: true,
  showBadge: true,
  onTreeItemClick,
};

const frameStyle: CSSProperties = {
  padding: 16,
  background: "var(--color-background-surface-primary)",
  maxWidth: 320,
};

const meta: Meta<typeof SynapseTree> = {
  tags: ["autodocs"],
  title: "Components/Synapse/Tree",
  component: SynapseTree,
  parameters: {
    layout: "padded",
    docs: {
      canvas: { sourceState: "open" },
      description: {
        component: SYNAPSE_TREE_DOCS_DESCRIPTION,
      },
      source: {
        type: "code",
        language: "tsx",
        code: SYNAPSE_TREE_SOURCE_CODE,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={frameStyle}>
        <Story />
      </div>
    ),
  ],
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof SynapseTree>;

/** Figma `18571:102051` — Tree nodes=6, selected row-2. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <SynapseTree {...args} />,
  args: specAccurateArgs,
};

export const WithHierarchy: Story = {
  render: () => (
    <SynapseTree
      items={hierarchyItems}
      defaultSelectedId="branch-a-2"
      defaultExpandedIds={["branch-a"]}
      showIcon
      showBadge
      onTreeItemClick={onTreeItemClick}
    />
  ),
};

export const SelectedBranchRow: Story = {
  render: () => (
    <SynapseTree
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
      onTreeItemClick={onTreeItemClick}
    />
  ),
};

export const WithoutBadgeOrIcon: Story = {
  name: "Without Badge Or Icon",
  render: () => (
    <SynapseTree
      items={[
        { id: "a", label: "Tree without extras" },
        { id: "b", label: "Second row" },
      ]}
      showIcon={false}
      showBadge={false}
      defaultSelectedId="a"
      onTreeItemClick={onTreeItemClick}
    />
  ),
};

/** Mode B: nested SynapseTreeItem / SynapseTreeItemLabel (no items[]). */
export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  render: () => (
    <SynapseTree
      defaultSelectedId="t1"
      defaultExpandedIds={["t1"]}
      onTreeItemClick={onTreeItemClick}
    >
      <SynapseTreeItem id="t1" iconShape="folder-closed" badgeCount={1}>
        <SynapseTreeItemLabel>Tree1</SynapseTreeItemLabel>
        <SynapseTreeItem id="t1-1" badgeCount={2}>
          <SynapseTreeItemLabel>Tree 1.1</SynapseTreeItemLabel>
        </SynapseTreeItem>
      </SynapseTreeItem>
      <SynapseTreeItem id="t2">
        <SynapseTreeItemLabel>Tree2</SynapseTreeItemLabel>
      </SynapseTreeItem>
    </SynapseTree>
  ),
};

/** LabelCluster QA — badge stays 8px after label (not row trailing edge). */
export const LabelBadgeSpacing: Story = {
  name: "Label Badge Spacing",
  render: () => (
    <SynapseTree
      items={[
        {
          id: "long",
          label:
            "Very long tree label that should ellipsize before the badge moves away",
          badgeCount: 99,
        },
      ]}
      defaultSelectedId="long"
      onTreeItemClick={onTreeItemClick}
    />
  ),
};
