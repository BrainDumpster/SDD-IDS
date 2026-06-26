import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BUTTON_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/button.contract.js";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = (a0, a1, a2, a3) => ["ids-button", a0, a1, a2, a3];
function IdsButtonComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 1);
} }
function IdsButtonComponent_Conditional_2_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 3);
    i0.ɵɵelement(1, "span", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("visually-hidden", ctx_r0.loading);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("mask-image", "url(" + ctx_r0.iconUrl + ")");
} }
function IdsButtonComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsButtonComponent_Conditional_2_Conditional_0_Template, 2, 4, "span", 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.showIcon && ctx_r0.iconUrl ? 0 : -1);
} }
function IdsButtonComponent_Conditional_3_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 3);
    i0.ɵɵelement(1, "span", 4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("mask-image", "url(" + ctx_r0.iconUrl + ")");
} }
function IdsButtonComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsButtonComponent_Conditional_3_Conditional_0_Template, 2, 2, "span", 3);
    i0.ɵɵelementStart(1, "span");
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.showIcon && ctx_r0.iconUrl ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("label-hidden", ctx_r0.loading);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.label);
} }
export class IdsButtonComponent {
    variant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant;
    size = BUTTON_SPEC_ACCURATE_DEFAULTS.size;
    disabled = BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
    loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading;
    iconOnly = BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly;
    iconSlug = BUTTON_SPEC_ACCURATE_DEFAULTS.iconSlug;
    label = BUTTON_SPEC_ACCURATE_DEFAULTS.children;
    type = "button";
    clicked = new EventEmitter();
    get variantClass() {
        return this.variant === "destructive" ? "danger" : this.variant;
    }
    get iconUrl() {
        if (!this.iconSlug || this.variant === "destructive" || !/^[a-z0-9-]+$/.test(this.iconSlug)) {
            return null;
        }
        return `/assets/icons/${this.iconSlug}.svg`;
    }
    get showIcon() {
        return Boolean(this.iconUrl) && !this.loading && this.variant !== "destructive";
    }
    get resolvedIconOnly() {
        return this.iconOnly && this.variant !== "destructive";
    }
    onClick(event) {
        if (this.disabled || this.loading) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        this.clicked.emit(event);
    }
    static ɵfac = function IdsButtonComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsButtonComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsButtonComponent, selectors: [["ids-button"]], inputs: { variant: "variant", size: "size", disabled: "disabled", loading: "loading", iconOnly: "iconOnly", iconSlug: "iconSlug", label: "label", type: "type" }, outputs: { clicked: "clicked" }, decls: 4, vars: 10, consts: [[3, "click", "ngClass", "disabled"], ["aria-hidden", "true", 1, "spinner"], ["aria-hidden", "true", 1, "icon-slot", 3, "visually-hidden"], ["aria-hidden", "true", 1, "icon-slot"], [1, "icon-mask"]], template: function IdsButtonComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "button", 0);
            i0.ɵɵlistener("click", function IdsButtonComponent_Template_button_click_0_listener($event) { return ctx.onClick($event); });
            i0.ɵɵconditionalCreate(1, IdsButtonComponent_Conditional_1_Template, 1, 0, "span", 1);
            i0.ɵɵconditionalCreate(2, IdsButtonComponent_Conditional_2_Template, 1, 1)(3, IdsButtonComponent_Conditional_3_Template, 3, 4);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction4(5, _c0, ctx.variantClass, ctx.size, ctx.resolvedIconOnly ? "icon-only" : "", ctx.loading ? "loading" : ""))("disabled", ctx.disabled || ctx.loading);
            i0.ɵɵattribute("type", ctx.type);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.resolvedIconOnly ? 2 : 3);
        } }, dependencies: [CommonModule, i1.NgClass], styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.ids-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-1) solid transparent;\n  border-radius: var(--button-control-radius);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-weight: 400;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  transition: all 150ms ease;\n  position: relative;\n  white-space: nowrap;\n  outline: none;\n}\n\n.sm[_ngcontent-%COMP%] {\n  min-height: var(--scale-24);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n}\n\n.md[_ngcontent-%COMP%] {\n  min-height: var(--scale-32);\n  padding: var(--padding-padding-6) var(--padding-padding-16);\n}\n\n.lg[_ngcontent-%COMP%] {\n  min-height: var(--scale-40);\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n}\n\n.icon-only.md[_ngcontent-%COMP%] {\n  min-height: var(--scale-32);\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.icon-only.lg[_ngcontent-%COMP%] {\n  min-height: var(--scale-40);\n  padding: var(--padding-padding-12) var(--padding-padding-16);\n}\n\n.icon-only.sm[_ngcontent-%COMP%] {\n  min-height: var(--scale-24);\n  padding: var(--padding-padding-4) var(--padding-padding-16);\n}\n\n.icon-slot[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  align-items: center;\n  justify-content: center;\n  color: inherit;\n}\n\n.icon-mask[_ngcontent-%COMP%] {\n  display: block;\n  width: 16px;\n  height: 16px;\n  background-color: currentColor;\n  mask-repeat: no-repeat;\n  mask-position: center;\n  mask-size: contain;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n}\n\n.primary[_ngcontent-%COMP%]   .icon-slot[_ngcontent-%COMP%] {\n  color: var(--color-icon-white);\n}\n\n.secondary[_ngcontent-%COMP%]   .icon-slot[_ngcontent-%COMP%], \n.tertiary[_ngcontent-%COMP%]   .icon-slot[_ngcontent-%COMP%] {\n  color: var(--color-icon-brand-base);\n}\n\n.danger[_ngcontent-%COMP%]   .icon-slot[_ngcontent-%COMP%] {\n  color: var(--color-icon-white);\n}\n\n.ids-button[_ngcontent-%COMP%]:disabled   .icon-slot[_ngcontent-%COMP%] {\n  color: var(--color-icon-disabled);\n}\n\n.primary[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-text-white);\n}\n\n.primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-strong);\n}\n\n.primary[_ngcontent-%COMP%]:active:not(:disabled) {\n  background: var(--color-background-controls-brand-stronger);\n}\n\n.primary[_ngcontent-%COMP%]:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.secondary[_ngcontent-%COMP%] {\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  border-color: var(--color-border-brand-base);\n}\n\n.secondary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-lighter);\n}\n\n.secondary[_ngcontent-%COMP%]:active:not(:disabled) {\n  background: var(--color-background-controls-brand-light);\n}\n\n.secondary[_ngcontent-%COMP%]:disabled {\n  background: transparent;\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.tertiary[_ngcontent-%COMP%] {\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  border-color: transparent;\n}\n\n.tertiary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-lighter);\n  border-color: var(--color-border-brand-base);\n}\n\n.tertiary[_ngcontent-%COMP%]:active:not(:disabled) {\n  background: var(--color-background-controls-brand-light);\n  border-color: var(--color-border-brand-base);\n}\n\n.tertiary[_ngcontent-%COMP%]:disabled {\n  background: transparent;\n  border-color: transparent;\n  color: var(--color-text-disabled);\n}\n\n.danger[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-transparent-critical);\n  color: var(--color-text-white);\n}\n\n.danger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--color-background-alerting-critical-strong);\n}\n\n.danger[_ngcontent-%COMP%]:active:not(:disabled) {\n  background: var(--color-background-alerting-critical-stronger);\n}\n\n.danger[_ngcontent-%COMP%]:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n}\n\n.ids-button[_ngcontent-%COMP%]:focus-visible:not(:disabled) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: var(--button-focus-ring-offset);\n}\n\n.loading[_ngcontent-%COMP%] {\n  cursor: wait;\n}\n\n.spinner[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: 2px solid currentColor;\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.6s linear infinite;\n  position: absolute;\n}\n\n.label-hidden[_ngcontent-%COMP%], \n.visually-hidden[_ngcontent-%COMP%] {\n  visibility: hidden;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsButtonComponent, [{
        type: Component,
        args: [{ selector: "ids-button", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  [attr.type]=\"type\"\n  [ngClass]=\"['ids-button', variantClass, size, resolvedIconOnly ? 'icon-only' : '', loading ? 'loading' : '']\"\n  [disabled]=\"disabled || loading\"\n  (click)=\"onClick($event)\"\n>\n  @if (loading) {\n    <span class=\"spinner\" aria-hidden=\"true\"></span>\n  }\n  @if (resolvedIconOnly) {\n    @if (showIcon && iconUrl) {\n      <span class=\"icon-slot\" [class.visually-hidden]=\"loading\" aria-hidden=\"true\">\n        <span class=\"icon-mask\" [style.mask-image]=\"'url(' + iconUrl + ')'\"></span>\n      </span>\n    }\n  } @else {\n    @if (showIcon && iconUrl) {\n      <span class=\"icon-slot\" aria-hidden=\"true\">\n        <span class=\"icon-mask\" [style.mask-image]=\"'url(' + iconUrl + ')'\"></span>\n      </span>\n    }\n    <span [class.label-hidden]=\"loading\">{{ label }}</span>\n  }\n</button>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.ids-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-1) solid transparent;\n  border-radius: var(--button-control-radius);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-weight: 400;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  transition: all 150ms ease;\n  position: relative;\n  white-space: nowrap;\n  outline: none;\n}\n\n.sm {\n  min-height: var(--scale-24);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n}\n\n.md {\n  min-height: var(--scale-32);\n  padding: var(--padding-padding-6) var(--padding-padding-16);\n}\n\n.lg {\n  min-height: var(--scale-40);\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n}\n\n.icon-only.md {\n  min-height: var(--scale-32);\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.icon-only.lg {\n  min-height: var(--scale-40);\n  padding: var(--padding-padding-12) var(--padding-padding-16);\n}\n\n.icon-only.sm {\n  min-height: var(--scale-24);\n  padding: var(--padding-padding-4) var(--padding-padding-16);\n}\n\n.icon-slot {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: 16px;\n  height: 16px;\n  align-items: center;\n  justify-content: center;\n  color: inherit;\n}\n\n.icon-mask {\n  display: block;\n  width: 16px;\n  height: 16px;\n  background-color: currentColor;\n  mask-repeat: no-repeat;\n  mask-position: center;\n  mask-size: contain;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n}\n\n.primary .icon-slot {\n  color: var(--color-icon-white);\n}\n\n.secondary .icon-slot,\n.tertiary .icon-slot {\n  color: var(--color-icon-brand-base);\n}\n\n.danger .icon-slot {\n  color: var(--color-icon-white);\n}\n\n.ids-button:disabled .icon-slot {\n  color: var(--color-icon-disabled);\n}\n\n.primary {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-text-white);\n}\n\n.primary:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-strong);\n}\n\n.primary:active:not(:disabled) {\n  background: var(--color-background-controls-brand-stronger);\n}\n\n.primary:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.secondary {\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  border-color: var(--color-border-brand-base);\n}\n\n.secondary:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-lighter);\n}\n\n.secondary:active:not(:disabled) {\n  background: var(--color-background-controls-brand-light);\n}\n\n.secondary:disabled {\n  background: transparent;\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.tertiary {\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  border-color: transparent;\n}\n\n.tertiary:hover:not(:disabled) {\n  background: var(--color-background-controls-brand-lighter);\n  border-color: var(--color-border-brand-base);\n}\n\n.tertiary:active:not(:disabled) {\n  background: var(--color-background-controls-brand-light);\n  border-color: var(--color-border-brand-base);\n}\n\n.tertiary:disabled {\n  background: transparent;\n  border-color: transparent;\n  color: var(--color-text-disabled);\n}\n\n.danger {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-transparent-critical);\n  color: var(--color-text-white);\n}\n\n.danger:hover:not(:disabled) {\n  background: var(--color-background-alerting-critical-strong);\n}\n\n.danger:active:not(:disabled) {\n  background: var(--color-background-alerting-critical-stronger);\n}\n\n.danger:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-button:disabled {\n  cursor: not-allowed;\n}\n\n.ids-button:focus-visible:not(:disabled) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: var(--button-focus-ring-offset);\n}\n\n.loading {\n  cursor: wait;\n}\n\n.spinner {\n  width: 16px;\n  height: 16px;\n  border: 2px solid currentColor;\n  border-top-color: transparent;\n  border-radius: 50%;\n  animation: spin 0.6s linear infinite;\n  position: absolute;\n}\n\n.label-hidden,\n.visually-hidden {\n  visibility: hidden;\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n"] }]
    }], null, { variant: [{
            type: Input
        }], size: [{
            type: Input
        }], disabled: [{
            type: Input
        }], loading: [{
            type: Input
        }], iconOnly: [{
            type: Input
        }], iconSlug: [{
            type: Input
        }], label: [{
            type: Input
        }], type: [{
            type: Input
        }], clicked: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsButtonComponent, { className: "IdsButtonComponent", filePath: "src/components/ids-button/ids-button.component.ts", lineNumber: 17 }); })();
