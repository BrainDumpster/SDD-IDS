export const DATAGRID_SELECTION_COL_WIDTH = 48;
export const DATAGRID_SETTINGS_COL_WIDTH = 40;
export const DATAGRID_DEFAULT_MIN_WIDTH = 90;
export const DATAGRID_DEFAULT_COLUMN_WIDTH = 160;
export function columnBaseWidthPx(column) {
    const floor = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
    const preferred = typeof column.width === "number" ? column.width : DATAGRID_DEFAULT_COLUMN_WIDTH;
    return Math.max(floor, preferred);
}
export function tableMinWidthPx(columns, includeSelection) {
    const data = columns.reduce((sum, col) => sum + columnBaseWidthPx(col), 0);
    const selection = includeSelection ? DATAGRID_SELECTION_COL_WIDTH : 0;
    return selection + data + DATAGRID_SETTINGS_COL_WIDTH;
}
export function nextSortDirection(currentKey, key, currentDir) {
    if (currentKey !== key)
        return "asc";
    if (currentDir === "asc")
        return "desc";
    if (currentDir === "desc")
        return null;
    return "asc";
}
export function sortRows(rows, sortKey, sortDirection) {
    if (!sortKey || !sortDirection)
        return [...rows];
    const dir = sortDirection === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
        const av = a.cells.get(sortKey) ?? "";
        const bv = b.cells.get(sortKey) ?? "";
        return av.localeCompare(bv, undefined, { numeric: true }) * dir;
    });
}
export const IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR = "At least one column must remain visible.";
export function getHideableColumns(columns) {
    return columns.filter((column) => column.columnHideable);
}
export function isColumnVisible(column, hiddenColumnKeys) {
    if (!column.columnHideable)
        return true;
    return !hiddenColumnKeys.has(column.field);
}
export function countVisibleColumns(columns, hiddenColumnKeys) {
    return columns.filter((column) => isColumnVisible(column, hiddenColumnKeys)).length;
}
export function canHideColumn(columnField, columns, hiddenColumnKeys) {
    const nextHidden = new Set(hiddenColumnKeys);
    nextHidden.add(columnField);
    return countVisibleColumns(columns, nextHidden) >= 1;
}
export function resolvedColumnWidthPx(column, columnWidths) {
    const floor = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
    const preferred = columnWidths[column.field] ?? columnBaseWidthPx(column);
    return Math.max(floor, preferred);
}
export function tableMinWidthPxForColumns(columns, includeSelection, columnWidths, growColumnField, growColPinnedWidthPx) {
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
