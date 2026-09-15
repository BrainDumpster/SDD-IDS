/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/error`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsError as SynapseError,
  IdsErrorText as SynapseErrorText,
  IdsErrorCompound as SynapseErrorCompound,
  type IdsErrorProps as SynapseErrorProps,
  type IdsErrorTextProps as SynapseErrorTextProps,
} from "../../ids/error";
