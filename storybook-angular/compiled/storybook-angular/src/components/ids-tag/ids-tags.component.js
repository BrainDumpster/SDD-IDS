import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { TAGS_GROUP_SPEC_ACCURATE_DEFAULTS } from "../../../../component-contracts/ids/tag.contract.js";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsTagsComponent {
    wrap = TAGS_GROUP_SPEC_ACCURATE_DEFAULTS.wrap;
    ariaLabel = TAGS_GROUP_SPEC_ACCURATE_DEFAULTS.ariaLabel;
    static ɵfac = function IdsTagsComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTagsComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTagsComponent, selectors: [["ids-tags"]], inputs: { wrap: "wrap", ariaLabel: "ariaLabel" }, ngContentSelectors: _c0, decls: 2, vars: 3, consts: [["role", "group", 1, "ids-tags"]], template: function IdsTagsComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-tags--nowrap", !ctx.wrap);
            i0.ɵɵattribute("aria-label", ctx.ariaLabel || null);
        } }, styles: ["[_nghost-%COMP%] {\n  display: inline-flex;\n}\n\n.ids-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--spacing-space-8);\n  align-items: center;\n}\n\n.ids-tags--nowrap[_ngcontent-%COMP%] {\n  flex-wrap: nowrap;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTagsComponent, [{
        type: Component,
        args: [{ selector: "ids-tags", standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\n  class=\"ids-tags\"\n  [class.ids-tags--nowrap]=\"!wrap\"\n  role=\"group\"\n  [attr.aria-label]=\"ariaLabel || null\"\n>\n  <ng-content />\n</div>\n", styles: [":host {\n  display: inline-flex;\n}\n\n.ids-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: var(--spacing-space-8);\n  align-items: center;\n}\n\n.ids-tags--nowrap {\n  flex-wrap: nowrap;\n}\n"] }]
    }], null, { wrap: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTagsComponent, { className: "IdsTagsComponent", filePath: "src/components/ids-tag/ids-tags.component.ts", lineNumber: 11 }); })();
