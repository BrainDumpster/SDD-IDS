import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_RADIO_BUTTON_GROUP_CONTEXT } from "./ids-radio-button-group-context";
import * as i0 from "@angular/core";
function IdsRadioButtonComponent_Conditional_7_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 8);
} if (rf & 2) {
    i0.ɵɵproperty("size", 16);
} }
function IdsRadioButtonComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵconditionalCreate(1, IdsRadioButtonComponent_Conditional_7_Conditional_1_Template, 1, 1, "ids-icon", 8);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("assistiveTextError", ctx_r0.error)("assistiveTextDisabled", ctx_r0.isDisabled);
    i0.ɵɵproperty("id", ctx_r0.assistiveId);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.error && !ctx_r0.isDisabled ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.helperText, " ");
} }
export class IdsRadioButtonComponent {
    cdr;
    group = inject(IDS_RADIO_BUTTON_GROUP_CONTEXT);
    value;
    label;
    disabled = false;
    error = false;
    helperText;
    /** Docs / Storybook only — static matrix states. */
    simulatedState;
    constructor(cdr) {
        this.cdr = cdr;
    }
    get groupName() {
        return this.group.name;
    }
    get isSelected() {
        return this.group.isSelected(this.value);
    }
    get isDisabled() {
        return this.group.isItemDisabled(this);
    }
    get optionId() {
        return this.group.optionId(this.value);
    }
    get assistiveId() {
        return this.helperText ? `${this.optionId}-assistive` : undefined;
    }
    get simulatedStateAttr() {
        return this.group.simulatedStateAttr(this.simulatedState);
    }
    get tabIndex() {
        return this.group.itemTabIndex(this);
    }
    onSelect() {
        this.group.select(this.value);
    }
    onKeydown(event) {
        this.group.onItemKeydown(event, this);
    }
    onFocus() {
        this.group.onItemFocus(this);
    }
    notifySelectionChange() {
        this.cdr.markForCheck();
    }
    static ɵfac = function IdsRadioButtonComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsRadioButtonComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsRadioButtonComponent, selectors: [["ids-radio-button"]], inputs: { value: "value", label: "label", disabled: "disabled", error: "error", helperText: "helperText", simulatedState: "simulatedState" }, decls: 8, vars: 15, consts: [[1, "field"], [1, "wrapper"], [1, "root"], ["type", "radio", 1, "input", 3, "change", "keydown", "focus", "id", "name", "value", "checked", "disabled", "tabIndex"], [1, "indicator"], [1, "label"], [1, "assistiveText", 3, "id", "assistiveTextError", "assistiveTextDisabled"], [1, "assistiveText", 3, "id"], ["shapeName", "status-critical-square-solid", "variant", "img", "className", "errorIcon", 3, "size"]], template: function IdsRadioButtonComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "label", 1)(2, "span", 2)(3, "input", 3);
            i0.ɵɵlistener("change", function IdsRadioButtonComponent_Template_input_change_3_listener() { return ctx.onSelect(); })("keydown", function IdsRadioButtonComponent_Template_input_keydown_3_listener($event) { return ctx.onKeydown($event); })("focus", function IdsRadioButtonComponent_Template_input_focus_3_listener() { return ctx.onFocus(); });
            i0.ɵɵelementEnd();
            i0.ɵɵelement(4, "span", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "span", 5);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(7, IdsRadioButtonComponent_Conditional_7_Template, 3, 7, "div", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵattribute("data-disabled", ctx.isDisabled ? "" : null);
            i0.ɵɵadvance();
            i0.ɵɵattribute("data-checked", ctx.isSelected ? "" : null)("data-disabled", ctx.isDisabled ? "" : null)("data-error", ctx.error ? "true" : null)("data-simulated-state", ctx.simulatedStateAttr);
            i0.ɵɵadvance();
            i0.ɵɵproperty("id", ctx.optionId)("name", ctx.groupName)("value", ctx.value)("checked", ctx.isSelected)("disabled", ctx.isDisabled)("tabIndex", ctx.tabIndex);
            i0.ɵɵattribute("aria-invalid", ctx.error || null)("aria-describedby", ctx.assistiveId);
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.helperText ? 7 : -1);
        } }, dependencies: [CommonModule, IdsIconComponent], styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.field[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n}\n\n.wrapper[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  cursor: pointer;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  min-height: 20px;\n}\n\n.wrapper[data-disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n}\n\n.root[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: 50%;\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: all 100ms ease;\n  cursor: inherit;\n  outline: none;\n  padding: 0;\n  position: relative;\n}\n\n.input[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  opacity: 0;\n  cursor: inherit;\n}\n\n.root[_ngcontent-%COMP%]:has(.input:hover:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[_ngcontent-%COMP%]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[_ngcontent-%COMP%]:has(.input:focus-visible) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.root[data-checked][_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-checked][_ngcontent-%COMP%]:has(.input:hover:not(:disabled)), \n.root[data-checked][_ngcontent-%COMP%]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.wrapper[_ngcontent-%COMP%]:hover   .root[_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.wrapper[_ngcontent-%COMP%]:hover   .root[data-checked][_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked][_ngcontent-%COMP%]:has(.input:hover:not(:disabled))   .indicator[_ngcontent-%COMP%], \n.root[data-checked][_ngcontent-%COMP%]:has(.input:active:not(:disabled))   .indicator[_ngcontent-%COMP%] {\n  background: var(--color-icon-brand-strong);\n}\n\n.root[data-disabled][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n  cursor: not-allowed;\n}\n\n.root[data-disabled][data-checked][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.indicator[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--color-icon-brand-base);\n  transform: scale(0);\n  transition: transform 100ms ease;\n  pointer-events: none;\n}\n\n.root[data-checked][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  transform: scale(1);\n}\n\n.root[data-disabled][data-checked][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  background: var(--color-icon-disabled);\n}\n\n.root[data-simulated-state=\"hover\"][_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked][data-simulated-state=\"hover\"][_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked][data-simulated-state=\"hover\"][_ngcontent-%COMP%]:not([data-disabled])   .indicator[_ngcontent-%COMP%] {\n  background: var(--color-icon-brand-strong);\n}\n\n.root[data-simulated-state=\"focus-visible\"][_ngcontent-%COMP%] {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.label[_ngcontent-%COMP%] {\n  user-select: none;\n}\n\n.wrapper[data-disabled][_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  color: var(--color-text-disabled);\n}\n\n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]) {\n  border-color: var(--color-border-strong);\n}\n\n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]):has(.input:hover:not(:disabled)), \n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]):has(.input:active:not(:disabled)) {\n  border-color: var(--color-border-strong);\n}\n\n.assistiveText[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  margin: 0;\n}\n\n[_nghost-%COMP%]     .errorIcon {\n  width: 16px;\n  height: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.assistiveTextError[_ngcontent-%COMP%] {\n  color: var(--color-text-critical);\n}\n\n.assistiveTextDisabled[_ngcontent-%COMP%] {\n  color: var(--color-text-disabled);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsRadioButtonComponent, [{
        type: Component,
        args: [{ selector: "ids-radio-button", standalone: true, imports: [CommonModule, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"field\">\n  <label class=\"wrapper\" [attr.data-disabled]=\"isDisabled ? '' : null\">\n    <span\n      class=\"root\"\n      [attr.data-checked]=\"isSelected ? '' : null\"\n      [attr.data-disabled]=\"isDisabled ? '' : null\"\n      [attr.data-error]=\"error ? 'true' : null\"\n      [attr.data-simulated-state]=\"simulatedStateAttr\"\n    >\n      <input\n        type=\"radio\"\n        class=\"input\"\n        [id]=\"optionId\"\n        [name]=\"groupName\"\n        [value]=\"value\"\n        [checked]=\"isSelected\"\n        [disabled]=\"isDisabled\"\n        [tabIndex]=\"tabIndex\"\n        [attr.aria-invalid]=\"error || null\"\n        [attr.aria-describedby]=\"assistiveId\"\n        (change)=\"onSelect()\"\n        (keydown)=\"onKeydown($event)\"\n        (focus)=\"onFocus()\"\n      />\n      <span class=\"indicator\"></span>\n    </span>\n    <span class=\"label\">{{ label }}</span>\n  </label>\n  @if (helperText) {\n    <div\n      [id]=\"assistiveId\"\n      class=\"assistiveText\"\n      [class.assistiveTextError]=\"error\"\n      [class.assistiveTextDisabled]=\"isDisabled\"\n    >\n      @if (error && !isDisabled) {\n        <ids-icon\n          shapeName=\"status-critical-square-solid\"\n          variant=\"img\"\n          className=\"errorIcon\"\n          [size]=\"16\"\n        />\n      }\n      {{ helperText }}\n    </div>\n  }\n</div>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.field {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n}\n\n.wrapper {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  cursor: pointer;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  min-height: 20px;\n}\n\n.wrapper[data-disabled] {\n  cursor: not-allowed;\n}\n\n.root {\n  width: 16px;\n  height: 16px;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: 50%;\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: all 100ms ease;\n  cursor: inherit;\n  outline: none;\n  padding: 0;\n  position: relative;\n}\n\n.input {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  opacity: 0;\n  cursor: inherit;\n}\n\n.root:has(.input:hover:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root:has(.input:focus-visible) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.root[data-checked] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-checked]:has(.input:hover:not(:disabled)),\n.root[data-checked]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.wrapper:hover .root:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.wrapper:hover .root[data-checked]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked]:has(.input:hover:not(:disabled)) .indicator,\n.root[data-checked]:has(.input:active:not(:disabled)) .indicator {\n  background: var(--color-icon-brand-strong);\n}\n\n.root[data-disabled] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n  cursor: not-allowed;\n}\n\n.root[data-disabled][data-checked] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.indicator {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--color-icon-brand-base);\n  transform: scale(0);\n  transition: transform 100ms ease;\n  pointer-events: none;\n}\n\n.root[data-checked] .indicator {\n  transform: scale(1);\n}\n\n.root[data-disabled][data-checked] .indicator {\n  background: var(--color-icon-disabled);\n}\n\n.root[data-simulated-state=\"hover\"]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked][data-simulated-state=\"hover\"]:not([data-disabled]) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-checked][data-simulated-state=\"hover\"]:not([data-disabled]) .indicator {\n  background: var(--color-icon-brand-strong);\n}\n\n.root[data-simulated-state=\"focus-visible\"] {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.label {\n  user-select: none;\n}\n\n.wrapper[data-disabled] .label {\n  color: var(--color-text-disabled);\n}\n\n.root[data-error=\"true\"]:not([data-checked]) {\n  border-color: var(--color-border-strong);\n}\n\n.root[data-error=\"true\"]:not([data-checked]):has(.input:hover:not(:disabled)),\n.root[data-error=\"true\"]:not([data-checked]):has(.input:active:not(:disabled)) {\n  border-color: var(--color-border-strong);\n}\n\n.assistiveText {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  margin: 0;\n}\n\n:host ::ng-deep .errorIcon {\n  width: 16px;\n  height: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.assistiveTextError {\n  color: var(--color-text-critical);\n}\n\n.assistiveTextDisabled {\n  color: var(--color-text-disabled);\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { value: [{
            type: Input,
            args: [{ required: true }]
        }], label: [{
            type: Input,
            args: [{ required: true }]
        }], disabled: [{
            type: Input
        }], error: [{
            type: Input
        }], helperText: [{
            type: Input
        }], simulatedState: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsRadioButtonComponent, { className: "IdsRadioButtonComponent", filePath: "src/components/ids-radio-button/ids-radio-button.component.ts", lineNumber: 21 }); })();
