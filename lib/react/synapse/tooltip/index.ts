/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/tooltip`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTooltip as SynapseTooltip,
  TooltipTrigger as SynapseTooltipTrigger,
  TooltipPanel as SynapseTooltipPanel,
  TooltipHeader as SynapseTooltipHeader,
  TooltipBody as SynapseTooltipBody,
  TooltipClose as SynapseTooltipClose,
  type TooltipProps as SynapseTooltipProps,
  type TooltipTriggerProps as SynapseTooltipTriggerProps,
  type TooltipPanelProps as SynapseTooltipPanelProps,
  type TooltipHeaderProps as SynapseTooltipHeaderProps,
  type TooltipBodyProps as SynapseTooltipBodyProps,
  type TooltipCloseProps as SynapseTooltipCloseProps,
  type TooltipSide as SynapseTooltipSide,
  type TooltipArrowAlign as SynapseTooltipArrowAlign,
  type TooltipCloseReason as SynapseTooltipCloseReason,
} from "../../ids/tooltip";
