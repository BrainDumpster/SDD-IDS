/**
 * Synapse Suggested Prompt — standalone spec contract.
 * Full contract: `components/synapse/suggested-prompt/design-spec.md`
 */
export const SYNAPSE_SUGGESTED_PROMPT_DESIGN_SPEC_PATH =
  "components/synapse/suggested-prompt/design-spec.md" as const;

export const SYNAPSE_SUGGESTED_PROMPT_SPEC_PATTERN = "standalone" as const;

export const SYNAPSE_SUGGESTED_PROMPT_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

/** Main component set — `Suggested Prompt`. */
export const SYNAPSE_SUGGESTED_PROMPT_MAIN_SET_NODE_ID = "48467:26158" as const;

export const SYNAPSE_SUGGESTED_PROMPT_VARIANT_NODES = {
  aiGradientFalse: "48467:26157",
  aiGradientTrue: "53325:277102",
} as const;

/** Figma default label (`48467:26157`). */
export const SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL =
  "Summarize the health of my environment" as const;

/** Leading icon when `icon=true` (Figma `52141:31838`). */
export const SYNAPSE_SUGGESTED_PROMPT_ICON_SHAPE = "arrow-right" as const;

export const SYNAPSE_SUGGESTED_PROMPT_RADIUS_ALIAS = "--suggested-prompt-radius" as const;

/** Vertical list gap (Chat Input Box `withSuggestedPromptsV`). */
export const SYNAPSE_SUGGESTED_PROMPT_LIST_GAP_VERTICAL_ALIAS = "--spacing-space-12" as const;

/** Flex-wrap list gap (new-chat suggestions). */
export const SYNAPSE_SUGGESTED_PROMPT_LIST_GAP_WRAP_ALIAS = "--spacing-space-12" as const;
