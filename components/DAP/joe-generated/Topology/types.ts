/* ============================================================
   Topology — Data & Engine Types
   These types are engine-agnostic. The Topology component and
   its Node/Link sub-components are defined purely in terms of
   this data contract, so the rendering engine (GoJS today) can
   be swapped for another library later without changing the
   public API.
   ============================================================ */

export type NodeShapeKind = "circle" | "square" | "hexagon";

export type NodeStatus = "ok" | "warning" | "error" | "critical";

export type NodeKind = "single" | "group";

export type LinkStyleKind = "solid" | "dashed" | "dotted";

export interface TopologyNodeData {
  /** Unique identifier for the node. */
  key: string;
  /** Name shown centered 8px under the node (max 24 chars, middle-truncated). */
  name: string;
  /** Type name shown centered 8px under the Name (max 24 chars, middle-truncated). */
  typeName?: string;
  /** Shape of the node. Defaults to "circle". */
  shape?: NodeShapeKind;
  /** Icon slug, resolved to `${iconsBasePath}/${icon}.svg`. Required — every Node must show an icon. */
  icon: string;
  /** Optional status indicator drawn in the upper-right corner. */
  status?: NodeStatus;
  /** Single-Node or Group-Node. Defaults to "single". */
  kind?: NodeKind;
  /** X position, in diagram coordinates. */
  x: number;
  /** Y position, in diagram coordinates. */
  y: number;
  /** Whether the node is currently selected (controlled). */
  selected?: boolean;
  /** Whether the Name label is shown. Defaults to true. */
  showName?: boolean;
  /** Whether the Type-Name label is shown. Defaults to true. */
  showTypeName?: boolean;
  /** Number of direct children represented by a Group-Node's badge. */
  childCount?: number;
  /**
   * Actual child Node data for a Group-Node, revealed (along with a Link
   * from this Node to each one) when the Group-Node is clicked. A child may
   * itself be a Group-Node with its own `children`, expandable
   * independently. Only meaningful when `kind: "group"`.
   */
  children?: TopologyNodeData[];
}

export interface TopologyLinkData {
  /** Unique identifier for the link. */
  key: string;
  /** Key of the Node on one side of the link. */
  from: string;
  /** Key of the Node on the other side of the link. */
  to: string;
  /** Stroke color. Defaults to "#757575". */
  color?: string;
  /** Stroke style. Defaults to "solid". */
  style?: LinkStyleKind;
}

export interface TopologyEngineOptions {
  /** Diameter/side length of a node's shape, in pixels. Defaults to 48. */
  nodeSize?: number;
  /** Base path used to resolve icon/status slugs to `.svg` assets. */
  iconsBasePath?: string;
  /**
   * Smallest a Node (its shape(s), icon, status indicator, and badge —
   * not the Name/Type-Name labels) is ever allowed to render on screen,
   * in viewport pixels, regardless of zoom-out level. Defaults to 16.
   */
  minNodeSize?: number;
  /**
   * Largest a Node (its shape(s), icon, status indicator, and badge —
   * not the Name/Type-Name labels) is ever allowed to render on screen,
   * in viewport pixels, regardless of zoom-in level. Defaults to 64.
   */
  maxNodeSize?: number;
}

export interface TopologyEngineHandlers {
  onNodeMove?: (key: string, x: number, y: number) => void;
  onSelectionChange?: (selectedKeys: string[]) => void;
  /** Fired specifically when a Node is clicked and becomes the selected Node. */
  onNodeSelect?: (key: string) => void;
}
