import { NodeShapeKind } from "../../types";

interface Point {
  x: number;
  y: number;
}

/**
 * Vertices of each polygonal shape, centered on the origin, for a shape
 * whose bounding box is `size x size`. Must exactly match the geometry used
 * by the corresponding figure in `nodeTemplate.ts` (see `registerFigures`).
 */
function polygonVertices(shape: NodeShapeKind, size: number): Point[] | null {
  const half = size / 2;
  switch (shape) {
    case "square":
      return [
        { x: -half, y: -half },
        { x: half, y: -half },
        { x: half, y: half },
        { x: -half, y: half },
      ];
    case "hexagon":
      // Flat top/bottom, pointed left/right — matches the "Hexagon" figure
      // generator registered in registerFigures.ts.
      return [
        { x: -0.25 * size, y: -half },
        { x: 0.25 * size, y: -half },
        { x: half, y: 0 },
        { x: 0.25 * size, y: half },
        { x: -0.25 * size, y: half },
        { x: -half, y: 0 },
      ];
    default:
      return null;
  }
}

/**
 * Distance from the center of a shape (Circle/Square/Hexagon, bounded by
 * `size x size`) to its boundary, along the ray at `angle` radians from the
 * center. For a Circle this is always the radius; for polygonal shapes it's
 * computed exactly via ray/polygon-edge intersection, so a Link can be drawn
 * all the way to the true visual edge of the shape (not just an inscribed
 * circle approximation) regardless of direction.
 */
export function shapeEdgeDistance(shape: NodeShapeKind, size: number, angle: number): number {
  const verts = polygonVertices(shape, size);
  if (!verts) return size / 2; // circle: constant radius in every direction

  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  for (let i = 0; i < verts.length; i++) {
    const p1 = verts[i];
    const p2 = verts[(i + 1) % verts.length];
    const x1 = p1.x;
    const y1 = p1.y;
    const x2 = p2.x;
    const y2 = p2.y;

    const det = -dx * (y2 - y1) + dy * (x2 - x1);
    if (Math.abs(det) < 1e-9) continue; // ray parallel to this edge

    const t = (-x1 * (y2 - y1) + (x2 - x1) * y1) / det;
    const s = (dx * y1 - dy * x1) / det;

    if (t > 1e-6 && s >= -1e-6 && s <= 1 + 1e-6) {
      return t;
    }
  }

  return size / 2; // fallback (should not normally be reached)
}

/**
 * The shape's own rightmost x-coordinate and topmost (least) y-coordinate,
 * i.e. where its true boundary reaches furthest right and furthest up,
 * independently of each other (not a single point on the boundary at some
 * angle). Used to hang an overlay (e.g. the status indicator) so it extends
 * a fixed amount above the shape's actual top and to the right of the
 * shape's actual right edge — for a Circle or Hexagon inscribed in a
 * `size x size` box, that's still exactly `(size / 2, -size / 2)`, the same
 * as a Square's corner, since all three shapes' bounding boxes coincide with
 * that box; this only diverges for a shape whose bounding box doesn't touch
 * all 4 sides of `size x size`.
 */
export function shapeTopRightExtent(shape: NodeShapeKind, size: number): Point {
  const verts = polygonVertices(shape, size);
  if (!verts) return { x: size / 2, y: -size / 2 }; // circle

  let maxX = -Infinity;
  let minY = Infinity;
  for (const v of verts) {
    if (v.x > maxX) maxX = v.x;
    if (v.y < minY) minY = v.y;
  }
  return { x: maxX, y: minY };
}
