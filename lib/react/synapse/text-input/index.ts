/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/text-box`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTextBox as SynapseTextBox,
  IdsTextBox as SynapseTextInput,
  type IdsTextBoxProps as SynapseTextBoxProps,
  type IdsTextBoxProps as SynapseTextInputProps,
  type IdsTextBoxComponentType as SynapseTextBoxComponentType,
  type IdsTextBoxSize as SynapseTextBoxSize,
  type IdsTextBoxState as SynapseTextBoxState,
} from "../../ids/text-box";
