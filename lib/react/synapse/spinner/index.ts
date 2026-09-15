/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/spinner`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsSpinner as SynapseSpinner,
  type IdsSpinnerProps as SynapseSpinnerProps,
  type IdsSpinnerSize as SynapseSpinnerSize,
  type IdsSpinnerMode as SynapseSpinnerMode,
  type IdsSpinnerLabelVisibility as SynapseSpinnerLabelVisibility,
  type IdsSpinnerAriaLive as SynapseSpinnerAriaLive,
} from "../../ids/spinner";
