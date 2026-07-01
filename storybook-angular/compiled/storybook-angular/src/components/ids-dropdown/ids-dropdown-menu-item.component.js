import { ChangeDetectionStrategy, Component, ElementRef, Input, inject, } from "@angular/core";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import * as i0 from "@angular/core";
export class IdsDropdownMenuItemComponent {
    elementRef = inject((ElementRef));
    dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
    value;
    label;
    disabled = false;
    toMenuModel() {
        const value = this.value;
        return {
            id: value,
            value,
            label: this.label,
            disabled: this.disabled,
            selectable: true,
            onClick: () => this.dropdown?.toggleValue(value),
        };
    }
    static ɵfac = function IdsDropdownMenuItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownMenuItemComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownMenuItemComponent, selectors: [["ids-dropdown-menu-item"]], inputs: { value: "value", label: "label", disabled: "disabled" }, decls: 0, vars: 0, template: function IdsDropdownMenuItemComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownMenuItemComponent, [{
        type: Component,
        args: [{
                selector: "ids-dropdown-menu-item",
                standalone: true,
                template: "",
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], null, { value: [{
            type: Input,
            args: [{ required: true }]
        }], label: [{
            type: Input,
            args: [{ required: true }]
        }], disabled: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownMenuItemComponent, { className: "IdsDropdownMenuItemComponent", filePath: "src/components/ids-dropdown/ids-dropdown-menu-item.component.ts", lineNumber: 17 }); })();
