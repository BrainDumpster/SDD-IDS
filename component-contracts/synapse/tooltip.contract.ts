/**
 * Synapse Tooltip — thin IDS-fork; programme delta: `--tooltip-control-radius`.
 */
export const SYNAPSE_TOOLTIP_DESIGN_SPEC_PATH =
  "components/synapse/tooltip/design-spec.md" as const;

export const SYNAPSE_TOOLTIP_IDS_BASELINE_SPEC_PATH =
  "components/ids/tooltip/design-spec.md" as const;

export const SYNAPSE_TOOLTIP_SPEC_PATTERN = "ids-fork" as const;

/** Synapse Figma — radius delta evidence. */
export const SYNAPSE_TOOLTIP_MAIN_NODE_ID = "11067:54657" as const;

export const SYNAPSE_TOOLTIP_CONTROL_RADIUS_ALIAS = "--tooltip-control-radius" as const;

/** IDS Figma `Tooltip-Main` — layout/anatomy reference (inherits; Synapse theme applies radius). */
export const SYNAPSE_TOOLTIP_SPEC_ACCURATE_NODE_ID = "38201:109592" as const;

/** IDS Figma `38201:109593` — Arrow Pointing=Down, Arrow Positioned=Start (primary spec-accurate variant). */
export const SYNAPSE_TOOLTIP_SPEC_ACCURATE_VARIANT_NODE_ID = "38201:109593" as const;

export const SYNAPSE_TOOLTIP_SAMPLE_TITLE = "Tooltip Title" as const;

export const SYNAPSE_TOOLTIP_SAMPLE_BODY =
  "Morbi interdum mollis sapien. Sed ac risus. Phasellus lacinia, magna a sed ullamcorper laoreet, lectus arcu." as const;

/** Inherited from IDS closable contract — shared `Icon` slug. */
export const SYNAPSE_TOOLTIP_CLOSE_ICON_SHAPE = "ctrl-close-16" as const;

/** Inherited from IDS closable contract — close control + icon render size. */
export const SYNAPSE_TOOLTIP_CLOSE_ICON_SIZE_PX = 12 as const;

/** Inherited from IDS closable contract — `ContentColumn` padding-right before close column. */
export const SYNAPSE_TOOLTIP_CLOSE_CONTENT_GAP_TOKEN = "--spacing-space-8" as const;
