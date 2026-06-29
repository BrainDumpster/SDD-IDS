import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsModalFooterComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-checkbox", 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("label", ctx_r0.modal.footerCheckboxLabel)("showLabel", true);
} }
/** Modal footer slot — projects action buttons (`ids-button`) and optional checkbox from root. */
export class IdsModalFooterComponent {
    modal = inject(IDS_MODAL_CONTEXT);
    static ɵfac = function IdsModalFooterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsModalFooterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsModalFooterComponent, selectors: [["ids-modal-footer"]], ngContentSelectors: _c0, decls: 4, vars: 3, consts: [[1, "ids-modal__footer"], [3, "label", "showLabel"], [1, "ids-modal__actions"]], template: function IdsModalFooterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "footer", 0);
            i0.ɵɵconditionalCreate(1, IdsModalFooterComponent_Conditional_1_Template, 1, 2, "ids-checkbox", 1);
            i0.ɵɵelementStart(2, "div", 2);
            i0.ɵɵprojection(3);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-modal__footer--bordered", ctx.modal.showFooterBorder);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.modal.footerCheckbox ? 1 : -1);
        } }, dependencies: [IdsCheckboxComponent], styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsModalFooterComponent, [{
        type: Component,
        args: [{ selector: "ids-modal-footer", standalone: true, imports: [IdsCheckboxComponent], template: `
    <footer
      class="ids-modal__footer"
      [class.ids-modal__footer--bordered]="modal.showFooterBorder"
    >
      @if (modal.footerCheckbox) {
        <ids-checkbox [label]="modal.footerCheckboxLabel" [showLabel]="true" />
      }

      <div class="ids-modal__actions">
        <ng-content />
      </div>
    </footer>
  `, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsModalFooterComponent, { className: "IdsModalFooterComponent", filePath: "src/components/ids-modal/ids-modal-footer.component.ts", lineNumber: 27 }); })();
