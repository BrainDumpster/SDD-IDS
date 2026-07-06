import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.field;
function IdsDatagridColumnVisibilityPanelComponent_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li", 2)(1, "div", 4)(2, "ids-checkbox", 5);
    i0.ɵɵlistener("checkedChange", function IdsDatagridColumnVisibilityPanelComponent_For_3_Template_ids_checkbox_checkedChange_2_listener($event) { const column_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onVisibilityChange(column_r2.field, $event)); });
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const column_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("id", "ids-datagrid-col-vis-" + column_r2.field)("label", column_r2.title)("checked", !ctx_r2.hiddenColumnKeys.has(column_r2.field));
} }
function IdsDatagridColumnVisibilityPanelComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 3);
    i0.ɵɵelement(1, "ids-icon", 6);
    i0.ɵɵelementStart(2, "span", 7);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.validationMessage);
} }
export class IdsDatagridColumnVisibilityPanelComponent {
    hideableColumns = [];
    hiddenColumnKeys = new Set();
    validationMessage = null;
    columnVisibilityChange = new EventEmitter();
    onVisibilityChange(field, visible) {
        this.columnVisibilityChange.emit({ field, visible });
    }
    static ɵfac = function IdsDatagridColumnVisibilityPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDatagridColumnVisibilityPanelComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDatagridColumnVisibilityPanelComponent, selectors: [["ids-datagrid-column-visibility-panel"]], inputs: { hideableColumns: "hideableColumns", hiddenColumnKeys: "hiddenColumnKeys", validationMessage: "validationMessage" }, outputs: { columnVisibilityChange: "columnVisibilityChange" }, decls: 5, vars: 1, consts: [["role", "group", "aria-label", "Show or hide columns", "data-column-visibility-panel", "", 1, "root"], [1, "optionList"], [1, "optionItem"], ["role", "alert", 1, "validation"], [1, "checkboxHost"], [3, "checkedChange", "id", "label", "checked"], ["shapeName", "status-critical-square-solid", 3, "size"], [1, "validationText"]], template: function IdsDatagridColumnVisibilityPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0)(1, "ul", 1);
            i0.ɵɵrepeaterCreate(2, IdsDatagridColumnVisibilityPanelComponent_For_3_Template, 3, 3, "li", 2, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, IdsDatagridColumnVisibilityPanelComponent_Conditional_4_Template, 4, 2, "div", 3);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.hideableColumns);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.validationMessage ? 4 : -1);
        } }, dependencies: [IdsCheckboxComponent, IdsIconComponent], styles: [".root[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 200px;\n  max-width: 320px;\n  box-sizing: border-box;\n  background: var(--color-background-component);\n}\n\n.validation[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  margin: 0;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-light);\n  box-sizing: border-box;\n}\n\n.validationText[_ngcontent-%COMP%] {\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-critical);\n}\n\n.optionList[_ngcontent-%COMP%] {\n  list-style: none;\n  margin: 0;\n  padding: var(--padding-padding-4) 0;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-height: 366px;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\n.optionItem[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n  background: var(--color-background-component);\n  min-height: 40px;\n  box-sizing: border-box;\n}\n\n.optionItem[_ngcontent-%COMP%]:hover {\n  background: var(--color-background-brand-lighter);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.checkboxHost[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDatagridColumnVisibilityPanelComponent, [{
        type: Component,
        args: [{ selector: "ids-datagrid-column-visibility-panel", standalone: true, imports: [IdsCheckboxComponent, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"root\" role=\"group\" aria-label=\"Show or hide columns\" data-column-visibility-panel>\n  <ul class=\"optionList\">\n    @for (column of hideableColumns; track column.field) {\n      <li class=\"optionItem\">\n        <div class=\"checkboxHost\">\n          <ids-checkbox\n            [id]=\"'ids-datagrid-col-vis-' + column.field\"\n            [label]=\"column.title\"\n            [checked]=\"!hiddenColumnKeys.has(column.field)\"\n            (checkedChange)=\"onVisibilityChange(column.field, $event)\"\n          />\n        </div>\n      </li>\n    }\n  </ul>\n  @if (validationMessage) {\n    <div class=\"validation\" role=\"alert\">\n      <ids-icon shapeName=\"status-critical-square-solid\" [size]=\"16\" />\n      <span class=\"validationText\">{{ validationMessage }}</span>\n    </div>\n  }\n</div>\n", styles: [".root {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  min-width: 200px;\n  max-width: 320px;\n  box-sizing: border-box;\n  background: var(--color-background-component);\n}\n\n.validation {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  margin: 0;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-light);\n  box-sizing: border-box;\n}\n\n.validationText {\n  font-size: var(--font-size-body-2);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-critical);\n}\n\n.optionList {\n  list-style: none;\n  margin: 0;\n  padding: var(--padding-padding-4) 0;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-height: 366px;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\n.optionItem {\n  display: flex;\n  align-items: center;\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n  background: var(--color-background-component);\n  min-height: 40px;\n  box-sizing: border-box;\n}\n\n.optionItem:hover {\n  background: var(--color-background-brand-lighter);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.checkboxHost {\n  width: 100%;\n  min-width: 0;\n}\n"] }]
    }], null, { hideableColumns: [{
            type: Input,
            args: [{ required: true }]
        }], hiddenColumnKeys: [{
            type: Input
        }], validationMessage: [{
            type: Input
        }], columnVisibilityChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDatagridColumnVisibilityPanelComponent, { className: "IdsDatagridColumnVisibilityPanelComponent", filePath: "src/components/ids-datagrid/ids-datagrid-column-visibility-panel.component.ts", lineNumber: 14 }); })();
