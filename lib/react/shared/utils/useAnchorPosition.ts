import { useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";

export type AnchorSide = "top" | "bottom" | "left" | "right";
export type AnchorAlign = "start" | "center" | "end";

export interface CollisionAvoidance {
  side?: "none" | "flip";
  align?: "none" | "shift";
  fallbackAxisSide?: "none" | "start" | "end" | "flip";
}

export interface AnchorPositionOptions {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  floatingRef: RefObject<HTMLElement | null>;
  side?: AnchorSide;
  align?: AnchorAlign;
  sideOffset?: number;
  collisionPadding?: number;
  collisionAvoidance?: CollisionAvoidance;
}

export interface AnchorPositionResult {
  style: CSSProperties;
  side: AnchorSide;
  align: AnchorAlign;
  /** Mirrors Base UI floating-ui `--anchor-width` for match-trigger-width menus. */
  anchorWidth: number;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Fixed-position placement against an anchor element.
 * Supports flip/shift when `collisionAvoidance` allows it.
 */
export function useAnchorPosition({
  open,
  anchorRef,
  floatingRef,
  side: preferredSide = "bottom",
  align: preferredAlign = "start",
  sideOffset = 0,
  collisionPadding = 8,
  collisionAvoidance,
}: AnchorPositionOptions): AnchorPositionResult {
  const [result, setResult] = useState<AnchorPositionResult>({
    style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
    side: preferredSide,
    align: preferredAlign,
    anchorWidth: 0,
  });

  useLayoutEffect(() => {
    if (!open) {
      setResult((prev) => ({
        ...prev,
        style: { ...prev.style, visibility: "hidden" },
      }));
      return;
    }

    const update = () => {
      const anchor = anchorRef.current;
      const floating = floatingRef.current;
      if (!anchor || !floating) return;

      const a = anchor.getBoundingClientRect();
      const f = floating.getBoundingClientRect();
      const pad = collisionPadding;
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let side = preferredSide;
      let align = preferredAlign;

      const place = (s: AnchorSide, al: AnchorAlign) => {
        let top = 0;
        let left = 0;

        if (s === "bottom") top = a.bottom + sideOffset;
        else if (s === "top") top = a.top - f.height - sideOffset;
        else if (s === "right") left = a.right + sideOffset;
        else left = a.left - f.width - sideOffset;

        if (s === "bottom" || s === "top") {
          if (al === "start") left = a.left;
          else if (al === "end") left = a.right - f.width;
          else left = a.left + (a.width - f.width) / 2;
        } else {
          if (al === "start") top = a.top;
          else if (al === "end") top = a.bottom - f.height;
          else top = a.top + (a.height - f.height) / 2;
        }

        return { top, left };
      };

      let { top, left } = place(side, align);

      const canFlipSide = collisionAvoidance?.side === "flip";
      const canShiftAlign = collisionAvoidance?.align === "shift";

      if (canFlipSide) {
        if (side === "bottom" && top + f.height > vh - pad) {
          const flipped = place("top", align);
          if (flipped.top >= pad) {
            side = "top";
            top = flipped.top;
            left = flipped.left;
          }
        } else if (side === "top" && top < pad) {
          const flipped = place("bottom", align);
          if (flipped.top + f.height <= vh - pad) {
            side = "bottom";
            top = flipped.top;
            left = flipped.left;
          }
        } else if (side === "right" && left + f.width > vw - pad) {
          const flipped = place("left", align);
          if (flipped.left >= pad) {
            side = "left";
            top = flipped.top;
            left = flipped.left;
          }
        } else if (side === "left" && left < pad) {
          const flipped = place("right", align);
          if (flipped.left + f.width <= vw - pad) {
            side = "right";
            top = flipped.top;
            left = flipped.left;
          }
        }
      }

      if (canShiftAlign) {
        if (side === "bottom" || side === "top") {
          left = clamp(left, pad, vw - f.width - pad);
        } else {
          top = clamp(top, pad, vh - f.height - pad);
        }
      }

      setResult({
        side,
        align,
        anchorWidth: a.width,
        style: {
          position: "fixed",
          top,
          left,
          visibility: "visible",
          // Base UI positioner exposes --anchor-width for consumers.
          ["--anchor-width" as string]: `${a.width}px`,
        },
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    if (anchorRef.current) ro?.observe(anchorRef.current);
    if (floatingRef.current) ro?.observe(floatingRef.current);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, [
    open,
    anchorRef,
    floatingRef,
    preferredSide,
    preferredAlign,
    sideOffset,
    collisionPadding,
    collisionAvoidance?.side,
    collisionAvoidance?.align,
    collisionAvoidance?.fallbackAxisSide,
  ]);

  return result;
}
