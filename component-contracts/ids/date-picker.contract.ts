/**
 * IDS Date Picker — framework-agnostic spec contract.
 * Source: `components/ids/date-picker/design-spec.md`
 * React parity: `lib/react/ids/date-picker` (branch `usr/muthu/lib`)
 */
export const IDS_DATE_PICKER_DESIGN_SPEC_PATH =
  "components/ids/date-picker/design-spec.md" as const;

export const IDS_DATE_PICKER_SIZE_OPTIONS = ["large", "small"] as const;
export type DatePickerSize = (typeof IDS_DATE_PICKER_SIZE_OPTIONS)[number];

export const DATE_PICKER_SPEC_ACCURATE_DEFAULTS = {
  value: null as Date | null,
  size: "large" as DatePickerSize,
  placeholder: "MM-DD-YYYY",
  label: "Start date",
  required: false,
  dateFormat: "MM-DD-YYYY",
  formatHint: "MM-DD-YYYY",
  disabled: false,
  error: false,
  errorMessage: undefined as string | undefined,
  disabledDates: [] as Date[],
  rangeMode: false,
  rangeStart: null as Date | null,
  rangeEnd: null as Date | null,
  forceOpen: false,
  popupPortal: false,
} as const;
