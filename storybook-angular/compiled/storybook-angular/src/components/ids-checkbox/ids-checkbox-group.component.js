import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/checkbox.contract.js";
import { IDS_CHECKBOX_GROUP_CONTEXT, } from "./ids-checkbox-group-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsCheckboxGroupComponent {
    disabled = CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.disabled;
    orientation = CHECKBOX_GROUP_SPEC_ACCURATE_DEFAULTS.orientation;
    name;
    idPrefix;
    static ɵfac = function IdsCheckboxGroupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsCheckboxGroupComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsCheckboxGroupComponent, selectors: [["ids-checkbox-group"]], inputs: { disabled: "disabled", orientation: "orientation", name: "name", idPrefix: "idPrefix" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_CHECKBOX_GROUP_CONTEXT, useExisting: IdsCheckboxGroupComponent }])], ngContentSelectors: _c0, decls: 2, vars: 4, consts: [["role", "group", 1, "group"]], template: function IdsCheckboxGroupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("vertical", ctx.orientation === "vertical")("horizontal", ctx.orientation === "horizontal");
        } }, styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--spacing-space-16);\n}\n\n.vertical[_ngcontent-%COMP%] {\n  flex-direction: column;\n}\n\n.horizontal[_ngcontent-%COMP%] {\n  flex-direction: row;\n  gap: var(--spacing-space-8);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsCheckboxGroupComponent, [{
        type: Component,
        args: [{ selector: "ids-checkbox-group", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: IDS_CHECKBOX_GROUP_CONTEXT, useExisting: IdsCheckboxGroupComponent }], template: "<div\n  class=\"group\"\n  [class.vertical]=\"orientation === 'vertical'\"\n  [class.horizontal]=\"orientation === 'horizontal'\"\n  role=\"group\"\n>\n  <ng-content />\n</div>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.group {\n  display: flex;\n  gap: var(--spacing-space-16);\n}\n\n.vertical {\n  flex-direction: column;\n}\n\n.horizontal {\n  flex-direction: row;\n  gap: var(--spacing-space-8);\n}\n"] }]
    }], null, { disabled: [{
            type: Input
        }], orientation: [{
            type: Input
        }], name: [{
            type: Input
        }], idPrefix: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsCheckboxGroupComponent, { className: "IdsCheckboxGroupComponent", filePath: "src/components/ids-checkbox/ids-checkbox-group.component.ts", lineNumber: 19 }); })();
