/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/toast`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsToastItem as SynapseToastItem,
  type IdsToastItemProps as SynapseToastItemProps,
  type IdsToastType as SynapseToastType,
  type IdsToastLink as SynapseToastLink,
  type IdsToastCloseReason as SynapseToastCloseReason,
} from "../../ids/toast";
export {
  IdsToastViewport as SynapseToastViewport,
  type IdsToastViewportProps as SynapseToastViewportProps,
  type IdsToastQueueItem as SynapseToastQueueItem,
  type IdsToastPosition as SynapseToastPosition,
} from "../../ids/toast";
