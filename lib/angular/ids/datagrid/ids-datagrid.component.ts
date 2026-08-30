import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  DATAGRID_SPEC_ACCURATE_DEFAULTS,
  type DatagridSelectionMode,
} from "@component-contracts/ids/datagrid.contract";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IdsPaginationComponent } from "../pagination/ids-pagination.component";
import {
  IDS_DATAGRID_CONTEXT,
  type IdsDatagridColumnModel,
  type IdsDatagridContext,
  type IdsDatagridRowModel,
} from "./ids-datagrid-context";
import { IdsDatagridColumnComponent } from "./ids-datagrid-column.component";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import { IdsDatagridFooterComponent } from "./ids-datagrid-footer.component";
import { IdsDatagridDetailPanelComponent } from "./ids-datagrid-detail-panel.component";
import {
  DATAGRID_DEFAULT_MIN_WIDTH,
  DATAGRID_SELECTION_COL_WIDTH,
  DATAGRID_SETTINGS_COL_WIDTH,
  IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR,
  canHideColumn,
  columnBaseWidthPx,
  getHideableColumns,
  isColumnVisible,
  nextSortDirection,
  resolvedColumnWidthPx,
  sortRows,
  tableMinWidthPxForColumns,
  type SortDirection,
} from "./ids-datagrid.utils";
import { IdsDatagridColumnVisibilityPanelComponent } from "./ids-datagrid-column-visibility-panel.component";

@Component({
  selector: "ids-datagrid",
  standalone: true,
  imports: [
    CommonModule,
    IdsIconComponent,
    IdsPaginationComponent,
    IdsDatagridColumnVisibilityPanelComponent,
  ],
  templateUrl: "./ids-datagrid.component.html",
  styleUrl: "./ids-datagrid.component.scss",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: IDS_DATAGRID_CONTEXT, useExisting: IdsDatagridComponent }],
})
export class IdsDatagridComponent implements AfterContentInit, OnDestroy, IdsDatagridContext {
  readonly selectionColWidth = DATAGRID_SELECTION_COL_WIDTH;
  readonly settingsColWidth = DATAGRID_SETTINGS_COL_WIDTH;
  readonly selectionGroupName = `ids-datagrid-selection-${Math.random().toString(36).slice(2)}`;

  @ContentChildren(IdsDatagridColumnComponent) columnQuery!: QueryList<IdsDatagridColumnComponent>;
  @ContentChildren(IdsDatagridRowComponent, { descendants: true })
  rowQuery!: QueryList<IdsDatagridRowComponent>;
  @ContentChild(IdsDatagridFooterComponent) footerSlot?: IdsDatagridFooterComponent;
  @ContentChild(IdsDatagridDetailPanelComponent) detailPanelSlot?: IdsDatagridDetailPanelComponent;

  @ViewChild("bodyViewport") bodyViewport?: ElementRef<HTMLElement>;
  @ViewChild("headerTrack") headerTrack?: ElementRef<HTMLElement>;
  @ViewChild("settingsAnchor") settingsAnchor?: ElementRef<HTMLElement>;
  @ViewChild("filterMenuLayer") filterMenuLayer?: ElementRef<HTMLElement>;
  @ViewChild("settingsMenuLayer") settingsMenuLayer?: ElementRef<HTMLElement>;

  @Input() rowSelection = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowSelection;
  @Input() selectionMode: DatagridSelectionMode = DATAGRID_SPEC_ACCURATE_DEFAULTS.selectionMode;
  @Input() showSingleSelectionRadio = DATAGRID_SPEC_ACCURATE_DEFAULTS.showSingleSelectionRadio;
  @Input() withDetailPanel = DATAGRID_SPEC_ACCURATE_DEFAULTS.withDetailPanel;
  @Input() pageSize = DATAGRID_SPEC_ACCURATE_DEFAULTS.pageSize;
  /** When set, drives footer pagination visibility and page count (server-side). Omit for client slice from `rows`. */
  @Input() totalPages: number | null = null;
  @Input() readOnly = DATAGRID_SPEC_ACCURATE_DEFAULTS.readOnly;
  @Input() rowVerticalIndicator = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowVerticalIndicator;
  @Input() headerColorAndBorder = DATAGRID_SPEC_ACCURATE_DEFAULTS.headerColorAndBorder;
  @Input() columnResizeEnabled = DATAGRID_SPEC_ACCURATE_DEFAULTS.columnResizeEnabled;

  columns: IdsDatagridColumnModel[] = [];
  rows: IdsDatagridRowModel[] = [];

  sortKey: string | null = null;
  sortDirection: SortDirection = null;
  openFilterField: string | null = null;
  filterMenuPos: { top: number; right: number } | null = null;
  settingsMenuOpen = false;
  settingsMenuPos: { top: number; right: number } | null = null;
  columnVisibilityValidation: string | null = null;
  hiddenColumnKeys = new Set<string>();
  columnWidths: Record<string, number> = {};
  growColPinnedWidthPx: number | null = null;
  selectedRowId: string | null = null;
  activeRowId: string | null = null;
  detailPanelOpen = false;
  currentPage = 1;

  private readonly columnRegistry = new Map<string, IdsDatagridColumnModel>();
  private readonly rowRegistry = new Map<string, IdsDatagridRowModel>();
  private resizeActive = false;
  private growResizeLatestWidth: number | null = null;
  private filterAnchorEl: HTMLElement | null = null;
  private overlayRepositionCleanup: (() => void) | null = null;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  get showSelectionColumn(): boolean {
    return (
      this.rowSelection &&
      (this.selectionMode === "multiple" ||
        (this.selectionMode === "single" && this.showSingleSelectionRadio))
    );
  }

  get visibleColumns(): IdsDatagridColumnModel[] {
    return this.columns.filter((column) => isColumnVisible(column, this.hiddenColumnKeys));
  }

  get hideableColumns(): IdsDatagridColumnModel[] {
    return getHideableColumns(this.columns);
  }

  get growColumnField(): string | null {
    const visible = this.visibleColumns;
    return visible.length > 0 ? visible[visible.length - 1].field : null;
  }

  get minTableWidthPx(): number {
    return tableMinWidthPxForColumns(
      this.visibleColumns,
      this.showSelectionColumn,
      this.columnWidths,
      this.growColumnField,
      this.growColPinnedWidthPx,
    );
  }

  get sortedRows(): IdsDatagridRowModel[] {
    return sortRows(this.rows, this.sortKey, this.sortDirection);
  }

  get resolvedTotalPages(): number {
    if (this.totalPages != null && Number.isFinite(this.totalPages)) {
      return Math.max(1, Math.trunc(this.totalPages));
    }
    if (!this.pageSize || this.pageSize <= 0) {
      return 1;
    }
    return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
  }

  get hasDetailPanel(): boolean {
    return this.withDetailPanel || Boolean(this.detailPanelSlot);
  }

  get hasFooterSlot(): boolean {
    return Boolean(this.footerSlot);
  }

  get showPagination(): boolean {
    if (this.totalPages != null && Number.isFinite(this.totalPages)) {
      return this.totalPages > 1;
    }
    if (!this.pageSize || this.pageSize <= 0) {
      return false;
    }
    return this.sortedRows.length > this.pageSize;
  }

  get pagedRows(): IdsDatagridRowModel[] {
    if (!this.showPagination) {
      return this.sortedRows;
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedRows.slice(start, start + this.pageSize);
  }

  get activeRow(): IdsDatagridRowModel | null {
    if (!this.activeRowId) return null;
    return this.rows.find((row) => row.rowId === this.activeRowId) ?? null;
  }

  get detailTitle(): string {
    if (!this.activeRow) return "Details";
    return this.activeRow.cells.get("name") ?? "Details";
  }

  get openFilterTitle(): string {
    return this.columns.find((col) => col.field === this.openFilterField)?.title ?? "";
  }

  get openFilterTemplate() {
    return this.columns.find((col) => col.field === this.openFilterField)?.filterTemplate ?? null;
  }

  ngAfterContentInit(): void {
    this.columnQuery.changes.subscribe(() => {
      for (const column of this.columnQuery.toArray()) {
        column.syncRegistration();
      }
    });
    this.rowQuery.changes.subscribe(() => this.syncModels());
    this.syncModels();
  }

  ngOnDestroy(): void {
    this.unbindOverlayRepositionListeners();
    this.closeFilter();
    this.closeSettingsMenu();
  }

  registerColumn(column: IdsDatagridColumnModel): void {
    this.columnRegistry.set(column.field, column);
    this.syncModels();
  }

  unregisterColumn(field: string): void {
    this.columnRegistry.delete(field);
    this.syncModels();
  }

  registerRow(row: IdsDatagridRowModel): void {
    this.rowRegistry.set(row.rowId, row);
    this.syncModels();
  }

  unregisterRow(rowId: string): void {
    this.rowRegistry.delete(rowId);
    this.syncModels();
  }

  setRowCell(rowId: string, field: string, value: string): void {
    const row = this.rowRegistry.get(rowId);
    if (!row) return;
    row.cells.set(field, value);
    this.syncModels();
  }

  columnWidth(column: IdsDatagridColumnModel): number | null {
    if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx == null) {
      return null;
    }
    if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx != null) {
      return this.growColPinnedWidthPx;
    }
    return resolvedColumnWidthPx(column, this.columnWidths);
  }

  isGrowColumn(field: string): boolean {
    return field === this.growColumnField;
  }

  toggleSort(field: string): void {
    this.sortDirection = nextSortDirection(this.sortKey, field, this.sortDirection);
    this.sortKey = this.sortDirection ? field : null;
    this.cdr.markForCheck();
  }

  onFilterPress(field: string, anchor: HTMLElement, event: Event): void {
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
    this.cdr.markForCheck();
    this.scheduleOverlayPortalAndPosition("filter");
  }

  closeFilter(): void {
    if (!this.settingsMenuOpen) {
      this.unbindOverlayRepositionListeners();
    }
    this.filterAnchorEl = null;
    this.openFilterField = null;
    this.filterMenuPos = null;
    this.cdr.markForCheck();
  }

  closeSettingsMenu(): void {
    this.settingsMenuOpen = false;
    this.settingsMenuPos = null;
    this.columnVisibilityValidation = null;
    if (!this.openFilterField) {
      this.unbindOverlayRepositionListeners();
    }
    this.cdr.markForCheck();
  }

  toggleSettingsMenu(event: Event): void {
    event.stopPropagation();
    if (this.hideableColumns.length === 0) return;
    this.closeFilter();
    this.settingsMenuOpen = !this.settingsMenuOpen;
    if (this.settingsMenuOpen) {
      this.updateSettingsMenuPos();
      this.bindOverlayRepositionListeners();
      this.scheduleOverlayPortalAndPosition("settings");
    } else {
      this.closeSettingsMenu();
    }
    this.cdr.markForCheck();
  }

  onColumnVisibilityChange(field: string, visible: boolean): void {
    if (!visible && !canHideColumn(field, this.columns, this.hiddenColumnKeys)) {
      this.columnVisibilityValidation = IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR;
      this.cdr.markForCheck();
      return;
    }
    this.columnVisibilityValidation = null;
    const next = new Set(this.hiddenColumnKeys);
    if (visible) {
      next.delete(field);
    } else {
      next.add(field);
    }
    this.hiddenColumnKeys = next;
    if (this.openFilterField && !this.visibleColumns.some((col) => col.field === this.openFilterField)) {
      this.closeFilter();
    }
    this.cdr.markForCheck();
  }

  startColumnResize(field: string, event: PointerEvent): void {
    if (!this.columnResizeEnabled || this.resizeActive) return;
    event.preventDefault();
    event.stopPropagation();
    const column = this.columns.find((col) => col.field === field);
    const min = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column?.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
    const startW = this.columnWidths[field] ?? min;
    const startX = event.clientX;
    this.resizeActive = true;
    const target = event.currentTarget as HTMLElement | null;
    target?.setPointerCapture(event.pointerId);

    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const next = Math.min(640, Math.max(min, startW + delta));
      if (this.growColumnField === field) {
        this.growResizeLatestWidth = next;
      }
      this.columnWidths = { ...this.columnWidths, [field]: next };
      this.cdr.markForCheck();
    };

    const onUp = (ev: PointerEvent) => {
      this.resizeActive = false;
      if (this.growColumnField === field && typeof this.growResizeLatestWidth === "number") {
        this.growColPinnedWidthPx = this.growResizeLatestWidth;
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
      this.cdr.markForCheck();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  private updateSettingsMenuPos(): void {
    const anchor = this.settingsAnchor?.nativeElement;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    this.settingsMenuPos = {
      top: rect.bottom,
      right: document.documentElement.clientWidth - rect.right,
    };
  }

  private updateFilterMenuPos(): void {
    const anchor = this.filterAnchorEl;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    this.filterMenuPos = {
      top: rect.top + 5,
      right: document.documentElement.clientWidth - rect.right,
    };
  }

  private portalToBody(el: HTMLElement | undefined): void {
    if (el && el.parentElement !== document.body) {
      document.body.appendChild(el);
    }
  }

  private scheduleOverlayPortalAndPosition(kind: "filter" | "settings"): void {
    requestAnimationFrame(() => {
      if (kind === "filter" && !this.openFilterField) return;
      if (kind === "settings" && !this.settingsMenuOpen) return;

      if (kind === "filter") {
        this.portalToBody(this.filterMenuLayer?.nativeElement);
        this.updateFilterMenuPos();
      } else {
        this.portalToBody(this.settingsMenuLayer?.nativeElement);
        this.updateSettingsMenuPos();
      }
      this.cdr.markForCheck();

      requestAnimationFrame(() => {
        if (kind === "filter" && !this.openFilterField) return;
        if (kind === "settings" && !this.settingsMenuOpen) return;
        if (kind === "filter") {
          this.updateFilterMenuPos();
        } else {
          this.updateSettingsMenuPos();
        }
        this.cdr.markForCheck();
      });
    });
  }

  private bindOverlayRepositionListeners(): void {
    if (this.overlayRepositionCleanup) return;
    const onUpdate = () => {
      let changed = false;
      if (this.openFilterField) {
        this.updateFilterMenuPos();
        changed = true;
      }
      if (this.settingsMenuOpen) {
        this.updateSettingsMenuPos();
        changed = true;
      }
      if (changed) this.cdr.markForCheck();
    };
    window.addEventListener("resize", onUpdate);
    window.addEventListener("scroll", onUpdate, true);
    const bodyViewport = this.bodyViewport?.nativeElement;
    const headerTrack = this.headerTrack?.nativeElement;
    bodyViewport?.addEventListener("scroll", onUpdate);
    headerTrack?.addEventListener("scroll", onUpdate);
    this.overlayRepositionCleanup = () => {
      window.removeEventListener("resize", onUpdate);
      window.removeEventListener("scroll", onUpdate, true);
      bodyViewport?.removeEventListener("scroll", onUpdate);
      headerTrack?.removeEventListener("scroll", onUpdate);
      this.overlayRepositionCleanup = null;
    };
  }

  private unbindOverlayRepositionListeners(): void {
    this.overlayRepositionCleanup?.();
    this.overlayRepositionCleanup = null;
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
      if (next[column.field] == null) {
        next[column.field] = base;
      }
      next[column.field] = Math.max(floor, next[column.field] ?? base);
    }
    for (const field of Object.keys(next)) {
      if (!this.columns.some((column) => column.field === field)) {
        delete next[field];
      }
    }
    this.columnWidths = next;
  }

  private syncHiddenColumnKeys(): void {
    const allowed = new Set(this.hideableColumns.map((column) => column.field));
    const next = new Set([...this.hiddenColumnKeys].filter((field) => allowed.has(field)));
    this.hiddenColumnKeys = next;
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.closeFilter();
    this.closeSettingsMenu();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (this.openFilterField) {
      if (!target.closest("[data-ids-datagrid-filter-menu]") && !target.closest(".filterAnchor")) {
        this.closeFilter();
      }
    }
    if (this.settingsMenuOpen) {
      if (
        !target.closest("[data-ids-datagrid-settings-menu]") &&
        !this.settingsAnchor?.nativeElement.contains(target)
      ) {
        this.closeSettingsMenu();
      }
    }
  }

  @HostListener("window:resize")
  @HostListener("window:scroll")
  onViewportChange(): void {
    if (this.openFilterField) {
      this.updateFilterMenuPos();
    }
    if (this.settingsMenuOpen) {
      this.updateSettingsMenuPos();
    }
    this.cdr.markForCheck();
  }

  syncHeaderScroll(): void {
    const body = this.bodyViewport?.nativeElement;
    const header = this.headerTrack?.nativeElement;
    if (!body || !header) return;
    header.scrollLeft = body.scrollLeft;
  }

  onRowClick(rowId: string): void {
    if (this.hasDetailPanel) {
      if (this.activeRowId === rowId && this.detailPanelOpen) {
        this.detailPanelOpen = false;
        this.activeRowId = null;
      } else {
        this.activeRowId = rowId;
        this.detailPanelOpen = true;
      }
    } else {
      this.activeRowId = rowId;
    }
    this.cdr.markForCheck();
  }

  onDetailPanelExpandedChange(expanded: boolean): void {
    this.detailPanelOpen = expanded;
    if (!expanded) {
      this.activeRowId = null;
    }
    this.cdr.markForCheck();
  }

  onSingleSelect(rowId: string): void {
    this.selectedRowId = rowId;
    this.cdr.markForCheck();
  }

  isRowSelected(rowId: string): boolean {
    return this.selectedRowId === rowId || this.activeRowId === rowId;
  }

  setPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.resolvedTotalPages);
    this.cdr.markForCheck();
  }

  private bindProjectedChildren(): void {
    this.syncModels();
  }

  private syncModels(): void {
    this.columns = [...this.columnRegistry.values()];
    this.rows = [...this.rowRegistry.values()];
    this.syncColumnWidths();
    this.syncHiddenColumnKeys();
    if (this.currentPage > this.resolvedTotalPages) {
      this.currentPage = this.resolvedTotalPages;
    }
    this.cdr.markForCheck();
  }
}
