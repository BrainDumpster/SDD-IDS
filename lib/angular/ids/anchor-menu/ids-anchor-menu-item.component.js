var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
let IdsAnchorMenuItemComponent = class IdsAnchorMenuItemComponent {
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
};
__decorate([
    Input({ required: true })
], IdsAnchorMenuItemComponent.prototype, "label", void 0);
__decorate([
    Input({ required: true })
], IdsAnchorMenuItemComponent.prototype, "href", void 0);
__decorate([
    Input()
], IdsAnchorMenuItemComponent.prototype, "active", void 0);
IdsAnchorMenuItemComponent = __decorate([
    Component({
        selector: "ids-anchor-menu-item",
        standalone: true,
        templateUrl: "./ids-anchor-menu-item.component.html",
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsAnchorMenuItemComponent);
export { IdsAnchorMenuItemComponent };
