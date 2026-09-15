/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/link`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsLink as SynapseLink,
  type IdsLinkProps as SynapseLinkProps,
  type IdsLinkType as SynapseLinkType,
  type IdsLinkDataState as SynapseLinkDataState,
  type IdsLinkTarget as SynapseLinkTarget,
} from "../../ids/link";
