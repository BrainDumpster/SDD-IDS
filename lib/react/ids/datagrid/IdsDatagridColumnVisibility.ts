import type { IdsDatagridColumnDef } from "./IdsDatagridSlots";

export function getIdsDatagridHideableColumns(
  columns: readonly IdsDatagridColumnDef[],
): IdsDatagridColumnDef[] {
  return columns.filter((column) => column.columnHideable);
}

export function isIdsDatagridColumnVisible(
  column: IdsDatagridColumnDef,
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  if (!column.columnHideable) return true;
  return !hiddenColumnKeys.has(column.key);
}

export function countVisibleIdsDatagridColumns(
  columns: readonly IdsDatagridColumnDef[],
  hiddenColumnKeys: ReadonlySet<string>,
): number {
  return columns.filter((column) => isIdsDatagridColumnVisible(column, hiddenColumnKeys)).length;
}

export function canHideIdsDatagridColumn(
  columnKey: string,
  columns: readonly IdsDatagridColumnDef[],
  hiddenColumnKeys: ReadonlySet<string>,
): boolean {
  const nextHidden = new Set(hiddenColumnKeys);
  nextHidden.add(columnKey);
  return countVisibleIdsDatagridColumns(columns, nextHidden) >= 1;
}

export const IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR =
  "At least one column must remain visible.";
