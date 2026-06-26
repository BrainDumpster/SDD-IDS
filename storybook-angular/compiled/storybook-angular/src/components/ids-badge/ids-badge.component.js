import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BADGE_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/badge.contract.js";
import * as i0 from "@angular/core";
export class IdsBadgeComponent {
    value = BADGE_SPEC_ACCURATE_DEFAULTS.value;
    type = BADGE_SPEC_ACCURATE_DEFAULTS.type;
    ariaLabel;
    get valueText() {
        return String(this.value);
    }
    get sizeClass() {
        const len = this.valueText.length;
        if (len <= 1) {
            return "single-digit";
        }
        if (len === 2) {
            return "two-digits";
        }
        return "three-plus-digits";
    }
    static ɵfac = function IdsBadgeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsBadgeComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsBadgeComponent, selectors: [["ids-badge"]], inputs: { value: "value", type: "type", ariaLabel: "ariaLabel" }, decls: 3, vars: 18, consts: [[1, "ids-badge"], [1, "ids-badge__content"]], template: function IdsBadgeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "span", 0)(1, "span", 1);
            i0.ɵɵtext(2);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-badge--default", ctx.type === "default")("ids-badge--critical", ctx.type === "critical")("ids-badge--warning", ctx.type === "warning")("ids-badge--disabled", ctx.type === "disabled")("ids-badge--success", ctx.type === "success")("ids-badge--single-digit", ctx.sizeClass === "single-digit")("ids-badge--two-digits", ctx.sizeClass === "two-digits")("ids-badge--three-plus-digits", ctx.sizeClass === "three-plus-digits");
            i0.ɵɵattribute("aria-label", ctx.ariaLabel || null);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.valueText);
        } }, styles: ["\n\n.ids-badge[_ngcontent-%COMP%] {\n  --ids-badge-inner-size: 18px;\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: content-box;\n  height: var(--ids-badge-inner-size);\n  min-width: var(--ids-badge-inner-size);\n  border-width: var(--border-width-border-1);\n  border-style: solid;\n  border-radius: 100px;\n  font-family: var(--typography-font-style-primary, inherit);\n  white-space: nowrap;\n}\n\n.ids-badge__content[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  font-size: var(--font-size-body-3, 12px);\n  font-weight: 400;\n  line-height: 1;\n  text-align: center;\n}\n\n.ids-badge--single-digit[_ngcontent-%COMP%] {\n  width: var(--ids-badge-inner-size);\n  min-width: var(--ids-badge-inner-size);\n  padding: 0;\n}\n\n.ids-badge--two-digits[_ngcontent-%COMP%] {\n  padding: 0 4px;\n}\n\n.ids-badge--three-plus-digits[_ngcontent-%COMP%] {\n  padding: 0 5.5px;\n}\n\n.ids-badge--default[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-info, #005ece);\n  border-color: var(--color-border-white, #ffffff);\n  color: var(--color-text-white, #ffffff);\n}\n\n.ids-badge--critical[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge--warning[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-minor);\n  border-color: var(\n    --ids-badge-warning-border-color,\n    var(--color-border-white)\n  );\n  color: var(--color-text-black);\n}\n\n.ids-badge--disabled[_ngcontent-%COMP%] {\n  background: var(--color-static-gray-500);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge--success[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-success);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsBadgeComponent, [{
        type: Component,
        args: [{ selector: "ids-badge", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<span\n  class=\"ids-badge\"\n  [class.ids-badge--default]=\"type === 'default'\"\n  [class.ids-badge--critical]=\"type === 'critical'\"\n  [class.ids-badge--warning]=\"type === 'warning'\"\n  [class.ids-badge--disabled]=\"type === 'disabled'\"\n  [class.ids-badge--success]=\"type === 'success'\"\n  [class.ids-badge--single-digit]=\"sizeClass === 'single-digit'\"\n  [class.ids-badge--two-digits]=\"sizeClass === 'two-digits'\"\n  [class.ids-badge--three-plus-digits]=\"sizeClass === 'three-plus-digits'\"\n  [attr.aria-label]=\"ariaLabel || null\"\n>\n  <span class=\"ids-badge__content\">{{ valueText }}</span>\n</span>\n", styles: ["/* Ported from storybook/src/components/Badge.module.css */\n\n.ids-badge {\n  --ids-badge-inner-size: 18px;\n\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: content-box;\n  height: var(--ids-badge-inner-size);\n  min-width: var(--ids-badge-inner-size);\n  border-width: var(--border-width-border-1);\n  border-style: solid;\n  border-radius: 100px;\n  font-family: var(--typography-font-style-primary, inherit);\n  white-space: nowrap;\n}\n\n.ids-badge__content {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  height: 100%;\n  font-size: var(--font-size-body-3, 12px);\n  font-weight: 400;\n  line-height: 1;\n  text-align: center;\n}\n\n.ids-badge--single-digit {\n  width: var(--ids-badge-inner-size);\n  min-width: var(--ids-badge-inner-size);\n  padding: 0;\n}\n\n.ids-badge--two-digits {\n  padding: 0 4px;\n}\n\n.ids-badge--three-plus-digits {\n  padding: 0 5.5px;\n}\n\n.ids-badge--default {\n  background: var(--color-background-alerting-info, #005ece);\n  border-color: var(--color-border-white, #ffffff);\n  color: var(--color-text-white, #ffffff);\n}\n\n.ids-badge--critical {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge--warning {\n  background: var(--color-background-alerting-minor);\n  border-color: var(\n    --ids-badge-warning-border-color,\n    var(--color-border-white)\n  );\n  color: var(--color-text-black);\n}\n\n.ids-badge--disabled {\n  background: var(--color-static-gray-500);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge--success {\n  background: var(--color-background-alerting-success);\n  border-color: var(--color-border-white);\n  color: var(--color-text-white);\n}\n\n.ids-badge:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n"] }]
    }], null, { value: [{
            type: Input
        }], type: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsBadgeComponent, { className: "IdsBadgeComponent", filePath: "src/components/ids-badge/ids-badge.component.ts", lineNumber: 16 }); })();
