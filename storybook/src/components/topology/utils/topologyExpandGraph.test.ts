import {
  collectTopologyDescendantIds,
  layoutTopologyChildNodes,
  loadTopologyExpandChildren,
} from "./topologyExpandGraph";

describe("loadTopologyExpandChildren", () => {
  const parent = {
    id: "dc-root",
    label: "Datacenter",
    x: 400,
    y: 120,
  };

  it("returns two cluster children positioned below the parent", () => {
    const result = loadTopologyExpandChildren("dc-root", [parent]);
    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(2);
    expect(result.nodes[0].parentId).toBe("dc-root");
    expect(result.nodes[0].y).toBeGreaterThan(parent.y);
  });

  it("returns hosts for an expanded cluster", () => {
    const cluster = {
      id: "cluster-a",
      label: "Cluster A",
      x: 320,
      y: 270,
      parentId: "dc-root",
    };
    const result = loadTopologyExpandChildren("cluster-a", [parent, cluster]);
    expect(result.nodes).toHaveLength(2);
    expect(result.nodes.every((node) => node.parentId === "cluster-a")).toBe(true);
  });
});

describe("collectTopologyDescendantIds", () => {
  it("collects nested descendants for collapse", () => {
    const nodes = [
      { id: "dc-root", parentId: undefined },
      { id: "cluster-a", parentId: "dc-root" },
      { id: "host-a1", parentId: "cluster-a" },
    ];
    expect(collectTopologyDescendantIds("dc-root", nodes)).toEqual(["cluster-a", "host-a1"]);
  });
});

describe("layoutTopologyChildNodes", () => {
  it("centers children horizontally around parent x", () => {
    const parent = { id: "p", label: "P", x: 300, y: 100 };
    const laidOut = layoutTopologyChildNodes(parent, [
      { id: "a", label: "A", elementType: "general" },
      { id: "b", label: "B", elementType: "general" },
      { id: "c", label: "C", elementType: "general" },
    ]);
    expect(laidOut[1].x).toBe(300);
  });
});
