/**
 * Synapse Spinner — thin IDS-fork; inherits IDS geometry/API (no programme layout aliases).
 */
export const SYNAPSE_SPINNER_DESIGN_SPEC_PATH =
  "components/synapse/spinner/design-spec.md" as const;

export const SYNAPSE_SPINNER_IDS_BASELINE_SPEC_PATH =
  "components/ids/spinner/design-spec.md" as const;

export const SYNAPSE_SPINNER_SPEC_PATTERN = "ids-fork" as const;

/** Synapse documentation board — `Spinner`. */
export const SYNAPSE_SPINNER_MAIN_NODE_ID = "11067:54673" as const;

/** Light-surface medium sample (label below) — right panel on doc board. */
export const SYNAPSE_SPINNER_SPEC_ACCURATE_NODE_ID = "43328:2716" as const;

export const SYNAPSE_SPINNER_EXAMPLE_PANEL_NODES = {
  light: "11466:98482",
  dark: "43328:2711",
} as const;

export const SYNAPSE_SPINNER_SIZE_NODES = {
  small: "11099:58973",
  medium: "11099:58976",
  large: "11417:99226",
} as const;

/** IDS usage frame (3-up sample) — layout reference. */
export const SYNAPSE_SPINNER_IDS_USAGE_FRAME_NODE_ID = "11099:58972" as const;

/** IDS / shared element rotation prototype. */
export const SYNAPSE_SPINNER_ELEMENT_PROTOTYPE_NODE_ID = "11466:98447" as const;

export const SYNAPSE_SPINNER_SAMPLE_LABEL = "Loading..." as const;
