import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import "../tokens.css";
import Tree from "./Tree";
import type { TreeNode } from "./Tree";

/**
 * Joe-Generated Tree — uses only:
 * - storybook/src/components/dap/joe-generated/Tree/Tree.tsx
 * - storybook/src/components/dap/joe-generated/Tree/Tree.css (imported by Tree.tsx)
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Tree/tree.mdx
 */

/** MDX Spec Accurate Design sample: six flat siblings, badgeCount 1 */
const sixFlatRows: TreeNode[] = Array.from({ length: 6 }, (_, i) => ({
  id: `row-${i + 1}`,
  label: "Text",
  badgeCount: 1,
}));

const nestedItems: TreeNode[] = [
  {
    id: "root-1",
    label: "Infrastructure",
    badgeCount: 3,
    children: [
      {
        id: "compute",
        label: "Compute",
        badgeCount: 2,
        children: [
          { id: "host-a", label: "Host A" },
          { id: "host-b", label: "Host B", badgeCount: 1 },
        ],
      },
      {
        id: "storage",
        label: "Storage",
        children: [
          { id: "array-1", label: "PowerStore 500T" },
          { id: "array-2", label: "PowerMax 8500" },
        ],
      },
    ],
  },
  {
    id: "root-2",
    label: "Applications",
    children: [
      { id: "app-1", label: "Catalog service" },
      { id: "app-2", label: "Billing service" },
    ],
  },
  {
    id: "leaf-root",
    label: "Standalone leaf",
  },
];

const deepItems: TreeNode[] = [
  {
    id: "l1",
    label: "Level 1",
    children: [
      {
        id: "l2",
        label: "Level 2",
        children: [
          {
            id: "l3",
            label: "Level 3",
            children: [
              {
                id: "l4",
                label: "Level 4",
                children: [
                  {
                    id: "l5",
                    label: "Level 5",
                    children: [{ id: "l6", label: "Level 6 leaf" }],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const meta: Meta<typeof Tree> = {
  title: "Spec Generated/DAP/Joe-Generated/Tree",
  component: Tree,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Tree. Implementation: `storybook/src/components/dap/joe-generated/Tree/Tree.tsx` + `Tree.css`. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Tree/tree.mdx`.",
      },
    },
  },
  argTypes: {
    showIcon: { control: "boolean" },
    showBadge: { control: "boolean" },
    onTreeItemClick: { action: "onTreeItemClick" },
    onExpandChange: { action: "onExpandChange" },
  },
  args: {
    items: nestedItems,
    showIcon: true,
    showBadge: true,
    defaultExpandedIds: ["root-1", "compute"],
    defaultSelectedId: "host-a",
  },
  decorators: [
    (Story) => (
      <div
        style={{
          maxWidth: 320,
          padding: 16,
          background: "var(--color-background-surface-1, #f4f4f4)",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tree>;

/** MDX Spec Accurate Design parity (Mode A flat sample) */
export const SpecAccurateDesign: Story = {
  args: {
    items: sixFlatRows,
    defaultSelectedId: "row-2",
    showIcon: true,
    showBadge: true,
    defaultExpandedIds: [],
  },
};

export const Default: Story = {
  args: {
    items: nestedItems,
    defaultExpandedIds: ["root-1", "compute"],
    defaultSelectedId: "host-a",
    showIcon: true,
    showBadge: true,
  },
};

export const WithoutIcons: Story = {
  args: {
    items: nestedItems,
    defaultExpandedIds: ["root-1"],
    showIcon: false,
    showBadge: true,
  },
};

export const WithoutBadges: Story = {
  args: {
    items: nestedItems,
    defaultExpandedIds: ["root-1", "compute"],
    showIcon: true,
    showBadge: false,
  },
};

export const DeepIndentation: Story = {
  args: {
    items: deepItems,
    defaultExpandedIds: ["l1", "l2", "l3", "l4", "l5"],
    defaultSelectedId: "l6",
    showIcon: true,
    showBadge: false,
  },
};

export const ControlledSelection: Story = {
  render: function ControlledSelectionStory(args) {
    const [selectedId, setSelectedId] = useState("row-2");
    return (
      <Tree
        {...args}
        items={sixFlatRows}
        selectedId={selectedId}
        showIcon
        showBadge
        onTreeItemClick={(detail) => {
          setSelectedId(detail.id);
          args.onTreeItemClick?.(detail);
        }}
      />
    );
  },
};

export const LongLabelTruncation: Story = {
  args: {
    items: [
      {
        id: "long",
        label: "A very long tree item label that should truncate with an ellipsis",
        badgeCount: 12,
      },
      {
        id: "short",
        label: "Short",
        badgeCount: 1,
      },
    ],
    defaultSelectedId: "long",
    showIcon: true,
    showBadge: true,
  },
};
