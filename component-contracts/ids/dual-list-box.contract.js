/**
 * IDS Dual List Box — framework-agnostic spec contract.
 * Source: `components/ids/dual-list-box/design-spec.md`
 */
export const IDS_DUAL_LIST_BOX_DESIGN_SPEC_PATH = "components/ids/dual-list-box/design-spec.md";
export const DUAL_LIST_BOX_DEFAULTS = {
    availableTitle: "Available Items",
    selectedTitle: "Selected Items",
    availablePlaceholder: "Select items on the right to move",
    selectedPlaceholder: "Select items on the left to move",
    moveSelectedRightTitle: "Move right",
    moveSelectedLeftTitle: "Move left",
    showMetrics: true,
    metricsFormat: "total",
    enableDragDrop: true,
    itemTooltipSide: "top",
    itemTooltipArrowAlign: "center",
    ariaLabel: "Dual list box",
};
export const DUAL_LIST_BOX_SPEC_ACCURATE_AVAILABLE_ITEMS = Array.from({ length: 6 }, (_, index) => ({
    id: `avail-${index + 1}`,
    name: "List Item",
}));
export const DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS = {
    ...DUAL_LIST_BOX_DEFAULTS,
    availableItems: DUAL_LIST_BOX_SPEC_ACCURATE_AVAILABLE_ITEMS,
    selectedItems: [],
    availableSelection: [],
    selectedSelection: [],
    moveAllRightTitle: "Add all from Available Items",
    moveAllLeftTitle: "Remove all from Selected Items",
};
