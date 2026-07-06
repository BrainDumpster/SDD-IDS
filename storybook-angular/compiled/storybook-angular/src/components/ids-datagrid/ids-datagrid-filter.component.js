import { Component, ViewChild } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["filterTemplate"];
const _c1 = ["*"];
function IdsDatagridFilterComponent_ng_template_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0);
} }
export class IdsDatagridFilterComponent {
    template;
    static ɵfac = function IdsDatagridFilterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridFilterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridFilterComponent, selectors: [["ids-datagrid-filter"]], viewQuery: function IdsDatagridFilterComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 7);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.template = _t.first);
        } }, ngContentSelectors: _c1, decls: 2, vars: 0, consts: [["filterTemplate", ""]], template: function IdsDatagridFilterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomTemplate(0, IdsDatagridFilterComponent_ng_template_0_Template, 1, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridFilterComponent, [{
        type: Component,
        args: [{
                selector: "ids-datagrid-filter",
                standalone: true,
                template: `<ng-template #filterTemplate><ng-content /></ng-template>`,
            }]
    }], null, { template: [{
            type: ViewChild,
            args: ["filterTemplate", { static: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridFilterComponent, { className: "IdsDatagridFilterComponent", filePath: "src/components/ids-datagrid/ids-datagrid-filter.component.ts", lineNumber: 8 }); })();
