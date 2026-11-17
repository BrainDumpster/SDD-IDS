/**
 * IDS Button — framework-agnostic spec contract.
 * Full contract: `components/ids/button/design-spec.md`
 */
export const IDS_BUTTON_DESIGN_SPEC_PATH = "components/ids/button/design-spec.md" as const;

export const BUTTON_DEMO_ICON_SLUG = "settings-gear-detailed" as const;

/** IDS button variants from design-spec.md variant matrix. */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "destructive"
  | "ghostNeutral"
  /** @deprecated Alias of `ghostNeutral` (Figma Type=Ghost / docs label Ghost Neutral). */
  | "ghost";

/** React/Synapse extended variants (rendering layer may map destructive → danger). */
export type ButtonVariantExtended = ButtonVariant | "danger";

/** Canonical size tokens from design-spec (`small` | `medium` | `large`). */
export type ButtonSize = "small" | "medium" | "large";

/** Accepted size inputs — short aliases map to canonical sizes. */
export type ButtonSizeInput = ButtonSize | "sm" | "md" | "lg";

/** Resolve design-spec size; unknown → `large`. Accepts `sm`/`md`/`lg` aliases. */
export function resolveButtonSize(value: unknown): ButtonSize {
  if (value === "small" || value === "sm") return "small";
  if (value === "medium" || value === "md") return "medium";
  if (value === "large" || value === "lg") return "large";
  return "large";
}

export const BUTTON_SPEC_ACCURATE_DEFAULTS = {
  variant: "primary" as ButtonVariant,
  size: "large" as ButtonSize,
  /** React `children` / Angular default slot label for spec-accurate stories. */
  children: "Button",
  disabled: false,
  loading: false,
  iconOnly: false,
  /** Demo leading icon slug — Angular: project `<ids-icon [shapeName]="…" variant="mask" />`. */
  iconSlug: BUTTON_DEMO_ICON_SLUG,
} as const;

export type ButtonModel = typeof BUTTON_SPEC_ACCURATE_DEFAULTS;
