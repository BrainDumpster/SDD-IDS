/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/helper`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsHelper as SynapseHelper,
  IdsHelperText as SynapseHelperText,
  IdsHelperCompound as SynapseHelperCompound,
  type IdsHelperProps as SynapseHelperProps,
  type IdsHelperTextProps as SynapseHelperTextProps,
} from "../../ids/helper";
