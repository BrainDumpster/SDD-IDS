/**
 * IDS Checkbox — framework-agnostic spec contract.
 * Source: `components/ids/checkbox/design-spec.md`
 */
export const IDS_CHECKBOX_DESIGN_SPEC_PATH =
  "components/ids/checkbox/design-spec.md" as const;

export const CHECKBOX_SPEC_SAMPLE_LABEL = "Accept terms and conditions" as const;

/** Label used in Figma state matrix (`42151:53254`). */
export const CHECKBOX_MATRIX_LABEL = "Option" as const;

export const CHECKBOX_ERROR_ICON_SLUG = "status-critical-square-solid" as const;

export const CHECKBOX_SPEC_ACCURATE_DEFAULTS = {
  label: CHECKBOX_SPEC_SAMPLE_LABEL,
  checked: false,
  partial: false,
  disabled: false,
  error: false,
  helperText: undefined as string | undefined,
  showLabel: true,
  simulateFocusVisible: false,
} as const;

export type CheckboxDensity = "default" | "datagrid";

export type CheckboxGroupOrientation = "vertical" | "horizontal";

export const CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS = {
  orientation: "vertical" as CheckboxGroupOrientation,
  disabled: false,
} as const;
