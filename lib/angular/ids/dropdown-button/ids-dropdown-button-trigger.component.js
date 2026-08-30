var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation, inject, } from "@angular/core";
import { DROPDOWN_BUTTON_CARET_ICON, DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS, DROPDOWN_BUTTON_TRIGGER_ICON, } from "@component-contracts/ids/dropdown-button.contract";
import { IdsIconComponent } from "../../../../storybook-angular/src/components/ids-icon/ids-icon.component";
import { IDS_DROPDOWN_BUTTON_CONTEXT, } from "./ids-dropdown-button-context";
let IdsDropdownButtonTriggerComponent = class IdsDropdownButtonTriggerComponent {
    dropdown = inject(IDS_DROPDOWN_BUTTON_CONTEXT);
    triggerButton;
    label = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.label;
    showLeadingIcon = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.showLeadingIcon;
    iconOnly = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.iconOnly;
    ariaLabel = "";
    leadingIconName = DROPDOWN_BUTTON_TRIGGER_ICON;
    caretIconName = DROPDOWN_BUTTON_CARET_ICON;
    ngAfterViewInit() {
        this.dropdown.registerTrigger(this);
    }
    get accessibleName() {
        if (this.ariaLabel.trim().length > 0) {
            return this.ariaLabel;
        }
        return this.label || DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
    }
    get showIcon() {
        return this.iconOnly || this.showLeadingIcon;
    }
    focusTrigger() {
        this.triggerButton.nativeElement.focus();
    }
    onClick() {
        this.dropdown.toggleFromTrigger();
    }
    onKeydown(event) {
        switch (event.key) {
            case "Enter":
            case " ":
                event.preventDefault();
                if (this.dropdown.isOpen) {
                    this.dropdown.closeMenu({ focusTrigger: true });
                }
                else {
                    this.dropdown.openFromTrigger("first");
                }
                return;
            case "ArrowDown":
                event.preventDefault();
                this.dropdown.openFromTrigger("first");
                return;
            case "ArrowUp":
                event.preventDefault();
                this.dropdown.openFromTrigger("last");
                return;
            default:
                return;
        }
    }
};
__decorate([
    ViewChild("triggerButton", { static: true })
], IdsDropdownButtonTriggerComponent.prototype, "triggerButton", void 0);
__decorate([
    Input()
], IdsDropdownButtonTriggerComponent.prototype, "label", void 0);
__decorate([
    Input()
], IdsDropdownButtonTriggerComponent.prototype, "showLeadingIcon", void 0);
__decorate([
    Input()
], IdsDropdownButtonTriggerComponent.prototype, "iconOnly", void 0);
__decorate([
    Input()
], IdsDropdownButtonTriggerComponent.prototype, "ariaLabel", void 0);
IdsDropdownButtonTriggerComponent = __decorate([
    Component({
        selector: "ids-dropdown-button-trigger",
        standalone: true,
        imports: [IdsIconComponent],
        templateUrl: "./ids-dropdown-button-trigger.component.html",
        styleUrl: "./ids-dropdown-button-trigger.component.scss",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsDropdownButtonTriggerComponent);
export { IdsDropdownButtonTriggerComponent };
