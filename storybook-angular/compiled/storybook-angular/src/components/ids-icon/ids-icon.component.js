import { Component, Input } from "@angular/core";
import { NgClass } from "@angular/common";
import * as i0 from "@angular/core";
function IdsIconComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("mask-image", ctx_r0.maskImage);
    i0.ɵɵproperty("ngClass", ctx_r0.className);
} }
function IdsIconComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "img", 1);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("ngClass", ctx_r0.className)("src", ctx_r0.src, i0.ɵɵsanitizeUrl);
} }
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
    get maskImage() {
        return `url(${this.src})`;
    }
    static ɵfac = function IdsIconComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsIconComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsIconComponent, selectors: [["ids-icon"]], hostAttrs: [1, "ids-icon"], hostVars: 4, hostBindings: function IdsIconComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵstyleProp("width", ctx.size, "px")("height", ctx.size, "px");
        } }, inputs: { shapeName: "shapeName", size: "size", variant: "variant", className: "className" }, decls: 2, vars: 1, consts: [["aria-hidden", "true", 1, "ids-icon__mask", 3, "ngClass", "mask-image"], ["alt", "", "aria-hidden", "true", 1, "ids-icon__asset", 3, "ngClass", "src"], ["aria-hidden", "true", 1, "ids-icon__mask", 3, "ngClass"]], template: function IdsIconComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵconditionalCreate(0, IdsIconComponent_Conditional_0_Template, 1, 3, "span", 0)(1, IdsIconComponent_Conditional_1_Template, 1, 2, "img", 1);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.variant === "mask" ? 0 : 1);
        } }, dependencies: [NgClass], styles: ["[_nghost-%COMP%] {\n        display: inline-flex;\n        flex-shrink: 0;\n        line-height: 0;\n        box-sizing: border-box;\n        color: inherit;\n      }\n\n      .ids-icon__asset[_ngcontent-%COMP%] {\n        display: block;\n        width: 100%;\n        height: 100%;\n        object-fit: contain;\n      }\n\n      .ids-icon__mask[_ngcontent-%COMP%] {\n        display: block;\n        width: 100%;\n        height: 100%;\n        background-color: currentColor;\n        mask-repeat: no-repeat;\n        mask-position: center;\n        mask-size: contain;\n        -webkit-mask-repeat: no-repeat;\n        -webkit-mask-position: center;\n        -webkit-mask-size: contain;\n      }"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsIconComponent, [{
        type: Component,
        args: [{ selector: "ids-icon", standalone: true, imports: [NgClass], template: `
    @if (variant === "mask") {
      <span
        class="ids-icon__mask"
        [ngClass]="className"
        [style.mask-image]="maskImage"
        aria-hidden="true"
      ></span>
    } @else {
      <img
        class="ids-icon__asset"
        [ngClass]="className"
        [src]="src"
        alt=""
        aria-hidden="true"
      />
    }
  `, host: {
                    class: "ids-icon",
                    "[style.width.px]": "size",
                    "[style.height.px]": "size",
                }, styles: ["\n      :host {\n        display: inline-flex;\n        flex-shrink: 0;\n        line-height: 0;\n        box-sizing: border-box;\n        color: inherit;\n      }\n\n      .ids-icon__asset {\n        display: block;\n        width: 100%;\n        height: 100%;\n        object-fit: contain;\n      }\n\n      .ids-icon__mask {\n        display: block;\n        width: 100%;\n        height: 100%;\n        background-color: currentColor;\n        mask-repeat: no-repeat;\n        mask-position: center;\n        mask-size: contain;\n        -webkit-mask-repeat: no-repeat;\n        -webkit-mask-position: center;\n        -webkit-mask-size: contain;\n      }\n    "] }]
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
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsIconComponent, { className: "IdsIconComponent", filePath: "src/components/ids-icon/ids-icon.component.ts", lineNumber: 69 }); })();
