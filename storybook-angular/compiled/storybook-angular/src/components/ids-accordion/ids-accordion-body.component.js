import { Component, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-accordion-content"]], [["ids-accordion-meta"]], [["ids-accordion-form-slot"]]];
const _c1 = ["ids-accordion-content", "ids-accordion-meta", "ids-accordion-form-slot"];
function IdsAccordionBodyComponent_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 2);
} }
function IdsAccordionBodyComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 0);
    i0.ɵɵprojection(1);
    i0.ɵɵprojection(2, 1);
    i0.ɵɵconditionalCreate(3, IdsAccordionBodyComponent_Conditional_0_Conditional_3_Template, 1, 0);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵdomProperty("id", ctx_r0.accordion.panelId(ctx_r0.item.value));
    i0.ɵɵattribute("aria-labelledby", ctx_r0.accordion.triggerId(ctx_r0.item.value))("data-open", "true");
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.accordion.variant === "form" ? 3 : -1);
} }
export class IdsAccordionBodyComponent {
    accordion = inject(IDS_ACCORDION_CONTEXT);
    item = inject(IdsAccordionItemComponent);
    static ɵfac = function IdsAccordionBodyComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionBodyComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionBodyComponent, selectors: [["ids-accordion-body"]], ngContentSelectors: _c1, decls: 1, vars: 1, consts: [["role", "region", 1, "ids-accordion__panel", 3, "id"]], template: function IdsAccordionBodyComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵconditionalCreate(0, IdsAccordionBodyComponent_Conditional_0_Template, 4, 4, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.item.isOpen() ? 0 : -1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionBodyComponent, [{
        type: Component,
        args: [{ selector: "ids-accordion-body", standalone: true, template: "@if (item.isOpen()) {\n  <div\n    class=\"ids-accordion__panel\"\n    [id]=\"accordion.panelId(item.value)\"\n    role=\"region\"\n    [attr.aria-labelledby]=\"accordion.triggerId(item.value)\"\n    [attr.data-open]=\"'true'\"\n  >\n    <ng-content select=\"ids-accordion-content\" />\n    <ng-content select=\"ids-accordion-meta\" />\n    @if (accordion.variant === \"form\") {\n      <ng-content select=\"ids-accordion-form-slot\" />\n    }\n  </div>\n}\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionBodyComponent, { className: "IdsAccordionBodyComponent", filePath: "src/components/ids-accordion/ids-accordion-body.component.ts", lineNumber: 10 }); })();
