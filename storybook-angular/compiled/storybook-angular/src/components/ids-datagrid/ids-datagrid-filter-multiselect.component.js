import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";
import * as i0 from "@angular/core";
function IdsDatagridFilterMultiselectComponent_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-checkbox", 2);
    i0.ɵɵlistener("checkedChange", function IdsDatagridFilterMultiselectComponent_For_2_Template_ids_checkbox_checkedChange_0_listener($event) { const option_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onToggle(option_r2, $event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("label", option_r2)("checked", ctx_r2.isSelected(option_r2));
} }
export class IdsDatagridFilterMultiselectComponent {
    options = [];
    selectedValues = [];
    groupLabel = "Filter";
    selectedValuesChange = new EventEmitter();
    isSelected(option) {
        return this.selectedValues.includes(option);
    }
    onToggle(option, checked) {
        const next = new Set(this.selectedValues);
        if (checked) {
            next.add(option);
        }
        else {
            next.delete(option);
        }
        this.selectedValuesChange.emit([...next]);
    }
    static ɵfac = function IdsDatagridFilterMultiselectComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridFilterMultiselectComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridFilterMultiselectComponent, selectors: [["ids-datagrid-filter-multiselect"]], inputs: { options: "options", selectedValues: "selectedValues", groupLabel: "groupLabel" }, outputs: { selectedValuesChange: "selectedValuesChange" }, decls: 3, vars: 0, consts: [[1, "filterMultiselectPanel"], ["density", "datagrid", 3, "label", "checked"], ["density", "datagrid", 3, "checkedChange", "label", "checked"]], template: function IdsDatagridFilterMultiselectComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵrepeaterCreate(1, IdsDatagridFilterMultiselectComponent_For_2_Template, 1, 2, "ids-checkbox", 1, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.options);
        } }, dependencies: [IdsCheckboxComponent], styles: [".filterMultiselectPanel[_ngcontent-%COMP%] {\n        display: flex;\n        flex-direction: column;\n        gap: var(--spacing-space-8);\n        padding: 6px 16px;\n        box-sizing: border-box;\n      }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridFilterMultiselectComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid-filter-multiselect", standalone: true, imports: [IdsCheckboxComponent], template: `
    <div class="filterMultiselectPanel">
      @for (option of options; track option) {
        <ids-checkbox
          [label]="option"
          [checked]="isSelected(option)"
          density="datagrid"
          (checkedChange)="onToggle(option, $event)"
        />
      }
    </div>
  `, styles: ["\n      .filterMultiselectPanel {\n        display: flex;\n        flex-direction: column;\n        gap: var(--spacing-space-8);\n        padding: 6px 16px;\n        box-sizing: border-box;\n      }\n    "] }]
    }], null, { options: [{
            type: Input
        }], selectedValues: [{
            type: Input
        }], groupLabel: [{
            type: Input
        }], selectedValuesChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridFilterMultiselectComponent, { className: "IdsDatagridFilterMultiselectComponent", filePath: "src/components/ids-datagrid/ids-datagrid-filter-multiselect.component.ts", lineNumber: 32 }); })();
