import { Component, ViewEncapsulation } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Optional tooltip header slot — Body 2 Medium (`Header` in design spec). */
export class IdsTooltipTitleComponent {
    static ɵfac = function IdsTooltipTitleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTooltipTitleComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTooltipTitleComponent, selectors: [["ids-tooltip-title"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-tooltip__title"]], template: function IdsTooltipTitleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTooltipTitleComponent, [{
        type: Component,
        args: [{ selector: "ids-tooltip-title", standalone: true, template: `<div class="ids-tooltip__title"><ng-content /></div>`, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTooltipTitleComponent, { className: "IdsTooltipTitleComponent", filePath: "src/components/ids-tooltip/ids-tooltip-title.component.ts", lineNumber: 11 }); })();
