import { ChangeDetectionStrategy, Component, ContentChildren, HostListener, Input, ViewChild, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DATAGRID_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/datagrid.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IdsPaginationComponent } from "../ids-pagination/ids-pagination.component";
import { IDS_DETAIL_PANEL_IMPORTS } from "../ids-detail-panel/ids-detail-panel.imports";
import { IDS_DATAGRID_CONTEXT, } from "./ids-datagrid-context";
import { IdsDatagridColumnComponent } from "./ids-datagrid-column.component";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import { DATAGRID_DEFAULT_MIN_WIDTH, DATAGRID_SELECTION_COL_WIDTH, DATAGRID_SETTINGS_COL_WIDTH, IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR, canHideColumn, columnBaseWidthPx, getHideableColumns, isColumnVisible, nextSortDirection, resolvedColumnWidthPx, sortRows, tableMinWidthPxForColumns, } from "./ids-datagrid.utils";
import { IdsDatagridColumnVisibilityPanelComponent } from "./ids-datagrid-column-visibility-panel.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../ids-detail-panel/ids-detail-panel.component";
import * as i3 from "../ids-detail-panel/ids-detail-panel-header.component";
import * as i4 from "../ids-detail-panel/ids-detail-panel-body.component";
const _c0 = ["bodyViewport"];
const _c1 = ["headerTrack"];
const _c2 = ["settingsAnchor"];
const _c3 = ["filterMenuLayer"];
const _c4 = ["settingsMenuLayer"];
const _forTrack0 = ($index, $item) => $item.field;
const _forTrack1 = ($index, $item) => $item.rowId;
function IdsDatagridComponent_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "col");
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", ctx_r0.selectionColWidth, "px");
} }
function IdsDatagridComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "col");
} if (rf & 2) {
    const column_r2 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", ctx_r0.columnWidth(column_r2), "px");
    i0.ɵɵclassProp("tableGrowCol", ctx_r0.isGrowColumn(column_r2.field) && ctx_r0.growColPinnedWidthPx == null);
} }
function IdsDatagridComponent_Conditional_15_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "th", 28);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("headerColorBand", ctx_r0.headerColorAndBorder);
} }
function IdsDatagridComponent_For_17_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function IdsDatagridComponent_For_17_Conditional_6_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r5); const column_r4 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.toggleSort(column_r4.field)); });
    i0.ɵɵelement(1, "ids-icon", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("data-sorted", ctx_r0.sortKey === column_r4.field ? "true" : null)("aria-label", "Sort by " + column_r4.title);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r0.sortKey === column_r4.field && ctx_r0.sortDirection === "desc" ? "col-sort-down-16" : "col-sort-up-16")("size", 12);
} }
function IdsDatagridComponent_For_17_Conditional_7_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function IdsDatagridComponent_For_17_Conditional_7_Conditional_2_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r6); i0.ɵɵnextContext(); const filterAnchor_r7 = i0.ɵɵreference(1); const column_r4 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onFilterPress(column_r4.field, filterAnchor_r7, $event)); });
    i0.ɵɵelement(1, "ids-icon", 43);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r4 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("data-filter-active", column_r4.filterActive ? "true" : null)("aria-expanded", ctx_r0.openFilterField === column_r4.field)("aria-label", "Filter " + column_r4.title);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", column_r4.filterActive ? "filter-solid" : "filter")("size", 14);
} }
function IdsDatagridComponent_For_17_Conditional_7_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 41);
} }
function IdsDatagridComponent_For_17_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 35, 3);
    i0.ɵɵconditionalCreate(2, IdsDatagridComponent_For_17_Conditional_7_Conditional_2_Template, 2, 5, "button", 40)(3, IdsDatagridComponent_For_17_Conditional_7_Conditional_3_Template, 1, 0, "div", 41);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.openFilterField !== column_r4.field ? 2 : 3);
} }
function IdsDatagridComponent_For_17_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 44);
    i0.ɵɵlistener("pointerdown", function IdsDatagridComponent_For_17_Conditional_9_Template_button_pointerdown_0_listener($event) { i0.ɵɵrestoreView(_r8); const column_r4 = i0.ɵɵnextContext().$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.startColumnResize(column_r4.field, $event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵattribute("aria-label", "Resize " + column_r4.title + " column");
} }
function IdsDatagridComponent_For_17_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "th", 29)(1, "div", 30)(2, "div", 31)(3, "button", 32);
    i0.ɵɵlistener("click", function IdsDatagridComponent_For_17_Template_button_click_3_listener() { const column_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(column_r4.sortable ? ctx_r0.toggleSort(column_r4.field) : null); });
    i0.ɵɵelementStart(4, "span", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(6, IdsDatagridComponent_For_17_Conditional_6_Template, 2, 4, "button", 34);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(7, IdsDatagridComponent_For_17_Conditional_7_Template, 4, 1, "div", 35);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "span", 36);
    i0.ɵɵconditionalCreate(9, IdsDatagridComponent_For_17_Conditional_9_Template, 1, 1, "button", 37);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("headerColorBand", ctx_r0.headerColorAndBorder);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("title", column_r4.title);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(column_r4.title);
    i0.ɵɵadvance();
    i0.ɵɵconditional(column_r4.sortable ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(column_r4.filterable ? 7 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.columnResizeEnabled ? 9 : -1);
} }
function IdsDatagridComponent_Conditional_28_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "col");
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", ctx_r0.selectionColWidth, "px");
} }
function IdsDatagridComponent_For_30_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "col");
} if (rf & 2) {
    const column_r9 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("width", ctx_r0.columnWidth(column_r9), "px");
    i0.ɵɵclassProp("tableGrowCol", ctx_r0.isGrowColumn(column_r9.field) && ctx_r0.growColPinnedWidthPx == null);
} }
function IdsDatagridComponent_For_34_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 51);
    i0.ɵɵlistener("click", function IdsDatagridComponent_For_34_Conditional_1_Conditional_2_Template_input_click_0_listener($event) { return $event.stopPropagation(); })("change", function IdsDatagridComponent_For_34_Conditional_1_Conditional_2_Template_input_change_0_listener() { i0.ɵɵrestoreView(_r12); const row_r11 = i0.ɵɵnextContext(2).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onSingleSelect(row_r11.rowId)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r11 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("name", ctx_r0.selectionGroupName)("value", row_r11.rowId)("checked", ctx_r0.selectedRowId === row_r11.rowId);
    i0.ɵɵattribute("aria-label", "Select row " + row_r11.rowId);
} }
function IdsDatagridComponent_For_34_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 46)(1, "div", 49);
    i0.ɵɵconditionalCreate(2, IdsDatagridComponent_For_34_Conditional_1_Conditional_2_Template, 1, 4, "input", 50);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.selectionMode === "single" ? 2 : -1);
} }
function IdsDatagridComponent_For_34_For_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 47)(1, "span", 52);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const column_r13 = ctx.$implicit;
    const row_r11 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(row_r11.cells.get(column_r13.field));
} }
function IdsDatagridComponent_For_34_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "tr", 45);
    i0.ɵɵlistener("click", function IdsDatagridComponent_For_34_Template_tr_click_0_listener() { const row_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onRowClick(row_r11.rowId)); });
    i0.ɵɵconditionalCreate(1, IdsDatagridComponent_For_34_Conditional_1_Template, 3, 1, "td", 46);
    i0.ɵɵrepeaterCreate(2, IdsDatagridComponent_For_34_For_3_Template, 3, 1, "td", 47, _forTrack0);
    i0.ɵɵelement(4, "td", 48);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r11 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("data-selected", ctx_r0.isRowSelected(row_r11.rowId) ? "true" : null)("data-readonly", ctx_r0.readOnly ? "true" : null)("data-vertical-indicator", ctx_r0.rowVerticalIndicator ? "true" : null);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showSelectionColumn ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.visibleColumns);
} }
function IdsDatagridComponent_Conditional_35_Template(rf, ctx) { if (rf & 1) {
    const _r14 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 24)(1, "ids-pagination", 53);
    i0.ɵɵlistener("pageChange", function IdsDatagridComponent_Conditional_35_Template_ids_pagination_pageChange_1_listener($event) { i0.ɵɵrestoreView(_r14); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.setPage($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("currentPage", ctx_r0.currentPage)("totalPages", ctx_r0.resolvedTotalPages)("embeddedInDatagrid", true);
} }
function IdsDatagridComponent_Conditional_36_Conditional_5_For_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p")(1, "b");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r16 = ctx.$implicit;
    const row_r17 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1("", column_r16.title, ":");
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", row_r17.cells.get(column_r16.field));
} }
function IdsDatagridComponent_Conditional_36_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, IdsDatagridComponent_Conditional_36_Conditional_5_For_1_Template, 4, 2, "p", null, _forTrack0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵrepeater(ctx_r0.visibleColumns);
} }
function IdsDatagridComponent_Conditional_36_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p");
    i0.ɵɵtext(1, "Select a row to view details.");
    i0.ɵɵelementEnd();
} }
function IdsDatagridComponent_Conditional_36_Template(rf, ctx) { if (rf & 1) {
    const _r15 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-detail-panel", 54);
    i0.ɵɵlistener("expandedChange", function IdsDatagridComponent_Conditional_36_Template_ids_detail_panel_expandedChange_0_listener($event) { i0.ɵɵrestoreView(_r15); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onDetailPanelExpandedChange($event)); });
    i0.ɵɵelementStart(1, "ids-detail-panel-header");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "ids-detail-panel-body")(4, "div", 55);
    i0.ɵɵconditionalCreate(5, IdsDatagridComponent_Conditional_36_Conditional_5_Template, 2, 0)(6, IdsDatagridComponent_Conditional_36_Conditional_6_Template, 2, 0, "p");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    let tmp_6_0;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("expanded", ctx_r0.detailPanelOpen);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.detailTitle);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional((tmp_6_0 = ctx_r0.activeRow) ? 5 : 6, tmp_6_0);
} }
function IdsDatagridComponent_Conditional_37_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0, 61);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("ngTemplateOutlet", ctx_r0.openFilterTemplate);
} }
function IdsDatagridComponent_Conditional_37_Template(rf, ctx) { if (rf & 1) {
    const _r18 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 56, 4);
    i0.ɵɵlistener("click", function IdsDatagridComponent_Conditional_37_Template_div_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementStart(2, "button", 57);
    i0.ɵɵlistener("click", function IdsDatagridComponent_Conditional_37_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r18); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closeFilter()); });
    i0.ɵɵelement(3, "ids-icon", 58);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 59)(5, "div", 60);
    i0.ɵɵconditionalCreate(6, IdsDatagridComponent_Conditional_37_Conditional_6_Template, 1, 1, "ng-container", 61);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("position", "fixed")("top", ctx_r0.filterMenuPos.top, "px")("right", ctx_r0.filterMenuPos.right, "px");
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", "Filter " + ctx_r0.openFilterTitle);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 14);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.openFilterTemplate ? 6 : -1);
} }
function IdsDatagridComponent_Conditional_38_Template(rf, ctx) { if (rf & 1) {
    const _r19 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 62, 5);
    i0.ɵɵlistener("click", function IdsDatagridComponent_Conditional_38_Template_div_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementStart(2, "div", 63)(3, "div", 64)(4, "ids-datagrid-column-visibility-panel", 65);
    i0.ɵɵlistener("columnVisibilityChange", function IdsDatagridComponent_Conditional_38_Template_ids_datagrid_column_visibility_panel_columnVisibilityChange_4_listener($event) { i0.ɵɵrestoreView(_r19); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onColumnVisibilityChange($event.field, $event.visible)); });
    i0.ɵɵelementEnd()()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("position", "fixed")("top", ctx_r0.settingsMenuPos.top, "px")("right", ctx_r0.settingsMenuPos.right, "px");
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("hideableColumns", ctx_r0.hideableColumns)("hiddenColumnKeys", ctx_r0.hiddenColumnKeys)("validationMessage", ctx_r0.columnVisibilityValidation);
} }
export class IdsDatagridComponent {
    cdr;
    selectionColWidth = DATAGRID_SELECTION_COL_WIDTH;
    settingsColWidth = DATAGRID_SETTINGS_COL_WIDTH;
    selectionGroupName = `ids-datagrid-selection-${Math.random().toString(36).slice(2)}`;
    columnQuery;
    rowQuery;
    bodyViewport;
    headerTrack;
    settingsAnchor;
    filterMenuLayer;
    settingsMenuLayer;
    rowSelection = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowSelection;
    selectionMode = DATAGRID_SPEC_ACCURATE_DEFAULTS.selectionMode;
    showSingleSelectionRadio = DATAGRID_SPEC_ACCURATE_DEFAULTS.showSingleSelectionRadio;
    withDetailPanel = DATAGRID_SPEC_ACCURATE_DEFAULTS.withDetailPanel;
    pageSize = DATAGRID_SPEC_ACCURATE_DEFAULTS.pageSize;
    /** When set, drives footer pagination visibility and page count (server-side). Omit for client slice from `rows`. */
    totalPages = null;
    readOnly = DATAGRID_SPEC_ACCURATE_DEFAULTS.readOnly;
    rowVerticalIndicator = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowVerticalIndicator;
    headerColorAndBorder = DATAGRID_SPEC_ACCURATE_DEFAULTS.headerColorAndBorder;
    columnResizeEnabled = DATAGRID_SPEC_ACCURATE_DEFAULTS.columnResizeEnabled;
    columns = [];
    rows = [];
    sortKey = null;
    sortDirection = null;
    openFilterField = null;
    filterMenuPos = null;
    settingsMenuOpen = false;
    settingsMenuPos = null;
    columnVisibilityValidation = null;
    hiddenColumnKeys = new Set();
    columnWidths = {};
    growColPinnedWidthPx = null;
    selectedRowId = null;
    activeRowId = null;
    detailPanelOpen = false;
    currentPage = 1;
    columnRegistry = new Map();
    rowRegistry = new Map();
    resizeActive = false;
    growResizeLatestWidth = null;
    filterAnchorEl = null;
    overlayRepositionCleanup = null;
    constructor(cdr) {
        this.cdr = cdr;
    }
    get showSelectionColumn() {
        return (this.rowSelection &&
            (this.selectionMode === "multiple" ||
                (this.selectionMode === "single" && this.showSingleSelectionRadio)));
    }
    get visibleColumns() {
        return this.columns.filter((column) => isColumnVisible(column, this.hiddenColumnKeys));
    }
    get hideableColumns() {
        return getHideableColumns(this.columns);
    }
    get growColumnField() {
        const visible = this.visibleColumns;
        return visible.length > 0 ? visible[visible.length - 1].field : null;
    }
    get minTableWidthPx() {
        return tableMinWidthPxForColumns(this.visibleColumns, this.showSelectionColumn, this.columnWidths, this.growColumnField, this.growColPinnedWidthPx);
    }
    get sortedRows() {
        return sortRows(this.rows, this.sortKey, this.sortDirection);
    }
    get resolvedTotalPages() {
        if (this.totalPages != null && Number.isFinite(this.totalPages)) {
            return Math.max(1, Math.trunc(this.totalPages));
        }
        if (!this.pageSize || this.pageSize <= 0) {
            return 1;
        }
        return Math.max(1, Math.ceil(this.sortedRows.length / this.pageSize));
    }
    get showPagination() {
        if (this.totalPages != null && Number.isFinite(this.totalPages)) {
            return this.totalPages > 1;
        }
        if (!this.pageSize || this.pageSize <= 0) {
            return false;
        }
        return this.sortedRows.length > this.pageSize;
    }
    get pagedRows() {
        if (!this.showPagination) {
            return this.sortedRows;
        }
        const start = (this.currentPage - 1) * this.pageSize;
        return this.sortedRows.slice(start, start + this.pageSize);
    }
    get activeRow() {
        if (!this.activeRowId)
            return null;
        return this.rows.find((row) => row.rowId === this.activeRowId) ?? null;
    }
    get detailTitle() {
        if (!this.activeRow)
            return "Details";
        return this.activeRow.cells.get("name") ?? "Details";
    }
    get openFilterTitle() {
        return this.columns.find((col) => col.field === this.openFilterField)?.title ?? "";
    }
    get openFilterTemplate() {
        return this.columns.find((col) => col.field === this.openFilterField)?.filterTemplate ?? null;
    }
    ngAfterContentInit() {
        this.columnQuery.changes.subscribe(() => {
            for (const column of this.columnQuery.toArray()) {
                column.syncRegistration();
            }
        });
        this.rowQuery.changes.subscribe(() => this.syncModels());
        this.syncModels();
    }
    ngOnDestroy() {
        this.unbindOverlayRepositionListeners();
        this.closeFilter();
        this.closeSettingsMenu();
    }
    registerColumn(column) {
        this.columnRegistry.set(column.field, column);
        this.syncModels();
    }
    unregisterColumn(field) {
        this.columnRegistry.delete(field);
        this.syncModels();
    }
    registerRow(row) {
        this.rowRegistry.set(row.rowId, row);
        this.syncModels();
    }
    unregisterRow(rowId) {
        this.rowRegistry.delete(rowId);
        this.syncModels();
    }
    setRowCell(rowId, field, value) {
        const row = this.rowRegistry.get(rowId);
        if (!row)
            return;
        row.cells.set(field, value);
        this.syncModels();
    }
    columnWidth(column) {
        if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx == null) {
            return null;
        }
        if (this.isGrowColumn(column.field) && this.growColPinnedWidthPx != null) {
            return this.growColPinnedWidthPx;
        }
        return resolvedColumnWidthPx(column, this.columnWidths);
    }
    isGrowColumn(field) {
        return field === this.growColumnField;
    }
    toggleSort(field) {
        this.sortDirection = nextSortDirection(this.sortKey, field, this.sortDirection);
        this.sortKey = this.sortDirection ? field : null;
        this.cdr.markForCheck();
    }
    onFilterPress(field, anchor, event) {
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
    closeFilter() {
        if (!this.settingsMenuOpen) {
            this.unbindOverlayRepositionListeners();
        }
        this.filterAnchorEl = null;
        this.openFilterField = null;
        this.filterMenuPos = null;
        this.cdr.markForCheck();
    }
    closeSettingsMenu() {
        this.settingsMenuOpen = false;
        this.settingsMenuPos = null;
        this.columnVisibilityValidation = null;
        if (!this.openFilterField) {
            this.unbindOverlayRepositionListeners();
        }
        this.cdr.markForCheck();
    }
    toggleSettingsMenu(event) {
        event.stopPropagation();
        if (this.hideableColumns.length === 0)
            return;
        this.closeFilter();
        this.settingsMenuOpen = !this.settingsMenuOpen;
        if (this.settingsMenuOpen) {
            this.updateSettingsMenuPos();
            this.bindOverlayRepositionListeners();
            this.scheduleOverlayPortalAndPosition("settings");
        }
        else {
            this.closeSettingsMenu();
        }
        this.cdr.markForCheck();
    }
    onColumnVisibilityChange(field, visible) {
        if (!visible && !canHideColumn(field, this.columns, this.hiddenColumnKeys)) {
            this.columnVisibilityValidation = IDS_DATAGRID_COLUMN_VISIBILITY_MIN_ERROR;
            this.cdr.markForCheck();
            return;
        }
        this.columnVisibilityValidation = null;
        const next = new Set(this.hiddenColumnKeys);
        if (visible) {
            next.delete(field);
        }
        else {
            next.add(field);
        }
        this.hiddenColumnKeys = next;
        if (this.openFilterField && !this.visibleColumns.some((col) => col.field === this.openFilterField)) {
            this.closeFilter();
        }
        this.cdr.markForCheck();
    }
    startColumnResize(field, event) {
        if (!this.columnResizeEnabled || this.resizeActive)
            return;
        event.preventDefault();
        event.stopPropagation();
        const column = this.columns.find((col) => col.field === field);
        const min = Math.max(DATAGRID_DEFAULT_MIN_WIDTH, column?.minWidth ?? DATAGRID_DEFAULT_MIN_WIDTH);
        const startW = this.columnWidths[field] ?? min;
        const startX = event.clientX;
        this.resizeActive = true;
        const target = event.currentTarget;
        target?.setPointerCapture(event.pointerId);
        const onMove = (ev) => {
            const delta = ev.clientX - startX;
            const next = Math.min(640, Math.max(min, startW + delta));
            if (this.growColumnField === field) {
                this.growResizeLatestWidth = next;
            }
            this.columnWidths = { ...this.columnWidths, [field]: next };
            this.cdr.markForCheck();
        };
        const onUp = (ev) => {
            this.resizeActive = false;
            if (this.growColumnField === field && typeof this.growResizeLatestWidth === "number") {
                this.growColPinnedWidthPx = this.growResizeLatestWidth;
            }
            this.growResizeLatestWidth = null;
            try {
                target?.releasePointerCapture(ev.pointerId);
            }
            catch {
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
    updateSettingsMenuPos() {
        const anchor = this.settingsAnchor?.nativeElement;
        if (!anchor)
            return;
        const rect = anchor.getBoundingClientRect();
        this.settingsMenuPos = {
            top: rect.bottom,
            right: document.documentElement.clientWidth - rect.right,
        };
    }
    updateFilterMenuPos() {
        const anchor = this.filterAnchorEl;
        if (!anchor)
            return;
        const rect = anchor.getBoundingClientRect();
        this.filterMenuPos = {
            top: rect.top + 5,
            right: document.documentElement.clientWidth - rect.right,
        };
    }
    portalToBody(el) {
        if (el && el.parentElement !== document.body) {
            document.body.appendChild(el);
        }
    }
    scheduleOverlayPortalAndPosition(kind) {
        requestAnimationFrame(() => {
            if (kind === "filter" && !this.openFilterField)
                return;
            if (kind === "settings" && !this.settingsMenuOpen)
                return;
            if (kind === "filter") {
                this.portalToBody(this.filterMenuLayer?.nativeElement);
                this.updateFilterMenuPos();
            }
            else {
                this.portalToBody(this.settingsMenuLayer?.nativeElement);
                this.updateSettingsMenuPos();
            }
            this.cdr.markForCheck();
            requestAnimationFrame(() => {
                if (kind === "filter" && !this.openFilterField)
                    return;
                if (kind === "settings" && !this.settingsMenuOpen)
                    return;
                if (kind === "filter") {
                    this.updateFilterMenuPos();
                }
                else {
                    this.updateSettingsMenuPos();
                }
                this.cdr.markForCheck();
            });
        });
    }
    bindOverlayRepositionListeners() {
        if (this.overlayRepositionCleanup)
            return;
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
            if (changed)
                this.cdr.markForCheck();
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
    unbindOverlayRepositionListeners() {
        this.overlayRepositionCleanup?.();
        this.overlayRepositionCleanup = null;
    }
    syncColumnWidths() {
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
    syncHiddenColumnKeys() {
        const allowed = new Set(this.hideableColumns.map((column) => column.field));
        const next = new Set([...this.hiddenColumnKeys].filter((field) => allowed.has(field)));
        this.hiddenColumnKeys = next;
    }
    onEscape() {
        this.closeFilter();
        this.closeSettingsMenu();
    }
    onDocumentClick(event) {
        const target = event.target;
        if (!target)
            return;
        if (this.openFilterField) {
            if (!target.closest("[data-ids-datagrid-filter-menu]") && !target.closest(".filterAnchor")) {
                this.closeFilter();
            }
        }
        if (this.settingsMenuOpen) {
            if (!target.closest("[data-ids-datagrid-settings-menu]") &&
                !this.settingsAnchor?.nativeElement.contains(target)) {
                this.closeSettingsMenu();
            }
        }
    }
    onViewportChange() {
        if (this.openFilterField) {
            this.updateFilterMenuPos();
        }
        if (this.settingsMenuOpen) {
            this.updateSettingsMenuPos();
        }
        this.cdr.markForCheck();
    }
    syncHeaderScroll() {
        const body = this.bodyViewport?.nativeElement;
        const header = this.headerTrack?.nativeElement;
        if (!body || !header)
            return;
        header.scrollLeft = body.scrollLeft;
    }
    onRowClick(rowId) {
        if (this.withDetailPanel) {
            if (this.activeRowId === rowId && this.detailPanelOpen) {
                this.detailPanelOpen = false;
                this.activeRowId = null;
            }
            else {
                this.activeRowId = rowId;
                this.detailPanelOpen = true;
            }
        }
        else {
            this.activeRowId = rowId;
        }
        this.cdr.markForCheck();
    }
    onDetailPanelExpandedChange(expanded) {
        this.detailPanelOpen = expanded;
        if (!expanded) {
            this.activeRowId = null;
        }
        this.cdr.markForCheck();
    }
    onSingleSelect(rowId) {
        this.selectedRowId = rowId;
        this.cdr.markForCheck();
    }
    isRowSelected(rowId) {
        return this.selectedRowId === rowId || this.activeRowId === rowId;
    }
    setPage(page) {
        this.currentPage = Math.min(Math.max(1, page), this.resolvedTotalPages);
        this.cdr.markForCheck();
    }
    bindProjectedChildren() {
        this.syncModels();
    }
    syncModels() {
        this.columns = [...this.columnRegistry.values()];
        this.rows = [...this.rowRegistry.values()];
        this.syncColumnWidths();
        this.syncHiddenColumnKeys();
        if (this.currentPage > this.resolvedTotalPages) {
            this.currentPage = this.resolvedTotalPages;
        }
        this.cdr.markForCheck();
    }
    static ɵfac = function IdsDatagridComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridComponent, selectors: [["ids-datagrid"]], contentQueries: function IdsDatagridComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDatagridColumnComponent, 4)(dirIndex, IdsDatagridRowComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.columnQuery = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.rowQuery = _t);
        } }, viewQuery: function IdsDatagridComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5)(_c2, 5)(_c3, 5)(_c4, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.bodyViewport = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.headerTrack = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.settingsAnchor = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.filterMenuLayer = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.settingsMenuLayer = _t.first);
        } }, hostBindings: function IdsDatagridComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown.escape", function IdsDatagridComponent_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, i0.ɵɵresolveDocument)("click", function IdsDatagridComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, i0.ɵɵresolveDocument)("resize", function IdsDatagridComponent_resize_HostBindingHandler() { return ctx.onViewportChange(); }, i0.ɵɵresolveWindow)("scroll", function IdsDatagridComponent_scroll_HostBindingHandler() { return ctx.onViewportChange(); }, i0.ɵɵresolveWindow);
        } }, inputs: { rowSelection: "rowSelection", selectionMode: "selectionMode", showSingleSelectionRadio: "showSingleSelectionRadio", withDetailPanel: "withDetailPanel", pageSize: "pageSize", totalPages: "totalPages", readOnly: "readOnly", rowVerticalIndicator: "rowVerticalIndicator", headerColorAndBorder: "headerColorAndBorder", columnResizeEnabled: "columnResizeEnabled" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_DATAGRID_CONTEXT, useExisting: IdsDatagridComponent }])], decls: 39, vars: 30, consts: [["headerTrack", ""], ["settingsAnchor", ""], ["bodyViewport", ""], ["filterAnchor", ""], ["filterMenuLayer", ""], ["settingsMenuLayer", ""], [1, "shell"], [1, "contentRow"], [1, "gridWrap"], [1, "gridScrollHost"], [1, "headerBand"], [1, "headerBandTrack"], [1, "grid"], [3, "width"], [3, "width", "tableGrowCol"], ["scope", "col", 1, "headerCell", "selectionColumn", "headerSelectionColumn", 3, "headerColorBand"], ["scope", "col", 1, "headerCell", "headerDataCell", 3, "headerColorBand"], ["scope", "col", 1, "headerCell", "settingsColumn"], [1, "settingsHeaderInner"], ["type", "button", "aria-label", "Column settings", "aria-haspopup", "dialog", 1, "settingsToggleButton", 3, "click", "disabled"], ["shapeName", "settings-gear", "className", "settingsIcon", 3, "size"], [1, "bodyViewport", 3, "scroll"], [1, "bodyContent"], [1, "bodyRow"], [1, "footer"], ["attachMode", "datagrid", 1, "detailPanel", 3, "expanded"], ["data-ids-datagrid-filter-menu", "", 1, "filterMenuLayer", 3, "position", "top", "right"], ["data-ids-datagrid-settings-menu", "", 1, "settingsMenuLayer", 3, "position", "top", "right"], ["scope", "col", 1, "headerCell", "selectionColumn", "headerSelectionColumn"], ["scope", "col", 1, "headerCell", "headerDataCell"], [1, "headerCellRow"], [1, "headerTitleRow"], ["type", "button", 1, "titleButton", 3, "click"], [1, "headerTitle", 3, "title"], ["type", "button", 1, "iconButton"], [1, "filterAnchor"], ["aria-hidden", "true", 1, "columnHeaderDivider"], ["type", "button", 1, "columnResizeHandle"], ["type", "button", 1, "iconButton", 3, "click"], ["className", "sortIcon", 3, "shapeName", "size"], ["type", "button", 1, "filterToggleButton"], ["aria-hidden", "true", 1, "filterAnchorOpenSpacer"], ["type", "button", 1, "filterToggleButton", 3, "click"], ["className", "filterIcon", 3, "shapeName", "size"], ["type", "button", 1, "columnResizeHandle", 3, "pointerdown"], [1, "bodyRow", 3, "click"], [1, "bodyCell", "selectionColumn", "rowSelectionCell"], [1, "bodyCell"], [1, "bodyCell", "settingsColumn"], [1, "selectionRowContent"], ["type", "radio", 1, "selectionRadio", 3, "name", "value", "checked"], ["type", "radio", 1, "selectionRadio", 3, "click", "change", "name", "value", "checked"], [1, "cellText"], ["background", "gray", 3, "pageChange", "currentPage", "totalPages", "embeddedInDatagrid"], ["attachMode", "datagrid", 1, "detailPanel", 3, "expandedChange", "expanded"], [1, "detailBody"], ["data-ids-datagrid-filter-menu", "", 1, "filterMenuLayer", 3, "click"], ["type", "button", 1, "filterPopupIconTab", 3, "click"], ["shapeName", "filter-solid", "className", "filterIcon", 3, "size"], [1, "filterPopupPanel"], [1, "filterPopupPanelBody"], [3, "ngTemplateOutlet"], ["data-ids-datagrid-settings-menu", "", 1, "settingsMenuLayer", 3, "click"], ["role", "dialog", "aria-label", "Column visibility", 1, "settingsPopupPanel"], [1, "settingsPopupPanelBody"], [3, "columnVisibilityChange", "hideableColumns", "hiddenColumnKeys", "validationMessage"]], template: function IdsDatagridComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 6)(1, "div", 7)(2, "div", 8)(3, "div", 9)(4, "div", 10)(5, "div", 11, 0)(7, "table", 12)(8, "colgroup");
            i0.ɵɵconditionalCreate(9, IdsDatagridComponent_Conditional_9_Template, 1, 2, "col", 13);
            i0.ɵɵrepeaterCreate(10, IdsDatagridComponent_For_11_Template, 1, 4, "col", 14, _forTrack0);
            i0.ɵɵelement(12, "col");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "thead")(14, "tr");
            i0.ɵɵconditionalCreate(15, IdsDatagridComponent_Conditional_15_Template, 1, 2, "th", 15);
            i0.ɵɵrepeaterCreate(16, IdsDatagridComponent_For_17_Template, 10, 7, "th", 16, _forTrack0);
            i0.ɵɵelementStart(18, "th", 17)(19, "div", 18, 1)(21, "button", 19);
            i0.ɵɵlistener("click", function IdsDatagridComponent_Template_button_click_21_listener($event) { return ctx.toggleSettingsMenu($event); });
            i0.ɵɵelement(22, "ids-icon", 20);
            i0.ɵɵelementEnd()()()()()()()();
            i0.ɵɵelementStart(23, "div", 21, 2);
            i0.ɵɵlistener("scroll", function IdsDatagridComponent_Template_div_scroll_23_listener() { return ctx.syncHeaderScroll(); });
            i0.ɵɵelementStart(25, "div", 22)(26, "table", 12)(27, "colgroup");
            i0.ɵɵconditionalCreate(28, IdsDatagridComponent_Conditional_28_Template, 1, 2, "col", 13);
            i0.ɵɵrepeaterCreate(29, IdsDatagridComponent_For_30_Template, 1, 4, "col", 14, _forTrack0);
            i0.ɵɵelement(31, "col");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(32, "tbody");
            i0.ɵɵrepeaterCreate(33, IdsDatagridComponent_For_34_Template, 5, 4, "tr", 23, _forTrack1);
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵconditionalCreate(35, IdsDatagridComponent_Conditional_35_Template, 2, 3, "div", 24);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(36, IdsDatagridComponent_Conditional_36_Template, 7, 3, "ids-detail-panel", 25);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(37, IdsDatagridComponent_Conditional_37_Template, 7, 9, "div", 26);
            i0.ɵɵconditionalCreate(38, IdsDatagridComponent_Conditional_38_Template, 5, 9, "div", 27);
        } if (rf & 2) {
            i0.ɵɵattribute("data-with-detail-panel", ctx.withDetailPanel ? "true" : null)("data-header-styled", ctx.headerColorAndBorder ? "true" : "false");
            i0.ɵɵadvance(7);
            i0.ɵɵstyleProp("width", 100, "%")("min-width", ctx.minTableWidthPx, "px");
            i0.ɵɵattribute("data-header-styled", ctx.headerColorAndBorder ? "true" : "false");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showSelectionColumn ? 9 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.visibleColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵstyleProp("width", ctx.settingsColWidth, "px");
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showSelectionColumn ? 15 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.visibleColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("headerColorBand", ctx.headerColorAndBorder);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("disabled", ctx.hideableColumns.length === 0);
            i0.ɵɵattribute("aria-expanded", ctx.settingsMenuOpen);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("settingsIconActive", ctx.settingsMenuOpen);
            i0.ɵɵproperty("size", 16);
            i0.ɵɵadvance(4);
            i0.ɵɵstyleProp("width", 100, "%")("min-width", ctx.minTableWidthPx, "px");
            i0.ɵɵattribute("data-header-styled", ctx.headerColorAndBorder ? "true" : "false");
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showSelectionColumn ? 28 : -1);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.visibleColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵstyleProp("width", ctx.settingsColWidth, "px");
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.pagedRows);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showPagination ? 35 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.withDetailPanel ? 36 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.openFilterField && ctx.filterMenuPos ? 37 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.settingsMenuOpen && ctx.hideableColumns.length > 0 && ctx.settingsMenuPos ? 38 : -1);
        } }, dependencies: [CommonModule, i1.NgTemplateOutlet, IdsIconComponent,
            IdsPaginationComponent,
            IdsDatagridColumnVisibilityPanelComponent, i2.IdsDetailPanelComponent, i3.IdsDetailPanelHeaderComponent, i4.IdsDetailPanelBodyComponent], styles: [".shell {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  min-width: 0;\n}\n\nids-datagrid,\nids-datagrid-demo-host {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n}\n\n.topBar {\n  display: flex;\n  justify-content: flex-end;\n}\n\n.modeLabel {\n  color: var(--color-text-neutral);\n  font-size: 14px;\n}\n\n.contentRow {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: stretch;\n  gap: 0;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n\n.shell:not([data-with-detail-panel=\"true\"]) .contentRow {\n  border: 1px solid var(--color-border-accessible);\n  background: var(--color-background-component);\n}\n\n.gridWrap {\n  flex: 1 1 0%;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background: var(--color-background-component);\n  overflow: hidden;\n  box-sizing: border-box;\n}\n\n.shell[data-with-detail-panel=\"true\"] .gridWrap {\n  border: 1px solid var(--color-border-accessible);\n  margin-right: -1px;\n}\n\n.rowSelectionGroup {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n}\n\n/* Header band + body viewport: vertical scroll applies to body only (Figma header stable). */\n.gridScrollHost {\n  flex: 1 1 0%;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n}\n\n.headerBand {\n  flex: 0 0 auto;\n  min-width: 0;\n  overflow: hidden;\n}\n\n.headerBandTrack {\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: none;\n}\n\n.headerBandTrack::-webkit-scrollbar {\n  display: none;\n}\n\n.bodyViewport {\n  flex: 1 1 0%;\n  min-height: 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  scrollbar-gutter: auto;\n  border-bottom: 0;\n}\n\n/* Fills allocated body height so horizontal scrollbar sits at viewport bottom, not under last row. */\n.bodyContent {\n  flex: 1 1 auto;\n  min-height: 100%;\n  min-width: 0;\n}\n\n/* Split freeze: body scrolls vertically; horizontal scroll is per-pane at pane bottom. */\n.bodyViewportSplit {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.bodyViewportSplit > .tableSplitRow {\n  flex: 1 1 auto;\n  min-height: 100%;\n  align-items: stretch;\n}\n\n.frozenHeaderHost {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n\n.scrollableHeaderHost {\n  flex: 1 1 0;\n  min-width: 0;\n}\n\n/* Settings gear column \u2014 pinned trailing chrome (never in horizontal scroll pane). */\n.settingsHeaderHost,\n.settingsPaneHost {\n  flex: 0 0 auto;\n  width: var(--datagrid-settings-col-width);\n  min-width: var(--datagrid-settings-col-width);\n  max-width: var(--datagrid-settings-col-width);\n}\n\n.settingsPaneHost {\n  display: flex;\n  flex-direction: column;\n  align-self: stretch;\n  min-height: 100%;\n  z-index: 3;\n  background: var(--color-background-component);\n}\n\n.tableSplitRow {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n\n.frozenPaneHost {\n  position: relative;\n  flex: 0 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-self: stretch;\n  min-height: 100%;\n  z-index: 2;\n  isolation: isolate;\n  overflow: visible;\n}\n\n.frozenPane {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  background: var(--color-background-component);\n}\n\n.scrollablePane {\n  position: relative;\n  flex: 1 1 0;\n  min-width: 0;\n  min-height: 100%;\n  align-self: stretch;\n  overflow-x: auto;\n  overflow-y: hidden;\n  z-index: 1;\n  background: var(--color-background-component);\n}\n\n/*\n * Split-freeze section tables must keep their <colgroup> widths.\n * Flex parents (.tableSplitRow / .scrollablePane) otherwise shrink tables to 0\n * and table-layout:fixed collapses every column in the scrollable section.\n */\n.gridScrollHost[data-split-freeze=\"true\"] .frozenPane > .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .scrollablePane > .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .frozenHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .scrollableHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .settingsHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .settingsPaneHost .grid {\n  flex-shrink: 0;\n  box-sizing: border-box;\n}\n\n/*\n * Freeze boundary bar (Figma `37721:114144`, 20px) \u2014 pinned at frozen/scrollable seam;\n * gradient casts onto scrollable columns while the bar stays fixed.\n */\n.gridScrollHost[data-split-freeze=\"true\"] .freezePaneEdge {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: calc(var(--datagrid-frozen-pane-width, 0px) - 20px);\n  width: 20px;\n  flex-shrink: 0;\n  align-self: stretch;\n  border-radius: 0;\n  pointer-events: none;\n  z-index: 20;\n  background: linear-gradient(\n    270deg,\n    var(--color-gradient-overflow-vertical-end) 0%,\n    var(--color-gradient-overflow-vertical-start) 63.46%,\n    var(--color-gradient-overflow-vertical-start) 100%\n  );\n}\n\n.shell[data-with-detail-panel=\"true\"] ids-detail-panel.detailPanel {\n  flex: 0 0 auto;\n}\n\n.detailPanel {\n  align-self: stretch;\n  height: auto;\n}\n\n/* Align detail-panel header band with datagrid column header row (48px + bottom rule). */\n.shell[data-with-detail-panel=\"true\"] ids-detail-panel.detailPanel .ids-detail-panel__header {\n  height: 48px;\n  min-height: 48px;\n  max-height: 48px;\n  padding-top: 0;\n  padding-bottom: 0;\n  border-bottom: 1px solid var(--color-border-accessible);\n}\n\n.shell[data-header-styled=\"true\"][data-with-detail-panel=\"true\"]\n  ids-detail-panel.detailPanel\n  .ids-detail-panel__header {\n  border-bottom: 1px solid var(--color-border-light);\n}\n\n.detailBody {\n  color: var(--color-text-neutral);\n  font-size: 14px;\n}\n\n.grid {\n  width: 100%;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n  /* Figma `37721:114682` / `37721:113988` / `37721:114944` (`37721:113997`) */\n  --datagrid-selection-col-width: 48px;\n  --datagrid-settings-col-width: 40px;\n  --datagrid-selection-header-py: var(--selection-header, 16px);\n  --datagrid-selection-header-px: 16px;\n  --datagrid-selection-cell-py: var(--selection-cell, 12px);\n  --datagrid-selection-cell-px: 16px;\n  --datagrid-chrome-icon-size: 16px;\n}\n\n/*\n * Only column without a fixed pixel <col> width \u2014 absorbs table slack (width:100%).\n * Do NOT use width:0 here; browsers then expand fixed chrome cols (48/40) instead.\n */\n.tableGrowCol {\n  width: auto;\n  min-width: 0;\n}\n\n.colSelection {\n  width: var(--datagrid-selection-col-width) !important;\n  max-width: var(--datagrid-selection-col-width) !important;\n  min-width: var(--datagrid-selection-col-width) !important;\n}\n\n.colSettings {\n  width: var(--datagrid-settings-col-width) !important;\n  max-width: var(--datagrid-settings-col-width) !important;\n  min-width: var(--datagrid-settings-col-width) !important;\n}\n\n.headerCell {\n  position: relative;\n  box-sizing: border-box;\n  height: 48px;\n  padding: 0;\n  text-align: left;\n  vertical-align: middle;\n  z-index: 3;\n}\n\n/* Headers live outside the vertical scrollport \u2014 no sticky top/left/right required. */\n.headerBand .headerCell,\n.headerBand .headerSelectionColumn,\n.headerBand .settingsColumn {\n  position: relative;\n  top: auto;\n  left: auto;\n  right: auto;\n}\n\n/* Figma `.Column Header` `37721:114663` \u2014 `colorAndBorder` */\n.grid[data-header-styled=\"true\"] .headerCell {\n  border-top: 1px solid var(--color-border-light);\n  border-bottom: 1px solid var(--color-border-light);\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.grid[data-header-styled=\"false\"] .headerCell {\n  border-top: none;\n  border-bottom: none;\n  background: var(--color-background-component);\n}\n\n/* Data column headers: leading 1\u00D724px rail after selection chrome (Figma `37721:114663`) */\n.headerDataCell::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 1px;\n  height: 24px;\n  background: var(--color-border-light);\n  pointer-events: none;\n  z-index: 1;\n}\n\n/* When selection column is omitted, first data header is leftmost \u2014 no leading rail */\n.grid thead tr > .headerDataCell:first-child::before {\n  display: none;\n}\n\n/* Figma column header host: 48px row; children vertically centered on full height */\n.headerCellRow {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  box-sizing: border-box;\n  width: 100%;\n  height: 48px;\n  min-height: 48px;\n  max-height: 48px;\n  padding: 0 0 0 16px;\n}\n\n.headerTitleRow {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 12px;\n  box-sizing: border-box;\n  padding: 0 8px 0 0;\n  min-height: 0;\n}\n\n.filterAnchor {\n  position: relative;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  align-self: stretch;\n  width: 38px;\n  min-width: 38px;\n  box-sizing: border-box;\n}\n\n/*\n * Column filter shell (Figma `37721:114635`): L-shaped outer frame only.\n * Icon tab: top + left + right border; panel: left + bottom + right + partial top (stops at tab).\n * Inner UI (search, lists, etc.) is app-defined; keep this frame stable for all filter types.\n */\n/* Position (`fixed` + `top`/`right`) set inline when portaled to `document.body` */\n.filterMenuLayer {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  box-sizing: border-box;\n  z-index: 10000;\n}\n\n/* Open filter: icon \u201Ctab\u201D cell (Figma selected filter + menu) \u2014 38\u00D738 border-box, 12px inset, 14\u00D714 icon, \u22121px bottom overlap */\n.filterPopupIconTab {\n  position: relative;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 38px;\n  height: 38px;\n  padding: 11px 11px 12px;\n  margin: 0 0 -1px;\n  box-sizing: border-box;\n  border: none;\n  border-top: 1px solid var(--color-border-accessible);\n  border-right: 1px solid var(--color-border-accessible);\n  border-left: 1px solid var(--color-border-accessible);\n  border-bottom: none;\n  background: var(--color-background-component);\n  line-height: 0;\n  cursor: pointer;\n}\n\n.filterPopupIconTab:hover {\n  border-top-color: var(--color-border-strong);\n  border-right-color: var(--color-border-strong);\n  border-left-color: var(--color-border-strong);\n}\n\n.filterPopupPanel {\n  position: relative;\n  z-index: 1;\n  width: max-content;\n  min-width: 200px;\n  max-width: min(480px, calc(100vw - 24px));\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  background: var(--color-background-component);\n  border-top: none;\n  border-right: 1px solid var(--color-border-accessible);\n  border-bottom: 1px solid var(--color-border-accessible);\n  border-left: 1px solid var(--color-border-accessible);\n  /*\n   * Shadow 1 \u2014 Figma `44360:181713`: 0 2px 2px + 0 4px 4px @ 8%.\n   * Offsets/blur are literal px (ids-theme FLOAT tokens are unitless; var() would invalidate box-shadow).\n   */\n  box-shadow:\n    0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37, 37, 37, 0.08)),\n    0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n/* Top edge only under the wide panel segment (no line under the 38px icon tab). */\n.filterPopupPanel::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: calc(100% - 38px);\n  height: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n}\n\n.filterPopupPanelBody {\n  padding: 0;\n  box-sizing: border-box;\n  overflow: clip;\n}\n\n/* Date / date-time inner panel: 480px sample, py-8 px-1 on slot content. */\n.filterPopupPanel:has([data-datetime-filter]),\n.filterPopupPanel:has([data-date-filter]) {\n  min-width: 480px;\n  max-width: min(480px, calc(100vw - 24px));\n}\n\n.filterPopupPanel:has([data-datetime-filter]) .filterPopupPanelBody,\n.filterPopupPanel:has([data-date-filter]) .filterPopupPanelBody {\n  padding: 0;\n}\n\n.filterPopupSearchRow {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 8px;\n  min-height: 32px;\n}\n\n.filterPopupSearchIcon {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  color: var(--color-icon-brand-base);\n}\n\n.filterPopupSearchInput {\n  flex: 1 1 auto;\n  min-width: 0;\n  border: none;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px;\n  color: var(--color-text-neutral-strong);\n  outline: none;\n}\n\n.filterPopupSearchInput::placeholder {\n  color: var(--color-text-neutral);\n  font-weight: 400;\n}\n\n/* Holds header layout while the open filter menu is portaled above scroll/stacking contexts */\n.filterAnchorOpenSpacer {\n  width: 38px;\n  min-width: 38px;\n  height: 38px;\n  flex-shrink: 0;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n.filterToggleButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 38px;\n  height: 38px;\n  padding: 12px;\n  box-sizing: border-box;\n  border: none;\n  background: transparent;\n  margin: 0;\n  line-height: 0;\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.filterToggleButton:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n  border-radius: var(--corner-radius-radius-2);\n}\n\n\n.titleButton {\n  all: unset;\n  flex: 1 1 0;\n  min-width: 0;\n  overflow: hidden;\n  cursor: default;\n}\n\n.headerTitle {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--color-text-neutral-strong);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 20px;\n  min-height: 20px;\n  max-height: 20px;\n}\n\n.iconButton {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border: none;\n  background: transparent;\n  padding: 0;\n  margin: 0;\n  line-height: 0;\n  cursor: pointer;\n}\n\n/* Figma `.Sort for table` `37721:114646` \u2014 12\u00D712 icon; four states per direction. */\n.sortIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 12px;\n  height: 12px;\n  color: var(--color-icon-neutral);\n}\n\n.sortIconSelected {\n  color: var(--color-icon-brand-base);\n}\n\n.iconButton:hover .sortIcon {\n  color: var(--color-icon-neutral-strong);\n}\n\n.iconButton[data-sorted=\"true\"]:hover .sortIcon {\n  color: var(--color-icon-brand-stronger);\n}\n\n.filterIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n}\n\n.filterIcon span,\n.filterPopupIconTab span {\n  mask-size: 14px 14px !important;\n  -webkit-mask-size: 14px 14px !important;\n}\n\n.filter-default {\n  color: var(--color-icon-neutral);\n}\n\n.filter-hover {\n  color: var(--color-icon-neutral);\n}\n\n.filter-selected {\n  color: var(--color-icon-brand-base);\n}\n\n.filter-press {\n  color: var(--color-icon-brand-stronger);\n}\n\n/* Trailing column edge: 1\u00D724px rail (replaces a separate resize control in Storybook). */\n.columnHeaderDivider {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-light);\n  pointer-events: none;\n  z-index: 2;\n}\n\n.selectionColumnStatic {\n  position: static;\n  left: auto;\n  z-index: auto;\n}\n\n.settingsColumnStatic {\n  position: static;\n  right: auto;\n  z-index: auto;\n}\n\n.columnResizeHandle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 10px;\n  margin: 0;\n  padding: 0;\n  border: none;\n  background: transparent;\n  cursor: col-resize;\n  z-index: 5;\n}\n\n.columnResizeHandle:hover {\n  box-shadow: inset -2px 0 0 0 var(--color-border-brand-base);\n}\n\n.columnResizeHandle:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: -1px;\n}\n\n.selectionColumn {\n  box-sizing: border-box;\n  width: var(--datagrid-selection-col-width) !important;\n  min-width: var(--datagrid-selection-col-width) !important;\n  max-width: var(--datagrid-selection-col-width) !important;\n  padding: 0;\n  overflow: hidden;\n  text-align: center;\n  position: sticky;\n  left: 0;\n  z-index: 1;\n  background: var(--color-background-component);\n}\n\n.bodyRow[data-selected=\"true\"] .selectionColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active .selectionColumn {\n  background: var(--color-background-brand-light);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover .selectionColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover .selectionColumn {\n  background: var(--color-background-surface-1);\n}\n\n.headerSelectionColumn {\n  padding: 0;\n  position: sticky;\n  top: 0;\n  left: 0;\n  z-index: 6;\n}\n\n.grid[data-header-styled=\"true\"] .headerSelectionColumn {\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.selectionHeaderContent {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 100%;\n  height: 48px;\n  min-height: 48px;\n  padding: var(--datagrid-selection-header-py) var(--datagrid-selection-header-px);\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: 0;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.rowSelectionCell {\n  position: relative;\n  box-sizing: border-box;\n  height: 40px;\n  padding: 0 !important;\n  text-align: center;\n}\n\n.selectionRowContent {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 100%;\n  height: 40px;\n  padding: var(--datagrid-selection-cell-py) var(--datagrid-selection-cell-px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.settingsColumn {\n  box-sizing: border-box;\n  width: var(--datagrid-settings-col-width) !important;\n  min-width: var(--datagrid-settings-col-width) !important;\n  max-width: var(--datagrid-settings-col-width) !important;\n  padding: 0;\n  overflow: hidden;\n  position: sticky;\n  right: 0;\n  z-index: 2;\n  text-align: center;\n  vertical-align: middle;\n  background: var(--color-background-component);\n}\n\n.settingsColumn.headerCell {\n  top: 0;\n  z-index: 6;\n}\n\n.grid[data-header-styled=\"true\"] .settingsColumn.headerCell {\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.bodyRow[data-selected=\"true\"] .settingsColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active .settingsColumn {\n  background: var(--color-background-brand-light);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover .settingsColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover .settingsColumn {\n  background: var(--color-background-surface-1);\n}\n\n.settingsHeaderInner {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 48px;\n  min-height: 48px;\n  padding: var(--datagrid-selection-header-py) 0;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.settingsToggleButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  min-height: 32px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n  line-height: 0;\n}\n\n.settingsToggleButton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.settingsToggleButton:hover:not(:disabled) .settingsIcon {\n  color: var(--color-icon-brand-base);\n}\n\n.settingsToggleButton:focus-visible {\n  outline: 1px solid var(--color-border-brand-base);\n  outline-offset: 2px;\n  border-radius: 2px;\n}\n\n.settingsIcon {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: var(--datagrid-chrome-icon-size);\n  height: var(--datagrid-chrome-icon-size);\n  color: var(--color-icon-neutral);\n  line-height: 0;\n}\n\n.settingsIconActive {\n  color: var(--color-icon-brand-base);\n}\n\n/* Settings column visibility popup (gear) \u2014 portaled below header gear */\n.settingsMenuLayer {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  box-sizing: border-box;\n  z-index: 10001;\n}\n\n.settingsPopupPanel {\n  width: max-content;\n  min-width: 200px;\n  max-width: min(320px, calc(100vw - 24px));\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  background: var(--color-background-component);\n  border: 1px solid var(--color-border-accessible);\n  box-shadow:\n    0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37, 37, 37, 0.08)),\n    0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.settingsPopupPanelBody {\n  padding: 0;\n  box-sizing: border-box;\n  overflow: clip;\n}\n\n/* Body row chrome: components/ids/datagrid/design-spec.md + Figma 37721:114580\n   Paint per-cell: <tr> backgrounds are not reliable with border-collapse: collapse. */\n.bodyRow {\n  height: 40px;\n  cursor: pointer;\n  position: relative;\n}\n\n.bodyRow > td {\n  background: var(--color-background-component);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover > td {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover > td {\n  background: var(--color-background-surface-1);\n}\n\n.bodyRow[data-selected=\"true\"] > td {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active > td {\n  background: var(--color-background-brand-light);\n}\n\n/* 4px leading selection accent when vertical indicator is on */\n.bodyViewport .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child,\n.frozenPane .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child {\n  position: relative;\n}\n\n.bodyViewport .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child::before,\n.frozenPane .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: var(--color-border-brand-base);\n  pointer-events: none;\n  z-index: 1;\n}\n\n.bodyCell {\n  box-sizing: border-box;\n  height: 40px;\n  /* Figma `.Cell Item` `37721:114328`: pl 16, pr 12, py 10 */\n  padding: 10px 12px 10px 16px;\n  border-bottom: 1px solid var(--color-border-light);\n  color: var(--color-text-neutral);\n  font-size: 14px;\n  line-height: 20px;\n  vertical-align: middle;\n}\n\n/* Settings column body (Figma `37721:114944` / `37721:113997`): 40px \u00D7 40px, py 12px, no icon. */\n.bodyCell.settingsColumn {\n  height: 40px;\n  padding: 12px 0;\n}\n\n\n.cellText {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.footer {\n  flex: 0 0 auto;\n  padding: 0;\n}\n\n.selectionRadio {\n  appearance: none;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: 50%;\n  background: var(--color-background-component);\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.selectionRadio:checked {\n  border-color: var(--color-border-brand-base);\n  background: radial-gradient(\n    circle,\n    var(--color-background-controls-brand-base) 0 35%,\n    var(--color-background-component) 36% 100%\n  );\n}\n\n.selectionRadio:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.filterIcon span,\n.filterPopupIconTab span {\n  mask-size: 14px 14px !important;\n  -webkit-mask-size: 14px 14px !important;\n}\n\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid", standalone: true, imports: [
                    CommonModule,
                    IdsIconComponent,
                    IdsPaginationComponent,
                    IdsDatagridColumnVisibilityPanelComponent,
                    ...IDS_DETAIL_PANEL_IMPORTS,
                ], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: IDS_DATAGRID_CONTEXT, useExisting: IdsDatagridComponent }], template: "<div\n  class=\"shell\"\n  [attr.data-with-detail-panel]=\"withDetailPanel ? 'true' : null\"\n  [attr.data-header-styled]=\"headerColorAndBorder ? 'true' : 'false'\"\n>\n  <div class=\"contentRow\">\n    <div class=\"gridWrap\">\n      <div class=\"gridScrollHost\">\n        <div class=\"headerBand\">\n          <div class=\"headerBandTrack\" #headerTrack>\n            <table\n              class=\"grid\"\n              [attr.data-header-styled]=\"headerColorAndBorder ? 'true' : 'false'\"\n              [style.width.%]=\"100\"\n              [style.minWidth.px]=\"minTableWidthPx\"\n            >\n              <colgroup>\n                @if (showSelectionColumn) {\n                  <col [style.width.px]=\"selectionColWidth\" />\n                }\n                @for (column of visibleColumns; track column.field) {\n                  <col\n                    [style.width.px]=\"columnWidth(column)\"\n                    [class.tableGrowCol]=\"isGrowColumn(column.field) && growColPinnedWidthPx == null\"\n                  />\n                }\n                <col [style.width.px]=\"settingsColWidth\" />\n              </colgroup>\n              <thead>\n                <tr>\n                  @if (showSelectionColumn) {\n                    <th\n                      class=\"headerCell selectionColumn headerSelectionColumn\"\n                      [class.headerColorBand]=\"headerColorAndBorder\"\n                      scope=\"col\"\n                    ></th>\n                  }\n                  @for (column of visibleColumns; track column.field) {\n                    <th\n                      class=\"headerCell headerDataCell\"\n                      [class.headerColorBand]=\"headerColorAndBorder\"\n                      scope=\"col\"\n                    >\n                      <div class=\"headerCellRow\">\n                        <div class=\"headerTitleRow\">\n                          <button\n                            type=\"button\"\n                            class=\"titleButton\"\n                            (click)=\"column.sortable ? toggleSort(column.field) : null\"\n                          >\n                            <span class=\"headerTitle\" [title]=\"column.title\">{{ column.title }}</span>\n                          </button>\n                          @if (column.sortable) {\n                            <button\n                              type=\"button\"\n                              class=\"iconButton\"\n                              [attr.data-sorted]=\"sortKey === column.field ? 'true' : null\"\n                              [attr.aria-label]=\"'Sort by ' + column.title\"\n                              (click)=\"toggleSort(column.field)\"\n                            >\n                              <ids-icon\n                                [shapeName]=\"sortKey === column.field && sortDirection === 'desc' ? 'col-sort-down-16' : 'col-sort-up-16'\"\n                                className=\"sortIcon\"\n                                [size]=\"12\"\n                              />\n                            </button>\n                          }\n                        </div>\n                        @if (column.filterable) {\n                          <div class=\"filterAnchor\" #filterAnchor>\n                            @if (openFilterField !== column.field) {\n                              <button\n                                type=\"button\"\n                                class=\"filterToggleButton\"\n                                [attr.data-filter-active]=\"column.filterActive ? 'true' : null\"\n                                [attr.aria-expanded]=\"openFilterField === column.field\"\n                                [attr.aria-label]=\"'Filter ' + column.title\"\n                                (click)=\"onFilterPress(column.field, filterAnchor, $event)\"\n                              >\n                                <ids-icon\n                                  [shapeName]=\"column.filterActive ? 'filter-solid' : 'filter'\"\n                                  className=\"filterIcon\"\n                                  [size]=\"14\"\n                                />\n                              </button>\n                            } @else {\n                              <div class=\"filterAnchorOpenSpacer\" aria-hidden=\"true\"></div>\n                            }\n                          </div>\n                        }\n                      </div>\n                      <span class=\"columnHeaderDivider\" aria-hidden=\"true\"></span>\n                      @if (columnResizeEnabled) {\n                        <button\n                          type=\"button\"\n                          class=\"columnResizeHandle\"\n                          [attr.aria-label]=\"'Resize ' + column.title + ' column'\"\n                          (pointerdown)=\"startColumnResize(column.field, $event)\"\n                        ></button>\n                      }\n                    </th>\n                  }\n                  <th\n                    class=\"headerCell settingsColumn\"\n                    [class.headerColorBand]=\"headerColorAndBorder\"\n                    scope=\"col\"\n                  >\n                    <div class=\"settingsHeaderInner\" #settingsAnchor>\n                      <button\n                        type=\"button\"\n                        class=\"settingsToggleButton\"\n                        aria-label=\"Column settings\"\n                        aria-haspopup=\"dialog\"\n                        [attr.aria-expanded]=\"settingsMenuOpen\"\n                        [disabled]=\"hideableColumns.length === 0\"\n                        (click)=\"toggleSettingsMenu($event)\"\n                      >\n                        <ids-icon\n                          shapeName=\"settings-gear\"\n                          className=\"settingsIcon\"\n                          [class.settingsIconActive]=\"settingsMenuOpen\"\n                          [size]=\"16\"\n                        />\n                      </button>\n                    </div>\n                  </th>\n                </tr>\n              </thead>\n            </table>\n          </div>\n        </div>\n        <div class=\"bodyViewport\" #bodyViewport (scroll)=\"syncHeaderScroll()\">\n          <div class=\"bodyContent\">\n            <table\n              class=\"grid\"\n              [attr.data-header-styled]=\"headerColorAndBorder ? 'true' : 'false'\"\n              [style.width.%]=\"100\"\n              [style.minWidth.px]=\"minTableWidthPx\"\n            >\n              <colgroup>\n                @if (showSelectionColumn) {\n                  <col [style.width.px]=\"selectionColWidth\" />\n                }\n                @for (column of visibleColumns; track column.field) {\n                  <col\n                    [style.width.px]=\"columnWidth(column)\"\n                    [class.tableGrowCol]=\"isGrowColumn(column.field) && growColPinnedWidthPx == null\"\n                  />\n                }\n                <col [style.width.px]=\"settingsColWidth\" />\n              </colgroup>\n              <tbody>\n                @for (row of pagedRows; track row.rowId) {\n                  <tr\n                    class=\"bodyRow\"\n                    [attr.data-selected]=\"isRowSelected(row.rowId) ? 'true' : null\"\n                    [attr.data-readonly]=\"readOnly ? 'true' : null\"\n                    [attr.data-vertical-indicator]=\"rowVerticalIndicator ? 'true' : null\"\n                    (click)=\"onRowClick(row.rowId)\"\n                  >\n                    @if (showSelectionColumn) {\n                      <td class=\"bodyCell selectionColumn rowSelectionCell\">\n                        <div class=\"selectionRowContent\">\n                          @if (selectionMode === 'single') {\n                            <input\n                              type=\"radio\"\n                              class=\"selectionRadio\"\n                              [name]=\"selectionGroupName\"\n                              [value]=\"row.rowId\"\n                              [checked]=\"selectedRowId === row.rowId\"\n                              [attr.aria-label]=\"'Select row ' + row.rowId\"\n                              (click)=\"$event.stopPropagation()\"\n                              (change)=\"onSingleSelect(row.rowId)\"\n                            />\n                          }\n                        </div>\n                      </td>\n                    }\n                    @for (column of visibleColumns; track column.field) {\n                      <td class=\"bodyCell\">\n                        <span class=\"cellText\">{{ row.cells.get(column.field) }}</span>\n                      </td>\n                    }\n                    <td class=\"bodyCell settingsColumn\"></td>\n                  </tr>\n                }\n              </tbody>\n            </table>\n          </div>\n        </div>\n      </div>\n      @if (showPagination) {\n        <div class=\"footer\">\n          <ids-pagination\n            [currentPage]=\"currentPage\"\n            [totalPages]=\"resolvedTotalPages\"\n            background=\"gray\"\n            [embeddedInDatagrid]=\"true\"\n            (pageChange)=\"setPage($event)\"\n          />\n        </div>\n      }\n    </div>\n    @if (withDetailPanel) {\n      <ids-detail-panel\n        class=\"detailPanel\"\n        attachMode=\"datagrid\"\n        [expanded]=\"detailPanelOpen\"\n        (expandedChange)=\"onDetailPanelExpandedChange($event)\"\n      >\n        <ids-detail-panel-header>{{ detailTitle }}</ids-detail-panel-header>\n        <ids-detail-panel-body>\n          <div class=\"detailBody\">\n            @if (activeRow; as row) {\n              @for (column of visibleColumns; track column.field) {\n                <p><b>{{ column.title }}:</b> {{ row.cells.get(column.field) }}</p>\n              }\n            } @else {\n              <p>Select a row to view details.</p>\n            }\n          </div>\n        </ids-detail-panel-body>\n      </ids-detail-panel>\n    }\n  </div>\n</div>\n\n@if (openFilterField && filterMenuPos) {\n  <div\n    #filterMenuLayer\n    class=\"filterMenuLayer\"\n    data-ids-datagrid-filter-menu\n    [style.position]=\"'fixed'\"\n    [style.top.px]=\"filterMenuPos.top\"\n    [style.right.px]=\"filterMenuPos.right\"\n    (click)=\"$event.stopPropagation()\"\n  >\n    <button\n      type=\"button\"\n      class=\"filterPopupIconTab\"\n      [attr.aria-label]=\"'Filter ' + openFilterTitle\"\n      (click)=\"closeFilter()\"\n    >\n      <ids-icon shapeName=\"filter-solid\" className=\"filterIcon\" [size]=\"14\" />\n    </button>\n    <div class=\"filterPopupPanel\">\n      <div class=\"filterPopupPanelBody\">\n        @if (openFilterTemplate) {\n          <ng-container [ngTemplateOutlet]=\"openFilterTemplate\" />\n        }\n      </div>\n    </div>\n  </div>\n}\n\n@if (settingsMenuOpen && hideableColumns.length > 0 && settingsMenuPos) {\n  <div\n    #settingsMenuLayer\n    class=\"settingsMenuLayer\"\n    data-ids-datagrid-settings-menu\n    [style.position]=\"'fixed'\"\n    [style.top.px]=\"settingsMenuPos.top\"\n    [style.right.px]=\"settingsMenuPos.right\"\n    (click)=\"$event.stopPropagation()\"\n  >\n    <div class=\"settingsPopupPanel\" role=\"dialog\" aria-label=\"Column visibility\">\n      <div class=\"settingsPopupPanelBody\">\n        <ids-datagrid-column-visibility-panel\n          [hideableColumns]=\"hideableColumns\"\n          [hiddenColumnKeys]=\"hiddenColumnKeys\"\n          [validationMessage]=\"columnVisibilityValidation\"\n          (columnVisibilityChange)=\"onColumnVisibilityChange($event.field, $event.visible)\"\n        />\n      </div>\n    </div>\n  </div>\n}\n", styles: [".shell {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  width: 100%;\n  height: 100%;\n  min-height: 0;\n  min-width: 0;\n}\n\nids-datagrid,\nids-datagrid-demo-host {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n}\n\n.topBar {\n  display: flex;\n  justify-content: flex-end;\n}\n\n.modeLabel {\n  color: var(--color-text-neutral);\n  font-size: 14px;\n}\n\n.contentRow {\n  display: flex;\n  flex: 1 1 auto;\n  min-height: 0;\n  align-items: stretch;\n  gap: 0;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n\n.shell:not([data-with-detail-panel=\"true\"]) .contentRow {\n  border: 1px solid var(--color-border-accessible);\n  background: var(--color-background-component);\n}\n\n.gridWrap {\n  flex: 1 1 0%;\n  width: 100%;\n  min-width: 0;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  background: var(--color-background-component);\n  overflow: hidden;\n  box-sizing: border-box;\n}\n\n.shell[data-with-detail-panel=\"true\"] .gridWrap {\n  border: 1px solid var(--color-border-accessible);\n  margin-right: -1px;\n}\n\n.rowSelectionGroup {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n}\n\n/* Header band + body viewport: vertical scroll applies to body only (Figma header stable). */\n.gridScrollHost {\n  flex: 1 1 0%;\n  min-height: 0;\n  min-width: 0;\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  position: relative;\n}\n\n.headerBand {\n  flex: 0 0 auto;\n  min-width: 0;\n  overflow: hidden;\n}\n\n.headerBandTrack {\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: none;\n}\n\n.headerBandTrack::-webkit-scrollbar {\n  display: none;\n}\n\n.bodyViewport {\n  flex: 1 1 0%;\n  min-height: 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  scrollbar-gutter: auto;\n  border-bottom: 0;\n}\n\n/* Fills allocated body height so horizontal scrollbar sits at viewport bottom, not under last row. */\n.bodyContent {\n  flex: 1 1 auto;\n  min-height: 100%;\n  min-width: 0;\n}\n\n/* Split freeze: body scrolls vertically; horizontal scroll is per-pane at pane bottom. */\n.bodyViewportSplit {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n\n.bodyViewportSplit > .tableSplitRow {\n  flex: 1 1 auto;\n  min-height: 100%;\n  align-items: stretch;\n}\n\n.frozenHeaderHost {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n\n.scrollableHeaderHost {\n  flex: 1 1 0;\n  min-width: 0;\n}\n\n/* Settings gear column \u2014 pinned trailing chrome (never in horizontal scroll pane). */\n.settingsHeaderHost,\n.settingsPaneHost {\n  flex: 0 0 auto;\n  width: var(--datagrid-settings-col-width);\n  min-width: var(--datagrid-settings-col-width);\n  max-width: var(--datagrid-settings-col-width);\n}\n\n.settingsPaneHost {\n  display: flex;\n  flex-direction: column;\n  align-self: stretch;\n  min-height: 100%;\n  z-index: 3;\n  background: var(--color-background-component);\n}\n\n.tableSplitRow {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  width: 100%;\n  max-width: 100%;\n  min-width: 0;\n}\n\n.frozenPaneHost {\n  position: relative;\n  flex: 0 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-self: stretch;\n  min-height: 100%;\n  z-index: 2;\n  isolation: isolate;\n  overflow: visible;\n}\n\n.frozenPane {\n  flex: 1 1 auto;\n  min-width: 0;\n  min-height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  background: var(--color-background-component);\n}\n\n.scrollablePane {\n  position: relative;\n  flex: 1 1 0;\n  min-width: 0;\n  min-height: 100%;\n  align-self: stretch;\n  overflow-x: auto;\n  overflow-y: hidden;\n  z-index: 1;\n  background: var(--color-background-component);\n}\n\n/*\n * Split-freeze section tables must keep their <colgroup> widths.\n * Flex parents (.tableSplitRow / .scrollablePane) otherwise shrink tables to 0\n * and table-layout:fixed collapses every column in the scrollable section.\n */\n.gridScrollHost[data-split-freeze=\"true\"] .frozenPane > .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .scrollablePane > .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .frozenHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .scrollableHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .settingsHeaderHost .grid,\n.gridScrollHost[data-split-freeze=\"true\"] .settingsPaneHost .grid {\n  flex-shrink: 0;\n  box-sizing: border-box;\n}\n\n/*\n * Freeze boundary bar (Figma `37721:114144`, 20px) \u2014 pinned at frozen/scrollable seam;\n * gradient casts onto scrollable columns while the bar stays fixed.\n */\n.gridScrollHost[data-split-freeze=\"true\"] .freezePaneEdge {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  left: calc(var(--datagrid-frozen-pane-width, 0px) - 20px);\n  width: 20px;\n  flex-shrink: 0;\n  align-self: stretch;\n  border-radius: 0;\n  pointer-events: none;\n  z-index: 20;\n  background: linear-gradient(\n    270deg,\n    var(--color-gradient-overflow-vertical-end) 0%,\n    var(--color-gradient-overflow-vertical-start) 63.46%,\n    var(--color-gradient-overflow-vertical-start) 100%\n  );\n}\n\n.shell[data-with-detail-panel=\"true\"] ids-detail-panel.detailPanel {\n  flex: 0 0 auto;\n}\n\n.detailPanel {\n  align-self: stretch;\n  height: auto;\n}\n\n/* Align detail-panel header band with datagrid column header row (48px + bottom rule). */\n.shell[data-with-detail-panel=\"true\"] ids-detail-panel.detailPanel .ids-detail-panel__header {\n  height: 48px;\n  min-height: 48px;\n  max-height: 48px;\n  padding-top: 0;\n  padding-bottom: 0;\n  border-bottom: 1px solid var(--color-border-accessible);\n}\n\n.shell[data-header-styled=\"true\"][data-with-detail-panel=\"true\"]\n  ids-detail-panel.detailPanel\n  .ids-detail-panel__header {\n  border-bottom: 1px solid var(--color-border-light);\n}\n\n.detailBody {\n  color: var(--color-text-neutral);\n  font-size: 14px;\n}\n\n.grid {\n  width: 100%;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n  /* Figma `37721:114682` / `37721:113988` / `37721:114944` (`37721:113997`) */\n  --datagrid-selection-col-width: 48px;\n  --datagrid-settings-col-width: 40px;\n  --datagrid-selection-header-py: var(--selection-header, 16px);\n  --datagrid-selection-header-px: 16px;\n  --datagrid-selection-cell-py: var(--selection-cell, 12px);\n  --datagrid-selection-cell-px: 16px;\n  --datagrid-chrome-icon-size: 16px;\n}\n\n/*\n * Only column without a fixed pixel <col> width \u2014 absorbs table slack (width:100%).\n * Do NOT use width:0 here; browsers then expand fixed chrome cols (48/40) instead.\n */\n.tableGrowCol {\n  width: auto;\n  min-width: 0;\n}\n\n.colSelection {\n  width: var(--datagrid-selection-col-width) !important;\n  max-width: var(--datagrid-selection-col-width) !important;\n  min-width: var(--datagrid-selection-col-width) !important;\n}\n\n.colSettings {\n  width: var(--datagrid-settings-col-width) !important;\n  max-width: var(--datagrid-settings-col-width) !important;\n  min-width: var(--datagrid-settings-col-width) !important;\n}\n\n.headerCell {\n  position: relative;\n  box-sizing: border-box;\n  height: 48px;\n  padding: 0;\n  text-align: left;\n  vertical-align: middle;\n  z-index: 3;\n}\n\n/* Headers live outside the vertical scrollport \u2014 no sticky top/left/right required. */\n.headerBand .headerCell,\n.headerBand .headerSelectionColumn,\n.headerBand .settingsColumn {\n  position: relative;\n  top: auto;\n  left: auto;\n  right: auto;\n}\n\n/* Figma `.Column Header` `37721:114663` \u2014 `colorAndBorder` */\n.grid[data-header-styled=\"true\"] .headerCell {\n  border-top: 1px solid var(--color-border-light);\n  border-bottom: 1px solid var(--color-border-light);\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.grid[data-header-styled=\"false\"] .headerCell {\n  border-top: none;\n  border-bottom: none;\n  background: var(--color-background-component);\n}\n\n/* Data column headers: leading 1\u00D724px rail after selection chrome (Figma `37721:114663`) */\n.headerDataCell::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 1px;\n  height: 24px;\n  background: var(--color-border-light);\n  pointer-events: none;\n  z-index: 1;\n}\n\n/* When selection column is omitted, first data header is leftmost \u2014 no leading rail */\n.grid thead tr > .headerDataCell:first-child::before {\n  display: none;\n}\n\n/* Figma column header host: 48px row; children vertically centered on full height */\n.headerCellRow {\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  box-sizing: border-box;\n  width: 100%;\n  height: 48px;\n  min-height: 48px;\n  max-height: 48px;\n  padding: 0 0 0 16px;\n}\n\n.headerTitleRow {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 12px;\n  box-sizing: border-box;\n  padding: 0 8px 0 0;\n  min-height: 0;\n}\n\n.filterAnchor {\n  position: relative;\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  align-self: stretch;\n  width: 38px;\n  min-width: 38px;\n  box-sizing: border-box;\n}\n\n/*\n * Column filter shell (Figma `37721:114635`): L-shaped outer frame only.\n * Icon tab: top + left + right border; panel: left + bottom + right + partial top (stops at tab).\n * Inner UI (search, lists, etc.) is app-defined; keep this frame stable for all filter types.\n */\n/* Position (`fixed` + `top`/`right`) set inline when portaled to `document.body` */\n.filterMenuLayer {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  box-sizing: border-box;\n  z-index: 10000;\n}\n\n/* Open filter: icon \u201Ctab\u201D cell (Figma selected filter + menu) \u2014 38\u00D738 border-box, 12px inset, 14\u00D714 icon, \u22121px bottom overlap */\n.filterPopupIconTab {\n  position: relative;\n  z-index: 2;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 38px;\n  height: 38px;\n  padding: 11px 11px 12px;\n  margin: 0 0 -1px;\n  box-sizing: border-box;\n  border: none;\n  border-top: 1px solid var(--color-border-accessible);\n  border-right: 1px solid var(--color-border-accessible);\n  border-left: 1px solid var(--color-border-accessible);\n  border-bottom: none;\n  background: var(--color-background-component);\n  line-height: 0;\n  cursor: pointer;\n}\n\n.filterPopupIconTab:hover {\n  border-top-color: var(--color-border-strong);\n  border-right-color: var(--color-border-strong);\n  border-left-color: var(--color-border-strong);\n}\n\n.filterPopupPanel {\n  position: relative;\n  z-index: 1;\n  width: max-content;\n  min-width: 200px;\n  max-width: min(480px, calc(100vw - 24px));\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  background: var(--color-background-component);\n  border-top: none;\n  border-right: 1px solid var(--color-border-accessible);\n  border-bottom: 1px solid var(--color-border-accessible);\n  border-left: 1px solid var(--color-border-accessible);\n  /*\n   * Shadow 1 \u2014 Figma `44360:181713`: 0 2px 2px + 0 4px 4px @ 8%.\n   * Offsets/blur are literal px (ids-theme FLOAT tokens are unitless; var() would invalidate box-shadow).\n   */\n  box-shadow:\n    0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37, 37, 37, 0.08)),\n    0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n/* Top edge only under the wide panel segment (no line under the 38px icon tab). */\n.filterPopupPanel::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: calc(100% - 38px);\n  height: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n}\n\n.filterPopupPanelBody {\n  padding: 0;\n  box-sizing: border-box;\n  overflow: clip;\n}\n\n/* Date / date-time inner panel: 480px sample, py-8 px-1 on slot content. */\n.filterPopupPanel:has([data-datetime-filter]),\n.filterPopupPanel:has([data-date-filter]) {\n  min-width: 480px;\n  max-width: min(480px, calc(100vw - 24px));\n}\n\n.filterPopupPanel:has([data-datetime-filter]) .filterPopupPanelBody,\n.filterPopupPanel:has([data-date-filter]) .filterPopupPanelBody {\n  padding: 0;\n}\n\n.filterPopupSearchRow {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  gap: 8px;\n  min-height: 32px;\n}\n\n.filterPopupSearchIcon {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  color: var(--color-icon-brand-base);\n}\n\n.filterPopupSearchInput {\n  flex: 1 1 auto;\n  min-width: 0;\n  border: none;\n  margin: 0;\n  padding: 0;\n  background: transparent;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px;\n  color: var(--color-text-neutral-strong);\n  outline: none;\n}\n\n.filterPopupSearchInput::placeholder {\n  color: var(--color-text-neutral);\n  font-weight: 400;\n}\n\n/* Holds header layout while the open filter menu is portaled above scroll/stacking contexts */\n.filterAnchorOpenSpacer {\n  width: 38px;\n  min-width: 38px;\n  height: 38px;\n  flex-shrink: 0;\n  pointer-events: none;\n  visibility: hidden;\n}\n\n.filterToggleButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 38px;\n  height: 38px;\n  padding: 12px;\n  box-sizing: border-box;\n  border: none;\n  background: transparent;\n  margin: 0;\n  line-height: 0;\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.filterToggleButton:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n  border-radius: var(--corner-radius-radius-2);\n}\n\n\n.titleButton {\n  all: unset;\n  flex: 1 1 0;\n  min-width: 0;\n  overflow: hidden;\n  cursor: default;\n}\n\n.headerTitle {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  color: var(--color-text-neutral-strong);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 20px;\n  min-height: 20px;\n  max-height: 20px;\n}\n\n.iconButton {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 20px;\n  height: 20px;\n  border: none;\n  background: transparent;\n  padding: 0;\n  margin: 0;\n  line-height: 0;\n  cursor: pointer;\n}\n\n/* Figma `.Sort for table` `37721:114646` \u2014 12\u00D712 icon; four states per direction. */\n.sortIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 12px;\n  height: 12px;\n  color: var(--color-icon-neutral);\n}\n\n.sortIconSelected {\n  color: var(--color-icon-brand-base);\n}\n\n.iconButton:hover .sortIcon {\n  color: var(--color-icon-neutral-strong);\n}\n\n.iconButton[data-sorted=\"true\"]:hover .sortIcon {\n  color: var(--color-icon-brand-stronger);\n}\n\n.filterIcon {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n}\n\n.filterIcon span,\n.filterPopupIconTab span {\n  mask-size: 14px 14px !important;\n  -webkit-mask-size: 14px 14px !important;\n}\n\n.filter-default {\n  color: var(--color-icon-neutral);\n}\n\n.filter-hover {\n  color: var(--color-icon-neutral);\n}\n\n.filter-selected {\n  color: var(--color-icon-brand-base);\n}\n\n.filter-press {\n  color: var(--color-icon-brand-stronger);\n}\n\n/* Trailing column edge: 1\u00D724px rail (replaces a separate resize control in Storybook). */\n.columnHeaderDivider {\n  position: absolute;\n  top: 50%;\n  right: 0;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-light);\n  pointer-events: none;\n  z-index: 2;\n}\n\n.selectionColumnStatic {\n  position: static;\n  left: auto;\n  z-index: auto;\n}\n\n.settingsColumnStatic {\n  position: static;\n  right: auto;\n  z-index: auto;\n}\n\n.columnResizeHandle {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 10px;\n  margin: 0;\n  padding: 0;\n  border: none;\n  background: transparent;\n  cursor: col-resize;\n  z-index: 5;\n}\n\n.columnResizeHandle:hover {\n  box-shadow: inset -2px 0 0 0 var(--color-border-brand-base);\n}\n\n.columnResizeHandle:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: -1px;\n}\n\n.selectionColumn {\n  box-sizing: border-box;\n  width: var(--datagrid-selection-col-width) !important;\n  min-width: var(--datagrid-selection-col-width) !important;\n  max-width: var(--datagrid-selection-col-width) !important;\n  padding: 0;\n  overflow: hidden;\n  text-align: center;\n  position: sticky;\n  left: 0;\n  z-index: 1;\n  background: var(--color-background-component);\n}\n\n.bodyRow[data-selected=\"true\"] .selectionColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active .selectionColumn {\n  background: var(--color-background-brand-light);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover .selectionColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover .selectionColumn {\n  background: var(--color-background-surface-1);\n}\n\n.headerSelectionColumn {\n  padding: 0;\n  position: sticky;\n  top: 0;\n  left: 0;\n  z-index: 6;\n}\n\n.grid[data-header-styled=\"true\"] .headerSelectionColumn {\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.selectionHeaderContent {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 100%;\n  height: 48px;\n  min-height: 48px;\n  padding: var(--datagrid-selection-header-py) var(--datagrid-selection-header-px);\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  gap: 0;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.rowSelectionCell {\n  position: relative;\n  box-sizing: border-box;\n  height: 40px;\n  padding: 0 !important;\n  text-align: center;\n}\n\n.selectionRowContent {\n  box-sizing: border-box;\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  max-width: 100%;\n  height: 40px;\n  padding: var(--datagrid-selection-cell-py) var(--datagrid-selection-cell-px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.settingsColumn {\n  box-sizing: border-box;\n  width: var(--datagrid-settings-col-width) !important;\n  min-width: var(--datagrid-settings-col-width) !important;\n  max-width: var(--datagrid-settings-col-width) !important;\n  padding: 0;\n  overflow: hidden;\n  position: sticky;\n  right: 0;\n  z-index: 2;\n  text-align: center;\n  vertical-align: middle;\n  background: var(--color-background-component);\n}\n\n.settingsColumn.headerCell {\n  top: 0;\n  z-index: 6;\n}\n\n.grid[data-header-styled=\"true\"] .settingsColumn.headerCell {\n  background: var(--color-background-gray-neutral-lighter);\n}\n\n.bodyRow[data-selected=\"true\"] .settingsColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active .settingsColumn {\n  background: var(--color-background-brand-light);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover .settingsColumn {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover .settingsColumn {\n  background: var(--color-background-surface-1);\n}\n\n.settingsHeaderInner {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 48px;\n  min-height: 48px;\n  padding: var(--datagrid-selection-header-py) 0;\n  overflow: hidden;\n  line-height: 0;\n}\n\n.settingsToggleButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  min-height: 32px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n  line-height: 0;\n}\n\n.settingsToggleButton:disabled {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.settingsToggleButton:hover:not(:disabled) .settingsIcon {\n  color: var(--color-icon-brand-base);\n}\n\n.settingsToggleButton:focus-visible {\n  outline: 1px solid var(--color-border-brand-base);\n  outline-offset: 2px;\n  border-radius: 2px;\n}\n\n.settingsIcon {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  width: var(--datagrid-chrome-icon-size);\n  height: var(--datagrid-chrome-icon-size);\n  color: var(--color-icon-neutral);\n  line-height: 0;\n}\n\n.settingsIconActive {\n  color: var(--color-icon-brand-base);\n}\n\n/* Settings column visibility popup (gear) \u2014 portaled below header gear */\n.settingsMenuLayer {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  box-sizing: border-box;\n  z-index: 10001;\n}\n\n.settingsPopupPanel {\n  width: max-content;\n  min-width: 200px;\n  max-width: min(320px, calc(100vw - 24px));\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  background: var(--color-background-component);\n  border: 1px solid var(--color-border-accessible);\n  box-shadow:\n    0 2px 2px 0 var(--shadow-shadow-1-drop-shadow-2-color, rgba(37, 37, 37, 0.08)),\n    0 4px 4px 0 var(--shadow-shadow-1-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.settingsPopupPanelBody {\n  padding: 0;\n  box-sizing: border-box;\n  overflow: clip;\n}\n\n/* Body row chrome: components/ids/datagrid/design-spec.md + Figma 37721:114580\n   Paint per-cell: <tr> backgrounds are not reliable with border-collapse: collapse. */\n.bodyRow {\n  height: 40px;\n  cursor: pointer;\n  position: relative;\n}\n\n.bodyRow > td {\n  background: var(--color-background-component);\n}\n\n.bodyRow:not([data-readonly=\"true\"]):not([data-selected=\"true\"]):hover > td {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-readonly=\"true\"]:not([data-selected=\"true\"]):hover > td {\n  background: var(--color-background-surface-1);\n}\n\n.bodyRow[data-selected=\"true\"] > td {\n  background: var(--color-background-brand-lighter);\n}\n\n.bodyRow[data-selected=\"true\"]:active > td {\n  background: var(--color-background-brand-light);\n}\n\n/* 4px leading selection accent when vertical indicator is on */\n.bodyViewport .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child,\n.frozenPane .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child {\n  position: relative;\n}\n\n.bodyViewport .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child::before,\n.frozenPane .bodyRow[data-selected=\"true\"][data-vertical-indicator=\"true\"] > td:first-child::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: var(--color-border-brand-base);\n  pointer-events: none;\n  z-index: 1;\n}\n\n.bodyCell {\n  box-sizing: border-box;\n  height: 40px;\n  /* Figma `.Cell Item` `37721:114328`: pl 16, pr 12, py 10 */\n  padding: 10px 12px 10px 16px;\n  border-bottom: 1px solid var(--color-border-light);\n  color: var(--color-text-neutral);\n  font-size: 14px;\n  line-height: 20px;\n  vertical-align: middle;\n}\n\n/* Settings column body (Figma `37721:114944` / `37721:113997`): 40px \u00D7 40px, py 12px, no icon. */\n.bodyCell.settingsColumn {\n  height: 40px;\n  padding: 12px 0;\n}\n\n\n.cellText {\n  display: block;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.footer {\n  flex: 0 0 auto;\n  padding: 0;\n}\n\n.selectionRadio {\n  appearance: none;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: 50%;\n  background: var(--color-background-component);\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.selectionRadio:checked {\n  border-color: var(--color-border-brand-base);\n  background: radial-gradient(\n    circle,\n    var(--color-background-controls-brand-base) 0 35%,\n    var(--color-background-component) 36% 100%\n  );\n}\n\n.selectionRadio:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.filterIcon span,\n.filterPopupIconTab span {\n  mask-size: 14px 14px !important;\n  -webkit-mask-size: 14px 14px !important;\n}\n\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { columnQuery: [{
            type: ContentChildren,
            args: [IdsDatagridColumnComponent]
        }], rowQuery: [{
            type: ContentChildren,
            args: [IdsDatagridRowComponent]
        }], bodyViewport: [{
            type: ViewChild,
            args: ["bodyViewport"]
        }], headerTrack: [{
            type: ViewChild,
            args: ["headerTrack"]
        }], settingsAnchor: [{
            type: ViewChild,
            args: ["settingsAnchor"]
        }], filterMenuLayer: [{
            type: ViewChild,
            args: ["filterMenuLayer"]
        }], settingsMenuLayer: [{
            type: ViewChild,
            args: ["settingsMenuLayer"]
        }], rowSelection: [{
            type: Input
        }], selectionMode: [{
            type: Input
        }], showSingleSelectionRadio: [{
            type: Input
        }], withDetailPanel: [{
            type: Input
        }], pageSize: [{
            type: Input
        }], totalPages: [{
            type: Input
        }], readOnly: [{
            type: Input
        }], rowVerticalIndicator: [{
            type: Input
        }], headerColorAndBorder: [{
            type: Input
        }], columnResizeEnabled: [{
            type: Input
        }], onEscape: [{
            type: HostListener,
            args: ["document:keydown.escape"]
        }], onDocumentClick: [{
            type: HostListener,
            args: ["document:click", ["$event"]]
        }], onViewportChange: [{
            type: HostListener,
            args: ["window:resize"]
        }, {
            type: HostListener,
            args: ["window:scroll"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridComponent, { className: "IdsDatagridComponent", filePath: "src/components/ids-datagrid/ids-datagrid.component.ts", lineNumber: 64 }); })();
