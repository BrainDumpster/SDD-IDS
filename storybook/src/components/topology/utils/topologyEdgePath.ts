export interface TopologyPoint {
  x: number;
  y: number;
}

export interface TopologyEdgeGeometry {
  path: string;
  arrowPath: string;
}

/** Nearly-flat edges render as straight segments (Figma `54010:295829`). */
const STRAIGHT_VERTICAL_THRESHOLD_PX = 4;

/** Min / max horizontal control offset for cubic flexible connectors. */
const MIN_CONTROL_OFFSET_PX = 40;
const MAX_CONTROL_OFFSET_PX = 120;
const CONTROL_OFFSET_RATIO = 0.45;

/** Filled arrowhead depth at target — matches connector `54010:295831`. */
export const TOPOLOGY_EDGE_ARROW_LENGTH_PX = 7;
const ARROW_SPREAD_RAD = Math.PI / 6;

function add(a: TopologyPoint, b: TopologyPoint): TopologyPoint {
  return { x: a.x + b.x, y: a.y + b.y };
}

function subtract(a: TopologyPoint, b: TopologyPoint): TopologyPoint {
  return { x: a.x - b.x, y: a.y - b.y };
}

function unitVector(vector: TopologyPoint): TopologyPoint {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return { x: 1, y: 0 };
  return { x: vector.x / length, y: vector.y / length };
}

function scale(vector: TopologyPoint, length: number): TopologyPoint {
  return { x: vector.x * length, y: vector.y * length };
}

/** Filled triangle arrowhead; tip sits on the shell intersection. */
function buildArrowHeadPath(tip: TopologyPoint, tangent: TopologyPoint): string {
  const angle = Math.atan2(tangent.y, tangent.x);
  const back = angle + Math.PI;
  const x1 = tip.x + Math.cos(back + ARROW_SPREAD_RAD) * TOPOLOGY_EDGE_ARROW_LENGTH_PX;
  const y1 = tip.y + Math.sin(back + ARROW_SPREAD_RAD) * TOPOLOGY_EDGE_ARROW_LENGTH_PX;
  const x2 = tip.x + Math.cos(back - ARROW_SPREAD_RAD) * TOPOLOGY_EDGE_ARROW_LENGTH_PX;
  const y2 = tip.y + Math.sin(back - ARROW_SPREAD_RAD) * TOPOLOGY_EDGE_ARROW_LENGTH_PX;
  return `M ${x1} ${y1} L ${tip.x} ${tip.y} L ${x2} ${y2} Z`;
}

/**
 * Build SVG path + filled arrowhead for Synapse topology edges.
 * Figma evidence: `54010:295826` — straight when aligned; flexible S-curve when offset (`54010:295831`).
 */
export function buildTopologyEdgeGeometry(from: TopologyPoint, to: TopologyPoint): TopologyEdgeGeometry {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dy) <= STRAIGHT_VERTICAL_THRESHOLD_PX) {
    const tangent = unitVector({ x: dx, y: dy });
    const pathEnd = add(to, scale(tangent, -TOPOLOGY_EDGE_ARROW_LENGTH_PX));
    return {
      path: `M ${from.x} ${from.y} L ${pathEnd.x} ${pathEnd.y}`,
      arrowPath: buildArrowHeadPath(to, tangent),
    };
  }

  const bend = Math.min(Math.max(Math.abs(dx) * CONTROL_OFFSET_RATIO, MIN_CONTROL_OFFSET_PX), MAX_CONTROL_OFFSET_PX);
  const exitSign = dx >= 0 ? 1 : -1;
  const c1 = { x: from.x + exitSign * bend, y: from.y };
  const c2 = { x: to.x - exitSign * bend, y: to.y };
  const endTangent = unitVector(subtract(to, c2));
  const pathEnd = add(to, scale(endTangent, -TOPOLOGY_EDGE_ARROW_LENGTH_PX));

  return {
    path: `M ${from.x} ${from.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${pathEnd.x} ${pathEnd.y}`,
    arrowPath: buildArrowHeadPath(to, endTangent),
  };
}

/** @deprecated Use `buildTopologyEdgeGeometry` — kept for tests. */
export function buildTopologyEdgePath(from: TopologyPoint, to: TopologyPoint): string {
  return buildTopologyEdgeGeometry(from, to).path;
}
