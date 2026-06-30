import { Component, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsMastheadActionButtonContainerComponent {
    static ɵfac = function IdsMastheadActionButtonContainerComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMastheadActionButtonContainerComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMastheadActionButtonContainerComponent, selectors: [["ids-masthead-action-button-container"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-masthead-action-button-container"]], template: function IdsMastheadActionButtonContainerComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, styles: ["\n      .ids-masthead-action-button-container {\n        display: inline-flex;\n        align-items: center;\n        gap: 0;\n      }\n    "], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMastheadActionButtonContainerComponent, [{
        type: Component,
        args: [{ selector: "ids-masthead-action-button-container", standalone: true, template: `<div class="ids-masthead-action-button-container"><ng-content /></div>`, encapsulation: ViewEncapsulation.None, styles: ["\n      .ids-masthead-action-button-container {\n        display: inline-flex;\n        align-items: center;\n        gap: 0;\n      }\n    "] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMastheadActionButtonContainerComponent, { className: "IdsMastheadActionButtonContainerComponent", filePath: "src/components/ids-masthead/ids-masthead-action-button-container.component.ts", lineNumber: 18 }); })();
