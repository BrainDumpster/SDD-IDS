import { Component, ContentChild, Input, inject, } from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridFilterComponent } from "./ids-datagrid-filter.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsDatagridColumnComponent {
    grid = inject(IDS_DATAGRID_CONTEXT);
    key;
    title;
    minWidth;
    width;
    sortable = false;
    filterable = false;
    filterActive = false;
    columnHideable = false;
    filterChild;
    ngAfterContentInit() {
        this.syncColumn();
    }
    ngOnChanges(_changes) {
        this.syncColumn();
    }
    ngOnDestroy() {
        this.grid.unregisterColumn(this.key);
    }
    syncRegistration() {
        this.syncColumn();
    }
    syncColumn() {
        this.grid.registerColumn({
            field: this.key,
            title: this.title,
            minWidth: this.minWidth,
            width: this.width,
            sortable: this.sortable,
            filterable: this.filterable,
            filterActive: this.filterActive,
            columnHideable: this.columnHideable,
            filterTemplate: this.filterChild?.template ?? null,
        });
    }
    static ɵfac = function IdsDatagridColumnComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridColumnComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridColumnComponent, selectors: [["ids-datagrid-column"]], contentQueries: function IdsDatagridColumnComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDatagridFilterComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.filterChild = _t.first);
        } }, inputs: { key: [0, "field", "key"], title: "title", minWidth: "minWidth", width: "width", sortable: "sortable", filterable: "filterable", filterActive: "filterActive", columnHideable: "columnHideable" }, features: [i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDatagridColumnComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridColumnComponent, [{
        type: Component,
        args: [{
                selector: "ids-datagrid-column",
                standalone: true,
                template: `<ng-content />`,
            }]
    }], null, { key: [{
            type: Input,
            args: [{ alias: "field", required: true }]
        }], title: [{
            type: Input,
            args: [{ required: true }]
        }], minWidth: [{
            type: Input
        }], width: [{
            type: Input
        }], sortable: [{
            type: Input
        }], filterable: [{
            type: Input
        }], filterActive: [{
            type: Input
        }], columnHideable: [{
            type: Input
        }], filterChild: [{
            type: ContentChild,
            args: [IdsDatagridFilterComponent]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridColumnComponent, { className: "IdsDatagridColumnComponent", filePath: "src/components/ids-datagrid/ids-datagrid-column.component.ts", lineNumber: 19 }); })();
