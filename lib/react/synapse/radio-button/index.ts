/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/radio-button`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsRadioGroup as SynapseRadioGroup,
  IdsRadioButton as SynapseRadioButton,
  IdsRadioButtonCompound as SynapseRadioButtonCompound,
  IdsRadioLabel as SynapseRadioLabel,
  type IdsRadioGroupProps as SynapseRadioGroupProps,
  type IdsRadioButtonProps as SynapseRadioButtonProps,
  type IdsRadioLabelProps as SynapseRadioLabelProps,
  type IdsRadioDataState as SynapseRadioDataState,
  type IdsRadioOrientation as SynapseRadioOrientation,
} from "../../ids/radio-button";
