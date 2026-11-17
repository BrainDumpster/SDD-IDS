/**
 * IDS Button — framework-agnostic spec contract.
 * Full contract: `components/ids/button/design-spec.md`
 */
export const IDS_BUTTON_DESIGN_SPEC_PATH = "components/ids/button/design-spec.md";
export const BUTTON_DEMO_ICON_SLUG = "settings-gear-detailed";

/** Resolve design-spec size; unknown → `large`. Accepts `sm`/`md`/`lg` aliases. */
export function resolveButtonSize(value) {
  if (value === "small" || value === "sm") return "small";
  if (value === "medium" || value === "md") return "medium";
  if (value === "large" || value === "lg") return "large";
  return "large";
}

export const BUTTON_SPEC_ACCURATE_DEFAULTS = {
  variant: "primary",
  size: "large",
  /** React `children` / Angular default slot label for spec-accurate stories. */
  children: "Button",
  disabled: false,
  loading: false,
  iconOnly: false,
  /** Demo leading icon slug — Angular: project `<ids-icon [shapeName]="…" variant="mask" />`. */
  iconSlug: BUTTON_DEMO_ICON_SLUG,
};
