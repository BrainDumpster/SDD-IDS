/* Spec Generated — IDS Tree (design-spec intake wizard) */
import "../../../components/ids-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import {
  IdsTree,
  IdsTreeItem,
  IdsTreeItemLabel,
  type IdsTreeNode,
  type TreeItemClickDetail,
} from "./IdsTree";

const DESIGN_SPEC_PATH = "components/ids/tree/design-spec.mdx";

const onTreeItemClick = (detail: TreeItemClickDetail) => {
  console.log("onTreeItemClick", detail);
};

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

const meta: Meta<typeof IdsTree> = {
  title: "Spec Generated/IDS/Tree",
  component: IdsTree,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          `Spec-driven IDS Tree. Source of truth: \`${DESIGN_SPEC_PATH}\`.`,
          "Mode A: `items[]`. Mode B: nested `IdsTreeItem` / `IdsTreeItemLabel`. Root emits `onTreeItemClick`.",
          "Theme: `components/ids-theme.css` + `[data-theme=\"dark\"]`.",
        ].join(" "),
      },
    },
  },
  args: specAccurateArgs,
};

export default meta;
type Story = StoryObj<typeof IdsTree>;

function TreeFrame(props: ComponentProps<typeof IdsTree>) {
  return (
    <div
      style={{
        padding: 16,
        background: "var(--color-background-surface-1)",
        maxWidth: 320,
      }}
    >
      <IdsTree onTreeItemClick={onTreeItemClick} {...props} />
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
      items={hierarchyItems}
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

/** No icons or badges — optional slots omitted. */
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

/** Mode B: manual nested markup (no `items` array). */
export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  render: () => (
    <TreeFrame defaultSelectedId="t1" defaultExpandedIds={["t1"]}>
      <IdsTreeItem id="t1" iconShape="folder-closed" badgeCount={1}>
        <IdsTreeItemLabel>Tree1</IdsTreeItemLabel>
        <IdsTreeItem id="t1-1" badgeCount={2}>
          <IdsTreeItemLabel>Tree 1.1</IdsTreeItemLabel>
        </IdsTreeItem>
      </IdsTreeItem>
      <IdsTreeItem id="t2">
        <IdsTreeItemLabel>Tree2</IdsTreeItemLabel>
      </IdsTreeItem>
    </TreeFrame>
  ),
};

/** Long label + badge stays 8px after text (LabelCluster QA). */
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
