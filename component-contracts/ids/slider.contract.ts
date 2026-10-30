/**
 * IDS Slider — framework-agnostic spec contract.
 * Source: `components/ids/slider/design-spec.md`
 */
export const IDS_SLIDER_DESIGN_SPEC_PATH =
  "components/ids/slider/design-spec.md" as const;

export const SLIDER_MODES = ["single", "range"] as const;
export type IdsSliderMode = (typeof SLIDER_MODES)[number];

export type IdsSliderValue = number | [number, number];

/** Runtime defaults from Composition & API (React + Angular lib). */
export const SLIDER_RUNTIME_DEFAULTS = {
  mode: "single" as IdsSliderMode,
  step: 1,
  disabled: false,
  showStepper: false,
  showTicks: false,
  showValueLabel: true,
  showValueInput: false,
} as const;

/**
 * Spec Accurate Design — single, mid value, endpoint labels, value label on, stepper off.
 * Matches generated IDS slider `DefaultNoStepper` args.
 */
export const SLIDER_SPEC_ACCURATE_DEFAULTS = {
  mode: "single" as IdsSliderMode,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50 as IdsSliderValue,
  disabled: false,
  showStepper: false,
  showTicks: false,
  stepperFrequency: undefined as number | undefined,
  showValueLabel: true,
  showValueInput: false,
  minLabel: "0",
  maxLabel: "100",
} as const;

export type SliderModel = typeof SLIDER_SPEC_ACCURATE_DEFAULTS;
