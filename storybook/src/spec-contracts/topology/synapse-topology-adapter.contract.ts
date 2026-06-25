/**
 * Topology Mode B — third-party graph library adapter contract.
 * Spec: `components/synapse/topology/design-spec.md` § SDD delivery modes
 *
 * Use when integrating React Flow, Cytoscape, or other layout engines while
 * applying Synapse visual contracts from child design specs.
 */
import type {
  TopologyEdgeData,
  TopologyEdgeType,
  TopologyGroupData,
  TopologyNodeData,
  TopologyNodeTooltipRow,
} from "./synapse-topology.contract";

export const SYNAPSE_TOPOLOGY_ADAPTER_CONTRACT_PATH =
  "storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts" as const;

/** Edge chrome aligned with parent § Element: TopologyEdgeLayer. */
export interface TopologyGraphEdgeStyle {
  stroke: "var(--color-border-accessible)";
  strokeWidthPx: 1.5;
  strokeDasharray?: "6 4";
  arrowheadDepthPx: 7;
}

export const SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES: Record<TopologyEdgeType, TopologyGraphEdgeStyle> = {
  connectedTo: {
    stroke: "var(--color-border-accessible)",
    strokeWidthPx: 1.5,
    arrowheadDepthPx: 7,
  },
  dependsOn: {
    stroke: "var(--color-border-accessible)",
    strokeWidthPx: 1.5,
    strokeDasharray: "6 4",
    arrowheadDepthPx: 7,
  },
};

export interface TopologyGraphNodeTooltipModel {
  title: string;
  statusIconSlug?: string;
  rows: TopologyNodeTooltipRow[];
}

/**
 * Host-implemented bridge between a third-party graph engine and Synapse topology specs.
 * The adapter owns library-specific APIs; consumers map to these contracts for SDD compliance.
 */
export interface TopologyGraphAdapter {
  /** Graph model — same shapes as Mode A `Topology` props. */
  readonly nodes: ReadonlyArray<TopologyNodeData>;
  readonly edges: ReadonlyArray<TopologyEdgeData>;
  readonly groups?: ReadonlyArray<TopologyGroupData>;

  /** Resolve node position in canvas coordinates (`TopologyNode` `x`/`y` space). */
  getNodePosition(nodeId: string): { x: number; y: number } | undefined;

  /** Edge rendering contract per `edgeType` (defaults in `SYNAPSE_TOPOLOGY_GRAPH_EDGE_STYLES`). */
  getEdgeStyle?(edge: TopologyEdgeData): TopologyGraphEdgeStyle;

  /** Hover card content — render with `TopologyNodeTooltip` per node-tooltip spec. */
  getNodeTooltip?(nodeId: string): TopologyGraphNodeTooltipModel | undefined;

  /** Host events (optional — wire to app state). */
  onNodeSelect?(nodeId: string): void;
  onNodeMove?(nodeId: string, x: number, y: number): void;
  onNodeExpandToggle?(nodeId: string, expanded: boolean): void;
}

/** Spec paths Mode B implementers should load (no `Topology.tsx` required). */
export const SYNAPSE_TOPOLOGY_MODE_B_SPEC_PATHS = {
  parent: "components/synapse/topology/design-spec.md",
  node: "components/synapse/topology/node/design-spec.md",
  element: "components/synapse/topology/element/design-spec.md",
  group: "components/synapse/topology/group/design-spec.md",
  nodeTooltip: "components/synapse/topology/node-tooltip/design-spec.md",
  theme: "components/synapse-theme.css",
} as const;
