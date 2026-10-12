/**
 * Radio button constants — design-spec + Angular contract.
 */
export type RadioButtonOrientation = "vertical" | "horizontal";

export type RadioButtonSimulatedState = "default" | "hover" | "focus-visible";

export const RADIO_BUTTON_ERROR_ICON_SLUG = "status-critical-square-solid";

export const RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  name: "ids-radio-default",
  defaultValue: "option1",
  disabled: false,
  orientation: "vertical" as RadioButtonOrientation,
} as const;
