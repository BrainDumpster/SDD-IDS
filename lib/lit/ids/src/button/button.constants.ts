/**
 * Button constants — design-spec + edf-core mapping.
 * Icon-only → `lib/lit/ids/src/icon-button`.
 */
export type IdsButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

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
]);

const SIZES = new Set<IdsButtonSize>(["small", "medium", "large"]);

/** Map edf `kind` (and design-spec `variant`) to IDS variant. */
export function resolveVariant(value: unknown): IdsButtonVariant {
  if (typeof value !== "string") return "primary";
  const v = value.toLowerCase().replace(/_/g, "-");
  if (v === "danger" || v === "destructive") return "destructive";
  if (VARIANTS.has(v as IdsButtonVariant)) return v as IdsButtonVariant;
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
