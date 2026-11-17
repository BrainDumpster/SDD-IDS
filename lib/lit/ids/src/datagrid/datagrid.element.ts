/**
 * IDS Datagrid — Lit web component from `components/ids/datagrid/design-spec.md`.
 *
 * Composition (Angular / React parity):
 *   ids-datagrid
 *     ids-datagrid-column+
 *       ids-datagrid-column-title?
 *       ids-datagrid-filter?
 *     ids-datagrid-body?
 *       ids-datagrid-row+
 *         ids-datagrid-cell+
 *     ids-datagrid-footer?
 *     ids-datagrid-detail-panel?
 *
 * Grid host owns L-frame, colgroup, sticky pins, grow column, settings popup.
 * Live Figma verified 2026-11-10: Column Header `37721:114663`, row/cell `37721:114580`,
 * canonical redesign `48122:183847` (session caf5caff-6362-417e-b0a5-f0f42d3ac6e3).
 */
import { LitElement, html, nothing, render } from "lit";
import { property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import "../icon/register.js";
import "../checkbox/register.js";
import "../pagination/register.js";
import "../detail-panel/register.js";
import {
  DATAGRID_API_DEFAULTS,
  DATAGRID_DEFAULT_MIN_WIDTH,
  DATAGRID_SELECTION_COL_WIDTH,
  DATAGRID_SETTINGS_COL_WIDTH,
  IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR,
  type IdsDatagridColumnModel,
  type IdsDatagridRowModel,
  type IdsDatagridSelectionMode,
  type IdsDatagridSortDirection,
  type IdsDatagridViewMode,
} from "./datagrid.constants.js";
import { datagridStyles } from "./datagrid.styles.js";
import {
  canHideColumn,
  columnBaseWidthPx,
  getHideableColumns,
  isColumnVisible,
  nextSortDirection,
  resolvedColumnWidthPx,
  sortRows,
  tableMinWidthPxForColumns,
  type SortDirection,
} from "./datagrid.utils.js";
import type { IdsDatagridColumn } from "./datagrid-column.element.js";

type FilterMenuPos = { top: number; right: number };

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 75, 100];

let datagridUid = 0;

export class IdsDatagrid extends LitElement {
  static override styles = [datagridStyles];

  @property({ type: String, attribute: "viewmode", reflect: true })
  viewMode: IdsDatagridViewMode = DATAGRID_API_DEFAULTS.viewMode;

  @property({ type: Boolean, attribute: "rowselection", reflect: true })
  rowSelection = DATAGRID_API_DEFAULTS.rowSelection;

  @property({ type: String, attribute: "selectionmode", reflect: true })
  selectionMode: IdsDatagridSelectionMode = DATAGRID_API_DEFAULTS.selectionMode;

  @property({ type: Boolean, attribute: "showsingleselectionradio", reflect: true })
  showSingleSelectionRadio = DATAGRID_API_DEFAULTS.showSingleSelectionRadio;

  @property({ type: Boolean, attribute: "withdetailpanel", reflect: true })
  withDetailPanel = DATAGRID_API_DEFAULTS.withDetailPanel;

  @property({ type: Number, attribute: "pagesize" })
  pageSize = DATAGRID_API_DEFAULTS.pageSize;

  /** Per-page dropdown options (property only). Always includes active size. */
  @property({ attribute: false })
  pageSizeOptions: number[] = [...DEFAULT_PAGE_SIZE_OPTIONS];

  /** Server-side total pages. Omit for client slice from registered rows. */
  @property({ type: Number, attribute: "totalpages" })
  totalPages: number | null = null;

  @property({ type: Boolean, attribute: "readonly", reflect: true })
  readOnly = DATAGRID_API_DEFAULTS.readOnly;

  @property({ type: Boolean, attribute: "rowverticalindicator", reflect: true })
  rowVerticalIndicator = DATAGRID_API_DEFAULTS.rowVerticalIndicator;

  @property({ type: Boolean, attribute: "headercolorandborder", reflect: true })
  headerColorAndBorder = DATAGRID_API_DEFAULTS.headerColorAndBorder;

  @property({ type: Boolean, attribute: "columnresizeenabled", reflect: true })
  columnResizeEnabled = DATAGRID_API_DEFAULTS.columnResizeEnabled;

  @property({ type: Boolean, attribute: "showsettingscolumn", reflect: true })
  showSettingsColumn = DATAGRID_API_DEFAULTS.showSettingsColumn;

  /** Controlled active row (detail panel). `undefined` → grid-managed. */
  @property({ attribute: false })
  activeRowId: string | null | undefined = undefined;

  @query(".bodyViewport") private bodyViewport?: HTMLElement;
  @query(".headerBandTrack") private headerTrack?: HTMLElement;
  @query(".settingsHeaderInner") private settingsAnchor?: HTMLElement;

  @state() private columns: IdsDatagridColumnModel[] = [];
  @state() private rows: IdsDatagridRowModel[] = [];
  @state() private sortKey: string | null = null;
  @state() private sortDirection: SortDirection = null;
  @state() private openFilterField: string | null = null;
  @state() private filterMenuPos: FilterMenuPos | null = null;
  @state() private settingsMenuOpen = false;
  @state() private settingsMenuPos: FilterMenuPos | null = null;
  @state() private columnVisibilityValidation: string | null = null;
  @state() private hiddenColumnKeys = new Set<string>();
  @state() private columnWidths: Record<string, number> = {};
  @state() private growColPinnedWidthPx: number | null = null;
  @state() private selectedRowId: string | null = null;
  @state() private selectedRowIds = new Set<string>();
  @state() private activeRowIdState: string | null = null;
  @state() private detailPanelOpen = false;
  @state() private currentPage = 1;
  @state() private activePageSize: number = DATAGRID_API_DEFAULTS.pageSize;
  @state() private hasFooterSlot = false;
  @state() private hasDetailSlot = false;

  private readonly columnRegistry = new Map<string, IdsDatagridColumnModel>();
  private readonly rowRegistry = new Map<string, IdsDatagridRowModel>();
  private readonly selectionGroupName = `ids-datagrid-selection-${++datagridUid}`;
  private filterAnchorEl: HTMLElement | null = null;
  private filterPortalEl: HTMLElement | null = null;
  private settingsPortalEl: HTMLElement | null = null;
  private filterHomeParent: HTMLElement | null = null;
  private filterHomeNext: ChildNode | null = null;
  private resizeActive = false;
  private growResizeLatestWidth: number | null = null;
  private overlayRepositionCleanup: (() => void) | null = null;
  private childObserver: MutationObserver | null = null;
  private onDocClick = (event: MouseEvent) => this.handleDocumentClick(event);
  private onDocKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      this.closeFilter();
      this.closeSettingsMenu();
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("data-ids", "IdsDatagrid");
    this.activePageSize = this.pageSize;
    this.childObserver = new MutationObserver(() => this.refreshProjectedChildren());
    this.childObserver.observe(this, { childList: true, subtree: true });
    document.addEventListener("click", this.onDocClick, true);
    document.addEventListener("keydown", this.onDocKey);
    this.refreshProjectedChildren();
  }

  override updated(changed: Map<string, unknown>): void {
    if (changed.has("pageSize")) {
      this.activePageSize = this.pageSize;
      this.currentPage = 1;
    }
  }

  override disconnectedCallback(): void {
    this.childObserver?.disconnect();
    this.childObserver = null;
    document.removeEventListener("click", this.onDocClick, true);
    document.removeEventListener("keydown", this.onDocKey);
    this.unbindOverlayRepositionListeners();
    this.closeFilter();
    this.closeSettingsMenu();
    super.disconnectedCallback();
  }

  /* ---- registration API (child elements) ---- */

  registerColumn(column: IdsDatagridColumnModel): void {
    const existing = this.columnRegistry.get(column.field);
    // Keep filter host while it is reparented into the L-frame portal.
    if (
      existing?.filterEl &&
      !column.filterEl &&
      this.openFilterField === column.field
    ) {
      column.filterEl = existing.filterEl;
    }
    this.columnRegistry.set(column.field, column);
    this.syncModels();
  }

  unregisterColumn(field: string): void {
    this.columnRegistry.delete(field);
    this.syncModels();
  }

  registerRow(row: IdsDatagridRowModel): void {
    const existing = this.rowRegistry.get(row.rowId);
    if (existing) {
      // Preserve cells already set.
      this.rowRegistry.set(row.rowId, { rowId: row.rowId, cells: existing.cells });
    } else {
      this.rowRegistry.set(row.rowId, row);
    }
    this.syncModels();
  }

  unregisterRow(rowId: string): void {
    this.rowRegistry.delete(rowId);
    this.syncModels();
  }

  setRowCell(rowId: string, field: string, value: string): void {
    let row = this.rowRegistry.get(rowId);
    if (!row) {
      row = { rowId, cells: new Map() };
      this.rowRegistry.set(rowId, row);
    }
    row.cells.set(field, value);
    this.syncModels();
  }

  requestSync(): void {
    this.refreshProjectedChildren();
  }

  private refreshProjectedChildren(): void {
    for (const col of this.querySelectorAll("ids-datagrid-column")) {
      (col as IdsDatagridColumn).syncRegistration?.();
    }
    const footer = this.querySelector("ids-datagrid-footer");
    if (footer && footer.getAttribute("slot") !== "footer") {
      footer.setAttribute("slot", "footer");
    }
    const detail = this.querySelector("ids-datagrid-detail-panel");
    if (detail && detail.getAttribute("slot") !== "detail-panel") {
      detail.setAttribute("slot", "detail-panel");
    }
    this.hasFooterSlot = Boolean(footer);
    this.hasDetailSlot = Boolean(detail);
    this.syncModels();
  }

  private syncModels(): void {
    // Preserve light-DOM column order.
    const ordered: IdsDatagridColumnModel[] = [];
    const columnEls = Array.from(this.querySelectorAll("ids-datagrid-column"));
    for (const el of columnEls) {
      const field = (el as IdsDatagridColumn).field;
      const model = this.columnRegistry.get(field);
      if (model) ordered.push(model);
    }
    for (const [field, model] of this.columnRegistry) {
      if (!ordered.some((c) => c.field === field)) ordered.push(model);
    }
    this.columns = ordered;

    const rowEls = Array.from(this.querySelectorAll("ids-datagrid-row"));
    const rows: IdsDatagridRowModel[] = [];
    for (const el of rowEls) {
      const rowId = (el as HTMLElement & { rowId?: string }).rowId;
      if (!rowId) continue;
      const model = this.rowRegistry.get(rowId);
      if (model) rows.push(model);
    }
    for (const [rowId, model] of this.rowRegistry) {
      if (!rows.some((r) => r.rowId === rowId)) rows.push(model);
    }
    this.rows = rows;
    this.syncColumnWidths();
    this.syncHiddenColumnKeys();
    if (this.currentPage > this.resolvedTotalPages) {
      this.currentPage = this.resolvedTotalPages;
    }
  }

  private syncColumnWidths(): void {
    if (!this.columnResizeEnabled) {
      this.columnWidths = {};
      return;
    }
    const next = { ...this.columnWidths };
    for (const column of this.columns) {
      const base = columnBaseWidthPx(column);
      const floor = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
      if (next[column.field] == null) next[column.field] = base;
      next[column.field] = Math.max(floor, next[column.field] ?? base);
    }
    for (const field of Object.keys(next)) {
      if (!this.columns.some((c) => c.field === field)) delete next[field];
    }
    this.columnWidths = next;
  }

  private syncHiddenColumnKeys(): void {
    const allowed = new Set(this.hideableColumns.map((c) => c.field));
    this.hiddenColumnKeys = new Set([...this.hiddenColumnKeys].filter((f) => allowed.has(f)));
  }

  /* ---- derived ---- */

  private get showSelectionColumn(): boolean {
    return (
      this.rowSelection &&
      (this.selectionMode === "multiple" ||
        (this.selectionMode === "single" && this.showSingleSelectionRadio))
    );
  }

  private get visibleColumns(): IdsDatagridColumnModel[] {
    return this.columns.filter((c) => isColumnVisible(c, this.hiddenColumnKeys));
  }

  private get hideableColumns(): IdsDatagridColumnModel[] {
    return getHideableColumns(this.columns);
  }

  private get growColumnField(): string | null {
    const visible = this.visibleColumns;
    return visible.length > 0 ? visible[visible.length - 1].field : null;
  }

  private get minTableWidthPx(): number {
    return tableMinWidthPxForColumns(
      this.visibleColumns,
      this.showSelectionColumn,
      this.columnWidths,
      this.growColumnField,
      this.growColPinnedWidthPx,
    );
  }

  private get sortedRows(): IdsDatagridRowModel[] {
    return sortRows(this.rows, this.sortKey, this.sortDirection);
  }

  private get resolvedTotalPages(): number {
    if (this.totalPages != null && Number.isFinite(this.totalPages)) {
      return Math.max(1, Math.trunc(this.totalPages));
    }
    const size = this.activePageSize > 0 ? this.activePageSize : 1;
    return Math.max(1, Math.ceil(this.sortedRows.length / size));
  }

  private get resolvedPageSizeOptions(): number[] {
    return [...new Set([...this.pageSizeOptions, this.pageSize, this.activePageSize])].sort(
      (a, b) => a - b,
    );
  }

  private get pagedRows(): IdsDatagridRowModel[] {
    const size = this.activePageSize > 0 ? this.activePageSize : this.sortedRows.length;
    const start = (this.currentPage - 1) * size;
    return this.sortedRows.slice(start, start + size);
  }

  private get activeRow(): IdsDatagridRowModel | null {
    const id = this.resolvedActiveRowId;
    if (!id) return null;
    return this.rows.find((row) => row.rowId === id) ?? null;
  }

  private get detailTitle(): string {
    if (!this.activeRow) return "Details";
    return this.activeRow.cells.get("name") ?? "Details";
  }

  private get resolvedActiveRowId(): string | null {
    return this.activeRowId !== undefined ? this.activeRowId : this.activeRowIdState;
  }

  private get hasDetailPanel(): boolean {
    return this.withDetailPanel || this.hasDetailSlot;
  }

  private columnWidth(column: IdsDatagridColumnModel): number | null {
    if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx == null) return null;
    if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx != null) {
      return this.growColPinnedWidthPx;
    }
    return resolvedColumnWidthPx(column, this.columnWidths);
  }

  private isGrowColumn(field: string): boolean {
    return field === this.growColumnField;
  }

  /* ---- interactions ---- */

  private toggleSort(field: string): void {
    const next = nextSortDirection(this.sortKey, field, this.sortDirection);
    this.sortDirection = next;
    this.sortKey = next ? field : null;
    if (next) {
      this.emit("sort-change", { columnKey: field, direction: next as IdsDatagridSortDirection });
    }
  }

  private onFilterPress(field: string, anchor: HTMLElement, event: Event): void {
    event.stopPropagation();
    this.closeSettingsMenu();
    if (this.openFilterField === field) {
      this.closeFilter();
      return;
    }
    this.filterAnchorEl = anchor;
    this.openFilterField = field;
    this.updateFilterMenuPos();
    this.bindOverlayRepositionListeners();
    this.emit("filter-toggle", { columnKey: field, open: true });
    this.scheduleFilterPortal();
  }

  private closeFilter(): void {
    if (this.openFilterField) {
      this.emit("filter-toggle", { columnKey: this.openFilterField, open: false });
    }
    this.restoreFilterEl();
    this.teardownFilterPortal();
    if (!this.settingsMenuOpen) this.unbindOverlayRepositionListeners();
    this.filterAnchorEl = null;
    this.openFilterField = null;
    this.filterMenuPos = null;
  }

  private closeSettingsMenu(): void {
    this.settingsMenuOpen = false;
    this.settingsMenuPos = null;
    this.columnVisibilityValidation = null;
    this.teardownSettingsPortal();
    if (!this.openFilterField) this.unbindOverlayRepositionListeners();
  }

  private toggleSettingsMenu(event: Event): void {
    event.stopPropagation();
    if (this.hideableColumns.length === 0) return;
    this.closeFilter();
    this.settingsMenuOpen = !this.settingsMenuOpen;
    if (this.settingsMenuOpen) {
      this.updateSettingsMenuPos();
      this.bindOverlayRepositionListeners();
      this.scheduleSettingsPortal();
    } else {
      this.closeSettingsMenu();
    }
  }

  private onColumnVisibilityChange(field: string, visible: boolean): void {
    if (!visible && !canHideColumn(field, this.columns, this.hiddenColumnKeys)) {
      this.columnVisibilityValidation = IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR;
      this.renderSettingsPortal();
      return;
    }
    this.columnVisibilityValidation = null;
    const next = new Set(this.hiddenColumnKeys);
    if (visible) next.delete(field);
    else next.add(field);
    this.hiddenColumnKeys = next;
    this.emit("column-visibility-change", { columnKey: field, visible });
    if (this.openFilterField && !this.visibleColumns.some((c) => c.field === this.openFilterField)) {
      this.closeFilter();
    }
    this.renderSettingsPortal();
  }

  private startColumnResize(field: string, event: PointerEvent): void {
    if (!this.columnResizeEnabled || this.resizeActive) return;
    event.preventDefault();
    event.stopPropagation();
    const column = this.columns.find((c) => c.field === field);
    const min = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column?.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
    const startW = this.columnWidths[field] ?? columnBaseWidthPx(column!);
    const startX = event.clientX;
    this.resizeActive = true;
    const target = event.currentTarget as HTMLElement | null;
    target?.setPointerCapture(event.pointerId);

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const next = Math.min(640, Math.max(min, startW + delta));
      if (this.growColumnField === field) this.growResizeLatestWidth = next;
      this.columnWidths = { ...this.columnWidths, [field]: next };
    };

    const onUp = (ev: PointerEvent) => {
      this.resizeActive = false;
      if (this.growColumnField === field && typeof this.growResizeLatestWidth === "number") {
        this.growColPinnedWidthPx = this.growResizeLatestWidth;
      }
      const finalW = this.columnWidths[field];
      if (typeof finalW === "number") {
        this.emit("column-resize", { columnKey: field, widthPx: finalW });
      }
      this.growResizeLatestWidth = null;
      try {
        target?.releasePointerCapture(ev.pointerId);
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
  }

  private syncHeaderScroll(): void {
    const body = this.bodyViewport;
    const header = this.headerTrack;
    if (!body || !header) return;
    header.scrollLeft = body.scrollLeft;
  }

  private onRowClick(rowId: string): void {
    if (this.hasDetailPanel) {
      if (this.resolvedActiveRowId === rowId && this.detailPanelOpen) {
        this.detailPanelOpen = false;
        if (this.activeRowId === undefined) this.activeRowIdState = null;
      } else {
        if (this.activeRowId === undefined) this.activeRowIdState = rowId;
        this.detailPanelOpen = true;
      }
    } else if (this.activeRowId === undefined) {
      this.activeRowIdState = rowId;
    }
    this.emit("row-click", { rowKey: rowId });
  }

  private onDetailExpandedChange(expanded: boolean): void {
    this.detailPanelOpen = expanded;
    if (!expanded && this.activeRowId === undefined) {
      this.activeRowIdState = null;
    }
  }

  private setPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.resolvedTotalPages);
  }

  private handlePageSizeChange(size: number): void {
    this.activePageSize = size;
    this.currentPage = 1;
    this.emit("page-size-change", { pageSize: size });
  }

  private onSingleSelect(rowId: string, event: Event): void {
    event.stopPropagation();
    this.selectedRowId = rowId;
    this.emit("row-selection-change", { rowId });
  }

  private onMultiSelect(rowId: string, checked: boolean, event: Event): void {
    event.stopPropagation();
    const next = new Set(this.selectedRowIds);
    if (checked) next.add(rowId);
    else next.delete(rowId);
    this.selectedRowIds = next;
    this.emit("selected-rows-change", { rowIds: [...next] });
  }

  private onSelectAll(checked: boolean, event: Event): void {
    event.stopPropagation();
    const next = new Set(this.selectedRowIds);
    for (const row of this.pagedRows) {
      if (checked) next.add(row.rowId);
      else next.delete(row.rowId);
    }
    this.selectedRowIds = next;
    this.emit("selected-rows-change", { rowIds: [...next] });
  }

  private isRowSelected(rowId: string): boolean {
    if (this.selectionMode === "multiple") return this.selectedRowIds.has(rowId);
    return this.selectedRowId === rowId || this.resolvedActiveRowId === rowId;
  }

  private emit(name: string, detail: unknown): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  /* ---- portals ---- */

  private updateFilterMenuPos(): void {
    const anchor = this.filterAnchorEl;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    this.filterMenuPos = {
      top: rect.top + 5,
      right: document.documentElement.clientWidth - rect.right,
    };
  }

  private updateSettingsMenuPos(): void {
    const anchor = this.settingsAnchor;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    this.settingsMenuPos = {
      top: rect.bottom,
      right: document.documentElement.clientWidth - rect.right,
    };
  }

  private scheduleFilterPortal(): void {
    requestAnimationFrame(() => {
      if (!this.openFilterField) return;
      this.renderFilterPortal();
      this.updateFilterMenuPos();
      this.applyFilterPortalPos();
      requestAnimationFrame(() => {
        if (!this.openFilterField) return;
        this.updateFilterMenuPos();
        this.applyFilterPortalPos();
      });
    });
  }

  private scheduleSettingsPortal(): void {
    requestAnimationFrame(() => {
      if (!this.settingsMenuOpen) return;
      this.renderSettingsPortal();
      this.updateSettingsMenuPos();
      this.applySettingsPortalPos();
    });
  }

  private renderFilterPortal(): void {
    if (!this.filterPortalEl) {
      this.filterPortalEl = document.createElement("div");
      this.filterPortalEl.setAttribute("data-ids-datagrid-filter-menu", "");
      document.body.appendChild(this.filterPortalEl);
    }
    const column = this.columns.find((c) => c.field === this.openFilterField);
    const pos = this.filterMenuPos;
    const layer = this.filterPortalEl;
    render(
      html`
        <div
          class="filterMenuLayer"
          style=${styleMap({
            position: "fixed",
            top: pos ? `${pos.top}px` : "0",
            right: pos ? `${pos.right}px` : "0",
            zIndex: "10000",
          })}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <button
            type="button"
            class="filterPopupIconTab"
            aria-label=${`Filter ${column?.title ?? ""}`}
            @click=${() => this.closeFilter()}
          >
            <ids-icon shape-name="filter-solid" class-name="filterIcon" size="14"></ids-icon>
          </button>
          <div class="filterPopupPanel">
            <div class="filterPopupPanelBody" data-filter-panel-body></div>
          </div>
        </div>
      `,
      layer,
    );
    // Adopt host styles into portal for L-frame classes.
    this.ensurePortalStyles(layer);
    this.mountFilterEl(layer.querySelector("[data-filter-panel-body]") as HTMLElement | null);
  }

  private mountFilterEl(panelBody: HTMLElement | null): void {
    const column = this.columns.find((c) => c.field === this.openFilterField);
    const filterEl = column?.filterEl;
    if (!panelBody || !filterEl) return;
    if (filterEl.parentElement !== panelBody) {
      this.filterHomeParent = filterEl.parentElement;
      this.filterHomeNext = filterEl.nextSibling;
      panelBody.appendChild(filterEl);
    }
  }

  private restoreFilterEl(): void {
    const column = this.columns.find((c) => c.field === this.openFilterField);
    const filterEl = column?.filterEl;
    if (!filterEl || !this.filterHomeParent) return;
    if (this.filterHomeNext && this.filterHomeNext.parentNode === this.filterHomeParent) {
      this.filterHomeParent.insertBefore(filterEl, this.filterHomeNext);
    } else {
      this.filterHomeParent.appendChild(filterEl);
    }
    this.filterHomeParent = null;
    this.filterHomeNext = null;
  }

  private teardownFilterPortal(): void {
    if (this.filterPortalEl) {
      render(nothing, this.filterPortalEl);
      this.filterPortalEl.remove();
      this.filterPortalEl = null;
    }
  }

  private renderSettingsPortal(): void {
    if (!this.settingsPortalEl) {
      this.settingsPortalEl = document.createElement("div");
      this.settingsPortalEl.setAttribute("data-ids-datagrid-settings-menu", "");
      document.body.appendChild(this.settingsPortalEl);
    }
    const pos = this.settingsMenuPos;
    const layer = this.settingsPortalEl;
    render(
      html`
        <div
          class="settingsMenuLayer"
          style=${styleMap({
            position: "fixed",
            top: pos ? `${pos.top}px` : "0",
            right: pos ? `${pos.right}px` : "0",
            zIndex: "10001",
          })}
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="settingsPopupPanel">
            <div class="settingsPopupPanelBody">
              <div class="columnVisibilityRoot" role="group" aria-label="Show or hide columns">
                <ul class="columnVisibilityList">
                  ${this.hideableColumns.map(
                    (column) => html`
                      <li class="columnVisibilityItem">
                        <ids-checkbox
                          .checked=${!this.hiddenColumnKeys.has(column.field)}
                          @checked-change=${(e: CustomEvent<boolean>) => {
                            this.onColumnVisibilityChange(column.field, Boolean(e.detail));
                          }}
                        >
                          <label>${column.title}</label>
                        </ids-checkbox>
                      </li>
                    `,
                  )}
                </ul>
                ${this.columnVisibilityValidation
                  ? html`
                      <div class="columnVisibilityValidation" role="alert">
                        <ids-icon shape-name="status-critical-square-solid" size="16"></ids-icon>
                        <span>${this.columnVisibilityValidation}</span>
                      </div>
                    `
                  : nothing}
              </div>
            </div>
          </div>
        </div>
      `,
      layer,
    );
    this.ensurePortalStyles(layer);
  }

  private teardownSettingsPortal(): void {
    if (this.settingsPortalEl) {
      render(nothing, this.settingsPortalEl);
      this.settingsPortalEl.remove();
      this.settingsPortalEl = null;
    }
  }

  private applyFilterPortalPos(): void {
    const el = this.filterPortalEl?.querySelector(".filterMenuLayer") as HTMLElement | null;
    if (!el || !this.filterMenuPos) return;
    el.style.top = `${this.filterMenuPos.top}px`;
    el.style.right = `${this.filterMenuPos.right}px`;
  }

  private applySettingsPortalPos(): void {
    const el = this.settingsPortalEl?.querySelector(".settingsMenuLayer") as HTMLElement | null;
    if (!el || !this.settingsMenuPos) return;
    el.style.top = `${this.settingsMenuPos.top}px`;
    el.style.right = `${this.settingsMenuPos.right}px`;
  }

  private ensurePortalStyles(layer: HTMLElement): void {
    if (layer.querySelector("style[data-ids-datagrid-portal]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-ids-datagrid-portal", "");
    // Minimal portal chrome (full sheet is shadow-scoped).
    style.textContent = `
      .filterMenuLayer, .settingsMenuLayer { display:flex; flex-direction:column; align-items:flex-end; box-sizing:border-box; }
      .filterPopupIconTab { position:relative; z-index:2; display:inline-flex; align-items:center; justify-content:center; width:38px; height:38px; padding:11px 11px 12px; margin:0 0 -1px; box-sizing:border-box; border:none; border-top:1px solid var(--color-border-gray-neutral-base); border-right:1px solid var(--color-border-gray-neutral-base); border-left:1px solid var(--color-border-gray-neutral-base); border-bottom:none; background:var(--color-background-surface-component); line-height:0; color:var(--color-icon-brand-base); cursor:pointer; }
      .filterPopupPanel { position:relative; z-index:1; width:max-content; min-width:200px; max-width:min(480px, calc(100vw - 24px)); box-sizing:border-box; background:var(--color-background-surface-component); border-right:1px solid var(--color-border-gray-neutral-base); border-bottom:1px solid var(--color-border-gray-neutral-base); border-left:1px solid var(--color-border-gray-neutral-base); box-shadow:0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37,37,37,.08)), 0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37,37,37,.08)); }
      .filterPopupPanel::before { content:""; position:absolute; top:0; left:0; width:calc(100% - 38px); height:1px; background:var(--color-border-gray-neutral-base); }
      .filterPopupPanelBody { padding:0; box-sizing:border-box; overflow:clip; }
      .settingsPopupPanel { width:max-content; min-width:200px; max-width:min(320px, calc(100vw - 24px)); background:var(--color-background-surface-component); border:1px solid var(--color-border-gray-neutral-base); box-shadow:0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37,37,37,.08)), 0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37,37,37,.08)); }
      .columnVisibilityList { list-style:none; margin:0; padding:4px 0; max-height:366px; overflow-y:auto; }
      .columnVisibilityItem { display:flex; align-items:center; padding:10px 16px; min-height:40px; box-sizing:border-box; }
      .columnVisibilityItem:hover { background:var(--color-background-brand-lighter-slate); }
      .columnVisibilityValidation { display:flex; align-items:center; gap:8px; padding:8px 16px; border-top:1px solid var(--color-border-gray-neutral-light); color:var(--color-text-alerting-critical-base); font-size:14px; }
    `;
    layer.prepend(style);
  }

  private bindOverlayRepositionListeners(): void {
    if (this.overlayRepositionCleanup) return;
    const onUpdate = () => {
      if (this.openFilterField) {
        this.updateFilterMenuPos();
        this.applyFilterPortalPos();
      }
      if (this.settingsMenuOpen) {
        this.updateSettingsMenuPos();
        this.applySettingsPortalPos();
      }
    };
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    this.bodyViewport?.addEventListener("scroll", onUpdate);
    this.headerTrack?.addEventListener("scroll", onUpdate);
    this.overlayRepositionCleanup = () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
      this.bodyViewport?.removeEventListener("scroll", onUpdate);
      this.headerTrack?.removeEventListener("scroll", onUpdate);
      this.overlayRepositionCleanup = null;
    };
  }

  private unbindOverlayRepositionListeners(): void {
    this.overlayRepositionCleanup?.();
    this.overlayRepositionCleanup = null;
  }

  private handleDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (this.openFilterField) {
      const inFilterMenu = Boolean(target.closest("[data-ids-datagrid-filter-menu]"));
      const inFilterAnchor = Boolean(target.closest(".filterAnchor"));
      const inDatePortal = Boolean(
        target.closest('[data-ids="ids-date-picker-calendar-portal"]'),
      );
      const inTimePortal = Boolean(
        target.closest('[data-ids="ids-time-picker-popup-portal"]'),
      );
      if (!inFilterMenu && !inFilterAnchor && !inDatePortal && !inTimePortal) {
        this.closeFilter();
      }
    }
    if (this.settingsMenuOpen) {
      if (
        !target.closest("[data-ids-datagrid-settings-menu]") &&
        !this.settingsAnchor?.contains(target)
      ) {
        this.closeSettingsMenu();
      }
    }
  }

  /* ---- render helpers ---- */

  private renderColgroup() {
    return html`
      <colgroup>
        ${this.showSelectionColumn
          ? html`<col class="colSelection" style=${styleMap({ width: `${DATAGRID_SELECTION_COL_WIDTH}px` })} />`
          : nothing}
        ${this.visibleColumns.map((column) => {
          const w = this.columnWidth(column);
          const grow = this.isGrowColumn(column.field) && this.growColPinnedWidthPx == null;
          return html`
            <col
              class=${classMap({ tableGrowCol: grow })}
              style=${styleMap(w != null ? { width: `${w}px` } : {})}
            />
          `;
        })}
        ${this.showSettingsColumn
          ? html`<col class="colSettings" style=${styleMap({ width: `${DATAGRID_SETTINGS_COL_WIDTH}px` })} />`
          : nothing}
      </colgroup>
    `;
  }

  private renderHeader() {
    const pageIds = this.pagedRows.map((r) => r.rowId);
    const allSelected =
      this.selectionMode === "multiple" &&
      pageIds.length > 0 &&
      pageIds.every((id) => this.selectedRowIds.has(id));
    const someSelected =
      this.selectionMode === "multiple" &&
      pageIds.some((id) => this.selectedRowIds.has(id)) &&
      !allSelected;

    return html`
      <thead>
        <tr>
          ${this.showSelectionColumn
            ? html`
                <th
                  class="headerCell selectionColumn headerSelectionColumn"
                  scope="col"
                >
                  ${this.selectionMode === "multiple"
                    ? html`
                        <div class="selectionHeaderContent">
                          <ids-checkbox
                            density="datagrid"
                            .checked=${allSelected}
                            .partial=${someSelected}
                            arialabel="Select all rows on this page"
                            .showLabel=${false}
                            @checked-change=${(e: CustomEvent<boolean>) =>
                              this.onSelectAll(Boolean(e.detail), e)}
                          ></ids-checkbox>
                        </div>
                      `
                    : nothing}
                </th>
              `
            : nothing}
          ${this.visibleColumns.map((column) => this.renderHeaderCell(column))}
          ${this.showSettingsColumn
            ? html`
                <th class="headerCell settingsColumn" scope="col">
                  <div class="settingsHeaderInner">
                    <button
                      type="button"
                      class="settingsToggleButton"
                      aria-label="Column settings"
                      aria-haspopup="dialog"
                      aria-expanded=${this.settingsMenuOpen ? "true" : "false"}
                      ?disabled=${this.hideableColumns.length === 0}
                      @click=${(e: Event) => this.toggleSettingsMenu(e)}
                    >
                      <ids-icon
                        shape-name="settings-gear"
                        class-name=${this.settingsMenuOpen
                          ? "settingsIcon settingsIconActive"
                          : "settingsIcon"}
                        size="16"
                      ></ids-icon>
                    </button>
                  </div>
                </th>
              `
            : nothing}
        </tr>
      </thead>
    `;
  }

  private renderHeaderCell(column: IdsDatagridColumnModel) {
    const sorted = this.sortKey === column.field;
    const sortShape =
      sorted && this.sortDirection === "desc" ? "col-sort-down-16" : "col-sort-up-16";
    const ariaSort =
      sorted && this.sortDirection === "asc"
        ? "ascending"
        : sorted && this.sortDirection === "desc"
          ? "descending"
          : undefined;

    return html`
      <th
        class="headerCell headerDataCell"
        scope="col"
        data-align=${ifDefined(column.align === "right" ? "right" : undefined)}
        aria-sort=${ifDefined(ariaSort)}
      >
        <div class="headerCellRow">
          <div class="headerTitleRow">
            <button
              type="button"
              class="titleButton"
              @click=${() => (column.sortable ? this.toggleSort(column.field) : null)}
            >
              <span class="headerTitle" title=${column.title}>${column.title}</span>
            </button>
            ${column.sortable
              ? html`
                  <button
                    type="button"
                    class="iconButton"
                    data-sorted=${sorted ? "true" : nothing}
                    aria-label=${`Sort by ${column.title}`}
                    @click=${() => this.toggleSort(column.field)}
                  >
                    <ids-icon
                      shape-name=${sortShape}
                      class-name=${sorted ? "sortIcon sortIconSelected" : "sortIcon"}
                      size="12"
                    ></ids-icon>
                  </button>
                `
              : nothing}
          </div>
          ${column.filterable
            ? html`
                <div
                  class="filterAnchor"
                  data-filter-field=${column.field}
                >
                  ${this.openFilterField !== column.field
                    ? html`
                        <button
                          type="button"
                          class="filterToggleButton"
                          data-filter-active=${column.filterActive ? "true" : nothing}
                          aria-expanded="false"
                          aria-label=${`Filter ${column.title}`}
                          @click=${(e: Event) => {
                            const anchor = (e.currentTarget as HTMLElement).closest(
                              ".filterAnchor",
                            ) as HTMLElement;
                            this.onFilterPress(column.field, anchor, e);
                          }}
                        >
                          <ids-icon
                            shape-name=${column.filterActive ? "filter-solid" : "filter"}
                            class-name="filterIcon"
                            size="14"
                          ></ids-icon>
                        </button>
                      `
                    : html`<div class="filterAnchorOpenSpacer" aria-hidden="true"></div>`}
                </div>
              `
            : nothing}
        </div>
        <span class="columnHeaderDivider" aria-hidden="true"></span>
        ${this.columnResizeEnabled
          ? html`
              <button
                type="button"
                class="columnResizeHandle"
                aria-label=${`Resize ${column.title} column`}
                @pointerdown=${(e: PointerEvent) => this.startColumnResize(column.field, e)}
              ></button>
            `
          : nothing}
      </th>
    `;
  }

  private renderBody() {
    return html`
      <tbody>
        ${this.pagedRows.map((row) => {
          const selected = this.isRowSelected(row.rowId);
          return html`
            <tr
              class="bodyRow"
              data-selected=${selected ? "true" : nothing}
              data-readonly=${this.readOnly ? "true" : nothing}
              data-vertical-indicator=${this.rowVerticalIndicator ? "true" : nothing}
              @click=${() => this.onRowClick(row.rowId)}
            >
              ${this.showSelectionColumn
                ? html`
                    <td class="bodyCell selectionColumn rowSelectionCell">
                      <div class="selectionRowContent">
                        ${this.selectionMode === "single"
                          ? html`
                              <input
                                type="radio"
                                class="selectionRadio"
                                name=${this.selectionGroupName}
                                value=${row.rowId}
                                .checked=${this.selectedRowId === row.rowId}
                                aria-label=${`Select row ${row.rowId}`}
                                @click=${(e: Event) => e.stopPropagation()}
                                @change=${(e: Event) => this.onSingleSelect(row.rowId, e)}
                              />
                            `
                          : html`
                              <ids-checkbox
                                density="datagrid"
                                .checked=${this.selectedRowIds.has(row.rowId)}
                                arialabel=${`Select row ${row.rowId}`}
                                .showLabel=${false}
                                @checked-change=${(e: CustomEvent<boolean>) =>
                                  this.onMultiSelect(row.rowId, Boolean(e.detail), e)}
                                @click=${(e: Event) => e.stopPropagation()}
                              ></ids-checkbox>
                            `}
                      </div>
                    </td>
                  `
                : nothing}
              ${this.visibleColumns.map(
                (column) => html`
                  <td
                    class="bodyCell"
                    data-align=${ifDefined(column.align === "right" ? "right" : undefined)}
                  >
                    <span class="cellText">${row.cells.get(column.field) ?? ""}</span>
                  </td>
                `,
              )}
              ${this.showSettingsColumn
                ? html`<td class="bodyCell settingsColumn"></td>`
                : nothing}
            </tr>
          `;
        })}
      </tbody>
    `;
  }

  private renderDefaultPagination() {
    return html`
      <ids-pagination
        .currentPage=${this.currentPage}
        .totalPages=${this.resolvedTotalPages}
        .pageSize=${this.activePageSize}
        .pageSizeOptions=${this.resolvedPageSizeOptions}
        background="gray"
        .embeddedInDatagrid=${true}
        @page-change=${(e: CustomEvent<number>) => this.setPage(e.detail)}
        @page-size-change=${(e: CustomEvent<number>) =>
          this.handlePageSizeChange(e.detail)}
      ></ids-pagination>
    `;
  }

  private renderDefaultDetailPanel() {
    const row = this.activeRow;
    return html`
      <ids-detail-panel
        class="detailPanel"
        attachmode="datagrid"
        .isExpanded=${this.detailPanelOpen}
        @expanded-change=${(e: CustomEvent<boolean>) =>
          this.onDetailExpandedChange(Boolean(e.detail))}
      >
        <ids-detail-panel-content>
          <ids-detail-panel-header>
            <ids-detail-panel-title>${this.detailTitle}</ids-detail-panel-title>
            <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
          </ids-detail-panel-header>
          <ids-detail-panel-body>
            ${row
              ? html`
                  <ids-detail-panel-section>
                    ${this.visibleColumns.map(
                      (column) => html`
                        <ids-detail-panel-field label=${`${column.title}:`}>
                          ${row.cells.get(column.field) ?? ""}
                        </ids-detail-panel-field>
                      `,
                    )}
                  </ids-detail-panel-section>
                `
              : html`
                  <ids-detail-panel-block>
                    Select a row to view details.
                  </ids-detail-panel-block>
                `}
          </ids-detail-panel-body>
        </ids-detail-panel-content>
        <ids-detail-panel-collapsed-rail>
          <ids-detail-panel-toggle-button></ids-detail-panel-toggle-button>
        </ids-detail-panel-collapsed-rail>
      </ids-detail-panel>
    `;
  }

  override render() {
    const tableStyle = styleMap({
      width: "100%",
      minWidth: `${this.minTableWidthPx}px`,
    });
    const headerStyled = this.headerColorAndBorder ? "true" : "false";

    return html`
      <div hidden class="ids-datagrid-slots">
        <slot @slotchange=${() => this.refreshProjectedChildren()}></slot>
      </div>
      <div
        class="shell"
        data-with-detail-panel=${this.hasDetailPanel ? "true" : nothing}
        data-header-styled=${headerStyled}
      >
        <div class="contentRow">
          <div class="gridWrap">
            <div class="gridScrollHost">
              <div class="headerBand">
                <div class="headerBandTrack">
                  <table
                    class="grid"
                    data-header-styled=${headerStyled}
                    style=${tableStyle}
                  >
                    ${this.renderColgroup()}
                    ${this.renderHeader()}
                  </table>
                </div>
              </div>
              <div class="bodyViewport" @scroll=${() => this.syncHeaderScroll()}>
                <div class="bodyContent">
                  <table
                    class="grid"
                    data-header-styled=${headerStyled}
                    style=${tableStyle}
                  >
                    ${this.renderColgroup()}
                    ${this.renderBody()}
                  </table>
                </div>
              </div>
            </div>
            <div class="footer" data-ids="ids-datagrid-footer">
              ${this.hasFooterSlot
                ? html`<slot name="footer"></slot>`
                : this.renderDefaultPagination()}
            </div>
          </div>
          ${this.hasDetailPanel
            ? html`
                <div class="detailPanelHost" data-ids="ids-datagrid-detail-panel-slot">
                  ${this.hasDetailSlot
                    ? html`<slot name="detail-panel"></slot>`
                    : this.renderDefaultDetailPanel()}
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ids-datagrid": IdsDatagrid;
  }
}
