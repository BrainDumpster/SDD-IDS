/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/footer`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsFooter as SynapseFooter,
  type IdsFooterProps as SynapseFooterProps,
} from "../../ids/footer";
