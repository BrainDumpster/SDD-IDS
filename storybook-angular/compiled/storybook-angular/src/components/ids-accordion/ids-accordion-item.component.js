import { Component, HostBinding, Input, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";
import * as i0 from "@angular/core";
const _c0 = [[["ids-accordion-header"]], [["ids-accordion-body"]]];
const _c1 = ["ids-accordion-header", "ids-accordion-body"];
export class IdsAccordionItemComponent {
    accordion = inject(IDS_ACCORDION_CONTEXT);
    value;
    disabled = false;
    /** Set by AccordionRoot from ContentChildren order. */
    itemIndex = 0;
    display = "block";
    itemClass = true;
    get openClass() {
        return this.accordion.isOpen(this.value);
    }
    get firstClass() {
        return this.itemIndex === 0;
    }
    get dataOpen() {
        return this.accordion.isOpen(this.value) ? "true" : null;
    }
    setItemIndex(index) {
        this.itemIndex = index;
    }
    isOpen() {
        return this.accordion.isOpen(this.value);
    }
    toggle() {
        this.accordion.toggleItem(this);
    }
    static ɵfac = function IdsAccordionItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionItemComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionItemComponent, selectors: [["ids-accordion-item"]], hostVars: 9, hostBindings: function IdsAccordionItemComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("data-open", ctx.dataOpen);
            i0.ɵɵstyleProp("display", ctx.display);
            i0.ɵɵclassProp("ids-accordion__item", ctx.itemClass)("ids-accordion__item--open", ctx.openClass)("ids-accordion__item--first", ctx.firstClass);
        } }, inputs: { value: "value", disabled: "disabled" }, ngContentSelectors: _c1, decls: 2, vars: 0, template: function IdsAccordionItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵprojection(0);
            i0.ɵɵprojection(1, 1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionItemComponent, [{
        type: Component,
        args: [{
                selector: "ids-accordion-item",
                standalone: true,
                template: `
    <ng-content select="ids-accordion-header" />
    <ng-content select="ids-accordion-body" />
  `,
            }]
    }], null, { value: [{
            type: Input,
            args: [{ required: true }]
        }], disabled: [{
            type: Input
        }], display: [{
            type: HostBinding,
            args: ["style.display"]
        }], itemClass: [{
            type: HostBinding,
            args: ["class.ids-accordion__item"]
        }], openClass: [{
            type: HostBinding,
            args: ["class.ids-accordion__item--open"]
        }], firstClass: [{
            type: HostBinding,
            args: ["class.ids-accordion__item--first"]
        }], dataOpen: [{
            type: HostBinding,
            args: ["attr.data-open"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionItemComponent, { className: "IdsAccordionItemComponent", filePath: "src/components/ids-accordion/ids-accordion-item.component.ts", lineNumber: 12 }); })();
