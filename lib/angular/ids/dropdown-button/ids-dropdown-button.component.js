var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, ViewEncapsulation, } from "@angular/core";
import { DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS, } from "@component-contracts/ids/dropdown-button.contract";
import { IDS_DROPDOWN_BUTTON_CONTEXT, } from "./ids-dropdown-button-context";
import { IdsDropdownButtonMenuComponent } from "./ids-dropdown-button-menu.component";
let IdsDropdownButtonComponent = class IdsDropdownButtonComponent {
    elementRef;
    cdr;
    menuComponent;
    buttonStyle = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.buttonStyle;
    size = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.size;
    disabled = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
    open;
    defaultOpen = DROPDOWN_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultOpen;
    openChange = new EventEmitter();
    selectionChange = new EventEmitter();
    triggerApi;
    menuApi;
    uncontrolledOpen = this.defaultOpen;
    constructor(elementRef, cdr) {
        this.elementRef = elementRef;
        this.cdr = cdr;
    }
    get isOpen() {
        return this.open ?? this.uncontrolledOpen;
    }
    ngOnChanges(changes) {
        if (changes["defaultOpen"]?.firstChange) {
            this.uncontrolledOpen = this.defaultOpen;
        }
        if (changes["disabled"] && this.disabled && this.isOpen) {
            this.applyOpenState(false);
        }
        this.cdr.markForCheck();
    }
    registerTrigger(trigger) {
        this.triggerApi = trigger;
    }
    registerMenu(menu) {
        this.menuApi = menu;
    }
    toggleFromTrigger() {
        if (this.isOpen) {
            this.closeMenu({ focusTrigger: false });
            return;
        }
        this.openFromTrigger();
    }
    openFromTrigger(focusTarget = "first") {
        if (this.disabled) {
            return;
        }
        this.applyOpenState(true);
        queueMicrotask(() => {
            if (focusTarget === "last") {
                this.menuApi?.focusLastEnabledItem();
            }
            else {
                this.menuApi?.focusFirstEnabledItem();
            }
        });
    }
    closeMenu(options) {
        const focusTrigger = options?.focusTrigger ?? true;
        if (!this.isOpen) {
            if (focusTrigger) {
                this.triggerApi?.focusTrigger();
            }
            return;
        }
        this.applyOpenState(false);
        if (focusTrigger) {
            queueMicrotask(() => this.triggerApi?.focusTrigger());
        }
    }
    selectItem(selection) {
        if (this.disabled) {
            return;
        }
        this.selectionChange.emit(selection);
        this.closeMenu({ focusTrigger: true });
    }
    get menuId() {
        return this.menuApi?.menuId ?? this.menuComponent?.menuId ?? null;
    }
    onDocumentClick(event) {
        if (!this.isOpen) {
            return;
        }
        const target = event.target;
        if (target && this.elementRef.nativeElement.contains(target)) {
            return;
        }
        this.closeMenu({ focusTrigger: false });
    }
    onEscape(event) {
        if (!this.isOpen) {
            return;
        }
        event.preventDefault();
        this.closeMenu({ focusTrigger: true });
    }
    applyOpenState(next) {
        if (this.open === undefined) {
            this.uncontrolledOpen = next;
        }
        this.openChange.emit(next);
        this.cdr.markForCheck();
    }
};
__decorate([
    ContentChild(IdsDropdownButtonMenuComponent)
], IdsDropdownButtonComponent.prototype, "menuComponent", void 0);
__decorate([
    Input()
], IdsDropdownButtonComponent.prototype, "buttonStyle", void 0);
__decorate([
    Input()
], IdsDropdownButtonComponent.prototype, "size", void 0);
__decorate([
    Input()
], IdsDropdownButtonComponent.prototype, "disabled", void 0);
__decorate([
    Input()
], IdsDropdownButtonComponent.prototype, "open", void 0);
__decorate([
    Input()
], IdsDropdownButtonComponent.prototype, "defaultOpen", void 0);
__decorate([
    Output()
], IdsDropdownButtonComponent.prototype, "openChange", void 0);
__decorate([
    Output()
], IdsDropdownButtonComponent.prototype, "selectionChange", void 0);
__decorate([
    HostListener("document:click", ["$event"])
], IdsDropdownButtonComponent.prototype, "onDocumentClick", null);
__decorate([
    HostListener("document:keydown.escape", ["$event"])
], IdsDropdownButtonComponent.prototype, "onEscape", null);
IdsDropdownButtonComponent = __decorate([
    Component({
        selector: "ids-dropdown-button",
        standalone: true,
        templateUrl: "./ids-dropdown-button.component.html",
        styleUrl: "./ids-dropdown-button.component.scss",
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [{ provide: IDS_DROPDOWN_BUTTON_CONTEXT, useExisting: IdsDropdownButtonComponent }],
    })
], IdsDropdownButtonComponent);
export { IdsDropdownButtonComponent };
