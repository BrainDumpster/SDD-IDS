import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Inline detailed title slot — spec `AlertTitle`. */
export class IdsAlertTitleComponent {
    static ɵfac = function IdsAlertTitleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertTitleComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertTitleComponent, selectors: [["ids-alert-title"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-alert__inline-title"]], template: function IdsAlertTitleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "p", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertTitleComponent, [{
        type: Component,
        args: [{
                selector: "ids-alert-title",
                standalone: true,
                template: `<p class="ids-alert__inline-title"><ng-content /></p>`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertTitleComponent, { className: "IdsAlertTitleComponent", filePath: "src/components/ids-alert/ids-alert-title.component.ts", lineNumber: 9 }); })();
