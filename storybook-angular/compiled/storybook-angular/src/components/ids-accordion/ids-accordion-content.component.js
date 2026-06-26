import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsAccordionContentComponent {
    static ɵfac = function IdsAccordionContentComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionContentComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionContentComponent, selectors: [["ids-accordion-content"]], ngContentSelectors: _c0, decls: 3, vars: 0, consts: [[1, "ids-accordion__content"], [1, "ids-accordion__content-card"]], template: function IdsAccordionContentComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵprojection(2);
            i0.ɵɵdomElementEnd()();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionContentComponent, [{
        type: Component,
        args: [{
                selector: "ids-accordion-content",
                standalone: true,
                template: `
    <div class="ids-accordion__content">
      <div class="ids-accordion__content-card">
        <ng-content />
      </div>
    </div>
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionContentComponent, { className: "IdsAccordionContentComponent", filePath: "src/components/ids-accordion/ids-accordion-content.component.ts", lineNumber: 14 }); })();
