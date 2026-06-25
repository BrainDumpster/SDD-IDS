/**
 * Developer-facing code samples for Storybook Docs (Spec Generated / Synapse / Topology).
 * Shown via parameters.docs.source.code — not auto-extracted from story render functions.
 */

export const TOPOLOGY_DEVELOPER_USAGE_OVERVIEW = `import "../../../../components/synapse-theme.css";
import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";

/** Wrap with data-design-system="synapse" and load synapse-theme.css once at app root. */
export function TopologyExample() {
  return (
    <div data-design-system="synapse" style={{ minHeight: 780, maxWidth: 1600 }}>
      <Topology
        nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
        edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
        {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
      />
    </div>
  );
}`;

export const TOPOLOGY_SPEC_ACCURATE_SNIPPET = `import "../../../../components/synapse-theme.css";
import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";

// Spec Accurate Design — canonical 3-node graph (Figma 54009:293109)
<Topology
  nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
  edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
  showFilter={false}
  showLegend={true}
  showMinimap={false}
  searchQuery=""
/>`;

export const TOPOLOGY_CUSTOM_GRAPH_SNIPPET = `import { Topology } from "./Topology";
import type { TopologyEdgeData, TopologyNodeData } from "../../spec-contracts/topology/synapse-topology.contract";

const nodes: TopologyNodeData[] = [
  {
    id: "dc-1",
    label: "Datacenter East",
    elementType: "datacenter",
    status: "success",
    x: 180,
    y: 140,
    childCount: 20,
  },
  {
    id: "host-1",
    label: "Host / Compute",
    elementType: "hostCompute",
    status: "warning",
    x: 320,
    y: 280,
  },
];

const edges: TopologyEdgeData[] = [
  { id: "e1", sourceId: "dc-1", targetId: "host-1", edgeType: "connectedTo" },
];

<Topology
  nodes={nodes}
  edges={edges}
  showLegend
  onNodeSelect={(id) => console.log("selected", id)}
  onSearchChange={(query) => console.log("search", query)}
/>`;

export const TOPOLOGY_FILTER_TOOLBAR_SNIPPET = `import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";

<Topology
  nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
  edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
  showFilter={true}
  statusFilter="all"
  filterDropdownOpen={false}
  onStatusFilterChange={(value) => console.log("status filter", value)}
  onAddFilter={() => console.log("add filter")}
/>`;

export const TOPOLOGY_LAZY_CHILDREN_SNIPPET = `import { Topology } from "./Topology";
import type { TopologyNodeData } from "../../spec-contracts/topology/synapse-topology.contract";

const nodes: TopologyNodeData[] = [
  {
    id: "dc-1",
    label: "Datacenter East",
    elementType: "datacenter",
    status: "success",
    x: 180,
    y: 140,
    childCount: 20,
    expanded: false,
  },
];

<Topology
  nodes={nodes}
  edges={[]}
  loadChildren={async (nodeId, { nodes: graphNodes }) => {
    if (nodeId !== "dc-1") return { nodes: [], edges: [] };
    const parent = graphNodes.find((node) => node.id === nodeId)!;
    const children: TopologyNodeData[] = [
      { id: "host-1", label: "Host A", elementType: "hostCompute", status: "success", parentId: nodeId, x: parent.x - 80, y: parent.y + 150 },
      { id: "host-2", label: "Host B", elementType: "hostStorage", status: "major", parentId: nodeId, x: parent.x + 80, y: parent.y + 150 },
    ];
    return {
      nodes: children,
      edges: children.map((child) => ({
        id: \`edge-\${nodeId}-\${child.id}\`,
        sourceId: nodeId,
        targetId: child.id,
        edgeType: "connectedTo",
      })),
    };
  }}
  onNodeExpandToggle={(id, expanded) => console.log(id, expanded)}
/>`;

export const TOPOLOGY_EXPAND_NEXT_LEVEL_SNIPPET = `import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";
import { loadTopologyExpandChildren } from "./utils/topologyExpandGraph";

// Start with one datacenter; expand badge loads next level (clusters → hosts).
<Topology
  nodes={SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES}
  edges={[]}
  {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
  loadChildren={async (nodeId, { nodes }) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return loadTopologyExpandChildren(nodeId, nodes);
  }}
/>`;

export const TOPOLOGY_NODE_GROUP_SNIPPET = `import { Topology } from "./Topology";
import { SYNAPSE_TOPOLOGY_GROUP_SAMPLE } from "../../spec-contracts/topology/synapse-topology-group.contract";

// Node group — Figma 53265:128999 (see topology/group/design-spec.md)
<Topology
  nodes={[]}
  edges={[]}
  groups={[SYNAPSE_TOPOLOGY_GROUP_SAMPLE]}
  showLegend={false}
/>`;

export const TOPOLOGY_DETAIL_PANEL_SNIPPET = `import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_SAMPLE_EDGES,
  SYNAPSE_TOPOLOGY_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";
import type { SynapseDetailPanelKeyValueRow } from "../../spec-contracts/synapse-detail-panel.contract";

<Topology
  nodes={SYNAPSE_TOPOLOGY_SAMPLE_NODES}
  edges={SYNAPSE_TOPOLOGY_SAMPLE_EDGES}
  showDetailPanel
  showLegend
  getNodeDetailTitle={(node) => node.label}
  getNodeDetailSubtitle={(node) => "Hardware Node"}
  getNodeDetailRows={(node): SynapseDetailPanelKeyValueRow[] => [
    { label: "Status:", value: node.status ?? "none", variant: "status" },
    { label: "Label:", value: node.label },
  ]}
  renderNodeDetail={({ node }) => (
    <div>Custom body for {node.id}</div>
  )}
  detailPanelPrimaryAction={{ label: "Primary Action" }}
  detailPanelSecondaryAction={{ label: "Secondary Action" }}
/>`;

export const TOPOLOGY_ELEMENT_TYPES_SNIPPET = `import { Topology } from "./Topology";
import {
  SYNAPSE_TOPOLOGY_DEFAULT_ARGS,
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES,
} from "../../spec-contracts/topology/synapse-topology.contract";

// All nine .Topology Element shapes on canvas (Figma 52497:196934)
<Topology
  nodes={SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES}
  edges={[]}
  {...SYNAPSE_TOPOLOGY_DEFAULT_ARGS}
  showLegend={false}
/>`;

export const TOPOLOGY_GRAPH_ADAPTER_SNIPPET = `import type { TopologyGraphAdapter } from "../../spec-contracts/topology/synapse-topology-adapter.contract";
import {
  SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES,
  SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS,
} from "../../spec-contracts/topology/synapse-topology-adapter.contract";
import { TopologyNodeTooltip } from "./TopologyNodeTooltip";
import { TopologyNode } from "./TopologyNode";

/**
 * Mode B — third-party graph library + Synapse chrome.
 * Load specs listed in SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS (no Topology.tsx required).
 */
const adapter: TopologyGraphAdapter = {
  nodes: myLibrary.getNodes(),
  edges: myLibrary.getEdges(),
  getNodePosition: (id) => myLibrary.getPosition(id),
  getEdgeStyle: (edge) => SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES[edge.edgeType],
  getNodeTooltip: (id) => {
    const node = myLibrary.getNode(id);
    return node
      ? { title: node.label, rows: [{ label: "Type:", value: node.type }] }
      : undefined;
  },
  onNodeSelect: (id) => myLibrary.select(id),
};

// Render inside library node slot:
// <TopologyNode {...node} embedded />
// Hover: <TopologyNodeTooltip {...adapter.getNodeTooltip(id)} />`;
