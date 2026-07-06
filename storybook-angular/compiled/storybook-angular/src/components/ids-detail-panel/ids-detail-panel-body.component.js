import { Component, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Detail panel body slot — scrollable content region. */
export class IdsDetailPanelBodyComponent {
    static ɵfac = function IdsDetailPanelBodyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDetailPanelBodyComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDetailPanelBodyComponent, selectors: [["ids-detail-panel-body"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDetailPanelBodyComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDetailPanelBodyComponent, [{
        type: Component,
        args: [{ selector: "ids-detail-panel-body", standalone: true, template: `<ng-content />`, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDetailPanelBodyComponent, { className: "IdsDetailPanelBodyComponent", filePath: "src/components/ids-detail-panel/ids-detail-panel-body.component.ts", lineNumber: 11 }); })();
