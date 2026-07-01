import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsDropdownTriggerShellComponent {
    size = "large";
    disabled = false;
    error = false;
    /** Demo-only: simulates Figma hover border. */
    hover = false;
    /** Demo-only: keyboard focus ring. */
    focusVisible = false;
    static ɵfac = function IdsDropdownTriggerShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownTriggerShellComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownTriggerShellComponent, selectors: [["ids-dropdown-trigger-shell"]], hostVars: 1, hostBindings: function IdsDropdownTriggerShellComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("data-popup-open", null);
        } }, inputs: { size: "size", disabled: "disabled", error: "error", hover: "hover", focusVisible: "focusVisible" }, ngContentSelectors: _c0, decls: 5, vars: 6, consts: [[1, "field"], [1, "main"], ["aria-hidden", "true", 1, "caret-wrap"], ["shapeName", "arrow-drop-tri-caret", 3, "size"]], template: function IdsDropdownTriggerShellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵprojection(2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(3, "span", 2);
            i0.ɵɵelement(4, "ids-icon", 3);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵattribute("data-size", ctx.size === "small" ? "small" : null)("data-disabled", ctx.disabled || null)("data-error", ctx.error || null)("data-hover", ctx.hover || null)("data-focus", ctx.focusVisible || null);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("size", 10);
        } }, dependencies: [IdsIconComponent], styles: ["\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.field[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  max-width: 700px;\n  min-width: 186px;\n  min-height: 40px;\n  box-sizing: border-box;\n  border: var(--border-width-border-default) solid var(--trigger-border, var(--color-border-accessible));\n  background: var(--trigger-bg, var(--color-background-component));\n  color: var(--trigger-fg, var(--color-text-neutral));\n  padding: var(--trigger-py, var(--padding-padding-10)) var(--padding-padding-16);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  gap: var(--spacing-space-10);\n  border-radius: var(--dropdown-control-radius);\n}\n\n.field[data-size=\"small\"][_ngcontent-%COMP%] {\n  --trigger-py: var(--padding-padding-6);\n  min-height: 32px;\n}\n\n.field[data-disabled=\"true\"][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background: var(--color-background-gray-lighter);\n  --trigger-border: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.field[data-error=\"true\"][_ngcontent-%COMP%]:not([data-disabled=\"true\"]) {\n  --trigger-border: var(--color-border-alerting-critical-base);\n}\n\n.field[data-hover=\"true\"][_ngcontent-%COMP%]:not([data-disabled=\"true\"]):not([data-error=\"true\"]) {\n  --trigger-border: var(--color-border-strong);\n}\n\n.field[data-focus=\"true\"][_ngcontent-%COMP%]:not([data-disabled=\"true\"])::after {\n  content: \"\";\n  position: absolute;\n  inset: -5px;\n  border: var(--border-width-border-default) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n[data-popup-open][data-popup-side=\"below\"][_nghost-%COMP%]   .field[_ngcontent-%COMP%], [data-popup-open][data-popup-side=\"below\"]   [_nghost-%COMP%]   .field[_ngcontent-%COMP%], \n[data-popup-open]:not([data-popup-side])[_nghost-%COMP%]   .field[_ngcontent-%COMP%], [data-popup-open]:not([data-popup-side])   [_nghost-%COMP%]   .field[_ngcontent-%COMP%] {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n[data-popup-open][data-popup-side=\"above\"][_nghost-%COMP%]   .field[_ngcontent-%COMP%], [data-popup-open][data-popup-side=\"above\"]   [_nghost-%COMP%]   .field[_ngcontent-%COMP%] {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.main[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex: 1 1 auto;\n  min-width: 0;\n  gap: var(--spacing-space-4);\n}\n\n.caret-wrap[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: flex-start;\n  padding: 5px var(--padding-padding-1);\n  color: var(--color-icon-neutral);\n  line-height: 0;\n}\n\n.field[data-disabled=\"true\"][_ngcontent-%COMP%]   .caret-wrap[_ngcontent-%COMP%] {\n  color: var(--color-border-disabled);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownTriggerShellComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown-trigger-shell", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, host: {
                    "[attr.data-popup-open]": "null",
                }, template: "<div\n  class=\"field\"\n  [attr.data-size]=\"size === 'small' ? 'small' : null\"\n  [attr.data-disabled]=\"disabled || null\"\n  [attr.data-error]=\"error || null\"\n  [attr.data-hover]=\"hover || null\"\n  [attr.data-focus]=\"focusVisible || null\"\n>\n  <div class=\"main\">\n    <ng-content />\n  </div>\n  <span class=\"caret-wrap\" aria-hidden=\"true\">\n    <ids-icon shapeName=\"arrow-drop-tri-caret\" [size]=\"10\" />\n  </span>\n</div>\n", styles: ["/* Ported from storybook/src/components/IdsDropdownTriggerShell.module.css */\n\n:host {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.field {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  max-width: 700px;\n  min-width: 186px;\n  min-height: 40px;\n  box-sizing: border-box;\n  border: var(--border-width-border-default) solid var(--trigger-border, var(--color-border-accessible));\n  background: var(--trigger-bg, var(--color-background-component));\n  color: var(--trigger-fg, var(--color-text-neutral));\n  padding: var(--trigger-py, var(--padding-padding-10)) var(--padding-padding-16);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  gap: var(--spacing-space-10);\n  border-radius: var(--dropdown-control-radius);\n}\n\n.field[data-size=\"small\"] {\n  --trigger-py: var(--padding-padding-6);\n  min-height: 32px;\n}\n\n.field[data-disabled=\"true\"] {\n  cursor: not-allowed;\n  background: var(--color-background-gray-lighter);\n  --trigger-border: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.field[data-error=\"true\"]:not([data-disabled=\"true\"]) {\n  --trigger-border: var(--color-border-alerting-critical-base);\n}\n\n.field[data-hover=\"true\"]:not([data-disabled=\"true\"]):not([data-error=\"true\"]) {\n  --trigger-border: var(--color-border-strong);\n}\n\n.field[data-focus=\"true\"]:not([data-disabled=\"true\"])::after {\n  content: \"\";\n  position: absolute;\n  inset: -5px;\n  border: var(--border-width-border-default) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n:host-context([data-popup-open][data-popup-side=\"below\"]) .field,\n:host-context([data-popup-open]:not([data-popup-side])) .field {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n\n:host-context([data-popup-open][data-popup-side=\"above\"]) .field {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n\n.main {\n  display: flex;\n  align-items: center;\n  flex: 1 1 auto;\n  min-width: 0;\n  gap: var(--spacing-space-4);\n}\n\n.caret-wrap {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: flex-start;\n  padding: 5px var(--padding-padding-1);\n  color: var(--color-icon-neutral);\n  line-height: 0;\n}\n\n.field[data-disabled=\"true\"] .caret-wrap {\n  color: var(--color-border-disabled);\n}\n"] }]
    }], null, { size: [{
            type: Input
        }], disabled: [{
            type: Input
        }], error: [{
            type: Input
        }], hover: [{
            type: Input
        }], focusVisible: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownTriggerShellComponent, { className: "IdsDropdownTriggerShellComponent", filePath: "src/components/ids-dropdown/ids-dropdown-trigger-shell.component.ts", lineNumber: 16 }); })();
