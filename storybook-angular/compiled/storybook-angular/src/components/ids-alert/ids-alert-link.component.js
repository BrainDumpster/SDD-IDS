import { Component, Input, inject } from "@angular/core";
import { IDS_ALERT_CONTEXT } from "./ids-alert-context";
import * as i0 from "@angular/core";
function IdsAlertLinkComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "a", 2);
    i0.ɵɵdomListener("click", function IdsAlertLinkComponent_Conditional_0_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r1.linkClass());
    i0.ɵɵdomProperty("href", ctx_r1.href, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.label, " ");
} }
function IdsAlertLinkComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 3);
    i0.ɵɵdomListener("click", function IdsAlertLinkComponent_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r1.linkButtonClass());
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.label, " ");
} }
export class IdsAlertLinkComponent {
    ctx = inject(IDS_ALERT_CONTEXT, { optional: true });
    label;
    href = "";
    linkClass() {
        return this.ctx?.linkClass() ?? "ids-alert__link";
    }
    linkButtonClass() {
        return this.ctx?.linkButtonClass() ?? "ids-alert__link-button";
    }
    onLinkActivate(event) {
        this.ctx?.onLinkActivate(event);
    }
    static ɵfac = function IdsAlertLinkComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertLinkComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertLinkComponent, selectors: [["ids-alert-link"]], inputs: { label: "label", href: "href" }, decls: 2, vars: 1, consts: [[3, "class", "href"], ["type", "button", 3, "class"], [3, "click", "href"], ["type", "button", 3, "click"]], template: function IdsAlertLinkComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, IdsAlertLinkComponent_Conditional_0_Template, 2, 4, "a", 0)(1, IdsAlertLinkComponent_Conditional_1_Template, 2, 3, "button", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.href ? 0 : 1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertLinkComponent, [{
        type: Component,
        args: [{
                selector: "ids-alert-link",
                standalone: true,
                template: `
    @if (href) {
      <a [class]="linkClass()" [href]="href" (click)="onLinkActivate($event)">
        {{ label }}
      </a>
    } @else {
      <button type="button" [class]="linkButtonClass()" (click)="onLinkActivate($event)">
        {{ label }}
      </button>
    }
  `,
            }]
    }], null, { label: [{
            type: Input,
            args: [{ required: true }]
        }], href: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertLinkComponent, { className: "IdsAlertLinkComponent", filePath: "src/components/ids-alert/ids-alert-link.component.ts", lineNumber: 19 }); })();
