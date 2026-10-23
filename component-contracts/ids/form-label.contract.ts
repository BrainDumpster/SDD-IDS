/**
 * IDS Form Label — framework-agnostic spec contract.
 * Full contract: `components/ids/form-label/design-spec.md`
 * Figma component set: `12065:229953` (IDS-Design-Library `0bHk3XhrjFhowgFkz9yLr4`).
 */
export const IDS_FORM_LABEL_DESIGN_SPEC_PATH =
  "components/ids/form-label/design-spec.md" as const;

export const FORM_LABEL_SIZES = ["sm", "md", "lg"] as const;
export type IdsFormLabelSize = (typeof FORM_LABEL_SIZES)[number];

/** Figma `Size` variant → labelRoot total height (px). sm=24, md=32, lg=40. */
export const FORM_LABEL_SIZE_PX: Record<IdsFormLabelSize, 24 | 32 | 40> = {
  sm: 24,
  md: 32,
  lg: 40,
};

/** Vertical padding token name per size (centers the 20px Body-2 line). */
export const FORM_LABEL_SIZE_PADDING_TOKEN: Record<IdsFormLabelSize, string> = {
  sm: "--padding-padding-2",
  md: "--padding-padding-6",
  lg: "--padding-padding-10",
};

/** Shared info-icon glyph slug (`assets/icons/info-circ-solid.svg`). */
export const FORM_LABEL_INFO_ICON_SLUG = "info-circ-solid" as const;

/** Runtime defaults (React + Angular lib). */
export const FORM_LABEL_RUNTIME_DEFAULTS = {
  size: "md" as IdsFormLabelSize,
  required: false,
  showInfoIcon: false,
} as const;

/** Sample copy from Figma component set `12065:229953` ("Label:" + `*` + info icon). */
export const FORM_LABEL_SPEC_SAMPLE_TEXT = "Label:" as const;

export const FORM_LABEL_SPEC_ACCURATE_DEFAULTS = {
  label: FORM_LABEL_SPEC_SAMPLE_TEXT,
  size: "md" as IdsFormLabelSize,
  required: true,
  showInfoIcon: true,
  infoLabel: "More information",
} as const;

export type FormLabelModel = typeof FORM_LABEL_SPEC_ACCURATE_DEFAULTS;
