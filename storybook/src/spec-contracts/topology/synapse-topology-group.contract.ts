/**
 * Synapse Topology Group — standalone spec contract.
 * Source: `components/synapse/topology/group/design-spec.md`
 */
import type { TopologyNodeData } from "./synapse-topology.contract";

export const SYNAPSE_TOPOLOGY_GROUP_DESIGN_SPEC_PATH =
  "components/synapse/topology/group/design-spec.md" as const;

export const SYNAPSE_TOPOLOGY_GROUP_FRAME_NODE_ID = "53265:128999" as const;
export const SYNAPSE_TOPOLOGY_GROUP_LABEL_SHOW_COUNT_NODE_ID = "53265:128979" as const;
export const SYNAPSE_TOPOLOGY_GROUP_LABEL_NO_COUNT_NODE_ID = "54988:41421" as const;
export const SYNAPSE_TOPOLOGY_GROUP_LABEL_SET_NODE_ID = "54988:41422" as const;
export const SYNAPSE_TOPOLOGY_GROUP_BORDER_NODE_ID = "53265:128986" as const;
export const SYNAPSE_TOPOLOGY_GROUP_CHROME_NODE_ID = "53283:227105" as const;

/** Figma sample horizontal gap between nodes inside group (`53265:129054`) — reference only. */
export const SYNAPSE_TOPOLOGY_GROUP_NODE_GAP_PX = 80 as const;

export interface TopologyGroupData {
  id: string;
  typeLabel: string;
  x: number;
  y: number;
  showCount?: boolean;
  childCount?: number;
  expanded?: boolean;
  showInfo?: boolean;
  showMinimize?: boolean;
  nodes: TopologyNodeData[];
}

/** Spec-accurate group sample — Figma `_Node_group-frame` `53265:128999` (3 nodes, Show Count=true). */
export const SYNAPSE_TOPOLOGY_GROUP_SAMPLE: TopologyGroupData = {
  id: "group-1",
  typeLabel: "Type name",
  x: 320,
  y: 180,
  showCount: true,
  childCount: 20,
  expanded: false,
  showInfo: true,
  showMinimize: true,
  nodes: [
    {
      id: "group-node-1",
      label: "Label name",
      elementType: "general",
      status: "success",
      childCount: 20,
      expanded: false,
      x: 22,
      y: 0,
    },
    {
      id: "group-node-2",
      label: "Label name",
      elementType: "general",
      status: "success",
      childCount: 20,
      expanded: false,
      x: 22 + 44 + SYNAPSE_TOPOLOGY_GROUP_NODE_GAP_PX,
      y: 0,
    },
    {
      id: "group-node-3",
      label: "Label name",
      elementType: "general",
      status: "success",
      childCount: 20,
      expanded: false,
      x: 22 + (44 + SYNAPSE_TOPOLOGY_GROUP_NODE_GAP_PX) * 2,
      y: 0,
    },
  ],
};
