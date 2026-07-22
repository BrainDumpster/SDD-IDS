import * as go from "gojs";
import { NodeKind, NodeShapeKind, TopologyEngineOptions } from "../../types";
import { truncateMiddle } from "./truncate";
import { shapeTopRightExtent } from "./shapeEdgeDistance";
import { cssVar } from "./theme";

/**
 * Spot for the status indicator's alignment: centered exactly on the
 * shape's own top-right extent — its actual rightmost x-coordinate and
 * topmost y-coordinate (computed per shape type, reusing the same shape
 * geometry as Link trimming) — so it always sits exactly half its height
 * above the shape's real top and half its width to the right of the shape's
 * real right edge, for every shape type, not just a Square (whose bounding
 * box happens to coincide with that corner already).
 */
function statusAlignmentBinding(size: number, frontOffsetX: number) {
  return new go.Binding("alignment", "shape", (shape: NodeShapeKind) => {
    const resolvedShape = shape || "circle";
    const { x, y } = shapeTopRightExtent(resolvedShape, size);
    // Per-shape manual nudge from the computed top-right extent (Square is
    // unaffected): Circle is nudged 5px left/5px down; Hexagon is nudged
    // 6px left/2px down. Both were arrived at incrementally via visual
    // adjustment requests.
    const STATUS_NUDGE: Record<NodeShapeKind, { x: number; y: number }> = {
      circle: { x: -5, y: 5 },
      hexagon: { x: -6, y: 2 },
      square: { x: 0, y: 0 },
    };
    const nudge = STATUS_NUDGE[resolvedShape];
    return new go.Spot(0.5, 0.5, x + frontOffsetX + nudge.x, y + nudge.y);
  });
}

const SHAPE_FIGURES: Record<string, string> = {
  circle: "Circle",
  square: "Rectangle",
  hexagon: "Hexagon",
};

// Colors are resolved from src/tokens.css's semantic CSS variables (not
// cached in constants) so each Binding re-reads the current Light/Dark
// value every time GoJSTopologyEngine forces a theme refresh.
function shapeFigureBinding() {
  return new go.Binding("figure", "shape", (shape: string) => SHAPE_FIGURES[shape] || "Circle");
}

function shapeStrokeBinding() {
  return new go.Binding("stroke", "isSelected", (sel: boolean) =>
    sel
      ? cssVar("--color-border-brand-base", "#0076ce")
      : cssVar("--color-border-neutral", "#4d4d4d")
  ).ofObject();
}

function shapeStrokeWidthBinding() {
  return new go.Binding("strokeWidth", "isSelected", (sel: boolean) => (sel ? 2 : 1)).ofObject();
}

function shapeFillBinding() {
  return new go.Binding("fill", "isSelected", (sel: boolean) =>
    sel
      ? cssVar("--color-background-brand-light", "#d9eaf8")
      : cssVar("--color-background-component", "#ffffff")
  ).ofObject();
}

function statusSlug(status?: string): string | null {
  switch (status) {
    case "ok":
      return "status-ok-circ-solid";
    case "warning":
      return "status-warn-tri-solid";
    case "error":
      return "status-error-diamond-solid";
    case "critical":
      return "status-critical-square-solid";
    default:
      return null;
  }
}

function badgeLabel(count: number): string {
  if (count > 99) return "+99";
  return String(Math.max(0, Math.min(count, 99)));
}

/** Node data shape as merged into the diagram's model by GoJSTopologyEngine. */
interface NodePartData {
  key: string;
  childCount?: number;
  hasChildren?: boolean;
  isExpanded?: boolean;
}

export interface ExplodeHandlers {
  /** Reveal a Group-Node's children + parent->child Links. */
  expand: (key: string) => void;
  /** Hide a Group-Node's children + parent->child Links. */
  collapse: (key: string) => void;
}

/** Builds the GoJS Node template for the given kind ("single" | "group"). */
export function makeNodeTemplate(
  $: typeof go.GraphObject.make,
  kind: NodeKind,
  options: TopologyEngineOptions,
  explodeHandlers: ExplodeHandlers
): go.Node {
  const size = options.nodeSize ?? 48;
  const iconsBasePath = options.iconsBasePath ?? "assets/icons";

  // For Group-Nodes, the same shape is drawn 3 times, one atop the other,
  // each shifted 4px further left than the last (bottom -> middle -> front).
  // For Single-Nodes there's just the one (front) shape, unshifted.
  //
  // Everything here — the extra background shapes, icon, status indicator,
  // and badge — is a flat, top-level child of ONE "Spot" Panel, and every
  // child's position is a pixel/fractional offset from the *first* child
  // (the "main" element, which never has anything hanging outside its own
  // size x size box). This is deliberate: nesting the icon/status/badge
  // inside their own sub-panel (whose measured bounds grow to include their
  // overhang) and then positioning THAT sub-panel as a single unit was tried
  // and rejected — the overhang skewed the sub-panel's own bounding box,
  // which visibly offset the shape inside it relative to its siblings.
  // Aligning every child directly off the stable main element sidesteps
  // that problem entirely.
  const frontOffsetX = kind === "group" ? -8 : 0;

  const children: go.GraphObject[] = [];

  if (kind === "group") {
    // Main element (added first): bottom-most shape, unshifted.
    children.push(
      $(
        go.Shape,
        { width: size, height: size, strokeWidth: 1 },
        shapeFigureBinding(),
        shapeStrokeBinding(),
        shapeStrokeWidthBinding(),
        shapeFillBinding()
      )
    );
    // Middle shape: 4px further left than the bottom one.
    children.push(
      $(
        go.Shape,
        {
          width: size,
          height: size,
          strokeWidth: 1,
          alignment: new go.Spot(0, 0, -4, 0),
          alignmentFocus: go.Spot.TopLeft,
        },
        shapeFigureBinding(),
        shapeStrokeBinding(),
        shapeStrokeWidthBinding(),
        shapeFillBinding()
      )
    );
    // Front (top-most) shape: 8px further left than the bottom one. This is
    // also the Node's only Link port: Links attach to the exact center of
    // this shape, regardless of the node's full bounding box.
    children.push(
      $(
        go.Shape,
        {
          name: "SHAPE",
          width: size,
          height: size,
          strokeWidth: 1,
          alignment: new go.Spot(0, 0, frontOffsetX, 0),
          alignmentFocus: go.Spot.TopLeft,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.Center,
          toSpot: go.Spot.Center,
          cursor: "pointer",
        },
        shapeFigureBinding(),
        shapeStrokeBinding(),
        shapeStrokeWidthBinding(),
        shapeFillBinding()
      )
    );
  } else {
    // Single-Node: the only shape is both the main element and the port.
    children.push(
      $(
        go.Shape,
        {
          name: "SHAPE",
          width: size,
          height: size,
          strokeWidth: 1,
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          fromSpot: go.Spot.Center,
          toSpot: go.Spot.Center,
          cursor: "pointer",
        },
        shapeFigureBinding(),
        shapeStrokeBinding(),
        shapeStrokeWidthBinding(),
        shapeFillBinding()
      )
    );
  }

  // Icon, status indicator, and badge: each aligned relative to the main
  // element's box, offset by the same frontOffsetX as the front shape, so
  // they always land exactly on the front shape regardless of kind.
  children.push(
    $(
      // Every Node is required to have an icon, so it is always rendered.
      go.Picture,
      {
        alignment: new go.Spot(0.5, 0.5, frontOffsetX, 0),
        alignmentFocus: go.Spot.Center,
        width: 20,
        height: 20,
      },
      new go.Binding("source", "icon", (icon: string) => `${iconsBasePath}/${icon}.svg`)
    )
  );
  children.push(
    $(
      go.Picture,
      {
        alignmentFocus: go.Spot.Center,
        width: 16,
        height: 16,
      },
      statusAlignmentBinding(size, frontOffsetX),
      new go.Binding("source", "status", (status: string) => {
        const slug = statusSlug(status);
        return slug ? `${iconsBasePath}/${slug}.svg` : "";
      }),
      new go.Binding("visible", "status", (status: string) => !!statusSlug(status))
    )
  );
  if (kind === "group") {
    children.push(
      $(
        go.Panel,
        "Auto",
        {
          alignment: new go.Spot(0.5, 1, frontOffsetX, 0),
          alignmentFocus: go.Spot.Center,
        },
        $(
          go.Shape,
          "RoundedRectangle",
          {
            strokeWidth: 1,
            // Matches the Badge component's 18px pill height exactly;
            // width is left free to grow only as far as the count text
            // needs (e.g. for "+99").
            minSize: new go.Size(18, 18),
            maxSize: new go.Size(Infinity, 18),
            parameter1: 9,
          },
          new go.Binding("fill", "", () => cssVar("--color-background-brand-base", "#0076ce")),
          new go.Binding("stroke", "", () => cssVar("--color-border-white", "#ffffff"))
        ),
        $(
          go.TextBlock,
          {
            margin: new go.Margin(1, 5, 1, 5),
            font: "400 11px Roboto, sans-serif",
            textAlign: "center",
          },
          new go.Binding("stroke", "", () => cssVar("--color-text-white", "#ffffff")),
          // "−" while exploded instead of the child count — bound off the
          // whole data object since it depends on both `isExpanded` and
          // `childCount`. The badge is the sole click target for both
          // expanding (shows count) and collapsing (shows "−") a Group-Node.
          new go.Binding("text", "", (data: NodePartData) =>
            data.isExpanded ? "\u2212" : badgeLabel(data.childCount || 0)
          )
        ),
        {
          click: (_e: go.InputEvent, obj: go.GraphObject) => {
            const node = obj.part as go.Node | null;
            const data = node?.data as NodePartData | undefined;
            if (!data) return;
            if (data.isExpanded) explodeHandlers.collapse(data.key);
            else if (data.hasChildren) explodeHandlers.expand(data.key);
          },
        }
      )
    );
  }

  // Named "VISUAL" so GoJSTopologyEngine can look it up and, on every zoom
  // change, cap the whole Node's *on-screen* (viewport-pixel) size at
  // 32x32 via a counter-scaling `scale` transform — see
  // GoJSTopologyEngine.applyNodeSizeCap. Scaling the whole panel (rather
  // than resizing individual shapes) keeps the icon/status/badge correctly
  // positioned relative to the shape at any cap factor.
  const visual = $(go.Panel, "Spot", { name: "VISUAL" }, ...children);

  return $(
    go.Node,
    "Vertical",
    {
      category: kind,
      locationSpot: go.Spot.Center,
      selectionAdorned: false,
      // Clicking the Node itself only selects it (GoJS's built-in
      // click-select behavior) — expand/collapse is exclusively driven by
      // clicking the badge (see its own `click` handler above).
      //
      // "Nodes must never overlap" is enforced here, not via a
      // Diagram.computeMove override — Diagram.moveParts (which
      // DraggingTool.doMouseMove actually calls on every live drag frame)
      // explicitly consults each Part's own dragComputation function to
      // determine its new location; Diagram.computeMove is a separate,
      // largely unrelated hook that doesn't end up constraining the
      // position actually applied during an interactive drag.
      dragComputation: (thisPart: go.Part, newLoc: go.Point): go.Point => {
        const diagram = thisPart.diagram;
        if (!diagram || !(thisPart instanceof go.Node)) return newLoc;

        // newLoc is thisPart's *center* (locationSpot is go.Spot.Center
        // above), not a top-left corner — Rect's constructor takes a
        // top-left x/y, so it must be offset by half the Node's
        // width/height to build an accurate collision rectangle.
        const size = thisPart.actualBounds.size;
        const candidate = new go.Rect(
          newLoc.x - size.width / 2,
          newLoc.y - size.height / 2,
          size.width,
          size.height
        );

        // Exclude every Part currently being dragged alongside thisPart
        // (e.g. other selected Nodes moving together) from the collision
        // test, so a multi-Node drag doesn't immediately "collide" with
        // its own other members.
        const draggingParts = diagram.toolManager.draggingTool.draggingParts;

        let overlaps = false;
        diagram.nodes.each((other: go.Node) => {
          if (overlaps || other === thisPart) return;
          if (draggingParts.has(other)) return;
          if (candidate.intersectsRect(other.actualBounds)) {
            overlaps = true;
          }
        });

        return overlaps ? thisPart.location : newLoc;
      },
    },
    new go.Binding("location", "loc", go.Point.parse),
    visual,
    // Name/Type-Name are each wrapped in an opaque white backing panel so a
    // Link routed near/behind a Node's text is never visible through the
    // gaps around the glyphs — a plain TextBlock alone has no fill and
    // wouldn't fully hide anything drawn underneath it.
    $(
      go.Panel,
      "Auto",
      { margin: new go.Margin(8, 0, 0, 0) },
      new go.Binding("visible", "showName"),
      $(
        go.Shape,
        "Rectangle",
        { stroke: null },
        new go.Binding("fill", "", () => cssVar("--color-background-component", "#ffffff"))
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(0, 2, 0, 2),
          font: "400 14px Roboto, sans-serif",
          textAlign: "center",
        },
        new go.Binding("stroke", "", () => cssVar("--color-text-neutral-strong", "#252525")),
        new go.Binding("text", "name", (n: string) => truncateMiddle(n || "", 24))
      )
    ),
    $(
      go.Panel,
      "Auto",
      { margin: new go.Margin(4, 0, 0, 0) },
      new go.Binding("visible", "showTypeName"),
      $(
        go.Shape,
        "Rectangle",
        { stroke: null },
        new go.Binding("fill", "", () => cssVar("--color-background-component", "#ffffff"))
      ),
      $(
        go.TextBlock,
        {
          margin: new go.Margin(0, 2, 0, 2),
          font: "600 14px Roboto, sans-serif",
          textAlign: "center",
        },
        new go.Binding("stroke", "", () => cssVar("--color-text-neutral", "#4d4d4d")),
        new go.Binding("text", "typeName", (n: string) => truncateMiddle(n || "", 24))
      )
    )
  );
}
