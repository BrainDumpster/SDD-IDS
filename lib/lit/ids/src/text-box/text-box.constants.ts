/**
 * IDS Text Box constants — from `components/ids/text-box/design-spec.md`
 * and `component-contracts/ids/text-box.contract.ts`.
 */

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
export const IDS_TEXT_BOX_LABEL_POSITIONS = ["left", "top"] as const;

export type IdsTextBoxComponentType =
  (typeof IDS_TEXT_BOX_COMPONENT_TYPES)[number];
export type IdsTextBoxSize = (typeof IDS_TEXT_BOX_SIZE_OPTIONS)[number];
export type IdsTextBoxState = (typeof IDS_TEXT_BOX_STATE_OPTIONS)[number];
export type IdsTextBoxLabelPosition =
  (typeof IDS_TEXT_BOX_LABEL_POSITIONS)[number];

export const TEXT_BOX_DEFAULT_SUFFIX_ICON = "mail" as const;
export const TEXT_BOX_ERROR_ICON_SLUG = "status-critical-square-solid" as const;
export const TEXT_BOX_INFO_ICON_SLUG = "info-circ-solid" as const;

export const TEXT_BOX_SPEC_ACCURATE_DEFAULTS = {
  componentType: "text-input" as IdsTextBoxComponentType,
  size: "large" as IdsTextBoxSize,
  state: "default" as IdsTextBoxState,
  labelPosition: "left" as IdsTextBoxLabelPosition,
  showLabel: true,
  required: false,
  placeholder: "Placeholder Text",
  helperText: "Helper text",
  errorText: "Error message",
  showHelperText: true,
  showIcon: true,
  iconName: TEXT_BOX_DEFAULT_SUFFIX_ICON,
  showInfoIcon: false,
  disabled: false,
  invalid: false,
  rows: 4,
  inputType: "text",
  selectTextOnFocus: true as boolean | null,
} as const;

export function resolveComponentType(
  value: unknown,
): IdsTextBoxComponentType {
  return value === "text-area" ? "text-area" : "text-input";
}

export function resolveSize(value: unknown): IdsTextBoxSize {
  return value === "small" ? "small" : "large";
}

export function resolveState(value: unknown): IdsTextBoxState {
  if (
    value === "hover" ||
    value === "selected" ||
    value === "focus" ||
    value === "disabled" ||
    value === "error"
  ) {
    return value;
  }
  return "default";
}

export function resolveLabelPosition(
  value: unknown,
): IdsTextBoxLabelPosition {
  return value === "top" ? "top" : "left";
}
