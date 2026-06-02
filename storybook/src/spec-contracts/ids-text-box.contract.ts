import type { IdsTextBoxProps } from "../components/IdsTextBox";

export const IDS_TEXT_BOX_DESIGN_SPEC_PATH = "components/ids/text-box/design-spec.md";

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

export const IDS_TEXT_BOX_DEFAULTS: Pick<
  IdsTextBoxProps,
  "componentType" | "size" | "state" | "showIcon" | "showHelperText"
> = {
  componentType: "text-input",
  size: "large",
  state: "default",
  showIcon: true,
  showHelperText: true,
};
