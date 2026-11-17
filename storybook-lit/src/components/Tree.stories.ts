/**
 * Storybook: IDS Lit Tree from `lib/lit/ids/tree`
 *
 * Theme: components/ids-theme.css (via preview)
 * Spec: components/ids/tree/design-spec.md
 * API: lib/react/ids/tree
 * Examples: storybook-generated/ids/src/components/Tree.stories.tsx
 *
 * Live Figma: 0bHk3XhrjFhowgFkz9yLr4 — Tree-Main `18571:102051`,
 * Element L1 default `18571:101904`, selected `18571:101909`
 */
import type { Meta, StoryObj } from "@storybook/web-components";
import { html, nothing } from "lit";
import "@ids/core/tree/register.js";
import type { IdsTreeNode, TreeItemClickDetail } from "@ids/core/tree";
import {
  TREE_DOCS_DESCRIPTION,
  TREE_SOURCE_CODE,
} from "./ids-tree.developer-usage";

const DESIGN_SPEC_PATH = "components/ids/tree/design-spec.md";

type TreeStoryArgs = {
  items: IdsTreeNode[];
  selectedId?: string;
  defaultSelectedId?: string;
  defaultExpandedIds: string[];
  showIcon: boolean;
  showBadge: boolean;
  ariaLabel: string;
  onTreeItemClick?: (detail: TreeItemClickDetail) => void;
  onExpandChange?: (id: string, expanded: boolean) => void;
  onSelect?: (id: string) => void;
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

const frameStyle = `
  padding: 16px;
  background: var(--color-background-surface-primary);
  max-width: 320px;
  box-sizing: border-box;
`;

function renderTree(args: TreeStoryArgs) {
  return html`
    <div style=${frameStyle}>
      <ids-tree
        .showIcon=${args.showIcon}
        .showBadge=${args.showBadge}
        aria-label=${args.ariaLabel}
        default-selected-id=${args.defaultSelectedId || nothing}
        selected-id=${args.selectedId || nothing}
        .items=${args.items}
        .defaultExpandedIds=${args.defaultExpandedIds}
        .onTreeItemClick=${args.onTreeItemClick}
        .onExpandChange=${args.onExpandChange}
        .onSelect=${args.onSelect}
      ></ids-tree>
    </div>
  `;
}

const meta: Meta<TreeStoryArgs> = {
  title: "Spec Generated/IDS/Tree",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          TREE_DOCS_DESCRIPTION,
          `Source: \`${DESIGN_SPEC_PATH}\`.`,
        ].join("\n\n"),
      },
      source: { code: TREE_SOURCE_CODE, language: "html" },
    },
  },
  argTypes: {
    items: { control: "object" },
    selectedId: { control: "text" },
    defaultSelectedId: { control: "text" },
    defaultExpandedIds: { control: "object" },
    showIcon: { control: "boolean" },
    showBadge: { control: "boolean" },
    ariaLabel: { control: "text" },
    onTreeItemClick: {
      action: "onTreeItemClick",
      description: "(detail: TreeItemClickDetail) => void — also fires tree-item-click",
    },
    onExpandChange: {
      action: "onExpandChange",
      description: "(id, expanded) => void — also fires expand-change",
    },
    onSelect: {
      action: "onSelect",
      description: "(id: string) => void — deprecated; also fires select",
    },
  },
  args: {
    items: [...specAccurateItems],
    defaultSelectedId: "row-2",
    defaultExpandedIds: [],
    showIcon: true,
    showBadge: true,
    ariaLabel: "Tree",
  },
  render: (args) => renderTree(args),
};

export default meta;
type Story = StoryObj<TreeStoryArgs>;

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  args: {
    items: [...specAccurateItems],
    defaultSelectedId: "row-2",
    showIcon: true,
    showBadge: true,
  },
};

export const WithHierarchy: Story = {
  args: {
    items: hierarchyItems,
    defaultSelectedId: "branch-a-2",
    defaultExpandedIds: ["branch-a"],
    showIcon: true,
    showBadge: true,
  },
};

export const SelectedBranchRow: Story = {
  args: {
    items: [
      {
        id: "only",
        label: "Text",
        badgeCount: 1,
        children: [{ id: "child", label: "Text", badgeCount: 1 }],
      },
    ],
    defaultSelectedId: "only",
    defaultExpandedIds: ["only"],
    showIcon: true,
    showBadge: true,
  },
};

export const WithoutBadgeOrIcon: Story = {
  name: "Without Badge Or Icon",
  args: {
    items: [
      { id: "a", label: "Tree without extras" },
      { id: "b", label: "Second row" },
    ],
    showIcon: false,
    showBadge: false,
    defaultSelectedId: "a",
  },
};

/** Mode B: nested composable markup (no `items` array). */
export const DeclarativeMarkup: Story = {
  name: "Declarative Markup",
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-tree
        default-selected-id="t1"
        .defaultExpandedIds=${["t1"]}
        .onTreeItemClick=${args.onTreeItemClick}
        .onExpandChange=${args.onExpandChange}
      >
        <ids-tree-item id="t1" icon-shape="folder-closed" badge-count="1">
          <ids-tree-item-label>Tree1</ids-tree-item-label>
          <ids-tree-item id="t1-1" badge-count="2">
            <ids-tree-item-label>Tree 1.1</ids-tree-item-label>
          </ids-tree-item>
        </ids-tree-item>
        <ids-tree-item id="t2">
          <ids-tree-item-label>Tree2</ids-tree-item-label>
        </ids-tree-item>
      </ids-tree>
    </div>
  `,
};

/** Deep nested composition — branches at levels 1–3. */
export const NestedComposition: Story = {
  name: "Nested Composition",
  render: (args) => html`
    <div style=${frameStyle}>
      <ids-tree
        default-selected-id="docs-api"
        .defaultExpandedIds=${["workspace", "docs", "docs-guides"]}
        .onTreeItemClick=${args.onTreeItemClick}
        .onExpandChange=${args.onExpandChange}
      >
        <ids-tree-item id="workspace" icon-shape="folder-closed" badge-count="3">
          <ids-tree-item-label>Workspace</ids-tree-item-label>
          <ids-tree-item id="docs" icon-shape="folder-closed" badge-count="2">
            <ids-tree-item-label>Docs</ids-tree-item-label>
            <ids-tree-item id="docs-guides" badge-count="1">
              <ids-tree-item-label>Guides</ids-tree-item-label>
              <ids-tree-item id="docs-api">
                <ids-tree-item-label>API reference</ids-tree-item-label>
              </ids-tree-item>
            </ids-tree-item>
            <ids-tree-item id="docs-changelog">
              <ids-tree-item-label>Changelog</ids-tree-item-label>
            </ids-tree-item>
          </ids-tree-item>
          <ids-tree-item id="assets">
            <ids-tree-item-label>Assets</ids-tree-item-label>
          </ids-tree-item>
        </ids-tree-item>
        <ids-tree-item id="settings">
          <ids-tree-item-label>Settings</ids-tree-item-label>
        </ids-tree-item>
      </ids-tree>
    </div>
  `,
};

export const LabelBadgeSpacing: Story = {
  name: "Label Badge Spacing",
  args: {
    items: [
      {
        id: "long",
        label:
          "Very long tree label that should ellipsize before the badge moves away",
        badgeCount: 99,
      },
    ],
    defaultSelectedId: "long",
    showIcon: true,
    showBadge: true,
  },
};
