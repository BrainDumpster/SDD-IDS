import { Component, Input, ViewChild } from "@angular/core";
import * as i0 from "@angular/core";
const _c0 = ["panelTpl"];
const _c1 = [[["ids-tab-panel"]]];
const _c2 = ["ids-tab-panel"];
function IdsTabItemComponent_ng_template_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0);
} }
export class IdsTabItemComponent {
    panelTpl;
    itemId;
    label;
    iconSlug;
    badgeCount;
    hasAlert = false;
    disabled = false;
    simulatedState;
    static ɵfac = function IdsTabItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTabItemComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTabItemComponent, selectors: [["ids-tab-item"]], viewQuery: function IdsTabItemComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 7);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.panelTpl = _t.first);
        } }, hostAttrs: [2, "display", "none"], inputs: { itemId: "itemId", label: "label", iconSlug: "iconSlug", badgeCount: "badgeCount", hasAlert: "hasAlert", disabled: "disabled", simulatedState: "simulatedState" }, ngContentSelectors: _c2, decls: 2, vars: 0, consts: [["panelTpl", ""]], template: function IdsTabItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c1);
            i0.ɵɵdomTemplate(0, IdsTabItemComponent_ng_template_0_Template, 1, 0, "ng-template", null, 0, i0.ɵɵtemplateRefExtractor);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTabItemComponent, [{
        type: Component,
        args: [{
                selector: "ids-tab-item",
                standalone: true,
                template: `
    <ng-template #panelTpl>
      <ng-content select="ids-tab-panel" />
    </ng-template>
  `,
                host: {
                    style: "display: none",
                },
            }]
    }], null, { panelTpl: [{
            type: ViewChild,
            args: ["panelTpl", { static: true }]
        }], itemId: [{
            type: Input,
            args: [{ required: true }]
        }], label: [{
            type: Input,
            args: [{ required: true }]
        }], iconSlug: [{
            type: Input
        }], badgeCount: [{
            type: Input
        }], hasAlert: [{
            type: Input
        }], disabled: [{
            type: Input
        }], simulatedState: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTabItemComponent, { className: "IdsTabItemComponent", filePath: "src/components/ids-tab/ids-tab-item.component.ts", lineNumber: 15 }); })();
