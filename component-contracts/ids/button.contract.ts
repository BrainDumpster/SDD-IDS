/**
 * IDS Button — framework-agnostic spec contract.
 * Full contract: `components/ids/button/design-spec.md`
 */
export const IDS_BUTTON_DESIGN_SPEC_PATH = "components/ids/button/design-spec.md" as const;

export const BUTTON_DEMO_ICON_SLUG = "settings-gear-detailed" as const;

/** IDS button variants from design-spec.md variant matrix. */
export type ButtonVariant = "primary" | "secondary" | "tertiary" | "destructive";

/** React/Synapse extended variants (rendering layer may map destructive → danger). */
export type ButtonVariantExtended = ButtonVariant | "ghost" | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export const BUTTON_SPEC_ACCURATE_DEFAULTS = {
  variant: "primary" as ButtonVariant,
  size: "lg" as ButtonSize,
  /** React `children` / Angular default slot label for spec-accurate stories. */
  children: "Button",
  disabled: false,
  loading: false,
  iconOnly: false,
  /** Demo leading icon slug — Angular: project `<ids-icon [shapeName]="…" variant="mask" />`. */
  iconSlug: BUTTON_DEMO_ICON_SLUG,
} as const;

export type ButtonModel = typeof BUTTON_SPEC_ACCURATE_DEFAULTS;
