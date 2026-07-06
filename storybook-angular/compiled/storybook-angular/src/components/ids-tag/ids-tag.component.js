import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, } from "@angular/core";
import { NgClass } from "@angular/common";
import { TAG_DEMO_HOVER_DEFAULT, TAG_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/tag.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
const _c0 = ["editableField"];
const _c1 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
function IdsTagComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("shapeName", ctx_r0.leadingIconSlug)("size", 10);
} }
function IdsTagComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 3);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.badgeValue);
} }
function IdsTagComponent_Conditional_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 8)(1, "span", 10);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 11);
    i0.ɵɵtext(4, ":");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.prefixText);
} }
function IdsTagComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 4, 0)(2, "span", 5);
    i0.ɵɵconditionalCreate(3, IdsTagComponent_Conditional_3_Conditional_3_Template, 5, 1, "span", 8);
    i0.ɵɵelementStart(4, "span", 9);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵattribute("tabindex", ctx_r0.isEditableFocusable ? 0 : null)("data-focus-on-text", ctx_r0.focusOnText ? true : null);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(ctx_r0.showLabel ? 3 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.label);
} }
function IdsTagComponent_Conditional_4_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 8)(1, "span", 10);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 11);
    i0.ɵɵtext(4, ":");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.prefixText);
} }
function IdsTagComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 5);
    i0.ɵɵconditionalCreate(1, IdsTagComponent_Conditional_4_Conditional_1_Template, 5, 1, "span", 8);
    i0.ɵɵelementStart(2, "span", 9);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.showLabel ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r0.label);
} }
function IdsTagComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 6);
} if (rf & 2) {
    i0.ɵɵproperty("size", 10);
} }
function IdsTagComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 12);
    i0.ɵɵlistener("click", function IdsTagComponent_Conditional_6_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onDismissClick($event)); });
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(1, "svg", 13);
    i0.ɵɵelement(2, "path", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("disabled", ctx_r0.disabled);
    i0.ɵɵattribute("aria-label", "Remove " + ctx_r0.label);
} }
function normalizeLabelPrefix(value) {
    return value.replace(/:+\s*$/, "");
}
function toneToCssClass(tone) {
    if (tone === "none")
        return "none";
    if (tone === "informational")
        return "informational";
    return tone;
}
export class IdsTagComponent {
    label = TAG_SPEC_ACCURATE_DEFAULTS.label;
    tone = TAG_SPEC_ACCURATE_DEFAULTS.tone;
    type = TAG_SPEC_ACCURATE_DEFAULTS.type;
    size = TAG_SPEC_ACCURATE_DEFAULTS.size;
    selected = TAG_SPEC_ACCURATE_DEFAULTS.selected;
    disabled = TAG_SPEC_ACCURATE_DEFAULTS.disabled;
    error = TAG_SPEC_ACCURATE_DEFAULTS.error;
    focusVisible = TAG_SPEC_ACCURATE_DEFAULTS.focusVisible;
    focusOnText = TAG_SPEC_ACCURATE_DEFAULTS.focusOnText;
    demoHover = TAG_DEMO_HOVER_DEFAULT;
    showLabel = TAG_SPEC_ACCURATE_DEFAULTS.showLabel;
    labelPrefix = TAG_SPEC_ACCURATE_DEFAULTS.labelPrefix;
    badgeValue = TAG_SPEC_ACCURATE_DEFAULTS.badgeValue;
    leadingIconSlug = TAG_SPEC_ACCURATE_DEFAULTS.leadingIconSlug;
    closeIconSlug = TAG_SPEC_ACCURATE_DEFAULTS.closeIconSlug;
    selectionChange = new EventEmitter();
    dismiss = new EventEmitter();
    tagClick = new EventEmitter();
    editableField;
    internalSelected = TAG_SPEC_ACCURATE_DEFAULTS.selected;
    get isSelected() {
        return this.selected ?? this.internalSelected;
    }
    get prefixText() {
        return normalizeLabelPrefix(this.labelPrefix);
    }
    get resolvedSize() {
        if (this.type === "read-only") {
            return this.size;
        }
        return this.size === "small" ? "large" : this.size;
    }
    get hasBadge() {
        return this.type === "badge" && this.badgeValue != null;
    }
    get isClickable() {
        return this.type === "clickable" && !this.disabled;
    }
    get isEditableFocusable() {
        return this.type === "editable" && !this.disabled;
    }
    get toneClass() {
        return `tone-${toneToCssClass(this.tone)}`;
    }
    get typeClass() {
        switch (this.type) {
            case "clickable":
                return "clickable";
            case "editable":
                return "editable";
            case "badge":
                return "type-badge";
            default:
                return "read-only";
        }
    }
    onRootClick() {
        if (this.isClickable) {
            const next = !this.isSelected;
            if (this.selected === undefined) {
                this.internalSelected = next;
            }
            this.selectionChange.emit(next);
            this.tagClick.emit();
            return;
        }
        if (this.isEditableFocusable) {
            this.editableField?.nativeElement.focus();
        }
    }
    onEditableMouseDown(event) {
        if (!this.isEditableFocusable) {
            return;
        }
        const target = event.target;
        if (target.closest("button")) {
            return;
        }
        event.preventDefault();
        this.editableField?.nativeElement.focus();
    }
    onDismissClick(event) {
        event.stopPropagation();
        if (this.disabled) {
            return;
        }
        this.dismiss.emit();
    }
    static ɵfac = function IdsTagComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTagComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTagComponent, selectors: [["ids-tag"]], viewQuery: function IdsTagComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.editableField = _t.first);
        } }, inputs: { label: "label", tone: "tone", type: "type", size: "size", selected: "selected", disabled: "disabled", error: "error", focusVisible: "focusVisible", focusOnText: "focusOnText", demoHover: "demoHover", showLabel: "showLabel", labelPrefix: "labelPrefix", badgeValue: "badgeValue", leadingIconSlug: "leadingIconSlug", closeIconSlug: "closeIconSlug" }, outputs: { selectionChange: "selectionChange", dismiss: "dismiss", tagClick: "tagClick" }, decls: 7, vars: 18, consts: [["editableField", ""], [1, "ids-tag", 3, "click", "mousedown", "ngClass"], ["className", "leading-icon", 3, "shapeName", "size"], [1, "badge"], [1, "text-field"], [1, "content"], ["shapeName", "arrow-drop-tri-caret", "className", "menu-caret", 3, "size"], ["type", "button", 1, "dismiss", 3, "disabled"], [1, "prefix"], [1, "label"], [1, "prefix-text"], [1, "prefix-colon"], ["type", "button", 1, "dismiss", 3, "click", "disabled"], ["width", "10", "height", "10", "viewBox", "0 0 10 10", "fill", "none", "aria-hidden", "true"], ["d", "M8 2L2 8M2 2L8 8", "stroke", "currentColor", "stroke-width", "1.25", "stroke-linecap", "round"]], template: function IdsTagComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "span", 1);
            i0.ɵɵlistener("click", function IdsTagComponent_Template_span_click_0_listener() { return ctx.onRootClick(); })("mousedown", function IdsTagComponent_Template_span_mousedown_0_listener($event) { return ctx.onEditableMouseDown($event); });
            i0.ɵɵconditionalCreate(1, IdsTagComponent_Conditional_1_Template, 1, 2, "ids-icon", 2);
            i0.ɵɵconditionalCreate(2, IdsTagComponent_Conditional_2_Template, 2, 1, "span", 3);
            i0.ɵɵconditionalCreate(3, IdsTagComponent_Conditional_3_Template, 6, 4, "span", 4)(4, IdsTagComponent_Conditional_4_Template, 4, 2, "span", 5);
            i0.ɵɵconditionalCreate(5, IdsTagComponent_Conditional_5_Template, 1, 1, "ids-icon", 6);
            i0.ɵɵconditionalCreate(6, IdsTagComponent_Conditional_6_Template, 3, 2, "button", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction4(13, _c1, ctx.resolvedSize, ctx.typeClass, ctx.toneClass, ctx.type === "clickable" && ctx.isSelected ? "selected" : ""));
            i0.ɵɵattribute("data-disabled", ctx.disabled ? true : null)("data-focus", ctx.focusVisible ? true : null)("data-error", ctx.error ? true : null)("data-hover", ctx.demoHover ? true : null)("role", ctx.type === "clickable" ? "button" : null)("aria-pressed", ctx.type === "clickable" ? ctx.isSelected : null)("tabindex", ctx.isClickable ? 0 : null);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.leadingIconSlug ? 1 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.hasBadge ? 2 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.type === "editable" ? 3 : 4);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.type === "badge" && ctx.hasBadge ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.type === "editable" ? 6 : -1);
        } }, dependencies: [NgClass, IdsIconComponent], styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.ids-tag[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--corner-radius-radius-24);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n  font-family: inherit;\n}\n\n.small[_ngcontent-%COMP%] {\n  min-height: 20px;\n  padding: 0 var(--padding-padding-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.large[_ngcontent-%COMP%] {\n  height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.read-only[_ngcontent-%COMP%], \n.clickable[_ngcontent-%COMP%], \n.type-badge[_ngcontent-%COMP%] {\n  cursor: default;\n}\n\n.clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n  border-color: var(--color-border-brand-base);\n}\n\n.type-badge[_ngcontent-%COMP%] {\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n}\n\n.editable[_ngcontent-%COMP%] {\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n}\n\n.ids-tag[data-disabled][_ngcontent-%COMP%] {\n  pointer-events: none;\n}\n\n.ids-tag[data-error][_ngcontent-%COMP%] {\n  border-color: var(--color-border-alerting-critical-base);\n}\n\n.ids-tag[data-focus][_ngcontent-%COMP%] {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.tone-none[_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-accessible);\n  color: var(--color-text-neutral);\n}\n\n.tone-informational[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-info);\n  border-color: var(--color-border-alerting-info-white);\n  color: var(--color-text-white);\n}\n\n.tone-success[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-success);\n  border-color: var(--color-border-alerting-success-white);\n  color: var(--color-text-white);\n}\n\n.tone-minor[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-minor);\n  border-color: var(--color-border-alerting-minor-transparent);\n  color: var(--color-text-warning);\n}\n\n.tone-major[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-major);\n  border-color: var(--color-border-alerting-major-white);\n  color: var(--color-text-white);\n}\n\n.tone-critical[_ngcontent-%COMP%] {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-critical-white);\n  color: var(--color-text-white);\n}\n\n.clickable.selected[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-text-white);\n}\n\n.clickable.tone-none[_ngcontent-%COMP%]:not(.selected) {\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n}\n\n.clickable[_ngcontent-%COMP%]:not(.selected) {\n  border-color: var(--color-border-brand-base);\n}\n\n.clickable.tone-none[_ngcontent-%COMP%]:not(.selected):hover:not([data-disabled]), \n.clickable.tone-none[_ngcontent-%COMP%]:not(.selected)[data-hover]:not([data-disabled]) {\n  background: var(--color-background-controls-brand-lighter);\n  border-color: var(--color-border-brand-base);\n}\n\n.clickable.selected[_ngcontent-%COMP%]:hover:not([data-disabled]), \n.clickable.selected[data-hover][_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.ids-tag[data-disabled][_ngcontent-%COMP%] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-tag[data-disabled].editable[_ngcontent-%COMP%] {\n  background: var(--color-background-gray-lighter);\n}\n\n.ids-tag[data-disabled][_ngcontent-%COMP%]   .label[_ngcontent-%COMP%], \n.ids-tag[data-disabled][_ngcontent-%COMP%]   .prefix[_ngcontent-%COMP%] {\n  color: var(--color-text-disabled);\n}\n\n.label[_ngcontent-%COMP%], \n.prefix[_ngcontent-%COMP%] {\n  user-select: none;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.content[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-2);\n  min-height: 20px;\n}\n\n.prefix[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: baseline;\n  white-space: nowrap;\n}\n\n.prefix-text[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n\n.prefix-colon[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n\n.text-field[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  min-height: 20px;\n  padding: 0 var(--padding-padding-2);\n  border: var(--border-width-border-default) solid transparent;\n  border-radius: var(--corner-radius-radius-2);\n  outline: none;\n}\n\n.editable[_ngcontent-%COMP%]   .text-field[_ngcontent-%COMP%]:focus-visible, \n.editable[_ngcontent-%COMP%]   .text-field[_ngcontent-%COMP%]:focus, \n.editable[data-focus][_ngcontent-%COMP%]   .text-field[_ngcontent-%COMP%], \n.editable[_ngcontent-%COMP%]   .text-field[data-focus-on-text][_ngcontent-%COMP%] {\n  border-color: var(--color-border-brand-base);\n}\n\n.leading-icon[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: var(--sizing-size-10);\n  height: var(--sizing-size-10);\n}\n\n.badge[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  min-width: var(--sizing-size-18);\n  height: var(--sizing-size-18);\n  padding: 0 var(--padding-padding-4);\n  border-radius: 999px;\n  border: var(--border-width-border-default) solid var(--color-border-white);\n  background: var(--color-background-alerting-info-1);\n  color: var(--color-text-white);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: var(--font-size-body-3);\n  line-height: 1;\n}\n\n.ids-tag[data-disabled][_ngcontent-%COMP%]   .badge[_ngcontent-%COMP%] {\n  background: var(--color-static-gray-500);\n  border-color: var(--color-border-white);\n}\n\n.menu-caret[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: var(--sizing-size-10);\n  height: var(--sizing-size-10);\n}\n\n.dismiss[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  border: none;\n  background: transparent;\n  color: inherit;\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-tag[data-disabled][_ngcontent-%COMP%]   .dismiss[_ngcontent-%COMP%] {\n  color: var(--color-icon-disabled);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTagComponent, [{
        type: Component,
        args: [{ selector: "ids-tag", standalone: true, imports: [NgClass, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<span\n  class=\"ids-tag\"\n  [ngClass]=\"[resolvedSize, typeClass, toneClass, type === 'clickable' && isSelected ? 'selected' : '']\"\n  [attr.data-disabled]=\"disabled ? true : null\"\n  [attr.data-focus]=\"focusVisible ? true : null\"\n  [attr.data-error]=\"error ? true : null\"\n  [attr.data-hover]=\"demoHover ? true : null\"\n  [attr.role]=\"type === 'clickable' ? 'button' : null\"\n  [attr.aria-pressed]=\"type === 'clickable' ? isSelected : null\"\n  [attr.tabindex]=\"isClickable ? 0 : null\"\n  (click)=\"onRootClick()\"\n  (mousedown)=\"onEditableMouseDown($event)\"\n>\n  @if (leadingIconSlug) {\n    <ids-icon [shapeName]=\"leadingIconSlug\" [size]=\"10\" className=\"leading-icon\" />\n  }\n\n  @if (hasBadge) {\n    <span class=\"badge\">{{ badgeValue }}</span>\n  }\n\n  @if (type === \"editable\") {\n    <span\n      #editableField\n      class=\"text-field\"\n      [attr.tabindex]=\"isEditableFocusable ? 0 : null\"\n      [attr.data-focus-on-text]=\"focusOnText ? true : null\"\n    >\n      <span class=\"content\">\n        @if (showLabel) {\n          <span class=\"prefix\">\n            <span class=\"prefix-text\">{{ prefixText }}</span>\n            <span class=\"prefix-colon\">:</span>\n          </span>\n        }\n        <span class=\"label\">{{ label }}</span>\n      </span>\n    </span>\n  } @else {\n    <span class=\"content\">\n      @if (showLabel) {\n        <span class=\"prefix\">\n          <span class=\"prefix-text\">{{ prefixText }}</span>\n          <span class=\"prefix-colon\">:</span>\n        </span>\n      }\n      <span class=\"label\">{{ label }}</span>\n    </span>\n  }\n\n  @if (type === \"badge\" && hasBadge) {\n    <ids-icon shapeName=\"arrow-drop-tri-caret\" [size]=\"10\" className=\"menu-caret\" />\n  }\n\n  @if (type === \"editable\") {\n    <button\n      type=\"button\"\n      class=\"dismiss\"\n      [disabled]=\"disabled\"\n      [attr.aria-label]=\"'Remove ' + label\"\n      (click)=\"onDismissClick($event)\"\n    >\n      <svg width=\"10\" height=\"10\" viewBox=\"0 0 10 10\" fill=\"none\" aria-hidden=\"true\">\n        <path\n          d=\"M8 2L2 8M2 2L8 8\"\n          stroke=\"currentColor\"\n          stroke-width=\"1.25\"\n          stroke-linecap=\"round\"\n        />\n      </svg>\n    </button>\n  }\n</span>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.ids-tag {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--corner-radius-radius-24);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  white-space: nowrap;\n  font-family: inherit;\n}\n\n.small {\n  min-height: 20px;\n  padding: 0 var(--padding-padding-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.large {\n  height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.read-only,\n.clickable,\n.type-badge {\n  cursor: default;\n}\n\n.clickable {\n  cursor: pointer;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n  border-color: var(--color-border-brand-base);\n}\n\n.type-badge {\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n}\n\n.editable {\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-12);\n  gap: var(--spacing-space-8);\n}\n\n.ids-tag[data-disabled] {\n  pointer-events: none;\n}\n\n.ids-tag[data-error] {\n  border-color: var(--color-border-alerting-critical-base);\n}\n\n.ids-tag[data-focus] {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.tone-none {\n  background: var(--color-background-component);\n  border-color: var(--color-border-accessible);\n  color: var(--color-text-neutral);\n}\n\n.tone-informational {\n  background: var(--color-background-alerting-info);\n  border-color: var(--color-border-alerting-info-white);\n  color: var(--color-text-white);\n}\n\n.tone-success {\n  background: var(--color-background-alerting-success);\n  border-color: var(--color-border-alerting-success-white);\n  color: var(--color-text-white);\n}\n\n.tone-minor {\n  background: var(--color-background-alerting-minor);\n  border-color: var(--color-border-alerting-minor-transparent);\n  color: var(--color-text-warning);\n}\n\n.tone-major {\n  background: var(--color-background-alerting-major);\n  border-color: var(--color-border-alerting-major-white);\n  color: var(--color-text-white);\n}\n\n.tone-critical {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-critical-white);\n  color: var(--color-text-white);\n}\n\n.clickable.selected {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-text-white);\n}\n\n.clickable.tone-none:not(.selected) {\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n}\n\n.clickable:not(.selected) {\n  border-color: var(--color-border-brand-base);\n}\n\n.clickable.tone-none:not(.selected):hover:not([data-disabled]),\n.clickable.tone-none:not(.selected)[data-hover]:not([data-disabled]) {\n  background: var(--color-background-controls-brand-lighter);\n  border-color: var(--color-border-brand-base);\n}\n\n.clickable.selected:hover:not([data-disabled]),\n.clickable.selected[data-hover]:not([data-disabled]) {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.ids-tag[data-disabled] {\n  background: var(--color-background-gray-light);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-tag[data-disabled].editable {\n  background: var(--color-background-gray-lighter);\n}\n\n.ids-tag[data-disabled] .label,\n.ids-tag[data-disabled] .prefix {\n  color: var(--color-text-disabled);\n}\n\n.label,\n.prefix {\n  user-select: none;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.content {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-2);\n  min-height: 20px;\n}\n\n.prefix {\n  display: inline-flex;\n  align-items: baseline;\n  white-space: nowrap;\n}\n\n.prefix-text {\n  font-weight: 500;\n}\n\n.prefix-colon {\n  font-weight: 400;\n}\n\n.text-field {\n  display: inline-flex;\n  align-items: center;\n  min-height: 20px;\n  padding: 0 var(--padding-padding-2);\n  border: var(--border-width-border-default) solid transparent;\n  border-radius: var(--corner-radius-radius-2);\n  outline: none;\n}\n\n.editable .text-field:focus-visible,\n.editable .text-field:focus,\n.editable[data-focus] .text-field,\n.editable .text-field[data-focus-on-text] {\n  border-color: var(--color-border-brand-base);\n}\n\n.leading-icon {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: var(--sizing-size-10);\n  height: var(--sizing-size-10);\n}\n\n.badge {\n  box-sizing: border-box;\n  min-width: var(--sizing-size-18);\n  height: var(--sizing-size-18);\n  padding: 0 var(--padding-padding-4);\n  border-radius: 999px;\n  border: var(--border-width-border-default) solid var(--color-border-white);\n  background: var(--color-background-alerting-info-1);\n  color: var(--color-text-white);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  font-size: var(--font-size-body-3);\n  line-height: 1;\n}\n\n.ids-tag[data-disabled] .badge {\n  background: var(--color-static-gray-500);\n  border-color: var(--color-border-white);\n}\n\n.menu-caret {\n  display: inline-flex;\n  flex-shrink: 0;\n  width: var(--sizing-size-10);\n  height: var(--sizing-size-10);\n}\n\n.dismiss {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  border: none;\n  background: transparent;\n  color: inherit;\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-tag[data-disabled] .dismiss {\n  color: var(--color-icon-disabled);\n}\n"] }]
    }], null, { label: [{
            type: Input
        }], tone: [{
            type: Input
        }], type: [{
            type: Input
        }], size: [{
            type: Input
        }], selected: [{
            type: Input
        }], disabled: [{
            type: Input
        }], error: [{
            type: Input
        }], focusVisible: [{
            type: Input
        }], focusOnText: [{
            type: Input
        }], demoHover: [{
            type: Input
        }], showLabel: [{
            type: Input
        }], labelPrefix: [{
            type: Input
        }], badgeValue: [{
            type: Input
        }], leadingIconSlug: [{
            type: Input
        }], closeIconSlug: [{
            type: Input
        }], selectionChange: [{
            type: Output
        }], dismiss: [{
            type: Output
        }], tagClick: [{
            type: Output
        }], editableField: [{
            type: ViewChild,
            args: ["editableField"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTagComponent, { className: "IdsTagComponent", filePath: "src/components/ids-tag/ids-tag.component.ts", lineNumber: 38 }); })();
