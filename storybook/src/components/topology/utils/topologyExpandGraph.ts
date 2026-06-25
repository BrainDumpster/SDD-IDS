import type { TopologyElementType } from "../../../spec-contracts/topology/synapse-topology-element.contract";
import type {
  TopologyEdgeData,
  TopologyLoadChildrenResult,
  TopologyNodeData,
  TopologyNodeStatus,
} from "../../../spec-contracts/topology/synapse-topology.contract";

export interface TopologyExpandChildSpec {
  id: string;
  label: string;
  elementType: TopologyElementType;
  status?: TopologyNodeStatus;
  childCount?: number;
}

interface LayoutOptions {
  horizontalSpacing?: number;
  verticalOffset?: number;
}

const DEFAULT_LAYOUT: Required<LayoutOptions> = {
  horizontalSpacing: 160,
  verticalOffset: 150,
};

/** Demo hierarchy: datacenter → clusters → hosts / hypervisor (multi-level expand). */
export const TOPOLOGY_EXPAND_CHILDREN_BY_PARENT: Record<string, TopologyExpandChildSpec[]> = {
  "dc-root": [
    {
      id: "cluster-a",
      label: "Compute Cluster A",
      elementType: "cluster",
      status: "warning",
      childCount: 2,
    },
    {
      id: "cluster-b",
      label: "Storage Cluster B",
      elementType: "cluster",
      status: "success",
      childCount: 2,
    },
  ],
  "cluster-a": [
    {
      id: "host-a1",
      label: "Host / Compute A1",
      elementType: "hostCompute",
      status: "success",
    },
    {
      id: "host-a2",
      label: "Host / Storage A2",
      elementType: "hostStorage",
      status: "major",
    },
  ],
  "cluster-b": [
    {
      id: "host-b1",
      label: "Host / Network B1",
      elementType: "hostNetwork",
      status: "success",
    },
    {
      id: "hypervisor-b1",
      label: "Hypervisor B1",
      elementType: "hypervisor",
      status: "syncing",
    },
  ],
};

export function layoutTopologyChildNodes(
  parent: TopologyNodeData,
  specs: TopologyExpandChildSpec[],
  options: LayoutOptions = {},
): TopologyNodeData[] {
  const { horizontalSpacing, verticalOffset } = { ...DEFAULT_LAYOUT, ...options };
  const count = specs.length;
  const startX = parent.x - ((count - 1) * horizontalSpacing) / 2;

  return specs.map((spec, index) => ({
    id: spec.id,
    label: spec.label,
    elementType: spec.elementType,
    status: spec.status,
    childCount: spec.childCount,
    expanded: false,
    parentId: parent.id,
    x: startX + index * horizontalSpacing,
    y: parent.y + verticalOffset,
  }));
}

export function buildTopologyParentEdges(
  parentId: string,
  childNodes: TopologyNodeData[],
  edgeType: TopologyEdgeData["edgeType"] = "connectedTo",
): TopologyEdgeData[] {
  return childNodes.map((child) => ({
    id: `edge-${parentId}-${child.id}`,
    sourceId: parentId,
    targetId: child.id,
    edgeType,
  }));
}

export function loadTopologyExpandChildren(
  nodeId: string,
  nodes: TopologyNodeData[],
): TopologyLoadChildrenResult {
  const parent = nodes.find((node) => node.id === nodeId);
  const specs = TOPOLOGY_EXPAND_CHILDREN_BY_PARENT[nodeId] ?? [];

  if (!parent || specs.length === 0) {
    return { nodes: [], edges: [] };
  }

  const childNodes = layoutTopologyChildNodes(parent, specs);
  const edges = buildTopologyParentEdges(nodeId, childNodes);

  return { nodes: childNodes, edges };
}

export function collectTopologyDescendantIds(
  parentId: string,
  nodes: ReadonlyArray<Pick<TopologyNodeData, "id" | "parentId">>,
): string[] {
  const direct = nodes.filter((node) => node.parentId === parentId).map((node) => node.id);
  return [...direct, ...direct.flatMap((id) => collectTopologyDescendantIds(id, nodes))];
}
