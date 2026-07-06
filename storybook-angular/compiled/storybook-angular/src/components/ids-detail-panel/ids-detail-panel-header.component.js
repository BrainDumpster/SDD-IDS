import { Component, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Detail panel header slot — title projection for datagrid-attached expanded mode. */
export class IdsDetailPanelHeaderComponent {
    static ɵfac = function IdsDetailPanelHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDetailPanelHeaderComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDetailPanelHeaderComponent, selectors: [["ids-detail-panel-header"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDetailPanelHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDetailPanelHeaderComponent, [{
        type: Component,
        args: [{ selector: "ids-detail-panel-header", standalone: true, template: `<ng-content />`, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDetailPanelHeaderComponent, { className: "IdsDetailPanelHeaderComponent", filePath: "src/components/ids-detail-panel/ids-detail-panel-header.component.ts", lineNumber: 11 }); })();
