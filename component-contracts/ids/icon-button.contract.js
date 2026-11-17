/**
 * IDS Icon Button — framework-agnostic spec contract.
 * Full contract: `components/ids/icon-button/design-spec.md`
 */
export const IDS_ICON_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/icon-button/design-spec.md";
export const ICON_BUTTON_DEMO_SHAPE = "shape-plus";
/** @deprecated Use `ICON_BUTTON_DEMO_SHAPE`. */
export const ICON_BUTTON_DEMO_ICON_SLUG = ICON_BUTTON_DEMO_SHAPE;
export const ICON_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  variant: "primary",
  size: "lg",
  disabled: false,
  loading: false,
  ariaLabel: "Add",
  shape: ICON_BUTTON_DEMO_SHAPE,
};
