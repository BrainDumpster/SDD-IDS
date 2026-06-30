import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Optional product logo slot — omit entirely when no product mark is needed (Figma `Show Product Icon=No`). */
export class IdsMastheadLogoComponent {
    static ɵfac = function IdsMastheadLogoComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMastheadLogoComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMastheadLogoComponent, selectors: [["ids-masthead-logo"], ["", "mastheadLogo", ""]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsMastheadLogoComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMastheadLogoComponent, [{
        type: Component,
        args: [{
                selector: "ids-masthead-logo, [mastheadLogo]",
                standalone: true,
                template: `<ng-content />`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMastheadLogoComponent, { className: "IdsMastheadLogoComponent", filePath: "src/components/ids-masthead/ids-masthead-logo.component.ts", lineNumber: 9 }); })();
