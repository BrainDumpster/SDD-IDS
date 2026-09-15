/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/slider`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsSlider as SynapseSlider,
  type IdsSliderProps as SynapseSliderProps,
  type IdsSliderMode as SynapseSliderMode,
  type IdsSliderValue as SynapseSliderValue,
} from "../../ids/slider";
