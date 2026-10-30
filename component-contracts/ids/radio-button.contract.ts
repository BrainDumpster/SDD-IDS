/**
 * IDS Radio Button — framework-agnostic spec contract.
 * Source: `components/ids/radio-button/design-spec.md`
 */
export const IDS_RADIO_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/radio-button/design-spec.md" as const;

export type RadioButtonOrientation = "vertical" | "horizontal";

export type RadioButtonSimulatedState = "default" | "hover" | "focus-visible";

/** @deprecated Use composition items (`ids-radio-button` inside `ids-radio-button-group`). */
export interface IdsRadioButtonOption {
  value: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  simulatedState?: RadioButtonSimulatedState;
}

export const RADIO_BUTTON_SPEC_DEMO_OPTIONS: IdsRadioButtonOption[] = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  name: "ids-radio-default",
  defaultValue: "option1",
  disabled: false,
  orientation: "vertical" as RadioButtonOrientation,
  label: "Radio Group",
  showLabel: true,
  required: false,
  labelPosition: "left" as const,
  labelIcon: undefined,
  error: false,
  errorText: undefined,
} as const;
