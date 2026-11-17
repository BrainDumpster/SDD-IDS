/**
 * IDS Dual List Box — constants & types (React / design-spec parity).
 *
 * Spec: `components/ids/dual-list-box/design-spec.md`
 * API: `lib/react/ids/dual-list-box`
 */

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

export interface DualListBoxItemsChangeDetail {
  available: DualListBoxItem[];
  selected: DualListBoxItem[];
}

export type DualListBoxMetricsFormat = "total" | "total-and-selected";

export type TransferVisualState = "default" | "disabled";

export type DualListBoxDragSession = {
  itemId: string;
  sourcePane: DualListBoxPane;
  hadSelection: boolean;
};

export type DualListBoxDropIndicator = {
  pane: DualListBoxPane;
  targetItemId: string;
  position: "before" | "after";
};

export const DRAG_HANDLE_ICON = "arrow-arrange";
export const SELECTION_CHECK_ICON = "shape-check-thick";
export const DRAG_DATA_TYPE = "application/x-ids-dual-list-item";

export const DEFAULT_AVAILABLE_TITLE = "Available Items";
export const DEFAULT_SELECTED_TITLE = "Selected Items";
export const DEFAULT_AVAILABLE_PLACEHOLDER = "Select items on the right to move";
export const DEFAULT_SELECTED_PLACEHOLDER = "Select items on the left to move";

export const DUAL_LIST_BOX_RUNTIME_DEFAULTS = {
  availableTitle: DEFAULT_AVAILABLE_TITLE,
  selectedTitle: DEFAULT_SELECTED_TITLE,
  availablePlaceholder: DEFAULT_AVAILABLE_PLACEHOLDER,
  selectedPlaceholder: DEFAULT_SELECTED_PLACEHOLDER,
  showMetrics: true,
  metricsFormat: "total" as DualListBoxMetricsFormat,
  enableDragDrop: true,
  itemTooltipSide: "top" as const,
  itemTooltipArrowAlign: "center" as const,
  ariaLabel: "Dual list box",
  moveSelectedRightTitle: "Move right",
  moveSelectedLeftTitle: "Move left",
};

export const TRANSFER_BUTTONS: {
  action: DualListBoxTransferAction;
  icon: string;
  dataIds: string;
  anatomy: string;
}[] = [
  {
    action: "moveAllRight",
    icon: "double-chev-right",
    dataIds: "ids-dual-list-box-move-all-right",
    anatomy: "MoveAllRight",
  },
  {
    action: "moveSelectedRight",
    icon: "chev-right",
    dataIds: "ids-dual-list-box-move-selected-right",
    anatomy: "MoveSelectedRight",
  },
  {
    action: "moveSelectedLeft",
    icon: "chev-left",
    dataIds: "ids-dual-list-box-move-selected-left",
    anatomy: "MoveSelectedLeft",
  },
  {
    action: "moveAllLeft",
    icon: "double-chev-left",
    dataIds: "ids-dual-list-box-move-all-left",
    anatomy: "MoveAllLeft",
  },
];

export function itemFocusKey(pane: DualListBoxPane, id: string): string {
  return `${pane}:${id}`;
}

export function resolveMetricsFormat(value: unknown): DualListBoxMetricsFormat {
  return value === "total-and-selected" ? "total-and-selected" : "total";
}

export function itemAccessibleName(item: DualListBoxItem): string {
  const name = item.name?.trim();
  return name || item.id;
}

export function assertUniqueIds(
  available: DualListBoxItem[],
  selected: DualListBoxItem[],
): void {
  const seen = new Set<string>();
  for (const item of [...available, ...selected]) {
    if (!item.id) {
      throw new Error("IdsDualListBox: each item requires a non-empty `id`.");
    }
    if (seen.has(item.id)) {
      throw new Error(`IdsDualListBox: duplicate item id "${item.id}".`);
    }
    seen.add(item.id);
  }
}

export function buildTransferLabels(
  availableTitle: string,
  selectedTitle: string,
  overrides: {
    moveSelectedRightTitle?: string;
    moveSelectedLeftTitle?: string;
    moveAllRightTitle?: string;
    moveAllLeftTitle?: string;
  },
): Record<DualListBoxTransferAction, string> {
  return {
    moveAllRight:
      overrides.moveAllRightTitle ?? `Add all from ${availableTitle}`,
    moveSelectedRight: overrides.moveSelectedRightTitle ?? "Move right",
    moveSelectedLeft: overrides.moveSelectedLeftTitle ?? "Move left",
    moveAllLeft:
      overrides.moveAllLeftTitle ?? `Remove all from ${selectedTitle}`,
  };
}

export function resolveTransferStates(
  availableCount: number,
  selectedCount: number,
  availableSelectionCount: number,
  selectedSelectionCount: number,
): Record<DualListBoxTransferAction, TransferVisualState> {
  const hasAvailable = availableCount > 0;
  const hasSelected = selectedCount > 0;
  const hasAvailSel = availableSelectionCount > 0;
  const hasSelectedSel = selectedSelectionCount > 0;

  if (hasAvailSel || hasSelectedSel) {
    return {
      moveAllRight: "disabled",
      moveSelectedRight: hasAvailSel ? "default" : "disabled",
      moveSelectedLeft: hasSelectedSel ? "default" : "disabled",
      moveAllLeft: "disabled",
    };
  }
  if (!hasSelected) {
    return {
      moveAllRight: hasAvailable ? "default" : "disabled",
      moveSelectedRight: "disabled",
      moveSelectedLeft: "disabled",
      moveAllLeft: "disabled",
    };
  }
  if (!hasAvailable) {
    return {
      moveAllRight: "disabled",
      moveSelectedRight: "disabled",
      moveSelectedLeft: "disabled",
      moveAllLeft: hasSelected ? "default" : "disabled",
    };
  }
  return {
    moveAllRight: "default",
    moveSelectedRight: "disabled",
    moveSelectedLeft: "disabled",
    moveAllLeft: "default",
  };
}

export function insertAt<T>(list: T[], index: number, item: T): T[] {
  const next = [...list];
  next.splice(index, 0, item);
  return next;
}

export function removeById(
  list: DualListBoxItem[],
  id: string,
): DualListBoxItem[] {
  return list.filter((item) => item.id !== id);
}
