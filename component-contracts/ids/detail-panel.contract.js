/**
 * IDS Detail Panel — framework-agnostic spec contract.
 * Source: `components/ids/detail-panel/design-spec.md`
 */
export const IDS_DETAIL_PANEL_DESIGN_SPEC_PATH = "components/ids/detail-panel/design-spec.md";
export const DETAIL_PANEL_ATTACH_MODES = ["datagrid", "page"];
export const DETAIL_PANEL_EXPANDED_ICON = "double-chev-right";
export const DETAIL_PANEL_COLLAPSED_ICON = "double-chev-left";
export const DETAIL_PANEL_DIMENSIONS = {
    expandedWidth: 398,
    collapsedWidth: 40,
};
export const DETAIL_PANEL_COMPOSITION_SLOT_ORDER = [
    "detailPanelHeader",
    "detailPanelBody",
];
export const DETAIL_PANEL_CODEGEN_ANATOMY = [
    "detailPanelRoot",
    "detailPanelHeader",
    "detailPanelBody",
    "detailPanelFooter",
    "detailPanelCollapsedRail",
    "detailPanelToggleButton",
];
export const DETAIL_PANEL_API_DEFAULTS = {
    attachMode: "datagrid",
    expanded: true,
    title: "Details",
    showHeader: true,
    showFooter: true,
    ariaLabelExpand: "Expand details panel",
    ariaLabelCollapse: "Collapse details panel",
    collapsedWidth: DETAIL_PANEL_DIMENSIONS.collapsedWidth,
    expandedWidth: DETAIL_PANEL_DIMENSIONS.expandedWidth,
};
export const DETAIL_PANEL_SPEC_ACCURATE_DEFAULTS = {
    attachMode: "datagrid",
    expanded: true,
    title: "Details",
};
export const DETAIL_PANEL_EVENT_KEYS = ["expandedChange", "opened", "closed"];
