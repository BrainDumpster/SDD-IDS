/**
 * Synapse App Launcher — IDS-fork spec contract.
 * Full contract: `components/synapse/app-launcher/design-spec.md`
 * IDS baseline: `components/ids/app-launcher/design-spec.md`
 */
export const SYNAPSE_APP_LAUNCHER_DESIGN_SPEC_PATH =
  "components/synapse/app-launcher/design-spec.md" as const;

export const SYNAPSE_APP_LAUNCHER_IDS_BASELINE_SPEC_PATH =
  "components/ids/app-launcher/design-spec.md" as const;

export const SYNAPSE_APP_LAUNCHER_SPEC_PATTERN = "ids-fork" as const;

export const SYNAPSE_APP_LAUNCHER_MAIN_NODE_ID = "13231:123761" as const;
export const SYNAPSE_APP_LAUNCHER_ELEMENT_NODE_ID = "13231:109521" as const;

export const SYNAPSE_APP_LAUNCHER_PRODUCT_COUNT_NODES = {
  one: "13231:124278",
  two: "13231:124200",
  three: "13231:124054",
  four: "13231:123908",
  eight: "13231:123730",
} as const;

export const SYNAPSE_APP_LAUNCHER_TILE_STATE_NODES = {
  default: "13231:109520",
  hover: "13231:109522",
  press: "14141:255626",
  focus: "54003:292178",
} as const;

/** Figma sample tile label (`AppLauncher-Element`). */
export const SYNAPSE_APP_LAUNCHER_SAMPLE_PRODUCT_NAME = "Product Name" as const;

export const SYNAPSE_APP_LAUNCHER_TILE_WIDTH_PX = 148 as const;
export const SYNAPSE_APP_LAUNCHER_TILE_HEIGHT_PX = 125 as const;
export const SYNAPSE_APP_LAUNCHER_SURFACE_WIDTH_TWO_PX = 298 as const;
export const SYNAPSE_APP_LAUNCHER_SURFACE_WIDTH_ONE_PX = 150 as const;
