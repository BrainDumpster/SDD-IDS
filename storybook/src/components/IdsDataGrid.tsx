import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { IdsDetailPanel } from "./IdsDetailPanel";
import { IdsPagination } from "./IdsPagination";
import { IdsDataGridSelectionCheckbox } from "./IdsDataGridSelectionCheckbox";
import styles from "./IdsDataGrid.module.css";

export type IdsDataGridView = "table" | "treeview";
type SortDirection = "asc" | "desc" | null;
type FilterToggleIconState = "default" | "hover" | "selected" | "press";

export interface IdsDataGridColumn {
  key: string;
  title: string;
  minWidth?: number;
  /**
   * Fixed column width (px) for header and body via `<colgroup>`.
   * Takes precedence over `defaultWidth`. Last data column may still absorb extra viewport width.
   */
  width?: number;
  /** Fallback base width (px) when `width` is omitted. Also seeds resize state when `columnResizeEnabled`. */
  defaultWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  /** When true and the menu is closed, show “filter applied” icon (solid + brand); from app filter model. */
  filterActive?: boolean;
  /** Content inside the L-shaped filter shell; omit for chrome-only filters (no search row by default). */
  filterPanel?: ReactNode;
}

export interface IdsDataGridFilterSearchFieldProps {
  placeholder?: string;
  "aria-label": string;
}

/** Optional search row for `column.filterPanel` — not required for every filter type. */
export function IdsDataGridFilterSearchField({
  placeholder = "Search",
  "aria-label": ariaLabel,
}: IdsDataGridFilterSearchFieldProps) {
  return (
    <div className={styles.filterPopupSearchRow}>
      <Icon shapeName="search-16" className={styles.filterPopupSearchIcon} />
      <input
        type="search"
        className={styles.filterPopupSearchInput}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  );
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
  /** When true, row hover uses `surface-1` (Figma "Hover on read only table"); otherwise brand-lighter. */
  readOnly?: boolean;
  /** When true, selected rows show the 4px leading `brand-base` bar (Figma `verticalBlueLine`). */
  rowVerticalIndicator?: boolean;
  /** Figma `colorAndBorder` on column header `37721:114663`: gray band + top/bottom borders vs component fill only. */
  headerColorAndBorder?: boolean;
  /** Data columns: trailing-edge drag resize + `<col>` widths (Storybook Default). */
  columnResizeEnabled?: boolean;
}

const DEFAULT_MIN_WIDTH = 90;
const DEFAULT_COLUMN_WIDTH = 160;
const SELECTION_COL_WIDTH = 48;
const SETTINGS_COL_WIDTH = 40;

function columnBaseWidthPx(column: IdsDataGridColumn): number {
  const floor = Math.max(DEFAULT_MIN_WIDTH, column.minWidth ?? DEFAULT_MIN_WIDTH);
  const preferred =
    typeof column.width === "number" ? column.width : (column.defaultWidth ?? DEFAULT_COLUMN_WIDTH);
  return Math.max(floor, preferred);
}

type FilterMenuPos = { top: number; right: number };

export function IdsDataGrid({
  columns,
  rows,
  viewMode = "table",
  multiselect = true,
  withDetailPanel = false,
  pageSize = 6,
  readOnly = false,
  rowVerticalIndicator = false,
  headerColorAndBorder = true,
  columnResizeEnabled = false,
}: IdsDataGridProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterMenuPos, setFilterMenuPos] = useState<FilterMenuPos | null>(null);
  const [filterHoverKey, setFilterHoverKey] = useState<string | null>(null);
  const [filterFocusKey, setFilterFocusKey] = useState<string | null>(null);
  const [filterPressKey, setFilterPressKey] = useState<string | null>(null);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [columnOrder, setColumnOrder] = useState(columns.map((column) => column.key));
  const [currentPage, setCurrentPage] = useState(1);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
    columnResizeEnabled
      ? Object.fromEntries(
          columns.map((c) => [c.key, columnBaseWidthPx(c)]),
        )
      : {},
  );

  useEffect(() => {
    const declared = columns.map((c) => c.key);
    setColumnOrder((prev) => {
      const allowed = new Set(declared);
      const next = prev.filter((k) => allowed.has(k));
      for (const k of declared) {
        if (!next.includes(k)) next.push(k);
      }
      return next;
    });
  }, [columns]);

  const tableViewportRef = useRef<HTMLDivElement | null>(null);
  const filterAnchorRefs = useRef(new Map<string, HTMLDivElement>());
  const resizeActiveRef = useRef(false);
  /** When set, grow column uses explicit px (user resize); otherwise `<col width="0">` absorbs table remainder. */
  const [growColPinnedWidthPx, setGrowColPinnedWidthPx] = useState<number | null>(null);
  const growResizeLatestWidthRef = useRef<number | null>(null);

  useEffect(() => {
    if (!columnResizeEnabled) return;
    setColumnWidths((prev) => {
      const next = { ...prev };
      for (const c of columns) {
        const base = columnBaseWidthPx(c);
        if (next[c.key] == null) next[c.key] = base;
        next[c.key] = Math.max(c.minWidth ?? DEFAULT_MIN_WIDTH, next[c.key] ?? base);
      }
      for (const k of Object.keys(next)) {
        if (!columns.some((c) => c.key === k)) delete next[k];
      }
      return next;
    });
  }, [columnResizeEnabled, columns]);

  useEffect(() => {
    if (!openFilterColumn) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenFilterColumn(null);
    };
    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const roots = document.querySelectorAll("[data-ids-datagrid-filter-menu]");
      for (const root of roots) {
        if (root.contains(target)) return;
      }
      setOpenFilterColumn(null);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [openFilterColumn]);

  /** Clear press if pointer released outside the originating control (e.g. over portaled menu). */
  useEffect(() => {
    if (!filterPressKey) return;
    const clear = () => setFilterPressKey(null);
    window.addEventListener("pointerup", clear);
    window.addEventListener("pointercancel", clear);
    return () => {
      window.removeEventListener("pointerup", clear);
      window.removeEventListener("pointercancel", clear);
    };
  }, [filterPressKey]);

  const orderedColumns = useMemo(() => {
    const columnsByKey = new Map(columns.map((column) => [column.key, column]));
    return columnOrder.map((key) => columnsByKey.get(key)).filter(Boolean) as IdsDataGridColumn[];
  }, [columnOrder, columns]);

  const openFilterColumnMeta = useMemo(
    () =>
      openFilterColumn != null
        ? orderedColumns.find((c) => c.key === openFilterColumn && c.filterable)
        : undefined,
    [openFilterColumn, orderedColumns],
  );

  useLayoutEffect(() => {
    if (!openFilterColumn) {
      setFilterMenuPos(null);
      return;
    }

    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      const anchor = filterAnchorRefs.current.get(openFilterColumn);
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      setFilterMenuPos({
        top: r.top + 5,
        right: document.documentElement.clientWidth - r.right,
      });
    };

    update();
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return;
      update();
      requestAnimationFrame(() => {
        if (cancelled) return;
        update();
      });
    });

    const onWin = () => update();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);

    const tv = tableViewportRef.current;
    tv?.addEventListener("scroll", onWin);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined" && tv) {
      ro = new ResizeObserver(() => update());
      ro.observe(tv);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
      tv?.removeEventListener("scroll", onWin);
      ro?.disconnect();
    };
  }, [openFilterColumn]);

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
  const someVisibleSelected =
    visibleRows.length > 0 && visibleRows.some((row) => selectedRows.includes(row.id));
  const selectAllIndeterminate = someVisibleSelected && !allVisibleSelected;

  const activeRow = useMemo(
    () => (activeRowId != null ? rows.find((row) => row.id === activeRowId) : undefined),
    [activeRowId, rows],
  );

  const handleRowClick = (rowId: string) => {
    if (withDetailPanel) {
      if (activeRowId === rowId && detailPanelOpen) {
        setDetailPanelOpen(false);
        setActiveRowId(null);
      } else {
        setActiveRowId(rowId);
        setDetailPanelOpen(true);
      }
      return;
    }
    setActiveRowId((current) => (current === rowId ? null : rowId));
  };

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

  const onHeaderDragStart = (event: React.DragEvent<HTMLTableCellElement>, columnKey: string) => {
    if (resizeActiveRef.current) {
      event.preventDefault();
      return;
    }
    const el = event.target as HTMLElement | null;
    if (
      el?.closest("button") &&
      (el.closest(`.${styles.iconButton}`) ||
        el.closest(`.${styles.filterToggleButton}`) ||
        el.closest(`.${styles.columnResizeHandle}`))
    ) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData("text/plain", columnKey);
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

  const resolveFilterToggleVisual = (
    column: IdsDataGridColumn,
    columnKey: string,
  ): { shape: "filter" | "filter-solid"; iconState: FilterToggleIconState } => {
    if (filterPressKey === columnKey) return { shape: "filter-solid", iconState: "press" };
    if (filterHoverKey === columnKey || filterFocusKey === columnKey) {
      return { shape: "filter-solid", iconState: "hover" };
    }
    if (column.filterActive) return { shape: "filter-solid", iconState: "selected" };
    return { shape: "filter", iconState: "default" };
  };

  const columnWidthPx = (column: IdsDataGridColumn): number => {
    const floor = Math.max(DEFAULT_MIN_WIDTH, column.minWidth ?? DEFAULT_MIN_WIDTH);
    if (columnResizeEnabled) {
      const w = columnWidths[column.key];
      if (typeof w === "number") return Math.max(floor, w);
    }
    return columnBaseWidthPx(column);
  };

  const growColumnKey =
    orderedColumns.length > 0 ? orderedColumns[orderedColumns.length - 1].key : null;

  useEffect(() => {
    setGrowColPinnedWidthPx(null);
    growResizeLatestWidthRef.current = null;
  }, [growColumnKey, orderedColumns.length]);

  const growColumn = useMemo(
    () =>
      growColumnKey != null
        ? orderedColumns.find((column) => column.key === growColumnKey)
        : undefined,
    [growColumnKey, orderedColumns],
  );

  /** All columns except the grow column (settings is always included). */
  const fixedColumnsWidthPx = useMemo(() => {
    let total = SETTINGS_COL_WIDTH;
    if (multiselect) total += SELECTION_COL_WIDTH;
    for (const col of orderedColumns) {
      if (col.key === growColumnKey) continue;
      total += columnWidthPx(col);
    }
    return total;
  }, [orderedColumns, columnWidths, columnResizeEnabled, multiselect, growColumnKey]);

  const tableMinWidthPx = useMemo(() => {
    const growFloor = growColumn
      ? Math.max(DEFAULT_MIN_WIDTH, growColumn.minWidth ?? DEFAULT_MIN_WIDTH)
      : 0;
    return fixedColumnsWidthPx + growFloor;
  }, [fixedColumnsWidthPx, growColumn]);

  const colWidthStyle = (column: IdsDataGridColumn): React.CSSProperties => {
    if (growColumnKey != null && column.key === growColumnKey) {
      if (growColPinnedWidthPx != null) {
        return { width: `${growColPinnedWidthPx}px` };
      }
      /* Sole auto column — absorbs slack; never use width:0 (stretches fixed chrome cols). */
      return { width: "auto" };
    }
    return { width: `${columnWidthPx(column)}px` };
  };

  const startColumnResize = (columnKey: string, event: React.PointerEvent<HTMLElement>) => {
    if (!columnResizeEnabled) return;
    event.preventDefault();
    event.stopPropagation();
    const col = columns.find((c) => c.key === columnKey);
    const min = Math.max(DEFAULT_MIN_WIDTH, col?.minWidth ?? DEFAULT_MIN_WIDTH);
    const startW = columnWidths[columnKey] ?? min;
    const startX = event.clientX;
    resizeActiveRef.current = true;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const next = Math.min(640, Math.max(min, startW + delta));
      if (growColumnKey != null && columnKey === growColumnKey) {
        growResizeLatestWidthRef.current = next;
      }
      setColumnWidths((prev) => ({ ...prev, [columnKey]: next }));
    };
    const onUp = (ev: PointerEvent) => {
      resizeActiveRef.current = false;
      if (growColumnKey != null && columnKey === growColumnKey) {
        const pinned = growResizeLatestWidthRef.current;
        if (typeof pinned === "number") {
          setGrowColPinnedWidthPx(pinned);
        }
      }
      try {
        target.releasePointerCapture(ev.pointerId);
      } catch {
        /* released */
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div
      className={styles.shell}
      data-with-detail-panel={withDetailPanel ? "true" : undefined}
    >
      <div className={styles.topBar}>
        <span className={styles.modeLabel}>View: {viewMode}</span>
      </div>
      <div className={styles.contentRow}>
        <div className={styles.gridWrap}>
          <div className={styles.tableViewport} ref={tableViewportRef}>
            <table
              className={styles.grid}
              data-header-styled={headerColorAndBorder ? "true" : "false"}
              style={{ width: "100%", minWidth: tableMinWidthPx }}
            >
              <colgroup>
                {multiselect ? (
                  <col
                    className={styles.colSelection}
                    style={{ width: `${SELECTION_COL_WIDTH}px` }}
                  />
                ) : null}
                {orderedColumns.map((column) => (
                  <col
                    key={column.key}
                    className={
                      growColumnKey != null && column.key === growColumnKey
                        ? styles.tableGrowCol
                        : undefined
                    }
                    style={colWidthStyle(column)}
                  />
                ))}
                <col
                  className={styles.colSettings}
                  style={{ width: `${SETTINGS_COL_WIDTH}px` }}
                />
              </colgroup>
              <thead>
                <tr>
                  {multiselect ? (
                    <th
                      className={`${styles.headerCell} ${styles.selectionColumn} ${styles.headerSelectionColumn}`}
                      scope="col"
                    >
                      <div className={styles.selectionHeaderContent}>
                        <IdsDataGridSelectionCheckbox
                          id="ids-datagrid-select-all"
                          label="Select all rows"
                          checked={allVisibleSelected}
                          indeterminate={selectAllIndeterminate}
                          onChange={() => toggleSelectAllVisible()}
                        />
                      </div>
                    </th>
                  ) : null}
                  {orderedColumns.map((column) => {
                    const isSorted = sortKey === column.key;
                    const filterToggleVis = resolveFilterToggleVisual(column, column.key);
                    return (
                      <th
                        key={column.key}
                        className={`${styles.headerCell} ${styles.headerDataCell}`}
                        scope="col"
                        draggable
                        onDragStart={(event) => onHeaderDragStart(event, column.key)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => onHeaderDrop(event, column.key)}
                      >
                        <div className={styles.headerCellRow}>
                          <div className={styles.headerTitleRow}>
                            <button
                              type="button"
                              className={styles.titleButton}
                              onClick={() => (column.sortable ? toggleSort(column.key) : undefined)}
                            >
                              <span className={styles.headerTitle} title={column.title}>
                                {column.title}
                              </span>
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
                                  className={`${styles.sortIcon} ${isSorted ? styles.sortIconSelected : ""}`}
                                  style={{ width: 12, height: 12 }}
                                />
                              </button>
                            ) : null}
                          </div>
                          {column.filterable ? (
                            <div
                              ref={(el) => {
                                if (el) filterAnchorRefs.current.set(column.key, el);
                                else filterAnchorRefs.current.delete(column.key);
                              }}
                              className={styles.filterAnchor}
                            >
                              {openFilterColumn !== column.key ? (
                                <button
                                  type="button"
                                  className={styles.filterToggleButton}
                                  aria-label={`Filter ${column.title}`}
                                  aria-expanded={openFilterColumn === column.key}
                                  aria-haspopup="dialog"
                                  data-filter-active={column.filterActive ? "true" : undefined}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setFilterHoverKey(null);
                                    setFilterPressKey(null);
                                    setOpenFilterColumn(column.key);
                                  }}
                                  onPointerEnter={() => setFilterHoverKey(column.key)}
                                  onPointerLeave={() => {
                                    setFilterHoverKey((current) => (current === column.key ? null : current));
                                  }}
                                  onPointerDown={() => setFilterPressKey(column.key)}
                                  onFocus={() => setFilterFocusKey(column.key)}
                                  onBlur={() => setFilterFocusKey((k) => (k === column.key ? null : k))}
                                >
                                  <Icon
                                    shapeName={filterToggleVis.shape}
                                    className={`${styles.filterIcon} ${styles[`filter-${filterToggleVis.iconState}`]}`}
                                    style={{ width: 14, height: 14 }}
                                  />
                                </button>
                              ) : (
                                <div className={styles.filterAnchorOpenSpacer} aria-hidden />
                              )}
                            </div>
                          ) : null}
                        </div>
                        <span className={styles.columnHeaderDivider} aria-hidden="true" />
                        {columnResizeEnabled ? (
                          <button
                            type="button"
                            className={styles.columnResizeHandle}
                            aria-label={`Resize ${column.title} column`}
                            onPointerDown={(e) => startColumnResize(column.key, e)}
                            draggable={false}
                          />
                        ) : null}
                      </th>
                    );
                  })}
                  <th
                    className={`${styles.headerCell} ${styles.settingsColumn}`}
                    scope="col"
                  >
                    <div className={styles.settingsHeaderInner}>
                      <Icon shapeName="settings-gear" className={styles.settingsIcon} style={{ width: 16, height: 16 }} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => {
                  const isRowSelected =
                    selectedRows.includes(row.id) ||
                    (withDetailPanel && detailPanelOpen && activeRowId === row.id);
                  return (
                  <tr
                    key={row.id}
                    className={styles.bodyRow}
                    data-selected={isRowSelected ? "true" : undefined}
                    data-readonly={readOnly ? "true" : undefined}
                    data-vertical-indicator={rowVerticalIndicator ? "true" : undefined}
                    onClick={() => handleRowClick(row.id)}
                  >
                    {multiselect ? (
                      <td
                        className={`${styles.bodyCell} ${styles.selectionColumn} ${styles.rowSelectionCell}`}
                      >
                        <div className={styles.selectionRowContent}>
                          <IdsDataGridSelectionCheckbox
                            id={`ids-datagrid-row-${row.id}`}
                            label={`Select row ${row.id}`}
                            checked={selectedRows.includes(row.id)}
                            onChange={() => toggleRowSelection(row.id)}
                            onClick={(event) => event.stopPropagation()}
                          />
                        </div>
                      </td>
                    ) : null}
                    {orderedColumns.map((column) => {
                      return (
                      <td
                        key={column.key}
                        className={styles.bodyCell}
                      >
                        <span className={styles.cellText}>{row.values[column.key]}</span>
                      </td>
                      );
                    })}
                    <td className={`${styles.bodyCell} ${styles.settingsColumn}`} />
                  </tr>
                  );
                })}
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
            isExpanded={detailPanelOpen}
            onExpandedChange={(next) => {
              setDetailPanelOpen(next);
              if (!next) setActiveRowId(null);
            }}
            title={activeRow ? String(activeRow.values.name ?? "Details") : "Details"}
            body={
              activeRow ? (
                <div className={styles.detailBody}>
                  {orderedColumns.map((column) => (
                    <p key={column.key}>
                      <b>{column.title}:</b> {String(activeRow.values[column.key] ?? "")}
                    </p>
                  ))}
                </div>
              ) : (
                <div className={styles.detailBody}>Select a row to view details.</div>
              )
            }
          />
        ) : null}
      </div>
      {typeof document !== "undefined" &&
      openFilterColumnMeta &&
      createPortal(
        <div
          className={styles.filterMenuLayer}
          data-ids-datagrid-filter-menu
          style={{
            position: "fixed",
            top: filterMenuPos?.top ?? 0,
            right: filterMenuPos?.right ?? 0,
            visibility: filterMenuPos ? "visible" : "hidden",
            pointerEvents: filterMenuPos ? "auto" : "none",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.filterPopupIconTab}
            aria-label={`Filter ${openFilterColumnMeta.title}`}
            aria-expanded
            aria-haspopup="dialog"
            onClick={(event) => {
              event.stopPropagation();
              setOpenFilterColumn(null);
            }}
          >
            <Icon
              shapeName="filter"
              className={`${styles.filterIcon} ${styles["filter-default"]}`}
              style={{ width: 14, height: 14 }}
            />
          </button>
          <div
            className={styles.filterPopupPanel}
            role="dialog"
            aria-label={`${openFilterColumnMeta.title} filter`}
          >
            <div className={styles.filterPopupPanelBody}>{openFilterColumnMeta.filterPanel}</div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
