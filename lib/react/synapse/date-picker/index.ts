/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/date-picker`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDatePicker as SynapseDatePicker,
  type IdsDatePickerProps as SynapseDatePickerProps,
} from "../../ids/date-picker";
