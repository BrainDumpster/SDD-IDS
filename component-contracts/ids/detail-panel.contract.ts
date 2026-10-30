/**
 * IDS Detail Panel — framework-agnostic spec contract.
 * Source: `components/ids/detail-panel/design-spec.md`
 */
export const IDS_DETAIL_PANEL_DESIGN_SPEC_PATH =
  "components/ids/detail-panel/design-spec.md" as const;

export type DetailPanelAttachMode = "datagrid" | "page";

export const DETAIL_PANEL_ATTACH_MODES: DetailPanelAttachMode[] = ["datagrid", "page"];

export const DETAIL_PANEL_EXPANDED_ICON = "double-chev-right" as const;
export const DETAIL_PANEL_COLLAPSED_ICON = "double-chev-left" as const;

export const DETAIL_PANEL_DIMENSIONS = {
  expandedWidth: 398,
  collapsedWidth: 40,
} as const;

export const DETAIL_PANEL_COMPOSITION_SLOT_ORDER = [
  "detailPanelHeader",
  "detailPanelBody",
] as const;

export type DetailPanelCompositionSlot = (typeof DETAIL_PANEL_COMPOSITION_SLOT_ORDER)[number];

export const DETAIL_PANEL_CODEGEN_ANATOMY = [
  "detailPanelRoot",
  "detailPanelHeader",
  "detailPanelBody",
  "detailPanelFooter",
  "detailPanelCollapsedRail",
  "detailPanelToggleButton",
] as const;

export const DETAIL_PANEL_API_DEFAULTS = {
  attachMode: "datagrid" as DetailPanelAttachMode,
  expanded: true,
  title: "Details",
  showHeader: true,
  showFooter: true,
  ariaLabelExpand: "Expand details panel",
  ariaLabelCollapse: "Collapse details panel",
  collapsedWidth: DETAIL_PANEL_DIMENSIONS.collapsedWidth,
  expandedWidth: DETAIL_PANEL_DIMENSIONS.expandedWidth,
} as const;

export const DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS = {
  attachMode: "datagrid" as DetailPanelAttachMode,
  expanded: true,
  title: "Details",
} as const;

export const DETAIL_PANEL_EVENT_KEYS = ["expandedChange", "opened", "closed"] as const;
