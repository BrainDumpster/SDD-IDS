/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/time-picker`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTimePicker as SynapseTimePicker,
  type IdsTimePickerProps as SynapseTimePickerProps,
} from "../../ids/time-picker";
