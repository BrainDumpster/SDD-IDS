/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/tag`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTag as SynapseTag,
  type IdsTagProps as SynapseTagProps,
  type IdsTagType as SynapseTagType,
  type IdsTagSize as SynapseTagSize,
  type IdsTagTone as SynapseTagTone,
} from "../../ids/tag";
