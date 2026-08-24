/**
 * Storybook: design-spec–generated Tree from `lib/react/ids/tree`
 * (React + CSS Modules, no @base-ui-components).
 *
 * Anatomy:
 *   IdsTree → IdsTreeItem[] → IdsTreeItemLabel
 *   Row: TreeRowRoot → ExpandChevron? → NodeIcon? → LabelCluster(NodeLabel + CountBadge?)
 *
 * Theme: components/ids-theme.css
 * Spec: components/ids/tree/design-spec.md
 */
import React, { type ComponentProps, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import "../../../../components/ids-theme.css";
import {
  IdsTree,
  IdsTreeItem,
  IdsTreeItemLabel,
  type IdsTreeNode,
  type TreeItemClickDetail,
} from "../../../../lib/react/ids/tree";

const DESIGN_SPEC_PATH = "components/ids/tree/design-spec.md";

const onTreeItemClick = (detail: TreeItemClickDetail) => {
  console.log("onTreeItemClick", detail);
};

/** Spec Accurate Design — six flat rows, defaultSelectedId row-2 (Figma 18571:102051). */
const specAccurateItems: IdsTreeNode[] = [
  { id: "row-1", label: "Text", badgeCount: 1 },
  { id: "row-2", label: "Text", badgeCount: 1 },
  { id: "row-3", label: "Text", badgeCount: 1 },
  { id: "row-4", label: "Text", badgeCount: 1 },
  { id: "row-5", label: "Text", badgeCount: 1 },
  { id: "row-6", label: "Text", badgeCount: 1 },
];

const hierarchyItems: IdsTreeNode[] = [
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

const specAccurateArgs: ComponentProps<typeof IdsTree> = {
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

const meta: Meta<typeof IdsTree> = {
  title: "Components/IDS/Tree",
  component: IdsTree,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          `React IDS Tree from \`${DESIGN_SPEC_PATH}\`. ` +
          "Anatomy: `IdsTree` + `IdsTreeItem` + `IdsTreeItemLabel`. " +
          "Mode A: `items[]`. Mode B: nested markup. Root emits `onTreeItemClick`. " +
          "Theme: `components/ids-theme.css`. No `@base-ui-components`.",
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
type Story = StoryObj<typeof IdsTree>;

/** Figma `18571:102051` — Tree nodes=6, selected row-2. */
export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  render: (args) => <IdsTree {...args} />,
  args: specAccurateArgs,
};

export const WithHierarchy: Story = {
  render: () => (
    <IdsTree
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
    <IdsTree
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
    <IdsTree
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

/** Mode B: nested IdsTreeItem / IdsTreeItemLabel (no items[]). */
export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  render: () => (
    <IdsTree
      defaultSelectedId="t1"
      defaultExpandedIds={["t1"]}
      onTreeItemClick={onTreeItemClick}
    >
      <IdsTreeItem id="t1" iconShape="folder-closed" badgeCount={1}>
        <IdsTreeItemLabel>Tree1</IdsTreeItemLabel>
        <IdsTreeItem id="t1-1" badgeCount={2}>
          <IdsTreeItemLabel>Tree 1.1</IdsTreeItemLabel>
        </IdsTreeItem>
      </IdsTreeItem>
      <IdsTreeItem id="t2">
        <IdsTreeItemLabel>Tree2</IdsTreeItemLabel>
      </IdsTreeItem>
    </IdsTree>
  ),
};

/** LabelCluster QA — badge stays 8px after label (not row trailing edge). */
export const LabelBadgeSpacing: Story = {
  name: "Label Badge Spacing",
  render: () => (
    <IdsTree
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
