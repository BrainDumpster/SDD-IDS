/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/detail-panel`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsDetailPanel as SynapseDetailPanel,
  IdsDetailPanelContent as SynapseDetailPanelContent,
  IdsDetailPanelHeader as SynapseDetailPanelHeader,
  IdsDetailPanelTitle as SynapseDetailPanelTitle,
  IdsDetailPanelBody as SynapseDetailPanelBody,
  IdsDetailPanelFooter as SynapseDetailPanelFooter,
  IdsDetailPanelCollapsedRail as SynapseDetailPanelCollapsedRail,
  IdsDetailPanelToggleButton as SynapseDetailPanelToggleButton,
  type IdsDetailPanelProps as SynapseDetailPanelProps,
  type IdsDetailPanelAttachMode as SynapseDetailPanelAttachMode,
  type IdsDetailPanelContentProps as SynapseDetailPanelContentProps,
  type IdsDetailPanelHeaderProps as SynapseDetailPanelHeaderProps,
  type IdsDetailPanelTitleProps as SynapseDetailPanelTitleProps,
  type IdsDetailPanelBodyProps as SynapseDetailPanelBodyProps,
  type IdsDetailPanelFooterProps as SynapseDetailPanelFooterProps,
  type IdsDetailPanelCollapsedRailProps as SynapseDetailPanelCollapsedRailProps,
  type IdsDetailPanelToggleButtonProps as SynapseDetailPanelToggleButtonProps,
} from "../../ids/detail-panel";
