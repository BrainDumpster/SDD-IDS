/**
 * Datagrid anatomy slots — deterministic child structure (spec Anatomy + Angular composition).
 *
 * Children are **metadata / projection markers**. The grid host owns
 * L-frame, colgroup, sticky pins, and table geometry.
 *
 * Required child order (left → right / top → bottom):
 *   IdsDatagrid
 *     IdsDatagridColumn+          — data columns in visual order
 *       IdsDatagridColumnTitle?   — header title (else `title` / `field`)
 *       IdsDatagridFilter?        — FilterPanelBody only
 *         {text | numeric | date | datetime | combobox | dropdown filter}
 *     IdsDatagridBody?            — optional wrapper around rows
 *       IdsDatagridRow+
 *         IdsDatagridCell+        — keyed by `field`
 *     IdsDatagridFooter?          — DatagridPaginationSlot
 *     IdsDatagridDetailPanel?     — sibling of grid wrap, not a <col>
 */

import React, {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  isIdsDatagridDateFilterActive,
  type IdsDatagridDateFilterState,
} from "./IdsDatagridDateFilter";
import {
  isIdsDatagridDateTimeFilterActive,
  type IdsDatagridDateTimeFilterState,
} from "./IdsDatagridDateTimeFilter";
import {
  isIdsDatagridNumericFilterActive,
  type IdsDatagridNumericFilterState,
} from "./IdsDatagridNumericFilter";

export const DATAGRID_SLOT = Symbol.for("ids.datagrid.slot");

export type IdsDatagridSlotName =
  | "column"
  | "column-title"
  | "filter"
  | "body"
  | "row"
  | "cell"
  | "footer"
  | "detail-panel";

export type IdsDatagridViewMode = "table" | "treeview";
export type IdsDatagridSelectionMode = "single" | "multiple";
export type IdsDatagridSortDirection = "asc" | "desc";

/** Spec `DatagridColumn` config — collected from `IdsDatagridColumn` children or `columns` prop. */
export interface IdsDatagridColumnDef {
  key: string;
  title: string;
  minWidth?: number;
  width?: number;
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  numericFilterState?: IdsDatagridNumericFilterState;
  dateFilterState?: IdsDatagridDateFilterState;
  dateTimeFilterState?: IdsDatagridDateTimeFilterState;
  filterPanel?: ReactNode;
  columnHideable?: boolean;
}

/** Spec `DatagridRow` model — collected from `IdsDatagridRow` children or `rows` prop. */
export interface IdsDatagridRowDef {
  id: string;
  values: Record<string, ReactNode>;
}

/** @deprecated Alias of `IdsDatagridColumnDef`. */
export type IdsDatagridColumn = IdsDatagridColumnDef;
/** @deprecated Alias of `IdsDatagridRowDef`. */
export type IdsDatagridRow = IdsDatagridRowDef;

export function getDatagridSlot(type: unknown): IdsDatagridSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [DATAGRID_SLOT]?: IdsDatagridSlotName })[DATAGRID_SLOT];
}

function markSlot<T>(fn: T, name: IdsDatagridSlotName): T {
  (fn as { [DATAGRID_SLOT]?: IdsDatagridSlotName })[DATAGRID_SLOT] = name;
  return fn;
}

function asText(node: ReactNode): string {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(asText).join("");
  if (isValidElement(node) && node.props && "children" in (node.props as object)) {
    return asText((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/* -------------------------------------------------------------------------- */
/* Slot markers (do not render DOM — host projects them)                      */
/* -------------------------------------------------------------------------- */

export interface IdsDatagridColumnProps {
  /** Column key (`DatagridColumn.key`). */
  field: string;
  title?: string;
  minWidth?: number;
  width?: number;
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  filterActive?: boolean;
  columnHideable?: boolean;
  numericFilterState?: IdsDatagridNumericFilterState;
  dateFilterState?: IdsDatagridDateFilterState;
  dateTimeFilterState?: IdsDatagridDateTimeFilterState;
  children?: ReactNode;
}

/** Anatomy: `DatagridColumnHeader` — metadata + optional Filter / title children. */
export function IdsDatagridColumn(_props: IdsDatagridColumnProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridColumn, "column");
IdsDatagridColumn.displayName = "IdsDatagridColumn";

export interface IdsDatagridColumnTitleProps {
  children?: ReactNode;
}

/** Anatomy: title inside `DatagridColumnHeaderTitleRow`. */
export function IdsDatagridColumnTitle(_props: IdsDatagridColumnTitleProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridColumnTitle, "column-title");
IdsDatagridColumnTitle.displayName = "IdsDatagridColumnTitle";

export interface IdsDatagridFilterProps {
  children?: ReactNode;
}

/**
 * Anatomy: `FilterPanelBody` slot (`column.filterPanel`).
 * Outer L-frame (`FilterToggle` / `FilterIconTab` / `FilterPanel`) is grid-owned.
 */
export function IdsDatagridFilter(_props: IdsDatagridFilterProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridFilter, "filter");
IdsDatagridFilter.displayName = "IdsDatagridFilter";

export interface IdsDatagridBodyProps {
  children?: ReactNode;
}

/** Anatomy: `DatagridBody` wrapper around rows. */
export function IdsDatagridBody(_props: IdsDatagridBodyProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridBody, "body");
IdsDatagridBody.displayName = "IdsDatagridBody";

export interface IdsDatagridRowProps {
  id: string;
  children?: ReactNode;
}

/** Anatomy: `DatagridRow`. */
export function IdsDatagridRow(_props: IdsDatagridRowProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridRow, "row");
IdsDatagridRow.displayName = "IdsDatagridRow";

export interface IdsDatagridCellProps {
  field: string;
  children?: ReactNode;
}

/** Anatomy: `DatagridCell`. */
export function IdsDatagridCell(_props: IdsDatagridCellProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridCell, "cell");
IdsDatagridCell.displayName = "IdsDatagridCell";

export interface IdsDatagridFooterProps {
  children?: ReactNode;
}

/** Anatomy: `DatagridFooter` / `DatagridPaginationSlot`. */
export function IdsDatagridFooter(_props: IdsDatagridFooterProps): ReactElement | null {
  return null;
}
markSlot(IdsDatagridFooter, "footer");
IdsDatagridFooter.displayName = "IdsDatagridFooter";

export interface IdsDatagridDetailPanelSlotProps {
  children?: ReactNode;
}

/** Anatomy: `DatagridDetailPanelSlot` — sibling of the grid wrap, not a column. */
export function IdsDatagridDetailPanel(
  _props: IdsDatagridDetailPanelSlotProps,
): ReactElement | null {
  return null;
}
markSlot(IdsDatagridDetailPanel, "detail-panel");
IdsDatagridDetailPanel.displayName = "IdsDatagridDetailPanel";

/* -------------------------------------------------------------------------- */
/* Collectors                                                                 */
/* -------------------------------------------------------------------------- */

function collectColumn(el: ReactElement<IdsDatagridColumnProps>): IdsDatagridColumnDef {
  const {
    field,
    title,
    children,
    sortable,
    filterable,
    filterActive,
    minWidth,
    width,
    defaultWidth,
    columnHideable,
    numericFilterState,
    dateFilterState,
    dateTimeFilterState,
  } = el.props;

  let titleText = title;
  let filterPanel: ReactNode | undefined;
  const leftover: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) leftover.push(child);
      return;
    }
    const slot = getDatagridSlot(child.type);
    if (slot === "column-title") {
      titleText = asText((child.props as IdsDatagridColumnTitleProps).children) || titleText;
      return;
    }
    if (slot === "filter") {
      filterPanel = (child.props as IdsDatagridFilterProps).children;
      return;
    }
    leftover.push(child);
  });

  if (titleText == null && leftover.length > 0) {
    titleText = asText(leftover);
  }

  return {
    key: field,
    title: titleText || field,
    sortable,
    filterable: Boolean(filterable || filterPanel),
    filterActive,
    minWidth,
    width,
    defaultWidth,
    columnHideable,
    numericFilterState,
    dateFilterState,
    dateTimeFilterState,
    filterPanel,
  };
}

function collectRow(el: ReactElement<IdsDatagridRowProps>): IdsDatagridRowDef {
  const values: Record<string, ReactNode> = {};
  Children.forEach(el.props.children, (child) => {
    if (!isValidElement(child)) return;
    if (getDatagridSlot(child.type) !== "cell") return;
    const props = child.props as IdsDatagridCellProps;
    values[props.field] = props.children;
  });
  return { id: el.props.id, values };
}

export interface CollectedDatagridAnatomy {
  columns: IdsDatagridColumnDef[];
  rows: IdsDatagridRowDef[];
  footer: ReactNode | null;
  detailPanel: ReactNode | null;
  hasColumnSlots: boolean;
  hasRowSlots: boolean;
  hasFooterSlot: boolean;
  hasDetailSlot: boolean;
}

export function collectDatagridAnatomy(children: ReactNode): CollectedDatagridAnatomy {
  const columns: IdsDatagridColumnDef[] = [];
  const rows: IdsDatagridRowDef[] = [];
  let footer: ReactNode | null = null;
  let detailPanel: ReactNode | null = null;

  const ingestRowish = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      if (getDatagridSlot(child.type) === "row") {
        rows.push(collectRow(child as ReactElement<IdsDatagridRowProps>));
      }
    });
  };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getDatagridSlot(child.type);
    if (slot === "column") {
      columns.push(collectColumn(child as ReactElement<IdsDatagridColumnProps>));
      return;
    }
    if (slot === "body") {
      ingestRowish((child.props as IdsDatagridBodyProps).children);
      return;
    }
    if (slot === "row") {
      rows.push(collectRow(child as ReactElement<IdsDatagridRowProps>));
      return;
    }
    if (slot === "footer") {
      footer = (child.props as IdsDatagridFooterProps).children ?? null;
      return;
    }
    if (slot === "detail-panel") {
      detailPanel = (child.props as IdsDatagridDetailPanelSlotProps).children ?? null;
    }
  });

  return {
    columns,
    rows,
    footer,
    detailPanel,
    hasColumnSlots: columns.length > 0,
    hasRowSlots: rows.length > 0,
    hasFooterSlot: footer != null,
    hasDetailSlot: detailPanel != null,
  };
}

export function resolveIdsDatagridColumnFilterActive(column: IdsDatagridColumnDef): boolean {
  if (column.numericFilterState !== undefined) {
    return isIdsDatagridNumericFilterActive(column.numericFilterState);
  }
  if (column.dateFilterState !== undefined) {
    return isIdsDatagridDateFilterActive(column.dateFilterState);
  }
  if (column.dateTimeFilterState !== undefined) {
    return isIdsDatagridDateTimeFilterActive(column.dateTimeFilterState);
  }
  return Boolean(column.filterActive);
}
