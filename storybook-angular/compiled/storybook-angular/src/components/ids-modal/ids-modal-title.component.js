import { Component, inject, ViewEncapsulation } from "@angular/core";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
/** Modal title slot — projects into header chrome (`Header 5`). */
export class IdsModalTitleComponent {
    modal = inject(IDS_MODAL_CONTEXT);
    static ɵfac = function IdsModalTitleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsModalTitleComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsModalTitleComponent, selectors: [["ids-modal-title"]], ngContentSelectors: _c0, decls: 2, vars: 1, consts: [[1, "ids-modal__title", 3, "id"]], template: function IdsModalTitleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "h2", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵdomProperty("id", ctx.modal.titleId);
        } }, styles: [":host { display: contents; }"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsModalTitleComponent, [{
        type: Component,
        args: [{ selector: "ids-modal-title", standalone: true, template: `<h2 [id]="modal.titleId" class="ids-modal__title"><ng-content /></h2>`, encapsulation: ViewEncapsulation.None, styles: [":host { display: contents; }"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsModalTitleComponent, { className: "IdsModalTitleComponent", filePath: "src/components/ids-modal/ids-modal-title.component.ts", lineNumber: 12 }); })();
