import { Component, EventEmitter, Input, Output } from "@angular/core";
import * as i0 from "@angular/core";
function IdsDatagridFilterSingleSelectComponent_For_4_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 3);
    i0.ɵɵdomListener("click", function IdsDatagridFilterSingleSelectComponent_For_4_Template_button_click_0_listener() { const option_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.select(option_r2)); });
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const option_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("filterOptionSelected", ctx_r2.selectedValue === option_r2);
    i0.ɵɵattribute("aria-selected", ctx_r2.selectedValue === option_r2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", option_r2, " ");
} }
export class IdsDatagridFilterSingleSelectComponent {
    options = [];
    selectedValue = null;
    ariaLabel = "Filter options";
    selectedValueChange = new EventEmitter();
    select(value) {
        this.selectedValueChange.emit(value);
    }
    static ɵfac = function IdsDatagridFilterSingleSelectComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridFilterSingleSelectComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridFilterSingleSelectComponent, selectors: [["ids-datagrid-filter-single-select"]], inputs: { options: "options", selectedValue: "selectedValue", ariaLabel: "ariaLabel" }, outputs: { selectedValueChange: "selectedValueChange" }, decls: 5, vars: 3, consts: [["role", "listbox", 1, "filterSingleSelectPanel"], ["type", "button", 1, "filterOption", 3, "click"], ["type", "button", "role", "option", 1, "filterOption", 3, "filterOptionSelected"], ["type", "button", "role", "option", 1, "filterOption", 3, "click"]], template: function IdsDatagridFilterSingleSelectComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "button", 1);
            i0.ɵɵdomListener("click", function IdsDatagridFilterSingleSelectComponent_Template_button_click_1_listener() { return ctx.select(null); });
            i0.ɵɵtext(2, " All ");
            i0.ɵɵdomElementEnd();
            i0.ɵɵrepeaterCreate(3, IdsDatagridFilterSingleSelectComponent_For_4_Template, 2, 4, "button", 2, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵattribute("aria-label", ctx.ariaLabel);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("filterOptionSelected", ctx.selectedValue === null);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.options);
        } }, styles: [".filterSingleSelectPanel[_ngcontent-%COMP%] {\n        display: flex;\n        flex-direction: column;\n        min-width: 160px;\n        max-height: 240px;\n        overflow-y: auto;\n        padding: 4px 0;\n        box-sizing: border-box;\n      }\n\n      .filterOption[_ngcontent-%COMP%] {\n        border: none;\n        background: transparent;\n        text-align: left;\n        padding: 6px 16px;\n        font-size: 14px;\n        font-weight: 400;\n        line-height: 20px;\n        color: var(--color-text-neutral-strong);\n        cursor: pointer;\n      }\n\n      .filterOption[_ngcontent-%COMP%]:hover {\n        background: var(--color-background-brand-lighter);\n      }\n\n      .filterOptionSelected[_ngcontent-%COMP%] {\n        color: var(--color-text-brand-strong);\n        background: var(--color-background-brand-lighter);\n      }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridFilterSingleSelectComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid-filter-single-select", standalone: true, template: `
    <div class="filterSingleSelectPanel" role="listbox" [attr.aria-label]="ariaLabel">
      <button type="button" class="filterOption" [class.filterOptionSelected]="selectedValue === null" (click)="select(null)">
        All
      </button>
      @for (option of options; track option) {
        <button
          type="button"
          class="filterOption"
          role="option"
          [class.filterOptionSelected]="selectedValue === option"
          [attr.aria-selected]="selectedValue === option"
          (click)="select(option)"
        >
          {{ option }}
        </button>
      }
    </div>
  `, styles: ["\n      .filterSingleSelectPanel {\n        display: flex;\n        flex-direction: column;\n        min-width: 160px;\n        max-height: 240px;\n        overflow-y: auto;\n        padding: 4px 0;\n        box-sizing: border-box;\n      }\n\n      .filterOption {\n        border: none;\n        background: transparent;\n        text-align: left;\n        padding: 6px 16px;\n        font-size: 14px;\n        font-weight: 400;\n        line-height: 20px;\n        color: var(--color-text-neutral-strong);\n        cursor: pointer;\n      }\n\n      .filterOption:hover {\n        background: var(--color-background-brand-lighter);\n      }\n\n      .filterOptionSelected {\n        color: var(--color-text-brand-strong);\n        background: var(--color-background-brand-lighter);\n      }\n    "] }]
    }], null, { options: [{
            type: Input
        }], selectedValue: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }], selectedValueChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridFilterSingleSelectComponent, { className: "IdsDatagridFilterSingleSelectComponent", filePath: "src/components/ids-datagrid/ids-datagrid-filter-single-select.component.ts", lineNumber: 60 }); })();
