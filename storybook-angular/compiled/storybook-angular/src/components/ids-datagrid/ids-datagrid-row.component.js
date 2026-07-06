import { Component, ContentChildren, Input, inject } from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridCellComponent } from "./ids-datagrid-cell.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsDatagridRowComponent {
    grid = inject(IDS_DATAGRID_CONTEXT);
    rowId;
    cellQuery;
    ngOnInit() {
        this.grid.registerRow({ rowId: this.rowId, cells: new Map() });
    }
    ngOnDestroy() {
        this.grid.unregisterRow(this.rowId);
    }
    static ɵfac = function IdsDatagridRowComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridRowComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridRowComponent, selectors: [["ids-datagrid-row"]], contentQueries: function IdsDatagridRowComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDatagridCellComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.cellQuery = _t);
        } }, inputs: { rowId: "rowId" }, ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDatagridRowComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridRowComponent, [{
        type: Component,
        args: [{
                selector: "ids-datagrid-row",
                standalone: true,
                template: `<ng-content />`,
            }]
    }], null, { rowId: [{
            type: Input,
            args: [{ required: true }]
        }], cellQuery: [{
            type: ContentChildren,
            args: [IdsDatagridCellComponent]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridRowComponent, { className: "IdsDatagridRowComponent", filePath: "src/components/ids-datagrid/ids-datagrid-row.component.ts", lineNumber: 10 }); })();
