import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IdsBadgeComponent } from "../ids-badge/ids-badge.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-icon"]]];
const _c1 = ["ids-icon"];
function IdsMastheadActionIconButtonComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 2);
    i0.ɵɵelement(1, "ids-badge", 3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.badgeLabel)("type", ctx_r0.badgeType);
} }
export class IdsMastheadActionIconButtonComponent {
    ariaLabel;
    badgeCount;
    badgeType = "critical";
    ariaExpanded;
    get showBadge() {
        return typeof this.badgeCount === "number" && this.badgeCount > 0;
    }
    get badgeLabel() {
        if (!this.badgeCount || this.badgeCount <= 0) {
            return "";
        }
        return this.badgeCount > 99 ? "99+" : String(this.badgeCount);
    }
    static ɵfac = function IdsMastheadActionIconButtonComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMastheadActionIconButtonComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMastheadActionIconButtonComponent, selectors: [["ids-masthead-action-icon-button"]], inputs: { ariaLabel: "ariaLabel", badgeCount: "badgeCount", badgeType: "badgeType", ariaExpanded: "ariaExpanded" }, ngContentSelectors: _c1, decls: 4, vars: 3, consts: [["type", "button", 1, "ids-masthead-action-icon-button"], ["aria-hidden", "true", 1, "ids-masthead-action-icon-button__glyph"], ["aria-hidden", "true", 1, "ids-masthead-action-icon-button__badge"], [3, "value", "type"]], template: function IdsMastheadActionIconButtonComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵelementStart(0, "button", 0)(1, "span", 1);
            i0.ɵɵprojection(2);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(3, IdsMastheadActionIconButtonComponent_Conditional_3_Template, 2, 2, "span", 2);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵattribute("aria-label", ctx.ariaLabel)("aria-expanded", ctx.ariaExpanded ?? null);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showBadge ? 3 : -1);
        } }, dependencies: [IdsBadgeComponent], styles: [".ids-masthead-action-icon-button[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 19px var(--padding-padding-16);\n  border: none;\n  border-radius: 0;\n  background: var(--color-background-masthead-brand-base);\n  color: var(--color-icon-white);\n  box-sizing: border-box;\n  cursor: pointer;\n  transition: background-color 120ms ease, opacity 120ms ease;\n}\n\n.ids-masthead-action-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-action-icon-button[_ngcontent-%COMP%]:active:not(:disabled), \n.ids-masthead-action-icon-button[aria-pressed=\"true\"][_ngcontent-%COMP%], \n.ids-masthead-action-icon-button[aria-expanded=\"true\"][_ngcontent-%COMP%] {\n  background-color: var(--color-background-masthead-brand-stronger);\n}\n\n.ids-masthead-action-icon-button[aria-expanded=\"true\"][_ngcontent-%COMP%]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-action-icon-button[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: -1px;\n  background-color: var(--color-background-masthead-brand-base);\n}\n\n.ids-masthead-action-icon-button__glyph[_ngcontent-%COMP%] {\n  width: var(--scale-16);\n  height: var(--scale-16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-masthead-action-icon-button__badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 12px;\n  left: 23px;\n  pointer-events: none;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMastheadActionIconButtonComponent, [{
        type: Component,
        args: [{ selector: "ids-masthead-action-icon-button", standalone: true, imports: [IdsBadgeComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  type=\"button\"\n  class=\"ids-masthead-action-icon-button\"\n  [attr.aria-label]=\"ariaLabel\"\n  [attr.aria-expanded]=\"ariaExpanded ?? null\"\n>\n  <span class=\"ids-masthead-action-icon-button__glyph\" aria-hidden=\"true\">\n    <ng-content select=\"ids-icon\" />\n  </span>\n  @if (showBadge) {\n    <span class=\"ids-masthead-action-icon-button__badge\" aria-hidden=\"true\">\n      <ids-badge [value]=\"badgeLabel\" [type]=\"badgeType\" />\n    </span>\n  }\n</button>\n", styles: [".ids-masthead-action-icon-button {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 19px var(--padding-padding-16);\n  border: none;\n  border-radius: 0;\n  background: var(--color-background-masthead-brand-base);\n  color: var(--color-icon-white);\n  box-sizing: border-box;\n  cursor: pointer;\n  transition: background-color 120ms ease, opacity 120ms ease;\n}\n\n.ids-masthead-action-icon-button:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-action-icon-button:active:not(:disabled),\n.ids-masthead-action-icon-button[aria-pressed=\"true\"],\n.ids-masthead-action-icon-button[aria-expanded=\"true\"] {\n  background-color: var(--color-background-masthead-brand-stronger);\n}\n\n.ids-masthead-action-icon-button[aria-expanded=\"true\"]:hover {\n  background-color: var(--color-background-masthead-brand-strong);\n}\n\n.ids-masthead-action-icon-button:focus-visible {\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: -1px;\n  background-color: var(--color-background-masthead-brand-base);\n}\n\n.ids-masthead-action-icon-button__glyph {\n  width: var(--scale-16);\n  height: var(--scale-16);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-masthead-action-icon-button__badge {\n  position: absolute;\n  top: 12px;\n  left: 23px;\n  pointer-events: none;\n}\n"] }]
    }], null, { ariaLabel: [{
            type: Input,
            args: [{ alias: "ariaLabel", required: true }]
        }], badgeCount: [{
            type: Input
        }], badgeType: [{
            type: Input
        }], ariaExpanded: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMastheadActionIconButtonComponent, { className: "IdsMastheadActionIconButtonComponent", filePath: "src/components/ids-masthead/ids-masthead-action-icon-button.component.ts", lineNumber: 13 }); })();
