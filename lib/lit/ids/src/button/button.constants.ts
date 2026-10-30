/**
 * Button constants — design-spec + edf-core mapping.
 */
export type IdsButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "ghostNeutral"
  /** @deprecated Alias of `ghostNeutral`. */
  | "ghost";

export type IdsButtonSize = "small" | "medium" | "large";

export type IdsButtonNativeType = "button" | "submit" | "reset";

export type IdsButtonDataState =
  | "default"
  | "hover"
  | "press"
  | "focus-visible"
  | "disabled";

export const BUTTON_DEMO_ICON_SLUG = "settings-gear-detailed";

const VARIANTS = new Set<IdsButtonVariant>([
  "primary",
  "secondary",
  "tertiary",
  "destructive",
  "ghostNeutral",
  "ghost",
]);

const SIZES = new Set<IdsButtonSize>(["small", "medium", "large"]);

/** Map edf `kind` (and design-spec `variant`) to IDS variant. */
export function resolveVariant(value: unknown): IdsButtonVariant {
  if (typeof value !== "string") return "primary";
  const v = value.toLowerCase().replace(/_/g, "-");
  if (v === "danger" || v === "destructive") return "destructive";
  if (v === "ghost" || v === "ghostneutral" || v === "ghost-neutral") {
    return "ghostNeutral";
  }
  if (VARIANTS.has(v as IdsButtonVariant)) return v as IdsButtonVariant;
  if (v === "warning" || v === "success" || v === "icon") return "primary";
  return "primary";
}

export function resolveSize(value: unknown): IdsButtonSize {
  if (typeof value !== "string" || !value) return "large";
  const s = value.toLowerCase();
  if (s === "sm") return "small";
  if (s === "md") return "medium";
  if (s === "lg") return "large";
  if (SIZES.has(s as IdsButtonSize)) return s as IdsButtonSize;
  return "large";
}

export function resolveNativeType(value: unknown): IdsButtonNativeType {
  if (value === "submit" || value === "reset") return value;
  return "button";
}

export function iconGlyphSize(
  size: IdsButtonSize,
  iconOnly: boolean,
  variant: IdsButtonVariant = "primary",
): number {
  if (!iconOnly) return 16;
  if (size === "small") return 12;
  if (size === "medium") return 14;
  /* Ghost Neutral Large → UI Icon Spacing/icon-14 (Figma Type=Ghost) */
  if (variant === "ghostNeutral" || variant === "ghost") return 14;
  return 16;
}
