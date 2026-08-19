import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
import * as i0 from "@angular/core";
export class IdsAnchorMenuHeaderComponent {
    menu = inject(IDS_ANCHOR_MENU_CONTEXT);
    title;
    get resolvedTitle() {
        return this.title ?? this.menu.title;
    }
    static ɵfac = function IdsAnchorMenuHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAnchorMenuHeaderComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAnchorMenuHeaderComponent, selectors: [["ids-anchor-menu-header"]], inputs: { title: "title" }, decls: 2, vars: 1, consts: [[1, "ids-anchor-menu__header"]], template: function IdsAnchorMenuHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "span", 0);
            i0.ɵɵtext(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.resolvedTitle);
        } }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAnchorMenuHeaderComponent, [{
        type: Component,
        args: [{
                selector: "ids-anchor-menu-header",
                standalone: true,
                template: `<span class="ids-anchor-menu__header">{{ resolvedTitle }}</span>`,
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], null, { title: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAnchorMenuHeaderComponent, { className: "IdsAnchorMenuHeaderComponent" }); })();
