/**
 * Synapse Anchor Menu — IDS-fork spec contract.
 * Full contract: `components/synapse/anchor-menu/design-spec.md`
 * IDS baseline: `components/ids/anchor-menu/design-spec.md`
 */
export const SYNAPSE_ANCHOR_MENU_DESIGN_SPEC_PATH =
  "components/synapse/anchor-menu/design-spec.md" as const;

export const SYNAPSE_ANCHOR_MENU_IDS_BASELINE_SPEC_PATH =
  "components/ids/anchor-menu/design-spec.md" as const;

export const SYNAPSE_ANCHOR_MENU_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_ANCHOR_MENU_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

export const SYNAPSE_ANCHOR_MENU_BOARD_NODE_ID = "11067:54486" as const;
export const SYNAPSE_ANCHOR_MENU_ELEMENT_MATRIX_NODE_ID = "11955:229729" as const;
export const SYNAPSE_ANCHOR_MENU_MAIN_SET_NODE_ID = "11955:229780" as const;
export const SYNAPSE_ANCHOR_MENU_SPEC_ACCURATE_NODE_ID = "11955:229709" as const;

/** Figma `AnchorMenu-Example` labels (first item active). */
export const SYNAPSE_ANCHOR_MENU_SAMPLE_ITEMS = [
  { label: "Overview", href: "#overview", active: true },
  { label: "Types", href: "#types" },
  { label: "Anatomy", href: "#anatomy" },
  { label: "Usage Rules", href: "#usage-rules" },
  { label: "States and Colors", href: "#states-and-colors" },
  { label: "Redlines", href: "#redlines" },
] as const;
