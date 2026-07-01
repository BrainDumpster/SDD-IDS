import { ChangeDetectionStrategy, Component, Input, inject, } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsDropdownErrorComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.text, " ");
} }
let errorIdCounter = 0;
export class IdsDropdownErrorComponent {
    dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
    text;
    errorId = `ids-dropdown-error-${++errorIdCounter}`;
    ngOnInit() {
        this.dropdown?.registerDescribedBy(this.errorId);
    }
    ngOnDestroy() {
        this.dropdown?.unregisterDescribedBy(this.errorId);
    }
    static ɵfac = function IdsDropdownErrorComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownErrorComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownErrorComponent, selectors: [["ids-dropdown-error"]], inputs: { text: "text" }, ngContentSelectors: _c0, decls: 5, vars: 3, consts: [[1, "error", 3, "id"], ["shapeName", "status-critical-square-solid", "variant", "img", 3, "size"]], template: function IdsDropdownErrorComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "p", 0);
            i0.ɵɵelement(1, "ids-icon", 1);
            i0.ɵɵelementStart(2, "span");
            i0.ɵɵconditionalCreate(3, IdsDropdownErrorComponent_Conditional_3_Template, 1, 1);
            i0.ɵɵprojection(4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵproperty("id", ctx.errorId);
            i0.ɵɵadvance();
            i0.ɵɵproperty("size", 16);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.text ? 3 : -1);
        } }, dependencies: [IdsIconComponent], styles: [".error[_ngcontent-%COMP%] {\n  margin: var(--spacing-space-4) 0 0;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-critical);\n  font-weight: 400;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownErrorComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown-error", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<p class=\"error\" [id]=\"errorId\">\n  <ids-icon shapeName=\"status-critical-square-solid\" variant=\"img\" [size]=\"16\" />\n  <span>\n    @if (text) {\n      {{ text }}\n    }\n    <ng-content />\n  </span>\n</p>\n", styles: [".error {\n  margin: var(--spacing-space-4) 0 0;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-critical);\n  font-weight: 400;\n}\n"] }]
    }], null, { text: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownErrorComponent, { className: "IdsDropdownErrorComponent", filePath: "src/components/ids-dropdown/ids-dropdown-error.component.ts", lineNumber: 22 }); })();
