/**
 * IDS Tooltip — framework-agnostic spec contract.
 * Source: `components/ids/tooltip/design-spec.md`
 */
export const IDS_TOOLTIP_DESIGN_SPEC_PATH = "components/ids/tooltip/design-spec.md" as const;

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipArrowAlign = "start" | "center" | "end";
export type TooltipCloseReason = "close-click" | "escape" | "programmatic";

export const TOOLTIP_SIDES = ["top", "bottom", "left", "right"] as const;
export const TOOLTIP_ARROW_ALIGNS = ["start", "center", "end"] as const;

export const TOOLTIP_API_DEFAULTS = {
  side: "top" as TooltipSide,
  arrowAlign: "center" as TooltipArrowAlign,
  closable: false,
  triggerDisplay: "inline" as const,
} as const;

export const TOOLTIP_DEMO_BODY =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu." as const;

/** Spec Accurate Design: top · start · standard hover tooltip with title + body slots. */
export const TOOLTIP_SPEC_ACCURATE_DEFAULTS = {
  ...TOOLTIP_API_DEFAULTS,
  arrowAlign: "start" as TooltipArrowAlign,
  title: "Tooltip Title",
  content: TOOLTIP_DEMO_BODY,
} as const;
