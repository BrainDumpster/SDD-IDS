import { Component, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { NgClass } from "@angular/common";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { buildNavigateTarget, buildSelectionDetail, primaryDisplayName, resolvePrimaryId, resolveSecondaryId, secondaryDisplayName, toStateClass, } from "./ids-main-menu-left.utils";
import * as i0 from "@angular/core";
const _c0 = () => [];
const _c1 = (a0, a1, a2, a3) => [a0, a1, a2, a3];
function _forTrack0($index, $item) { return this.resolveItemId($item, $index); }
function _forTrack1($index, $item) { return this.trackSecondary($item, $index); }
function IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 3);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    const ctx_r3 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r3.primaryLabel(item_r2));
} }
function IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-icon", 4);
} if (rf & 2) {
    i0.ɵɵnextContext();
    const showChildren_r5 = i0.ɵɵreadContextLet(2);
    i0.ɵɵproperty("shapeName", showChildren_r5 ? "chev-down-thick" : "chev-right-thick")("size", 14);
} }
function IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_8_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0);
    i0.ɵɵelementStart(1, "button", 7);
    i0.ɵɵlistener("click", function IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_8_For_2_Template_button_click_1_listener() { const child_r7 = i0.ɵɵrestoreView(_r6).$implicit; const childId_r8 = i0.ɵɵreadContextLet(0); i0.ɵɵnextContext(2); const itemId_r3 = i0.ɵɵreadContextLet(0); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onSecondaryClick(itemId_r3, child_r7, childId_r8)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const child_r7 = ctx.$implicit;
    const ɵ$index_25_r9 = ctx.$index;
    i0.ɵɵnextContext(2);
    const itemId_r3 = i0.ɵɵreadContextLet(0);
    const ctx_r3 = i0.ɵɵnextContext();
    const childId_r10 = i0.ɵɵstoreLet(ctx_r3.resolveChildId(child_r7, itemId_r3, ɵ$index_25_r9));
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ids-main-menu-left__secondary-row--selected", ctx_r3.selectedSecondaryParentKey === itemId_r3 && ctx_r3.selectedSecondaryKey === childId_r10);
    i0.ɵɵattribute("title", child_r7.tooltip ?? ctx_r3.secondaryLabel(child_r7));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r3.secondaryLabel(child_r7), " ");
} }
function IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 5);
    i0.ɵɵrepeaterCreate(1, IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_8_For_2_Template, 3, 5, "button", 6, _forTrack1, true);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵnextContext();
    const childList_r11 = i0.ɵɵreadContextLet(1);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(childList_r11);
} }
function IdsMainMenuLeftItemsAdapterComponent_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵdeclareLet(0)(1)(2);
    i0.ɵɵelementStart(3, "div", 0)(4, "button", 1);
    i0.ɵɵlistener("click", function IdsMainMenuLeftItemsAdapterComponent_For_1_Template_button_click_4_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const itemId_r3 = i0.ɵɵreadContextLet(0); const ctx_r3 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r3.onPrimaryClick(item_r2, itemId_r3)); });
    i0.ɵɵelement(5, "ids-icon", 2);
    i0.ɵɵconditionalCreate(6, IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_6_Template, 2, 1, "span", 3);
    i0.ɵɵconditionalCreate(7, IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_7_Template, 1, 2, "ids-icon", 4);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(8, IdsMainMenuLeftItemsAdapterComponent_For_1_Conditional_8_Template, 3, 0, "div", 5);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ɵ$index_1_r12 = ctx.$index;
    const ctx_r3 = i0.ɵɵnextContext();
    const itemId_r13 = i0.ɵɵstoreLet(ctx_r3.resolveItemId(item_r2, ɵ$index_1_r12));
    i0.ɵɵadvance();
    const childList_r14 = i0.ɵɵstoreLet(item_r2.children ?? i0.ɵɵpureFunction0(10, _c0));
    const hasForcedState_r15 = ctx_r3.forceStates && !!item_r2.state;
    i0.ɵɵadvance();
    const showChildren_r16 = i0.ɵɵstoreLet(ctx_r3.railExpanded && childList_r14.length > 0 && (hasForcedState_r15 ? item_r2.childrenMenu === "expanded" : ctx_r3.expandedChildrenKey === itemId_r13));
    const showChevron_r17 = ctx_r3.railExpanded && childList_r14.length > 0;
    const hasSelectedSecondary_r18 = ctx_r3.selectedSecondaryParentKey === itemId_r13;
    const showInset_r19 = hasForcedState_r15 ? item_r2.state === "selected" || item_r2.state === "selected-focus" : childList_r14.length > 0 ? hasSelectedSecondary_r18 : ctx_r3.selectedKey === itemId_r13;
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("ngClass", i0.ɵɵpureFunction4(11, _c1, ctx_r3.stateClass(item_r2, itemId_r13), !hasForcedState_r15 ? "ids-main-menu-left__primary-row--interactive" : "", hasSelectedSecondary_r18 ? "ids-main-menu-left__primary-row--secondary-parent-selected" : "", showInset_r19 ? "ids-main-menu-left__primary-row--selected" : ""));
    i0.ɵɵattribute("title", item_r2.tooltip ?? ctx_r3.primaryLabel(item_r2));
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", item_r2.iconName ?? "home")("size", 16);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r3.railExpanded ? 6 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(showChevron_r17 ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(showChildren_r16 ? 8 : -1);
} }
export class IdsMainMenuLeftItemsAdapterComponent {
    items;
    railExpanded = true;
    forceStates = false;
    selectedKey = null;
    expandedChildrenKey = null;
    selectedSecondaryParentKey = null;
    selectedSecondaryKey = null;
    selectedKeyChange = new EventEmitter();
    expandedChildrenKeyChange = new EventEmitter();
    selectedSecondaryParentKeyChange = new EventEmitter();
    selectedSecondaryKeyChange = new EventEmitter();
    navigate = new EventEmitter();
    selectedChange = new EventEmitter();
    resolveItemId(item, index) {
        return resolvePrimaryId(item, index);
    }
    resolveChildId(child, parentId, index) {
        return resolveSecondaryId(child, parentId, index);
    }
    primaryLabel(item) {
        return primaryDisplayName(item);
    }
    secondaryLabel(child) {
        return secondaryDisplayName(child);
    }
    trackSecondary(child, index) {
        return child.id ?? `child-${index}`;
    }
    stateClass(item, itemId) {
        const hasForcedState = this.forceStates && Boolean(item.state);
        const state = hasForcedState
            ? item.state
            : this.selectedKey === itemId
                ? "selected"
                : "default";
        return `ids-main-menu-left__primary-row--state-${toStateClass(state)}`;
    }
    onPrimaryClick(item, itemId) {
        if (this.forceStates && item.state)
            return;
        const label = primaryDisplayName(item);
        const legacy = { href: item.href, routeRef: item.routeRef };
        const hasChildren = (item.children?.length ?? 0) > 0;
        this.selectedKeyChange.emit(itemId);
        this.navigate.emit(buildNavigateTarget(itemId, label, undefined, item.link, legacy));
        this.selectedChange.emit(buildSelectionDetail("primary", itemId, undefined, label, item.link, legacy));
        if (!hasChildren) {
            this.selectedSecondaryParentKeyChange.emit(null);
            this.selectedSecondaryKeyChange.emit(null);
            return;
        }
        if (!this.railExpanded)
            return;
        if (this.expandedChildrenKey === itemId) {
            this.expandedChildrenKeyChange.emit(null);
            this.selectedSecondaryParentKeyChange.emit(null);
            this.selectedSecondaryKeyChange.emit(null);
        }
        else {
            this.expandedChildrenKeyChange.emit(itemId);
        }
    }
    onSecondaryClick(itemId, child, childId) {
        const label = secondaryDisplayName(child);
        const legacy = { href: child.href, routeRef: child.routeRef };
        this.selectedSecondaryParentKeyChange.emit(itemId);
        this.selectedSecondaryKeyChange.emit(childId);
        this.navigate.emit(buildNavigateTarget(childId, label, itemId, child.link, legacy));
        this.selectedChange.emit(buildSelectionDetail("secondary", childId, itemId, label, child.link, legacy));
    }
    static ɵfac = function IdsMainMenuLeftItemsAdapterComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftItemsAdapterComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftItemsAdapterComponent, selectors: [["ids-main-menu-left-items-adapter"]], inputs: { items: "items", railExpanded: "railExpanded", forceStates: "forceStates", selectedKey: "selectedKey", expandedChildrenKey: "expandedChildrenKey", selectedSecondaryParentKey: "selectedSecondaryParentKey", selectedSecondaryKey: "selectedSecondaryKey" }, outputs: { selectedKeyChange: "selectedKeyChange", expandedChildrenKeyChange: "expandedChildrenKeyChange", selectedSecondaryParentKeyChange: "selectedSecondaryParentKeyChange", selectedSecondaryKeyChange: "selectedSecondaryKeyChange", navigate: "navigate", selectedChange: "selectedChange" }, decls: 2, vars: 0, consts: [[1, "ids-main-menu-left__item-block"], ["type", "button", 1, "ids-main-menu-left__primary-row", 3, "click", "ngClass"], ["className", "ids-main-menu-left__primary-icon", "variant", "mask", 3, "shapeName", "size"], [1, "ids-main-menu-left__primary-label"], ["className", "ids-main-menu-left__chevron-icon", "variant", "mask", 3, "shapeName", "size"], [1, "ids-main-menu-left__secondary-section"], ["type", "button", 1, "ids-main-menu-left__secondary-row", "ids-main-menu-left__secondary-row--interactive", 3, "ids-main-menu-left__secondary-row--selected"], ["type", "button", 1, "ids-main-menu-left__secondary-row", "ids-main-menu-left__secondary-row--interactive", 3, "click"]], template: function IdsMainMenuLeftItemsAdapterComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵrepeaterCreate(0, IdsMainMenuLeftItemsAdapterComponent_For_1_Template, 9, 16, "div", 0, _forTrack0, true);
        } if (rf & 2) {
            i0.ɵɵrepeater(ctx.items);
        } }, dependencies: [NgClass, IdsIconComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftItemsAdapterComponent, [{
        type: Component,
        args: [{ selector: "ids-main-menu-left-items-adapter", standalone: true, imports: [NgClass, IdsIconComponent], encapsulation: ViewEncapsulation.None, template: "@for (item of items; track resolveItemId(item, $index); let itemIndex = $index) {\n  @let itemId = resolveItemId(item, itemIndex);\n  @let childList = item.children ?? [];\n  @let hasForcedState = forceStates && !!item.state;\n  @let showChildren =\n    railExpanded &&\n    childList.length > 0 &&\n    (hasForcedState ? item.childrenMenu === \"expanded\" : expandedChildrenKey === itemId);\n  @let showChevron = railExpanded && childList.length > 0;\n  @let hasSelectedSecondary = selectedSecondaryParentKey === itemId;\n  @let showInset =\n    hasForcedState\n      ? item.state === \"selected\" || item.state === \"selected-focus\"\n      : childList.length > 0\n        ? hasSelectedSecondary\n        : selectedKey === itemId;\n\n  <div class=\"ids-main-menu-left__item-block\">\n    <button\n      type=\"button\"\n      class=\"ids-main-menu-left__primary-row\"\n      [ngClass]=\"[\n        stateClass(item, itemId),\n        !hasForcedState ? 'ids-main-menu-left__primary-row--interactive' : '',\n        hasSelectedSecondary ? 'ids-main-menu-left__primary-row--secondary-parent-selected' : '',\n        showInset ? 'ids-main-menu-left__primary-row--selected' : '',\n      ]\"\n      [attr.title]=\"item.tooltip ?? primaryLabel(item)\"\n      (click)=\"onPrimaryClick(item, itemId)\"\n    >\n      <ids-icon\n        className=\"ids-main-menu-left__primary-icon\"\n        [shapeName]=\"item.iconName ?? 'home'\"\n        variant=\"mask\"\n        [size]=\"16\"\n      />\n      @if (railExpanded) {\n        <span class=\"ids-main-menu-left__primary-label\">{{ primaryLabel(item) }}</span>\n      }\n      @if (showChevron) {\n        <ids-icon\n          className=\"ids-main-menu-left__chevron-icon\"\n          [shapeName]=\"showChildren ? 'chev-down-thick' : 'chev-right-thick'\"\n          variant=\"mask\"\n          [size]=\"14\"\n        />\n      }\n    </button>\n\n    @if (showChildren) {\n      <div class=\"ids-main-menu-left__secondary-section\">\n        @for (child of childList; track trackSecondary(child, $index); let childIndex = $index) {\n          @let childId = resolveChildId(child, itemId, childIndex);\n          <button\n            type=\"button\"\n            class=\"ids-main-menu-left__secondary-row ids-main-menu-left__secondary-row--interactive\"\n            [class.ids-main-menu-left__secondary-row--selected]=\"\n              selectedSecondaryParentKey === itemId && selectedSecondaryKey === childId\n            \"\n            [attr.title]=\"child.tooltip ?? secondaryLabel(child)\"\n            (click)=\"onSecondaryClick(itemId, child, childId)\"\n          >\n            {{ secondaryLabel(child) }}\n          </button>\n        }\n      </div>\n    }\n  </div>\n}\n" }]
    }], null, { items: [{
            type: Input,
            args: [{ required: true }]
        }], railExpanded: [{
            type: Input
        }], forceStates: [{
            type: Input
        }], selectedKey: [{
            type: Input
        }], expandedChildrenKey: [{
            type: Input
        }], selectedSecondaryParentKey: [{
            type: Input
        }], selectedSecondaryKey: [{
            type: Input
        }], selectedKeyChange: [{
            type: Output
        }], expandedChildrenKeyChange: [{
            type: Output
        }], selectedSecondaryParentKeyChange: [{
            type: Output
        }], selectedSecondaryKeyChange: [{
            type: Output
        }], navigate: [{
            type: Output
        }], selectedChange: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftItemsAdapterComponent, { className: "IdsMainMenuLeftItemsAdapterComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left-items-adapter.component.ts", lineNumber: 31 }); })();
