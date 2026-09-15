/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/button`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsButton as SynapseButton,
  IdsButtonCompound as SynapseButtonCompound,
  IdsButtonLeadingIcon as SynapseButtonLeadingIcon,
  IdsButtonLabel as SynapseButtonLabel,
  type IdsButtonProps as SynapseButtonProps,
  type IdsButtonVariant as SynapseButtonVariant,
  type IdsButtonSize as SynapseButtonSize,
  type IdsButtonDataState as SynapseButtonDataState,
  type IdsButtonLeadingIconProps as SynapseButtonLeadingIconProps,
  type IdsButtonLabelProps as SynapseButtonLabelProps,
} from "../../ids/button";
