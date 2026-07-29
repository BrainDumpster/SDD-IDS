import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { RadioGroup } from "@base-ui-components/react/radio-group";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import { IdsDetailPanel } from "./IdsDetailPanel";
import { IdsPagination } from "./IdsPagination";
import { IdsDataGridSelectionCheckbox } from "./IdsDataGridSelectionCheckbox";
import { IdsDataGridSelectionRadio } from "./IdsDataGridSelectionRadio";
import {
  isIdsDataGridDateFilterActive,
  type IdsDataGridDateFilterState,
} from "./IdsDataGridDateFilter";
import {
  isIdsDataGridDateTimeFilterActive,
  type IdsDataGridDateTimeFilterState,
} from "./IdsDataGridDateAndTimeFilter";
import {
  isIdsDataGridNumericFilterActive,
  type IdsDataGridNumericFilterState,
} from "./IdsDataGridNumericFilter";
import {
  canHideIdsDataGridColumn,
  getIdsDataGridHideableColumns,
  IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR,
  isIdsDataGridColumnVisible,
} from "./IdsDataGridColumnVisibility";
import { IdsDataGridColumnVisibilityPanel } from "./IdsDataGridColumnVisibilityPanel";
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
  /**
   * When true and the menu is closed, show “filter applied” icon (solid + brand).
   * Ignored when `numericFilterState`, `dateFilterState`, or `dateTimeFilterState` is set (grid derives active from model).
   */
  filterActive?: boolean;
  /** Numeric filter model; `operator === 'all'` → header filter not active. */
  numericFilterState?: IdsDataGridNumericFilterState;
  /** Date-only filter model; `mode === 'all'` → header filter not active. */
  dateFilterState?: IdsDataGridDateFilterState;
  /** Date-time filter model; `mode === 'all'` → header filter not active. */
  dateTimeFilterState?: IdsDataGridDateTimeFilterState;
  /** Content inside the L-shaped filter shell; omit for chrome-only filters (no search row by default). */
  filterPanel?: ReactNode;
  /**
   * When true, column appears in the settings (gear) popup and may be hidden by the user.
   * Columns without this flag are always visible and omitted from the popup.
   */
  columnHideable?: boolean;
}

/** Header filter icon “applied” state — false when numeric/date-time model is on “All”. */
export function resolveIdsDataGridColumnFilterActive(column: IdsDataGridColumn): boolean {
  if (column.numericFilterState !== undefined) {
    return isIdsDataGridNumericFilterActive(column.numericFilterState);
  }
  if (column.dateFilterState !== undefined) {
    return isIdsDataGridDateFilterActive(column.dateFilterState);
  }
  if (column.dateTimeFilterState !== undefined) {
    return isIdsDataGridDateTimeFilterActive(column.dateTimeFilterState);
  }
  return Boolean(column.filterActive);
}

export interface IdsDataGridFilterSearchFieldProps {
  placeholder?: string;
  "aria-label": string;
  /** Controlled query. When omitted, the field manages its own value. */
  value?: string;
  /** Fired on type and when the clear (close) control resets the field. */
  onChange?: (value: string) => void;
}

/**
 * Column Search filter field — same search/clear behavior as DropdownMenu /
 * Combobox-Multiselect search (Figma `37822:91077`).
 * Clear (`ctrl-close-16`) shows only when the query is non-empty.
 */
export function IdsDataGridFilterSearchField({
  placeholder = "Search",
  "aria-label": ariaLabel,
  value,
  onChange,
}: IdsDataGridFilterSearchFieldProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const query = value ?? uncontrolledValue;
  const showClear = query.length > 0;

  const setQuery = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onChange?.(next);
  };

  return (
    <div className={styles.filterPopupSearchRow} data-text-filter>
      <Icon shapeName="search-16" className={styles.filterPopupSearchIcon} />
      <div className={styles.filterPopupSearchInputWrap}>
        <input
          type="search"
          className={styles.filterPopupSearchInput}
          placeholder={placeholder}
          aria-label={ariaLabel}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {showClear ? (
          <button
            type="button"
            className={styles.filterPopupSearchClear}
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <Icon
              shapeName="ctrl-close-16"
              className={styles.filterPopupSearchClearIcon}
              style={{ width: 12, height: 12 }}
            />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export interface IdsDataGridRow {
  id: string;
  values: Record<string, ReactNode>;
}

export type IdsDataGridSelectionMode = "single" | "multiple";

export interface IdsDataGridProps {
  columns: IdsDataGridColumn[];
  rows: IdsDataGridRow[];
  viewMode?: IdsDataGridView;
  /** When true, shows the 48px leading selection column (no select-all header). */
  rowSelection?: boolean;
  /**
   * `single` = per-row radio, empty header; `multiple` = per-row checkbox + header select-all (current page).
   * Ignored when `rowSelection` is false. Row body click does not toggle controls — only the control does.
   */
  selectionMode?: IdsDataGridSelectionMode;
  /**
   * When `selectionMode` is `single`, show the 48px selection column with per-row radios.
   * When `false`, single-select has no selection column (row activation / detail panel only).
   * Ignored for `multiple` (checkbox column always shown when `rowSelection` is true).
   */
  showSingleSelectionRadio?: boolean;
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
  /** Fired when a hideable column is shown or hidden via the settings popup. */
  onColumnVisibilityChange?: (columnKey: string, visible: boolean) => void;
  /** Fired when the user changes single-select radio (`selectionMode: "single"`). */
  onRowSelectionChange?: (rowId: string | null) => void;
  /** Fired when the user toggles multiselect checkboxes (`selectionMode: "multiple"`). */
  onSelectedRowsChange?: (rowIds: string[]) => void;
  /**
   * When set, data columns from the start through this key (inclusive) stay pinned on horizontal scroll.
   * Unknown keys are ignored (no freeze boundary).
   */
  freezeUntilColumnKey?: string | null;
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

type FilterMenuPos = { top: number; right: number; maxPanelWidth?: number };

/** Keep L-frame filter panels inside the grid (right-anchored menus must not spill past the left edge). */
const FILTER_MENU_EDGE_PAD_PX = 8;

type GridSectionPart = "header" | "body";

type GridSectionOptions = {
  dataColumns: IdsDataGridColumn[];
  includeSelection: boolean;
  includeSettings: boolean;
  sectionGrowColumnKey: string | null;
  tableMinWidthPx: number;
  stickySelection: boolean;
  stickySettings: boolean;
  sectionPart: GridSectionPart;
};

export function IdsDataGrid({
  columns,
  rows,
  viewMode = "table",
  rowSelection = true,
  selectionMode = "single",
  showSingleSelectionRadio = true,
  withDetailPanel = false,
  pageSize = 6,
  readOnly = false,
  rowVerticalIndicator = false,
  headerColorAndBorder = true,
  columnResizeEnabled = false,
  onColumnVisibilityChange,
  onRowSelectionChange,
  onSelectedRowsChange,
  freezeUntilColumnKey = null,
}: IdsDataGridProps) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [openFilterColumn, setOpenFilterColumn] = useState<string | null>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(() => new Set());
  const [filterMenuPos, setFilterMenuPos] = useState<FilterMenuPos | null>(null);
  const [filterHoverKey, setFilterHoverKey] = useState<string | null>(null);
  const [filterFocusKey, setFilterFocusKey] = useState<string | null>(null);
  const [filterPressKey, setFilterPressKey] = useState<string | null>(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [settingsMenuPos, setSettingsMenuPos] = useState<FilterMenuPos | null>(null);
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<Set<string>>(() => new Set());
  const [columnVisibilityValidation, setColumnVisibilityValidation] = useState<string | null>(
    null,
  );
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

  const showSelectionColumn =
    rowSelection &&
    (selectionMode === "multiple" ||
      (selectionMode === "single" && showSingleSelectionRadio));

  useEffect(() => {
    setSelectedRowId(null);
    setSelectedRowIds(new Set());
  }, [selectionMode]);

  useEffect(() => {
    if (selectionMode === "single" && !showSingleSelectionRadio) {
      setSelectedRowId(null);
    }
  }, [selectionMode, showSingleSelectionRadio]);

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

  const shellRef = useRef<HTMLDivElement | null>(null);
  const gridWrapRef = useRef<HTMLDivElement | null>(null);
  const bodyViewportRef = useRef<HTMLDivElement | null>(null);
  const headerUnifiedTrackRef = useRef<HTMLDivElement | null>(null);
  const headerFrozenTrackRef = useRef<HTMLDivElement | null>(null);
  const headerScrollableTrackRef = useRef<HTMLDivElement | null>(null);
  const frozenBodyPaneRef = useRef<HTMLDivElement | null>(null);
  const scrollableBodyPaneRef = useRef<HTMLDivElement | null>(null);
  const filterAnchorRefs = useRef(new Map<string, HTMLDivElement>());
  const settingsAnchorRef = useRef<HTMLDivElement | null>(null);
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
    if (!openFilterColumn) {
      setFilterHoverKey(null);
      setFilterFocusKey(null);
      setFilterPressKey(null);
      return;
    }
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

  useEffect(() => {
    if (!settingsMenuOpen) {
      setSettingsMenuPos(null);
      setColumnVisibilityValidation(null);
      return;
    }
    setOpenFilterColumn(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsMenuOpen(false);
    };
    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const roots = document.querySelectorAll("[data-ids-datagrid-settings-menu]");
      for (const root of roots) {
        if (root.contains(target)) return;
      }
      if (settingsAnchorRef.current?.contains(target)) return;
      setSettingsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [settingsMenuOpen]);

  useLayoutEffect(() => {
    if (!settingsMenuOpen) {
      setSettingsMenuPos(null);
      return;
    }

    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      const anchor = settingsAnchorRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      setSettingsMenuPos({
        top: r.bottom,
        right: document.documentElement.clientWidth - r.right,
      });
    };

    update();
    const raf = requestAnimationFrame(update);
    const onWin = () => update();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [settingsMenuOpen]);

  useEffect(() => {
    setHiddenColumnKeys((prev) => {
      const allowed = new Set(columns.filter((c) => c.columnHideable).map((c) => c.key));
      const next = new Set([...prev].filter((k) => allowed.has(k)));
      return next.size === prev.size ? prev : next;
    });
  }, [columns]);

  useEffect(() => {
    if (!openFilterColumn) return;
    const col = columns.find((c) => c.key === openFilterColumn);
    if (col && !isIdsDataGridColumnVisible(col, hiddenColumnKeys)) {
      setOpenFilterColumn(null);
    }
  }, [openFilterColumn, columns, hiddenColumnKeys]);

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

  const hideableColumns = useMemo(() => getIdsDataGridHideableColumns(columns), [columns]);

  const visibleOrderedColumns = useMemo(
    () => orderedColumns.filter((column) => isIdsDataGridColumnVisible(column, hiddenColumnKeys)),
    [orderedColumns, hiddenColumnKeys],
  );

  const openFilterColumnMeta = useMemo(
    () =>
      openFilterColumn != null
        ? visibleOrderedColumns.find((c) => c.key === openFilterColumn && c.filterable)
        : undefined,
    [openFilterColumn, visibleOrderedColumns],
  );

  const handleColumnVisibilityChange = (columnKey: string, visible: boolean) => {
    if (!visible && !canHideIdsDataGridColumn(columnKey, columns, hiddenColumnKeys)) {
      setColumnVisibilityValidation(IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR);
      return;
    }
    setColumnVisibilityValidation(null);
    setHiddenColumnKeys((prev) => {
      const next = new Set(prev);
      if (visible) next.delete(columnKey);
      else next.add(columnKey);
      return next;
    });
    onColumnVisibilityChange?.(columnKey, visible);
  };

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
      const boundsEl = gridWrapRef.current ?? shellRef.current;
      const boundsLeft = boundsEl
        ? boundsEl.getBoundingClientRect().left
        : FILTER_MENU_EDGE_PAD_PX;
      // Right-anchored L-frame: available width is from grid/viewport left → anchor right.
      const maxPanelWidth = Math.max(
        FILTER_MENU_EDGE_PAD_PX,
        r.right - boundsLeft - FILTER_MENU_EDGE_PAD_PX,
      );
      setFilterMenuPos({
        top: r.top + 5,
        right: document.documentElement.clientWidth - r.right,
        maxPanelWidth,
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

    const bv = bodyViewportRef.current;
    const sb = scrollableBodyPaneRef.current;
    const fb = frozenBodyPaneRef.current;
    bv?.addEventListener("scroll", onWin);
    sb?.addEventListener("scroll", onWin);
    fb?.addEventListener("scroll", onWin);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      if (bv) ro.observe(bv);
      if (sb) ro.observe(sb);
      if (fb) ro.observe(fb);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
      bv?.removeEventListener("scroll", onWin);
      sb?.removeEventListener("scroll", onWin);
      fb?.removeEventListener("scroll", onWin);
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
  const visibleRowIds = useMemo(() => visibleRows.map((row) => row.id), [visibleRows]);

  const activeRow = useMemo(
    () => (activeRowId != null ? rows.find((row) => row.id === activeRowId) : undefined),
    [activeRowId, rows],
  );

  const setSingleRowSelection = (rowId: string | null) => {
    setSelectedRowId(rowId);
    onRowSelectionChange?.(rowId);
  };

  const setMultiselectRow = (rowId: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(rowId);
      else next.delete(rowId);
      onSelectedRowsChange?.([...next]);
      return next;
    });
  };

  const isRowSelectionChecked = (rowId: string) =>
    selectionMode === "single"
      ? showSingleSelectionRadio && selectedRowId === rowId
      : selectedRowIds.has(rowId);

  const selectedVisibleCount = useMemo(
    () => visibleRowIds.filter((id) => selectedRowIds.has(id)).length,
    [visibleRowIds, selectedRowIds],
  );
  const allVisibleRowsSelected =
    visibleRowIds.length > 0 && selectedVisibleCount === visibleRowIds.length;
  const someVisibleRowsSelected =
    selectedVisibleCount > 0 && selectedVisibleCount < visibleRowIds.length;

  const toggleSelectAllVisible = (checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      for (const id of visibleRowIds) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      onSelectedRowsChange?.([...next]);
      return next;
    });
  };

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
    if (resolveIdsDataGridColumnFilterActive(column)) {
      return { shape: "filter-solid", iconState: "selected" };
    }
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

  const freezeIndex = useMemo(() => {
    if (!freezeUntilColumnKey) return -1;
    return visibleOrderedColumns.findIndex((column) => column.key === freezeUntilColumnKey);
  }, [visibleOrderedColumns, freezeUntilColumnKey]);

  const hasSplitFreeze = freezeIndex >= 0;

  const frozenDataColumns = useMemo(
    () => (hasSplitFreeze ? visibleOrderedColumns.slice(0, freezeIndex + 1) : []),
    [hasSplitFreeze, freezeIndex, visibleOrderedColumns],
  );

  const scrollableDataColumns = useMemo(
    () => (hasSplitFreeze ? visibleOrderedColumns.slice(freezeIndex + 1) : visibleOrderedColumns),
    [hasSplitFreeze, freezeIndex, visibleOrderedColumns],
  );

  const growColumnKey = useMemo(() => {
    const dataColumns = hasSplitFreeze ? scrollableDataColumns : visibleOrderedColumns;
    if (dataColumns.length === 0) return null;
    return dataColumns[dataColumns.length - 1].key;
  }, [hasSplitFreeze, scrollableDataColumns, visibleOrderedColumns]);

  useEffect(() => {
    setGrowColPinnedWidthPx(null);
    growResizeLatestWidthRef.current = null;
  }, [growColumnKey, visibleOrderedColumns.length]);

  const growColumn = useMemo(() => {
    if (growColumnKey == null) return undefined;
    const lookup = hasSplitFreeze ? scrollableDataColumns : visibleOrderedColumns;
    return lookup.find((column) => column.key === growColumnKey);
  }, [growColumnKey, hasSplitFreeze, scrollableDataColumns, visibleOrderedColumns]);

  /** All columns except the grow column (settings is always included). */
  const fixedColumnsWidthPx = useMemo(() => {
    let total = SETTINGS_COL_WIDTH;
    if (showSelectionColumn) total += SELECTION_COL_WIDTH;
    for (const col of visibleOrderedColumns) {
      if (col.key === growColumnKey) continue;
      total += columnWidthPx(col);
    }
    return total;
  }, [visibleOrderedColumns, columnWidths, columnResizeEnabled, showSelectionColumn, growColumnKey]);

  const tableMinWidthPx = useMemo(() => {
    const growFloor = growColumn
      ? Math.max(DEFAULT_MIN_WIDTH, growColumn.minWidth ?? DEFAULT_MIN_WIDTH)
      : 0;
    return fixedColumnsWidthPx + growFloor;
  }, [fixedColumnsWidthPx, growColumn]);

  const frozenPaneWidthPx = useMemo(() => {
    let total = showSelectionColumn ? SELECTION_COL_WIDTH : 0;
    for (const column of frozenDataColumns) {
      total += columnWidthPx(column);
    }
    return total;
  }, [frozenDataColumns, showSelectionColumn, columnWidths, columnResizeEnabled]);

  /** Scrollable data pane only (settings live in a separate pinned host when split-freeze). */
  const scrollableFixedWidthPx = useMemo(() => {
    let total = 0;
    for (const column of scrollableDataColumns) {
      if (column.key === growColumnKey) continue;
      total += columnWidthPx(column);
    }
    return total;
  }, [scrollableDataColumns, columnWidths, columnResizeEnabled, growColumnKey]);

  const scrollableTableMinWidthPx = useMemo(() => {
    const growFloor = growColumn
      ? Math.max(DEFAULT_MIN_WIDTH, growColumn.minWidth ?? DEFAULT_MIN_WIDTH)
      : 0;
    return scrollableFixedWidthPx + growFloor;
  }, [scrollableFixedWidthPx, growColumn]);

  const colWidthStyle = (
    column: IdsDataGridColumn,
    sectionGrowColumnKey: string | null = growColumnKey,
  ): React.CSSProperties => {
    if (sectionGrowColumnKey != null && column.key === sectionGrowColumnKey) {
      if (growColPinnedWidthPx != null) {
        return { width: `${growColPinnedWidthPx}px` };
      }
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

  useEffect(() => {
    const bodyEl = bodyViewportRef.current;
    const headerUnified = headerUnifiedTrackRef.current;
    const headerFrozen = headerFrozenTrackRef.current;
    const headerScrollable = headerScrollableTrackRef.current;
    const frozenBody = frozenBodyPaneRef.current;
    const scrollableBody = scrollableBodyPaneRef.current;
    if (!bodyEl) return;

    const syncUnified = () => {
      if (headerUnified) headerUnified.scrollLeft = bodyEl.scrollLeft;
    };
    const syncFrozen = () => {
      if (headerFrozen && frozenBody) headerFrozen.scrollLeft = frozenBody.scrollLeft;
    };
    const syncScrollable = () => {
      if (headerScrollable && scrollableBody) {
        headerScrollable.scrollLeft = scrollableBody.scrollLeft;
      }
    };

    bodyEl.addEventListener("scroll", syncUnified);
    frozenBody?.addEventListener("scroll", syncFrozen);
    scrollableBody?.addEventListener("scroll", syncScrollable);

    return () => {
      bodyEl.removeEventListener("scroll", syncUnified);
      frozenBody?.removeEventListener("scroll", syncFrozen);
      scrollableBody?.removeEventListener("scroll", syncScrollable);
    };
  }, [hasSplitFreeze, visibleOrderedColumns.length, freezeUntilColumnKey]);

  const renderGridSection = (sectionKey: string, options: GridSectionOptions) => {
    const {
      dataColumns,
      includeSelection,
      includeSettings,
      sectionGrowColumnKey,
      tableMinWidthPx: sectionMinWidthPx,
      stickySelection,
      stickySettings,
      sectionPart,
    } = options;

    const selectionColumnClass = [
      styles.selectionColumn,
      stickySelection ? "" : styles.selectionColumnStatic,
    ]
      .filter(Boolean)
      .join(" ");

    const settingsColumnClass = [
      styles.settingsColumn,
      stickySettings ? "" : styles.settingsColumnStatic,
    ]
      .filter(Boolean)
      .join(" ");

    const sectionTableStyle: React.CSSProperties =
      sectionGrowColumnKey != null
        ? { width: "100%", minWidth: sectionMinWidthPx }
        : { width: sectionMinWidthPx, minWidth: sectionMinWidthPx };

    return (
      <table
        key={sectionKey}
        className={styles.grid}
        data-header-styled={headerColorAndBorder ? "true" : "false"}
        style={sectionTableStyle}
      >
        <colgroup>
          {includeSelection ? (
            <col
              className={styles.colSelection}
              style={{ width: `${SELECTION_COL_WIDTH}px` }}
            />
          ) : null}
          {dataColumns.map((column) => (
            <col
              key={column.key}
              className={
                sectionGrowColumnKey != null && column.key === sectionGrowColumnKey
                  ? styles.tableGrowCol
                  : undefined
              }
              style={colWidthStyle(column, sectionGrowColumnKey)}
            />
          ))}
          {includeSettings ? (
            <col
              className={styles.colSettings}
              style={{ width: `${SETTINGS_COL_WIDTH}px` }}
            />
          ) : null}
        </colgroup>
        {sectionPart === "header" ? (
        <thead>
          <tr>
            {includeSelection ? (
              <th
                className={`${styles.headerCell} ${selectionColumnClass} ${styles.headerSelectionColumn}`}
                scope="col"
                aria-label={
                  selectionMode === "multiple" ? "Select all rows on this page" : "Selection"
                }
              >
                <div
                  className={styles.selectionHeaderContent}
                  aria-hidden={selectionMode === "single" ? true : undefined}
                >
                  {selectionMode === "multiple" ? (
                    <IdsDataGridSelectionCheckbox
                      id="ids-dg-select-all"
                      label="Select all rows on this page"
                      checked={allVisibleRowsSelected}
                      indeterminate={someVisibleRowsSelected}
                      onChange={toggleSelectAllVisible}
                      onClick={(event) => event.stopPropagation()}
                    />
                  ) : null}
                </div>
              </th>
            ) : null}
            {dataColumns.map((column) => {
              const isSorted = sortKey === column.key;
              const filterToggleVis = resolveFilterToggleVisual(column, column.key);
              return (
                <th
                  key={column.key}
                  className={`${styles.headerCell} ${styles.headerDataCell}`}
                  scope="col"
                  aria-sort={
                    column.sortable
                      ? isSorted
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
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
                                data-sorted={isSorted ? "true" : undefined}
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
                                  data-filter-active={
                                    resolveIdsDataGridColumnFilterActive(column) ? "true" : undefined
                                  }
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setFilterHoverKey(null);
                                    setFilterPressKey(null);
                                    setSettingsMenuOpen(false);
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
            {includeSettings ? (
              <th
                className={`${styles.headerCell} ${settingsColumnClass}`}
                scope="col"
              >
                <div className={styles.settingsHeaderInner} ref={settingsAnchorRef}>
                      <button
                        type="button"
                        className={styles.settingsToggleButton}
                        aria-label="Column settings"
                        aria-haspopup="dialog"
                        aria-expanded={settingsMenuOpen}
                        disabled={hideableColumns.length === 0}
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenFilterColumn(null);
                          setSettingsMenuOpen((open) => !open);
                        }}
                      >
                        <Icon
                          shapeName="settings-gear"
                          className={`${styles.settingsIcon} ${settingsMenuOpen ? styles.settingsIconActive : ""}`}
                          style={{ width: 16, height: 16 }}
                        />
                      </button>
                </div>
              </th>
            ) : null}
          </tr>
        </thead>
        ) : (
        <tbody>
          {visibleRows.map((row) => {
            const isRowActive = activeRowId === row.id;
            const isRowSelected = isRowSelectionChecked(row.id) || isRowActive;
            return (
              <tr
                key={row.id}
                className={styles.bodyRow}
                data-selected={isRowSelected ? "true" : undefined}
                data-readonly={readOnly ? "true" : undefined}
                data-vertical-indicator={rowVerticalIndicator ? "true" : undefined}
                onClick={() => handleRowClick(row.id)}
              >
                {includeSelection ? (
                  <td
                    className={`${styles.bodyCell} ${selectionColumnClass} ${styles.rowSelectionCell}`}
                  >
                        <div className={styles.selectionRowContent}>
                          {selectionMode === "single" ? (
                            <IdsDataGridSelectionRadio
                              value={row.id}
                              label={`Select row ${row.id}`}
                              onClick={(event) => event.stopPropagation()}
                            />
                          ) : (
                            <IdsDataGridSelectionCheckbox
                              id={`ids-dg-row-${row.id}`}
                              label={`Select row ${row.id}`}
                              checked={selectedRowIds.has(row.id)}
                              onChange={(checked) => setMultiselectRow(row.id, checked)}
                              onClick={(event) => event.stopPropagation()}
                            />
                          )}
                        </div>
                      </td>
                ) : null}
                {dataColumns.map((column) => (
                  <td key={column.key} className={styles.bodyCell}>
                    <span className={styles.cellText}>{row.values[column.key]}</span>
                  </td>
                ))}
                {includeSettings ? (
                  <td className={`${styles.bodyCell} ${settingsColumnClass}`} />
                ) : null}
              </tr>
            );
          })}
        </tbody>
        )}
      </table>
    );
  };

  const unifiedSectionOptions = {
    dataColumns: visibleOrderedColumns,
    includeSelection: showSelectionColumn,
    includeSettings: true,
    sectionGrowColumnKey: growColumnKey,
    tableMinWidthPx,
    stickySelection: true,
    stickySettings: true,
  } satisfies Omit<GridSectionOptions, "sectionPart">;

  const tableViewport = hasSplitFreeze ? (
    <div
      className={styles.gridScrollHost}
      data-split-freeze="true"
      style={{ "--datagrid-frozen-pane-width": `${frozenPaneWidthPx}px` } as React.CSSProperties}
    >
      <div className={styles.headerBand}>
        <div className={styles.tableSplitRow}>
          <div
            className={styles.frozenHeaderHost}
            style={{ width: frozenPaneWidthPx, flexBasis: frozenPaneWidthPx }}
          >
            <div className={styles.headerBandTrack} ref={headerFrozenTrackRef}>
              {renderGridSection("frozen-header", {
                dataColumns: frozenDataColumns,
                includeSelection: showSelectionColumn,
                includeSettings: false,
                sectionGrowColumnKey: null,
                tableMinWidthPx: frozenPaneWidthPx,
                stickySelection: false,
                stickySettings: false,
                sectionPart: "header",
              })}
            </div>
          </div>
          <div className={styles.scrollableHeaderHost}>
            <div className={styles.headerBandTrack} ref={headerScrollableTrackRef}>
              {renderGridSection("scrollable-header", {
                dataColumns: scrollableDataColumns,
                includeSelection: false,
                includeSettings: false,
                sectionGrowColumnKey: growColumnKey,
                tableMinWidthPx: scrollableTableMinWidthPx,
                stickySelection: false,
                stickySettings: false,
                sectionPart: "header",
              })}
            </div>
          </div>
          <div className={styles.settingsHeaderHost}>
            {renderGridSection("settings-header", {
              dataColumns: [],
              includeSelection: false,
              includeSettings: true,
              sectionGrowColumnKey: null,
              tableMinWidthPx: SETTINGS_COL_WIDTH,
              stickySelection: false,
              stickySettings: false,
              sectionPart: "header",
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.bodyViewport} ${styles.bodyViewportSplit}`} ref={bodyViewportRef}>
        <div className={styles.tableSplitRow}>
          <div
            className={styles.frozenPaneHost}
            style={{ width: frozenPaneWidthPx, flexBasis: frozenPaneWidthPx }}
          >
            <div className={styles.frozenPane} ref={frozenBodyPaneRef}>
              {renderGridSection("frozen-body", {
                dataColumns: frozenDataColumns,
                includeSelection: showSelectionColumn,
                includeSettings: false,
                sectionGrowColumnKey: null,
                tableMinWidthPx: frozenPaneWidthPx,
                stickySelection: false,
                stickySettings: false,
                sectionPart: "body",
              })}
            </div>
          </div>
          <div className={styles.scrollablePane} ref={scrollableBodyPaneRef}>
            {renderGridSection("scrollable-body", {
              dataColumns: scrollableDataColumns,
              includeSelection: false,
              includeSettings: false,
              sectionGrowColumnKey: growColumnKey,
              tableMinWidthPx: scrollableTableMinWidthPx,
              stickySelection: false,
              stickySettings: false,
              sectionPart: "body",
            })}
          </div>
          <div className={styles.settingsPaneHost}>
            {renderGridSection("settings-body", {
              dataColumns: [],
              includeSelection: false,
              includeSettings: true,
              sectionGrowColumnKey: null,
              tableMinWidthPx: SETTINGS_COL_WIDTH,
              stickySelection: false,
              stickySettings: false,
              sectionPart: "body",
            })}
          </div>
        </div>
      </div>
      <div className={styles.freezePaneEdge} aria-hidden="true" />
    </div>
  ) : (
    <div className={styles.gridScrollHost}>
      <div className={styles.headerBand}>
        <div className={styles.headerBandTrack} ref={headerUnifiedTrackRef}>
          {renderGridSection("unified-header", {
            ...unifiedSectionOptions,
            stickySelection: false,
            stickySettings: true,
            sectionPart: "header",
          })}
        </div>
      </div>
      <div className={styles.bodyViewport} ref={bodyViewportRef}>
        <div className={styles.bodyContent}>
          {renderGridSection("unified-body", {
            ...unifiedSectionOptions,
            sectionPart: "body",
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={shellRef}
      className={styles.shell}
      data-with-detail-panel={withDetailPanel ? "true" : undefined}
    >
      <div className={styles.topBar}>
        <span className={styles.modeLabel}>View: {viewMode}</span>
      </div>
      <div className={styles.contentRow}>
        <div ref={gridWrapRef} className={styles.gridWrap}>
          {showSelectionColumn && selectionMode === "single" ? (
            <RadioGroup
              className={styles.rowSelectionGroup}
              value={selectedRowId ?? ""}
              onValueChange={(value) =>
                setSingleRowSelection(typeof value === "string" && value ? value : null)
              }
              aria-label="Row selection"
            >
              {tableViewport}
            </RadioGroup>
          ) : (
            tableViewport
          )}
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
                  {visibleOrderedColumns.map((column) => (
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
            ["--ids-datagrid-filter-panel-max-width" as string]:
              filterMenuPos?.maxPanelWidth != null
                ? `${filterMenuPos.maxPanelWidth}px`
                : undefined,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className={styles.filterPopupIconTab}
            aria-label={`Filter ${openFilterColumnMeta.title}`}
            aria-expanded
            aria-haspopup="dialog"
            data-filter-active={
              resolveIdsDataGridColumnFilterActive(openFilterColumnMeta) ? "true" : undefined
            }
            onClick={(event) => {
              event.stopPropagation();
              setOpenFilterColumn(null);
            }}
          >
            <Icon
              shapeName={
                resolveIdsDataGridColumnFilterActive(openFilterColumnMeta)
                  ? "filter-solid"
                  : "filter"
              }
              className={`${styles.filterIcon} ${
                resolveIdsDataGridColumnFilterActive(openFilterColumnMeta)
                  ? styles["filter-selected"]
                  : styles["filter-default"]
              }`}
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
      {typeof document !== "undefined" &&
      settingsMenuOpen &&
      hideableColumns.length > 0 &&
      createPortal(
        <div
          className={styles.settingsMenuLayer}
          data-ids-datagrid-settings-menu
          style={{
            position: "fixed",
            top: settingsMenuPos?.top ?? 0,
            right: settingsMenuPos?.right ?? 0,
            visibility: settingsMenuPos ? "visible" : "hidden",
            pointerEvents: settingsMenuPos ? "auto" : "none",
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className={styles.settingsPopupPanel} role="dialog" aria-label="Column visibility">
            <div className={styles.settingsPopupPanelBody}>
              <IdsDataGridColumnVisibilityPanel
                hideableColumns={hideableColumns}
                hiddenColumnKeys={hiddenColumnKeys}
                onColumnVisibilityChange={handleColumnVisibilityChange}
                validationMessage={columnVisibilityValidation}
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
