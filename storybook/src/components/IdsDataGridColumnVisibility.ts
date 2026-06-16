import type { IdsDataGridColumn } from "./IdsDataGrid";

/** Columns opted in via `columnHideable` appear in the settings (gear) popup. */
export function getIdsDataGridHideableColumns(
  columns: readonly IdsDataGridColumn[],
): IdsDataGridColumn[] {
  return columns.filter((column) => column.columnHideable);
}

export function isIdsDataGridColumnVisible(
  column: IdsDataGridColumn,
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  if (!column.columnHideable) return true;
  return !hiddenColumnKeys.has(column.key);
}

export function countVisibleIdsDataGridColumns(
  columns: readonly IdsDataGridColumn[],
  hiddenColumnKeys: ReadonlySet<string>,
): number {
  return columns.filter((column) => isIdsDataGridColumnVisible(column, hiddenColumnKeys)).length;
}

/** Whether hiding `columnKey` would leave zero visible data columns. */
export function canHideIdsDataGridColumn(
  columnKey: string,
  columns: readonly IdsDataGridColumn[],
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  const nextHidden = new Set(hiddenColumnKeys);
  nextHidden.add(columnKey);
  return countVisibleIdsDataGridColumns(columns, nextHidden) >= 1;
}

export const IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR =
  "At least one column must remain visible.";
