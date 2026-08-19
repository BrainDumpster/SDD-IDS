import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { ANCHOR_MENU_API_DEFAULTS, } from "../../../../component-contracts/ids/anchor-menu.contract.js";
import { IDS_ANCHOR_MENU_CONTEXT, } from "./ids-anchor-menu-context";
import { IdsAnchorMenuItemComponent } from "./ids-anchor-menu-item.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-anchor-menu-header"]], [["ids-anchor-menu-item"]], [["ids-anchor-active-indicator"]]];
const _c1 = ["ids-anchor-menu-header", "ids-anchor-menu-item", "ids-anchor-active-indicator"];
export class IdsAnchorMenuComponent {
    cdr;
    itemQuery;
    title = ANCHOR_MENU_API_DEFAULTS.title;
    sticky = ANCHOR_MENU_API_DEFAULTS.sticky;
    itemClick = new EventEmitter();
    activeHref;
    items = [];
    focusedIndex = 0;
    scrollSpyBound = false;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnInit() {
        this.bindScrollSpy();
    }
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    ngOnDestroy() {
        this.unbindScrollSpy();
    }
    get activeIndicatorTopPx() {
        const active = this.items.find((item) => this.isActive(item.href));
        if (!active) {
            return null;
        }
        return active.offsetTopPx;
    }
    registerItems(items) {
        this.items = [...items];
        if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = Math.max(0, this.items.length - 1);
        }
        if (this.activeHref === undefined) {
            const marked = this.items.find((item) => item.active);
            if (marked && this.canNavigate(marked.href)) {
                this.activeHref = marked.href;
            }
        }
        this.notifyChange();
    }
    isActive(href) {
        return this.activeHref !== undefined && this.activeHref === href;
    }
    canNavigate(href) {
        return typeof href === "string" && href.trim().length > 0;
    }
    selectItem(item, event) {
        if (!this.canNavigate(item.href)) {
            event?.preventDefault();
            return;
        }
        this.activeHref = item.href;
        const index = this.items.indexOf(item);
        if (index >= 0) {
            this.focusedIndex = index;
        }
        this.itemClick.emit(item.href);
        if (item.href.startsWith("#")) {
            event?.preventDefault();
            document.getElementById(item.href.slice(1))?.scrollIntoView({ behavior: "smooth" });
            window.history.replaceState(null, "", item.href);
        }
        this.notifyChange();
    }
    onItemKeydown(event, item) {
        const index = this.items.indexOf(item);
        const enabledIndices = this.items
            .map((row, i) => (this.canNavigate(row.href) ? i : -1))
            .filter((i) => i >= 0);
        if (!enabledIndices.length) {
            return;
        }
        const currentPos = enabledIndices.indexOf(index);
        let targetIndex = index;
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                targetIndex = enabledIndices[(Math.max(currentPos, 0) + 1) % enabledIndices.length];
                break;
            case "ArrowUp":
                event.preventDefault();
                targetIndex =
                    enabledIndices[(Math.max(currentPos, 0) - 1 + enabledIndices.length) % enabledIndices.length];
                break;
            case "Enter":
                event.preventDefault();
                this.selectItem(item, event);
                return;
            default:
                return;
        }
        this.focusedIndex = targetIndex;
        this.items[targetIndex]?.focusLink();
    }
    onItemFocus(item) {
        this.focusedIndex = this.items.indexOf(item);
    }
    itemTabIndex(item) {
        return this.canNavigate(item.href) ? 0 : -1;
    }
    notifyChange() {
        for (const item of this.items) {
            item.notifyChange();
        }
        this.cdr.markForCheck();
    }
    bindItems() {
        this.registerItems(this.itemQuery.toArray());
    }
    bindScrollSpy() {
        if (this.scrollSpyBound || typeof window === "undefined") {
            return;
        }
        window.addEventListener("scroll", this.onWindowScroll, { passive: true });
        this.scrollSpyBound = true;
    }
    unbindScrollSpy() {
        if (!this.scrollSpyBound || typeof window === "undefined") {
            return;
        }
        window.removeEventListener("scroll", this.onWindowScroll);
        this.scrollSpyBound = false;
    }
    onWindowScroll = () => {
        const hashItems = this.items.filter((item) => this.canNavigate(item.href) && item.href.startsWith("#"));
        if (!hashItems.length) {
            return;
        }
        let current = hashItems[0]?.href;
        for (const item of hashItems) {
            const target = document.getElementById(item.href.slice(1));
            if (!target) {
                continue;
            }
            if (target.getBoundingClientRect().top <= 0) {
                current = item.href;
            }
        }
        if (current && current !== this.activeHref) {
            this.activeHref = current;
            this.notifyChange();
        }
    };
    static ɵfac = function IdsAnchorMenuComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAnchorMenuComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAnchorMenuComponent, selectors: [["ids-anchor-menu"]], contentQueries: function IdsAnchorMenuComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsAnchorMenuItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, inputs: { title: "title", sticky: "sticky" }, outputs: { itemClick: "itemClick" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_ANCHOR_MENU_CONTEXT, useExisting: IdsAnchorMenuComponent }])], ngContentSelectors: _c1, decls: 5, vars: 3, consts: [[1, "ids-anchor-menu"], ["role", "list", 1, "ids-anchor-menu__list"]], template: function IdsAnchorMenuComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵdomElementStart(0, "nav", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementStart(2, "div", 1);
            i0.ɵɵprojection(3, 1);
            i0.ɵɵprojection(4, 2);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-anchor-menu--sticky", ctx.sticky);
            i0.ɵɵattribute("aria-label", ctx.title);
        } }, styles: ["/* Single stylesheet for all anchor-menu slots (ngc inlines this file; do not @use partials). */\n\nids-anchor-menu,\nids-anchor-menu-header,\nids-anchor-menu-item {\n  display: block;\n}\n\nids-anchor-active-indicator {\n  display: block;\n  position: absolute;\n  left: 0;\n  pointer-events: none;\n}\n\n.ids-anchor-menu {\n  box-sizing: border-box;\n  min-width: 200px;\n  max-width: 300px;\n  width: fit-content;\n  background: transparent;\n  border-radius: 0;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n}\n\n.ids-anchor-menu--sticky {\n  position: sticky;\n  top: 0;\n  align-self: flex-start;\n}\n\n.ids-anchor-menu__header {\n  display: block;\n  padding: var(--padding-padding-12) 0;\n  font-size: var(--font-size-body-1, 16px);\n  line-height: var(--font-line-height-line-height-24, 24px);\n  font-weight: 400;\n  color: var(--color-text-gray-neutral-strong);\n  text-transform: none;\n  letter-spacing: normal;\n  border-radius: 0;\n}\n\n.ids-anchor-menu__list {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n}\n\n.ids-anchor-menu__link {\n  display: inline-block;\n  width: fit-content;\n  box-sizing: border-box;\n  height: var(--scale-40);\n  padding: var(--padding-padding-8) var(--padding-padding-24);\n  font-size: var(--font-size-body-1, 16px);\n  line-height: var(--font-line-height-line-height-24, 24px);\n  font-weight: 400;\n  color: var(--color-text-gray-neutral);\n  text-decoration: none;\n  position: relative;\n  border-left: 1.2px solid var(--color-border-gray-neutral-base);\n  border-radius: 0;\n  background: transparent;\n  cursor: pointer;\n  outline: none;\n}\n\n.ids-anchor-menu__link:hover {\n  color: var(--color-text-gray-neutral);\n}\n\n.ids-anchor-menu__link:hover::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  /* Padding-box origin: center 4px bar on 1.2px border-left rail. */\n  left: calc((-1.2px - 4px) / 2);\n  width: 4px;\n  border-radius: 0;\n  background: var(--color-border-brand-base);\n}\n\n.ids-anchor-menu__link--active {\n  color: var(--color-text-brand-strong);\n  border-left-color: transparent;\n}\n\n.ids-anchor-menu__link:focus:not(:focus-visible)::after {\n  content: none;\n}\n\n.ids-anchor-menu__link:focus-visible {\n  outline: none;\n}\n\n.ids-anchor-menu__link:focus-visible::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px -6px;\n  border: var(--border-width-border-2) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n.ids-anchor-menu__link[aria-disabled=\"true\"] {\n  cursor: default;\n  pointer-events: none;\n}\n\n.ids-anchor-menu__active-indicator {\n  position: absolute;\n  /* List origin: center 4px bar on the item 1.2px left rail. */\n  left: calc((1.2px - 4px) / 2);\n  display: block;\n  width: 4px;\n  height: var(--scale-40);\n  border-radius: 0;\n  background: var(--color-border-brand-base);\n  pointer-events: none;\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAnchorMenuComponent, [{
        type: Component,
        args: [{ selector: "ids-anchor-menu", standalone: true, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: IDS_ANCHOR_MENU_CONTEXT, useExisting: IdsAnchorMenuComponent }], template: "<nav\n  class=\"ids-anchor-menu\"\n  [class.ids-anchor-menu--sticky]=\"sticky\"\n  [attr.aria-label]=\"title\"\n>\n  <ng-content select=\"ids-anchor-menu-header\" />\n  <div class=\"ids-anchor-menu__list\" role=\"list\">\n    <ng-content select=\"ids-anchor-menu-item\" />\n    <ng-content select=\"ids-anchor-active-indicator\" />\n  </div>\n</nav>\n", styles: ["/* Single stylesheet for all anchor-menu slots (ngc inlines this file; do not @use partials). */\n\nids-anchor-menu,\nids-anchor-menu-header,\nids-anchor-menu-item {\n  display: block;\n}\n\nids-anchor-active-indicator {\n  display: block;\n  position: absolute;\n  left: 0;\n  pointer-events: none;\n}\n\n.ids-anchor-menu {\n  box-sizing: border-box;\n  min-width: 200px;\n  max-width: 300px;\n  width: fit-content;\n  background: transparent;\n  border-radius: 0;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n}\n\n.ids-anchor-menu--sticky {\n  position: sticky;\n  top: 0;\n  align-self: flex-start;\n}\n\n.ids-anchor-menu__header {\n  display: block;\n  padding: var(--padding-padding-12) 0;\n  font-size: var(--font-size-body-1, 16px);\n  line-height: var(--font-line-height-line-height-24, 24px);\n  font-weight: 400;\n  color: var(--color-text-gray-neutral-strong);\n  text-transform: none;\n  letter-spacing: normal;\n  border-radius: 0;\n}\n\n.ids-anchor-menu__list {\n  position: relative;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n}\n\n.ids-anchor-menu__link {\n  display: inline-block;\n  width: fit-content;\n  box-sizing: border-box;\n  height: var(--scale-40);\n  padding: var(--padding-padding-8) var(--padding-padding-24);\n  font-size: var(--font-size-body-1, 16px);\n  line-height: var(--font-line-height-line-height-24, 24px);\n  font-weight: 400;\n  color: var(--color-text-gray-neutral);\n  text-decoration: none;\n  position: relative;\n  border-left: 1.2px solid var(--color-border-gray-neutral-base);\n  border-radius: 0;\n  background: transparent;\n  cursor: pointer;\n  outline: none;\n}\n\n.ids-anchor-menu__link:hover {\n  color: var(--color-text-gray-neutral);\n}\n\n.ids-anchor-menu__link:hover::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  /* Padding-box origin: center 4px bar on 1.2px border-left rail. */\n  left: calc((-1.2px - 4px) / 2);\n  width: 4px;\n  border-radius: 0;\n  background: var(--color-border-brand-base);\n}\n\n.ids-anchor-menu__link--active {\n  color: var(--color-text-brand-strong);\n  border-left-color: transparent;\n}\n\n.ids-anchor-menu__link:focus:not(:focus-visible)::after {\n  content: none;\n}\n\n.ids-anchor-menu__link:focus-visible {\n  outline: none;\n}\n\n.ids-anchor-menu__link:focus-visible::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px -6px;\n  border: var(--border-width-border-2) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n.ids-anchor-menu__link[aria-disabled=\"true\"] {\n  cursor: default;\n  pointer-events: none;\n}\n\n.ids-anchor-menu__active-indicator {\n  position: absolute;\n  /* List origin: center 4px bar on the item 1.2px left rail. */\n  left: calc((1.2px - 4px) / 2);\n  display: block;\n  width: 4px;\n  height: var(--scale-40);\n  border-radius: 0;\n  background: var(--color-border-brand-base);\n  pointer-events: none;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { itemQuery: [{
            type: ContentChildren,
            args: [IdsAnchorMenuItemComponent]
        }], title: [{
            type: Input
        }], sticky: [{
            type: Input
        }], itemClick: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAnchorMenuComponent, { className: "IdsAnchorMenuComponent" }); })();
