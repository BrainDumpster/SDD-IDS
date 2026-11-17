/**
 * IDS Radio Button — framework-agnostic spec contract.
 * Source: `components/ids/radio-button/design-spec.md`
 */
export const IDS_RADIO_BUTTON_DESIGN_SPEC_PATH =
  "components/ids/radio-button/design-spec.md";

/** @deprecated Use composition items (`ids-radio-button` inside `ids-radio-button-group`). */
export const RADIO_BUTTON_SPEC_DEMO_OPTIONS = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

export const RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS = {
  name: "ids-radio-default",
  defaultValue: "option1",
  disabled: false,
  orientation: "vertical",
  label: "Radio Group",
  showLabel: true,
  required: false,
  labelPosition: "left",
  labelIcon: undefined,
  error: false,
  errorText: undefined,
};
