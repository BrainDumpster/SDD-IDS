import {
  DATAGRID_DEFAULT_COLUMN_WIDTH,
  DATAGRID_DEFAULT_MIN_WIDTH,
  DATAGRID_SELECTION_COL_WIDTH,
  DATAGRID_SETTINGS_COL_WIDTH,
  type IdsDatagridColumnModel,
  type IdsDatagridSortDirection,
} from "./datagrid.constants.js";

export type SortDirection = IdsDatagridSortDirection | null;

export function columnBaseWidthPx(column: IdsDatagridColumnModel): number {
  const floor = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
  const preferred =
    typeof column.width === "number"
      ? column.width
      : (column.defaultWidth ?? DATAGRID_DEFAULT_COLUMN_WIDTH);
  return Math.max(floor, preferred);
}

export function nextSortDirection(
  currentKey: string | null,
  key: string,
  currentDir: SortDirection,
): SortDirection {
  if (currentKey !== key) return "asc";
  if (currentDir === "asc") return "desc";
  if (currentDir === "desc") return null;
  return "asc";
}

export function sortRows<T extends { cells: Map<string, string> }>(
  rows: readonly T[],
  sortKey: string | null,
  sortDirection: SortDirection,
): T[] {
  if (!sortKey || !sortDirection) return [...rows];
  const dir = sortDirection === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a.cells.get(sortKey) ?? "";
    const bv = b.cells.get(sortKey) ?? "";
    return av.localeCompare(bv, undefined, { numeric: true }) * dir;
  });
}

export function getHideableColumns(
  columns: readonly IdsDatagridColumnModel[],
): IdsDatagridColumnModel[] {
  return columns.filter((column) => column.columnHideable);
}

export function isColumnVisible(
  column: IdsDatagridColumnModel,
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  if (!column.columnHideable) return true;
  return !hiddenColumnKeys.has(column.field);
}

export function countVisibleColumns(
  columns: readonly IdsDatagridColumnModel[],
  hiddenColumnKeys: ReadonlySet<string>,
): number {
  return columns.filter((column) => isColumnVisible(column, hiddenColumnKeys)).length;
}

export function canHideColumn(
  columnField: string,
  columns: readonly IdsDatagridColumnModel[],
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  const nextHidden = new Set(hiddenColumnKeys);
  nextHidden.add(columnField);
  return countVisibleColumns(columns, nextHidden) >= 1;
}

export function resolvedColumnWidthPx(
  column: IdsDatagridColumnModel,
  columnWidths: Readonly<Record<string, number>>,
): number {
  const floor = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
  const preferred = columnWidths[column.field] ?? columnBaseWidthPx(column);
  return Math.max(floor, preferred);
}

export function tableMinWidthPxForColumns(
  columns: readonly IdsDatagridColumnModel[],
  includeSelection: boolean,
  columnWidths: Readonly<Record<string, number>>,
  growColumnField: string | null,
  growColPinnedWidthPx: number | null,
): number {
  let data = 0;
  for (const col of columns) {
    if (growColumnField != null && col.field === growColumnField && growColPinnedWidthPx == null) {
      data += Math.max(DATAGRID_DEFAULT_MIN_WIDTH, col.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
      continue;
    }
    data += resolvedColumnWidthPx(col, columnWidths);
  }
  const selection = includeSelection ? DATAGRID_SELECTION_COL_WIDTH : 0;
  return selection + data + DATAGRID_SETTINGS_COL_WIDTH;
}

/** Walk light DOM ancestors for the grid host. */
export function findDatagridHost(el: HTMLElement): IdsDatagridHostLike | null {
  let node: HTMLElement | null = el.parentElement;
  while (node) {
    if (node.localName === "ids-datagrid") {
      return node as IdsDatagridHostLike;
    }
    node = node.parentElement;
  }
  return null;
}

export interface IdsDatagridHostLike extends HTMLElement {
  registerColumn(column: import("./datagrid.constants.js").IdsDatagridColumnModel): void;
  unregisterColumn(field: string): void;
  registerRow(row: import("./datagrid.constants.js").IdsDatagridRowModel): void;
  unregisterRow(rowId: string): void;
  setRowCell(rowId: string, field: string, value: string): void;
  requestSync(): void;
}
