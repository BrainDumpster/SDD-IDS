/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/tab`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsTabs as SynapseTabs,
  IdsTabsCompound as SynapseTabsCompound,
  IdsTab as SynapseTab,
  IdsTabButton as SynapseTabButton,
  IdsTabContent as SynapseTabContent,
  type IdsTabItemInput as SynapseTabItemInput,
  type IdsTabsProps as SynapseTabsProps,
  type IdsTabProps as SynapseTabProps,
  type IdsTabButtonProps as SynapseTabButtonProps,
  type IdsTabContentProps as SynapseTabContentProps,
  type IdsTabsType as SynapseTabsType,
  type IdsTabsSurface as SynapseTabsSurface,
  type IdsTabSelectPayload as SynapseTabSelectPayload,
} from "../../ids/tab";
