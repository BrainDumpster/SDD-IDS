/**
 * Icon Button constants — design-spec mapping.
 */
export type IdsIconButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "ghostNeutral"
  /** Alias of `ghostNeutral`. */
  | "ghost";

export type IdsIconButtonSize = "small" | "medium" | "large";

export type IdsIconButtonNativeType = "button" | "submit" | "reset";

export type IdsIconButtonDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible"
  | "disabled";

export const ICON_BUTTON_DEMO_SHAPE = "shape-plus";
/** @deprecated Use `ICON_BUTTON_DEMO_SHAPE`. */
export const ICON_BUTTON_DEMO_ICON_SLUG = ICON_BUTTON_DEMO_SHAPE;

const VARIANTS = new Set<string>([
  "primary",
  "secondary",
  "tertiary",
  "ghostNeutral",
  "ghost",
]);

const SIZES = new Set<IdsIconButtonSize>(["small", "medium", "large"]);

export function resolveVariant(value: unknown): Exclude<IdsIconButtonVariant, "ghost"> {
  if (typeof value !== "string") return "primary";
  const v = value.toLowerCase().replace(/_/g, "-");
  if (v === "ghost" || v === "ghostneutral" || v === "ghost-neutral") {
    return "ghostNeutral";
  }
  if (v === "secondary" || v === "tertiary") return v;
  if (VARIANTS.has(v)) return "primary";
  return "primary";
}

export function resolveSize(value: unknown): IdsIconButtonSize {
  if (typeof value !== "string" || !value) return "large";
  const s = value.toLowerCase();
  if (s === "sm") return "small";
  if (s === "md") return "medium";
  if (s === "lg") return "large";
  if (SIZES.has(s as IdsIconButtonSize)) return s as IdsIconButtonSize;
  return "large";
}

export function resolveNativeType(value: unknown): IdsIconButtonNativeType {
  if (value === "submit" || value === "reset") return value;
  return "button";
}

export function iconGlyphSize(size: IdsIconButtonSize): number {
  if (size === "small") return 12;
  if (size === "medium") return 14;
  return 16;
}
