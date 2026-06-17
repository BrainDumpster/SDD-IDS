/**
 * IDS About — design-spec contract.
 * Full contract: `components/ids/about/design-spec.md`
 */
export const IDS_ABOUT_DESIGN_SPEC_PATH =
  "components/ids/about/design-spec.md" as const;

export const IDS_ABOUT_FIGMA_FILE_KEY = "VZJ48bbVYrIynw8DdSukWw" as const;

/** Canonical IDS Design Library file for center-content spacing/sizing. */
export const IDS_ABOUT_DESIGN_LIBRARY_FILE_KEY =
  "0bHk3XhrjFhowgFkz9yLr4" as const;

export const IDS_ABOUT_FIGMA_NODES = {
  board: "30680:10863",
  mainTabsFalse: "30680:10962",
  mainTabsTrue: "30680:10947",
  /** IDS Design Library — `.About-Element-Content` `Swap Content=About Default` */
  designLibraryContentDefault: "30680:10912",
  exampleProductIcon: "30680:10878",
  exampleSerial: "30680:10879",
  contentTextExample: "30680:10928",
  productIcon: "44484:722",
} as const;

/** Figma `About-Main` surface (`Tabs=False`). */
export const IDS_ABOUT_SURFACE_WIDTH_PX = 1152 as const;
export const IDS_ABOUT_SURFACE_HEIGHT_PX = 596 as const;

export const IDS_ABOUT_CONTENT_PANEL_HEIGHT_PX = 446 as const;

/** Computed Product block height (icon + name cluster) per Design Library `30680:10962`. */
export const IDS_ABOUT_PRODUCT_BLOCK_HEIGHT_PX = 218 as const;

/** Vertical padding inside the 446px content panel (top and bottom). */
export const IDS_ABOUT_CONTENT_PANEL_PADDING_Y_PX = 48 as const;

export const IDS_ABOUT_SAMPLE_PRODUCT_TITLE = "Software Product Name" as const;
export const IDS_ABOUT_SAMPLE_VERSION =
  "Version 5.1.2 (Release 3120, Build 0123)" as const;
export const IDS_ABOUT_SAMPLE_SERIAL = "1A2B3C4D5E6F7G" as const;

export const IDS_ABOUT_SAMPLE_COPYRIGHT =
  "Copyright © 2025 Dell Inc. or its subsidiaries. All Rights Reserved. Dell Technologies, Dell and other trademarks are trademarks of Dell Inc. or its subsidiaries. Other trademarks may be trademarks of their respective owners." as const;

export const IDS_ABOUT_PRODUCT_ICON_SLUG = "shield-cloud" as const;
export const IDS_ABOUT_BRAND_LOGO_SLUG = "logo-delltech-horiz" as const;

export const IDS_TAB_DESIGN_SPEC_PATH = "components/ids/tab/design-spec.md" as const;

/** Figma `30680:10947` MODAL-TAB-BAR sample labels (after About). */
export const IDS_ABOUT_SAMPLE_TAB_LABELS = [
  "Tab Option 1",
  "Tab Option 2",
  "Tab Option 3",
] as const;
