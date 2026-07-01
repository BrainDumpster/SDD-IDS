import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, inject } from "@angular/core";
import * as i0 from "@angular/core";
export class IdsDropdownMenuFooterComponent {
    elementRef = inject((ElementRef));
    actionLabel;
    action = new EventEmitter();
    static ɵfac = function IdsDropdownMenuFooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownMenuFooterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownMenuFooterComponent, selectors: [["ids-dropdown-menu-footer"]], inputs: { actionLabel: "actionLabel" }, outputs: { action: "action" }, decls: 0, vars: 0, template: function IdsDropdownMenuFooterComponent_Template(rf, ctx) { }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownMenuFooterComponent, [{
        type: Component,
        args: [{
                selector: "ids-dropdown-menu-footer",
                standalone: true,
                template: "",
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], null, { actionLabel: [{
            type: Input,
            args: [{ required: true }]
        }], action: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownMenuFooterComponent, { className: "IdsDropdownMenuFooterComponent", filePath: "src/components/ids-dropdown/ids-dropdown-menu-footer.component.ts", lineNumber: 9 }); })();
