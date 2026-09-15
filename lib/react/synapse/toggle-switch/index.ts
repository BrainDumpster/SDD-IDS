/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/toggle-switch`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsToggleSwitch as SynapseToggleSwitch,
  type IdsToggleSwitchProps as SynapseToggleSwitchProps,
} from "../../ids/toggle-switch";
