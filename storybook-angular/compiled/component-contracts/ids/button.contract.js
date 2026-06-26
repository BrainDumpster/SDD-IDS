/**
 * IDS Button — framework-agnostic spec contract.
 * Full contract: `components/ids/button/design-spec.md`
 */
export const IDS_BUTTON_DESIGN_SPEC_PATH = "components/ids/button/design-spec.md";
export const BUTTON_DEMO_ICON_SLUG = "settings-gear-detailed";
export const BUTTON_SPEC_ACCURATE_DEFAULTS = {
    variant: "primary",
    size: "lg",
    /** React `children` / Angular default slot label for spec-accurate stories. */
    children: "Button",
    disabled: false,
    loading: false,
    iconOnly: false,
    /** Demo leading icon slug — Angular: project `<ids-icon [shapeName]="…" variant="mask" />`. */
    iconSlug: BUTTON_DEMO_ICON_SLUG,
};
