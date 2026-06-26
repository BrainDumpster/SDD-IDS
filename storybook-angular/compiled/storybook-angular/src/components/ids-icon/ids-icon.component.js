import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";
import * as i0 from "@angular/core";
/**
 * IDS icon — loads SVG assets from `/assets/icons/<shapeName>.svg`.
 * Prefer `variant="img"` (default); mask is reserved for rare tint cases.
 */
export class IdsIconComponent {
    shapeName;
    size = 16;
    variant = "img";
    className = "";
    get src() {
        return `/assets/icons/${this.shapeName}.svg`;
    }
    static ɵfac = function IdsIconComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsIconComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsIconComponent, selectors: [["ids-icon"]], hostAttrs: [1, "ids-icon"], hostVars: 4, hostBindings: function IdsIconComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵstyleProp("width", ctx.size, "px")("height", ctx.size, "px");
        } }, inputs: { shapeName: "shapeName", size: "size", variant: "variant", className: "className" }, decls: 1, vars: 2, consts: [["alt", "", "aria-hidden", "true", 1, "ids-icon__asset", 3, "ngClass", "src"]], template: function IdsIconComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "img", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", ctx.className)("src", ctx.src, i0.ɵɵsanitizeUrl);
        } }, dependencies: [NgClass], styles: ["[_nghost-%COMP%] {\n        display: inline-flex;\n        flex-shrink: 0;\n        line-height: 0;\n        box-sizing: border-box;\n      }\n\n      .ids-icon__asset[_ngcontent-%COMP%] {\n        display: block;\n        width: 100%;\n        height: 100%;\n        object-fit: contain;\n      }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsIconComponent, [{
        type: Component,
        args: [{ selector: "ids-icon", standalone: true, imports: [NgClass], template: `
    <img
      class="ids-icon__asset"
      [ngClass]="className"
      [src]="src"
      alt=""
      aria-hidden="true"
    />
  `, host: {
                    class: "ids-icon",
                    "[style.width.px]": "size",
                    "[style.height.px]": "size",
                }, styles: ["\n      :host {\n        display: inline-flex;\n        flex-shrink: 0;\n        line-height: 0;\n        box-sizing: border-box;\n      }\n\n      .ids-icon__asset {\n        display: block;\n        width: 100%;\n        height: 100%;\n        object-fit: contain;\n      }\n    "] }]
    }], null, { shapeName: [{
            type: Input,
            args: [{ required: true }]
        }], size: [{
            type: Input
        }], variant: [{
            type: Input
        }], className: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsIconComponent, { className: "IdsIconComponent", filePath: "src/components/ids-icon/ids-icon.component.ts", lineNumber: 46 }); })();
