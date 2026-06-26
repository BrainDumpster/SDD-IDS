import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, inject, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CHECKBOX_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/checkbox.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_CHECKBOX_GROUP_CONTEXT } from "./ids-checkbox-group-context";
import * as i0 from "@angular/core";
const _c0 = ["checkboxInput"];
function IdsCheckboxComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 5);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("data-indicator-type", ctx_r0.indicatorType);
} }
function IdsCheckboxComponent_Conditional_8_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 8);
} if (rf & 2) {
    i0.ɵɵproperty("size", 16);
} }
function IdsCheckboxComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵconditionalCreate(1, IdsCheckboxComponent_Conditional_8_Conditional_1_Template, 1, 1, "ids-icon", 8);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("assistiveTextError", ctx_r0.error)("assistiveTextDisabled", ctx_r0.resolvedDisabled);
    i0.ɵɵproperty("id", ctx_r0.assistiveId);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.error && !ctx_r0.resolvedDisabled ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.helperText, " ");
} }
export class IdsCheckboxComponent {
    cdr;
    checkboxInput;
    group = inject(IDS_CHECKBOX_GROUP_CONTEXT, { optional: true });
    id;
    label = CHECKBOX_SPEC_ACCURATE_DEFAULTS.label;
    showLabel = CHECKBOX_SPEC_ACCURATE_DEFAULTS.showLabel;
    /** Static demo only: draw the focus ring (Storybook matrix “Focus” row). */
    simulateFocusVisible = CHECKBOX_SPEC_ACCURATE_DEFAULTS.simulateFocusVisible;
    checked;
    defaultChecked = CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked;
    set indeterminate(value) {
        this.indeterminateState = value;
    }
    get indeterminate() {
        return this.indeterminateState;
    }
    disabled = CHECKBOX_SPEC_ACCURATE_DEFAULTS.disabled;
    error = CHECKBOX_SPEC_ACCURATE_DEFAULTS.error;
    helperText;
    name;
    value;
    density = "default";
    checkedChange = new EventEmitter();
    internalChecked = CHECKBOX_SPEC_ACCURATE_DEFAULTS.checked;
    indeterminateState = CHECKBOX_SPEC_ACCURATE_DEFAULTS.indeterminate;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnInit() {
        if (!this.isControlled) {
            this.internalChecked = this.defaultChecked;
        }
    }
    ngOnChanges(changes) {
        if (changes["checked"] && this.checked !== undefined) {
            this.internalChecked = this.checked;
        }
        if (changes["defaultChecked"] && this.checked === undefined) {
            this.internalChecked = this.defaultChecked;
        }
        this.syncIndeterminate();
    }
    ngAfterViewInit() {
        this.syncIndeterminate();
    }
    get isControlled() {
        return this.checked !== undefined;
    }
    get resolvedChecked() {
        return this.isControlled ? (this.checked ?? false) : this.internalChecked;
    }
    get resolvedDisabled() {
        return this.disabled || Boolean(this.group?.disabled);
    }
    get resolvedName() {
        return this.name ?? this.group?.name;
    }
    get resolvedId() {
        if (this.id) {
            return this.id;
        }
        const prefix = this.group?.idPrefix;
        const slug = this.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (prefix) {
            return `${prefix}-${slug}`;
        }
        return `checkbox-${slug}`;
    }
    get assistiveId() {
        return this.helperText ? `${this.resolvedId}-assistive` : undefined;
    }
    get dataChecked() {
        if (this.indeterminate) {
            return "mixed";
        }
        if (this.resolvedChecked) {
            return "";
        }
        return null;
    }
    get ariaChecked() {
        if (this.indeterminate) {
            return "mixed";
        }
        return this.resolvedChecked;
    }
    get showIndicator() {
        return this.resolvedChecked || this.indeterminate;
    }
    get indicatorType() {
        return this.indeterminate ? "minus" : "check";
    }
    onInputChange(event) {
        const input = event.target;
        const next = input.checked;
        if (this.indeterminateState) {
            this.indeterminateState = false;
        }
        if (!this.isControlled) {
            this.internalChecked = next;
        }
        this.checkedChange.emit(next);
        this.syncIndeterminate();
        this.cdr.markForCheck();
    }
    syncIndeterminate() {
        const el = this.checkboxInput?.nativeElement;
        if (el) {
            el.indeterminate = this.indeterminateState;
        }
    }
    static ɵfac = function IdsCheckboxComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsCheckboxComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsCheckboxComponent, selectors: [["ids-checkbox"]], viewQuery: function IdsCheckboxComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.checkboxInput = _t.first);
        } }, inputs: { id: "id", label: "label", showLabel: "showLabel", simulateFocusVisible: "simulateFocusVisible", checked: "checked", defaultChecked: "defaultChecked", indeterminate: "indeterminate", disabled: "disabled", error: "error", helperText: "helperText", name: "name", value: "value", density: "density" }, outputs: { checkedChange: "checkedChange" }, features: [i0.ɵɵNgOnChangesFeature], decls: 9, vars: 20, consts: [["checkboxInput", ""], [1, "field"], [1, "wrapper"], [1, "root"], ["type", "checkbox", 1, "input", 3, "change", "id", "name", "value", "checked", "disabled"], [1, "indicator"], [1, "assistiveText", 3, "id", "assistiveTextError", "assistiveTextDisabled"], [1, "assistiveText", 3, "id"], ["shapeName", "status-critical-square-solid", "variant", "img", "className", "errorIcon", 3, "size"]], template: function IdsCheckboxComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 1)(1, "label", 2)(2, "span", 3)(3, "input", 4, 0);
            i0.ɵɵlistener("change", function IdsCheckboxComponent_Template_input_change_3_listener($event) { return ctx.onInputChange($event); });
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(5, IdsCheckboxComponent_Conditional_5_Template, 1, 1, "span", 5);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "span");
            i0.ɵɵtext(7);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(8, IdsCheckboxComponent_Conditional_8_Template, 3, 7, "div", 6);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵattribute("data-density", ctx.density);
            i0.ɵɵadvance(2);
            i0.ɵɵclassProp("rootSimulatedFocus", ctx.simulateFocusVisible);
            i0.ɵɵattribute("data-checked", ctx.dataChecked)("data-disabled", ctx.resolvedDisabled ? "" : null)("data-indeterminate", ctx.indeterminate ? "" : null)("data-error", ctx.error ? "true" : null);
            i0.ɵɵadvance();
            i0.ɵɵproperty("id", ctx.resolvedId)("name", ctx.resolvedName)("value", ctx.value)("checked", ctx.resolvedChecked)("disabled", ctx.resolvedDisabled);
            i0.ɵɵattribute("aria-checked", ctx.ariaChecked)("aria-invalid", ctx.error || null)("aria-describedby", ctx.assistiveId);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showIndicator ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.showLabel ? "label" : "visuallyHidden");
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.helperText ? 8 : -1);
        } }, dependencies: [CommonModule, IdsIconComponent], styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.field[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n}\n\n.wrapper[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  cursor: pointer;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  min-height: 20px;\n}\n\n.field[data-density=\"datagrid\"][_ngcontent-%COMP%]   .wrapper[_ngcontent-%COMP%] {\n  min-height: 0;\n  gap: 0;\n}\n\n.field[data-density=\"datagrid\"][_ngcontent-%COMP%]   .root[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n}\n\n.root[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--checkbox-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: all 100ms ease;\n  cursor: inherit;\n  outline: none;\n  position: relative;\n  vertical-align: middle;\n}\n\n.input[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  opacity: 0;\n  cursor: inherit;\n}\n\n.root[_ngcontent-%COMP%]:has(.input:hover:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[_ngcontent-%COMP%]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[_ngcontent-%COMP%]:has(.input:focus-visible) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.rootSimulatedFocus[_ngcontent-%COMP%] {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.root[data-checked][_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.root[data-checked=\"mixed\"][_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-checked][_ngcontent-%COMP%]:has(.input:hover:not(:disabled)), \n.root[data-checked][_ngcontent-%COMP%]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.root[data-indeterminate][_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-indeterminate][_ngcontent-%COMP%]:has(.input:hover:not(:disabled)), \n.root[data-indeterminate][_ngcontent-%COMP%]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.root[data-disabled][data-checked][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-base);\n  border-color: transparent;\n}\n\n.root[data-disabled][data-indeterminate][_ngcontent-%COMP%], \n.root[data-disabled][data-checked=\"mixed\"][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-white);\n  position: absolute;\n  inset: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  line-height: 0;\n  pointer-events: none;\n}\n\n.indicator[data-indicator-type=\"check\"][_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 8px;\n  height: 8px;\n  background: currentColor;\n  clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%);\n  transform: translate(-50%, calc(-50% - 0.5px));\n}\n\n.indicator[data-indicator-type=\"minus\"][_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 8px;\n  height: 2px;\n  background: currentColor;\n  transform: translate(-50%, -50%);\n}\n\n.root[data-disabled][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-inverse);\n}\n\n.root[data-indeterminate][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-brand-base);\n}\n\n.root[data-checked=\"mixed\"][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-brand-base);\n}\n\n.root[data-disabled][data-indeterminate][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-disabled);\n}\n\n.root[data-disabled][data-checked=\"mixed\"][_ngcontent-%COMP%]   .indicator[_ngcontent-%COMP%] {\n  color: var(--color-icon-disabled);\n}\n\n.label[_ngcontent-%COMP%] {\n  user-select: none;\n}\n\n.visuallyHidden[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.wrapper[_ngcontent-%COMP%]:has(.root[data-disabled]) {\n  cursor: not-allowed;\n}\n\n.root[data-disabled][_ngcontent-%COMP%]    + .label[_ngcontent-%COMP%] {\n  color: var(--color-text-disabled);\n}\n\n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]) {\n  border-color: var(--color-border-strong);\n}\n\n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]):has(\n    .input:hover:not(:disabled)\n  ), \n.root[data-error=\"true\"][_ngcontent-%COMP%]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]):has(\n    .input:active:not(:disabled)\n  ) {\n  border-color: var(--color-border-strong);\n}\n\n.assistiveText[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  margin: 0;\n}\n\n[_nghost-%COMP%]     .errorIcon {\n  width: 16px;\n  height: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.assistiveTextError[_ngcontent-%COMP%] {\n  color: var(--color-text-critical);\n}\n\n.assistiveTextDisabled[_ngcontent-%COMP%] {\n  color: var(--color-text-disabled);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsCheckboxComponent, [{
        type: Component,
        args: [{ selector: "ids-checkbox", standalone: true, imports: [CommonModule, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"field\" [attr.data-density]=\"density\">\n  <label class=\"wrapper\">\n    <span\n      class=\"root\"\n      [class.rootSimulatedFocus]=\"simulateFocusVisible\"\n      [attr.data-checked]=\"dataChecked\"\n      [attr.data-disabled]=\"resolvedDisabled ? '' : null\"\n      [attr.data-indeterminate]=\"indeterminate ? '' : null\"\n      [attr.data-error]=\"error ? 'true' : null\"\n    >\n      <input\n        #checkboxInput\n        type=\"checkbox\"\n        class=\"input\"\n        [id]=\"resolvedId\"\n        [name]=\"resolvedName\"\n        [value]=\"value\"\n        [checked]=\"resolvedChecked\"\n        [disabled]=\"resolvedDisabled\"\n        [attr.aria-checked]=\"ariaChecked\"\n        [attr.aria-invalid]=\"error || null\"\n        [attr.aria-describedby]=\"assistiveId\"\n        (change)=\"onInputChange($event)\"\n      />\n      @if (showIndicator) {\n        <span class=\"indicator\" [attr.data-indicator-type]=\"indicatorType\"></span>\n      }\n    </span>\n    <span [class]=\"showLabel ? 'label' : 'visuallyHidden'\">{{ label }}</span>\n  </label>\n  @if (helperText) {\n    <div\n      [id]=\"assistiveId\"\n      class=\"assistiveText\"\n      [class.assistiveTextError]=\"error\"\n      [class.assistiveTextDisabled]=\"resolvedDisabled\"\n    >\n      @if (error && !resolvedDisabled) {\n        <ids-icon\n          shapeName=\"status-critical-square-solid\"\n          variant=\"img\"\n          className=\"errorIcon\"\n          [size]=\"16\"\n        />\n      }\n      {{ helperText }}\n    </div>\n  }\n</div>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.field {\n  display: inline-flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n}\n\n.wrapper {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  cursor: pointer;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  min-height: 20px;\n}\n\n.field[data-density=\"datagrid\"] .wrapper {\n  min-height: 0;\n  gap: 0;\n}\n\n.field[data-density=\"datagrid\"] .root {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n}\n\n.root {\n  width: 16px;\n  height: 16px;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--checkbox-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: all 100ms ease;\n  cursor: inherit;\n  outline: none;\n  position: relative;\n  vertical-align: middle;\n}\n\n.input {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  opacity: 0;\n  cursor: inherit;\n}\n\n.root:has(.input:hover:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root:has(.input:focus-visible) {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.rootSimulatedFocus {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.root[data-checked] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.root[data-checked=\"mixed\"] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-checked]:has(.input:hover:not(:disabled)),\n.root[data-checked]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.root[data-indeterminate] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.root[data-indeterminate]:has(.input:hover:not(:disabled)),\n.root[data-indeterminate]:has(.input:active:not(:disabled)) {\n  background: var(--color-background-component);\n  border-color: var(--color-border-strong);\n}\n\n.root[data-disabled] {\n  cursor: not-allowed;\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.root[data-disabled][data-checked] {\n  background: var(--color-background-gray-base);\n  border-color: transparent;\n}\n\n.root[data-disabled][data-indeterminate],\n.root[data-disabled][data-checked=\"mixed\"] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n}\n\n.indicator {\n  color: var(--color-icon-white);\n  position: absolute;\n  inset: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  line-height: 0;\n  pointer-events: none;\n}\n\n.indicator[data-indicator-type=\"check\"]::before {\n  content: \"\";\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 8px;\n  height: 8px;\n  background: currentColor;\n  clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%);\n  transform: translate(-50%, calc(-50% - 0.5px));\n}\n\n.indicator[data-indicator-type=\"minus\"]::before {\n  content: \"\";\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 8px;\n  height: 2px;\n  background: currentColor;\n  transform: translate(-50%, -50%);\n}\n\n.root[data-disabled] .indicator {\n  color: var(--color-icon-inverse);\n}\n\n.root[data-indeterminate] .indicator {\n  color: var(--color-icon-brand-base);\n}\n\n.root[data-checked=\"mixed\"] .indicator {\n  color: var(--color-icon-brand-base);\n}\n\n.root[data-disabled][data-indeterminate] .indicator {\n  color: var(--color-icon-disabled);\n}\n\n.root[data-disabled][data-checked=\"mixed\"] .indicator {\n  color: var(--color-icon-disabled);\n}\n\n.label {\n  user-select: none;\n}\n\n.visuallyHidden {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n\n.wrapper:has(.root[data-disabled]) {\n  cursor: not-allowed;\n}\n\n.root[data-disabled] + .label {\n  color: var(--color-text-disabled);\n}\n\n.root[data-error=\"true\"]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]) {\n  border-color: var(--color-border-strong);\n}\n\n.root[data-error=\"true\"]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]):has(\n    .input:hover:not(:disabled)\n  ),\n.root[data-error=\"true\"]:not([data-checked]):not([data-indeterminate]):not([data-checked=\"mixed\"]):has(\n    .input:active:not(:disabled)\n  ) {\n  border-color: var(--color-border-strong);\n}\n\n.assistiveText {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  margin: 0;\n}\n\n:host ::ng-deep .errorIcon {\n  width: 16px;\n  height: 16px;\n  flex: 0 0 auto;\n  display: block;\n}\n\n.assistiveTextError {\n  color: var(--color-text-critical);\n}\n\n.assistiveTextDisabled {\n  color: var(--color-text-disabled);\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { checkboxInput: [{
            type: ViewChild,
            args: ["checkboxInput"]
        }], id: [{
            type: Input
        }], label: [{
            type: Input,
            args: [{ required: true }]
        }], showLabel: [{
            type: Input
        }], simulateFocusVisible: [{
            type: Input
        }], checked: [{
            type: Input
        }], defaultChecked: [{
            type: Input
        }], indeterminate: [{
            type: Input
        }], disabled: [{
            type: Input
        }], error: [{
            type: Input
        }], helperText: [{
            type: Input
        }], name: [{
            type: Input
        }], value: [{
            type: Input
        }], density: [{
            type: Input
        }], checkedChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsCheckboxComponent, { className: "IdsCheckboxComponent", filePath: "src/components/ids-checkbox/ids-checkbox.component.ts", lineNumber: 32 }); })();
