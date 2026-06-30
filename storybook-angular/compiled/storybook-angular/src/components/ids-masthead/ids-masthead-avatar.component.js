import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = [[["ids-icon"]]];
const _c1 = ["ids-icon"];
function IdsMastheadAvatarComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "img", 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵdomProperty("src", ctx_r0.imageSrc, i0.ɵɵsanitizeUrl)("alt", ctx_r0.imageAlt);
} }
function IdsMastheadAvatarComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.initials, " ");
} }
function IdsMastheadAvatarComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 3);
    i0.ɵɵprojection(1);
    i0.ɵɵdomElementEnd();
} }
export class IdsMastheadAvatarComponent {
    initials;
    imageSrc;
    imageAlt = "User avatar";
    ariaLabel;
    ariaExpanded;
    get computedAriaLabel() {
        if (this.initials) {
            return `User initials ${this.initials}`;
        }
        return this.ariaLabel;
    }
    static ɵfac = function IdsMastheadAvatarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMastheadAvatarComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMastheadAvatarComponent, selectors: [["ids-masthead-avatar"]], inputs: { initials: "initials", imageSrc: "imageSrc", imageAlt: "imageAlt", ariaLabel: "ariaLabel", ariaExpanded: "ariaExpanded" }, ngContentSelectors: _c1, decls: 5, vars: 5, consts: [["type", "button", 1, "ids-masthead-avatar"], [1, "ids-masthead-avatar__chip"], [1, "ids-masthead-avatar__image", 3, "src", "alt"], ["aria-hidden", "true", 1, "ids-masthead-avatar__icon"]], template: function IdsMastheadAvatarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵdomElementStart(0, "button", 0)(1, "span", 1);
            i0.ɵɵconditionalCreate(2, IdsMastheadAvatarComponent_Conditional_2_Template, 1, 2, "img", 2)(3, IdsMastheadAvatarComponent_Conditional_3_Template, 1, 1)(4, IdsMastheadAvatarComponent_Conditional_4_Template, 2, 0, "span", 3);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵattribute("aria-label", ctx.computedAriaLabel)("aria-expanded", ctx.ariaExpanded ?? null);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("ids-masthead-avatar__chip--photo", !!ctx.imageSrc);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.imageSrc ? 2 : ctx.initials ? 3 : 4);
        } }, styles: [".ids-masthead-avatar[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: var(--padding-padding-12) var(--padding-padding-8);\n  border: none;\n  background: var(--color-background-masthead-brand-base);\n  color: var(--color-icon-white);\n  box-sizing: border-box;\n  cursor: pointer;\n  transition: background-color 120ms ease;\n}\n\n.ids-masthead-avatar[_ngcontent-%COMP%]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-avatar[_ngcontent-%COMP%]:active:not(:disabled), \n.ids-masthead-avatar[aria-pressed=\"true\"][_ngcontent-%COMP%], \n.ids-masthead-avatar[aria-expanded=\"true\"][_ngcontent-%COMP%] {\n  background-color: var(--color-background-masthead-brand-stronger);\n}\n\n.ids-masthead-avatar[aria-expanded=\"true\"][_ngcontent-%COMP%]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-avatar[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: -1px;\n  background-color: var(--color-background-masthead-brand-base);\n}\n\n.ids-masthead-avatar__chip[_ngcontent-%COMP%] {\n  width: var(--scale-32);\n  height: var(--scale-32);\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  border: var(--border-width-border-1) solid var(--color-border-white);\n  color: var(--color-text-white);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  font-variation-settings: \"wdth\" 100;\n  line-height: var(--font-line-height-line-height-20);\n  background: transparent;\n  overflow: hidden;\n}\n\n.ids-masthead-avatar__chip--photo[_ngcontent-%COMP%] {\n  border-color: transparent;\n}\n\n.ids-masthead-avatar__icon[_ngcontent-%COMP%] {\n  width: var(--scale-16);\n  height: var(--scale-16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-masthead-avatar__image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMastheadAvatarComponent, [{
        type: Component,
        args: [{ selector: "ids-masthead-avatar", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  type=\"button\"\n  class=\"ids-masthead-avatar\"\n  [attr.aria-label]=\"computedAriaLabel\"\n  [attr.aria-expanded]=\"ariaExpanded ?? null\"\n>\n  <span\n    class=\"ids-masthead-avatar__chip\"\n    [class.ids-masthead-avatar__chip--photo]=\"!!imageSrc\"\n  >\n    @if (imageSrc) {\n      <img class=\"ids-masthead-avatar__image\" [src]=\"imageSrc\" [alt]=\"imageAlt\" />\n    } @else if (initials) {\n      {{ initials }}\n    } @else {\n      <span class=\"ids-masthead-avatar__icon\" aria-hidden=\"true\">\n        <ng-content select=\"ids-icon\" />\n      </span>\n    }\n  </span>\n</button>\n", styles: [".ids-masthead-avatar {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: var(--padding-padding-12) var(--padding-padding-8);\n  border: none;\n  background: var(--color-background-masthead-brand-base);\n  color: var(--color-icon-white);\n  box-sizing: border-box;\n  cursor: pointer;\n  transition: background-color 120ms ease;\n}\n\n.ids-masthead-avatar:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-avatar:active:not(:disabled),\n.ids-masthead-avatar[aria-pressed=\"true\"],\n.ids-masthead-avatar[aria-expanded=\"true\"] {\n  background-color: var(--color-background-masthead-brand-stronger);\n}\n\n.ids-masthead-avatar[aria-expanded=\"true\"]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-avatar:focus-visible {\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: -1px;\n  background-color: var(--color-background-masthead-brand-base);\n}\n\n.ids-masthead-avatar__chip {\n  width: var(--scale-32);\n  height: var(--scale-32);\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  border: var(--border-width-border-1) solid var(--color-border-white);\n  color: var(--color-text-white);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  font-variation-settings: \"wdth\" 100;\n  line-height: var(--font-line-height-line-height-20);\n  background: transparent;\n  overflow: hidden;\n}\n\n.ids-masthead-avatar__chip--photo {\n  border-color: transparent;\n}\n\n.ids-masthead-avatar__icon {\n  width: var(--scale-16);\n  height: var(--scale-16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-masthead-avatar__image {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: inherit;\n}\n"] }]
    }], null, { initials: [{
            type: Input
        }], imageSrc: [{
            type: Input
        }], imageAlt: [{
            type: Input
        }], ariaLabel: [{
            type: Input,
            args: [{ alias: "ariaLabel", required: true }]
        }], ariaExpanded: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMastheadAvatarComponent, { className: "IdsMastheadAvatarComponent", filePath: "src/components/ids-masthead/ids-masthead-avatar.component.ts", lineNumber: 10 }); })();
