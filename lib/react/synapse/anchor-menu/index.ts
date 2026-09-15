/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/anchor-menu`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsAnchorMenu as SynapseAnchorMenu,
  type IdsAnchorMenuProps as SynapseAnchorMenuProps,
  type IdsAnchorMenuItem as SynapseAnchorMenuItem,
} from "../../ids/anchor-menu";
