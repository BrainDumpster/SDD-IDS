/**
 * IDS Time Picker — framework-agnostic spec contract.
 * Source: `components/ids/time-picker/design-spec.md`
 * React parity: `lib/react/ids/time-picker` (branch `usr/muthu/lib`)
 *
 * Figma overview for the date/time family also maps at
 * `components/ids/date-and-time-picker/design-spec.md`.
 */
export const IDS_TIME_PICKER_DESIGN_SPEC_PATH =
  "components/ids/time-picker/design-spec.md" as const;

export const IDS_TIME_PICKER_SIZE_OPTIONS = ["large", "small"] as const;
export type TimePickerSize = (typeof IDS_TIME_PICKER_SIZE_OPTIONS)[number];

export const IDS_TIME_PICKER_CLOCK_TYPE_OPTIONS = ["12h", "24h"] as const;
export type TimePickerClockType = (typeof IDS_TIME_PICKER_CLOCK_TYPE_OPTIONS)[number];

export const TIME_PICKER_SPEC_ACCURATE_DEFAULTS = {
  value: "09:30 PM" as string | null,
  size: "large" as TimePickerSize,
  placeholder: "HH:MM AM/PM",
  label: "Time",
  required: false,
  formatHint: "HH:MM AM/PM",
  clockType: "12h" as TimePickerClockType,
  showSeconds: false,
  disabled: false,
  error: false,
  errorMessage: undefined as string | undefined,
  forceOpen: false,
} as const;
