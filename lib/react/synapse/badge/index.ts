/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/badge`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsBadge as SynapseBadge,
  type IdsBadgeProps as SynapseBadgeProps,
  type IdsBadgeType as SynapseBadgeType,
} from "../../ids/badge";
