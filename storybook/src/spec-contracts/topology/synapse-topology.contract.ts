/**
 * Synapse Topology — standalone spec contract.
 * Parent: `components/synapse/topology/design-spec.md`
 * Node: `components/synapse/topology/node/design-spec.md`
 */
import {
  SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS,
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LIST,
  type TopologyElementType,
} from "./synapse-topology-element.contract";

export type { TopologyElementType };
export const SYNAPSE_TOPOLOGY_DESIGN_SPEC_PATH = "components/synapse/topology/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_NODE_SPEC_PATH = "components/synapse/topology/node/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH = "components/synapse/topology/element/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_GROUP_SPEC_PATH = "components/synapse/topology/group/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_SPEC_PATH =
  "components/synapse/topology/node-tooltip/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_ADAPTER_CONTRACT_PATH =
  "storybook/src/spec-contracts/topology/synapse-topology-adapter.contract.ts" as const;

export const SYNAPSE_TOPOLOGY_PAGE_LAYOUT_NODE_ID = "54009:293109" as const;
export const SYNAPSE_TOPOLOGY_PAGE_LAYOUT_SET_NODE_ID = "54012:298596" as const;
export const SYNAPSE_TOPOLOGY_PAGE_LAYOUT_WITH_DETAIL_NODE_ID = "54012:298595" as const;
export const SYNAPSE_TOPOLOGY_SPEC_ACCURATE_NODE_ID = "52497:198366" as const;
export const SYNAPSE_TOPOLOGY_TOOLBAR_NODE_ID = "53993:290064" as const;
export const SYNAPSE_TOPOLOGY_VIEWPORT_NODE_ID = "52586:463196" as const;
export const SYNAPSE_TOPOLOGY_VIEWPORT_CONTROLS_DOC_NODE_ID = "55459:151345" as const;
export const SYNAPSE_TOPOLOGY_LEGEND_NODE_ID = "53993:290286" as const;
export const SYNAPSE_TOPOLOGY_LEGEND_DOC_NODE_ID = "55459:151350" as const;
export const SYNAPSE_TOPOLOGY_FILTER_CHIP_NODE_ID = "54015:299554" as const;
export const SYNAPSE_TOPOLOGY_ADD_FILTER_NODE_ID = "54197:38669" as const;
export const SYNAPSE_TOPOLOGY_TOOLBAR_WITH_FILTER_NODE_ID = "54010:295686" as const;
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_NODE_ID = "55439:46060" as const;
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH = 233 as const;
/** Delay before showing hover tooltip — avoids flash on click/expand (ms). */
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS = 500 as const;
/** Chevron arm length at target perimeter (Figma `53993:290059`). */
export const SYNAPSE_TOPOLOGY_EDGE_ARROW_LENGTH_PX = 7 as const;

export const SYNAPSE_TOPOLOGY_SEARCH_PLACEHOLDER = "Search node name" as const;
export const SYNAPSE_TOPOLOGY_ZOOM_MIN_PERCENT = 25 as const;
export const SYNAPSE_TOPOLOGY_ZOOM_MAX_PERCENT = 300 as const;
export const SYNAPSE_TOPOLOGY_ZOOM_STEP_PERCENT = 10 as const;
export const SYNAPSE_TOPOLOGY_DEFAULT_ZOOM_PERCENT = 100 as const;

export type TopologyNodeStatus =
  | "none"
  | "success"
  | "warning"
  | "major"
  | "critical"
  | "syncing"
  | "notDeployed";

export type TopologyStatusFilterValue = "all" | TopologyNodeStatus;

export const SYNAPSE_TOPOLOGY_STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: TopologyStatusFilterValue;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
  { value: "syncing", label: "Syncing" },
  { value: "notDeployed", label: "Not deployed" },
] as const;

export type TopologyEdgeType = "connectedTo" | "dependsOn";

export const SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LABELS: Record<TopologyElementType, string> = {
  general: "General",
  cluster: "Cluster",
  datacenter: "Datacenter",
  hostCompute: "Hardware Node",
  hostStorage: "Hardware Node",
  hostNetwork: "Hardware Node",
  hypervisor: "Hypervisor",
  vm: "Virtual Machine",
  applicationService: "Application Service",
};

export const SYNAPSE_TOPOLOGY_ELEMENT_ICONS = SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS;

export const SYNAPSE_TOPOLOGY_STATUS_LABELS: Record<Exclude<TopologyNodeStatus, "none">, string> = {
  success: "Success",
  warning: "Warning",
  major: "Major",
  critical: "Critical",
  syncing: "Syncing",
  notDeployed: "Not deployed",
};

export const SYNAPSE_TOPOLOGY_STATUS_ICONS: Partial<Record<TopologyNodeStatus, string>> = {
  success: "status-ok-circ-solid",
  warning: "status-warn-tri-solid-16",
  major: "status-error-diamond-solid",
  critical: "status-critical-square-solid",
  syncing: "arrows-circ",
};

export interface TopologyNodeData {
  id: string;
  label: string;
  elementType?: TopologyElementType;
  iconSlug?: string;
  status?: TopologyNodeStatus;
  x: number;
  y: number;
  childCount?: number;
  expanded?: boolean;
  /** Set when node was loaded via expand; used to remove subtree on collapse. */
  parentId?: string;
  tooltipRows?: TopologyNodeTooltipRow[];
}

export interface TopologyLoadChildrenResult {
  nodes: TopologyNodeData[];
  edges?: TopologyEdgeData[];
}

export interface TopologyLoadChildrenContext {
  nodes: TopologyNodeData[];
}

export interface TopologyNodeTooltipRow {
  label: string;
  value: string;
}

export interface TopologyEdgeData {
  id: string;
  sourceId: string;
  targetId: string;
  edgeType: TopologyEdgeType;
}

/** Spec Accurate Design sample graph (3 nodes, 2 edge types). */
export const SYNAPSE_TOPOLOGY_SAMPLE_NODES: TopologyNodeData[] = [
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
  {
    id: "cluster-1",
    label: "Compute Cluster",
    elementType: "cluster",
    status: "warning",
    x: 420,
    y: 160,
    childCount: 12,
    expanded: false,
  },
  {
    id: "host-1",
    label: "Host / Compute",
    elementType: "hostCompute",
    status: "success",
    x: 300,
    y: 300,
  },
];

export const SYNAPSE_TOPOLOGY_SAMPLE_EDGES: TopologyEdgeData[] = [
  { id: "e1", sourceId: "dc-1", targetId: "cluster-1", edgeType: "connectedTo" },
  { id: "e2", sourceId: "cluster-1", targetId: "host-1", edgeType: "dependsOn" },
];

/** Canvas layout showcasing all nine `.Topology Element` types (Figma `52497:196934`). */
const ELEMENT_TYPE_SAMPLE_LABELS: Record<TopologyElementType, string> = {
  general: "General",
  datacenter: "Datacenter",
  cluster: "Cluster",
  hostCompute: "Host / Compute",
  hostStorage: "Host / Storage",
  hostNetwork: "Host / Network",
  hypervisor: "Hypervisor",
  vm: "Virtual Machine",
  applicationService: "Application / Service",
};

export const SYNAPSE_TOPOLOGY_ELEMENT_TYPE_SAMPLE_NODES: TopologyNodeData[] =
  SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LIST.map((elementType, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      id: `element-${elementType}`,
      label: ELEMENT_TYPE_SAMPLE_LABELS[elementType],
      elementType,
      status: "none",
      x: 120 + col * 180,
      y: 100 + row * 140,
    };
  });

export const SYNAPSE_TOPOLOGY_EXPAND_ROOT_NODES: TopologyNodeData[] = [
  {
    id: "dc-root",
    label: "Datacenter East",
    elementType: "datacenter",
    status: "success",
    x: 400,
    y: 120,
    childCount: 2,
    expanded: false,
  },
];

export const SYNAPSE_TOPOLOGY_DEFAULT_ARGS = {
  showFilter: false,
  showLegend: true,
  showMinimap: false,
  searchQuery: "",
  showDetailPanel: false,
} as const;
