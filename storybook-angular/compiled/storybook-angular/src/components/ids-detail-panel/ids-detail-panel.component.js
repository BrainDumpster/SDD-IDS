import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { DETAIL_PANEL_API_DEFAULTS, DETAIL_PANEL_COLLAPSED_ICON, DETAIL_PANEL_EXPANDED_ICON, } from "../../../../component-contracts/ids/detail-panel.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_DETAIL_PANEL_CONTEXT } from "./ids-detail-panel-context";
import { IdsDetailPanelBodyComponent } from "./ids-detail-panel-body.component";
import { IdsDetailPanelHeaderComponent } from "./ids-detail-panel-header.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-detail-panel-body"]], [["ids-detail-panel-header"]], "*"];
const _c1 = ["ids-detail-panel-body", "ids-detail-panel-header", "*"];
function IdsDetailPanelComponent_Conditional_0_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtext(0);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.title, " ");
} }
function IdsDetailPanelComponent_Conditional_0_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "header", 1)(1, "h3", 4);
    i0.ɵɵprojection(2, 1);
    i0.ɵɵconditionalCreate(3, IdsDetailPanelComponent_Conditional_0_Conditional_0_Conditional_3_Template, 1, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 5)(5, "button", 6);
    i0.ɵɵlistener("click", function IdsDetailPanelComponent_Conditional_0_Conditional_0_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onToggleClick()); })("keydown", function IdsDetailPanelComponent_Conditional_0_Conditional_0_Template_button_keydown_5_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onToggleKeydown($event)); });
    i0.ɵɵelement(6, "ids-icon", 7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵconditional(!ctx_r1.hasHeaderSlot ? 3 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", ctx_r1.toggleAriaLabel)("aria-expanded", ctx_r1.expanded)("aria-controls", ctx_r1.bodyId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r1.toggleIcon)("size", 16);
} }
function IdsDetailPanelComponent_Conditional_0_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 2);
} }
function IdsDetailPanelComponent_Conditional_0_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "footer", 3)(1, "div", 5)(2, "button", 6);
    i0.ɵɵlistener("click", function IdsDetailPanelComponent_Conditional_0_Conditional_4_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onToggleClick()); })("keydown", function IdsDetailPanelComponent_Conditional_0_Conditional_4_Template_button_keydown_2_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onToggleKeydown($event)); });
    i0.ɵɵelement(3, "ids-icon", 7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", ctx_r1.toggleAriaLabel)("aria-expanded", ctx_r1.expanded)("aria-controls", ctx_r1.bodyId);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r1.toggleIcon)("size", 16);
} }
function IdsDetailPanelComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsDetailPanelComponent_Conditional_0_Conditional_0_Template, 7, 6, "header", 1);
    i0.ɵɵelementStart(1, "div", 2);
    i0.ɵɵprojection(2);
    i0.ɵɵconditionalCreate(3, IdsDetailPanelComponent_Conditional_0_Conditional_3_Template, 1, 0);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, IdsDetailPanelComponent_Conditional_0_Conditional_4_Template, 4, 5, "footer", 3);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.showDatagridHeader ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("id", ctx_r1.bodyId);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(!ctx_r1.hasBodySlot ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showPageFooter ? 4 : -1);
} }
function IdsDetailPanelComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 5)(2, "button", 6);
    i0.ɵɵlistener("click", function IdsDetailPanelComponent_Conditional_1_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggleClick()); })("keydown", function IdsDetailPanelComponent_Conditional_1_Template_button_keydown_2_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onToggleKeydown($event)); });
    i0.ɵɵelement(3, "ids-icon", 7);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("ids-detail-panel__collapsed-rail--page", ctx_r1.attachMode === "page")("ids-detail-panel__collapsed-rail--datagrid", ctx_r1.attachMode === "datagrid");
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-label", ctx_r1.toggleAriaLabel)("aria-expanded", ctx_r1.expanded);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r1.toggleIcon)("size", 16);
} }
let detailPanelInstanceCounter = 0;
export class IdsDetailPanelComponent {
    headerSlot;
    bodySlot;
    attachMode = DETAIL_PANEL_API_DEFAULTS.attachMode;
    expanded = DETAIL_PANEL_API_DEFAULTS.expanded;
    title = DETAIL_PANEL_API_DEFAULTS.title;
    showHeader = DETAIL_PANEL_API_DEFAULTS.showHeader;
    showFooter = DETAIL_PANEL_API_DEFAULTS.showFooter;
    ariaLabelExpand = DETAIL_PANEL_API_DEFAULTS.ariaLabelExpand;
    ariaLabelCollapse = DETAIL_PANEL_API_DEFAULTS.ariaLabelCollapse;
    collapsedWidth = DETAIL_PANEL_API_DEFAULTS.collapsedWidth;
    expandedWidth = DETAIL_PANEL_API_DEFAULTS.expandedWidth;
    expandedChange = new EventEmitter();
    opened = new EventEmitter();
    closed = new EventEmitter();
    bodyId = `ids-detail-panel-body-${++detailPanelInstanceCounter}`;
    get hasHeaderSlot() {
        return Boolean(this.headerSlot);
    }
    get hasBodySlot() {
        return Boolean(this.bodySlot);
    }
    get panelWidth() {
        return this.expanded ? this.expandedWidth : this.collapsedWidth;
    }
    get toggleIcon() {
        return this.expanded ? DETAIL_PANEL_EXPANDED_ICON : DETAIL_PANEL_COLLAPSED_ICON;
    }
    get toggleAriaLabel() {
        return this.expanded ? this.ariaLabelCollapse : this.ariaLabelExpand;
    }
    get ariaLabel() {
        return `${this.attachMode} details panel`;
    }
    get showDatagridHeader() {
        return this.attachMode === "datagrid" && this.expanded && this.showHeader;
    }
    get showPageFooter() {
        return this.attachMode === "page" && this.expanded && this.showFooter;
    }
    toggle() {
        const next = !this.expanded;
        this.expandedChange.emit(next);
        if (next) {
            this.opened.emit();
        }
        else {
            this.closed.emit();
        }
    }
    onToggleClick() {
        this.toggle();
    }
    onToggleKeydown(event) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.toggle();
        }
    }
    static ɵfac = function IdsDetailPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDetailPanelComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDetailPanelComponent, selectors: [["ids-detail-panel"]], contentQueries: function IdsDetailPanelComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDetailPanelHeaderComponent, 5)(dirIndex, IdsDetailPanelBodyComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.headerSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.bodySlot = _t.first);
        } }, hostAttrs: ["role", "complementary", 1, "ids-detail-panel"], hostVars: 3, hostBindings: function IdsDetailPanelComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("aria-label", ctx.ariaLabel);
            i0.ɵɵstyleProp("width", ctx.panelWidth, "px");
        } }, inputs: { attachMode: "attachMode", expanded: "expanded", title: "title", showHeader: "showHeader", showFooter: "showFooter", ariaLabelExpand: "ariaLabelExpand", ariaLabelCollapse: "ariaLabelCollapse", collapsedWidth: "collapsedWidth", expandedWidth: "expandedWidth" }, outputs: { expandedChange: "expandedChange", opened: "opened", closed: "closed" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_DETAIL_PANEL_CONTEXT, useExisting: IdsDetailPanelComponent }])], ngContentSelectors: _c1, decls: 2, vars: 1, consts: [[1, "ids-detail-panel__collapsed-rail", 3, "ids-detail-panel__collapsed-rail--page", "ids-detail-panel__collapsed-rail--datagrid"], [1, "ids-detail-panel__header"], [1, "ids-detail-panel__body", 3, "id"], [1, "ids-detail-panel__footer"], [1, "ids-detail-panel__title"], [1, "ids-detail-panel__controls"], ["type", "button", 1, "ids-detail-panel__toggle", 3, "click", "keydown"], ["className", "ids-detail-panel__toggle-icon", 3, "shapeName", "size"], [1, "ids-detail-panel__collapsed-rail"]], template: function IdsDetailPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵconditionalCreate(0, IdsDetailPanelComponent_Conditional_0_Template, 5, 4)(1, IdsDetailPanelComponent_Conditional_1_Template, 4, 8, "div", 0);
        } if (rf & 2) {
            i0.ɵɵconditional(ctx.expanded ? 0 : 1);
        } }, dependencies: [IdsIconComponent], styles: [".ids-detail-panel {\n  box-sizing: border-box;\n  height: 100%;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.ids-detail-panel__header,\n.ids-detail-panel__footer {\n  box-sizing: border-box;\n  min-height: 48px;\n  padding: 14px 12px 14px 24px;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__footer {\n  border-bottom: 0;\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  justify-content: flex-end;\n}\n\n.ids-detail-panel__title {\n  margin: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-detail-panel__controls {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-detail-panel__toggle {\n  border: 0;\n  background: transparent;\n  color: var(--color-icon-neutral);\n  padding: 0;\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n.ids-detail-panel__toggle:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-detail-panel__toggle-icon {\n  display: block;\n  filter: brightness(0) saturate(100%) invert(30%) sepia(0%) saturate(0%) hue-rotate(168deg)\n    brightness(95%) contrast(92%);\n}\n\n.ids-detail-panel__body {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 24px;\n  box-sizing: border-box;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__collapsed-rail {\n  height: 100%;\n  box-sizing: border-box;\n  display: flex;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__collapsed-rail--datagrid {\n  align-items: flex-start;\n  justify-content: flex-end;\n  padding: 16px 12px;\n}\n\n.ids-detail-panel__collapsed-rail--page {\n  align-items: flex-end;\n  justify-content: center;\n  padding: 12px;\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDetailPanelComponent, [{
        type: Component,
        args: [{ selector: "ids-detail-panel", standalone: true, imports: [IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_DETAIL_PANEL_CONTEXT, useExisting: IdsDetailPanelComponent }], host: {
                    class: "ids-detail-panel",
                    "[style.width.px]": "panelWidth",
                    "[attr.aria-label]": "ariaLabel",
                    role: "complementary",
                }, template: "@if (expanded) {\n  @if (showDatagridHeader) {\n    <header class=\"ids-detail-panel__header\">\n      <h3 class=\"ids-detail-panel__title\">\n        <ng-content select=\"ids-detail-panel-header\" />\n        @if (!hasHeaderSlot) {\n          {{ title }}\n        }\n      </h3>\n      <div class=\"ids-detail-panel__controls\">\n        <button\n          type=\"button\"\n          class=\"ids-detail-panel__toggle\"\n          [attr.aria-label]=\"toggleAriaLabel\"\n          [attr.aria-expanded]=\"expanded\"\n          [attr.aria-controls]=\"bodyId\"\n          (click)=\"onToggleClick()\"\n          (keydown)=\"onToggleKeydown($event)\"\n        >\n          <ids-icon [shapeName]=\"toggleIcon\" [size]=\"16\" className=\"ids-detail-panel__toggle-icon\" />\n        </button>\n      </div>\n    </header>\n  }\n\n  <div [id]=\"bodyId\" class=\"ids-detail-panel__body\">\n    <ng-content select=\"ids-detail-panel-body\" />\n    @if (!hasBodySlot) {\n      <ng-content />\n    }\n  </div>\n\n  @if (showPageFooter) {\n    <footer class=\"ids-detail-panel__footer\">\n      <div class=\"ids-detail-panel__controls\">\n        <button\n          type=\"button\"\n          class=\"ids-detail-panel__toggle\"\n          [attr.aria-label]=\"toggleAriaLabel\"\n          [attr.aria-expanded]=\"expanded\"\n          [attr.aria-controls]=\"bodyId\"\n          (click)=\"onToggleClick()\"\n          (keydown)=\"onToggleKeydown($event)\"\n        >\n          <ids-icon [shapeName]=\"toggleIcon\" [size]=\"16\" className=\"ids-detail-panel__toggle-icon\" />\n        </button>\n      </div>\n    </footer>\n  }\n} @else {\n  <div\n    class=\"ids-detail-panel__collapsed-rail\"\n    [class.ids-detail-panel__collapsed-rail--page]=\"attachMode === 'page'\"\n    [class.ids-detail-panel__collapsed-rail--datagrid]=\"attachMode === 'datagrid'\"\n  >\n    <div class=\"ids-detail-panel__controls\">\n      <button\n        type=\"button\"\n        class=\"ids-detail-panel__toggle\"\n        [attr.aria-label]=\"toggleAriaLabel\"\n        [attr.aria-expanded]=\"expanded\"\n        (click)=\"onToggleClick()\"\n        (keydown)=\"onToggleKeydown($event)\"\n      >\n        <ids-icon [shapeName]=\"toggleIcon\" [size]=\"16\" className=\"ids-detail-panel__toggle-icon\" />\n      </button>\n    </div>\n  </div>\n}\n", styles: [".ids-detail-panel {\n  box-sizing: border-box;\n  height: 100%;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n\n.ids-detail-panel__header,\n.ids-detail-panel__footer {\n  box-sizing: border-box;\n  min-height: 48px;\n  padding: 14px 12px 14px 24px;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__footer {\n  border-bottom: 0;\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  justify-content: flex-end;\n}\n\n.ids-detail-panel__title {\n  margin: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-detail-panel__controls {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.ids-detail-panel__toggle {\n  border: 0;\n  background: transparent;\n  color: var(--color-icon-neutral);\n  padding: 0;\n  width: 16px;\n  height: 16px;\n  cursor: pointer;\n}\n\n.ids-detail-panel__toggle:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-detail-panel__toggle-icon {\n  display: block;\n  filter: brightness(0) saturate(100%) invert(30%) sepia(0%) saturate(0%) hue-rotate(168deg)\n    brightness(95%) contrast(92%);\n}\n\n.ids-detail-panel__body {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n  padding: 24px;\n  box-sizing: border-box;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__collapsed-rail {\n  height: 100%;\n  box-sizing: border-box;\n  display: flex;\n  background: var(--color-background-component);\n}\n\n.ids-detail-panel__collapsed-rail--datagrid {\n  align-items: flex-start;\n  justify-content: flex-end;\n  padding: 16px 12px;\n}\n\n.ids-detail-panel__collapsed-rail--page {\n  align-items: flex-end;\n  justify-content: center;\n  padding: 12px;\n}\n"] }]
    }], null, { headerSlot: [{
            type: ContentChild,
            args: [IdsDetailPanelHeaderComponent]
        }], bodySlot: [{
            type: ContentChild,
            args: [IdsDetailPanelBodyComponent]
        }], attachMode: [{
            type: Input
        }], expanded: [{
            type: Input
        }], title: [{
            type: Input
        }], showHeader: [{
            type: Input
        }], showFooter: [{
            type: Input
        }], ariaLabelExpand: [{
            type: Input
        }], ariaLabelCollapse: [{
            type: Input
        }], collapsedWidth: [{
            type: Input
        }], expandedWidth: [{
            type: Input
        }], expandedChange: [{
            type: Output
        }], opened: [{
            type: Output
        }], closed: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDetailPanelComponent, { className: "IdsDetailPanelComponent", filePath: "src/components/ids-detail-panel/ids-detail-panel.component.ts", lineNumber: 39 }); })();
