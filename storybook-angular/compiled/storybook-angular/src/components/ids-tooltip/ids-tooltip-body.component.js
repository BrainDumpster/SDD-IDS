import { Component, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Required tooltip body slot — maps to spec `BodyContent`. */
export class IdsTooltipBodyComponent {
    static ɵfac = function IdsTooltipBodyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTooltipBodyComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTooltipBodyComponent, selectors: [["ids-tooltip-body"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-tooltip__body"]], template: function IdsTooltipBodyComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTooltipBodyComponent, [{
        type: Component,
        args: [{ selector: "ids-tooltip-body", standalone: true, template: `<div class="ids-tooltip__body"><ng-content /></div>`, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTooltipBodyComponent, { className: "IdsTooltipBodyComponent", filePath: "src/components/ids-tooltip/ids-tooltip-body.component.ts", lineNumber: 11 }); })();
