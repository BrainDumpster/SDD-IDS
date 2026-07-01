import { Component } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsTabPanelComponent {
    static ɵfac = function IdsTabPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTabPanelComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTabPanelComponent, selectors: [["ids-tab-panel"]], ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsTabPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTabPanelComponent, [{
        type: Component,
        args: [{
                selector: "ids-tab-panel",
                standalone: true,
                template: `<ng-content />`,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTabPanelComponent, { className: "IdsTabPanelComponent", filePath: "src/components/ids-tab/ids-tab-panel.component.ts", lineNumber: 8 }); })();
