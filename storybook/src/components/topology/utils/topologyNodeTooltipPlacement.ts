import { SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH } from "../../../spec-contracts/topology/synapse-topology.contract";

export interface TopologyCanvasRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TopologyCanvasViewport {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type TopologyTooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TopologyTooltipPosition {
  left: number;
  top: number;
  placement: TopologyTooltipPlacement;
}

const TOOLTIP_GAP_PX = 8;
const VIEWPORT_MARGIN_PX = 8;

const PLACEMENT_ORDER: TopologyTooltipPlacement[] = ["top", "bottom", "right", "left"];

/** Node bounds in canvas-layer coordinates (same space as `TopologyNode` `left`/`top`). */
export function topologyNodeCanvasRect(nodeEl: HTMLElement): TopologyCanvasRect | undefined {
  const layer = nodeEl.closest("[data-topology-canvas-layer]") as HTMLElement | null;
  if (!layer) return undefined;

  const layerRect = layer.getBoundingClientRect();
  const nodeRect = nodeEl.getBoundingClientRect();
  const scale = layer.clientWidth > 0 ? layerRect.width / layer.clientWidth : 1;

  return {
    x: (nodeRect.left - layerRect.left) / scale,
    y: (nodeRect.top - layerRect.top) / scale,
    width: nodeRect.width / scale,
    height: nodeRect.height / scale,
  };
}

export function getCanvasViewportBounds(
  viewportEl: HTMLElement,
  scale: number,
  translate: { x: number; y: number },
): TopologyCanvasViewport {
  const safeScale = scale > 0 ? scale : 1;
  return {
    left: -translate.x / safeScale,
    top: -translate.y / safeScale,
    width: viewportEl.clientWidth / safeScale,
    height: viewportEl.clientHeight / safeScale,
  };
}

export function estimateTopologyTooltipHeight(rowCount: number): number {
  const paddingY = 16 * 2;
  const headerBlock = 20 + 8;
  const rowBlock = rowCount > 0 ? 8 + rowCount * 28 : 0;
  return paddingY + headerBlock + rowBlock;
}

function computePlacementPosition(
  placement: TopologyTooltipPlacement,
  node: TopologyCanvasRect,
  tooltipWidth: number,
  tooltipHeight: number,
): { left: number; top: number } {
  const centerX = node.x + node.width / 2;
  const centerY = node.y + node.height / 2;

  switch (placement) {
    case "top":
      return {
        left: centerX - tooltipWidth / 2,
        top: node.y - TOOLTIP_GAP_PX - tooltipHeight,
      };
    case "bottom":
      return {
        left: centerX - tooltipWidth / 2,
        top: node.y + node.height + TOOLTIP_GAP_PX,
      };
    case "right":
      return {
        left: node.x + node.width + TOOLTIP_GAP_PX,
        top: centerY - tooltipHeight / 2,
      };
    case "left":
      return {
        left: node.x - TOOLTIP_GAP_PX - tooltipWidth,
        top: centerY - tooltipHeight / 2,
      };
    default:
      return {
        left: centerX - tooltipWidth / 2,
        top: node.y - TOOLTIP_GAP_PX - tooltipHeight,
      };
  }
}

function fitsInViewport(
  left: number,
  top: number,
  tooltipWidth: number,
  tooltipHeight: number,
  viewport: TopologyCanvasViewport,
): boolean {
  const margin = VIEWPORT_MARGIN_PX;
  return (
    left >= viewport.left + margin &&
    top >= viewport.top + margin &&
    left + tooltipWidth <= viewport.left + viewport.width - margin &&
    top + tooltipHeight <= viewport.top + viewport.height - margin
  );
}

function clampPosition(
  left: number,
  top: number,
  tooltipWidth: number,
  tooltipHeight: number,
  viewport: TopologyCanvasViewport,
): { left: number; top: number } {
  const margin = VIEWPORT_MARGIN_PX;
  const minLeft = viewport.left + margin;
  const minTop = viewport.top + margin;
  const maxLeft = viewport.left + viewport.width - tooltipWidth - margin;
  const maxTop = viewport.top + viewport.height - tooltipHeight - margin;

  return {
    left: Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft)),
    top: Math.min(Math.max(top, minTop), Math.max(minTop, maxTop)),
  };
}

/** Default top-center; falls back through bottom/right/left, then clamps. */
export function resolveTopologyTooltipPlacement(
  node: TopologyCanvasRect,
  tooltipWidth: number,
  tooltipHeight: number,
  viewport: TopologyCanvasViewport,
): TopologyTooltipPosition {
  const width = tooltipWidth > 0 ? tooltipWidth : SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH;

  for (const placement of PLACEMENT_ORDER) {
    const candidate = computePlacementPosition(placement, node, width, tooltipHeight);
    if (fitsInViewport(candidate.left, candidate.top, width, tooltipHeight, viewport)) {
      return { ...candidate, placement };
    }
  }

  const fallback = computePlacementPosition("top", node, width, tooltipHeight);
  const clamped = clampPosition(fallback.left, fallback.top, width, tooltipHeight, viewport);
  return { ...clamped, placement: "top" };
}
