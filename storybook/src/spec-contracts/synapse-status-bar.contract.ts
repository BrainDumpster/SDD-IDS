/**
 * Synapse Status Bar — thin IDS-fork; programme delta: theme token resolution via synapse-theme.css.
 */
export const SYNAPSE_STATUS_BAR_DESIGN_SPEC_PATH =
  "components/synapse/status-bar/design-spec.md" as const;

export const SYNAPSE_STATUS_BAR_IDS_BASELINE_SPEC_PATH =
  "components/ids/status-bar/design-spec.md" as const;

export const SYNAPSE_STATUS_BAR_SPEC_PATTERN = "ids-fork" as const;

/** IDS Figma main component set (authoritative until Synapse Patterns board ships). */
export const SYNAPSE_STATUS_BAR_IDS_MAIN_NODE_ID = "15412:10699" as const;

export const SYNAPSE_STATUS_BAR_IDS_FIGMA_FILE_KEY = "0bHk3XhrjFhowgFkz9yLr4" as const;

/** Synapse Patterns board node — reserved; empty in map until published. */
export const SYNAPSE_STATUS_BAR_PROGRAMME_NODE_ID = "" as const;

export {
  IDS_STATUS_BAR_FIGMA_NODES,
  type IdsStatusBarBarType,
  type IdsStatusBarInventoryStatus,
  type IdsStatusBarItemContract,
  type IdsStatusBarItemData,
  type IdsStatusBarItemState,
  type IdsStatusBarOverflowScenario,
  type IdsStatusBarSelectionChangeDetail,
  type IdsStatusBarSelectionMode,
  type IdsStatusBarSeverity,
  type IdsStatusBarTotalData,
  type IdsStatusBarType,
  fromLegacyStatusBarType,
} from "./ids-status-bar.contract";
