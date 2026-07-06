import { Component, Input, inject, } from "@angular/core";
import { IDS_DATAGRID_CONTEXT } from "./ids-datagrid-context";
import { IdsDatagridRowComponent } from "./ids-datagrid-row.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsDatagridCellComponent_ProjectionFallback_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate(ctx_r0.value);
} }
export class IdsDatagridCellComponent {
    grid = inject(IDS_DATAGRID_CONTEXT);
    row = inject(IdsDatagridRowComponent);
    field;
    value = "";
    ngOnChanges(_changes) {
        this.sync();
    }
    sync() {
        this.grid.setRowCell(this.row.rowId, this.field, String(this.value ?? ""));
    }
    static ɵfac = function IdsDatagridCellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridCellComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridCellComponent, selectors: [["ids-datagrid-cell"]], inputs: { field: "field", value: "value" }, features: [i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 2, vars: 0, template: function IdsDatagridCellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0, 0, null, IdsDatagridCellComponent_ProjectionFallback_0_Template, 1, 1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridCellComponent, [{
        type: Component,
        args: [{
                selector: "ids-datagrid-cell",
                standalone: true,
                template: `<ng-content>{{ value }}</ng-content>`,
            }]
    }], null, { field: [{
            type: Input,
            args: [{ required: true }]
        }], value: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridCellComponent, { className: "IdsDatagridCellComponent", filePath: "src/components/ids-datagrid/ids-datagrid-cell.component.ts", lineNumber: 16 }); })();
