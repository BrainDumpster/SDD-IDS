/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/segmented-button`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsSegmentedButton as SynapseSegmentedButton,
  IdsSegmentedText as SynapseSegmentedText,
  IdsSegmentedIcon as SynapseSegmentedIcon,
  type IdsSegmentedButtonProps as SynapseSegmentedButtonProps,
  type IdsSegmentedTextProps as SynapseSegmentedTextProps,
  type IdsSegmentedIconProps as SynapseSegmentedIconProps,
  type IdsSegmentedButtonChangeMeta as SynapseSegmentedButtonChangeMeta,
  type IdsSegmentedIconSource as SynapseSegmentedIconSource,
  type IdsSegmentedSimulatedState as SynapseSegmentedSimulatedState,
} from "../../ids/segmented-button";
