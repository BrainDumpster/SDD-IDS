import type { Meta, StoryObj } from "@storybook/react";
import "../tokens.css";
import Topology from "./Topology";
import type { TopologyLinkData, TopologyNodeData } from "./types";

/**
 * Joe-Generated Topology — uses only:
 * - storybook/src/components/dap/joe-generated/Topology/Topology.tsx
 * - storybook/src/components/dap/joe-generated/Topology/Topology.css (imported by Topology.tsx)
 * - storybook/src/components/dap/joe-generated/Topology/types.ts + engine/*
 * - storybook/src/components/dap/joe-generated/tokens.css
 * Spec MDX: components/DAP/joe-generated/Topology/topology.mdx
 *
 * Icons resolve via `iconsBasePath` → `/assets/icons/<slug>.svg` (Storybook staticDirs).
 */

const ICONS_BASE = "/assets/icons";

const basicNodes: TopologyNodeData[] = [
  {
    key: "n1",
    name: "Host A",
    typeName: "Compute",
    icon: "host-server",
    shape: "circle",
    x: 80,
    y: 120,
    status: "ok",
  },
  {
    key: "n2",
    name: "Storage B",
    typeName: "Array",
    icon: "storage-array-solid",
    shape: "square",
    x: 280,
    y: 120,
    status: "warning",
  },
  {
    key: "n3",
    name: "Cloud C",
    typeName: "Service",
    icon: "cloud",
    shape: "hexagon",
    x: 180,
    y: 280,
    status: "error",
  },
];

const basicLinks: TopologyLinkData[] = [
  { key: "l1", from: "n1", to: "n2", style: "solid" },
  { key: "l2", from: "n2", to: "n3", style: "dashed" },
  { key: "l3", from: "n3", to: "n1", style: "dotted" },
];

const meta: Meta<typeof Topology> = {
  title: "Spec Generated/DAP/Joe-Generated/Topology",
  component: Topology,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Joe-generated DAP Topology. Implementation: `storybook/src/components/dap/joe-generated/Topology/Topology.tsx` + `Topology.css` + GoJS engine. Tokens: `storybook/src/components/dap/joe-generated/tokens.css`. Spec MDX: `components/DAP/joe-generated/Topology/topology.mdx`. Requires the `gojs` package at runtime.",
      },
    },
  },
  argTypes: {
    nodeSize: { control: { type: "number", min: 24, max: 64 } },
    minNodeSize: { control: { type: "number", min: 8, max: 32 } },
    maxNodeSize: { control: { type: "number", min: 32, max: 96 } },
    onNodeMove: { action: "onNodeMove" },
    onSelectionChange: { action: "onSelectionChange" },
    onNodeSelect: { action: "onNodeSelect" },
  },
  args: {
    nodes: basicNodes,
    links: basicLinks,
    nodeSize: 48,
    iconsBasePath: ICONS_BASE,
    minNodeSize: 16,
    maxNodeSize: 64,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "100%", height: 480, border: "1px solid var(--color-border-light, #c5c5c5)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Topology>;

export const Default: Story = {
  args: {
    nodes: basicNodes,
    links: basicLinks,
    iconsBasePath: ICONS_BASE,
  },
};

export const ShapesAndStatuses: Story = {
  args: {
    nodes: [
      {
        key: "circle-ok",
        name: "Circle OK",
        typeName: "circle",
        icon: "host-server",
        shape: "circle",
        status: "ok",
        x: 80,
        y: 100,
      },
      {
        key: "square-warn",
        name: "Square Warn",
        typeName: "square",
        icon: "storage-array-solid",
        shape: "square",
        status: "warning",
        x: 240,
        y: 100,
      },
      {
        key: "hex-error",
        name: "Hex Error",
        typeName: "hexagon",
        icon: "cloud",
        shape: "hexagon",
        status: "error",
        x: 400,
        y: 100,
      },
      {
        key: "circle-crit",
        name: "Critical",
        typeName: "circle",
        icon: "virtual-machine",
        shape: "circle",
        status: "critical",
        x: 240,
        y: 260,
      },
    ],
    links: [
      { key: "ls1", from: "circle-ok", to: "square-warn" },
      { key: "ls2", from: "square-warn", to: "hex-error" },
      { key: "ls3", from: "hex-error", to: "circle-crit" },
    ],
    iconsBasePath: ICONS_BASE,
  },
};

export const SelectedNode: Story = {
  args: {
    nodes: basicNodes.map((n) =>
      n.key === "n2" ? { ...n, selected: true } : n
    ),
    links: basicLinks,
    iconsBasePath: ICONS_BASE,
  },
};

export const GroupWithChildren: Story = {
  args: {
    nodes: [
      {
        key: "group-1",
        name: "Cluster",
        typeName: "Group",
        icon: "storage-cluster",
        shape: "circle",
        kind: "group",
        x: 200,
        y: 160,
        children: [
          {
            key: "child-1",
            name: "Member 1",
            typeName: "Host",
            icon: "host-server",
            shape: "circle",
            x: 80,
            y: 320,
          },
          {
            key: "child-2",
            name: "Member 2",
            typeName: "Host",
            icon: "host-server-rack",
            shape: "square",
            x: 320,
            y: 320,
            kind: "group",
            children: [
              {
                key: "nested-1",
                name: "Nested A",
                typeName: "VM",
                icon: "virtual-machine",
                shape: "hexagon",
                x: 280,
                y: 440,
              },
            ],
          },
        ],
      },
      {
        key: "edge",
        name: "Peer",
        typeName: "Node",
        icon: "cloud",
        shape: "square",
        x: 420,
        y: 160,
      },
    ],
    links: [{ key: "gl1", from: "group-1", to: "edge", style: "dashed" }],
    iconsBasePath: ICONS_BASE,
  },
};

export const LinkStyles: Story = {
  args: {
    nodes: [
      { key: "a", name: "A", icon: "host-server", x: 60, y: 140 },
      { key: "b", name: "B", icon: "cloud", x: 220, y: 140 },
      { key: "c", name: "C", icon: "storage-array-solid", x: 380, y: 140 },
      { key: "d", name: "D", icon: "virtual-machine", x: 220, y: 280 },
    ],
    links: [
      { key: "solid", from: "a", to: "b", style: "solid" },
      { key: "dashed", from: "b", to: "c", style: "dashed" },
      { key: "dotted", from: "b", to: "d", style: "dotted" },
    ],
    iconsBasePath: ICONS_BASE,
  },
};

export const TruncatedLabels: Story = {
  args: {
    nodes: [
      {
        key: "long",
        name: "A Very Long Node Name Indeed Extra",
        typeName: "Extremely Long Type Name Value",
        icon: "host-server",
        shape: "circle",
        x: 200,
        y: 180,
      },
      {
        key: "short",
        name: "Short",
        typeName: "Type",
        icon: "cloud",
        shape: "square",
        x: 400,
        y: 180,
      },
    ],
    links: [{ key: "tl1", from: "long", to: "short" }],
    iconsBasePath: ICONS_BASE,
  },
};

export const HiddenLabels: Story = {
  args: {
    nodes: basicNodes.map((n) => ({
      ...n,
      showName: false,
      showTypeName: false,
    })),
    links: basicLinks,
    iconsBasePath: ICONS_BASE,
  },
};

export const Empty: Story = {
  args: {
    nodes: [],
    links: [],
    iconsBasePath: ICONS_BASE,
  },
};
