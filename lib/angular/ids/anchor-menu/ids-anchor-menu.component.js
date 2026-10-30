var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { ANCHOR_MENU_API_DEFAULTS, } from "@component-contracts/ids/anchor-menu.contract";
import { IDS_ANCHOR_MENU_CONTEXT, } from "./ids-anchor-menu-context";
import { IdsAnchorMenuItemComponent } from "./ids-anchor-menu-item.component";
let IdsAnchorMenuComponent = class IdsAnchorMenuComponent {
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
};
__decorate([
    ContentChildren(IdsAnchorMenuItemComponent)
], IdsAnchorMenuComponent.prototype, "itemQuery", void 0);
__decorate([
    Input()
], IdsAnchorMenuComponent.prototype, "title", void 0);
__decorate([
    Input()
], IdsAnchorMenuComponent.prototype, "sticky", void 0);
__decorate([
    Output()
], IdsAnchorMenuComponent.prototype, "itemClick", void 0);
IdsAnchorMenuComponent = __decorate([
    Component({
        selector: "ids-anchor-menu",
        standalone: true,
        templateUrl: "./ids-anchor-menu.component.html",
        styleUrl: "./ids-anchor-menu.component.scss",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [{ provide: IDS_ANCHOR_MENU_CONTEXT, useExisting: IdsAnchorMenuComponent }],
    })
], IdsAnchorMenuComponent);
export { IdsAnchorMenuComponent };
