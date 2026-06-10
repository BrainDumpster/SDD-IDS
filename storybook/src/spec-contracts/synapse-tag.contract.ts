/**
 * Synapse Tag — IDS-fork spec contract.
 * Full contract: `components/synapse/tag/design-spec.md`
 * IDS baseline: `components/ids/tag/design-spec.md`
 */
export const SYNAPSE_TAG_DESIGN_SPEC_PATH = "components/synapse/tag/design-spec.md" as const;

export const SYNAPSE_TAG_IDS_BASELINE_SPEC_PATH = "components/ids/tag/design-spec.md" as const;

export const SYNAPSE_TAG_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_TAG_MAIN_NODE_ID = "38910:57385" as const;
export const SYNAPSE_TAG_CLOSE_ELEMENT_NODE_ID = "11666:90409" as const;

export const SYNAPSE_TAG_TYPE_NODES = {
  readOnly: "38910:57384",
  clickable: "38910:57383",
  editableDismissible: "38910:57382",
  withBadge: "38910:57381",
} as const;

export const SYNAPSE_TAG_SCENARIO_BOARDS = {
  alerting: "38910:51200",
  nonAlertingLarge: "38910:51195",
  clickable: "38910:51213",
  editableDismissible: "38910:51235",
  withBadge: "38910:57339",
} as const;

export const SYNAPSE_TAG_SPEC_ACCURATE_SCENARIO_NODE_ID = SYNAPSE_TAG_TYPE_NODES.readOnly;

export const SYNAPSE_TAG_SAMPLE_LABEL = "Tag" as const;

export const SYNAPSE_TAG_SMALL_HEIGHT_PX = 20 as const;
export const SYNAPSE_TAG_LARGE_HEIGHT_PX = 28 as const;
export const SYNAPSE_TAG_CLOSE_ICON_SIZE_PX = 10 as const;
export const SYNAPSE_TAG_BADGE_HEIGHT_PX = 18 as const;
