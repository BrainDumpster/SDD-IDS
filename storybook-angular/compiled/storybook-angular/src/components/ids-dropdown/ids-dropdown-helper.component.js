import { ChangeDetectionStrategy, Component, ElementRef, Input, inject, } from "@angular/core";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsDropdownHelperComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.text, " ");
} }
let helperIdCounter = 0;
export class IdsDropdownHelperComponent {
    dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
    elementRef = inject((ElementRef));
    text;
    helperId = `ids-dropdown-helper-${++helperIdCounter}`;
    ngOnInit() {
        this.dropdown?.registerDescribedBy(this.helperId);
    }
    ngOnDestroy() {
        this.dropdown?.unregisterDescribedBy(this.helperId);
    }
    static ɵfac = function IdsDropdownHelperComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownHelperComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownHelperComponent, selectors: [["ids-dropdown-helper"]], inputs: { text: "text" }, ngContentSelectors: _c0, decls: 3, vars: 2, consts: [[1, "helper", 3, "id"]], template: function IdsDropdownHelperComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "p", 0);
            i0.ɵɵconditionalCreate(1, IdsDropdownHelperComponent_Conditional_1_Template, 1, 1);
            i0.ɵɵprojection(2);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵdomProperty("id", ctx.helperId);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.text ? 1 : -1);
        } }, styles: [".helper[_ngcontent-%COMP%] {\n  margin: var(--spacing-space-4) 0 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  font-weight: 400;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownHelperComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown-helper", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<p class=\"helper\" [id]=\"helperId\">\n  @if (text) {\n    {{ text }}\n  }\n  <ng-content />\n</p>\n", styles: [".helper {\n  margin: var(--spacing-space-4) 0 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  font-weight: 400;\n}\n"] }]
    }], null, { text: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownHelperComponent, { className: "IdsDropdownHelperComponent", filePath: "src/components/ids-dropdown/ids-dropdown-helper.component.ts", lineNumber: 21 }); })();
