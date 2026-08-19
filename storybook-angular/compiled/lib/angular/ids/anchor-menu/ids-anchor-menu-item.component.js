import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
import * as i0 from "@angular/core";
export class IdsAnchorMenuItemComponent {
    host;
    cdr;
    menu = inject(IDS_ANCHOR_MENU_CONTEXT);
    label;
    href;
    active = false;
    constructor(host, cdr) {
        this.host = host;
        this.cdr = cdr;
    }
    get isActive() {
        return this.menu.isActive(this.href);
    }
    get canNavigate() {
        return this.menu.canNavigate(this.href);
    }
    get tabIndex() {
        return this.menu.itemTabIndex(this);
    }
    get offsetTopPx() {
        return this.host.nativeElement.offsetTop;
    }
    onClick(event) {
        this.menu.selectItem(this, event);
    }
    onKeydown(event) {
        this.menu.onItemKeydown(event, this);
    }
    onFocus() {
        this.menu.onItemFocus(this);
    }
    focusLink() {
        this.host.nativeElement.querySelector("a")?.focus();
    }
    notifyChange() {
        this.cdr.markForCheck();
    }
    static ɵfac = function IdsAnchorMenuItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAnchorMenuItemComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAnchorMenuItemComponent, selectors: [["ids-anchor-menu-item"]], inputs: { label: "label", href: "href", active: "active" }, decls: 2, vars: 7, consts: [["role", "listitem", 1, "ids-anchor-menu__link", 3, "click", "keydown", "focus", "tabIndex"]], template: function IdsAnchorMenuItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "a", 0);
            i0.ɵɵdomListener("click", function IdsAnchorMenuItemComponent_Template_a_click_0_listener($event) { return ctx.onClick($event); })("keydown", function IdsAnchorMenuItemComponent_Template_a_keydown_0_listener($event) { return ctx.onKeydown($event); })("focus", function IdsAnchorMenuItemComponent_Template_a_focus_0_listener() { return ctx.onFocus(); });
            i0.ɵɵtext(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-anchor-menu__link--active", ctx.isActive);
            i0.ɵɵdomProperty("tabIndex", ctx.tabIndex);
            i0.ɵɵattribute("href", ctx.canNavigate ? ctx.href : null, i0.ɵɵsanitizeUrl)("aria-current", ctx.isActive ? "page" : null)("aria-disabled", ctx.canNavigate ? null : "true");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.label, "\n");
        } }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAnchorMenuItemComponent, [{
        type: Component,
        args: [{ selector: "ids-anchor-menu-item", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<a\n  class=\"ids-anchor-menu__link\"\n  [class.ids-anchor-menu__link--active]=\"isActive\"\n  role=\"listitem\"\n  [attr.href]=\"canNavigate ? href : null\"\n  [attr.aria-current]=\"isActive ? 'page' : null\"\n  [attr.aria-disabled]=\"canNavigate ? null : 'true'\"\n  [tabIndex]=\"tabIndex\"\n  (click)=\"onClick($event)\"\n  (keydown)=\"onKeydown($event)\"\n  (focus)=\"onFocus()\"\n>\n  {{ label }}\n</a>\n" }]
    }], () => [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }], { label: [{
            type: Input,
            args: [{ required: true }]
        }], href: [{
            type: Input,
            args: [{ required: true }]
        }], active: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAnchorMenuItemComponent, { className: "IdsAnchorMenuItemComponent" }); })();
