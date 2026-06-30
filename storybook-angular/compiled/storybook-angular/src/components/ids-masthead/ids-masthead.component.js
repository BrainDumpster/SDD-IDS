import { Component, ContentChild, Input, ViewEncapsulation, } from "@angular/core";
import { IdsMastheadLogoComponent } from "./ids-masthead-logo.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-masthead-action-button-container"]], [["", "mastheadAppLauncher", ""]], [["ids-masthead-avatar"]], [["ids-masthead-logo"], ["", "mastheadLogo", ""]]];
const _c1 = ["ids-masthead-action-button-container", "[mastheadAppLauncher]", "ids-masthead-avatar", "ids-masthead-logo, [mastheadLogo]"];
function IdsMastheadComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 2);
    i0.ɵɵprojection(1, 3);
    i0.ɵɵdomElementEnd();
} }
export class IdsMastheadComponent {
    productName;
    logoSlot;
    /** True when a logo slot is projected (Figma `Show Product Icon=Yes`). */
    hasLogo = false;
    ngAfterContentInit() {
        this.hasLogo = !!this.logoSlot;
    }
    static ɵfac = function IdsMastheadComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMastheadComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMastheadComponent, selectors: [["ids-masthead"]], contentQueries: function IdsMastheadComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsMastheadLogoComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.logoSlot = _t.first);
        } }, hostAttrs: [1, "ids-masthead-host"], inputs: { productName: "productName" }, ngContentSelectors: _c1, decls: 12, vars: 2, consts: [[1, "ids-masthead"], [1, "ids-masthead__left"], [1, "ids-masthead__logo"], [1, "ids-masthead__product-name"], [1, "ids-masthead__actions"], [1, "ids-masthead__icons-slot"], [1, "ids-masthead__app-launcher-slot"], [1, "ids-masthead__avatar-slot"]], template: function IdsMastheadComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵdomElementStart(0, "header", 0)(1, "div", 1);
            i0.ɵɵconditionalCreate(2, IdsMastheadComponent_Conditional_2_Template, 2, 0, "div", 2);
            i0.ɵɵdomElementStart(3, "div", 3);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(5, "div", 4)(6, "div", 5);
            i0.ɵɵprojection(7);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(8, "div", 6);
            i0.ɵɵprojection(9, 1);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(10, "div", 7);
            i0.ɵɵprojection(11, 2);
            i0.ɵɵdomElementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.hasLogo ? 2 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.productName);
        } }, styles: ["/* Ported from storybook/src/components/Masthead.module.css */\n\n.ids-masthead {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: var(--scale-56);\n  padding: 0 var(--padding-padding-8) 0 0;\n  background: var(--color-background-masthead-brand-base);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-transparent-neutral);\n  font-family: inherit;\n  box-sizing: border-box;\n}\n\n/* Figma Product Info (`10130:29494` / `10130:29520`): left 16px, top 12.5px */\n.ids-masthead__left {\n  display: flex;\n  align-items: center;\n  align-self: flex-start;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  padding-top: 12.5px;\n  padding-left: var(--padding-padding-16);\n}\n\n.ids-masthead__logo {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--scale-32);\n  height: var(--scale-32);\n  flex-shrink: 0;\n}\n\n.ids-masthead__product-name {\n  display: flex;\n  align-items: center;\n  color: var(--color-text-white);\n  font-size: var(--font-size-header-6);\n  line-height: var(--font-line-height-line-height-32);\n  font-weight: 400;\n  white-space: nowrap;\n  margin: 0;\n  padding: 0;\n}\n\n.ids-masthead__actions {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  height: 54px;\n  flex-shrink: 0;\n}\n\n.ids-masthead__icons-slot,\n.ids-masthead__app-launcher-slot,\n.ids-masthead__avatar-slot {\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n\n.ids-masthead__icons-slot {\n  gap: 0;\n}\n\n.ids-masthead__app-launcher-slot:not(:has(*)) {\n  display: none;\n}\n"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMastheadComponent, [{
        type: Component,
        args: [{ selector: "ids-masthead", standalone: true, encapsulation: ViewEncapsulation.None, host: {
                    class: "ids-masthead-host",
                }, template: "<header class=\"ids-masthead\">\n  <div class=\"ids-masthead__left\">\n    @if (hasLogo) {\n      <div class=\"ids-masthead__logo\">\n        <ng-content select=\"ids-masthead-logo, [mastheadLogo]\" />\n      </div>\n    }\n    <div class=\"ids-masthead__product-name\">{{ productName }}</div>\n  </div>\n\n  <div class=\"ids-masthead__actions\">\n    <div class=\"ids-masthead__icons-slot\">\n      <ng-content select=\"ids-masthead-action-button-container\" />\n    </div>\n    <div class=\"ids-masthead__app-launcher-slot\">\n      <ng-content select=\"[mastheadAppLauncher]\" />\n    </div>\n    <div class=\"ids-masthead__avatar-slot\">\n      <ng-content select=\"ids-masthead-avatar\" />\n    </div>\n  </div>\n</header>\n", styles: ["/* Ported from storybook/src/components/Masthead.module.css */\n\n.ids-masthead {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: var(--scale-56);\n  padding: 0 var(--padding-padding-8) 0 0;\n  background: var(--color-background-masthead-brand-base);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-transparent-neutral);\n  font-family: inherit;\n  box-sizing: border-box;\n}\n\n/* Figma Product Info (`10130:29494` / `10130:29520`): left 16px, top 12.5px */\n.ids-masthead__left {\n  display: flex;\n  align-items: center;\n  align-self: flex-start;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  padding-top: 12.5px;\n  padding-left: var(--padding-padding-16);\n}\n\n.ids-masthead__logo {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: var(--scale-32);\n  height: var(--scale-32);\n  flex-shrink: 0;\n}\n\n.ids-masthead__product-name {\n  display: flex;\n  align-items: center;\n  color: var(--color-text-white);\n  font-size: var(--font-size-header-6);\n  line-height: var(--font-line-height-line-height-32);\n  font-weight: 400;\n  white-space: nowrap;\n  margin: 0;\n  padding: 0;\n}\n\n.ids-masthead__actions {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  height: 54px;\n  flex-shrink: 0;\n}\n\n.ids-masthead__icons-slot,\n.ids-masthead__app-launcher-slot,\n.ids-masthead__avatar-slot {\n  display: flex;\n  align-items: center;\n  height: 100%;\n}\n\n.ids-masthead__icons-slot {\n  gap: 0;\n}\n\n.ids-masthead__app-launcher-slot:not(:has(*)) {\n  display: none;\n}\n"] }]
    }], null, { productName: [{
            type: Input,
            args: [{ required: true }]
        }], logoSlot: [{
            type: ContentChild,
            args: [IdsMastheadLogoComponent]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMastheadComponent, { className: "IdsMastheadComponent", filePath: "src/components/ids-masthead/ids-masthead.component.ts", lineNumber: 20 }); })();
