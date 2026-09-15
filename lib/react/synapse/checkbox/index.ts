/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/checkbox`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsCheckbox as SynapseCheckbox,
  IdsCheckboxCompound as SynapseCheckboxCompound,
  IdsCheckboxLabel as SynapseCheckboxLabel,
  type IdsCheckboxProps as SynapseCheckboxProps,
  type IdsCheckboxDataState as SynapseCheckboxDataState,
  type IdsCheckboxLabelProps as SynapseCheckboxLabelProps,
} from "../../ids/checkbox";
