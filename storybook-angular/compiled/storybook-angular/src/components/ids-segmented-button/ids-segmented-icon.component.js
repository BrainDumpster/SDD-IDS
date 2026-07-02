import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_SEGMENTED_BUTTONS_CONTEXT } from "./ids-segmented-buttons-group-context";
import * as i0 from "@angular/core";
export class IdsSegmentedIconComponent {
    cdr;
    group = inject(IDS_SEGMENTED_BUTTONS_CONTEXT);
    value;
    shape;
    ariaLabel;
    title;
    /** Optional override; segment state tokens apply when omitted. */
    color;
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
    get resolvedColor() {
        return this.color ?? null;
    }
    getChangeMeta() {
        return { type: "icon", ariaLabel: this.ariaLabel };
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
    static ɵfac = function IdsSegmentedIconComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsSegmentedIconComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsSegmentedIconComponent, selectors: [["ids-segmented-icon"]], hostVars: 2, hostBindings: function IdsSegmentedIconComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵstyleProp("color", ctx.resolvedColor);
        } }, inputs: { value: "value", shape: "shape", ariaLabel: "ariaLabel", title: "title", color: "color", disabled: "disabled", simulatedState: "simulatedState" }, decls: 2, vars: 11, consts: [["type", "button", "role", "radio", 1, "ids-segmented-buttons__segment", "ids-segmented-buttons__segment--icon", 3, "click", "keydown", "focus", "id", "disabled", "tabIndex"], ["variant", "mask", "className", "ids-segmented-buttons__icon-glyph", 3, "shapeName", "size"]], template: function IdsSegmentedIconComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "button", 0);
            i0.ɵɵlistener("click", function IdsSegmentedIconComponent_Template_button_click_0_listener() { return ctx.onSelect(); })("keydown", function IdsSegmentedIconComponent_Template_button_keydown_0_listener($event) { return ctx.onKeydown($event); })("focus", function IdsSegmentedIconComponent_Template_button_focus_0_listener() { return ctx.onFocus(); });
            i0.ɵɵelement(1, "ids-icon", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-segmented-buttons__segment--selected", ctx.isSelected);
            i0.ɵɵproperty("id", ctx.optionId)("disabled", ctx.isDisabled)("tabIndex", ctx.tabIndex);
            i0.ɵɵattribute("aria-checked", ctx.isSelected)("aria-label", ctx.ariaLabel)("title", ctx.title || ctx.ariaLabel)("data-simulated-state", ctx.simulatedStateAttr);
            i0.ɵɵadvance();
            i0.ɵɵproperty("shapeName", ctx.shape)("size", 16);
        } }, dependencies: [IdsIconComponent], styles: ["[_nghost-%COMP%] {\n        display: flex;\n        flex-shrink: 0;\n        align-self: center;\n      }"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsSegmentedIconComponent, [{
        type: Component,
        args: [{ selector: "ids-segmented-icon", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, host: {
                    "[style.color]": "resolvedColor",
                }, template: "<button\n  type=\"button\"\n  class=\"ids-segmented-buttons__segment ids-segmented-buttons__segment--icon\"\n  [class.ids-segmented-buttons__segment--selected]=\"isSelected\"\n  [id]=\"optionId\"\n  role=\"radio\"\n  [attr.aria-checked]=\"isSelected\"\n  [attr.aria-label]=\"ariaLabel\"\n  [attr.title]=\"title || ariaLabel\"\n  [disabled]=\"isDisabled\"\n  [attr.data-simulated-state]=\"simulatedStateAttr\"\n  [tabIndex]=\"tabIndex\"\n  (click)=\"onSelect()\"\n  (keydown)=\"onKeydown($event)\"\n  (focus)=\"onFocus()\"\n>\n  <ids-icon\n    [shapeName]=\"shape\"\n    variant=\"mask\"\n    className=\"ids-segmented-buttons__icon-glyph\"\n    [size]=\"16\"\n  />\n</button>\n", styles: ["\n      :host {\n        display: flex;\n        flex-shrink: 0;\n        align-self: center;\n      }\n    "] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { value: [{
            type: Input,
            args: [{ required: true }]
        }], shape: [{
            type: Input,
            args: [{ required: true }]
        }], ariaLabel: [{
            type: Input,
            args: [{ required: true }]
        }], title: [{
            type: Input
        }], color: [{
            type: Input
        }], disabled: [{
            type: Input
        }], simulatedState: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsSegmentedIconComponent, { className: "IdsSegmentedIconComponent", filePath: "src/components/ids-segmented-button/ids-segmented-icon.component.ts", lineNumber: 31 }); })();
