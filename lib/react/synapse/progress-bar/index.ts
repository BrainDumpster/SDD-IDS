/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/progress-bar`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsProgressBar as SynapseProgressBar,
  type IdsProgressBarProps as SynapseProgressBarProps,
  type IdsProgressBarType as SynapseProgressBarType,
  type IdsProgressBarThickness as SynapseProgressBarThickness,
  type IdsProgressBarState as SynapseProgressBarState,
} from "../../ids/progress-bar";
