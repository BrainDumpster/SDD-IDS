var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, ContentChildren, ViewEncapsulation, inject, } from "@angular/core";
import { IDS_DROPDOWN_BUTTON_CONTEXT } from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuItemComponent } from "./ids-dropdown-button-menu-item.component";
let nextMenuId = 0;
let IdsDropdownButtonMenuComponent = class IdsDropdownButtonMenuComponent {
    cdr;
    dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);
    itemQuery;
    menuId = `ids-dropdown-button-menu-${nextMenuId++}`;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngAfterContentInit() {
        this.dropdown.registerMenu(this);
        this.itemQuery.changes.subscribe(() => this.cdr.markForCheck());
    }
    focusFirstEnabledItem() {
        this.enabledItems()[0]?.focusItem();
    }
    focusLastEnabledItem() {
        const items = this.enabledItems();
        items[items.length - 1]?.focusItem();
    }
    focusNextItem(current) {
        const items = this.enabledItems();
        const index = items.indexOf(current);
        if (index < 0) {
            items[0]?.focusItem();
            return;
        }
        items[(index + 1) % items.length]?.focusItem();
    }
    focusPreviousItem(current) {
        const items = this.enabledItems();
        const index = items.indexOf(current);
        if (index < 0) {
            items[items.length - 1]?.focusItem();
            return;
        }
        items[(index - 1 + items.length) % items.length]?.focusItem();
    }
    enabledItems() {
        return (this.itemQuery?.toArray() ?? []).filter((item) => !item.disabled);
    }
};
__decorate([
    ContentChildren(IdsDropdownButtonMenuItemComponent)
], IdsDropdownButtonMenuComponent.prototype, "itemQuery", void 0);
IdsDropdownButtonMenuComponent = __decorate([
    Component({
        selector: "ids-dropdown-button-menu",
        standalone: true,
        templateUrl: "./ids-dropdown-button-menu.component.html",
        styleUrl: "./ids-dropdown-button-menu.component.scss",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDropdownButtonMenuComponent);
export { IdsDropdownButtonMenuComponent };
