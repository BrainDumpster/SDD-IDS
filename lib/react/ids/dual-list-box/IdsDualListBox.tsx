/**
 * IDS Dual List Box — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/dual-list-box`
 * Source: `components/ids/dual-list-box/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — DualListBoxRoot):
 *   IdsDualListBox
 *     IdsDualListBoxListsParent
 *       IdsDualListBoxAvailablePane            display:contents
 *         IdsDualListBoxAvailablePaneHeader
 *           title + IdsDualListBoxAvailableMetrics?
 *         IdsDualListBoxAvailableListGroup
 *           IdsDualListBoxListItem[] | empty placeholder
 *             IdsDualListBoxDragHandle
 *             IdsDualListBoxItemContent
 *             IdsDualListBoxSelectionCheck?
 *       IdsDualListBoxTransferButtonGroup
 *         IdsDualListBoxMoveAllRight
 *         IdsDualListBoxMoveSelectedRight
 *         IdsDualListBoxMoveSelectedLeft
 *         IdsDualListBoxMoveAllLeft
 *       IdsDualListBoxSelectedPane             display:contents
 *         IdsDualListBoxSelectedPaneHeader
 *           title + IdsDualListBoxSelectedMetrics?
 *         IdsDualListBoxSelectedListGroup
 *           IdsDualListBoxListItem[] | empty placeholder
 *
 * Prop-driven `availableItems` / `selectedItems` emit this tree.
 * Compound `children` may replace the default tree when they include ListsParent.
 * No @base-ui-components dependency.
 */

import React, {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import {
  Tooltip,
  TooltipBody,
  TooltipHeader,
  TooltipPanel,
  TooltipTrigger,
  type TooltipArrowAlign,
  type TooltipSide,
} from "../tooltip";
import styles from "./IdsDualListBox.module.css";

const DRAG_HANDLE_ICON = "arrow-arrange";
const SELECTION_CHECK_ICON = "shape-check-thick";
const DRAG_DATA_TYPE = "application/x-ids-dual-list-item";

const DEFAULT_AVAILABLE_TITLE = "Available Items";
const DEFAULT_SELECTED_TITLE = "Selected Items";
const DEFAULT_AVAILABLE_PLACEHOLDER = "Select items on the right to move";
const DEFAULT_SELECTED_PLACEHOLDER = "Select items on the left to move";

const s = {
  root: styles["ids-dual-list-box"],
  listsParent: styles["ids-dual-list-box-lists-parent"],
  availablePane: styles["ids-dual-list-box-available-pane"],
  selectedPane: styles["ids-dual-list-box-selected-pane"],
  paneHeader: styles["ids-dual-list-box-pane-header"],
  paneHeaderAvailable: styles["ids-dual-list-box-pane-header--available"],
  paneHeaderSelected: styles["ids-dual-list-box-pane-header--selected"],
  paneTitle: styles["ids-dual-list-box-pane-title"],
  metrics: styles["ids-dual-list-box-metrics"],
  metricsTotal: styles["ids-dual-list-box-metrics-total"],
  metricsTotalValue: styles["ids-dual-list-box-metrics-total-value"],
  metricsSelected: styles["ids-dual-list-box-metrics-selected"],
  metricsDivider: styles["ids-dual-list-box-metrics-divider"],
  listGroup: styles["ids-dual-list-box-list-group"],
  listGroupAvailable: styles["ids-dual-list-box-list-group--available"],
  listGroupSelected: styles["ids-dual-list-box-list-group--selected"],
  listGroupEmpty: styles["ids-dual-list-box-list-group--empty"],
  listGroupDragOver: styles["ids-dual-list-box-list-group--drag-over"],
  listScroll: styles["ids-dual-list-box-list-scroll"],
  emptyPlaceholder: styles["ids-dual-list-box-empty-placeholder"],
  listItemWrap: styles["ids-dual-list-box-list-item-wrap"],
  listItem: styles["ids-dual-list-box-list-item"],
  listItemFocused: styles["ids-dual-list-box-list-item--focused"],
  listItemSelected: styles["ids-dual-list-box-list-item--selected"],
  listItemDragWithSelection: styles["ids-dual-list-box-list-item--drag-with-selection"],
  listItemDragWithoutSelection: styles["ids-dual-list-box-list-item--drag-without-selection"],
  listItemDragging: styles["ids-dual-list-box-list-item--dragging"],
  dragHandle: styles["ids-dual-list-box-drag-handle"],
  itemContent: styles["ids-dual-list-box-item-content"],
  itemName: styles["ids-dual-list-box-item-name"],
  itemDescription: styles["ids-dual-list-box-item-description"],
  selectionCheck: styles["ids-dual-list-box-selection-check"],
  dropPreview: styles["ids-dual-list-box-drop-preview"],
  dropPreviewInner: styles["ids-dual-list-box-drop-preview-inner"],
  transferGroup: styles["ids-dual-list-box-transfer-group"],
  transferBtn: styles["ids-dual-list-box-transfer-btn"],
  transferBtnDefault: styles["ids-dual-list-box-transfer-btn--default"],
  transferBtnDisabled: styles["ids-dual-list-box-transfer-btn--disabled"],
};

/* -------------------------------------------------------------------------- */
/* Types (Composition & API)                                                  */
/* -------------------------------------------------------------------------- */

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

export interface IdsDualListBoxProps {
  availableItems: DualListBoxItem[];
  selectedItems: DualListBoxItem[];
  /** Pane title (Angular: `availableOptionsLabel`). Default `Available Items`. */
  availableTitle?: string;
  /** Pane title (Angular: `selectedOptionsLabel`). Default `Selected Items`. */
  selectedTitle?: string;
  availablePlaceholder?: string;
  selectedPlaceholder?: string;
  /** Angular: `moveRightButtonHoverTitle`. Default `Move right`. */
  moveSelectedRightTitle?: string;
  /** Angular: `moveLeftButtonHoverTitle`. Default `Move left`. */
  moveSelectedLeftTitle?: string;
  /** Angular: `addAllButtonHoverTitle`. Default `Add all from {availableTitle}`. */
  moveAllRightTitle?: string;
  /** Angular: `removeAllButtonHoverTitle`. Default `Remove all from {selectedTitle}`. */
  moveAllLeftTitle?: string;
  availableSelection?: string[];
  selectedSelection?: string[];
  defaultAvailableSelection?: string[];
  defaultSelectedSelection?: string[];
  showMetrics?: boolean;
  metricsFormat?: DualListBoxMetricsFormat | string;
  enableDragDrop?: boolean;
  onAvailableSelectionChange?: (ids: string[]) => void;
  onSelectedSelectionChange?: (ids: string[]) => void;
  onItemsChange?: (detail: DualListBoxItemsChangeDetail) => void;
  onTransfer?: (detail: DualListBoxTransferDetail) => void;
  onDragDrop?: (detail: DualListBoxDragDropDetail) => void;
  itemTooltipSide?: TooltipSide;
  itemTooltipArrowAlign?: TooltipArrowAlign;
  ariaLabel?: string;
  className?: string;
  /**
   * Optional compound anatomy. When a `ListsParent` slot is present, it replaces
   * the default DualListBoxRoot → ListsParent → AvailablePane / Transfer / SelectedPane tree.
   */
  children?: ReactNode;
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

/* -------------------------------------------------------------------------- */
/* Slot markers                                                               */
/* -------------------------------------------------------------------------- */

const SLOT = Symbol.for("ids.dual-list-box.slot");

export type IdsDualListBoxSlotName =
  | "lists-parent"
  | "available-pane"
  | "available-pane-header"
  | "available-metrics"
  | "available-list-group"
  | "transfer-button-group"
  | "move-all-right"
  | "move-selected-right"
  | "move-selected-left"
  | "move-all-left"
  | "selected-pane"
  | "selected-pane-header"
  | "selected-metrics"
  | "selected-list-group"
  | "list-item"
  | "drag-handle"
  | "item-content"
  | "selection-check";

function getSlot(type: unknown): IdsDualListBoxSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [SLOT]?: IdsDualListBoxSlotName })[SLOT];
}

function markSlot<T>(fn: T, name: IdsDualListBoxSlotName): T {
  (fn as { [SLOT]?: IdsDualListBoxSlotName })[SLOT] = name;
  return fn;
}

function hasListsParentSlot(children: ReactNode): boolean {
  let found = false;
  Children.forEach(children, (child) => {
    if (isValidElement(child) && getSlot(child.type) === "lists-parent") {
      found = true;
    }
  });
  return found;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function itemFocusKey(pane: DualListBoxPane, id: string): string {
  return `${pane}:${id}`;
}

function resolveMetricsFormat(value: unknown): DualListBoxMetricsFormat {
  return value === "total-and-selected" ? "total-and-selected" : "total";
}

function itemAccessibleName(item: DualListBoxItem): string {
  const name = item.name?.trim();
  return name || item.id;
}

function assertUniqueIds(available: DualListBoxItem[], selected: DualListBoxItem[]): void {
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

function insertAt<T>(list: T[], index: number, item: T): T[] {
  const next = [...list];
  next.splice(index, 0, item);
  return next;
}

function removeById(list: DualListBoxItem[], id: string): DualListBoxItem[] {
  return list.filter((item) => item.id !== id);
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsDualListBoxContextValue {
  reactId: string;
  availableTitle: string;
  selectedTitle: string;
  availablePlaceholder: string;
  selectedPlaceholder: string;
  showMetrics: boolean;
  metricsFormat: DualListBoxMetricsFormat;
  availableItems: DualListBoxItem[];
  selectedItems: DualListBoxItem[];
  availableSelection: string[];
  selectedSelection: string[];
  transferStates: Record<DualListBoxTransferAction, TransferVisualState>;
  transferLabels: Record<DualListBoxTransferAction, string>;
  enableDragDrop: boolean;
  dragSession: DragSession | null;
  dropIndicator: DropIndicator | null;
  focusedItemKey: string | null;
  itemTooltipSide: TooltipSide;
  itemTooltipArrowAlign: TooltipArrowAlign;
  runTransfer: (action: DualListBoxTransferAction) => void;
  toggleItem: (pane: DualListBoxPane, id: string) => void;
  focusItem: (pane: DualListBoxPane, id: string) => void;
  handleListKeyDown: (
    event: KeyboardEvent,
    pane: DualListBoxPane,
    items: DualListBoxItem[],
  ) => void;
  handleDragStart: (pane: DualListBoxPane, itemId: string, hadSelection: boolean) => void;
  handleDragEnd: () => void;
  handleDrop: (
    pane: DualListBoxPane,
    targetItemId: string | null,
    position: "before" | "after",
  ) => void;
  setDropIndicator: (indicator: DropIndicator | null) => void;
}

const IdsDualListBoxContext = createContext<IdsDualListBoxContextValue | null>(null);

function useDualListBox(slot: string): IdsDualListBoxContextValue {
  const ctx = useContext(IdsDualListBoxContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within IdsDualListBox.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Tooltip wrap (IDS Tooltip anatomy)                                         */
/* -------------------------------------------------------------------------- */

function wrapListItemWithTooltip(
  item: DualListBoxItem,
  row: ReactNode,
  side: TooltipSide,
  arrowAlign: TooltipArrowAlign,
): ReactNode {
  const title = item.tooltipTitle?.trim();
  const description = item.tooltipDescription?.trim();
  if (!title && !description) return row;

  return (
    <Tooltip side={side} arrowAlign={arrowAlign} closable={false}>
      <TooltipTrigger display="block">{row}</TooltipTrigger>
      <TooltipPanel>
        {title && description ? <TooltipHeader>{title}</TooltipHeader> : null}
        <TooltipBody>{description || title}</TooltipBody>
      </TooltipPanel>
    </Tooltip>
  );
}

/* -------------------------------------------------------------------------- */
/* Anatomy slots — ListsParent / panes / headers / metrics                    */
/* -------------------------------------------------------------------------- */

export interface IdsDualListBoxListsParentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxListsParent({
  children,
  className,
  ...rest
}: IdsDualListBoxListsParentProps) {
  useDualListBox("IdsDualListBoxListsParent");
  return (
    <div
      {...rest}
      className={cx(s.listsParent, className)}
      data-ids="ids-dual-list-box-lists-parent"
      data-slot="ListsParent"
    >
      {children ?? <DefaultListsParentChildren />}
    </div>
  );
}
markSlot(IdsDualListBoxListsParent, "lists-parent");
IdsDualListBoxListsParent.displayName = "IdsDualListBoxListsParent";

export interface IdsDualListBoxAvailablePaneProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxAvailablePane({
  children,
  className,
  ...rest
}: IdsDualListBoxAvailablePaneProps) {
  useDualListBox("IdsDualListBoxAvailablePane");
  return (
    <div
      {...rest}
      className={cx(s.availablePane, className)}
      data-ids="ids-dual-list-box-available-pane"
      data-slot="AvailablePane"
    >
      {children ?? (
        <>
          <IdsDualListBoxAvailablePaneHeader />
          <IdsDualListBoxAvailableListGroup />
        </>
      )}
    </div>
  );
}
markSlot(IdsDualListBoxAvailablePane, "available-pane");
IdsDualListBoxAvailablePane.displayName = "IdsDualListBoxAvailablePane";

export interface IdsDualListBoxSelectedPaneProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxSelectedPane({
  children,
  className,
  ...rest
}: IdsDualListBoxSelectedPaneProps) {
  useDualListBox("IdsDualListBoxSelectedPane");
  return (
    <div
      {...rest}
      className={cx(s.selectedPane, className)}
      data-ids="ids-dual-list-box-selected-pane"
      data-slot="SelectedPane"
    >
      {children ?? (
        <>
          <IdsDualListBoxSelectedPaneHeader />
          <IdsDualListBoxSelectedListGroup />
        </>
      )}
    </div>
  );
}
markSlot(IdsDualListBoxSelectedPane, "selected-pane");
IdsDualListBoxSelectedPane.displayName = "IdsDualListBoxSelectedPane";

function PaneHeader({
  side,
  title,
  metrics,
  className,
  children,
  ...rest
}: {
  side: DualListBoxPane;
  title: string;
  metrics: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cx(
        s.paneHeader,
        side === "available" ? s.paneHeaderAvailable : s.paneHeaderSelected,
        className,
      )}
      data-ids={
        side === "available"
          ? "ids-dual-list-box-available-pane-header"
          : "ids-dual-list-box-selected-pane-header"
      }
      data-slot={side === "available" ? "AvailablePaneHeader" : "SelectedPaneHeader"}
    >
      {children ?? (
        <>
          <h3 className={s.paneTitle}>{title}</h3>
          {metrics}
        </>
      )}
    </div>
  );
}

export interface IdsDualListBoxAvailablePaneHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxAvailablePaneHeader({
  children,
  className,
  ...rest
}: IdsDualListBoxAvailablePaneHeaderProps) {
  const ctx = useDualListBox("IdsDualListBoxAvailablePaneHeader");
  return (
    <PaneHeader
      {...rest}
      side="available"
      title={ctx.availableTitle}
      className={className}
      metrics={ctx.showMetrics ? <IdsDualListBoxAvailableMetrics /> : null}
    >
      {children}
    </PaneHeader>
  );
}
markSlot(IdsDualListBoxAvailablePaneHeader, "available-pane-header");
IdsDualListBoxAvailablePaneHeader.displayName = "IdsDualListBoxAvailablePaneHeader";

export interface IdsDualListBoxSelectedPaneHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxSelectedPaneHeader({
  children,
  className,
  ...rest
}: IdsDualListBoxSelectedPaneHeaderProps) {
  const ctx = useDualListBox("IdsDualListBoxSelectedPaneHeader");
  return (
    <PaneHeader
      {...rest}
      side="selected"
      title={ctx.selectedTitle}
      className={className}
      metrics={ctx.showMetrics ? <IdsDualListBoxSelectedMetrics /> : null}
    >
      {children}
    </PaneHeader>
  );
}
markSlot(IdsDualListBoxSelectedPaneHeader, "selected-pane-header");
IdsDualListBoxSelectedPaneHeader.displayName = "IdsDualListBoxSelectedPaneHeader";

function MetricsBlock({
  slot,
  dataIds,
  totalCount,
  selectedCount,
  metricsFormat,
  className,
  ...rest
}: {
  slot: "AvailableMetrics" | "SelectedMetrics";
  dataIds: string;
  totalCount: number;
  selectedCount: number;
  metricsFormat: DualListBoxMetricsFormat;
} & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...rest}
      className={cx(s.metrics, className)}
      data-ids={dataIds}
      data-slot={slot}
      aria-live="polite"
    >
      {metricsFormat === "total-and-selected" && selectedCount > 0 ? (
        <>
          <span className={s.metricsSelected}>Selected: {selectedCount}</span>
          <span className={s.metricsDivider} aria-hidden>
            {" "}
            |{" "}
          </span>
        </>
      ) : null}
      <span className={s.metricsTotal}>
        Total: <span className={s.metricsTotalValue}>{totalCount}</span>
      </span>
    </p>
  );
}

export interface IdsDualListBoxAvailableMetricsProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export function IdsDualListBoxAvailableMetrics({
  className,
  ...rest
}: IdsDualListBoxAvailableMetricsProps) {
  const ctx = useDualListBox("IdsDualListBoxAvailableMetrics");
  return (
    <MetricsBlock
      {...rest}
      slot="AvailableMetrics"
      dataIds="ids-dual-list-box-available-metrics"
      totalCount={ctx.availableItems.length}
      selectedCount={ctx.availableSelection.length}
      metricsFormat={ctx.metricsFormat}
      className={className}
    />
  );
}
markSlot(IdsDualListBoxAvailableMetrics, "available-metrics");
IdsDualListBoxAvailableMetrics.displayName = "IdsDualListBoxAvailableMetrics";

export interface IdsDualListBoxSelectedMetricsProps
  extends HTMLAttributes<HTMLParagraphElement> {}

export function IdsDualListBoxSelectedMetrics({
  className,
  ...rest
}: IdsDualListBoxSelectedMetricsProps) {
  const ctx = useDualListBox("IdsDualListBoxSelectedMetrics");
  return (
    <MetricsBlock
      {...rest}
      slot="SelectedMetrics"
      dataIds="ids-dual-list-box-selected-metrics"
      totalCount={ctx.selectedItems.length}
      selectedCount={ctx.selectedSelection.length}
      metricsFormat={ctx.metricsFormat}
      className={className}
    />
  );
}
markSlot(IdsDualListBoxSelectedMetrics, "selected-metrics");
IdsDualListBoxSelectedMetrics.displayName = "IdsDualListBoxSelectedMetrics";

/* -------------------------------------------------------------------------- */
/* Anatomy slots — list groups                                                */
/* -------------------------------------------------------------------------- */

function ListGroup({
  pane,
  className,
  children,
  ...rest
}: {
  pane: DualListBoxPane;
} & HTMLAttributes<HTMLDivElement>) {
  const ctx = useDualListBox(
    pane === "available" ? "IdsDualListBoxAvailableListGroup" : "IdsDualListBoxSelectedListGroup",
  );
  const items = pane === "available" ? ctx.availableItems : ctx.selectedItems;
  const empty = items.length === 0;
  const placeholder =
    pane === "available" ? ctx.availablePlaceholder : ctx.selectedPlaceholder;
  const listboxLabel = pane === "available" ? ctx.availableTitle : ctx.selectedTitle;
  const isDragOverPane =
    ctx.enableDragDrop &&
    ctx.dragSession !== null &&
    (empty || ctx.dropIndicator?.pane === pane);

  const handlePaneDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!ctx.enableDragDrop || !ctx.dragSession) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handlePaneDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!ctx.enableDragDrop || !ctx.dragSession) return;
    if (ctx.dropIndicator?.pane === pane && ctx.dropIndicator.targetItemId) {
      ctx.handleDrop(pane, ctx.dropIndicator.targetItemId, ctx.dropIndicator.position);
      return;
    }
    ctx.handleDrop(pane, null, "after");
  };

  return (
    <div
      {...rest}
      className={cx(
        s.listGroup,
        pane === "available" ? s.listGroupAvailable : s.listGroupSelected,
        empty && s.listGroupEmpty,
        isDragOverPane && s.listGroupDragOver,
        className,
      )}
      role="listbox"
      aria-label={listboxLabel}
      aria-multiselectable
      data-ids={
        pane === "available"
          ? "ids-dual-list-box-available-list-group"
          : "ids-dual-list-box-selected-list-group"
      }
      data-slot={pane === "available" ? "AvailableListGroup" : "SelectedListGroup"}
      onDragOver={handlePaneDragOver}
      onDrop={handlePaneDrop}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return;
        if (ctx.dropIndicator?.pane === pane) ctx.setDropIndicator(null);
      }}
    >
      {children ??
        (empty ? (
          <p className={s.emptyPlaceholder} role="status" aria-live="polite">
            {placeholder}
          </p>
        ) : (
          <div
            className={s.listScroll}
            tabIndex={0}
            onKeyDown={(event) => ctx.handleListKeyDown(event, pane, items)}
            onFocus={(event) => {
              if (event.target !== event.currentTarget || !items[0]) return;
              const hasPaneFocus = ctx.focusedItemKey?.startsWith(`${pane}:`);
              if (!hasPaneFocus) ctx.focusItem(pane, items[0].id);
            }}
          >
            {items.map((item) => (
              <IdsDualListBoxListItem key={item.id} item={item} pane={pane} />
            ))}
          </div>
        ))}
    </div>
  );
}

export interface IdsDualListBoxAvailableListGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxAvailableListGroup(props: IdsDualListBoxAvailableListGroupProps) {
  return <ListGroup pane="available" {...props} />;
}
markSlot(IdsDualListBoxAvailableListGroup, "available-list-group");
IdsDualListBoxAvailableListGroup.displayName = "IdsDualListBoxAvailableListGroup";

export interface IdsDualListBoxSelectedListGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxSelectedListGroup(props: IdsDualListBoxSelectedListGroupProps) {
  return <ListGroup pane="selected" {...props} />;
}
markSlot(IdsDualListBoxSelectedListGroup, "selected-list-group");
IdsDualListBoxSelectedListGroup.displayName = "IdsDualListBoxSelectedListGroup";

/* -------------------------------------------------------------------------- */
/* Anatomy slots — ListItem / DragHandle / ItemContent / SelectionCheck       */
/* -------------------------------------------------------------------------- */

export interface IdsDualListBoxDragHandleProps extends HTMLAttributes<HTMLSpanElement> {
  item: DualListBoxItem;
  pane: DualListBoxPane;
  isSelected?: boolean;
  isDragging?: boolean;
}

export function IdsDualListBoxDragHandle({
  item,
  pane,
  isSelected = false,
  isDragging = false,
  className,
  ...rest
}: IdsDualListBoxDragHandleProps) {
  const ctx = useDualListBox("IdsDualListBoxDragHandle");
  const name = itemAccessibleName(item);

  const handleDragStart = (event: DragEvent<HTMLSpanElement>) => {
    if (!ctx.enableDragDrop) return;
    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(DRAG_DATA_TYPE, JSON.stringify({ id: item.id, pane }));
    ctx.handleDragStart(pane, item.id, isSelected);
  };

  return (
    <span
      {...rest}
      className={cx(s.dragHandle, className)}
      data-ids="ids-dual-list-box-drag-handle"
      data-slot="DragHandle"
      draggable={ctx.enableDragDrop}
      aria-label={`Drag ${name}`}
      onDragStart={handleDragStart}
      onDragEnd={ctx.handleDragEnd}
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <IdsIcon
        shape={DRAG_HANDLE_ICON}
        size={16}
        color={
          isSelected || isDragging
            ? "var(--color-icon-brand-base)"
            : "var(--color-icon-gray-neutral-base)"
        }
      />
    </span>
  );
}
markSlot(IdsDualListBoxDragHandle, "drag-handle");
IdsDualListBoxDragHandle.displayName = "IdsDualListBoxDragHandle";

export interface IdsDualListBoxItemContentProps extends HTMLAttributes<HTMLSpanElement> {
  item: DualListBoxItem;
}

export function IdsDualListBoxItemContent({
  item,
  className,
  children,
  ...rest
}: IdsDualListBoxItemContentProps) {
  const name = itemAccessibleName(item);
  return (
    <span
      {...rest}
      className={cx(s.itemContent, className)}
      data-ids="ids-dual-list-box-item-content"
      data-slot="ItemContent"
    >
      {children ?? (
        <>
          <span className={s.itemName}>{name}</span>
          {item.description ? (
            <span className={s.itemDescription}>{item.description}</span>
          ) : null}
        </>
      )}
    </span>
  );
}
markSlot(IdsDualListBoxItemContent, "item-content");
IdsDualListBoxItemContent.displayName = "IdsDualListBoxItemContent";

export interface IdsDualListBoxSelectionCheckProps extends HTMLAttributes<HTMLSpanElement> {}

export function IdsDualListBoxSelectionCheck({
  className,
  ...rest
}: IdsDualListBoxSelectionCheckProps) {
  return (
    <span
      {...rest}
      className={cx(s.selectionCheck, className)}
      data-ids="ids-dual-list-box-selection-check"
      data-slot="SelectionCheck"
      aria-hidden
    >
      <IdsIcon shape={SELECTION_CHECK_ICON} size={16} color="var(--color-icon-brand-base)" />
    </span>
  );
}
markSlot(IdsDualListBoxSelectionCheck, "selection-check");
IdsDualListBoxSelectionCheck.displayName = "IdsDualListBoxSelectionCheck";

export interface IdsDualListBoxListItemProps {
  item: DualListBoxItem;
  pane: DualListBoxPane;
  children?: ReactNode;
  className?: string;
}

export function IdsDualListBoxListItem({
  item,
  pane,
  children,
  className,
}: IdsDualListBoxListItemProps) {
  const ctx = useDualListBox("IdsDualListBoxListItem");
  const selection = pane === "available" ? ctx.availableSelection : ctx.selectedSelection;
  const isSelected = selection.includes(item.id);
  const isFocused = ctx.focusedItemKey === itemFocusKey(pane, item.id);
  const isDragging = ctx.dragSession?.itemId === item.id;
  const dropOnThis =
    ctx.dropIndicator?.pane === pane && ctx.dropIndicator.targetItemId === item.id;
  const dropPosition = dropOnThis ? ctx.dropIndicator?.position ?? null : null;
  const showCheck = isSelected && !isDragging;
  const dragVisual =
    isDragging && ctx.dragSession
      ? ctx.dragSession.hadSelection
        ? "dragWithSelection"
        : "dragWithoutSelection"
      : null;

  const resolveDropPosition = (event: DragEvent<HTMLDivElement>): "before" | "after" => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientY < rect.top + rect.height / 2 ? "before" : "after";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!ctx.enableDragDrop || !ctx.dragSession) return;
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    ctx.setDropIndicator({
      pane,
      targetItemId: item.id,
      position: resolveDropPosition(event),
    });
  };

  const handleDropOnRow = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    ctx.handleDrop(pane, item.id, resolveDropPosition(event));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      ctx.toggleItem(pane, item.id);
    }
  };

  const row = (
    <>
      {dropPosition === "before" ? (
        <div className={s.dropPreview} aria-hidden>
          <span className={s.dropPreviewInner} />
        </div>
      ) : null}
      <div
        id={`${ctx.reactId}-item-${pane}-${item.id}`}
        role="option"
        aria-selected={isSelected}
        aria-grabbed={isDragging}
        tabIndex={isFocused ? 0 : -1}
        className={cx(
          s.listItem,
          isFocused && s.listItemFocused,
          isSelected && !isDragging && s.listItemSelected,
          dragVisual === "dragWithSelection" && s.listItemDragWithSelection,
          dragVisual === "dragWithoutSelection" && s.listItemDragWithoutSelection,
          isDragging && s.listItemDragging,
          className,
        )}
        data-ids="ids-dual-list-box-list-item"
        data-slot="ListItem"
        onClick={() => ctx.toggleItem(pane, item.id)}
        onFocus={() => ctx.focusItem(pane, item.id)}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDrop={handleDropOnRow}
      >
        {children ?? (
          <>
            <IdsDualListBoxDragHandle
              item={item}
              pane={pane}
              isSelected={isSelected}
              isDragging={isDragging}
            />
            <IdsDualListBoxItemContent item={item} />
            {showCheck ? <IdsDualListBoxSelectionCheck /> : null}
          </>
        )}
      </div>
      {dropPosition === "after" ? (
        <div className={s.dropPreview} aria-hidden>
          <span className={s.dropPreviewInner} />
        </div>
      ) : null}
    </>
  );

  return wrapListItemWithTooltip(
    item,
    <div className={s.listItemWrap}>{row}</div>,
    ctx.itemTooltipSide,
    ctx.itemTooltipArrowAlign,
  );
}
markSlot(IdsDualListBoxListItem, "list-item");
IdsDualListBoxListItem.displayName = "IdsDualListBoxListItem";

/* -------------------------------------------------------------------------- */
/* Anatomy slots — TransferButtonGroup                                        */
/* -------------------------------------------------------------------------- */

const TRANSFER_BUTTONS: {
  action: DualListBoxTransferAction;
  icon: string;
  slot: Extract<
    IdsDualListBoxSlotName,
    "move-all-right" | "move-selected-right" | "move-selected-left" | "move-all-left"
  >;
  anatomy: "MoveAllRight" | "MoveSelectedRight" | "MoveSelectedLeft" | "MoveAllLeft";
}[] = [
  { action: "moveAllRight", icon: "double-chev-right", slot: "move-all-right", anatomy: "MoveAllRight" },
  {
    action: "moveSelectedRight",
    icon: "chev-right",
    slot: "move-selected-right",
    anatomy: "MoveSelectedRight",
  },
  {
    action: "moveSelectedLeft",
    icon: "chev-left",
    slot: "move-selected-left",
    anatomy: "MoveSelectedLeft",
  },
  { action: "moveAllLeft", icon: "double-chev-left", slot: "move-all-left", anatomy: "MoveAllLeft" },
];

function TransferButton({
  action,
  icon,
  anatomy,
  className,
  ...rest
}: {
  action: DualListBoxTransferAction;
  icon: string;
  anatomy: string;
} & HTMLAttributes<HTMLButtonElement>) {
  const ctx = useDualListBox(`IdsDualListBox${anatomy}`);
  const isDefault = ctx.transferStates[action] === "default";
  const label = ctx.transferLabels[action];

  return (
    <button
      {...rest}
      type="button"
      className={cx(
        s.transferBtn,
        isDefault ? s.transferBtnDefault : s.transferBtnDisabled,
        className,
      )}
      disabled={!isDefault}
      title={label}
      aria-label={label}
      aria-disabled={!isDefault}
      data-ids={`ids-dual-list-box-${anatomy.replace(/([A-Z])/g, "-$1").toLowerCase().replace(/^-/, "")}`}
      data-slot={anatomy}
      onClick={() => ctx.runTransfer(action)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          ctx.runTransfer(action);
        }
      }}
    >
      <IdsIcon
        shape={icon}
        size={16}
        color={isDefault ? "var(--color-icon-gray-white)" : "var(--color-icon-gray-disabled)"}
      />
    </button>
  );
}

export interface IdsDualListBoxTransferButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDualListBoxTransferButtonGroup({
  children,
  className,
  ...rest
}: IdsDualListBoxTransferButtonGroupProps) {
  useDualListBox("IdsDualListBoxTransferButtonGroup");
  return (
    <div
      {...rest}
      className={cx(s.transferGroup, className)}
      role="toolbar"
      aria-label="Transfer actions"
      data-ids="ids-dual-list-box-transfer-button-group"
      data-slot="TransferButtonGroup"
    >
      {children ?? (
        <>
          <IdsDualListBoxMoveAllRight />
          <IdsDualListBoxMoveSelectedRight />
          <IdsDualListBoxMoveSelectedLeft />
          <IdsDualListBoxMoveAllLeft />
        </>
      )}
    </div>
  );
}
markSlot(IdsDualListBoxTransferButtonGroup, "transfer-button-group");
IdsDualListBoxTransferButtonGroup.displayName = "IdsDualListBoxTransferButtonGroup";

export type IdsDualListBoxMoveButtonProps = HTMLAttributes<HTMLButtonElement>;

export function IdsDualListBoxMoveAllRight(props: IdsDualListBoxMoveButtonProps) {
  const meta = TRANSFER_BUTTONS[0]!;
  return <TransferButton action={meta.action} icon={meta.icon} anatomy={meta.anatomy} {...props} />;
}
markSlot(IdsDualListBoxMoveAllRight, "move-all-right");
IdsDualListBoxMoveAllRight.displayName = "IdsDualListBoxMoveAllRight";

export function IdsDualListBoxMoveSelectedRight(props: IdsDualListBoxMoveButtonProps) {
  const meta = TRANSFER_BUTTONS[1]!;
  return <TransferButton action={meta.action} icon={meta.icon} anatomy={meta.anatomy} {...props} />;
}
markSlot(IdsDualListBoxMoveSelectedRight, "move-selected-right");
IdsDualListBoxMoveSelectedRight.displayName = "IdsDualListBoxMoveSelectedRight";

export function IdsDualListBoxMoveSelectedLeft(props: IdsDualListBoxMoveButtonProps) {
  const meta = TRANSFER_BUTTONS[2]!;
  return <TransferButton action={meta.action} icon={meta.icon} anatomy={meta.anatomy} {...props} />;
}
markSlot(IdsDualListBoxMoveSelectedLeft, "move-selected-left");
IdsDualListBoxMoveSelectedLeft.displayName = "IdsDualListBoxMoveSelectedLeft";

export function IdsDualListBoxMoveAllLeft(props: IdsDualListBoxMoveButtonProps) {
  const meta = TRANSFER_BUTTONS[3]!;
  return <TransferButton action={meta.action} icon={meta.icon} anatomy={meta.anatomy} {...props} />;
}
markSlot(IdsDualListBoxMoveAllLeft, "move-all-left");
IdsDualListBoxMoveAllLeft.displayName = "IdsDualListBoxMoveAllLeft";

/* -------------------------------------------------------------------------- */
/* Default deterministic tree                                                 */
/* -------------------------------------------------------------------------- */

function DefaultListsParentChildren(): ReactElement {
  return (
    <>
      <IdsDualListBoxAvailablePane />
      <IdsDualListBoxTransferButtonGroup />
      <IdsDualListBoxSelectedPane />
    </>
  );
}

function DefaultDualListBoxAnatomy(): ReactElement {
  return (
    <IdsDualListBoxListsParent>
      <DefaultListsParentChildren />
    </IdsDualListBoxListsParent>
  );
}

/* -------------------------------------------------------------------------- */
/* Root — DualListBoxRoot                                                     */
/* -------------------------------------------------------------------------- */

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
  metricsFormat: metricsFormatProp,
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
  className,
  children,
}: IdsDualListBoxProps) {
  assertUniqueIds(availableItemsProp, selectedItemsProp);

  const reactId = useId();
  const metricsFormat = resolveMetricsFormat(metricsFormatProp);
  const compound = hasListsParentSlot(children);

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

  useEffect(() => {
    setAvailableItems(availableItemsProp);
  }, [availableItemsProp]);

  useEffect(() => {
    setSelectedItems(selectedItemsProp);
  }, [selectedItemsProp]);

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
        const moving = from.filter((entry) => idSet.has(entry.id));
        return {
          from: from.filter((entry) => !idSet.has(entry.id)),
          to: [...to, ...moving],
          moved: moving.map((entry) => entry.id),
        };
      };

      switch (action) {
        case "moveAllRight": {
          movedIds = nextAvailable.map((entry) => entry.id);
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
          movedIds = nextSelected.map((entry) => entry.id);
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
    (
      session: DragSession,
      targetPane: DualListBoxPane,
      targetItemId: string | null,
      position: "before" | "after",
    ) => {
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

  const toggleItem = useCallback(
    (pane: DualListBoxPane, id: string) => {
      if (pane === "available") {
        const next = availableSelection.includes(id)
          ? availableSelection.filter((entry) => entry !== id)
          : [...availableSelection, id];
        setAvailableSelection(next);
        return;
      }
      const next = selectedSelection.includes(id)
        ? selectedSelection.filter((entry) => entry !== id)
        : [...selectedSelection, id];
      setSelectedSelection(next);
    },
    [availableSelection, selectedSelection, setAvailableSelection, setSelectedSelection],
  );

  const focusItem = useCallback(
    (pane: DualListBoxPane, id: string) => {
      const key = itemFocusKey(pane, id);
      setFocusedItemKey(key);
      requestAnimationFrame(() => {
        document.getElementById(`${reactId}-item-${pane}-${id}`)?.focus();
      });
    },
    [reactId],
  );

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent, pane: DualListBoxPane, items: DualListBoxItem[]) => {
      if (!items.length) return;

      const currentIndex = items.findIndex(
        (entry) => focusedItemKey === itemFocusKey(pane, entry.id),
      );
      const index = currentIndex >= 0 ? currentIndex : 0;

      switch (event.key) {
        case "ArrowDown": {
          event.preventDefault();
          focusItem(pane, items[Math.min(index + 1, items.length - 1)]!.id);
          break;
        }
        case "ArrowUp": {
          event.preventDefault();
          focusItem(pane, items[Math.max(index - 1, 0)]!.id);
          break;
        }
        case "Home": {
          event.preventDefault();
          focusItem(pane, items[0]!.id);
          break;
        }
        case "End": {
          event.preventDefault();
          focusItem(pane, items[items.length - 1]!.id);
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

  const runtime = useMemo<IdsDualListBoxContextValue>(
    () => ({
      reactId,
      availableTitle,
      selectedTitle,
      availablePlaceholder,
      selectedPlaceholder,
      showMetrics,
      metricsFormat,
      availableItems,
      selectedItems,
      availableSelection,
      selectedSelection,
      transferStates,
      transferLabels,
      enableDragDrop,
      dragSession,
      dropIndicator,
      focusedItemKey,
      itemTooltipSide,
      itemTooltipArrowAlign,
      runTransfer,
      toggleItem,
      focusItem,
      handleListKeyDown,
      handleDragStart,
      handleDragEnd,
      handleDrop,
      setDropIndicator,
    }),
    [
      availableItems,
      availablePlaceholder,
      availableSelection,
      availableTitle,
      dragSession,
      dropIndicator,
      enableDragDrop,
      focusItem,
      focusedItemKey,
      handleDragEnd,
      handleDragStart,
      handleDrop,
      handleListKeyDown,
      itemTooltipArrowAlign,
      itemTooltipSide,
      metricsFormat,
      reactId,
      runTransfer,
      selectedItems,
      selectedPlaceholder,
      selectedSelection,
      selectedTitle,
      showMetrics,
      toggleItem,
      transferLabels,
      transferStates,
    ],
  );

  return (
    <IdsDualListBoxContext.Provider value={runtime}>
      <div
        className={cx(s.root, className)}
        role="group"
        aria-label={ariaLabel}
        data-ids="ids-dual-list-box"
        data-slot="DualListBoxRoot"
      >
        {compound ? children : <DefaultDualListBoxAnatomy />}
      </div>
    </IdsDualListBoxContext.Provider>
  );
}

/** Compound namespace matching spec Anatomy. */
export const IdsDualListBoxCompound = Object.assign(IdsDualListBox, {
  ListsParent: IdsDualListBoxListsParent,
  AvailablePane: IdsDualListBoxAvailablePane,
  AvailablePaneHeader: IdsDualListBoxAvailablePaneHeader,
  AvailableMetrics: IdsDualListBoxAvailableMetrics,
  AvailableListGroup: IdsDualListBoxAvailableListGroup,
  TransferButtonGroup: IdsDualListBoxTransferButtonGroup,
  MoveAllRight: IdsDualListBoxMoveAllRight,
  MoveSelectedRight: IdsDualListBoxMoveSelectedRight,
  MoveSelectedLeft: IdsDualListBoxMoveSelectedLeft,
  MoveAllLeft: IdsDualListBoxMoveAllLeft,
  SelectedPane: IdsDualListBoxSelectedPane,
  SelectedPaneHeader: IdsDualListBoxSelectedPaneHeader,
  SelectedMetrics: IdsDualListBoxSelectedMetrics,
  SelectedListGroup: IdsDualListBoxSelectedListGroup,
  ListItem: IdsDualListBoxListItem,
  DragHandle: IdsDualListBoxDragHandle,
  ItemContent: IdsDualListBoxItemContent,
  SelectionCheck: IdsDualListBoxSelectionCheck,
});

export default IdsDualListBoxCompound;
