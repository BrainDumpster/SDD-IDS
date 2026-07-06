import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class IdsDatagridFilterSearchFieldComponent {
    placeholder = "Search";
    ariaLabel;
    query = "";
    queryChange = new EventEmitter();
    onQueryChange(value) {
        this.queryChange.emit(value);
    }
    static ɵfac = function IdsDatagridFilterSearchFieldComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridFilterSearchFieldComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridFilterSearchFieldComponent, selectors: [["ids-datagrid-filter-search-field"]], inputs: { placeholder: "placeholder", ariaLabel: "ariaLabel", query: "query" }, outputs: { queryChange: "queryChange" }, decls: 4, vars: 4, consts: [[1, "filterPopupSearchWrap"], [1, "filterPopupSearchRow"], ["shapeName", "search-16", "className", "filterPopupSearchIcon", 3, "size"], ["type", "search", 1, "filterPopupSearchInput", 3, "ngModelChange", "placeholder", "ngModel"]], template: function IdsDatagridFilterSearchFieldComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵelement(2, "ids-icon", 2);
            i0.ɵɵelementStart(3, "input", 3);
            i0.ɵɵlistener("ngModelChange", function IdsDatagridFilterSearchFieldComponent_Template_input_ngModelChange_3_listener($event) { return ctx.onQueryChange($event); });
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("size", 16);
            i0.ɵɵadvance();
            i0.ɵɵproperty("placeholder", ctx.placeholder)("ngModel", ctx.query);
            i0.ɵɵattribute("aria-label", ctx.ariaLabel);
        } }, dependencies: [FormsModule, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgModel, IdsIconComponent], styles: [".filterPopupSearchWrap[_ngcontent-%COMP%] {\n        padding: 6px 16px;\n        box-sizing: border-box;\n      }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridFilterSearchFieldComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid-filter-search-field", standalone: true, imports: [FormsModule, IdsIconComponent], template: `
    <div class="filterPopupSearchWrap">
      <div class="filterPopupSearchRow">
        <ids-icon shapeName="search-16" className="filterPopupSearchIcon" [size]="16" />
        <input
          type="search"
          class="filterPopupSearchInput"
          [placeholder]="placeholder"
          [attr.aria-label]="ariaLabel"
          [ngModel]="query"
          (ngModelChange)="onQueryChange($event)"
        />
      </div>
    </div>
  `, styles: ["\n      .filterPopupSearchWrap {\n        padding: 6px 16px;\n        box-sizing: border-box;\n      }\n    "] }]
    }], null, { placeholder: [{
            type: Input
        }], ariaLabel: [{
            type: Input,
            args: [{ required: true }]
        }], query: [{
            type: Input
        }], queryChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridFilterSearchFieldComponent, { className: "IdsDatagridFilterSearchFieldComponent", filePath: "src/components/ids-datagrid/ids-datagrid-filter-search-field.component.ts", lineNumber: 33 }); })();
