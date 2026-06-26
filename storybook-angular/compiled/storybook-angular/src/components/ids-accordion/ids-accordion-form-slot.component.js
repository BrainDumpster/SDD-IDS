import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsAccordionFormSlotComponent {
    static ɵfac = function IdsAccordionFormSlotComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionFormSlotComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionFormSlotComponent, selectors: [["ids-accordion-form-slot"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-accordion__form-slot"]], template: function IdsAccordionFormSlotComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionFormSlotComponent, [{
        type: Component,
        args: [{
                selector: "ids-accordion-form-slot",
                standalone: true,
                template: `<div class="ids-accordion__form-slot"><ng-content /></div>`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionFormSlotComponent, { className: "IdsAccordionFormSlotComponent", filePath: "src/components/ids-accordion/ids-accordion-form-slot.component.ts", lineNumber: 8 }); })();
