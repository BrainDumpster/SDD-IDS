/**
 * IDS Dual List Box — framework-agnostic spec contract.
 * Source: `components/ids/dual-list-box/design-spec.md`
 */
export const IDS_DUAL_LIST_BOX_DESIGN_SPEC_PATH =
  "components/ids/dual-list-box/design-spec.md" as const;

export interface DualListBoxItem {
  id: string;
  name: string;
  description?: string;
  tooltipTitle?: string;
  tooltipDescription?: string;
}

export type DualListBoxPane = "available" | "selected";

export type DualListBoxTransferAction =
  | "moveAllRight"
  | "moveSelectedRight"
  | "moveSelectedLeft"
  | "moveAllLeft";

export type DualListBoxMetricsFormat = "total" | "total-and-selected";
export type DualListBoxTooltipSide = "top" | "bottom" | "left" | "right";
export type DualListBoxTooltipArrowAlign = "start" | "center" | "end";

export interface DualListBoxItemsChangeDetail {
  available: DualListBoxItem[];
  selected: DualListBoxItem[];
}

export interface DualListBoxTransferDetail {
  action: DualListBoxTransferAction;
  movedIds: string[];
}

export interface DualListBoxDragDropDetail {
  itemId: string;
  from: DualListBoxPane;
  to: DualListBoxPane;
  toIndex: number;
}

export const DUAL_LIST_BOX_DEFAULTS = {
  availableTitle: "Available Items",
  selectedTitle: "Selected Items",
  availablePlaceholder: "Select items on the right to move",
  selectedPlaceholder: "Select items on the left to move",
  moveSelectedRightTitle: "Move right",
  moveSelectedLeftTitle: "Move left",
  showMetrics: true,
  metricsFormat: "total" as DualListBoxMetricsFormat,
  enableDragDrop: true,
  itemTooltipSide: "top" as DualListBoxTooltipSide,
  itemTooltipArrowAlign: "center" as DualListBoxTooltipArrowAlign,
  ariaLabel: "Dual list box",
} as const;

export const DUAL_LIST_BOX_SPEC_ACCURATE_AVAILABLE_ITEMS: readonly DualListBoxItem[] = Array.from(
  { length: 6 },
  (_, index) => ({
    id: `avail-${index + 1}`,
    name: "List Item",
  }),
);

export const DUAL_LIST_BOX_SPEC_ACCURATE_DEFAULTS = {
  ...DUAL_LIST_BOX_DEFAULTS,
  availableItems: DUAL_LIST_BOX_SPEC_ACCURATE_AVAILABLE_ITEMS,
  selectedItems: [] as readonly DualListBoxItem[],
  availableSelection: [] as readonly string[],
  selectedSelection: [] as readonly string[],
  moveAllRightTitle: "Add all from Available Items",
  moveAllLeftTitle: "Remove all from Selected Items",
} as const;
