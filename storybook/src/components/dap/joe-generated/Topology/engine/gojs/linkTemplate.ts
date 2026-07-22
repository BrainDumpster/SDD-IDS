import * as go from "gojs";
import { NodeShapeKind, TopologyEngineOptions } from "../../types";
import { shapeEdgeDistance } from "./shapeEdgeDistance";
import { cssVar } from "./theme";

const DASH_PATTERNS: Record<string, number[] | null> = {
  solid: null,
  dashed: [6, 4],
  dotted: [1, 3],
};

/**
 * A Link that always anchors to the exact center of a Node's icon (its
 * link port), but is drawn only up to the true visual edge of that Node's
 * shape — computed exactly for Circle/Square/Hexagon, so the Link stays
 * fully visible right up until it touches the shape, and is never visible
 * within it. This is recomputed automatically any time a Node moves.
 */
class ShapeAwareLink extends go.Link {
  getLinkPoint(
    node: go.Node | null,
    port: go.GraphObject,
    _spot: go.Spot,
    _from: boolean,
    _ortho: boolean,
    othernode: go.Node | null,
    otherport: go.GraphObject
  ): go.Point {
    // Use the actual "SHAPE" element (not the port Panel) for center/size:
    // the port Panel's overall bounds can be inflated by the status icon
    // (hangs over the top-right) and, for Group-Nodes, the member-count
    // badge (hangs below), which would otherwise skew both the center
    // point and the shape size used for edge-distance math.
    const shapeObj = (port instanceof go.Panel && port.findObject("SHAPE")) || port;
    const otherShapeObj = (otherport instanceof go.Panel && otherport.findObject("SHAPE")) || otherport;

    const center = shapeObj.getDocumentPoint(go.Spot.Center);
    if (!node || !othernode || !otherport) return center;

    const otherCenter = otherShapeObj.getDocumentPoint(go.Spot.Center);
    const dx = otherCenter.x - center.x;
    const dy = otherCenter.y - center.y;
    if (dx === 0 && dy === 0) return center;

    const angle = Math.atan2(dy, dx);
    const shape = (node.data?.shape as NodeShapeKind) || "circle";
    const size = shapeObj.actualBounds.width || 48;
    const dist = shapeEdgeDistance(shape, size, angle);

    return new go.Point(center.x + Math.cos(angle) * dist, center.y + Math.sin(angle) * dist);
  }
}

/** Builds the GoJS Link template connecting exactly two Nodes. */
export function makeLinkTemplate($: typeof go.GraphObject.make, _options: TopologyEngineOptions): go.Link {
  return $(
    ShapeAwareLink,
    {
      // Rendered in a dedicated "Links" Layer placed below the Node layer
      // (see GoJSTopologyEngine.init) so a Link is never drawn on top of a
      // Node's shape or its Name/Type-Name text.
      layerName: "Links",
      routing: go.Link.Normal,
      curve: go.Link.None,
      selectable: true,
      relinkableFrom: false,
      relinkableTo: false,
    },
    $(
      go.Shape,
      { strokeWidth: 2 },
      new go.Binding("stroke", "color", (color: string) => color || cssVar("--color-border-neutral", "#4d4d4d")),
      new go.Binding("strokeDashArray", "style", (style: string) => DASH_PATTERNS[style] ?? null)
    )
  );
}
