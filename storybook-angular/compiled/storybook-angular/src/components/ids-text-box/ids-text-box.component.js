import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TEXT_BOX_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/text-box.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
function IdsTextBoxComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "textarea", 6);
    i0.ɵɵlistener("keydown", function IdsTextBoxComponent_Conditional_2_Template_textarea_keydown_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onKeyDown($event)); })("focus", function IdsTextBoxComponent_Conditional_2_Template_textarea_focus_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onFocus()); })("blur", function IdsTextBoxComponent_Conditional_2_Template_textarea_blur_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBlur()); })("input", function IdsTextBoxComponent_Conditional_2_Template_textarea_input_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onInput($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("id", ctx_r1.resolvedId)("name", ctx_r1.name)("rows", ctx_r1.rows)("placeholder", ctx_r1.placeholder)("disabled", ctx_r1.disabled)("value", ctx_r1.resolvedValue);
    i0.ɵɵattribute("aria-label", ctx_r1.ariaLabel || null)("aria-invalid", ctx_r1.computedInvalid ? "true" : "false")("aria-describedby", ctx_r1.describedBy || null);
} }
function IdsTextBoxComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "input", 7);
    i0.ɵɵlistener("keydown", function IdsTextBoxComponent_Conditional_3_Template_input_keydown_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onKeyDown($event)); })("focus", function IdsTextBoxComponent_Conditional_3_Template_input_focus_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onFocus()); })("blur", function IdsTextBoxComponent_Conditional_3_Template_input_blur_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onBlur()); })("input", function IdsTextBoxComponent_Conditional_3_Template_input_input_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onInput($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("id", ctx_r1.resolvedId)("name", ctx_r1.name)("type", ctx_r1.inputType)("placeholder", ctx_r1.placeholder)("disabled", ctx_r1.disabled)("value", ctx_r1.resolvedValue);
    i0.ɵɵattribute("aria-label", ctx_r1.ariaLabel || null)("aria-invalid", ctx_r1.computedInvalid ? "true" : "false")("aria-describedby", ctx_r1.describedBy || null);
} }
function IdsTextBoxComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 4);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("shapeName", ctx_r1.iconName)("size", 16);
} }
function IdsTextBoxComponent_Conditional_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 8);
} if (rf & 2) {
    i0.ɵɵproperty("size", 16);
} }
function IdsTextBoxComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵconditionalCreate(1, IdsTextBoxComponent_Conditional_5_Conditional_1_Template, 1, 1, "ids-icon", 8);
    i0.ɵɵelementStart(2, "p", 9);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("id", ctx_r1.helperId);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.computedInvalid ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ids-text-box__helper-copy--error", ctx_r1.computedInvalid);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.helperCopy, " ");
} }
export class IdsTextBoxComponent {
    cdr;
    componentType = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.componentType;
    size = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.size;
    /** Demo/testing override — runtime interaction still applies when not forced. */
    state = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.state;
    placeholder = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.placeholder;
    value;
    defaultValue = "";
    disabled = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.disabled;
    invalid = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.invalid;
    helperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.helperText;
    errorText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.errorText;
    showHelperText = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showHelperText;
    showIcon = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.showIcon;
    iconName = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.iconName;
    id;
    name;
    rows = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.rows;
    inputType = TEXT_BOX_SPEC_ACCURATE_DEFAULTS.inputType;
    ariaLabel;
    ariaDescribedBy;
    valueChange = new EventEmitter();
    focusModality = "pointer";
    isFocused = false;
    internalValue = "";
    generatedId = `ids-text-box-${Math.random().toString(36).slice(2, 9)}`;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnChanges(changes) {
        if (changes["defaultValue"] && this.value === undefined && !changes["defaultValue"].firstChange) {
            this.internalValue = this.defaultValue;
        }
        if (changes["defaultValue"]?.firstChange && this.value === undefined) {
            this.internalValue = this.defaultValue;
        }
    }
    get resolvedId() {
        return this.id ?? this.generatedId;
    }
    get helperId() {
        return `${this.resolvedId}-help`;
    }
    get computedInvalid() {
        return this.invalid || this.state === "error";
    }
    get visualState() {
        if (this.disabled) {
            return "disabled";
        }
        if (this.computedInvalid) {
            return "error";
        }
        return this.state;
    }
    get shouldRenderHelper() {
        return this.showHelperText && (this.computedInvalid || Boolean(this.helperText));
    }
    get helperCopy() {
        return this.computedInvalid ? this.errorText : this.helperText;
    }
    get resolvedValue() {
        return this.value ?? this.internalValue;
    }
    get isTextArea() {
        return this.componentType === "text-area";
    }
    get describedBy() {
        if (this.shouldRenderHelper) {
            return this.ariaDescribedBy ?? this.helperId;
        }
        return this.ariaDescribedBy;
    }
    onPointerDown() {
        this.focusModality = "pointer";
    }
    onKeyDown(event) {
        if (event.key === "Tab") {
            this.focusModality = "keyboard";
        }
    }
    onFocus() {
        this.isFocused = true;
        this.cdr.markForCheck();
    }
    onBlur() {
        this.isFocused = false;
        this.cdr.markForCheck();
    }
    onInput(event) {
        const next = event.target.value;
        if (this.value === undefined) {
            this.internalValue = next;
        }
        this.valueChange.emit(next);
    }
    static ɵfac = function IdsTextBoxComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTextBoxComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTextBoxComponent, selectors: [["ids-text-box"]], inputs: { componentType: "componentType", size: "size", state: "state", placeholder: "placeholder", value: "value", defaultValue: "defaultValue", disabled: "disabled", invalid: "invalid", helperText: "helperText", errorText: "errorText", showHelperText: "showHelperText", showIcon: "showIcon", iconName: "iconName", id: "id", name: "name", rows: "rows", inputType: "inputType", ariaLabel: "ariaLabel", ariaDescribedBy: "ariaDescribedBy" }, outputs: { valueChange: "valueChange" }, features: [i0.ɵɵNgOnChangesFeature], decls: 6, vars: 12, consts: [[1, "ids-text-box"], [1, "ids-text-box__control", 3, "pointerdown"], [1, "ids-text-box__value", 3, "id", "name", "rows", "placeholder", "disabled", "value"], [1, "ids-text-box__value", 3, "id", "name", "type", "placeholder", "disabled", "value"], ["variant", "img", "className", "ids-text-box__suffix-icon", 3, "shapeName", "size"], [1, "ids-text-box__helper-row", 3, "id"], [1, "ids-text-box__value", 3, "keydown", "focus", "blur", "input", "id", "name", "rows", "placeholder", "disabled", "value"], [1, "ids-text-box__value", 3, "keydown", "focus", "blur", "input", "id", "name", "type", "placeholder", "disabled", "value"], ["shapeName", "status-critical-square-solid", "variant", "img", "className", "ids-text-box__error-icon", 3, "size"], [1, "ids-text-box__helper-copy"]], template: function IdsTextBoxComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵlistener("pointerdown", function IdsTextBoxComponent_Template_div_pointerdown_1_listener() { return ctx.onPointerDown(); });
            i0.ɵɵconditionalCreate(2, IdsTextBoxComponent_Conditional_2_Template, 1, 9, "textarea", 2)(3, IdsTextBoxComponent_Conditional_3_Template, 1, 9, "input", 3);
            i0.ɵɵconditionalCreate(4, IdsTextBoxComponent_Conditional_4_Template, 1, 2, "ids-icon", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(5, IdsTextBoxComponent_Conditional_5_Template, 4, 5, "div", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵclassProp("ids-text-box__control--large", !ctx.isTextArea && ctx.size === "large")("ids-text-box__control--small", !ctx.isTextArea && ctx.size === "small")("ids-text-box__control--text-area", ctx.isTextArea);
            i0.ɵɵattribute("data-state", ctx.visualState)("data-focus-modality", ctx.focusModality)("data-focused", ctx.isFocused ? "" : null);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isTextArea ? 2 : 3);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showIcon ? 4 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.shouldRenderHelper ? 5 : -1);
        } }, dependencies: [CommonModule, IdsIconComponent], styles: ["\n\n.ids-text-box[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  width: 100%;\n  max-width: 300px;\n}\n\n.ids-text-box__control[_ngcontent-%COMP%] {\n  align-items: center;\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--text-box-control-radius);\n  display: flex;\n  gap: var(--spacing-space-10);\n  padding: 0 var(--padding-padding-16);\n  position: relative;\n  width: 100%;\n}\n\n.ids-text-box__control--large[_ngcontent-%COMP%] {\n  height: 40px;\n}\n\n.ids-text-box__control--small[_ngcontent-%COMP%] {\n  height: 32px;\n}\n\n.ids-text-box__control--text-area[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  min-height: 126px;\n  padding-bottom: var(--padding-padding-10);\n  padding-top: 9px;\n}\n\n.ids-text-box__control[_ngcontent-%COMP%]:hover:not([data-state=\"disabled\"]):not([data-state=\"error\"]) {\n  border-color: var(--color-border-strong);\n}\n\n.ids-text-box__control[data-state=\"hover\"][_ngcontent-%COMP%] {\n  border-color: var(--color-border-strong);\n\n  ::ng-deep .ids-text-box__suffix-icon {\n    opacity: 0.92;\n  }\n}\n\n.ids-text-box__control[data-state=\"selected\"][_ngcontent-%COMP%] {\n  border-color: var(--color-border-brand-base);\n}\n\n.ids-text-box__control[data-state=\"focus\"][_ngcontent-%COMP%], \n.ids-text-box__control[data-focus-modality=\"pointer\"][data-focused][_ngcontent-%COMP%]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  ) {\n  border-color: var(--color-border-brand-base);\n}\n\n.ids-text-box__control[data-focus-modality=\"keyboard\"][data-focused][_ngcontent-%COMP%]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  ) {\n  border-color: var(--color-border-accessible);\n}\n\n.ids-text-box__control[data-state=\"focus\"][_ngcontent-%COMP%]::after, \n.ids-text-box__control[data-focus-modality=\"keyboard\"][data-focused][_ngcontent-%COMP%]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  )::after {\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--text-box-focus-ring-radius);\n  content: \"\";\n  inset: -5px;\n  pointer-events: none;\n  position: absolute;\n}\n\n.ids-text-box__control[data-focus-modality=\"pointer\"][data-focused][_ngcontent-%COMP%]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  )::after {\n  content: none;\n}\n\n.ids-text-box__control[data-state=\"disabled\"][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-light);\n\n  ::ng-deep .ids-text-box__suffix-icon {\n    opacity: 0.6;\n  }\n}\n\n.ids-text-box__control[data-state=\"error\"][_ngcontent-%COMP%] {\n  border-color: var(--color-border-alerting-critical-base);\n}\n\n.ids-text-box__value[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  color: var(--color-text-neutral);\n  flex: 1 1 auto;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  min-width: 0;\n  outline: none;\n  resize: none;\n}\n\n.ids-text-box__value[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-disabled);\n}\n\n.ids-text-box__control[data-state=\"disabled\"][_ngcontent-%COMP%]   .ids-text-box__value[_ngcontent-%COMP%], \n.ids-text-box__control[data-state=\"disabled\"][_ngcontent-%COMP%]   .ids-text-box__value[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-disabled);\n}\n\n.ids-text-box__suffix-icon[_ngcontent-%COMP%] {\n  height: 16px;\n  width: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.ids-text-box__helper-row[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  gap: var(--spacing-space-8);\n  min-height: 20px;\n}\n\n.ids-text-box__helper-copy[_ngcontent-%COMP%] {\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  margin: 0;\n}\n\n.ids-text-box__helper-copy--error[_ngcontent-%COMP%] {\n  color: var(--color-text-critical);\n}\n\n.ids-text-box__error-icon[_ngcontent-%COMP%] {\n  height: 16px;\n  width: 16px;\n  flex: 0 0 auto;\n  display: block;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTextBoxComponent, [{
        type: Component,
        args: [{ selector: "ids-text-box", standalone: true, imports: [CommonModule, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"ids-text-box\">\n  <div\n    class=\"ids-text-box__control\"\n    [class.ids-text-box__control--large]=\"!isTextArea && size === 'large'\"\n    [class.ids-text-box__control--small]=\"!isTextArea && size === 'small'\"\n    [class.ids-text-box__control--text-area]=\"isTextArea\"\n    [attr.data-state]=\"visualState\"\n    [attr.data-focus-modality]=\"focusModality\"\n    [attr.data-focused]=\"isFocused ? '' : null\"\n    (pointerdown)=\"onPointerDown()\"\n  >\n    @if (isTextArea) {\n      <textarea\n        class=\"ids-text-box__value\"\n        [id]=\"resolvedId\"\n        [name]=\"name\"\n        [rows]=\"rows\"\n        [placeholder]=\"placeholder\"\n        [disabled]=\"disabled\"\n        [value]=\"resolvedValue\"\n        [attr.aria-label]=\"ariaLabel || null\"\n        [attr.aria-invalid]=\"computedInvalid ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy || null\"\n        (keydown)=\"onKeyDown($event)\"\n        (focus)=\"onFocus()\"\n        (blur)=\"onBlur()\"\n        (input)=\"onInput($event)\"\n      ></textarea>\n    } @else {\n      <input\n        class=\"ids-text-box__value\"\n        [id]=\"resolvedId\"\n        [name]=\"name\"\n        [type]=\"inputType\"\n        [placeholder]=\"placeholder\"\n        [disabled]=\"disabled\"\n        [value]=\"resolvedValue\"\n        [attr.aria-label]=\"ariaLabel || null\"\n        [attr.aria-invalid]=\"computedInvalid ? 'true' : 'false'\"\n        [attr.aria-describedby]=\"describedBy || null\"\n        (keydown)=\"onKeyDown($event)\"\n        (focus)=\"onFocus()\"\n        (blur)=\"onBlur()\"\n        (input)=\"onInput($event)\"\n      />\n    }\n\n    @if (showIcon) {\n      <ids-icon\n        [shapeName]=\"iconName\"\n        variant=\"img\"\n        className=\"ids-text-box__suffix-icon\"\n        [size]=\"16\"\n      />\n    }\n  </div>\n\n  @if (shouldRenderHelper) {\n    <div class=\"ids-text-box__helper-row\" [id]=\"helperId\">\n      @if (computedInvalid) {\n        <ids-icon\n          shapeName=\"status-critical-square-solid\"\n          variant=\"img\"\n          className=\"ids-text-box__error-icon\"\n          [size]=\"16\"\n        />\n      }\n      <p\n        class=\"ids-text-box__helper-copy\"\n        [class.ids-text-box__helper-copy--error]=\"computedInvalid\"\n      >\n        {{ helperCopy }}\n      </p>\n    </div>\n  }\n</div>\n", styles: ["/* Ported from storybook/src/components/IdsTextBox.module.css */\n\n.ids-text-box {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  width: 100%;\n  max-width: 300px;\n}\n\n.ids-text-box__control {\n  align-items: center;\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--text-box-control-radius);\n  display: flex;\n  gap: var(--spacing-space-10);\n  padding: 0 var(--padding-padding-16);\n  position: relative;\n  width: 100%;\n}\n\n.ids-text-box__control--large {\n  height: 40px;\n}\n\n.ids-text-box__control--small {\n  height: 32px;\n}\n\n.ids-text-box__control--text-area {\n  align-items: flex-start;\n  min-height: 126px;\n  padding-bottom: var(--padding-padding-10);\n  padding-top: 9px;\n}\n\n.ids-text-box__control:hover:not([data-state=\"disabled\"]):not([data-state=\"error\"]) {\n  border-color: var(--color-border-strong);\n}\n\n.ids-text-box__control[data-state=\"hover\"] {\n  border-color: var(--color-border-strong);\n\n  ::ng-deep .ids-text-box__suffix-icon {\n    opacity: 0.92;\n  }\n}\n\n.ids-text-box__control[data-state=\"selected\"] {\n  border-color: var(--color-border-brand-base);\n}\n\n.ids-text-box__control[data-state=\"focus\"],\n.ids-text-box__control[data-focus-modality=\"pointer\"][data-focused]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  ) {\n  border-color: var(--color-border-brand-base);\n}\n\n.ids-text-box__control[data-focus-modality=\"keyboard\"][data-focused]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  ) {\n  border-color: var(--color-border-accessible);\n}\n\n.ids-text-box__control[data-state=\"focus\"]::after,\n.ids-text-box__control[data-focus-modality=\"keyboard\"][data-focused]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  )::after {\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--text-box-focus-ring-radius);\n  content: \"\";\n  inset: -5px;\n  pointer-events: none;\n  position: absolute;\n}\n\n.ids-text-box__control[data-focus-modality=\"pointer\"][data-focused]:not([data-state=\"disabled\"]):not(\n    [data-state=\"error\"]\n  )::after {\n  content: none;\n}\n\n.ids-text-box__control[data-state=\"disabled\"] {\n  background: var(--color-background-gray-light);\n\n  ::ng-deep .ids-text-box__suffix-icon {\n    opacity: 0.6;\n  }\n}\n\n.ids-text-box__control[data-state=\"error\"] {\n  border-color: var(--color-border-alerting-critical-base);\n}\n\n.ids-text-box__value {\n  background: transparent;\n  border: none;\n  color: var(--color-text-neutral);\n  flex: 1 1 auto;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  min-width: 0;\n  outline: none;\n  resize: none;\n}\n\n.ids-text-box__value::placeholder {\n  color: var(--color-text-disabled);\n}\n\n.ids-text-box__control[data-state=\"disabled\"] .ids-text-box__value,\n.ids-text-box__control[data-state=\"disabled\"] .ids-text-box__value::placeholder {\n  color: var(--color-text-disabled);\n}\n\n.ids-text-box__suffix-icon {\n  height: 16px;\n  width: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.ids-text-box__helper-row {\n  align-items: center;\n  display: flex;\n  gap: var(--spacing-space-8);\n  min-height: 20px;\n}\n\n.ids-text-box__helper-copy {\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  margin: 0;\n}\n\n.ids-text-box__helper-copy--error {\n  color: var(--color-text-critical);\n}\n\n.ids-text-box__error-icon {\n  height: 16px;\n  width: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { componentType: [{
            type: Input
        }], size: [{
            type: Input
        }], state: [{
            type: Input
        }], placeholder: [{
            type: Input
        }], value: [{
            type: Input
        }], defaultValue: [{
            type: Input
        }], disabled: [{
            type: Input
        }], invalid: [{
            type: Input
        }], helperText: [{
            type: Input
        }], errorText: [{
            type: Input
        }], showHelperText: [{
            type: Input
        }], showIcon: [{
            type: Input
        }], iconName: [{
            type: Input
        }], id: [{
            type: Input
        }], name: [{
            type: Input
        }], rows: [{
            type: Input
        }], inputType: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }], ariaDescribedBy: [{
            type: Input
        }], valueChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTextBoxComponent, { className: "IdsTextBoxComponent", filePath: "src/components/ids-text-box/ids-text-box.component.ts", lineNumber: 30 }); })();
