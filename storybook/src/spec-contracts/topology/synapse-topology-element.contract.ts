/**
 * Synapse Topology Element — shape containers for canvas nodes.
 * Spec: `components/synapse/topology/element/design-spec.md`
 */

export type TopologyElementType =
  | "general"
  | "cluster"
  | "datacenter"
  | "hostCompute"
  | "hostStorage"
  | "hostNetwork"
  | "hypervisor"
  | "vm"
  | "applicationService";

export const SYNAPSE_TOPOLOGY_ELEMENT_SPEC_PATH = "components/synapse/topology/element/design-spec.md" as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_BOARD_NODE_ID = "52497:196934" as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_COMPONENT_SET_NODE_ID = "52497:196934" as const;

export type TopologyElementShape = "circle" | "roundedSquare" | "pentagon";

export type TopologyElementInteractionState = "default" | "hover" | "selected";

export const SYNAPSE_TOPOLOGY_ELEMENT_SHELL_SIZE_PX = 44 as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_HOVER_OUTLINE_SIZE_PX = 52 as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_HOVER_OUTLINE_OFFSET_PX = 4 as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_ICON_SIZE_PX = 20 as const;

export const SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_SHELL_SIZE_PX = 48 as const;
export const SYNAPSE_TOPOLOGY_ELEMENT_PENTAGON_HOVER_SIZE_PX = 58 as const;

/** Figma `.Topology Element` type → container geometry */
export const SYNAPSE_TOPOLOGY_ELEMENT_SHAPES: Record<TopologyElementType, TopologyElementShape> = {
  general: "circle",
  hostCompute: "circle",
  hostStorage: "circle",
  hostNetwork: "circle",
  vm: "circle",
  applicationService: "circle",
  cluster: "roundedSquare",
  datacenter: "roundedSquare",
  hypervisor: "pentagon",
};

/** Default icon slug per element type (Figma `52497:196934` board). */
export const SYNAPSE_TOPOLOGY_ELEMENT_DEFAULT_ICONS: Record<TopologyElementType, string> = {
  general: "objects-square",
  cluster: "cluster-badge",
  datacenter: "data-center-front",
  hostCompute: "device-server-13g",
  hostStorage: "storage-array",
  hostNetwork: "device-switch-blade",
  hypervisor: "virtual-machine",
  vm: "app-group-vm",
  applicationService: "app-window",
};

/** Figma default-variant node ids on `.Topology Element` board */
export const SYNAPSE_TOPOLOGY_ELEMENT_FIGMA_NODES: Record<TopologyElementType, string> = {
  general: "52497:196935",
  cluster: "52497:197085",
  datacenter: "52497:197044",
  hostCompute: "52497:197088",
  hostStorage: "52497:198267",
  hostNetwork: "52497:198289",
  hypervisor: "52497:196949",
  vm: "54153:279997",
  applicationService: "52497:198317",
};

export const SYNAPSE_TOPOLOGY_ELEMENT_TYPE_LIST: TopologyElementType[] = [
  "general",
  "datacenter",
  "cluster",
  "hostCompute",
  "hostStorage",
  "hostNetwork",
  "hypervisor",
  "vm",
  "applicationService",
];
