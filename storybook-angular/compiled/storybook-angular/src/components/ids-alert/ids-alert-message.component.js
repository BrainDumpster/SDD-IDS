import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Primary copy slot — maps to Clarity `.alert-text` / spec `AlertMessage`. */
export class IdsAlertMessageComponent {
    static ɵfac = function IdsAlertMessageComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertMessageComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertMessageComponent, selectors: [["ids-alert-message"]], hostAttrs: [1, "ids-alert-message-slot", 2, "display", "none"], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsAlertMessageComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertMessageComponent, [{
        type: Component,
        args: [{
                selector: "ids-alert-message",
                standalone: true,
                host: {
                    class: "ids-alert-message-slot",
                    style: "display: none",
                },
                template: `<ng-content />`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertMessageComponent, { className: "IdsAlertMessageComponent", filePath: "src/components/ids-alert/ids-alert-message.component.ts", lineNumber: 13 }); })();
