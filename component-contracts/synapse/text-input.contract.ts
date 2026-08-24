/**
 * Synapse Text Input — IDS-fork spec contract.
 * Full contract: `components/synapse/text-input/design-spec.md`
 * IDS baseline: `components/ids/text-box/design-spec.md`
 */
export const SYNAPSE_TEXT_INPUT_DESIGN_SPEC_PATH =
  "components/synapse/text-input/design-spec.md" as const;

export const SYNAPSE_TEXT_INPUT_IDS_BASELINE_SPEC_PATH =
  "components/ids/text-box/design-spec.md" as const;

export const SYNAPSE_TEXT_INPUT_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_TEXT_INPUT_THEME_ALIAS = "--text-box-control-radius" as const;

export const SYNAPSE_TEXT_INPUT_MAIN_NODE_ID = "47833:47770" as const;
export const SYNAPSE_TEXT_INPUT_DOCUMENTATION_NODE_ID = "47833:48165" as const;

export const SYNAPSE_TEXT_INPUT_SCENARIO_NODES = {
  large: "47834:48520",
  small: "47834:48553",
  withIcon: "47834:48653",
  error: "47834:48457",
} as const;

export const SYNAPSE_TEXT_INPUT_STATE_NODES = {
  largeEmptyDefault: "47833:48063",
  largeEmptyHover: "47833:48055",
  largeEmptySelected: "47833:48047",
  largeEmptyFocus: "47833:48038",
  largeEmptyDisabled: "47833:48030",
  largeEmptyError: "47833:48022",
  smallEmptyDefault: "47833:47972",
  textAreaLargeEmptyDefault: "47833:47872",
} as const;

export const SYNAPSE_TEXT_INPUT_SPEC_ACCURATE_SCENARIO_NODE_ID =
  SYNAPSE_TEXT_INPUT_SCENARIO_NODES.large;

export const SYNAPSE_TEXT_INPUT_SAMPLE_WIDTH_PX = 300 as const;
export const SYNAPSE_TEXT_INPUT_LARGE_HEIGHT_PX = 40 as const;
export const SYNAPSE_TEXT_INPUT_SMALL_HEIGHT_PX = 32 as const;

export const SYNAPSE_TEXT_INPUT_SAMPLE_PLACEHOLDER = "Placeholder Text" as const;
export const SYNAPSE_TEXT_INPUT_SAMPLE_VALUE = "Filled Text" as const;
export const SYNAPSE_TEXT_INPUT_SAMPLE_HELPER = "Helper text" as const;
export const SYNAPSE_TEXT_INPUT_SAMPLE_ERROR = "Error message" as const;
