/**
 * Synapse Slider — IDS-fork + viewport programme deltas.
 * Full contract: `components/synapse/slider/design-spec.md`
 * IDS baseline: `components/ids/slider/design-spec.md`
 */
export const SYNAPSE_SLIDER_DESIGN_SPEC_PATH = "components/synapse/slider/design-spec.md" as const;

export const SYNAPSE_SLIDER_IDS_BASELINE_SPEC_PATH = "components/ids/slider/design-spec.md" as const;

export const SYNAPSE_SLIDER_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_SLIDER_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

/** Form Elements board (IDS-fork matrices). */
export const SYNAPSE_SLIDER_BOARD_NODE_ID = "21983:31228" as const;
export const SYNAPSE_SLIDER_MAIN_SET_NODE_ID = "22459:39022" as const;
export const SYNAPSE_SLIDER_STATE_MATRIX_NODE_ID = "22459:40319" as const;
export const SYNAPSE_SLIDER_PARTS_NODE_ID = "22459:38985" as const;
export const SYNAPSE_SLIDER_MARKER_STATES_NODE_ID = "22505:177044" as const;
export const SYNAPSE_SLIDER_SPEC_ACCURATE_NODE_ID = "22459:39047" as const;

/** Topology board — Synapse-native viewport slider (`48306:5980`). */
export const SYNAPSE_SLIDER_TOPOLOGY_BOARD_NODE_ID = "48306:5980" as const;
export const SYNAPSE_SLIDER_VIEWPORT_TRACK_NODE_ID = "53932:123027" as const;
export const SYNAPSE_SLIDER_VIEWPORT_MARKER_SET_NODE_ID = "53910:122392" as const;
export const SYNAPSE_SLIDER_VIEWPORT_SYMBOL_NODE_ID = "53932:151178" as const;
export const SYNAPSE_SLIDER_WITH_BUTTONS_NODE_ID = "53932:151198" as const;
export const SYNAPSE_SLIDER_VIEWPORT_RANGE_NODE_ID = "53928:122955" as const;
export const SYNAPSE_SLIDER_TOPOLOGY_TOOLBAR_NODE_ID = "53949:279842" as const;

export const SYNAPSE_SLIDER_VIEWPORT_WIDTH_PX = 120 as const;
export const SYNAPSE_SLIDER_VIEWPORT_HEIGHT_PX = 16 as const;
export const SYNAPSE_SLIDER_VIEWPORT_RAIL_HEIGHT_PX = 6 as const;

/** `53932:151198` cluster footprint (Figma-verified). */
export const SYNAPSE_SLIDER_WITH_BUTTONS_WIDTH_PX = 254 as const;
export const SYNAPSE_SLIDER_WITH_BUTTONS_HEIGHT_PX = 28 as const;
export const SYNAPSE_SLIDER_WITH_BUTTONS_GAP_PX = 12 as const;
export const SYNAPSE_SLIDER_VIEWPORT_BUTTON_WIDTH_PX = 32 as const;
export const SYNAPSE_SLIDER_VIEWPORT_BUTTON_HEIGHT_PX = 28 as const;
/** Figma `_Slider-Range` sample width on 120px track (`53928:122955`). */
export const SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_RANGE_WIDTH_PX = 75 as const;

/**
 * Static Figma reference for `53932:151198` (slider fill ≈ 75/120; readout shows `100%`).
 * Live topology uses `25–300` zoom mapping via `TopologyZoomSlider`.
 */
export const SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE = {
  min: 0,
  max: 100,
  value: 63,
  readoutLabel: "100%",
} as const;

export const SYNAPSE_SLIDER_WITH_BUTTONS_DEFAULT_ARGS = {
  min: SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.min,
  max: SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.max,
  defaultValue: SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.value,
  readout: SYNAPSE_SLIDER_WITH_BUTTONS_DESIGN_SAMPLE.readoutLabel,
} as const;

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

export const SYNAPSE_SLIDER_VIEWPORT_DEFAULT_ARGS = {
  mode: "single" as const,
  min: 25,
  max: 300,
  defaultValue: 100,
  showStepper: false,
  showValueLabel: false,
  showEdgeLabels: false,
  density: "viewport" as const,
};
