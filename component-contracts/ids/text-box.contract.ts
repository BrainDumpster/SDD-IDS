/**
 * IDS Text Box — framework-agnostic spec contract.
 * Source: `components/ids/text-box/design-spec.md`
 */
export const IDS_TEXT_BOX_DESIGN_SPEC_PATH =
  "components/ids/text-box/design-spec.md" as const;

export const IDS_TEXT_BOX_COMPONENT_TYPES = ["text-input", "text-area"] as const;
export const IDS_TEXT_BOX_SIZE_OPTIONS = ["large", "small"] as const;
export const IDS_TEXT_BOX_STATE_OPTIONS = [
  "default",
  "hover",
  "selected",
  "focus",
  "disabled",
  "error",
] as const;

export type TextBoxComponentType = (typeof IDS_TEXT_BOX_COMPONENT_TYPES)[number];
export type TextBoxSize = (typeof IDS_TEXT_BOX_SIZE_OPTIONS)[number];
export type TextBoxState = (typeof IDS_TEXT_BOX_STATE_OPTIONS)[number];

export const TEXT_BOX_DEFAULT_SUFFIX_ICON = "mail" as const;
export const TEXT_BOX_ERROR_ICON_SLUG = "status-critical-square-solid" as const;

export const TEXT_BOX_SPEC_ACCURATE_DEFAULTS = {
  componentType: "text-input" as TextBoxComponentType,
  size: "large" as TextBoxSize,
  state: "default" as TextBoxState,
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
} as const;

/** @deprecated Use `TEXT_BOX_SPEC_ACCURATE_DEFAULTS` */
export const IDS_TEXT_BOX_DEFAULTS = TEXT_BOX_SPEC_ACCURATE_DEFAULTS;
