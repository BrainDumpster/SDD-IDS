import * as go from "gojs";

let registered = false;

/**
 * GoJS's core package does not ship a "Hexagon" figure (it lives in the
 * optional, non-bundled Figures.js extension). Register a minimal
 * flat-top/flat-bottom hexagon here so `figure: "Hexagon"` resolves to an
 * actual hexagon instead of silently falling back to a plain rectangle.
 *
 * IMPORTANT: the vertex ratios here must stay in sync with the vertex
 * geometry in `shapeEdgeDistance.ts` (used for precise Link-to-edge math).
 */
export function registerFigures(): void {
  if (registered) return;
  registered = true;

  go.Shape.defineFigureGenerator("Hexagon", (_shape: go.Shape | null, w: number, h: number) => {
    const geo = new go.Geometry();
    const fig = new go.PathFigure(0.25 * w, 0, true);
    geo.add(fig);
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
    fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, h));
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h).close());
    geo.spot1 = new go.Spot(0.25, 0);
    geo.spot2 = new go.Spot(0.75, 1);
    return geo;
  });
}
