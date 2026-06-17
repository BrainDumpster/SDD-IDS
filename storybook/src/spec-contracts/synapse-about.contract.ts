/**
 * Synapse About — IDS-fork spec contract.
 * Full contract: `components/synapse/about/design-spec.md`
 * IDS baseline: `components/ids/about/design-spec.md`
 */
export const SYNAPSE_ABOUT_DESIGN_SPEC_PATH =
  "components/synapse/about/design-spec.md" as const;

export const SYNAPSE_ABOUT_IDS_BASELINE_SPEC_PATH =
  "components/ids/about/design-spec.md" as const;

export const SYNAPSE_ABOUT_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_ABOUT_FIGMA_FILE_KEY = "Td1bnsvRj1PCGs9RVJkIvJ" as const;

export const SYNAPSE_ABOUT_FIGMA_NODES = {
  main: "49962:52708",
  usageBoard: "49962:53917",
  usageInstance: "49962:53921",
  serialRow: "49962:52727",
  topContent: "49962:52710",
  header: "49962:52711",
  frameCenter: "49962:52720",
  centerArea: "49962:52721",
} as const;

/** @deprecated Use SYNAPSE_ABOUT_FIGMA_NODES.main */
export const SYNAPSE_ABOUT_MAIN_NODE_ID = SYNAPSE_ABOUT_FIGMA_NODES.main;

/** @deprecated Use SYNAPSE_ABOUT_FIGMA_NODES.usageInstance */
export const SYNAPSE_ABOUT_USAGE_INSTANCE_NODE_ID =
  SYNAPSE_ABOUT_FIGMA_NODES.usageInstance;

/** @deprecated Use SYNAPSE_ABOUT_FIGMA_NODES.usageBoard */
export const SYNAPSE_ABOUT_USAGE_BOARD_NODE_ID =
  SYNAPSE_ABOUT_FIGMA_NODES.usageBoard;

/** @deprecated Use SYNAPSE_ABOUT_FIGMA_NODES.serialRow */
export const SYNAPSE_ABOUT_SERIAL_ROW_NODE_ID = SYNAPSE_ABOUT_FIGMA_NODES.serialRow;

/** Figma `About-Synapse` surface dimensions. */
export const SYNAPSE_ABOUT_SURFACE_WIDTH_PX = 1152 as const;
export const SYNAPSE_ABOUT_SURFACE_HEIGHT_PX = 596 as const;

export const SYNAPSE_ABOUT_TOP_CONTENT_HEIGHT_PX = 508 as const;

/** Synapse CENTER AREA max-width (`49962:52721`). */
export const SYNAPSE_ABOUT_CENTER_MAX_WIDTH_PX = 1056 as const;

/** Product ↔ Copyright gap — `var(--spacing-space-56)` / loose-density. */
export const SYNAPSE_ABOUT_PRODUCT_COPYRIGHT_GAP_PX = 56 as const;

export const SYNAPSE_ABOUT_SAMPLE_PRODUCT_TITLE = "Synapse" as const;
export const SYNAPSE_ABOUT_SAMPLE_VERSION = "Version X.X.X" as const;
export const SYNAPSE_ABOUT_SAMPLE_SERIAL = "1A2B3C4D5E6F7G" as const;

export const SYNAPSE_ABOUT_SAMPLE_COPYRIGHT =
  "Copyright © 2026 Dell Inc. or its subsidiaries. All Rights Reserved. Dell Technologies, Dell and other trademarks are trademarks of Dell Inc. or its subsidiaries. Other trademarks may be trademarks of their respective owners." as const;

export const SYNAPSE_ABOUT_BRAND_LOGO_SLUG = "logo-delltech-horiz" as const;

export const SYNAPSE_TABS_DESIGN_SPEC_PATH =
  "components/synapse/tabs/design-spec.md" as const;

export const SYNAPSE_BUTTON_DESIGN_SPEC_PATH =
  "components/synapse/button/design-spec.md" as const;
