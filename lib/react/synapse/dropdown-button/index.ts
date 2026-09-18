/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/dropdown-button`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDropdownButton as SynapseDropdownButton,
  IdsDropdownButtonCompound as SynapseDropdownButtonCompound,
  IdsDropdownTrigger as SynapseDropdownTrigger,
  IdsDropdownMenu as SynapseDropdownMenu,
  IdsDropdownMenuItem as SynapseDropdownMenuItem,
  type IdsDropdownButtonProps as SynapseDropdownButtonProps,
  type IdsDropdownButtonItem as SynapseDropdownButtonItem,
  type IdsDropdownButtonStyle as SynapseDropdownButtonStyle,
  type IdsDropdownButtonSize as SynapseDropdownButtonSize,
  type IdsDropdownTriggerProps as SynapseDropdownTriggerProps,
  type IdsDropdownMenuProps as SynapseDropdownMenuProps,
  type IdsDropdownMenuItemProps as SynapseDropdownMenuItemProps,
} from "../../ids/dropdown-button";
