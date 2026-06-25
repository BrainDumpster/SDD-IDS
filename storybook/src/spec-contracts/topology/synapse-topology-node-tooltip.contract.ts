/**
 * Topology Node Tooltip — standalone contract.
 * Spec: `components/synapse/topology/node-tooltip/design-spec.md`
 */
export {
  SYNAPSE_TOPOLOGY_NODE_TOOLTIP_HOVER_DELAY_MS,
  SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH,
  type TopologyNodeTooltipRow,
} from "./synapse-topology.contract";

export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_SPEC_PATH =
  "components/synapse/topology/node-tooltip/design-spec.md" as const;

export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_NODE_ID = "55439:46060" as const;

/** Gap between node bounds and tooltip card (px). */
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_GAP_PX = 8 as const;

/** Viewport margin when clamping tooltip position (px). */
export const SYNAPSE_TOPOLOGY_NODE_TOOLTIP_VIEWPORT_MARGIN_PX = 8 as const;

export type TopologyNodeTooltipPlacement = "top" | "bottom" | "left" | "right";
