import { Component, Input } from "@angular/core";
import * as i0 from "@angular/core";
/**
 * Action label carrier for composition markup.
 * `IdsAlertComponent` renders the outlined button in the correct region (title row vs trailing).
 */
export class IdsAlertActionComponent {
    label = "";
    static ɵfac = function IdsAlertActionComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertActionComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertActionComponent, selectors: [["ids-alert-action"]], inputs: { label: "label" }, decls: 0, vars: 0, template: function IdsAlertActionComponent_Template(rf, ctx) { }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertActionComponent, [{
        type: Component,
        args: [{
                selector: "ids-alert-action",
                standalone: true,
                template: "",
            }]
    }], null, { label: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertActionComponent, { className: "IdsAlertActionComponent", filePath: "src/components/ids-alert/ids-alert-action.component.ts", lineNumber: 12 }); })();
