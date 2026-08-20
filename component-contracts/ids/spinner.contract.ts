/**
 * IDS Spinner — framework-agnostic spec contract.
 * Full contract: `components/ids/spinner/design-spec.md`
 */
export const IDS_SPINNER_DESIGN_SPEC_PATH =
  "components/ids/spinner/design-spec.md" as const;

export const SPINNER_SIZES = ["sm", "md", "lg"] as const;
export type IdsSpinnerSize = (typeof SPINNER_SIZES)[number];

export const SPINNER_MODES = ["inline", "overlay"] as const;
export type IdsSpinnerMode = (typeof SPINNER_MODES)[number];

export const SPINNER_LABEL_VISIBILITIES = [
  "sr-only",
  "visible-below",
  "visible-inline",
] as const;
export type IdsSpinnerLabelVisibility =
  (typeof SPINNER_LABEL_VISIBILITIES)[number];

export const SPINNER_ARIA_LIVES = ["polite", "assertive", "off"] as const;
export type IdsSpinnerAriaLive = (typeof SPINNER_ARIA_LIVES)[number];

/** Runtime defaults from Composition & API (React + Angular lib). */
export const SPINNER_RUNTIME_DEFAULTS = {
  size: "md" as IdsSpinnerSize,
  mode: "inline" as IdsSpinnerMode,
  label: "Loading...",
  labelVisibility: "sr-only" as IdsSpinnerLabelVisibility,
  ariaLive: "polite" as IdsSpinnerAriaLive,
} as const;

/** Medium stacked sample from Figma usage frame `11099:58972`. */
export const SPINNER_SPEC_ACCURATE_DEFAULTS = {
  size: "md" as IdsSpinnerSize,
  mode: "inline" as IdsSpinnerMode,
  label: "Loading...",
  labelVisibility: "visible-below" as IdsSpinnerLabelVisibility,
  ariaLive: "polite" as IdsSpinnerAriaLive,
} as const;

export type SpinnerModel = typeof SPINNER_SPEC_ACCURATE_DEFAULTS;
