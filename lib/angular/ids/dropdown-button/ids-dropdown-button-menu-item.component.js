var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation, inject, } from "@angular/core";
import { IDS_DROPDOWN_BUTTON_CONTEXT } from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuComponent } from "./ids-dropdown-button-menu.component";
let IdsDropdownButtonMenuItemComponent = class IdsDropdownButtonMenuItemComponent {
    dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);
    menu = inject(IdsDropdownButtonMenuComponent, { host: true });
    itemButton;
    value;
    label;
    disabled = false;
    focusItem() {
        this.itemButton.nativeElement.focus();
    }
    onClick() {
        if (this.disabled) {
            return;
        }
        this.dropdown.selectItem({ value: this.value, label: this.label });
    }
    onKeydown(event) {
        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                this.menu.focusNextItem(this);
                return;
            case "ArrowUp":
                event.preventDefault();
                this.menu.focusPreviousItem(this);
                return;
            case "Home":
                event.preventDefault();
                this.menu.focusFirstEnabledItem();
                return;
            case "End":
                event.preventDefault();
                this.menu.focusLastEnabledItem();
                return;
            case "Tab":
                this.dropdown.closeMenu({ focusTrigger: false });
                return;
            case "Escape":
                event.preventDefault();
                this.dropdown.closeMenu({ focusTrigger: true });
                return;
            case "Enter":
            case " ":
                event.preventDefault();
                this.onClick();
                return;
            default:
                return;
        }
    }
};
__decorate([
    ViewChild("itemButton", { static: true })
], IdsDropdownButtonMenuItemComponent.prototype, "itemButton", void 0);
__decorate([
    Input({ required: true })
], IdsDropdownButtonMenuItemComponent.prototype, "value", void 0);
__decorate([
    Input({ required: true })
], IdsDropdownButtonMenuItemComponent.prototype, "label", void 0);
__decorate([
    Input()
], IdsDropdownButtonMenuItemComponent.prototype, "disabled", void 0);
IdsDropdownButtonMenuItemComponent = __decorate([
    Component({
        selector: "ids-dropdown-button-menu-item",
        standalone: true,
        templateUrl: "./ids-dropdown-button-menu-item.component.html",
        styleUrl: "./ids-dropdown-button-menu-item.component.scss",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDropdownButtonMenuItemComponent);
export { IdsDropdownButtonMenuItemComponent };
