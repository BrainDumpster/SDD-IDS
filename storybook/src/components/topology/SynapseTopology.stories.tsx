/* Spec Generated — Synapse Topology */
import "../../../../components/synapse-theme.css";
import type { Meta, StoryObj } from "@storybook/react";
import React, { type ComponentProps } from "react";
import { Topology } from "./Topology";
import { TopologyStoryCodePanel } from "./TopologyStoryCodePanel";
import {
  TOPOLOGY_CUSTOM_GRAPH_SNIPPET,
  TOPOLOGY_DEVELOPER_USAGE_OVERVIEW,
  TOPOLOGY_FILTER_TOOLBAR_SNIPPET,
  TOPOLOGY_LAZY_CHILDREN_SNIPPET,
  TOPOLOGY_NODE_GROUP_SNIPPET,
  TOPOLOGY_DETAIL_PANEL_SNIPPET,
  TOPOLOGY_ELEMENT_TYPES_SNIPPET,
  TOPOLOGY_EXPAND_NEXT_LEVEL_SNIPPET,
  TOPOLOGY_SPEC_ACCURATE_SNIPPET,
} from "../../spec-contracts/topology/synapse-topology.docs-snippets";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_DESIGN_SPEC_PATH,
  SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH,
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES,
  SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES,
  SYNAPSE_TOPOLOGY_NODE_SPEC_PATH,
  SYNAPSE_TOPOLOGY_PAGE_LAYOUT_NODE_ID,
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
  SYNAPSE_TOPOLOGY_SPEC_ACCURATE_NODE_ID,
  type TopologyNodeData,
} from "../../spec-contracts/topology/synapse-topology.contract";
import {
  SYNAPSE_TOPOLOGY_GROUP_DESIGN_SPEC_PATH,
  SYNAPSE_TOPOLOGY_GROUP_FRAME_NODE_ID,
  SYNAPSE_TOPOLOGY_GROUP_LABEL_SHOW_COUNT_NODE_ID,
  SYNAPSE_TOPOLOGY_GROUP_SAMPLE,
} from "../../spec-contracts/topology/synapse-topology-group.contract";
import { loadTopologyExpandChildren } from "./utils/topologyExpandGraph";

const specAccurateArgs: ComponentProps<typeof Topology> = {
  nodes: [...SYNAPSE_TOPOLOGY_SAMPLE_NODES],
  edges: [...SYNAPSE_TOPOLOGY_SAMPLE_EDGES],
  ...SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
};

const docsSource = (code: string) => ({
  type: "code" as const,
  code,
  language: "tsx" as const,
  state: "open" as const,
});

const meta: Meta<typeof Topology> = {
  title: "Spec Generated/Synapse/Topology",
  component: Topology,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_DEVELOPER_USAGE_OVERVIEW),
      description: {
        component: [
          `Spec-driven Synapse Topology canvas. Source: \`${SYNAPSE_TOPOLOGY_DESIGN_SPEC_PATH}\`.`,
          `Node spec: \`${SYNAPSE_TOPOLOGY_NODE_SPEC_PATH}\`.`,
          `Element shapes: \`${SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH}\` — see **Element Types** story.`,
          `Page layout Figma: \`${SYNAPSE_TOPOLOGY_PAGE_LAYOUT_NODE_ID}\`; default node: \`${SYNAPSE_TOPOLOGY_SPEC_ACCURATE_NODE_ID}\`.`,
          "",
          "**Developer usage:** see the code block below the preview on **Developer Usage** (and other stories), or open the **Docs** tab after selecting a story in the sidebar.",
          "Full API tables: **Developer usage (Spec Accurate Design)** in the design spec.",
          "",
          "Theme: `components/synapse-theme.css` + `data-design-system=\"synapse\"`.",
        ].join("\n"),
      },
    },
  },
  args: specAccurateArgs,
  argTypes: {
    showFilter: { control: "boolean" },
    showLegend: { control: "boolean" },
    showMinimap: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Topology>;

function TopologyFrame(props: ComponentProps<typeof Topology>) {
  return (
    <div
      data-design-system="synapse"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 1600,
        minHeight: 780,
        height: "100%",
        margin: "0 auto",
        background: "var(--color-background-surface-1)",
        boxSizing: "border-box",
      }}
    >
      <Topology {...props} />
    </div>
  );
}

export const DeveloperUsage: Story = {
  name: "Developer Usage",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(
        [
          "// --- Spec Accurate Design (canonical sample) ---",
          TOPOLOGY_SPEC_ACCURATE_SNIPPET,
          "",
          "// --- Custom graph (your data) ---",
          TOPOLOGY_CUSTOM_GRAPH_SNIPPET,
          "",
          "// --- Filter toolbar ---",
          TOPOLOGY_FILTER_TOOLBAR_SNIPPET,
          "",
          "// --- Lazy children ---",
          TOPOLOGY_LAZY_CHILDREN_SNIPPET,
          "",
          "// --- Node group ---",
          TOPOLOGY_NODE_GROUP_SNIPPET,
          "",
          "// --- Detail panel (node click) ---",
          TOPOLOGY_DETAIL_PANEL_SNIPPET,
        ].join("\n\n"),
      ),
      description: {
        story: [
          "Copy-paste examples for app integration.",
          `See \`${SYNAPSE_TOPOLOGY_DESIGN_SPEC_PATH}\` → **Developer usage (Spec Accurate Design)** for prop tables and controlled vs uncontrolled patterns.`,
          "Sample constants: `storybook/src/spec-contracts/topology/synapse-topology.contract.ts`.",
        ].join(" "),
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel
      title="Developer usage — all scenarios"
      code={[
        "// --- Spec Accurate Design (canonical sample) ---",
        TOPOLOGY_SPEC_ACCURATE_SNIPPET,
        "",
        "// --- Custom graph ---",
        TOPOLOGY_CUSTOM_GRAPH_SNIPPET,
        "",
        "// --- Filter toolbar ---",
        TOPOLOGY_FILTER_TOOLBAR_SNIPPET,
        "",
        "// --- Lazy children ---",
        TOPOLOGY_LAZY_CHILDREN_SNIPPET,
        "",
        "// --- Node group ---",
        TOPOLOGY_NODE_GROUP_SNIPPET,
        "",
        "// --- Detail panel ---",
        TOPOLOGY_DETAIL_PANEL_SNIPPET,
      ].join("\n\n")}
    >
      <TopologyFrame {...specAccurateArgs} />
    </TopologyStoryCodePanel>
  ),
};

export const SpecAccurateDesign: Story = {
  name: "Spec Accurate Design",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_SPEC_ACCURATE_SNIPPET),
      description: {
        story: [
          "Canonical reference scenario (Figma `54009:293109`).",
          "Uses `SYNAPSE_TOPOLOGY_SAMPLE_NODES` + `SYNAPSE_TOPOLOGY_SAMPLE_EDGES` from the spec contract.",
          "For all nine element shapes, use the **Element Types** story.",
        ].join(" "),
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_SPEC_ACCURATE_SNIPPET} title="Spec Accurate Design">
      <TopologyFrame {...specAccurateArgs} />
    </TopologyStoryCodePanel>
  ),
};

export const ElementTypes: Story = {
  name: "Element Types",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_ELEMENT_TYPES_SNIPPET),
      description: {
        story: [
          "All nine `.Topology Element` types on the canvas (Figma `52497:196934`).",
          `Spec: \`${SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH}\`.`,
          "Hover a node to see shape-matched outline and delayed tooltip.",
        ].join(" "),
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_ELEMENT_TYPES_SNIPPET} title="Element Types">
      <TopologyFrame
        nodes={[...SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES]}
        edges={[]}
        showLegend={false}
        {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
      />
    </TopologyStoryCodePanel>
  ),
};

export const WithFilterToolbar: Story = {
  name: "Toolbar / Show Filter",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_FILTER_TOOLBAR_SNIPPET),
      description: {
        story: "Toolbar with status filter chip + Add Filter (Figma `54010:295686`).",
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_FILTER_TOOLBAR_SNIPPET} title="Toolbar / Show Filter">
      <TopologyFrame {...specAccurateArgs} showFilter filterDropdownOpen />
    </TopologyStoryCodePanel>
  ),
};

const LAZY_CHILDREN: Record<string, TopologyNodeData[]> = {
  "dc-1": [
    {
      id: "host-lazy-1",
      label: "Lazy Host A",
      elementType: "hostCompute",
      status: "success",
      parentId: "dc-1",
      x: 120,
      y: 290,
    },
    {
      id: "host-lazy-2",
      label: "Lazy Host B",
      elementType: "hostStorage",
      status: "major",
      parentId: "dc-1",
      x: 240,
      y: 310,
    },
  ],
};

export const ExpandNextLevel: Story = {
  name: "Expand Next Level",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_EXPAND_NEXT_LEVEL_SNIPPET),
      description: {
        story: [
          "Click the **count badge** on the datacenter to load **clusters** (level 2).",
          "Expand a cluster to load **hosts / hypervisor** (level 3) with connecting edges.",
          "Collapse removes the loaded subtree.",
        ].join(" "),
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_EXPAND_NEXT_LEVEL_SNIPPET} title="Expand Next Level">
      <TopologyFrame
        nodes={[...SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES]}
        edges={[]}
        showLegend
        {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
        loadChildren={async (nodeId, { nodes }) => {
          await new Promise((resolve) => setTimeout(resolve, 300));
          return loadTopologyExpandChildren(nodeId, nodes);
        }}
      />
    </TopologyStoryCodePanel>
  ),
};

export const LazyExpandDemo: Story = {
  name: "Lazy / Expand Children",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_LAZY_CHILDREN_SNIPPET),
      description: {
        story: "Minimal lazy expand on the spec-accurate datacenter node (`dc-1`).",
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_LAZY_CHILDREN_SNIPPET} title="Lazy / Expand Children">
      <TopologyFrame
        {...specAccurateArgs}
        loadChildren={async (nodeId, { nodes: graphNodes }) => {
          await new Promise((resolve) => setTimeout(resolve, 400));
          const children = LAZY_CHILDREN[nodeId] ?? [];
          const parent = graphNodes.find((node) => node.id === nodeId);
          if (!parent || children.length === 0) {
            return { nodes: [], edges: [] };
          }
          return {
            nodes: children,
            edges: children.map((child) => ({
              id: `edge-${nodeId}-${child.id}`,
              sourceId: nodeId,
              targetId: child.id,
              edgeType: "connectedTo" as const,
            })),
          };
        }}
      />
    </TopologyStoryCodePanel>
  ),
};

export const WithDetailPanel: Story = {
  name: "Detail Panel / Node Click",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_DETAIL_PANEL_SNIPPET),
      description: {
        story:
          "Click a node to open Synapse Detail Panel. Canvas shrinks to make room (Figma `54012:298595`).",
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_DETAIL_PANEL_SNIPPET} title="Detail Panel / Node Click">
      <TopologyFrame
        {...specAccurateArgs}
        showDetailPanel
        detailPanelPrimaryAction={{ label: "Primary Action" }}
        detailPanelSecondaryAction={{ label: "Secondary Action" }}
      />
    </TopologyStoryCodePanel>
  ),
};

export const NodeGroupScenario: Story = {
  name: "Node Group",
  parameters: {
    layout: "fullscreen",
    docs: {
      source: docsSource(TOPOLOGY_NODE_GROUP_SNIPPET),
      description: {
        story: [
          `Group spec: \`${SYNAPSE_TOPOLOGY_GROUP_DESIGN_SPEC_PATH}\`.`,
          `Figma frame: \`${SYNAPSE_TOPOLOGY_GROUP_FRAME_NODE_ID}\`; label Show Count=true: \`${SYNAPSE_TOPOLOGY_GROUP_LABEL_SHOW_COUNT_NODE_ID}\`.`,
        ].join(" "),
      },
    },
  },
  render: () => (
    <TopologyStoryCodePanel code={TOPOLOGY_NODE_GROUP_SNIPPET} title="Node Group">
      <TopologyFrame
        nodes={[]}
        edges={[]}
        groups={[SYNAPSE_TOPOLOGY_GROUP_SAMPLE]}
        showLegend={false}
        {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
      />
    </TopologyStoryCodePanel>
  ),
};
