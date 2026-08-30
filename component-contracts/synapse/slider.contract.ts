/**
 * Synapse Slider — IDS-fork spec contract.
 * Full contract: `components/synapse/slider/design-spec.md`
 * IDS baseline: `components/ids/slider/design-spec.md`
 */
export const SYNAPSE_SLIDER_DESIGN_SPEC_PATH = "components/synapse/slider/design-spec.md" as const;

export const SYNAPSE_SLIDER_IDS_BASELINE_SPEC_PATH = "components/ids/slider/design-spec.md" as const;

export const SYNAPSE_SLIDER_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_SLIDER_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

export const SYNAPSE_SLIDER_BOARD_NODE_ID = "21983:31228" as const;
export const SYNAPSE_SLIDER_MAIN_SET_NODE_ID = "22459:39022" as const;
export const SYNAPSE_SLIDER_STATE_MATRIX_NODE_ID = "22459:40319" as const;
export const SYNAPSE_SLIDER_PARTS_NODE_ID = "22459:38985" as const;
export const SYNAPSE_SLIDER_MARKER_STATES_NODE_ID = "22505:177044" as const;
export const SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID = "22459:39047" as const;

export const SYNAPSE_SLIDER_DEFAULT_ARGS = {
  mode: "single" as const,
  min: 0,
  max: 100,
  defaultValue: 50,
  minLabel: "0",
  maxLabel: "100",
  showStepper: true,
  stepperFrequency: 10,
  showValueLabel: true,
};
