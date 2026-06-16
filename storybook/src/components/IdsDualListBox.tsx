import {
  useCallback,
  useMemo,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import { Icon } from "./Icon";
import { wrapDualListBoxItemWithIdsTooltip } from "./dualListBoxItemTooltip";
import styles from "./IdsDualListBox.module.css";

const DRAG_HANDLE_ICON = "arrow-arrange";
const SELECTION_CHECK_ICON = "shape-check-thick";
const DRAG_DATA_TYPE = "application/x-ids-dual-list-item";

/** User-defined list entry (available and selected panes share this shape). */
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
  /** Index in target pane after drop. */
  toIndex: number;
}

export interface DualListBoxItemsChangeDetail {
  available: DualListBoxItem[];
  selected: DualListBoxItem[];
}

export interface IdsDualListBoxProps {
  availableItems: DualListBoxItem[];
  selectedItems: DualListBoxItem[];
  /** Pane title (Angular: `availableOptionsLabel`). Default `Available Items`. */
  availableTitle?: string;
  /** Pane title (Angular: `selectedOptionsLabel`). Default `Selected Items`. */
  selectedTitle?: string;
  availablePlaceholder?: string;
  selectedPlaceholder?: string;
  /** Transfer hover/aria label (Angular: `moveRightButtonHoverTitle`). Default `Move right`. */
  moveSelectedRightTitle?: string;
  /** Transfer hover/aria label (Angular: `moveLeftButtonHoverTitle`). Default `Move left`. */
  moveSelectedLeftTitle?: string;
  /** Transfer hover/aria label (Angular: `addAllButtonHoverTitle`). Default `Add all from {availableTitle}`. */
  moveAllRightTitle?: string;
  /** Transfer hover/aria label (Angular: `removeAllButtonHoverTitle`). Default `Remove all from {selectedTitle}`. */
  moveAllLeftTitle?: string;
  availableSelection?: string[];
  selectedSelection?: string[];
  defaultAvailableSelection?: string[];
  defaultSelectedSelection?: string[];
  showMetrics?: boolean;
  metricsFormat?: "total" | "total-and-selected";
  /** Reorder within pane and move across panes via drag handle (`arrow-arrange`). Default `true`. */
  enableDragDrop?: boolean;
  onAvailableSelectionChange?: (ids: string[]) => void;
  onSelectedSelectionChange?: (ids: string[]) => void;
  onItemsChange?: (detail: DualListBoxItemsChangeDetail) => void;
  onTransfer?: (detail: DualListBoxTransferDetail) => void;
  onDragDrop?: (detail: DualListBoxDragDropDetail) => void;
  /** IDS Tooltip (`components/ids/tooltip/design-spec.md`) placement when item tooltips are enabled. */
  itemTooltipSide?: "top" | "bottom" | "left" | "right";
  itemTooltipArrowAlign?: "start" | "center" | "end";
  ariaLabel?: string;
}

const DEFAULT_AVAILABLE_TITLE = "Available Items";
const DEFAULT_SELECTED_TITLE = "Selected Items";
const DEFAULT_AVAILABLE_PLACEHOLDER = "Select items on the right to move";
const DEFAULT_SELECTED_PLACEHOLDER = "Select items on the left to move";

const TRANSFER_BUTTONS: {
  action: DualListBoxTransferAction;
  icon: string;
}[] = [
  { action: "moveAllRight", icon: "double-chev-right" },
  { action: "moveSelectedRight", icon: "chev-right" },
  { action: "moveSelectedLeft", icon: "chev-left" },
  { action: "moveAllLeft", icon: "double-chev-left" },
];

function itemFocusKey(pane: DualListBoxPane, id: string): string {
  return `${pane}:${id}`;
}

function buildTransferLabels(
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
    moveAllRight: overrides.moveAllRightTitle ?? `Add all from ${availableTitle}`,
    moveSelectedRight: overrides.moveSelectedRightTitle ?? "Move right",
    moveSelectedLeft: overrides.moveSelectedLeftTitle ?? "Move left",
    moveAllLeft: overrides.moveAllLeftTitle ?? `Remove all from ${selectedTitle}`,
  };
}

type TransferVisualState = "default" | "disabled";

type DragSession = {
  itemId: string;
  sourcePane: DualListBoxPane;
  hadSelection: boolean;
};

type DropIndicator = {
  pane: DualListBoxPane;
  targetItemId: string;
  position: "before" | "after";
};

function resolveTransferStates(
  availableCount: number,
  selectedCount: number,
  availableSelectionCount: number,
  selectedSelectionCount: number,
): Record<DualListBoxTransferAction, TransferVisualState> {
  const hasAvailable = availableCount > 0;
  const hasSelected = selectedCount > 0;
  const hasAvailSel = availableSelectionCount > 0;
  const hasSelectedSel = selectedSelectionCount > 0;
  const disabled = (): TransferVisualState => "disabled";
  const defaultState = (): TransferVisualState => "default";

  if (hasAvailSel || hasSelectedSel) {
    return {
      moveAllRight: disabled(),
      moveSelectedRight: hasAvailSel ? defaultState() : disabled(),
      moveSelectedLeft: hasSelectedSel ? defaultState() : disabled(),
      moveAllLeft: disabled(),
    };
  }
  if (!hasSelected) {
    return {
      moveAllRight: hasAvailable ? defaultState() : disabled(),
      moveSelectedRight: disabled(),
      moveSelectedLeft: disabled(),
      moveAllLeft: disabled(),
    };
  }
  if (!hasAvailable) {
    return {
      moveAllRight: disabled(),
      moveSelectedRight: disabled(),
      moveSelectedLeft: disabled(),
      moveAllLeft: hasSelected ? defaultState() : disabled(),
    };
  }
  return {
    moveAllRight: defaultState(),
    moveSelectedRight: disabled(),
    moveSelectedLeft: disabled(),
    moveAllLeft: defaultState(),
  };
}

function insertAt<T>(list: T[], index: number, item: T): T[] {
  const next = [...list];
  next.splice(index, 0, item);
  return next;
}

function removeById(list: DualListBoxItem[], id: string): DualListBoxItem[] {
  return list.filter((item) => item.id !== id);
}

export function IdsDualListBox({
  availableItems: availableItemsProp,
  selectedItems: selectedItemsProp,
  availableTitle = DEFAULT_AVAILABLE_TITLE,
  selectedTitle = DEFAULT_SELECTED_TITLE,
  availablePlaceholder = DEFAULT_AVAILABLE_PLACEHOLDER,
  selectedPlaceholder = DEFAULT_SELECTED_PLACEHOLDER,
  availableSelection: availableSelectionProp,
  selectedSelection: selectedSelectionProp,
  defaultAvailableSelection = [],
  defaultSelectedSelection = [],
  showMetrics = true,
  metricsFormat = "total",
  enableDragDrop = true,
  onAvailableSelectionChange,
  onSelectedSelectionChange,
  onItemsChange,
  onTransfer,
  onDragDrop,
  moveSelectedRightTitle,
  moveSelectedLeftTitle,
  moveAllRightTitle,
  moveAllLeftTitle,
  itemTooltipSide = "top",
  itemTooltipArrowAlign = "center",
  ariaLabel = "Dual list box",
}: IdsDualListBoxProps) {
  const [availableItems, setAvailableItems] = useState(availableItemsProp);
  const [selectedItems, setSelectedItems] = useState(selectedItemsProp);
  const [availableSelectionInternal, setAvailableSelectionInternal] = useState<string[]>(
    defaultAvailableSelection,
  );
  const [selectedSelectionInternal, setSelectedSelectionInternal] = useState<string[]>(
    defaultSelectedSelection,
  );
  const [dragSession, setDragSession] = useState<DragSession | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  const [focusedItemKey, setFocusedItemKey] = useState<string | null>(null);

  const transferLabels = useMemo(
    () =>
      buildTransferLabels(availableTitle, selectedTitle, {
        moveSelectedRightTitle,
        moveSelectedLeftTitle,
        moveAllRightTitle,
        moveAllLeftTitle,
      }),
    [
      availableTitle,
      moveAllLeftTitle,
      moveAllRightTitle,
      moveSelectedLeftTitle,
      moveSelectedRightTitle,
      selectedTitle,
    ],
  );

  const availableSelection = availableSelectionProp ?? availableSelectionInternal;
  const selectedSelection = selectedSelectionProp ?? selectedSelectionInternal;

  const setAvailableSelection = useCallback(
    (ids: string[]) => {
      if (availableSelectionProp === undefined) setAvailableSelectionInternal(ids);
      onAvailableSelectionChange?.(ids);
    },
    [availableSelectionProp, onAvailableSelectionChange],
  );

  const setSelectedSelection = useCallback(
    (ids: string[]) => {
      if (selectedSelectionProp === undefined) setSelectedSelectionInternal(ids);
      onSelectedSelectionChange?.(ids);
    },
    [selectedSelectionProp, onSelectedSelectionChange],
  );

  const emitItemsChange = useCallback(
    (available: DualListBoxItem[], selected: DualListBoxItem[]) => {
      setAvailableItems(available);
      setSelectedItems(selected);
      onItemsChange?.({ available, selected });
    },
    [onItemsChange],
  );

  const transferStates = useMemo(
    () =>
      resolveTransferStates(
        availableItems.length,
        selectedItems.length,
        availableSelection.length,
        selectedSelection.length,
      ),
    [
      availableItems.length,
      availableSelection.length,
      selectedItems.length,
      selectedSelection.length,
    ],
  );

  const runTransfer = useCallback(
    (action: DualListBoxTransferAction) => {
      if (transferStates[action] !== "default") return;

      let movedIds: string[] = [];
      let nextAvailable = [...availableItems];
      let nextSelected = [...selectedItems];

      const moveByIds = (ids: string[], from: DualListBoxItem[], to: DualListBoxItem[]) => {
        const idSet = new Set(ids);
        const moving = from.filter((item) => idSet.has(item.id));
        return {
          from: from.filter((item) => !idSet.has(item.id)),
          to: [...to, ...moving],
          moved: moving.map((m) => m.id),
        };
      };

      switch (action) {
        case "moveAllRight": {
          movedIds = nextAvailable.map((i) => i.id);
          nextSelected = [...nextSelected, ...nextAvailable];
          nextAvailable = [];
          break;
        }
        case "moveSelectedRight": {
          const result = moveByIds(availableSelection, nextAvailable, nextSelected);
          nextAvailable = result.from;
          nextSelected = result.to;
          movedIds = result.moved;
          setAvailableSelection([]);
          break;
        }
        case "moveSelectedLeft": {
          const result = moveByIds(selectedSelection, nextSelected, nextAvailable);
          nextSelected = result.from;
          nextAvailable = result.to;
          movedIds = result.moved;
          setSelectedSelection([]);
          break;
        }
        case "moveAllLeft": {
          movedIds = nextSelected.map((i) => i.id);
          nextAvailable = [...nextAvailable, ...nextSelected];
          nextSelected = [];
          break;
        }
        default:
          break;
      }

      emitItemsChange(nextAvailable, nextSelected);
      onTransfer?.({ action, movedIds });
    },
    [
      availableItems,
      availableSelection,
      emitItemsChange,
      onTransfer,
      selectedItems,
      selectedSelection,
      setAvailableSelection,
      setSelectedSelection,
      transferStates,
    ],
  );

  const applyDragDrop = useCallback(
    (session: DragSession, targetPane: DualListBoxPane, targetItemId: string | null, position: "before" | "after") => {
      const item =
        (session.sourcePane === "available" ? availableItems : selectedItems).find(
          (entry) => entry.id === session.itemId,
        ) ?? null;
      if (!item) return;

      let nextAvailable = [...availableItems];
      let nextSelected = [...selectedItems];

      const resolveInsertIndex = (list: DualListBoxItem[]): number => {
        if (!targetItemId) return list.length;
        const targetIndex = list.findIndex((entry) => entry.id === targetItemId);
        if (targetIndex < 0) return list.length;
        return position === "after" ? targetIndex + 1 : targetIndex;
      };

      if (session.sourcePane === targetPane) {
        const list = targetPane === "available" ? nextAvailable : nextSelected;
        const fromIndex = list.findIndex((entry) => entry.id === session.itemId);
        if (fromIndex < 0) return;
        let insertIndex = resolveInsertIndex(list);
        const reordered = [...list];
        const [moved] = reordered.splice(fromIndex, 1);
        if (fromIndex < insertIndex) insertIndex -= 1;
        reordered.splice(insertIndex, 0, moved);
        if (targetPane === "available") nextAvailable = reordered;
        else nextSelected = reordered;
      } else {
        if (session.sourcePane === "available") {
          nextAvailable = removeById(nextAvailable, session.itemId);
        } else {
          nextSelected = removeById(nextSelected, session.itemId);
        }
        const listRef = targetPane === "available" ? nextAvailable : nextSelected;
        const insertIndex = resolveInsertIndex(listRef);
        if (targetPane === "available") {
          nextAvailable = insertAt(nextAvailable, insertIndex, item);
        } else {
          nextSelected = insertAt(nextSelected, insertIndex, item);
        }
        if (session.sourcePane === "available") {
          setAvailableSelection(availableSelection.filter((id) => id !== session.itemId));
        } else {
          setSelectedSelection(selectedSelection.filter((id) => id !== session.itemId));
        }
      }

      const toIndex =
        targetPane === "available"
          ? nextAvailable.findIndex((entry) => entry.id === session.itemId)
          : nextSelected.findIndex((entry) => entry.id === session.itemId);

      emitItemsChange(nextAvailable, nextSelected);
      onDragDrop?.({
        itemId: session.itemId,
        from: session.sourcePane,
        to: targetPane,
        toIndex: toIndex >= 0 ? toIndex : 0,
      });
    },
    [
      availableItems,
      availableSelection,
      emitItemsChange,
      onDragDrop,
      selectedItems,
      selectedSelection,
      setAvailableSelection,
      setSelectedSelection,
    ],
  );

  const clearDrag = useCallback(() => {
    setDragSession(null);
    setDropIndicator(null);
  }, []);

  const handleDragStart = useCallback(
    (pane: DualListBoxPane, itemId: string, hadSelection: boolean) => {
      if (!enableDragDrop) return;
      setDragSession({ itemId, sourcePane: pane, hadSelection });
    },
    [enableDragDrop],
  );

  const handleDragEnd = useCallback(() => {
    clearDrag();
  }, [clearDrag]);

  const handleDrop = useCallback(
    (pane: DualListBoxPane, targetItemId: string | null, position: "before" | "after") => {
      if (!dragSession) return;
      applyDragDrop(dragSession, pane, targetItemId, position);
      clearDrag();
    },
    [applyDragDrop, clearDrag, dragSession],
  );

  const toggleAvailable = (id: string) => {
    const next = availableSelection.includes(id)
      ? availableSelection.filter((x) => x !== id)
      : [...availableSelection, id];
    setAvailableSelection(next);
  };

  const toggleSelected = (id: string) => {
    const next = selectedSelection.includes(id)
      ? selectedSelection.filter((x) => x !== id)
      : [...selectedSelection, id];
    setSelectedSelection(next);
  };

  const focusItem = useCallback((pane: DualListBoxPane, id: string) => {
    const key = itemFocusKey(pane, id);
    setFocusedItemKey(key);
    requestAnimationFrame(() => {
      document.getElementById(`dlb-item-${pane}-${id}`)?.focus();
    });
  }, []);

  const handleListKeyDown = useCallback(
    (
      event: KeyboardEvent,
      pane: DualListBoxPane,
      items: DualListBoxItem[],
    ) => {
      if (!items.length) return;

      const currentIndex = items.findIndex(
        (item) => focusedItemKey === itemFocusKey(pane, item.id),
      );
      const index = currentIndex >= 0 ? currentIndex : 0;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          focusItem(pane, items[Math.min(index + 1, items.length - 1)].id);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          focusItem(pane, items[Math.max(index - 1, 0)].id);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusItem(pane, items[0].id);
          break;
        }
        case "End": {
          event.preventDefault();
          focusItem(pane, items[items.length - 1].id);
          break;
        }
        case "Escape": {
          event.preventDefault();
          if (pane === "available") setAvailableSelection([]);
          else setSelectedSelection([]);
          break;
        }
        default:
          break;
      }
    },
    [focusItem, focusedItemKey, setAvailableSelection, setSelectedSelection],
  );

  const paneDragProps = {
    enableDragDrop,
    dragSession,
    dropIndicator,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop,
    onDropIndicatorChange: setDropIndicator,
  };

  return (
    <div className={styles.root} role="group" aria-label={ariaLabel}>
      <div className={styles.listsParent}>
        <ListPane
          side="available"
          title={availableTitle}
          items={availableItems}
          selection={availableSelection}
          onToggle={toggleAvailable}
          showMetrics={showMetrics}
          metricsFormat={metricsFormat}
          totalCount={availableItems.length}
          selectedCount={availableSelection.length}
          placeholder={availablePlaceholder}
          empty={availableItems.length === 0}
          listboxLabel={availableTitle}
          focusedItemKey={focusedItemKey}
          onListKeyDown={handleListKeyDown}
          onFocusItem={focusItem}
          {...paneDragProps}
        />

        <div
          className={styles.transferColumn}
          role="toolbar"
          aria-label="Transfer actions"
        >
          {TRANSFER_BUTTONS.map(({ action, icon }) => {
            const isDefault = transferStates[action] === "default";
            const label = transferLabels[action];
            return (
              <button
                key={action}
                type="button"
                className={[
                  styles.transferBtn,
                  isDefault ? styles.transferBtnDefault : styles.transferBtnDisabled,
                ].join(" ")}
                disabled={!isDefault}
                title={label}
                aria-label={label}
                aria-disabled={!isDefault}
                onClick={() => runTransfer(action)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    runTransfer(action);
                  }
                }}
              >
                <Icon
                  shapeName={icon}
                  style={{ width: 16, height: 16 }}
                  color={
                    isDefault ? "var(--color-icon-white)" : "var(--color-icon-disabled)"
                  }
                />
              </button>
            );
          })}
        </div>

        <ListPane
          side="selected"
          title={selectedTitle}
          items={selectedItems}
          selection={selectedSelection}
          onToggle={toggleSelected}
          showMetrics={showMetrics}
          metricsFormat={metricsFormat}
          totalCount={selectedItems.length}
          selectedCount={selectedSelection.length}
          placeholder={selectedPlaceholder}
          empty={selectedItems.length === 0}
          listboxLabel={selectedTitle}
          focusedItemKey={focusedItemKey}
          onListKeyDown={handleListKeyDown}
          onFocusItem={focusItem}
          {...paneDragProps}
        />
      </div>
    </div>
  );
}

type ListPaneProps = {
  side: DualListBoxPane;
  title: string;
  items: DualListBoxItem[];
  selection: string[];
  onToggle: (id: string) => void;
  showMetrics: boolean;
  metricsFormat: "total" | "total-and-selected";
  totalCount: number;
  selectedCount: number;
  placeholder: string;
  empty: boolean;
  listboxLabel: string;
  enableDragDrop: boolean;
  dragSession: DragSession | null;
  dropIndicator: DropIndicator | null;
  onDragStart: (pane: DualListBoxPane, itemId: string, hadSelection: boolean) => void;
  onDragEnd: () => void;
  onDrop: (pane: DualListBoxPane, targetItemId: string | null, position: "before" | "after") => void;
  onDropIndicatorChange: (indicator: DropIndicator | null) => void;
  itemTooltipSide: "top" | "bottom" | "left" | "right";
  itemTooltipArrowAlign: "start" | "center" | "end";
  focusedItemKey: string | null;
  onListKeyDown: (
    event: KeyboardEvent,
    pane: DualListBoxPane,
    items: DualListBoxItem[],
  ) => void;
  onFocusItem: (pane: DualListBoxPane, id: string) => void;
};

function ListPane({
  side,
  title,
  items,
  selection,
  onToggle,
  showMetrics,
  metricsFormat,
  totalCount,
  selectedCount,
  placeholder,
  empty,
  listboxLabel,
  enableDragDrop,
  dragSession,
  dropIndicator,
  onDragStart,
  onDragEnd,
  onDrop,
  onDropIndicatorChange,
  itemTooltipSide,
  itemTooltipArrowAlign,
  focusedItemKey,
  onListKeyDown,
  onFocusItem,
}: ListPaneProps) {
  const headerClass =
    side === "available" ? styles.paneHeaderAvailable : styles.paneHeaderSelected;
  const listClass =
    side === "available" ? styles.listGroupAvailable : styles.listGroupSelected;

  const isDragOverPane =
    enableDragDrop &&
    dragSession !== null &&
    (empty || dropIndicator?.pane === side);

  const handlePaneDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop || !dragSession) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handlePaneDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!enableDragDrop || !dragSession) return;
    if (dropIndicator?.pane === side && dropIndicator.targetItemId) {
      onDrop(side, dropIndicator.targetItemId, dropIndicator.position);
      return;
    }
    onDrop(side, null, "after");
  };

  return (
    <>
      <div className={[styles.paneHeader, headerClass].join(" ")}>
        <h3 className={styles.paneTitle}>{title}</h3>
        {showMetrics ? (
          <p className={styles.paneMetrics} aria-live="polite">
            {metricsFormat === "total-and-selected" && selectedCount > 0 ? (
              <>
                <span className={styles.metricsSelected}>Selected: {selectedCount}</span>
                <span className={styles.metricsDivider} aria-hidden>
                  {" "}
                  |{" "}
                </span>
              </>
            ) : null}
            <span className={styles.metricsTotal}>
              Total: <span className={styles.metricsTotalValue}>{totalCount}</span>
            </span>
          </p>
        ) : null}
      </div>

      <div
        className={[
          styles.listGroup,
          listClass,
          empty ? styles.listGroupEmpty : "",
          isDragOverPane ? styles.listGroupDragOver : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="listbox"
        aria-label={listboxLabel}
        aria-multiselectable
        onDragOver={handlePaneDragOver}
        onDrop={handlePaneDrop}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return;
          if (dropIndicator?.pane === side) onDropIndicatorChange(null);
        }}
      >
        {empty ? (
          <p className={styles.emptyStatus} role="status" aria-live="polite">
            {placeholder}
          </p>
        ) : (
          <div
            className={styles.listScroll}
            tabIndex={0}
            onKeyDown={(event) => onListKeyDown(event, side, items)}
            onFocus={(event) => {
              if (event.target !== event.currentTarget || !items[0]) return;
              const hasPaneFocus = focusedItemKey?.startsWith(`${side}:`);
              if (!hasPaneFocus) onFocusItem(side, items[0].id);
            }}
          >
            {items.map((item) => (
              <DualListBoxListItem
                key={item.id}
                item={item}
                pane={side}
                isSelected={selection.includes(item.id)}
                isFocused={focusedItemKey === itemFocusKey(side, item.id)}
                enableDragDrop={enableDragDrop}
                dragSession={dragSession}
                dropIndicator={dropIndicator}
                onToggle={() => onToggle(item.id)}
                onFocus={() => onFocusItem(side, item.id)}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDrop={onDrop}
                onDropIndicatorChange={onDropIndicatorChange}
                itemTooltipSide={itemTooltipSide}
                itemTooltipArrowAlign={itemTooltipArrowAlign}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

type DualListBoxListItemProps = {
  item: DualListBoxItem;
  pane: DualListBoxPane;
  isSelected: boolean;
  isFocused: boolean;
  enableDragDrop: boolean;
  dragSession: DragSession | null;
  dropIndicator: DropIndicator | null;
  onToggle: () => void;
  onFocus: () => void;
  onDragStart: (pane: DualListBoxPane, itemId: string, hadSelection: boolean) => void;
  onDragEnd: () => void;
  onDrop: (pane: DualListBoxPane, targetItemId: string | null, position: "before" | "after") => void;
  onDropIndicatorChange: (indicator: DropIndicator | null) => void;
  itemTooltipSide: "top" | "bottom" | "left" | "right";
  itemTooltipArrowAlign: "start" | "center" | "end";
};

function DualListBoxListItem({
  item,
  pane,
  isSelected,
  isFocused,
  enableDragDrop,
  dragSession,
  dropIndicator,
  onToggle,
  onFocus,
  onDragStart,
  onDragEnd,
  onDrop,
  onDropIndicatorChange,
  itemTooltipSide,
  itemTooltipArrowAlign,
}: DualListBoxListItemProps) {
  const isDragging = dragSession?.itemId === item.id;
  const dropOnThis =
    dropIndicator?.pane === pane && dropIndicator.targetItemId === item.id;
  const dropPosition = dropOnThis ? dropIndicator.position : null;

  const showCheck = isSelected && !isDragging;
  const dragVisual =
    isDragging && dragSession
      ? dragSession.hadSelection
        ? "dragWithSelection"
        : "dragWithoutSelection"
      : null;

  const rowClass = [
    styles.listItem,
    isFocused ? styles.listItemFocused : "",
    isSelected && !isDragging ? styles.listItemSelected : "",
    dragVisual === "dragWithSelection" ? styles.listItemDragWithSelection : "",
    dragVisual === "dragWithoutSelection" ? styles.listItemDragWithoutSelection : "",
    isDragging ? styles.listItemDragging : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  const handleDragStart = (event: DragEvent<HTMLSpanElement>) => {
    if (!enableDragDrop) return;
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      DRAG_DATA_TYPE,
      JSON.stringify({ id: item.id, pane }),
    );
    onDragStart(pane, item.id, isSelected);
  };

  const resolveDropPosition = (event: DragEvent<HTMLDivElement>): "before" | "after" => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!enableDragDrop || !dragSession) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    onDropIndicatorChange({
      pane,
      targetItemId: item.id,
      position: resolveDropPosition(event),
    });
  };

  const handleDropOnRow = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onDrop(pane, item.id, resolveDropPosition(event));
  };

  const row = (
    <>
      {dropPosition === "before" ? (
        <div className={styles.dropPreview} aria-hidden>
          <span className={styles.dropPreviewInner} />
        </div>
      ) : null}
      <div
        id={`dlb-item-${pane}-${item.id}`}
        role="option"
        aria-selected={isSelected}
        aria-grabbed={isDragging}
        tabIndex={isFocused ? 0 : -1}
        className={rowClass}
        onClick={onToggle}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDropOnRow}
      >
        <div className={styles.itemMain}>
          <span
            className={styles.dragHandle}
            draggable={enableDragDrop}
            aria-label={`Drag ${item.name}`}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Icon
              shapeName={DRAG_HANDLE_ICON}
              style={{ width: 16, height: 16 }}
              color={
                isSelected || isDragging
                  ? "var(--color-icon-brand-base)"
                  : "var(--color-icon-neutral)"
              }
            />
          </span>
          <span className={styles.itemContent}>
            <span className={styles.itemName}>{item.name}</span>
            {item.description ? (
              <span className={styles.itemDescription}>{item.description}</span>
            ) : null}
          </span>
        </div>
        {showCheck ? (
          <span className={styles.itemCheck} aria-hidden>
            <Icon
              shapeName={SELECTION_CHECK_ICON}
              style={{ width: 16, height: 16 }}
              color="var(--color-icon-brand-base)"
            />
          </span>
        ) : null}
      </div>
      {dropPosition === "after" ? (
        <div className={styles.dropPreview} aria-hidden>
          <span className={styles.dropPreviewInner} />
        </div>
      ) : null}
    </>
  );

  return wrapDualListBoxItemWithIdsTooltip(
    item,
    <div className={styles.listItemWrap}>{row}</div>,
    { side: itemTooltipSide, arrowAlign: itemTooltipArrowAlign },
  );
}
