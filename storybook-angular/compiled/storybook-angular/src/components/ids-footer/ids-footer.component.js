import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from "@angular/core";
import { FOOTER_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/footer.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
function IdsFooterComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 2)(1, "span", 6);
    i0.ɵɵtext(2, "Host Name: ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 7);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r0.hostname);
} }
function IdsFooterComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 3)(1, "div", 2)(2, "span", 6);
    i0.ɵɵtext(3, "SWID: ");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "span", 7);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "button", 8);
    i0.ɵɵlistener("click", function IdsFooterComponent_Conditional_3_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onCopyClick()); });
    i0.ɵɵelement(7, "ids-icon", 9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.swid);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", !ctx_r0.canCopy);
    i0.ɵɵattribute("aria-disabled", !ctx_r0.canCopy ? "true" : null);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 14);
} }
function IdsFooterComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 4);
    i0.ɵɵelement(1, "ids-icon", 10);
    i0.ɵɵelementStart(2, "span", 11);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.currentDateTime);
} }
function IdsFooterComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵelement(1, "ids-icon", 12);
    i0.ɵɵelementStart(2, "button", 13);
    i0.ɵɵlistener("click", function IdsFooterComponent_Conditional_5_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onTimeZoneButtonClick()); });
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 16);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r0.timeZoneDisabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.resolvedTimeZoneLabel, " ");
} }
async function copyTextToClipboard(text) {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}
export class IdsFooterComponent {
    hostname = FOOTER_SPEC_ACCURATE_DEFAULTS.hostname;
    swid = FOOTER_SPEC_ACCURATE_DEFAULTS.swid;
    currentDateTime = FOOTER_SPEC_ACCURATE_DEFAULTS.currentDateTime;
    timeZoneLabel = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneLabel;
    showHostname = FOOTER_SPEC_ACCURATE_DEFAULTS.showHostname;
    showCurrentDateAndTime = FOOTER_SPEC_ACCURATE_DEFAULTS.showCurrentDateAndTime;
    showTimeZone = FOOTER_SPEC_ACCURATE_DEFAULTS.showTimeZone;
    copyDisabled = FOOTER_SPEC_ACCURATE_DEFAULTS.copyDisabled;
    timeZoneDisabled = FOOTER_SPEC_ACCURATE_DEFAULTS.timeZoneDisabled;
    copySwid = new EventEmitter();
    timeZoneClick = new EventEmitter();
    get canCopy() {
        return Boolean(this.swid) && !this.copyDisabled;
    }
    get resolvedTimeZoneLabel() {
        return this.timeZoneLabel || "Time zone";
    }
    get showSwidGroup() {
        return this.swid != null && this.swid !== "";
    }
    get showTimeGroup() {
        return (this.showCurrentDateAndTime &&
            this.currentDateTime != null &&
            this.currentDateTime !== "");
    }
    async onCopyClick() {
        if (!this.canCopy || !this.swid) {
            return;
        }
        try {
            await copyTextToClipboard(this.swid);
        }
        catch {
            /* host may surface errors via copySwid */
        }
        this.copySwid.emit(this.swid);
    }
    onTimeZoneButtonClick() {
        if (this.timeZoneDisabled) {
            return;
        }
        this.timeZoneClick.emit();
    }
    static ɵfac = function IdsFooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsFooterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsFooterComponent, selectors: [["ids-footer"]], hostAttrs: [1, "ids-footer-host"], inputs: { hostname: "hostname", swid: "swid", currentDateTime: "currentDateTime", timeZoneLabel: "timeZoneLabel", showHostname: "showHostname", showCurrentDateAndTime: "showCurrentDateAndTime", showTimeZone: "showTimeZone", copyDisabled: "copyDisabled", timeZoneDisabled: "timeZoneDisabled" }, outputs: { copySwid: "copySwid", timeZoneClick: "timeZoneClick" }, decls: 6, vars: 4, consts: [["aria-label", "Application status", 1, "ids-footer"], [1, "ids-footer__left"], [1, "ids-footer__field"], [1, "ids-footer__swid-group"], [1, "ids-footer__time-group"], [1, "ids-footer__timezone-group"], [1, "ids-footer__label"], [1, "ids-footer__value"], ["type", "button", "aria-label", "Copy SWID", 1, "ids-footer__copy-button", 3, "click", "disabled"], ["className", "ids-footer__copy-icon", "shapeName", "copy", "variant", "mask", 3, "size"], ["className", "ids-footer__time-icon", "shapeName", "time-clock", "variant", "mask", 3, "size"], [1, "ids-footer__datetime"], ["className", "ids-footer__globe-icon", "shapeName", "world-globe", "variant", "mask", 3, "size"], ["type", "button", 1, "ids-footer__timezone-button", 3, "click", "disabled"]], template: function IdsFooterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "footer", 0)(1, "div", 1);
            i0.ɵɵconditionalCreate(2, IdsFooterComponent_Conditional_2_Template, 5, 1, "div", 2);
            i0.ɵɵconditionalCreate(3, IdsFooterComponent_Conditional_3_Template, 8, 4, "div", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, IdsFooterComponent_Conditional_4_Template, 4, 2, "div", 4);
            i0.ɵɵconditionalCreate(5, IdsFooterComponent_Conditional_5_Template, 4, 3, "div", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showHostname ? 2 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showSwidGroup ? 3 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showTimeGroup ? 4 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showTimeZone ? 5 : -1);
        } }, dependencies: [IdsIconComponent], styles: ["[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n\n.ids-footer[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  overflow: hidden;\n  background: var(--color-background-surface-1);\n  border: var(--border-width-border-1) solid var(--color-border-light);\n  font-family: inherit;\n}\n\n.ids-footer__left[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-24);\n  height: 100%;\n  padding-left: var(--padding-padding-16);\n  padding-right: var(--padding-padding-16);\n}\n\n.ids-footer__field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  word-break: break-word;\n}\n\n.ids-footer__label[_ngcontent-%COMP%] {\n  font-weight: 500;\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-footer__value[_ngcontent-%COMP%] {\n  color: var(--color-text-neutral);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ids-footer__swid-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  flex-shrink: 0;\n}\n\n.ids-footer__copy-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n  flex-shrink: 0;\n  color: var(--color-icon-brand-base);\n}\n\n.ids-footer__copy-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  color: var(--color-icon-disabled);\n}\n\n.ids-footer__copy-button[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-footer__time-group[_ngcontent-%COMP%], \n.ids-footer__timezone-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  flex-shrink: 0;\n}\n\n.ids-footer__time-group[_ngcontent-%COMP%] {\n  padding: var(--padding-padding-4) var(--padding-padding-8) 3px var(--padding-padding-16);\n}\n\n.ids-footer__timezone-group[_ngcontent-%COMP%] {\n  padding: var(--padding-padding-4) var(--padding-padding-16) 3px var(--padding-padding-8);\n}\n\n.ids-footer__time-icon[_ngcontent-%COMP%] {\n  color: var(--color-icon-neutral);\n}\n\n.ids-footer__globe-icon[_ngcontent-%COMP%] {\n  color: var(--color-icon-brand-base);\n}\n\n.ids-footer__datetime[_ngcontent-%COMP%] {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n}\n\n.ids-footer__timezone-button[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font: inherit;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-brand-strong);\n  white-space: nowrap;\n  cursor: pointer;\n  text-align: left;\n}\n\n.ids-footer__timezone-button[_ngcontent-%COMP%]:hover:not(:disabled) {\n  color: var(--color-text-link-brand-base);\n  text-decoration: underline;\n}\n\n.ids-footer__timezone-button[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-footer__timezone-button[_ngcontent-%COMP%]:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n  text-decoration: none;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsFooterComponent, [{
        type: Component,
        args: [{ selector: "ids-footer", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, host: {
                    class: "ids-footer-host",
                }, template: "<footer class=\"ids-footer\" aria-label=\"Application status\">\n  <div class=\"ids-footer__left\">\n    @if (showHostname) {\n      <div class=\"ids-footer__field\">\n        <span class=\"ids-footer__label\">Host Name: </span>\n        <span class=\"ids-footer__value\">{{ hostname }}</span>\n      </div>\n    }\n    @if (showSwidGroup) {\n      <div class=\"ids-footer__swid-group\">\n        <div class=\"ids-footer__field\">\n          <span class=\"ids-footer__label\">SWID: </span>\n          <span class=\"ids-footer__value\">{{ swid }}</span>\n        </div>\n        <button\n          type=\"button\"\n          class=\"ids-footer__copy-button\"\n          aria-label=\"Copy SWID\"\n          [disabled]=\"!canCopy\"\n          [attr.aria-disabled]=\"!canCopy ? 'true' : null\"\n          (click)=\"onCopyClick()\"\n        >\n          <ids-icon\n            className=\"ids-footer__copy-icon\"\n            shapeName=\"copy\"\n            variant=\"mask\"\n            [size]=\"14\"\n          />\n        </button>\n      </div>\n    }\n  </div>\n  @if (showTimeGroup) {\n    <div class=\"ids-footer__time-group\">\n      <ids-icon\n        className=\"ids-footer__time-icon\"\n        shapeName=\"time-clock\"\n        variant=\"mask\"\n        [size]=\"16\"\n      />\n      <span class=\"ids-footer__datetime\">{{ currentDateTime }}</span>\n    </div>\n  }\n  @if (showTimeZone) {\n    <div class=\"ids-footer__timezone-group\">\n      <ids-icon\n        className=\"ids-footer__globe-icon\"\n        shapeName=\"world-globe\"\n        variant=\"mask\"\n        [size]=\"16\"\n      />\n      <button\n        type=\"button\"\n        class=\"ids-footer__timezone-button\"\n        [disabled]=\"timeZoneDisabled\"\n        (click)=\"onTimeZoneButtonClick()\"\n      >\n        {{ resolvedTimeZoneLabel }}\n      </button>\n    </div>\n  }\n</footer>\n", styles: [":host {\n  display: block;\n  width: 100%;\n}\n\n.ids-footer {\n  box-sizing: border-box;\n  width: 100%;\n  height: 32px;\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  overflow: hidden;\n  background: var(--color-background-surface-1);\n  border: var(--border-width-border-1) solid var(--color-border-light);\n  font-family: inherit;\n}\n\n.ids-footer__left {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-24);\n  height: 100%;\n  padding-left: var(--padding-padding-16);\n  padding-right: var(--padding-padding-16);\n}\n\n.ids-footer__field {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  word-break: break-word;\n}\n\n.ids-footer__label {\n  font-weight: 500;\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-footer__value {\n  color: var(--color-text-neutral);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ids-footer__swid-group {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  flex-shrink: 0;\n}\n\n.ids-footer__copy-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 14px;\n  height: 14px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  cursor: pointer;\n  flex-shrink: 0;\n  color: var(--color-icon-brand-base);\n}\n\n.ids-footer__copy-button:disabled {\n  cursor: not-allowed;\n  color: var(--color-icon-disabled);\n}\n\n.ids-footer__copy-button:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-footer__time-group,\n.ids-footer__timezone-group {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  flex-shrink: 0;\n}\n\n.ids-footer__time-group {\n  padding: var(--padding-padding-4) var(--padding-padding-8) 3px var(--padding-padding-16);\n}\n\n.ids-footer__timezone-group {\n  padding: var(--padding-padding-4) var(--padding-padding-16) 3px var(--padding-padding-8);\n}\n\n.ids-footer__time-icon {\n  color: var(--color-icon-neutral);\n}\n\n.ids-footer__globe-icon {\n  color: var(--color-icon-brand-base);\n}\n\n.ids-footer__datetime {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n}\n\n.ids-footer__timezone-button {\n  margin: 0;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font: inherit;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-brand-strong);\n  white-space: nowrap;\n  cursor: pointer;\n  text-align: left;\n}\n\n.ids-footer__timezone-button:hover:not(:disabled) {\n  color: var(--color-text-link-brand-base);\n  text-decoration: underline;\n}\n\n.ids-footer__timezone-button:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-footer__timezone-button:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n  text-decoration: none;\n}\n"] }]
    }], null, { hostname: [{
            type: Input
        }], swid: [{
            type: Input
        }], currentDateTime: [{
            type: Input
        }], timeZoneLabel: [{
            type: Input
        }], showHostname: [{
            type: Input
        }], showCurrentDateAndTime: [{
            type: Input
        }], showTimeZone: [{
            type: Input
        }], copyDisabled: [{
            type: Input
        }], timeZoneDisabled: [{
            type: Input
        }], copySwid: [{
            type: Output
        }], timeZoneClick: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsFooterComponent, { className: "IdsFooterComponent", filePath: "src/components/ids-footer/ids-footer.component.ts", lineNumber: 40 }); })();
