import { buildTopologyEdgeGeometry, buildTopologyEdgePath, TOPOLOGY_EDGE_ARROW_LENGTH_PX } from "./topologyEdgePath";
import { topologyNodeEdgeAnchors } from "./topologyNodeAnchor";

describe("buildTopologyEdgeGeometry", () => {
  it("uses a straight segment when nodes are horizontally aligned", () => {
    const geometry = buildTopologyEdgeGeometry({ x: 100, y: 200 }, { x: 300, y: 202 });
    expect(geometry.path).toBe(`M 100 200 L ${300 - TOPOLOGY_EDGE_ARROW_LENGTH_PX} 202`);
    expect(geometry.arrowPath).toContain("300 202");
    expect(geometry.arrowPath).toMatch(/Z$/);
  });

  it("uses a cubic curve when nodes are vertically offset", () => {
    const geometry = buildTopologyEdgeGeometry({ x: 420, y: 196 }, { x: 300, y: 336 });
    expect(geometry.path.startsWith("M 420 196 C")).toBe(true);
    expect(geometry.arrowPath).toContain("300 336");
  });
});

describe("topologyNodeEdgeAnchors", () => {
  it("places anchors on horizontal shell intersections", () => {
    const source = { x: 180, y: 140, elementType: "datacenter" as const };
    const target = { x: 420, y: 160, elementType: "cluster" as const };
    const { from, to } = topologyNodeEdgeAnchors(source, target);
    expect(from).toEqual({ x: 202, y: 162 });
    expect(to).toEqual({ x: 398, y: 182 });
  });
});

describe("buildTopologyEdgePath", () => {
  it("returns stroke path only", () => {
    expect(buildTopologyEdgePath({ x: 100, y: 200 }, { x: 300, y: 200 })).toBe(
      `M 100 200 L ${300 - TOPOLOGY_EDGE_ARROW_LENGTH_PX} 200`,
    );
  });
});
