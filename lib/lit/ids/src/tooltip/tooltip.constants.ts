/**
 * Tooltip constants — from `components/ids/tooltip/design-spec.md`
 * and React `lib/react/ids/tooltip` positioning contract.
 */

export type IdsTooltipSide = "top" | "bottom" | "left" | "right";
export type IdsTooltipArrowAlign = "start" | "center" | "end";
export type IdsTooltipCloseReason =
  | "close-click"
  | "escape"
  | "programmatic";

/** Visible gap object→arrow tip (`spacing/space-6`) + arrow poke past panel. */
export const OBJECT_TO_ARROW_TIP_GAP = 6;
export const ARROW_EXTENSION = 5;
export const SIDE_OFFSET = OBJECT_TO_ARROW_TIP_GAP + ARROW_EXTENSION;
export const ARROW_LANE = 10;
export const ARROW_EDGE_INSET = 4;

export function resolveSide(value: unknown): IdsTooltipSide {
  if (value === "bottom" || value === "left" || value === "right") return value;
  return "top";
}

export function resolveAlign(value: unknown): IdsTooltipArrowAlign {
  if (value === "start" || value === "end") return value;
  return "center";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

/** Measure painted trigger object box (prefer child rects over line box). */
export function measureTriggerBox(trigger: HTMLElement): DOMRect {
  const hasText = Array.from(trigger.childNodes).some(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
  );
  if (hasText || trigger.children.length === 0) {
    return trigger.getBoundingClientRect();
  }
  let top = Infinity;
  let left = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;
  for (const child of Array.from(trigger.children)) {
    const r = child.getBoundingClientRect();
    top = Math.min(top, r.top);
    left = Math.min(left, r.left);
    right = Math.max(right, r.right);
    bottom = Math.max(bottom, r.bottom);
  }
  if (!Number.isFinite(top)) return trigger.getBoundingClientRect();
  return new DOMRect(left, top, right - left, bottom - top);
}

export function computePopupPosition(
  trigger: DOMRect,
  popup: DOMRect,
  side: IdsTooltipSide,
  align: IdsTooltipArrowAlign,
): { top: number; left: number; arrowOffset: number } {
  let top = 0;
  let left = 0;

  if (side === "top") {
    top = trigger.top - popup.height - SIDE_OFFSET;
  } else if (side === "bottom") {
    top = trigger.bottom + SIDE_OFFSET;
  } else if (side === "left") {
    left = trigger.left - popup.width - SIDE_OFFSET;
  } else {
    left = trigger.right + SIDE_OFFSET;
  }

  let arrowOffset = 0;

  if (side === "top" || side === "bottom") {
    if (align === "start") left = trigger.left;
    else if (align === "end") left = trigger.right - popup.width;
    else left = trigger.left + trigger.width / 2 - popup.width / 2;

    const triggerCenter = trigger.left + trigger.width / 2;
    arrowOffset = clamp(
      triggerCenter - left - ARROW_LANE / 2,
      ARROW_EDGE_INSET,
      popup.width - ARROW_LANE - ARROW_EDGE_INSET,
    );
  } else {
    if (align === "start") top = trigger.top;
    else if (align === "end") top = trigger.bottom - popup.height;
    else top = trigger.top + trigger.height / 2 - popup.height / 2;

    const triggerCenter = trigger.top + trigger.height / 2;
    arrowOffset = clamp(
      triggerCenter - top - ARROW_LANE / 2,
      ARROW_EDGE_INSET,
      popup.height - ARROW_LANE - ARROW_EDGE_INSET,
    );
  }

  return { top, left, arrowOffset };
}
