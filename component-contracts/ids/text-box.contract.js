/**
 * IDS Text Box — framework-agnostic spec contract.
 * Source: `components/ids/text-box/design-spec.md`
 */
export const IDS_TEXT_BOX_DESIGN_SPEC_PATH = "components/ids/text-box/design-spec.md";
export const IDS_TEXT_BOX_COMPONENT_TYPES = ["text-input", "text-area"];
export const IDS_TEXT_BOX_SIZE_OPTIONS = ["large", "small"];
export const IDS_TEXT_BOX_STATE_OPTIONS = [
    "default",
    "hover",
    "selected",
    "focus",
    "disabled",
    "error",
];
export const TEXT_BOX_DEFAULT_SUFFIX_ICON = "mail";
export const TEXT_BOX_ERROR_ICON_SLUG = "status-critical-square-solid";
export const TEXT_BOX_SPEC_ACCURATE_DEFAULTS = {
    componentType: "text-input",
    size: "large",
    state: "default",
    placeholder: "Placeholder Text",
    helperText: "Helper text",
    errorText: "Error message",
    showHelperText: true,
    showIcon: true,
    iconName: TEXT_BOX_DEFAULT_SUFFIX_ICON,
    disabled: false,
    invalid: false,
    rows: 4,
    inputType: "text",
};
/** @deprecated Use `TEXT_BOX_SPEC_ACCURATE_DEFAULTS` */
export const IDS_TEXT_BOX_DEFAULTS = TEXT_BOX_SPEC_ACCURATE_DEFAULTS;
