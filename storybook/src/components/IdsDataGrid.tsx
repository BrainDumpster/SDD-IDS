import { useMemo, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { IdsDetailPanel } from "./IdsDetailPanel";
import { IdsPagination } from "./IdsPagination";
import styles from "./IdsDataGrid.module.css";

export type IdsDataGridView = "table" | "treeview";
type SortDirection = "asc" | "desc" | null;
type FilterVisualState = "default" | "hover" | "selected" | "press";

export interface IdsDataGridColumn {
  key: string;
  title: string;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
}

export interface IdsDataGridRow {
  id: string;
  values: Record<string, ReactNode>;
}

export interface IdsDataGridProps {
  columns: IdsDataGridColumn[];
  rows: IdsDataGridRow[];
  viewMode?: IdsDataGridView;
  multiselect?: boolean;
  withDetailPanel?: boolean;
  pageSize?: number;
}

const DEFAULT_MIN_WIDTH = 90;

export function IdsDataGrid({
  columns,
  rows,
  viewMode = "table",
  multiselect = true,
  withDetailPanel = false,
  pageSize = 6,
}: IdsDataGridProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [columnOrder, setColumnOrder] = useState(columns.map((column) => column.key));
  const [currentPage, setCurrentPage] = useState(1);

  const orderedColumns = useMemo(() => {
    const columnsByKey = new Map(columns.map((column) => [column.key, column]));
    return columnOrder.map((key) => columnsByKey.get(key)).filter(Boolean) as IdsDataGridColumn[];
  }, [columnOrder, columns]);

  const sortedRows = useMemo(() => {
    if (!sortKey || !sortDirection) return rows;
    const next = [...rows];
    next.sort((a, b) => {
      const left = String(a.values[sortKey] ?? "");
      const right = String(b.values[sortKey] ?? "");
      const result = left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? result : -result;
    });
    return next;
  }, [rows, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const visibleRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allVisibleSelected =
    visibleRows.length > 0 && visibleRows.every((row) => selectedRows.includes(row.id));

  const toggleSort = (columnKey: string) => {
    if (sortKey !== columnKey) {
      setSortKey(columnKey);
      setSortDirection("asc");
      return;
    }
    setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
  };

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedRows((current) => current.filter((id) => !visibleRows.some((row) => row.id === id)));
      return;
    }
    setSelectedRows((current) => {
      const merged = new Set(current);
      visibleRows.forEach((row) => merged.add(row.id));
      return Array.from(merged);
    });
  };

  const toggleRowSelection = (rowId: string) => {
    setSelectedRows((current) =>
      current.includes(rowId) ? current.filter((id) => id !== rowId) : [...current, rowId],
    );
  };

  const setColumnWidth = (column: IdsDataGridColumn, width: number) => {
    const minWidth = column.minWidth ?? DEFAULT_MIN_WIDTH;
    setColumnWidths((current) => ({ ...current, [column.key]: Math.max(minWidth, width) }));
  };

  const onHeaderDragStart = (event: React.DragEvent<HTMLTableCellElement>, key: string) => {
    event.dataTransfer.setData("text/plain", key);
  };

  const onHeaderDrop = (event: React.DragEvent<HTMLTableCellElement>, dropKey: string) => {
    const dragKey = event.dataTransfer.getData("text/plain");
    if (!dragKey || dragKey === dropKey) return;
    setColumnOrder((current) => {
      const remaining = current.filter((key) => key !== dragKey);
      const targetIndex = remaining.indexOf(dropKey);
      remaining.splice(targetIndex, 0, dragKey);
      return remaining;
    });
  };

  const filterStateForColumn = (key: string): FilterVisualState =>
    openFilterColumn === key ? "selected" : "default";

  return (
    <div className={styles.shell}>
      <div className={styles.topBar}>
        <span className={styles.modeLabel}>View: {viewMode}</span>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.gridWrap}>
          <div className={styles.tableViewport}>
            <table className={styles.grid}>
              <colgroup>
                {multiselect ? <col style={{ width: "48px" }} /> : null}
                {orderedColumns.map((column) => {
                  const resizedWidth = columnWidths[column.key];
                  return resizedWidth ? (
                    <col key={column.key} style={{ width: `${resizedWidth}px` }} />
                  ) : (
                    <col key={column.key} />
                  );
                })}
                <col style={{ width: "40px" }} />
              </colgroup>
              <thead>
                <tr>
                  {multiselect ? (
                    <th
                      className={`${styles.headerCell} ${styles.selectionColumn} ${styles.headerSelectionColumn}`}
                      scope="col"
                      style={{ width: 48, minWidth: 48, maxWidth: 48 }}
                    >
                      <div className={styles.selectionHeaderContent}>
                        <input
                          type="checkbox"
                          checked={allVisibleSelected}
                          aria-label="Select all rows"
                          onChange={toggleSelectAllVisible}
                        />
                      </div>
                    </th>
                  ) : null}
                  {orderedColumns.map((column) => {
                    const isSorted = sortKey === column.key;
                    const minWidth = Math.max(DEFAULT_MIN_WIDTH, column.minWidth ?? DEFAULT_MIN_WIDTH);
                    const resizedWidth = columnWidths[column.key];
                    const width = resizedWidth ?? minWidth;
                    return (
                      <th
                        key={column.key}
                        className={styles.headerCell}
                        scope="col"
                        style={
                          resizedWidth
                            ? { minWidth: resizedWidth, width: resizedWidth, maxWidth: resizedWidth }
                            : { minWidth }
                        }
                        draggable
                        onDragStart={(event) => onHeaderDragStart(event, column.key)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => onHeaderDrop(event, column.key)}
                      >
                        <div className={styles.headerInner}>
                          <button
                            type="button"
                            className={styles.titleButton}
                            onClick={() => (column.sortable ? toggleSort(column.key) : undefined)}
                          >
                            <span className={styles.headerTitle}>{column.title}</span>
                          </button>
                          {column.sortable ? (
                            <button
                              type="button"
                              className={styles.iconButton}
                              aria-label={`Sort by ${column.title}`}
                              onClick={() => toggleSort(column.key)}
                            >
                              <Icon
                                shapeName={isSorted && sortDirection === "desc" ? "col-sort-down-16" : "col-sort-up-16"}
                                className={`${styles.icon} ${styles.sortIcon} ${isSorted ? styles.sortIconSelected : ""}`}
                              />
                            </button>
                          ) : null}
                          {column.filterable ? (
                            <button
                              type="button"
                              className={styles.iconButton}
                              aria-label={`Filter ${column.title}`}
                              onMouseDown={() => setOpenFilterColumn(column.key)}
                              onMouseUp={() =>
                                setOpenFilterColumn((current) => (current === column.key ? null : column.key))
                              }
                            >
                              <Icon
                                shapeName={filterStateForColumn(column.key) === "default" ? "filter" : "filter-solid"}
                                className={`${styles.icon} ${styles.filterIcon} ${styles[`filter-${filterStateForColumn(column.key)}`]}`}
                              />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className={styles.resizeHandle}
                            aria-label={`Resize ${column.title}`}
                            onClick={() => setColumnWidth(column, width + 24)}
                          />
                        </div>
                        {openFilterColumn === column.key ? (
                          <div className={styles.filterPopup} role="dialog" aria-label={`${column.title} filter`}>
                            <div className={styles.filterPopupTopBorder} />
                            <div className={styles.filterPopupBody}>User-defined filter content</div>
                            <div className={styles.filterPopupBottomBorder} />
                          </div>
                        ) : null}
                      </th>
                    );
                  })}
                  <th className={`${styles.headerCell} ${styles.settingsColumn}`} scope="col">
                    <Icon shapeName="settings-gear" className={styles.settingsIcon} />
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className={`${styles.bodyRow} ${activeRowId === row.id ? styles.bodyRowSelected : ""}`}
                    onClick={() => setActiveRowId(row.id)}
                  >
                    {multiselect ? (
                      <td
                        className={`${styles.bodyCell} ${styles.selectionColumn} ${styles.rowSelectionCell}`}
                        style={{ width: 48, minWidth: 48, maxWidth: 48 }}
                      >
                        <div className={styles.selectionRowContent}>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row.id)}
                            aria-label={`Select row ${row.id}`}
                            onChange={() => toggleRowSelection(row.id)}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </div>
                      </td>
                    ) : null}
                    {orderedColumns.map((column) => (
                      <td key={column.key} className={styles.bodyCell}>
                        <span className={styles.cellText}>{row.values[column.key]}</span>
                      </td>
                    ))}
                    <td className={`${styles.bodyCell} ${styles.settingsColumn}`} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.footer}>
            <IdsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
        {withDetailPanel ? (
          <IdsDetailPanel
            className={styles.detailPanel}
            attachMode="datagrid"
            isExpanded={Boolean(activeRowId)}
            onExpandedChange={(next) => {
              if (!next) setActiveRowId(null);
            }}
            body={<div className={styles.detailBody}>Details for row: {activeRowId ?? "None selected"}</div>}
          />
        ) : null}
      </div>
    </div>
  );
}
