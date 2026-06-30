import { Component, Input, ViewEncapsulation, forwardRef, inject, } from "@angular/core";
import { NgClass } from "@angular/common";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_MAIN_MENU_LEFT_CONTEXT, IDS_MAIN_MENU_LEFT_GROUP_CONTEXT } from "./ids-main-menu-left-context";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsMainMenuLeftItemComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 2);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("shapeName", ctx_r0.chevronShape)("size", 14);
} }
function IdsMainMenuLeftItemComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 3);
} }
function IdsMainMenuLeftItemComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 4);
} }
export class IdsMainMenuLeftItemComponent {
    root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);
    group = inject(IDS_MAIN_MENU_LEFT_GROUP_CONTEXT, { optional: true });
    itemId;
    level = "primary";
    forceState;
    tooltip = "";
    get isPrimary() {
        return this.level === "primary";
    }
    get isSecondary() {
        return this.level === "secondary";
    }
    get groupId() {
        return this.group?.groupId;
    }
    get rowClasses() {
        if (this.isSecondary) {
            return [
                "ids-main-menu-left__secondary-row",
                "ids-main-menu-left__secondary-row--interactive",
                this.root.isSecondarySelected(this.itemId, this.groupId ?? "")
                    ? "ids-main-menu-left__secondary-row--selected"
                    : "",
            ].filter(Boolean);
        }
        return [
            "ids-main-menu-left__primary-row",
            !(this.root.forceStates && this.forceState)
                ? "ids-main-menu-left__primary-row--interactive"
                : "",
            this.root.stateClass(this.itemId, this.forceState),
            this.groupId && this.root.hasSelectedSecondaryInGroup(this.groupId)
                ? "ids-main-menu-left__primary-row--secondary-parent-selected"
                : "",
            this.root.showPrimaryInset(this.itemId, this.groupId, this.forceState)
                ? "ids-main-menu-left__primary-row--selected"
                : "",
        ].filter(Boolean);
    }
    get showChevron() {
        return Boolean(this.isPrimary && this.groupId && this.root.showChevronForGroup(this.groupId));
    }
    get chevronShape() {
        if (!this.groupId)
            return "chev-right-thick";
        return this.root.isGroupChildrenVisible(this.groupId)
            ? "chev-down-thick"
            : "chev-right-thick";
    }
    onActivate(event) {
        if (this.root.forceStates && this.forceState)
            return;
        const target = event.target;
        if (target?.closest("a,button,[routerlink]")) {
            // Let projected link hosts handle navigation; still update selection below.
        }
        const label = this.tooltip || this.itemId;
        if (this.isSecondary && this.groupId) {
            this.root.onSecondaryActivate(this.itemId, this.groupId, label);
            return;
        }
        this.root.onPrimaryActivate(this.itemId, label, this.groupId);
        if (this.groupId) {
            event.preventDefault();
            this.root.toggleGroup(this.groupId);
        }
    }
    static ɵfac = function IdsMainMenuLeftItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftItemComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftItemComponent, selectors: [["ids-main-menu-left-item"]], inputs: { itemId: "itemId", level: "level", forceState: "forceState", tooltip: "tooltip" }, ngContentSelectors: _c0, decls: 7, vars: 9, consts: [[3, "click", "ngClass"], [1, "ids-main-menu-left__link-host"], ["className", "ids-main-menu-left__chevron-icon", "variant", "mask", 3, "shapeName", "size"], ["aria-hidden", "true", 1, "ids-main-menu-left__focus-ring"], ["aria-hidden", "true", 1, "ids-main-menu-left__selected-inset"]], template: function IdsMainMenuLeftItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div")(1, "div", 0);
            i0.ɵɵlistener("click", function IdsMainMenuLeftItemComponent_Template_div_click_1_listener($event) { return ctx.onActivate($event); });
            i0.ɵɵelementStart(2, "div", 1);
            i0.ɵɵprojection(3);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, IdsMainMenuLeftItemComponent_Conditional_4_Template, 1, 2, "ids-icon", 2);
            i0.ɵɵconditionalCreate(5, IdsMainMenuLeftItemComponent_Conditional_5_Template, 1, 0, "span", 3);
            i0.ɵɵconditionalCreate(6, IdsMainMenuLeftItemComponent_Conditional_6_Template, 1, 0, "span", 4);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-main-menu-left__item-block", ctx.isPrimary && !ctx.groupId);
            i0.ɵɵadvance();
            i0.ɵɵproperty("ngClass", ctx.rowClasses);
            i0.ɵɵattribute("title", ctx.tooltip || null)("aria-current", ctx.isPrimary ? ctx.root.primaryAriaCurrent(ctx.itemId, ctx.groupId, ctx.forceState) : ctx.isSecondary && ctx.root.isSecondarySelected(ctx.itemId, ctx.groupId ?? "") ? "page" : null)("aria-expanded", ctx.isPrimary && ctx.groupId ? ctx.root.primaryAriaExpanded(ctx.groupId) : null);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showChevron ? 4 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isPrimary && ctx.root.isPrimaryFocused(ctx.itemId, ctx.forceState) ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.isPrimary && ctx.root.showPrimaryInset(ctx.itemId, ctx.groupId, ctx.forceState) ? 6 : -1);
        } }, dependencies: [NgClass, IdsIconComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftItemComponent, [{
        type: Component,
        args: [{ selector: "ids-main-menu-left-item", standalone: true, imports: [NgClass, IdsIconComponent], encapsulation: ViewEncapsulation.None, template: "<div [class.ids-main-menu-left__item-block]=\"isPrimary && !groupId\">\n  <div\n    [ngClass]=\"rowClasses\"\n    [attr.title]=\"tooltip || null\"\n    [attr.aria-current]=\"\n      isPrimary\n        ? root.primaryAriaCurrent(itemId, groupId, forceState)\n        : isSecondary && root.isSecondarySelected(itemId, groupId ?? '')\n          ? 'page'\n          : null\n    \"\n    [attr.aria-expanded]=\"isPrimary && groupId ? root.primaryAriaExpanded(groupId) : null\"\n    (click)=\"onActivate($event)\"\n  >\n    <div class=\"ids-main-menu-left__link-host\">\n      <ng-content />\n    </div>\n    @if (showChevron) {\n      <ids-icon\n        className=\"ids-main-menu-left__chevron-icon\"\n        [shapeName]=\"chevronShape\"\n        variant=\"mask\"\n        [size]=\"14\"\n      />\n    }\n    @if (isPrimary && root.isPrimaryFocused(itemId, forceState)) {\n      <span class=\"ids-main-menu-left__focus-ring\" aria-hidden=\"true\"></span>\n    }\n    @if (isPrimary && root.showPrimaryInset(itemId, groupId, forceState)) {\n      <span class=\"ids-main-menu-left__selected-inset\" aria-hidden=\"true\"></span>\n    }\n  </div>\n</div>\n" }]
    }], null, { itemId: [{
            type: Input,
            args: [{ required: true }]
        }], level: [{
            type: Input
        }], forceState: [{
            type: Input
        }], tooltip: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftItemComponent, { className: "IdsMainMenuLeftItemComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-item.component.ts", lineNumber: 22 }); })();
export class IdsMainMenuLeftItemIconComponent {
    shapeName;
    static ɵfac = function IdsMainMenuLeftItemIconComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftItemIconComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftItemIconComponent, selectors: [["ids-main-menu-left-item-icon"]], inputs: { shapeName: "shapeName" }, decls: 1, vars: 2, consts: [["className", "ids-main-menu-left__primary-icon", "variant", "mask", 3, "shapeName", "size"]], template: function IdsMainMenuLeftItemIconComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "ids-icon", 0);
        } if (rf & 2) {
            i0.ɵɵproperty("shapeName", ctx.shapeName)("size", 16);
        } }, dependencies: [IdsIconComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftItemIconComponent, [{
        type: Component,
        args: [{
                selector: "ids-main-menu-left-item-icon",
                standalone: true,
                imports: [IdsIconComponent],
                template: `
    <ids-icon
      className="ids-main-menu-left__primary-icon"
      [shapeName]="shapeName"
      variant="mask"
      [size]="16"
    />
  `,
                encapsulation: ViewEncapsulation.None,
            }]
    }], null, { shapeName: [{
            type: Input,
            args: [{ required: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftItemIconComponent, { className: "IdsMainMenuLeftItemIconComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-item.component.ts", lineNumber: 112 }); })();
export class IdsMainMenuLeftChildrenComponent {
    root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);
    group = inject(IDS_MAIN_MENU_LEFT_GROUP_CONTEXT, { optional: true });
    static ɵfac = function IdsMainMenuLeftChildrenComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftChildrenComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftChildrenComponent, selectors: [["ids-main-menu-left-children"]], ngContentSelectors: _c0, decls: 2, vars: 2, consts: [[1, "ids-main-menu-left__secondary-section"]], template: function IdsMainMenuLeftChildrenComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-main-menu-left__secondary-section--hidden", ctx.group && !ctx.root.isGroupChildrenVisible(ctx.group.groupId));
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftChildrenComponent, [{
        type: Component,
        args: [{
                selector: "ids-main-menu-left-children",
                standalone: true,
                template: `
    <div
      class="ids-main-menu-left__secondary-section"
      [class.ids-main-menu-left__secondary-section--hidden]="
        group && !root.isGroupChildrenVisible(group.groupId)
      "
    >
      <ng-content />
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftChildrenComponent, { className: "IdsMainMenuLeftChildrenComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-item.component.ts", lineNumber: 131 }); })();
export class IdsMainMenuLeftGroupComponent {
    root = inject(IDS_MAIN_MENU_LEFT_CONTEXT);
    groupId;
    defaultExpanded = false;
    ngOnInit() {
        this.root.registerGroup({
            groupId: this.groupId,
            defaultExpanded: this.defaultExpanded,
            childrenMenuPinned: this.root.forceStates,
        });
    }
    ngOnDestroy() {
        this.root.unregisterGroup(this.groupId);
    }
    static ɵfac = function IdsMainMenuLeftGroupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftGroupComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftGroupComponent, selectors: [["ids-main-menu-left-group"]], inputs: { groupId: "groupId", defaultExpanded: "defaultExpanded" }, features: [i0.ɵɵProvidersFeature([
                {
                    provide: IDS_MAIN_MENU_LEFT_GROUP_CONTEXT,
                    useExisting: forwardRef(() => IdsMainMenuLeftGroupComponent),
                },
            ])], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-main-menu-left__item-block"]], template: function IdsMainMenuLeftGroupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftGroupComponent, [{
        type: Component,
        args: [{
                selector: "ids-main-menu-left-group",
                standalone: true,
                template: `<div class="ids-main-menu-left__item-block"><ng-content /></div>`,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    {
                        provide: IDS_MAIN_MENU_LEFT_GROUP_CONTEXT,
                        useExisting: forwardRef(() => IdsMainMenuLeftGroupComponent),
                    },
                ],
            }]
    }], null, { groupId: [{
            type: Input,
            args: [{ required: true }]
        }], defaultExpanded: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftGroupComponent, { className: "IdsMainMenuLeftGroupComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-item.component.ts", lineNumber: 148 }); })();
export class IdsMainMenuLeftLogoComponent {
    static ɵfac = function IdsMainMenuLeftLogoComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftLogoComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftLogoComponent, selectors: [["ids-main-menu-left-logo"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ids-main-menu-left__logo-slot"]], template: function IdsMainMenuLeftLogoComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftLogoComponent, [{
        type: Component,
        args: [{
                selector: "ids-main-menu-left-logo",
                standalone: true,
                template: `
    <div class="ids-main-menu-left__logo-slot">
      <ng-content />
    </div>
  `,
                encapsulation: ViewEncapsulation.None,
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftLogoComponent, { className: "IdsMainMenuLeftLogoComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-item.component.ts", lineNumber: 177 }); })();
