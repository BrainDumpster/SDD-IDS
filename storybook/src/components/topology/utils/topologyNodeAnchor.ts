import {
  SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX,
  SYNAPSE_TOPOLOGY_ELEMENT_SHELL_SIZE_PX,
  SYNAPSE_TOPOLOGY_ELEMENT_SHAPES,
  type TopologyElementType,
} from "../../../spec-contracts/topology/synapse-topology-element.contract";
import type { TopologyPoint } from "./topologyEdgePath";

export function topologyNodeShellSize(elementType?: TopologyElementType): number {
  const shape = elementType ? SYNAPSE_TOPOLOGY_ELEMENT_SHAPES[elementType] : "circle";
  return shape === "pentagon" ? SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX : SYNAPSE_TOPOLOGY_ELEMENT_SHELL_SIZE_PX;
}

export function topologyNodeShellRadius(elementType?: TopologyElementType): number {
  return topologyNodeShellSize(elementType) / 2;
}

/** Shell center in canvas coordinates (node `x` is horizontal center). */
export function topologyNodeShellCenter(node: { x: number; y: number; elementType?: TopologyElementType }): TopologyPoint {
  const size = topologyNodeShellSize(node.elementType);
  return { x: node.x, y: node.y + size / 2 };
}

/**
 * Anchor on shell edge where a horizontal connector meets the node (Figma `54010:295831`).
 * `connectY` is the routing band — source uses source shell center Y, target uses target shell center Y.
 */
export function topologyNodeHorizontalAnchor(
  node: { x: number; y: number; elementType?: TopologyElementType },
  peerCenter: TopologyPoint,
  connectY: number,
): TopologyPoint {
  const center = topologyNodeShellCenter(node);
  const radius = topologyNodeShellRadius(node.elementType);
  const dy = Math.max(-radius, Math.min(radius, connectY - center.y));
  const dxOnShell = Math.sqrt(Math.max(0, radius * radius - dy * dy));
  const peerIsRight = peerCenter.x > center.x;
  return {
    x: peerIsRight ? center.x + dxOnShell : center.x - dxOnShell,
    y: connectY,
  };
}

/** Source/target pair for a directed edge (horizontal exit + horizontal entry). */
export function topologyNodeEdgeAnchors(
  source: { x: number; y: number; elementType?: TopologyElementType },
  target: { x: number; y: number; elementType?: TopologyElementType },
): { from: TopologyPoint; to: TopologyPoint } {
  const sourceCenter = topologyNodeShellCenter(source);
  const targetCenter = topologyNodeShellCenter(target);
  return {
    from: topologyNodeHorizontalAnchor(source, targetCenter, sourceCenter.y),
    to: topologyNodeHorizontalAnchor(target, sourceCenter, targetCenter.y),
  };
}
