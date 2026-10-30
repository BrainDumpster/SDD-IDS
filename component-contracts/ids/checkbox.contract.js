/**
 * IDS Checkbox — framework-agnostic spec contract.
 * Source: `components/ids/checkbox/design-spec.md`
 */
export const IDS_CHECKBOX_DESIGN_SPEC_PATH = "components/ids/checkbox/design-spec.md";
export const CHECKBOX_SPEC_SAMPLE_LABEL = "Accept terms and conditions";
/** Label used in Figma state matrix (`42151:53254`). */
export const CHECKBOX_MATRIX_LABEL = "Option";
export const CHECKBOX_ERROR_ICON_SLUG = "status-critical-square-solid";
export const CHECKBOX_SPEC_ACCURATE_DEFAULTS = {
    label: CHECKBOX_SPEC_SAMPLE_LABEL,
    checked: false,
    indeterminate: false,
    disabled: false,
    error: false,
    helperText: undefined,
    showLabel: true,
    simulateFocusVisible: false,
};
export const CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS = {
    orientation: "vertical",
    disabled: false,
};
