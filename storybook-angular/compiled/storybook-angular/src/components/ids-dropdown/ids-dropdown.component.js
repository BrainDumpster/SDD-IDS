import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, } from "@angular/core";
import { IDS_DROPDOWN_CONTEXT, } from "./ids-dropdown-context";
import { IdsDropdownMenuComponent } from "./ids-dropdown-menu.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-dropdown-menu"]], [["ids-dropdown-helper"]], [["ids-dropdown-error"]]];
const _c1 = ["ids-dropdown-menu", "ids-dropdown-helper", "ids-dropdown-error"];
function selectionModeForMode(mode) {
    switch (mode) {
        case "combobox-multi":
        case "multi-select":
            return "multi";
        case "combobox-single":
        case "single-select":
            return "single";
        default:
            return "single";
    }
}
export class IdsDropdownComponent {
    cdr;
    menu;
    mode = "single-select";
    disabled = false;
    showSingleSelectRadio = false;
    value;
    values = [];
    defaultValue;
    defaultValues = [];
    valueChange = new EventEmitter();
    valuesChange = new EventEmitter();
    selectionChange = new EventEmitter();
    selectedValues = [];
    describedBy = new Set();
    constructor(cdr) {
        this.cdr = cdr;
    }
    get selectionMode() {
        return selectionModeForMode(this.mode);
    }
    ngAfterContentInit() {
        this.syncMenuFromRoot();
        this.syncSelectedFromInputs();
    }
    ngOnChanges(changes) {
        if (changes["value"] || changes["values"] || changes["defaultValue"] || changes["defaultValues"]) {
            this.syncSelectedFromInputs();
        }
        if (changes["disabled"] || changes["showSingleSelectRadio"] || changes["mode"]) {
            this.syncMenuFromRoot();
        }
    }
    syncMenuFromRoot() {
        if (!this.menu) {
            return;
        }
        this.menu.disabled = this.disabled;
        this.menu.selectionMode = this.selectionMode;
        this.menu.showSingleSelectRadio = this.showSingleSelectRadio;
        this.menu.selectedValues = [...this.selectedValues];
        this.menu.describedBy = this.describedByIds();
        this.cdr.markForCheck();
    }
    syncSelectedFromInputs() {
        if (this.selectionMode === "single") {
            const next = this.value ?? this.defaultValue;
            this.selectedValues = next ? [next] : [];
        }
        else {
            this.selectedValues = [...(this.values.length ? this.values : this.defaultValues)];
        }
        if (this.menu) {
            this.menu.selectedValues = [...this.selectedValues];
            this.cdr.markForCheck();
        }
    }
    isSelected(value) {
        return this.selectedValues.includes(value);
    }
    toggleValue(value) {
        if (this.disabled) {
            return;
        }
        let next;
        if (this.selectionMode === "single") {
            next = [value];
            this.valueChange.emit(value);
            this.selectionChange.emit(value);
        }
        else {
            next = this.selectedValues.includes(value)
                ? this.selectedValues.filter((entry) => entry !== value)
                : [...this.selectedValues, value];
            this.valuesChange.emit(next);
            this.selectionChange.emit(next);
        }
        this.selectedValues = next;
        if (this.menu) {
            this.menu.selectedValues = [...next];
        }
        this.cdr.markForCheck();
    }
    registerDescribedBy(id) {
        this.describedBy.add(id);
        if (this.menu) {
            this.menu.describedBy = this.describedByIds();
        }
    }
    unregisterDescribedBy(id) {
        this.describedBy.delete(id);
        if (this.menu) {
            this.menu.describedBy = this.describedByIds();
        }
    }
    describedByIds() {
        return [...this.describedBy].join(" ");
    }
    static ɵfac = function IdsDropdownComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownComponent, selectors: [["ids-dropdown"]], contentQueries: function IdsDropdownComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDropdownMenuComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.menu = _t.first);
        } }, inputs: { mode: "mode", disabled: "disabled", showSingleSelectRadio: "showSingleSelectRadio", value: "value", values: "values", defaultValue: "defaultValue", defaultValues: "defaultValues" }, outputs: { valueChange: "valueChange", valuesChange: "valuesChange", selectionChange: "selectionChange" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_DROPDOWN_CONTEXT, useExisting: IdsDropdownComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c1, decls: 4, vars: 0, consts: [[1, "dropdown-root"]], template: function IdsDropdownComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵprojection(2, 1);
            i0.ɵɵprojection(3, 2);
            i0.ɵɵdomElementEnd();
        } }, styles: [".dropdown-root[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0;\n  width: 100%;\n  max-width: 700px;\n  min-width: 186px;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: IDS_DROPDOWN_CONTEXT, useExisting: IdsDropdownComponent }], template: "<div class=\"dropdown-root\">\n  <ng-content select=\"ids-dropdown-menu\" />\n  <ng-content select=\"ids-dropdown-helper\" />\n  <ng-content select=\"ids-dropdown-error\" />\n</div>\n", styles: [".dropdown-root {\n  display: grid;\n  gap: 0;\n  width: 100%;\n  max-width: 700px;\n  min-width: 186px;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { menu: [{
            type: ContentChild,
            args: [IdsDropdownMenuComponent]
        }], mode: [{
            type: Input
        }], disabled: [{
            type: Input
        }], showSingleSelectRadio: [{
            type: Input
        }], value: [{
            type: Input
        }], values: [{
            type: Input
        }], defaultValue: [{
            type: Input
        }], defaultValues: [{
            type: Input
        }], valueChange: [{
            type: Output
        }], valuesChange: [{
            type: Output
        }], selectionChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownComponent, { className: "IdsDropdownComponent", filePath: "src/components/ids-dropdown/ids-dropdown.component.ts", lineNumber: 41 }); })();
