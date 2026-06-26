import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsAccordionMetaComponent {
    static ɵfac = function IdsAccordionMetaComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionMetaComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionMetaComponent, selectors: [["ids-accordion-meta"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-accordion__meta"]], template: function IdsAccordionMetaComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionMetaComponent, [{
        type: Component,
        args: [{
                selector: "ids-accordion-meta",
                standalone: true,
                template: `<div class="ids-accordion__meta"><ng-content /></div>`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionMetaComponent, { className: "IdsAccordionMetaComponent", filePath: "src/components/ids-accordion/ids-accordion-meta.component.ts", lineNumber: 8 }); })();
