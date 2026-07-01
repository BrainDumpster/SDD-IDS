import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
export class IdsDropdownTagComponent {
    label;
    dismiss = new EventEmitter();
    static ɵfac = function IdsDropdownTagComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownTagComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownTagComponent, selectors: [["ids-dropdown-tag"]], inputs: { label: "label" }, outputs: { dismiss: "dismiss" }, decls: 5, vars: 3, consts: [[1, "tag", "editable"], [1, "label"], ["type", "button", 1, "dismiss", 3, "click"], ["shapeName", "shape-x-thick", 3, "size"]], template: function IdsDropdownTagComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "span", 0)(1, "span", 1);
            i0.ɵɵtext(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "button", 2);
            i0.ɵɵlistener("click", function IdsDropdownTagComponent_Template_button_click_3_listener() { return ctx.dismiss.emit(); });
            i0.ɵɵelement(4, "ids-icon", 3);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵattribute("aria-label", "Remove " + ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵproperty("size", 10);
        } }, dependencies: [IdsIconComponent], styles: [".tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--corner-radius-radius-24);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n  font-family: inherit;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n}\n\n.label[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dismiss[_ngcontent-%COMP%] {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  cursor: pointer;\n  color: var(--color-icon-accessible);\n}\n\n.dismiss[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownTagComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown-tag", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<span class=\"tag editable\">\n  <span class=\"label\">{{ label }}</span>\n  <button type=\"button\" class=\"dismiss\" [attr.aria-label]=\"'Remove ' + label\" (click)=\"dismiss.emit()\">\n    <ids-icon shapeName=\"shape-x-thick\" [size]=\"10\" />\n  </button>\n</span>\n", styles: [".tag {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--corner-radius-radius-24);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n  font-family: inherit;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n}\n\n.label {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dismiss {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  cursor: pointer;\n  color: var(--color-icon-accessible);\n}\n\n.dismiss:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n"] }]
    }], null, { label: [{
            type: Input,
            args: [{ required: true }]
        }], dismiss: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownTagComponent, { className: "IdsDropdownTagComponent", filePath: "src/components/ids-dropdown/ids-dropdown-tag.component.ts", lineNumber: 12 }); })();
