import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Optional footer slot — pagination is grid-owned below the scroll clip. */
export class IdsDatagridFooterComponent {
    static ɵfac = function IdsDatagridFooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridFooterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridFooterComponent, selectors: [["ids-datagrid-footer"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDatagridFooterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridFooterComponent, [{
        type: Component,
        args: [{
                selector: "ids-datagrid-footer",
                standalone: true,
                template: `<ng-content />`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridFooterComponent, { className: "IdsDatagridFooterComponent", filePath: "src/components/ids-datagrid/ids-datagrid-footer.component.ts", lineNumber: 9 }); })();
