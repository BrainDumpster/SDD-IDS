import { Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { ACCORDION_CHEVRON_ICON_SLUG, } from "../../../../component-contracts/ids/accordion.contract.js";
import { IDS_ACCORDION_CONTEXT, } from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsAccordionComponent {
    chevronSlug = ACCORDION_CHEVRON_ICON_SLUG;
    itemQuery;
    multiple = false;
    defaultValue = [];
    chevronPosition = "left";
    variant = "default";
    valueChange = new EventEmitter();
    openValues = new Set();
    focusedIndex = 0;
    items = [];
    ngOnInit() {
        this.syncOpenValues();
    }
    ngOnChanges(changes) {
        if (changes["defaultValue"]) {
            this.syncOpenValues();
        }
    }
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    syncOpenValues() {
        this.openValues = new Set(this.defaultValue ?? []);
    }
    bindItems() {
        this.registerItems(this.itemQuery.toArray());
    }
    registerItems(items) {
        this.items = [...items];
        items.forEach((item, index) => item.setItemIndex(index));
        if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = Math.max(0, this.items.length - 1);
        }
    }
    isOpen(value) {
        return this.openValues.has(value);
    }
    toggleItem(item) {
        if (item.disabled) {
            return;
        }
        const index = this.items.indexOf(item);
        const next = new Set(this.openValues);
        if (next.has(item.value)) {
            next.delete(item.value);
        }
        else {
            if (!this.multiple) {
                next.clear();
            }
            next.add(item.value);
        }
        this.openValues = next;
        this.focusedIndex = index;
        this.valueChange.emit([...next]);
    }
    onTriggerKeydown(event, item) {
        const index = this.items.indexOf(item);
        const enabledIndices = this.items
            .map((row, i) => (row.disabled ? -1 : i))
            .filter((i) => i >= 0);
        if (!enabledIndices.length) {
            return;
        }
        const currentPos = enabledIndices.indexOf(index);
        let targetIndex = index;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
                break;
            case "ArrowUp":
                event.preventDefault();
                targetIndex =
                    enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
                break;
            case "Home":
                event.preventDefault();
                targetIndex = enabledIndices[0];
                break;
            case "End":
                event.preventDefault();
                targetIndex = enabledIndices[enabledIndices.length - 1];
                break;
            case " ":
            case "Enter":
                event.preventDefault();
                this.toggleItem(item);
                return;
            default:
                return;
        }
        this.focusedIndex = targetIndex;
        const targetValue = this.items[targetIndex]?.value;
        if (targetValue) {
            document.getElementById(this.triggerId(targetValue))?.focus();
        }
    }
    onTriggerFocus(item) {
        this.focusedIndex = this.items.indexOf(item);
    }
    triggerTabIndex(item) {
        const index = this.items.indexOf(item);
        return index === this.focusedIndex ? 0 : -1;
    }
    panelId(value) {
        return `ids-accordion-panel-${value}`;
    }
    triggerId(value) {
        return `ids-accordion-trigger-${value}`;
    }
    static ɵfac = function IdsAccordionComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAccordionComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAccordionComponent, selectors: [["ids-accordion"]], contentQueries: function IdsAccordionComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsAccordionItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, inputs: { multiple: "multiple", defaultValue: "defaultValue", chevronPosition: "chevronPosition", variant: "variant" }, outputs: { valueChange: "valueChange" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_ACCORDION_CONTEXT, useExisting: IdsAccordionComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 2, vars: 2, consts: [["role", "presentation", 1, "ids-accordion"]], template: function IdsAccordionComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-accordion--form", ctx.variant === "form");
        } }, styles: ["/* Single stylesheet for all accordion slots (ngc inlines this file; do not @use partials). */\n\nids-accordion-item,\nids-accordion-header,\nids-accordion-body,\nids-accordion-content,\nids-accordion-meta,\nids-accordion-form-slot {\n  display: block;\n}\n\n.ids-accordion {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.ids-accordion--form {\n  background: var(--color-background-component);\n}\n\n.ids-accordion__item {\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  margin-top: calc(-1 * var(--border-width-border-1));\n  background: var(--color-background-component);\n}\n\n.ids-accordion__item--first {\n  margin-top: 0;\n}\n\n.ids-accordion__header {\n  margin: 0;\n}\n\n.ids-accordion__trigger {\n  width: 100%;\n  height: var(--scale-40);\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-12) var(--padding-padding-16);\n  border: 0;\n  cursor: pointer;\n  text-align: left;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral-strong);\n  font: inherit;\n}\n\n.ids-accordion__trigger--left {\n  justify-content: flex-start;\n}\n\n.ids-accordion__trigger--right {\n  justify-content: space-between;\n}\n\n.ids-accordion__title {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n}\n\n.ids-accordion__icon {\n  display: inline-block;\n  width: var(--scale-16);\n  height: var(--scale-16);\n  flex-shrink: 0;\n  background-color: currentColor;\n  color: var(--color-icon-neutral);\n  mask-repeat: no-repeat;\n  mask-position: center;\n  mask-size: contain;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n  transition: transform 120ms ease;\n}\n\n.ids-accordion__trigger:hover:not(:disabled) {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-accordion__trigger:hover:not(:disabled) .ids-accordion__icon {\n  color: var(--color-icon-neutral-strong);\n}\n\n.ids-accordion__trigger:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-accordion__trigger--disabled,\n.ids-accordion__trigger:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ids-accordion__trigger--open,\n.ids-accordion__item--open .ids-accordion__trigger {\n  background-color: var(--color-background-brand-lighter);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-brand-lighter) 4px,\n    var(--color-background-brand-lighter) 100%\n  );\n}\n\n.ids-accordion__trigger--open:hover:not(:disabled),\n.ids-accordion__item--open .ids-accordion__trigger:hover:not(:disabled) {\n  background-color: var(--color-background-brand-light);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-brand-light) 4px,\n    var(--color-background-brand-light) 100%\n  );\n}\n\n.ids-accordion__trigger--open .ids-accordion__icon,\n.ids-accordion__item--open .ids-accordion__icon {\n  transform: rotate(180deg);\n  color: var(--color-icon-neutral);\n}\n\n.ids-accordion__panel {\n  overflow: hidden;\n}\n\n.ids-accordion__content {\n  padding: var(--padding-padding-8) var(--padding-padding-24) var(--padding-padding-16)\n    calc(var(--padding-padding-32) + var(--padding-padding-8));\n  background-color: var(--color-background-component);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-component) 4px,\n    var(--color-background-component) 100%\n  );\n}\n\n.ids-accordion__content-card {\n  padding: var(--padding-padding-24);\n  background-color: var(--color-background-brand-lighter);\n  border-width: var(--border-width-border-1);\n  border-style: solid;\n  border-color: var(--color-border-brand-dark);\n  border-top: none;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.ids-accordion__meta,\n.ids-accordion__form-slot {\n  padding: 0 var(--padding-padding-24) var(--padding-padding-16)\n    calc(var(--padding-padding-32) + var(--padding-padding-8));\n  background-color: var(--color-background-component);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-component) 4px,\n    var(--color-background-component) 100%\n  );\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.ids-accordion__form-slot-label {\n  display: block;\n  margin-top: var(--spacing-space-8);\n  font-size: 12px;\n  opacity: 0.85;\n}\n"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAccordionComponent, [{
        type: Component,
        args: [{ selector: "ids-accordion", standalone: true, encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_ACCORDION_CONTEXT, useExisting: IdsAccordionComponent }], template: "<div\n  class=\"ids-accordion\"\n  [class.ids-accordion--form]=\"variant === 'form'\"\n  role=\"presentation\"\n>\n  <ng-content />\n</div>\n", styles: ["/* Single stylesheet for all accordion slots (ngc inlines this file; do not @use partials). */\n\nids-accordion-item,\nids-accordion-header,\nids-accordion-body,\nids-accordion-content,\nids-accordion-meta,\nids-accordion-form-slot {\n  display: block;\n}\n\n.ids-accordion {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.ids-accordion--form {\n  background: var(--color-background-component);\n}\n\n.ids-accordion__item {\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  margin-top: calc(-1 * var(--border-width-border-1));\n  background: var(--color-background-component);\n}\n\n.ids-accordion__item--first {\n  margin-top: 0;\n}\n\n.ids-accordion__header {\n  margin: 0;\n}\n\n.ids-accordion__trigger {\n  width: 100%;\n  height: var(--scale-40);\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-12) var(--padding-padding-16);\n  border: 0;\n  cursor: pointer;\n  text-align: left;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral-strong);\n  font: inherit;\n}\n\n.ids-accordion__trigger--left {\n  justify-content: flex-start;\n}\n\n.ids-accordion__trigger--right {\n  justify-content: space-between;\n}\n\n.ids-accordion__title {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n}\n\n.ids-accordion__icon {\n  display: inline-block;\n  width: var(--scale-16);\n  height: var(--scale-16);\n  flex-shrink: 0;\n  background-color: currentColor;\n  color: var(--color-icon-neutral);\n  mask-repeat: no-repeat;\n  mask-position: center;\n  mask-size: contain;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n  transition: transform 120ms ease;\n}\n\n.ids-accordion__trigger:hover:not(:disabled) {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-accordion__trigger:hover:not(:disabled) .ids-accordion__icon {\n  color: var(--color-icon-neutral-strong);\n}\n\n.ids-accordion__trigger:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-accordion__trigger--disabled,\n.ids-accordion__trigger:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ids-accordion__trigger--open,\n.ids-accordion__item--open .ids-accordion__trigger {\n  background-color: var(--color-background-brand-lighter);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-brand-lighter) 4px,\n    var(--color-background-brand-lighter) 100%\n  );\n}\n\n.ids-accordion__trigger--open:hover:not(:disabled),\n.ids-accordion__item--open .ids-accordion__trigger:hover:not(:disabled) {\n  background-color: var(--color-background-brand-light);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-brand-light) 4px,\n    var(--color-background-brand-light) 100%\n  );\n}\n\n.ids-accordion__trigger--open .ids-accordion__icon,\n.ids-accordion__item--open .ids-accordion__icon {\n  transform: rotate(180deg);\n  color: var(--color-icon-neutral);\n}\n\n.ids-accordion__panel {\n  overflow: hidden;\n}\n\n.ids-accordion__content {\n  padding: var(--padding-padding-8) var(--padding-padding-24) var(--padding-padding-16)\n    calc(var(--padding-padding-32) + var(--padding-padding-8));\n  background-color: var(--color-background-component);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-component) 4px,\n    var(--color-background-component) 100%\n  );\n}\n\n.ids-accordion__content-card {\n  padding: var(--padding-padding-24);\n  background-color: var(--color-background-brand-lighter);\n  border-width: var(--border-width-border-1);\n  border-style: solid;\n  border-color: var(--color-border-brand-dark);\n  border-top: none;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.ids-accordion__meta,\n.ids-accordion__form-slot {\n  padding: 0 var(--padding-padding-24) var(--padding-padding-16)\n    calc(var(--padding-padding-32) + var(--padding-padding-8));\n  background-color: var(--color-background-component);\n  background-image: linear-gradient(\n    90deg,\n    var(--color-border-brand-base) 0,\n    var(--color-border-brand-base) 4px,\n    var(--color-background-component) 4px,\n    var(--color-background-component) 100%\n  );\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.ids-accordion__form-slot-label {\n  display: block;\n  margin-top: var(--spacing-space-8);\n  font-size: 12px;\n  opacity: 0.85;\n}\n"] }]
    }], null, { itemQuery: [{
            type: ContentChildren,
            args: [IdsAccordionItemComponent]
        }], multiple: [{
            type: Input
        }], defaultValue: [{
            type: Input
        }], chevronPosition: [{
            type: Input
        }], variant: [{
            type: Input
        }], valueChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAccordionComponent, { className: "IdsAccordionComponent", filePath: "src/components/ids-accordion/ids-accordion.component.ts", lineNumber: 33 }); })();
