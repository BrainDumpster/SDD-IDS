/**
 * IDS Icon Button — framework-agnostic spec contract.
 * Full contract: `components/ids/icon-button/design-spec.md`
 */
export const IDS_ICON_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/icon-button/design-spec.md" as const;

/** Demo icon — Figma Icon Button default `Select Icon` / shape-plus. */
export const ICON_BUTTON_DEMO_SHAPE = "shape-plus" as const;

/** @deprecated Use `ICON_BUTTON_DEMO_SHAPE`. */
export const ICON_BUTTON_DEMO_ICON_SLUG = ICON_BUTTON_DEMO_SHAPE;

/** IDS Icon Button variants from design-spec.md (no Destructive). */
export type IconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghostNeutral"
  /** Alias of `ghostNeutral` (Figma Type=Ghost / docs label Ghost Neutral). */
  | "ghost";

/** Angular / Spec Accurate story size tokens (maps to small/medium/large). */
export type IconButtonSize = "sm" | "md" | "lg";

export const ICON_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  variant: "primary" as IconButtonVariant,
  size: "lg" as IconButtonSize,
  disabled: false,
  loading: false,
  /** Required accessible name. */
  ariaLabel: "Add",
  /** Required icon name — passed to IdsIcon / ids-icon `shape`. */
  shape: ICON_BUTTON_DEMO_SHAPE,
} as const;

export type IconButtonModel = typeof ICON_BUTTON_SPEC_ACCURATE_DEFAULTS;
