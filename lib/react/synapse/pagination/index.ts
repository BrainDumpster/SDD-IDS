/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/pagination`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsPagination as SynapsePagination,
  type IdsPaginationProps as SynapsePaginationProps,
  type IdsPaginationBackground as SynapsePaginationBackground,
  type IdsPaginationResponsiveMode as SynapsePaginationResponsiveMode,
  type IdsPaginationCollapseSlot as SynapsePaginationCollapseSlot,
} from "../../ids/pagination";
