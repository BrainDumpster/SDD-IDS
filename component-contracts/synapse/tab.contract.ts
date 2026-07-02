/**
 * Synapse Tab — IDS-fork spec contract.
 * Full contract: `components/synapse/tab/design-spec.md`
 * IDS baseline: `components/ids/tab/design-spec.md`
 */
export const SYNAPSE_TAB_DESIGN_SPEC_PATH = "components/synapse/tab/design-spec.md" as const;

export const SYNAPSE_TAB_IDS_BASELINE_SPEC_PATH = "components/ids/tab/design-spec.md" as const;

export const SYNAPSE_TAB_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_TAB_DOCUMENTATION_BOARD_NODE_ID = "47807:3185" as const;

export const SYNAPSE_TAB_SINGLE_SET_NODE_ID = "47804:189" as const;

export const SYNAPSE_TAB_DEFAULT_NODE_ID = "47804:188" as const;

export const SYNAPSE_TAB_SELECTED_NODE_ID = "47804:187" as const;

export const SYNAPSE_TAB_HOVER_NODE_ID = "50154:76767" as const;

export const SYNAPSE_TAB_NO_ICON_NODE_ID = "52922:70327" as const;

export const SYNAPSE_TAB_MIN_WIDTH_NODE_ID = "50431:32236" as const;

export const SYNAPSE_TAB_MAX_WIDTH_NODE_ID = "50454:81701" as const;

export const SYNAPSE_NAV_TAB_GROUP_FOUR_NODE_ID = "47835:4947" as const;

export const SYNAPSE_NAV_TAB_GROUP_OVERFLOW_NODE_ID = "47835:4949" as const;

export const SYNAPSE_TAB_MIN_WIDTH_PX = 80 as const;

export const SYNAPSE_TAB_MAX_WIDTH_PX = 250 as const;

/** Re-export IDS overflow demo width for Synapse overflow stories (shared `Tabs` resize logic). */
export { TAB_OVERFLOW_DEMO_WIDTH as SYNAPSE_TAB_OVERFLOW_DEMO_WIDTH } from "../ids/tab.contract";

/** Shared `Tabs.tsx` overflow caret — inherit IDS contract (`arrow-tri-down-solid` 10×10). */
export {
  TAB_OVERFLOW_MORE_ICON_SLUG as SYNAPSE_TAB_OVERFLOW_MORE_ICON_SLUG,
  TAB_OVERFLOW_MORE_ICON_SIZE_PX as SYNAPSE_TAB_OVERFLOW_MORE_ICON_SIZE_PX,
} from "../ids/tab.contract";
