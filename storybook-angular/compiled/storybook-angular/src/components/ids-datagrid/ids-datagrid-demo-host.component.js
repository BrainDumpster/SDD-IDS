import { Component, Input } from "@angular/core";
import { DATAGRID_SPEC_ACCURATE_DEFAULTS, DATAGRID_SPEC_COLUMNS, DATAGRID_SPEC_ROWS, } from "../../../../component-contracts/ids/datagrid.contract.js";
import { IdsDatagridComponent } from "./ids-datagrid.component";
import { IdsDatagridColumnComponent } from "./ids-datagrid-column.component";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import { IdsDatagridCellComponent } from "./ids-datagrid-cell.component";
import { IdsDatagridFilterComponent } from "./ids-datagrid-filter.component";
import { IdsDatagridFooterComponent } from "./ids-datagrid-footer.component";
import { IdsDatagridFilterSearchFieldComponent } from "./ids-datagrid-filter-search-field.component";
import { IdsDatagridFilterMultiselectComponent } from "./ids-datagrid-filter-multiselect.component";
import { IdsDatagridFilterSingleSelectComponent } from "./ids-datagrid-filter-single-select.component";
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
function IdsDatagridDemoHostComponent_For_17_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ids-datagrid-row", 11);
    i0.ɵɵelement(1, "ids-datagrid-cell", 12)(2, "ids-datagrid-cell", 13)(3, "ids-datagrid-cell", 14)(4, "ids-datagrid-cell", 15)(5, "ids-datagrid-cell", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r1 = ctx.$implicit;
    i0.ɵɵproperty("rowId", row_r1.id);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", row_r1.values.name);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", row_r1.values.type);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", row_r1.values.status);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", row_r1.values.owner);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", row_r1.values.region);
} }
export class IdsDatagridDemoHostComponent {
    columns = DATAGRID_SPEC_COLUMNS;
    allRows = DATAGRID_SPEC_ROWS;
    rowSelection = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowSelection;
    selectionMode = DATAGRID_SPEC_ACCURATE_DEFAULTS.selectionMode;
    showSingleSelectionRadio = DATAGRID_SPEC_ACCURATE_DEFAULTS.showSingleSelectionRadio;
    withDetailPanel = DATAGRID_SPEC_ACCURATE_DEFAULTS.withDetailPanel;
    pageSize = DATAGRID_SPEC_ACCURATE_DEFAULTS.pageSize;
    readOnly = DATAGRID_SPEC_ACCURATE_DEFAULTS.readOnly;
    rowVerticalIndicator = DATAGRID_SPEC_ACCURATE_DEFAULTS.rowVerticalIndicator;
    headerColorAndBorder = DATAGRID_SPEC_ACCURATE_DEFAULTS.headerColorAndBorder;
    columnResizeEnabled = DATAGRID_SPEC_ACCURATE_DEFAULTS.columnResizeEnabled;
    nameQuery = "";
    selectedTypes = [];
    selectedStatuses = [];
    selectedOwner = null;
    selectedRegion = null;
    typeOptions = this.distinctValues("type");
    statusOptions = this.distinctValues("status");
    ownerOptions = this.distinctValues("owner");
    regionOptions = this.distinctValues("region");
    constructor() {
        this.selectedTypes = [...this.typeOptions];
        this.selectedStatuses = [...this.statusOptions];
    }
    get filteredRows() {
        return this.allRows.filter((row) => {
            const name = String(row.values.name ?? "");
            if (this.nameQuery.trim() && !name.toLowerCase().includes(this.nameQuery.trim().toLowerCase())) {
                return false;
            }
            const type = String(row.values.type ?? "");
            if (this.selectedTypes.length > 0 && !this.selectedTypes.includes(type)) {
                return false;
            }
            const status = String(row.values.status ?? "");
            if (this.selectedStatuses.length > 0 && !this.selectedStatuses.includes(status)) {
                return false;
            }
            const owner = String(row.values.owner ?? "");
            if (this.selectedOwner != null && owner !== this.selectedOwner) {
                return false;
            }
            const region = String(row.values.region ?? "");
            if (this.selectedRegion != null && region !== this.selectedRegion) {
                return false;
            }
            return true;
        });
    }
    get nameFilterActive() {
        return this.nameQuery.trim().length > 0;
    }
    get typeFilterActive() {
        return (this.typeOptions.length > 0 &&
            (this.selectedTypes.length === 0 || this.selectedTypes.length < this.typeOptions.length));
    }
    get statusFilterActive() {
        return (this.statusOptions.length > 0 &&
            (this.selectedStatuses.length === 0 ||
                this.selectedStatuses.length < this.statusOptions.length));
    }
    get ownerFilterActive() {
        return this.selectedOwner != null;
    }
    get regionFilterActive() {
        return this.selectedRegion != null;
    }
    distinctValues(key) {
        const values = new Set();
        for (const row of this.allRows) {
            const value = row.values[key];
            if (value != null && String(value) !== "") {
                values.add(String(value));
            }
        }
        return [...values].sort((a, b) => a.localeCompare(b));
    }
    static ɵfac = function IdsDatagridDemoHostComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridDemoHostComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridDemoHostComponent, selectors: [["ids-datagrid-demo-host"]], inputs: { rowSelection: "rowSelection", selectionMode: "selectionMode", showSingleSelectionRadio: "showSingleSelectionRadio", withDetailPanel: "withDetailPanel", pageSize: "pageSize", readOnly: "readOnly", rowVerticalIndicator: "rowVerticalIndicator", headerColorAndBorder: "headerColorAndBorder", columnResizeEnabled: "columnResizeEnabled" }, decls: 19, vars: 47, consts: [[3, "rowSelection", "selectionMode", "showSingleSelectionRadio", "withDetailPanel", "pageSize", "readOnly", "rowVerticalIndicator", "headerColorAndBorder", "columnResizeEnabled"], ["field", "name", "title", "Name", 3, "sortable", "filterable", "width", "minWidth", "filterActive"], ["ariaLabel", "Search name column", 3, "queryChange", "query"], ["field", "type", "title", "Type", 3, "sortable", "filterable", "width", "minWidth", "columnHideable", "filterActive"], ["groupLabel", "Type", 3, "selectedValuesChange", "options", "selectedValues"], ["field", "status", "title", "Status", 3, "sortable", "filterable", "width", "minWidth", "columnHideable", "filterActive"], ["groupLabel", "Status", 3, "selectedValuesChange", "options", "selectedValues"], ["field", "owner", "title", "Owner", 3, "sortable", "filterable", "width", "minWidth", "columnHideable", "filterActive"], ["ariaLabel", "Filter owner column", 3, "selectedValueChange", "options", "selectedValue"], ["field", "region", "title", "Region", 3, "sortable", "filterable", "width", "minWidth", "columnHideable", "filterActive"], ["ariaLabel", "Filter region column", 3, "selectedValueChange", "options", "selectedValue"], [3, "rowId"], ["field", "name", 3, "value"], ["field", "type", 3, "value"], ["field", "status", 3, "value"], ["field", "owner", 3, "value"], ["field", "region", 3, "value"]], template: function IdsDatagridDemoHostComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ids-datagrid", 0)(1, "ids-datagrid-column", 1)(2, "ids-datagrid-filter")(3, "ids-datagrid-filter-search-field", 2);
            i0.ɵɵlistener("queryChange", function IdsDatagridDemoHostComponent_Template_ids_datagrid_filter_search_field_queryChange_3_listener($event) { return ctx.nameQuery = $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(4, "ids-datagrid-column", 3)(5, "ids-datagrid-filter")(6, "ids-datagrid-filter-multiselect", 4);
            i0.ɵɵlistener("selectedValuesChange", function IdsDatagridDemoHostComponent_Template_ids_datagrid_filter_multiselect_selectedValuesChange_6_listener($event) { return ctx.selectedTypes = $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(7, "ids-datagrid-column", 5)(8, "ids-datagrid-filter")(9, "ids-datagrid-filter-multiselect", 6);
            i0.ɵɵlistener("selectedValuesChange", function IdsDatagridDemoHostComponent_Template_ids_datagrid_filter_multiselect_selectedValuesChange_9_listener($event) { return ctx.selectedStatuses = $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(10, "ids-datagrid-column", 7)(11, "ids-datagrid-filter")(12, "ids-datagrid-filter-single-select", 8);
            i0.ɵɵlistener("selectedValueChange", function IdsDatagridDemoHostComponent_Template_ids_datagrid_filter_single_select_selectedValueChange_12_listener($event) { return ctx.selectedOwner = $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(13, "ids-datagrid-column", 9)(14, "ids-datagrid-filter")(15, "ids-datagrid-filter-single-select", 10);
            i0.ɵɵlistener("selectedValueChange", function IdsDatagridDemoHostComponent_Template_ids_datagrid_filter_single_select_selectedValueChange_15_listener($event) { return ctx.selectedRegion = $event; });
            i0.ɵɵelementEnd()()();
            i0.ɵɵrepeaterCreate(16, IdsDatagridDemoHostComponent_For_17_Template, 6, 6, "ids-datagrid-row", 11, _forTrack0);
            i0.ɵɵelement(18, "ids-datagrid-footer");
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("rowSelection", ctx.rowSelection)("selectionMode", ctx.selectionMode)("showSingleSelectionRadio", ctx.showSingleSelectionRadio)("withDetailPanel", ctx.withDetailPanel)("pageSize", ctx.pageSize)("readOnly", ctx.readOnly)("rowVerticalIndicator", ctx.rowVerticalIndicator)("headerColorAndBorder", ctx.headerColorAndBorder)("columnResizeEnabled", ctx.columnResizeEnabled);
            i0.ɵɵadvance();
            i0.ɵɵproperty("sortable", true)("filterable", true)("width", 200)("minWidth", 90)("filterActive", ctx.nameFilterActive);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("query", ctx.nameQuery);
            i0.ɵɵadvance();
            i0.ɵɵproperty("sortable", true)("filterable", true)("width", 140)("minWidth", 90)("columnHideable", true)("filterActive", ctx.typeFilterActive);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("options", ctx.typeOptions)("selectedValues", ctx.selectedTypes);
            i0.ɵɵadvance();
            i0.ɵɵproperty("sortable", true)("filterable", true)("width", 120)("minWidth", 90)("columnHideable", true)("filterActive", ctx.statusFilterActive);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("options", ctx.statusOptions)("selectedValues", ctx.selectedStatuses);
            i0.ɵɵadvance();
            i0.ɵɵproperty("sortable", true)("filterable", true)("width", 120)("minWidth", 90)("columnHideable", true)("filterActive", ctx.ownerFilterActive);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("options", ctx.ownerOptions)("selectedValue", ctx.selectedOwner);
            i0.ɵɵadvance();
            i0.ɵɵproperty("sortable", false)("filterable", true)("width", 100)("minWidth", 90)("columnHideable", true)("filterActive", ctx.regionFilterActive);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("options", ctx.regionOptions)("selectedValue", ctx.selectedRegion);
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.filteredRows);
        } }, dependencies: [IdsDatagridComponent,
            IdsDatagridColumnComponent,
            IdsDatagridRowComponent,
            IdsDatagridCellComponent,
            IdsDatagridFilterComponent,
            IdsDatagridFooterComponent,
            IdsDatagridFilterSearchFieldComponent,
            IdsDatagridFilterMultiselectComponent,
            IdsDatagridFilterSingleSelectComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridDemoHostComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid-demo-host", standalone: true, imports: [
                    IdsDatagridComponent,
                    IdsDatagridColumnComponent,
                    IdsDatagridRowComponent,
                    IdsDatagridCellComponent,
                    IdsDatagridFilterComponent,
                    IdsDatagridFooterComponent,
                    IdsDatagridFilterSearchFieldComponent,
                    IdsDatagridFilterMultiselectComponent,
                    IdsDatagridFilterSingleSelectComponent,
                ], template: "<ids-datagrid\n  [rowSelection]=\"rowSelection\"\n  [selectionMode]=\"selectionMode\"\n  [showSingleSelectionRadio]=\"showSingleSelectionRadio\"\n  [withDetailPanel]=\"withDetailPanel\"\n  [pageSize]=\"pageSize\"\n  [readOnly]=\"readOnly\"\n  [rowVerticalIndicator]=\"rowVerticalIndicator\"\n  [headerColorAndBorder]=\"headerColorAndBorder\"\n  [columnResizeEnabled]=\"columnResizeEnabled\"\n>\n  <ids-datagrid-column\n    field=\"name\"\n    title=\"Name\"\n    [sortable]=\"true\"\n    [filterable]=\"true\"\n    [width]=\"200\"\n    [minWidth]=\"90\"\n    [filterActive]=\"nameFilterActive\"\n  >\n    <ids-datagrid-filter>\n      <ids-datagrid-filter-search-field\n        ariaLabel=\"Search name column\"\n        [query]=\"nameQuery\"\n        (queryChange)=\"nameQuery = $event\"\n      />\n    </ids-datagrid-filter>\n  </ids-datagrid-column>\n\n  <ids-datagrid-column\n    field=\"type\"\n    title=\"Type\"\n    [sortable]=\"true\"\n    [filterable]=\"true\"\n    [width]=\"140\"\n    [minWidth]=\"90\"\n    [columnHideable]=\"true\"\n    [filterActive]=\"typeFilterActive\"\n  >\n    <ids-datagrid-filter>\n      <ids-datagrid-filter-multiselect\n        groupLabel=\"Type\"\n        [options]=\"typeOptions\"\n        [selectedValues]=\"selectedTypes\"\n        (selectedValuesChange)=\"selectedTypes = $event\"\n      />\n    </ids-datagrid-filter>\n  </ids-datagrid-column>\n\n  <ids-datagrid-column\n    field=\"status\"\n    title=\"Status\"\n    [sortable]=\"true\"\n    [filterable]=\"true\"\n    [width]=\"120\"\n    [minWidth]=\"90\"\n    [columnHideable]=\"true\"\n    [filterActive]=\"statusFilterActive\"\n  >\n    <ids-datagrid-filter>\n      <ids-datagrid-filter-multiselect\n        groupLabel=\"Status\"\n        [options]=\"statusOptions\"\n        [selectedValues]=\"selectedStatuses\"\n        (selectedValuesChange)=\"selectedStatuses = $event\"\n      />\n    </ids-datagrid-filter>\n  </ids-datagrid-column>\n\n  <ids-datagrid-column\n    field=\"owner\"\n    title=\"Owner\"\n    [sortable]=\"true\"\n    [filterable]=\"true\"\n    [width]=\"120\"\n    [minWidth]=\"90\"\n    [columnHideable]=\"true\"\n    [filterActive]=\"ownerFilterActive\"\n  >\n    <ids-datagrid-filter>\n      <ids-datagrid-filter-single-select\n        ariaLabel=\"Filter owner column\"\n        [options]=\"ownerOptions\"\n        [selectedValue]=\"selectedOwner\"\n        (selectedValueChange)=\"selectedOwner = $event\"\n      />\n    </ids-datagrid-filter>\n  </ids-datagrid-column>\n\n  <ids-datagrid-column\n    field=\"region\"\n    title=\"Region\"\n    [sortable]=\"false\"\n    [filterable]=\"true\"\n    [width]=\"100\"\n    [minWidth]=\"90\"\n    [columnHideable]=\"true\"\n    [filterActive]=\"regionFilterActive\"\n  >\n    <ids-datagrid-filter>\n      <ids-datagrid-filter-single-select\n        ariaLabel=\"Filter region column\"\n        [options]=\"regionOptions\"\n        [selectedValue]=\"selectedRegion\"\n        (selectedValueChange)=\"selectedRegion = $event\"\n      />\n    </ids-datagrid-filter>\n  </ids-datagrid-column>\n\n  @for (row of filteredRows; track row.id) {\n    <ids-datagrid-row [rowId]=\"row.id\">\n      <ids-datagrid-cell field=\"name\" [value]=\"row.values.name\" />\n      <ids-datagrid-cell field=\"type\" [value]=\"row.values.type\" />\n      <ids-datagrid-cell field=\"status\" [value]=\"row.values.status\" />\n      <ids-datagrid-cell field=\"owner\" [value]=\"row.values.owner\" />\n      <ids-datagrid-cell field=\"region\" [value]=\"row.values.region\" />\n    </ids-datagrid-row>\n  }\n\n  <ids-datagrid-footer />\n</ids-datagrid>\n" }]
    }], () => [], { rowSelection: [{
            type: Input
        }], selectionMode: [{
            type: Input
        }], showSingleSelectionRadio: [{
            type: Input
        }], withDetailPanel: [{
            type: Input
        }], pageSize: [{
            type: Input
        }], readOnly: [{
            type: Input
        }], rowVerticalIndicator: [{
            type: Input
        }], headerColorAndBorder: [{
            type: Input
        }], columnResizeEnabled: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridDemoHostComponent, { className: "IdsDatagridDemoHostComponent", filePath: "src/components/ids-datagrid/ids-datagrid-demo-host.component.ts", lineNumber: 36 }); })();
