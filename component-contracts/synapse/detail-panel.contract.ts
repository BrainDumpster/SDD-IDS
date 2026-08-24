import type { DetailPanelAttachMode } from "../ids/detail-panel.contract";

/**
 * Synapse Detail Panel — thin IDS fork; composition and behavior inherit IDS baseline.
 */
export const SYNAPSE_DETAIL_PANEL_DESIGN_SPEC_PATH =
  "components/synapse/detail-panel/design-spec.md" as const;

export const SYNAPSE_DETAIL_PANEL_IDS_BASELINE_SPEC_PATH =
  "components/ids/detail-panel/design-spec.md" as const;

export const SYNAPSE_DETAIL_PANEL_SPEC_PATTERN = "ids-fork" as const;

/** Synapse registry node (`data/synapse-component-registry.json`). */
export const SYNAPSE_DETAIL_PANEL_MAIN_NODE_ID = "detail-panel" as const;

export const SYNAPSE_DETAIL_PANEL_API_DEFAULTS = {
  attachMode: "datagrid" as DetailPanelAttachMode,
  expanded: true,
  title: "Details",
} as const;
