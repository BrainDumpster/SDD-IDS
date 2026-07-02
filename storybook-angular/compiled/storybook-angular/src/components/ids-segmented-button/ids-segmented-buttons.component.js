import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/segmented-button.contract.js";
import { IDS_SEGMENTED_BUTTONS_CONTEXT, } from "./ids-segmented-buttons-group-context";
import { IdsSegmentedIconComponent } from "./ids-segmented-icon.component";
import { IdsSegmentedTextComponent } from "./ids-segmented-text.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsSegmentedButtonsComponent {
    cdr;
    textQuery;
    iconQuery;
    type = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.type;
    selected;
    defaultSelected = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected;
    disabled = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
    ariaLabel = SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.ariaLabel;
    ariaLabelledby;
    selectedChange = new EventEmitter();
    change = new EventEmitter();
    internalSelected = String(SEGMENTED_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultSelected);
    items = [];
    focusedIndex = 0;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnInit() {
        if (!this.isControlled) {
            this.internalSelected = String(this.defaultSelected);
        }
    }
    ngOnChanges(changes) {
        if (changes["selected"] && this.selected !== undefined) {
            this.internalSelected = String(this.selected);
            this.notifySelectionChange();
        }
        if (changes["defaultSelected"] && this.selected === undefined) {
            this.internalSelected = String(this.defaultSelected);
            this.notifySelectionChange();
        }
    }
    ngAfterContentInit() {
        this.bindItems();
        this.textQuery.changes.subscribe(() => this.bindItems());
        this.iconQuery.changes.subscribe(() => this.bindItems());
    }
    get isControlled() {
        return this.selected !== undefined;
    }
    get resolvedSelected() {
        return this.isControlled ? String(this.selected ?? "") : this.internalSelected;
    }
    registerItems(items) {
        this.items = [...items];
        if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = Math.max(0, this.items.length - 1);
        }
        this.notifySelectionChange();
        this.cdr.markForCheck();
    }
    isSelected(value) {
        return this.resolvedSelected === value;
    }
    isItemDisabled(item) {
        return this.disabled || item.disabled;
    }
    select(next) {
        const targetItem = this.items.find((item) => item.segmentValue === next);
        if (!targetItem || this.isItemDisabled(targetItem)) {
            return;
        }
        if (!this.isControlled) {
            this.internalSelected = next;
        }
        const index = this.items.findIndex((item) => item.segmentValue === next);
        if (index >= 0) {
            this.focusedIndex = index;
        }
        const meta = targetItem.getChangeMeta();
        this.selectedChange.emit(next);
        this.change.emit({ value: next, meta });
        this.notifySelectionChange();
        this.cdr.markForCheck();
    }
    optionId(value) {
        return `ids-segmented-${value}`;
    }
    simulatedStateAttr(state) {
        return state ?? null;
    }
    onItemKeydown(event, item) {
        const index = this.items.indexOf(item);
        const enabledIndices = this.items
            .map((row, i) => (this.isItemDisabled(row) ? -1 : i))
            .filter((i) => i >= 0);
        if (!enabledIndices.length) {
            return;
        }
        const currentPos = enabledIndices.indexOf(index);
        let targetIndex = index;
        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                targetIndex =
                    enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
                break;
            case "Home":
                event.preventDefault();
                targetIndex = enabledIndices[0];
                break;
            case "End":
                event.preventDefault();
                targetIndex = enabledIndices[enabledIndices.length - 1];
                break;
            case " ":
            case "Enter":
                event.preventDefault();
                this.select(item.segmentValue);
                return;
            default:
                return;
        }
        this.focusedIndex = targetIndex;
        const target = this.items[targetIndex];
        if (target) {
            this.select(target.segmentValue);
            document.getElementById(this.optionId(target.segmentValue))?.focus();
        }
    }
    itemTabIndex(item) {
        const index = this.items.indexOf(item);
        return index === this.focusedIndex ? 0 : -1;
    }
    onItemFocus(item) {
        this.focusedIndex = this.items.indexOf(item);
    }
    notifySelectionChange() {
        for (const item of [...this.textQuery, ...this.iconQuery]) {
            item.notifySelectionChange();
        }
    }
    bindItems() {
        const segments = this.type === "text"
            ? this.textQuery.toArray()
            : this.iconQuery.toArray();
        this.registerItems(segments);
    }
    static ɵfac = function IdsSegmentedButtonsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsSegmentedButtonsComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsSegmentedButtonsComponent, selectors: [["ids-segmented-buttons"]], contentQueries: function IdsSegmentedButtonsComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsSegmentedTextComponent, 4)(dirIndex, IdsSegmentedIconComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.textQuery = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.iconQuery = _t);
        } }, inputs: { type: "type", selected: "selected", defaultSelected: "defaultSelected", disabled: "disabled", ariaLabel: "ariaLabel", ariaLabelledby: "ariaLabelledby" }, outputs: { selectedChange: "selectedChange", change: "change" }, features: [i0.ɵɵProvidersFeature([
                { provide: IDS_SEGMENTED_BUTTONS_CONTEXT, useExisting: IdsSegmentedButtonsComponent },
            ]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 2, vars: 3, consts: [["role", "radiogroup", 1, "ids-segmented-buttons__root"]], template: function IdsSegmentedButtonsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵattribute("data-type", ctx.type)("aria-label", ctx.ariaLabel || null)("aria-labelledby", ctx.ariaLabelledby || null);
        } }, dependencies: [CommonModule], styles: [".ids-segmented-buttons__root {\n  box-sizing: border-box;\n  display: inline-flex;\n  min-width: min-content;\n  align-items: stretch;\n  gap: var(--spacing-space-2);\n  padding: var(--padding-padding-2);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--segmented-button-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n}\n\n.ids-segmented-buttons__root[data-type=\"text\"] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: min-content;\n  height: 34px;\n  min-height: 34px;\n  align-items: stretch;\n}\n\n.ids-segmented-buttons__root[data-type=\"icon\"] {\n  box-sizing: border-box;\n  height: 37px;\n  min-height: 37px;\n  align-items: center;\n}\n\n.ids-segmented-buttons__segment {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n  cursor: pointer;\n  font-family: inherit;\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-20);\n  outline: none;\n  border: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  border-radius: var(--segmented-button-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  transition:\n    background-color 120ms ease,\n    color 120ms ease,\n    box-shadow 120ms ease;\n}\n\n.ids-segmented-buttons__segment--text {\n  box-sizing: border-box;\n  width: 100%;\n  height: 28px;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-8);\n  white-space: nowrap;\n}\n\n.ids-segmented-buttons__segment--icon {\n  box-sizing: border-box;\n  flex-shrink: 0;\n  align-self: center;\n  min-width: var(--sizing-size-32);\n  height: 33px;\n  min-height: 33px;\n  max-height: 33px;\n  padding: 0 var(--padding-padding-8);\n  line-height: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-segmented-buttons__segment:disabled {\n  cursor: not-allowed;\n  background: var(--color-background-gray-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected),\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):hover,\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):active,\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment[data-simulated-state=\"hover\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ),\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment[data-simulated-state=\"press\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  color: var(--color-icon-brand-base);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):hover {\n  background: var(--color-background-brand-lighter);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-neutral);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):active {\n  background: var(--color-background-brand-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-brand-strong);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):focus-visible {\n  background: var(--color-background-component);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base);\n  outline: none;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"hover\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-brand-lighter);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-neutral);\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"hover\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-strong) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"press\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-brand-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-brand-strong);\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"press\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-stronger) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"focus-visible\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-component);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base);\n  outline: none;\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"focus-visible\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: none !important;\n  outline: var(--border-width-border-default) dashed var(--color-border-white) !important;\n  outline-offset: calc(-1 * var(--border-width-border-default));\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):hover {\n  background: var(--color-background-controls-brand-strong) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):active {\n  background: var(--color-background-controls-brand-stronger) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):focus-visible {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: none !important;\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: calc(-1 * var(--border-width-border-default));\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--icon ids-icon {\n  width: 16px !important;\n  height: 14px !important;\n}\n\n.ids-segmented-buttons__icon-glyph {\n  flex-shrink: 0;\n  width: 16px;\n  height: 14px;\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsSegmentedButtonsComponent, [{
        type: Component,
        args: [{ selector: "ids-segmented-buttons", standalone: true, imports: [CommonModule], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                    { provide: IDS_SEGMENTED_BUTTONS_CONTEXT, useExisting: IdsSegmentedButtonsComponent },
                ], template: "<div\n  class=\"ids-segmented-buttons__root\"\n  [attr.data-type]=\"type\"\n  role=\"radiogroup\"\n  [attr.aria-label]=\"ariaLabel || null\"\n  [attr.aria-labelledby]=\"ariaLabelledby || null\"\n>\n  <ng-content />\n</div>\n", styles: [".ids-segmented-buttons__root {\n  box-sizing: border-box;\n  display: inline-flex;\n  min-width: min-content;\n  align-items: stretch;\n  gap: var(--spacing-space-2);\n  padding: var(--padding-padding-2);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--segmented-button-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n}\n\n.ids-segmented-buttons__root[data-type=\"text\"] {\n  box-sizing: border-box;\n  width: 100%;\n  min-width: min-content;\n  height: 34px;\n  min-height: 34px;\n  align-items: stretch;\n}\n\n.ids-segmented-buttons__root[data-type=\"icon\"] {\n  box-sizing: border-box;\n  height: 37px;\n  min-height: 37px;\n  align-items: center;\n}\n\n.ids-segmented-buttons__segment {\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n  cursor: pointer;\n  font-family: inherit;\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-20);\n  outline: none;\n  border: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  border-radius: var(--segmented-button-control-radius, var(--corner-radius-radius-2));\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  transition:\n    background-color 120ms ease,\n    color 120ms ease,\n    box-shadow 120ms ease;\n}\n\n.ids-segmented-buttons__segment--text {\n  box-sizing: border-box;\n  width: 100%;\n  height: 28px;\n  min-height: 28px;\n  padding: var(--padding-padding-4) var(--padding-padding-8);\n  white-space: nowrap;\n}\n\n.ids-segmented-buttons__segment--icon {\n  box-sizing: border-box;\n  flex-shrink: 0;\n  align-self: center;\n  min-width: var(--sizing-size-32);\n  height: 33px;\n  min-height: 33px;\n  max-height: 33px;\n  padding: 0 var(--padding-padding-8);\n  line-height: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-segmented-buttons__segment:disabled {\n  cursor: not-allowed;\n  background: var(--color-background-gray-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected),\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):hover,\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):active,\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment[data-simulated-state=\"hover\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ),\n.ids-segmented-buttons__root[data-type=\"icon\"]\n  .ids-segmented-buttons__segment[data-simulated-state=\"press\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  color: var(--color-icon-brand-base);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):hover {\n  background: var(--color-background-brand-lighter);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-neutral);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):active {\n  background: var(--color-background-brand-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-brand-strong);\n}\n\n.ids-segmented-buttons__segment:not(:disabled):not(.ids-segmented-buttons__segment--selected):focus-visible {\n  background: var(--color-background-component);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base);\n  outline: none;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"hover\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-brand-lighter);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-neutral);\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"hover\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-strong) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"press\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-brand-light);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) transparent;\n  color: var(--color-text-brand-strong);\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"press\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-stronger) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment[data-simulated-state=\"focus-visible\"]:not(:disabled):not(\n    .ids-segmented-buttons__segment--selected\n  ) {\n  background: var(--color-background-component);\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base);\n  outline: none;\n}\n\n.ids-segmented-buttons__segment--selected[data-simulated-state=\"focus-visible\"]:not(:disabled) {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: none !important;\n  outline: var(--border-width-border-default) dashed var(--color-border-white) !important;\n  outline-offset: calc(-1 * var(--border-width-border-default));\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):hover {\n  background: var(--color-background-controls-brand-strong) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):active {\n  background: var(--color-background-controls-brand-stronger) !important;\n  box-shadow: inset 0 0 0 var(--border-width-border-default) var(--color-border-brand-base) !important;\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--selected:not(:disabled):focus-visible {\n  background: var(--color-background-controls-brand-base) !important;\n  box-shadow: none !important;\n  outline: var(--border-width-border-default) dashed var(--color-border-white);\n  outline-offset: calc(-1 * var(--border-width-border-default));\n  color: var(--color-text-white) !important;\n}\n\n.ids-segmented-buttons__segment--icon ids-icon {\n  width: 16px !important;\n  height: 14px !important;\n}\n\n.ids-segmented-buttons__icon-glyph {\n  flex-shrink: 0;\n  width: 16px;\n  height: 14px;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { textQuery: [{
            type: ContentChildren,
            args: [IdsSegmentedTextComponent]
        }], iconQuery: [{
            type: ContentChildren,
            args: [IdsSegmentedIconComponent]
        }], type: [{
            type: Input
        }], selected: [{
            type: Input
        }], defaultSelected: [{
            type: Input
        }], disabled: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }], ariaLabelledby: [{
            type: Input
        }], selectedChange: [{
            type: Output
        }], change: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsSegmentedButtonsComponent, { className: "IdsSegmentedButtonsComponent", filePath: "src/components/ids-segmented-button/ids-segmented-buttons.component.ts", lineNumber: 43 }); })();
