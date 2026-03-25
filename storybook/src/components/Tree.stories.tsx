import type { Meta, StoryObj } from "@storybook/react";
import { Tree } from "./Tree";
import type { TreeNode } from "./Tree";

const meta: Meta<typeof Tree> = {
  title: "Synapse/Tree",
  component: Tree,
};

export default meta;
type Story = StoryObj<typeof Tree>;

function FolderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 4C2 3.44772 2.44772 3 3 3H6L7.5 5H13C13.5523 5 14 5.44772 14 6V12C14 12.5523 13.5523 13 13 13H3C2.44772 13 2 12.5523 2 12V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 2H9L12 5V14H4V2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 2V5H12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const threeLevel: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <FolderIcon />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <FolderIcon />,
        children: [
          { id: "button", label: "Button.tsx", icon: <FileIcon /> },
          { id: "dialog", label: "Dialog.tsx", icon: <FileIcon /> },
          { id: "tabs", label: "Tabs.tsx", icon: <FileIcon /> },
        ],
      },
      {
        id: "utils",
        label: "utils",
        icon: <FolderIcon />,
        children: [
          { id: "helpers", label: "helpers.ts", icon: <FileIcon /> },
          { id: "constants", label: "constants.ts", icon: <FileIcon /> },
        ],
      },
      { id: "index", label: "index.ts", icon: <FileIcon /> },
    ],
  },
  {
    id: "package",
    label: "package.json",
    icon: <FileIcon />,
  },
  {
    id: "tsconfig",
    label: "tsconfig.json",
    icon: <FileIcon />,
  },
];

export const ThreeLevelTree: Story = {
  args: {
    items: threeLevel,
  },
};

export const FlatList: Story = {
  args: {
    items: [
      { id: "1", label: "Document A" },
      { id: "2", label: "Document B" },
      { id: "3", label: "Document C" },
    ],
  },
};
