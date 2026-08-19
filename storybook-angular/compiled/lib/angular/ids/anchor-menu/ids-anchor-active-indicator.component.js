import { Component, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
import * as i0 from "@angular/core";
function IdsAnchorActiveIndicatorComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("top", ctx_r0.topPx, "px");
} }
export class IdsAnchorActiveIndicatorComponent {
    menu = inject(IDS_ANCHOR_MENU_CONTEXT);
    get topPx() {
        return this.menu.activeIndicatorTopPx;
    }
    static ɵfac = function IdsAnchorActiveIndicatorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAnchorActiveIndicatorComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAnchorActiveIndicatorComponent, selectors: [["ids-anchor-active-indicator"]], decls: 1, vars: 1, consts: [["aria-hidden", "true", 1, "ids-anchor-menu__active-indicator", 3, "top"], ["aria-hidden", "true", 1, "ids-anchor-menu__active-indicator"]], template: function IdsAnchorActiveIndicatorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, IdsAnchorActiveIndicatorComponent_Conditional_0_Template, 1, 2, "span", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.topPx !== null ? 0 : -1);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAnchorActiveIndicatorComponent, [{
        type: Component,
        args: [{
                selector: "ids-anchor-active-indicator",
                standalone: true,
                template: `
    @if (topPx !== null) {
      <span
        class="ids-anchor-menu__active-indicator"
        [style.top.px]="topPx"
        aria-hidden="true"
      ></span>
    }
  `,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAnchorActiveIndicatorComponent, { className: "IdsAnchorActiveIndicatorComponent" }); })();
