import { Component, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsAccordionHeaderComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 4);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("mask-image", ctx_r0.iconMask());
} }
function IdsAccordionHeaderComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 4);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("mask-image", ctx_r0.iconMask());
} }
export class IdsAccordionHeaderComponent {
    accordion = inject(IDS_ACCORDION_CONTEXT);
    item = inject(IdsAccordionItemComponent);
    iconMask() {
        return `url(/assets/icons/${this.accordion.chevronSlug}.svg)`;
    }
    onClick() {
        this.item.toggle();
    }
    onKeydown(event) {
        this.accordion.onTriggerKeydown(event, this.item);
    }
    onFocus() {
        this.accordion.onTriggerFocus(this.item);
    }
    static ɵfac = function IdsAccordionHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionHeaderComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionHeaderComponent, selectors: [["ids-accordion-header"]], ngContentSelectors: _c0, decls: 6, vars: 16, consts: [[1, "ids-accordion__header"], ["type", "button", 1, "ids-accordion__trigger", 3, "click", "keydown", "focus", "id", "disabled", "tabIndex"], ["aria-hidden", "true", 1, "ids-accordion__icon", 3, "mask-image"], [1, "ids-accordion__title"], ["aria-hidden", "true", 1, "ids-accordion__icon"]], template: function IdsAccordionHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "h3", 0)(1, "button", 1);
            i0.ɵɵdomListener("click", function IdsAccordionHeaderComponent_Template_button_click_1_listener() { return ctx.onClick(); })("keydown", function IdsAccordionHeaderComponent_Template_button_keydown_1_listener($event) { return ctx.onKeydown($event); })("focus", function IdsAccordionHeaderComponent_Template_button_focus_1_listener() { return ctx.onFocus(); });
            i0.ɵɵconditionalCreate(2, IdsAccordionHeaderComponent_Conditional_2_Template, 1, 2, "span", 2);
            i0.ɵɵdomElementStart(3, "span", 3);
            i0.ɵɵprojection(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(5, IdsAccordionHeaderComponent_Conditional_5_Template, 1, 2, "span", 2);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵclassProp("ids-accordion__trigger--left", ctx.accordion.chevronPosition === "left")("ids-accordion__trigger--right", ctx.accordion.chevronPosition === "right")("ids-accordion__trigger--open", ctx.item.isOpen())("ids-accordion__trigger--disabled", ctx.item.disabled);
            i0.ɵɵdomProperty("id", ctx.accordion.triggerId(ctx.item.value))("disabled", ctx.item.disabled)("tabIndex", ctx.accordion.triggerTabIndex(ctx.item));
            i0.ɵɵattribute("aria-expanded", ctx.item.isOpen())("aria-controls", ctx.accordion.panelId(ctx.item.value))("data-panel-open", ctx.item.isOpen() ? "true" : null);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.accordion.chevronPosition === "left" ? 2 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.accordion.chevronPosition === "right" ? 5 : -1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionHeaderComponent, [{
        type: Component,
        args: [{ selector: "ids-accordion-header", standalone: true, template: "<h3 class=\"ids-accordion__header\">\n  <button\n    type=\"button\"\n    class=\"ids-accordion__trigger\"\n    [class.ids-accordion__trigger--left]=\"accordion.chevronPosition === 'left'\"\n    [class.ids-accordion__trigger--right]=\"accordion.chevronPosition === 'right'\"\n    [class.ids-accordion__trigger--open]=\"item.isOpen()\"\n    [class.ids-accordion__trigger--disabled]=\"item.disabled\"\n    [id]=\"accordion.triggerId(item.value)\"\n    [attr.aria-expanded]=\"item.isOpen()\"\n    [attr.aria-controls]=\"accordion.panelId(item.value)\"\n    [attr.data-panel-open]=\"item.isOpen() ? 'true' : null\"\n    [disabled]=\"item.disabled\"\n    [tabIndex]=\"accordion.triggerTabIndex(item)\"\n    (click)=\"onClick()\"\n    (keydown)=\"onKeydown($event)\"\n    (focus)=\"onFocus()\"\n  >\n    @if (accordion.chevronPosition === \"left\") {\n      <span\n        class=\"ids-accordion__icon\"\n        [style.mask-image]=\"iconMask()\"\n        aria-hidden=\"true\"\n      ></span>\n    }\n    <span class=\"ids-accordion__title\"><ng-content /></span>\n    @if (accordion.chevronPosition === \"right\") {\n      <span\n        class=\"ids-accordion__icon\"\n        [style.mask-image]=\"iconMask()\"\n        aria-hidden=\"true\"\n      ></span>\n    }\n  </button>\n</h3>\n" }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionHeaderComponent, { className: "IdsAccordionHeaderComponent", filePath: "src/components/ids-accordion/ids-accordion-header.component.ts", lineNumber: 10 }); })();
