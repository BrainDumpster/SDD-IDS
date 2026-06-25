import {
  estimateTopologyTooltipHeight,
  getCanvasViewportBounds,
  resolveTopologyTooltipPlacement,
  type TopologyCanvasRect,
} from "./topologyNodeTooltipPlacement";
import { SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH } from "../../../spec-contracts/topology/synapse-topology.contract";

describe("resolveTopologyTooltipPlacement", () => {
  const node: TopologyCanvasRect = { x: 200, y: 200, width: 44, height: 70 };
  const viewport = { left: 0, top: 0, width: 800, height: 600 };
  const tooltipWidth = SYNAPSE_TOPOLOGY_NODE_TOOLTIP_WIDTH;
  const tooltipHeight = estimateTopologyTooltipHeight(3);

  it("defaults to top-center when space is available", () => {
    const result = resolveTopologyTooltipPlacement(node, tooltipWidth, tooltipHeight, viewport);
    expect(result.placement).toBe("top");
    expect(result.left).toBeCloseTo(node.x + node.width / 2 - tooltipWidth / 2, 5);
    expect(result.top).toBeCloseTo(node.y - 8 - tooltipHeight, 5);
  });

  it("falls back to bottom when top is clipped", () => {
    const tightTop = { left: 0, top: 0, width: 800, height: node.y + node.height + tooltipHeight + 20 };
    const result = resolveTopologyTooltipPlacement(node, tooltipWidth, tooltipHeight, tightTop);
    expect(result.placement).toBe("bottom");
  });
});

describe("getCanvasViewportBounds", () => {
  it("maps viewport to canvas coordinates using pan and zoom", () => {
    const viewportEl = { clientWidth: 400, clientHeight: 300 } as HTMLElement;
    const bounds = getCanvasViewportBounds(viewportEl, 2, { x: -100, y: -50 });
    expect(bounds.left).toBe(50);
    expect(bounds.top).toBe(25);
    expect(bounds.width).toBe(200);
    expect(bounds.height).toBe(150);
  });
});
