/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/icon`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsIcon as SynapseIcon,
  type IdsIconProps as SynapseIconProps,
} from "../../ids/icon";
