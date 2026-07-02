import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { IDS_SEGMENTED_BUTTONS_CONTEXT } from "./ids-segmented-buttons-group-context";
import * as i0 from "@angular/core";
export class IdsSegmentedTextComponent {
    cdr;
    group = inject(IDS_SEGMENTED_BUTTONS_CONTEXT);
    value;
    label;
    ariaLabel;
    title;
    disabled = false;
    /** Storybook / visual QA only — pins hover, press, or focus-visible styling. */
    simulatedState;
    constructor(cdr) {
        this.cdr = cdr;
    }
    get segmentValue() {
        return String(this.value);
    }
    get isSelected() {
        return this.group.isSelected(this.segmentValue);
    }
    get isDisabled() {
        return this.group.isItemDisabled(this);
    }
    get optionId() {
        return this.group.optionId(this.segmentValue);
    }
    get simulatedStateAttr() {
        return this.group.simulatedStateAttr(this.simulatedState);
    }
    get tabIndex() {
        return this.group.itemTabIndex(this);
    }
    getChangeMeta() {
        return { type: "text", label: this.label };
    }
    onSelect() {
        this.group.select(this.segmentValue);
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
    static ɵfac = function IdsSegmentedTextComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsSegmentedTextComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsSegmentedTextComponent, selectors: [["ids-segmented-text"]], inputs: { value: "value", label: "label", ariaLabel: "ariaLabel", title: "title", disabled: "disabled", simulatedState: "simulatedState" }, decls: 2, vars: 10, consts: [["type", "button", "role", "radio", 1, "ids-segmented-buttons__segment", "ids-segmented-buttons__segment--text", 3, "click", "keydown", "focus", "id", "disabled", "tabIndex"]], template: function IdsSegmentedTextComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "button", 0);
            i0.ɵɵdomListener("click", function IdsSegmentedTextComponent_Template_button_click_0_listener() { return ctx.onSelect(); })("keydown", function IdsSegmentedTextComponent_Template_button_keydown_0_listener($event) { return ctx.onKeydown($event); })("focus", function IdsSegmentedTextComponent_Template_button_focus_0_listener() { return ctx.onFocus(); });
            i0.ɵɵtext(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-segmented-buttons__segment--selected", ctx.isSelected);
            i0.ɵɵdomProperty("id", ctx.optionId)("disabled", ctx.isDisabled)("tabIndex", ctx.tabIndex);
            i0.ɵɵattribute("aria-checked", ctx.isSelected)("aria-label", ctx.ariaLabel || ctx.label)("title", ctx.title || null)("data-simulated-state", ctx.simulatedStateAttr);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.label, "\n");
        } }, styles: ["[_nghost-%COMP%] {\n        display: flex;\n        flex: 1 1 0;\n        min-width: 0;\n        align-items: stretch;\n      }"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsSegmentedTextComponent, [{
        type: Component,
        args: [{ selector: "ids-segmented-text", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<button\n  type=\"button\"\n  class=\"ids-segmented-buttons__segment ids-segmented-buttons__segment--text\"\n  [class.ids-segmented-buttons__segment--selected]=\"isSelected\"\n  [id]=\"optionId\"\n  role=\"radio\"\n  [attr.aria-checked]=\"isSelected\"\n  [attr.aria-label]=\"ariaLabel || label\"\n  [attr.title]=\"title || null\"\n  [disabled]=\"isDisabled\"\n  [attr.data-simulated-state]=\"simulatedStateAttr\"\n  [tabIndex]=\"tabIndex\"\n  (click)=\"onSelect()\"\n  (keydown)=\"onKeydown($event)\"\n  (focus)=\"onFocus()\"\n>\n  {{ label }}\n</button>\n", styles: ["\n      :host {\n        display: flex;\n        flex: 1 1 0;\n        min-width: 0;\n        align-items: stretch;\n      }\n    "] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { value: [{
            type: Input,
            args: [{ required: true }]
        }], label: [{
            type: Input,
            args: [{ required: true }]
        }], ariaLabel: [{
            type: Input
        }], title: [{
            type: Input
        }], disabled: [{
            type: Input
        }], simulatedState: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsSegmentedTextComponent, { className: "IdsSegmentedTextComponent", filePath: "src/components/ids-segmented-button/ids-segmented-text.component.ts", lineNumber: 27 }); })();
