/**
 * Synapse Thinking — standalone composition spec contract.
 * Full contract: `components/synapse/thinking/design-spec.md`
 */
export const SYNAPSE_THINKING_DESIGN_SPEC_PATH =
  "components/synapse/thinking/design-spec.md" as const;

export const SYNAPSE_THINKING_SPEC_PATTERN = "standalone" as const;

export const SYNAPSE_THINKING_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

/** Chat System Response examples board (Thinking sections). */
export const SYNAPSE_THINKING_EXAMPLES_BOARD_NODE_ID = "53259:126090" as const;

export const SYNAPSE_THINKING_VARIANT_NODES = {
  spinner: "53259:126109",
  progressBar: "53259:126110",
} as const;

/** `Chat System Response` variant frames. */
export const SYNAPSE_THINKING_VARIANT_FRAME_NODES = {
  spinner: "48095:45590",
  progressBar: "48611:71327",
} as const;

/** Figma sample copy — spinner variant. */
export const SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL = "Collecting information" as const;

/** Figma sample copy — progress-bar variant. */
export const SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL = "Calculating..." as const;

export const SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE = 10 as const;

/** Figma inline progress track width (`48611:71327`). */
export const SYNAPSE_THINKING_PROGRESS_TRACK_WIDTH_PX = 227 as const;

export const SYNAPSE_THINKING_SPINNER_SPEC_PATH =
  "components/synapse/spinner/design-spec.md" as const;

export const SYNAPSE_THINKING_PROGRESS_BAR_SPEC_PATH =
  "components/synapse/progress-bar/design-spec.md" as const;
