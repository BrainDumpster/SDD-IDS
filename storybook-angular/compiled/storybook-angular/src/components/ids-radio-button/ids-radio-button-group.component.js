import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, Output, } from "@angular/core";
import { RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/radio-button.contract.js";
import { IDS_RADIO_BUTTON_GROUP_CONTEXT, } from "./ids-radio-button-group-context";
import { IdsRadioButtonComponent } from "./ids-radio-button.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsRadioButtonGroupComponent {
    cdr;
    itemQuery;
    id;
    name = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.name;
    value;
    defaultValue = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;
    disabled = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.disabled;
    orientation = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.orientation;
    valueChange = new EventEmitter();
    internalValue = RADIO_BUTTON_SPEC_ACCURATE_DEFAULTS.defaultValue;
    items = [];
    focusedIndex = 0;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnInit() {
        if (!this.isControlled) {
            this.internalValue = this.defaultValue;
        }
    }
    ngOnChanges(changes) {
        if (changes["value"] && this.value !== undefined) {
            this.internalValue = this.value;
            this.notifySelectionChange();
        }
        if (changes["defaultValue"] && this.value === undefined) {
            this.internalValue = this.defaultValue;
            this.notifySelectionChange();
        }
    }
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    get isControlled() {
        return this.value !== undefined;
    }
    get resolvedValue() {
        return this.isControlled ? (this.value ?? "") : this.internalValue;
    }
    registerItems(items) {
        this.items = [...items];
        if (this.focusedIndex >= this.items.length) {
            this.focusedIndex = Math.max(0, this.items.length - 1);
        }
        this.notifySelectionChange();
    }
    isSelected(value) {
        return this.resolvedValue === value;
    }
    isItemDisabled(item) {
        return this.disabled || item.disabled;
    }
    select(next) {
        if (!this.isControlled) {
            this.internalValue = next;
        }
        const index = this.items.findIndex((item) => item.value === next);
        if (index >= 0) {
            this.focusedIndex = index;
        }
        this.valueChange.emit(next);
        this.notifySelectionChange();
        this.cdr.markForCheck();
    }
    optionId(value) {
        return `${this.id ?? this.name}-${value}`;
    }
    simulatedStateAttr(state) {
        if (!state || state === "default") {
            return null;
        }
        return state;
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
            case "ArrowDown":
            case "ArrowRight":
                event.preventDefault();
                targetIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
                break;
            case "ArrowUp":
            case "ArrowLeft":
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
                event.preventDefault();
                this.select(item.value);
                return;
            default:
                return;
        }
        this.focusedIndex = targetIndex;
        const target = this.items[targetIndex];
        if (target) {
            this.select(target.value);
            document.getElementById(this.optionId(target.value))?.focus();
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
        for (const item of this.items) {
            item.notifySelectionChange();
        }
    }
    bindItems() {
        this.registerItems(this.itemQuery.toArray());
    }
    static ɵfac = function IdsRadioButtonGroupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsRadioButtonGroupComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsRadioButtonGroupComponent, selectors: [["ids-radio-button-group"]], contentQueries: function IdsRadioButtonGroupComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsRadioButtonComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, inputs: { id: "id", name: "name", value: "value", defaultValue: "defaultValue", disabled: "disabled", orientation: "orientation" }, outputs: { valueChange: "valueChange" }, features: [i0.ɵɵProvidersFeature([
                { provide: IDS_RADIO_BUTTON_GROUP_CONTEXT, useExisting: IdsRadioButtonGroupComponent },
            ]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 2, vars: 4, consts: [["role", "radiogroup", 1, "group"]], template: function IdsRadioButtonGroupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("vertical", ctx.orientation === "vertical")("horizontal", ctx.orientation === "horizontal");
        } }, styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.group[_ngcontent-%COMP%] {\n  display: flex;\n  gap: var(--spacing-space-16);\n}\n\n.vertical[_ngcontent-%COMP%] {\n  flex-direction: column;\n}\n\n.horizontal[_ngcontent-%COMP%] {\n  flex-direction: row;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsRadioButtonGroupComponent, [{
        type: Component,
        args: [{ selector: "ids-radio-button-group", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                    { provide: IDS_RADIO_BUTTON_GROUP_CONTEXT, useExisting: IdsRadioButtonGroupComponent },
                ], template: "<div\n  class=\"group\"\n  [class.vertical]=\"orientation === 'vertical'\"\n  [class.horizontal]=\"orientation === 'horizontal'\"\n  role=\"radiogroup\"\n>\n  <ng-content />\n</div>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.group {\n  display: flex;\n  gap: var(--spacing-space-16);\n}\n\n.vertical {\n  flex-direction: column;\n}\n\n.horizontal {\n  flex-direction: row;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { itemQuery: [{
            type: ContentChildren,
            args: [IdsRadioButtonComponent]
        }], id: [{
            type: Input
        }], name: [{
            type: Input,
            args: [{ required: true }]
        }], value: [{
            type: Input
        }], defaultValue: [{
            type: Input
        }], disabled: [{
            type: Input
        }], orientation: [{
            type: Input
        }], valueChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsRadioButtonGroupComponent, { className: "IdsRadioButtonGroupComponent", filePath: "src/components/ids-radio-button/ids-radio-button-group.component.ts", lineNumber: 36 }); })();
