/**
 * Synapse Accordion — IDS-fork spec contract.
 * Full contract: `components/synapse/accordion/design-spec.md`
 * IDS baseline: `components/ids/accordion/design-spec.md`
 */
export const SYNAPSE_ACCORDION_DESIGN_SPEC_PATH =
  "components/synapse/accordion/design-spec.md" as const;

export const SYNAPSE_ACCORDION_IDS_BASELINE_SPEC_PATH =
  "components/ids/accordion/design-spec.md" as const;

export const SYNAPSE_ACCORDION_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_ACCORDION_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

export const SYNAPSE_ACCORDION_BOARD_NODE_ID = "16551:26036" as const;
export const SYNAPSE_ACCORDION_MAIN_SET_NODE_ID = "10962:89111" as const;
export const SYNAPSE_ACCORDION_CHEVRON_LEFT_NODE_ID = "10962:89112" as const;

export const SYNAPSE_ACCORDION_SAMPLE_ITEMS = [
  { value: "section1", title: "Section 1", content: "First panel content." },
  { value: "section2", title: "Section 2", content: "Second panel content." },
  { value: "section3", title: "Section 3", content: "Third panel content." },
] as const;
