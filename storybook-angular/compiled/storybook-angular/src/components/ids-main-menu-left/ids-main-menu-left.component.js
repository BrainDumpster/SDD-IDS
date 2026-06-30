import { Component, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/main-menu-left.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_MAIN_MENU_LEFT_CONTEXT, } from "./ids-main-menu-left-context";
import { IdsMainMenuLeftItemsAdapterComponent } from "./ids-main-menu-left-items-adapter.component";
import { buildNavigateTarget, buildSelectionDetail, resolveInitialSelectedKey, toStateClass, } from "./ids-main-menu-left.utils";
import * as i0 from "@angular/core";
const _c0 = ["*"];
function IdsMainMenuLeftComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-main-menu-left-items-adapter", 6);
    i0.ɵɵlistener("selectedKeyChange", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_selectedKeyChange_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectedKey = $event); })("expandedChildrenKeyChange", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_expandedChildrenKeyChange_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.expandedGroupId = $event); })("selectedSecondaryParentKeyChange", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_selectedSecondaryParentKeyChange_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectedSecondaryParentKey = $event); })("selectedSecondaryKeyChange", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_selectedSecondaryKeyChange_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectedSecondaryKey = $event); })("navigate", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_navigate_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.navigate.emit($event)); })("selectedChange", function IdsMainMenuLeftComponent_Conditional_3_Template_ids_main_menu_left_items_adapter_selectedChange_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectedChange.emit($event)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("items", ctx_r1.legacyItems)("railExpanded", ctx_r1.railExpanded)("forceStates", ctx_r1.forceStates)("selectedKey", ctx_r1.selectedKey)("expandedChildrenKey", ctx_r1.expandedGroupId)("selectedSecondaryParentKey", ctx_r1.selectedSecondaryParentKey)("selectedSecondaryKey", ctx_r1.selectedSecondaryKey);
} }
export class IdsMainMenuLeftComponent {
    items = null;
    expanded = MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.expanded;
    defaultSelectedItemId = MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.defaultSelectedItemId;
    forceStates = false;
    ariaLabel = MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.ariaLabel;
    /** When true, projected composition children render instead of `items[]`. */
    compositionMode = false;
    expandedChange = new EventEmitter();
    selectedChange = new EventEmitter();
    navigate = new EventEmitter();
    internalExpanded = true;
    groups = new Map();
    selectedKey = null;
    expandedGroupId = null;
    selectedSecondaryParentKey = null;
    selectedSecondaryKey = null;
    ngOnChanges(changes) {
        if (changes["expanded"]) {
            this.internalExpanded = this.expanded;
        }
        if (changes["items"] || changes["defaultSelectedItemId"]) {
            this.selectedKey = resolveInitialSelectedKey(this.items ?? [], this.defaultSelectedItemId ?? undefined);
        }
    }
    ngOnInit() {
        this.internalExpanded = this.expanded;
        this.selectedKey = resolveInitialSelectedKey(this.items ?? [], this.defaultSelectedItemId ?? undefined);
    }
    get railExpanded() {
        return this.internalExpanded;
    }
    get useComposition() {
        return this.compositionMode || this.items == null;
    }
    get legacyItems() {
        return this.items ?? [...MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS.items];
    }
    registerGroup(registration) {
        this.groups.set(registration.groupId, registration);
    }
    unregisterGroup(groupId) {
        this.groups.delete(groupId);
    }
    isGroupExpanded(groupId) {
        const meta = this.groups.get(groupId);
        if (!meta)
            return false;
        if (meta.childrenMenuPinned)
            return meta.defaultExpanded;
        return this.expandedGroupId === groupId;
    }
    groupHasChildren(_groupId) {
        return true;
    }
    toggleGroup(groupId) {
        if (!this.railExpanded)
            return;
        if (this.expandedGroupId === groupId) {
            this.expandedGroupId = null;
            this.selectedSecondaryParentKey = null;
            this.selectedSecondaryKey = null;
        }
        else {
            this.expandedGroupId = groupId;
        }
    }
    getPrimaryState(itemId, forced) {
        if (this.forceStates && forced)
            return forced;
        return this.selectedKey === itemId ? "selected" : "default";
    }
    isPrimarySelected(itemId, forced) {
        const state = this.getPrimaryState(itemId, forced);
        return state === "selected" || state === "selected-focus";
    }
    isPrimaryFocused(itemId, forced) {
        const state = this.getPrimaryState(itemId, forced);
        return state === "default-focus" || state === "selected-focus";
    }
    showPrimaryInset(itemId, groupId, forced) {
        const state = this.getPrimaryState(itemId, forced);
        const hasForced = this.forceStates && Boolean(forced);
        const hasSelectedSecondary = groupId
            ? this.selectedSecondaryParentKey === groupId
            : false;
        if (hasForced)
            return state === "selected" || state === "selected-focus";
        if (groupId)
            return hasSelectedSecondary;
        return this.selectedKey === itemId;
    }
    hasSelectedSecondaryInGroup(groupId) {
        return this.selectedSecondaryParentKey === groupId;
    }
    primaryAriaCurrent(itemId, groupId, forced) {
        const isSelected = this.isPrimarySelected(itemId, forced);
        const hasSelectedSecondary = groupId ? this.hasSelectedSecondaryInGroup(groupId) : false;
        return isSelected && !(groupId && hasSelectedSecondary) ? "page" : null;
    }
    isSecondarySelected(itemId, parentGroupId) {
        return (this.selectedSecondaryParentKey === parentGroupId &&
            this.selectedSecondaryKey === itemId);
    }
    onPrimaryActivate(itemId, label, groupId) {
        if (this.forceStates)
            return;
        this.selectedKey = itemId;
        this.navigate.emit(buildNavigateTarget(itemId, label, undefined, undefined, {}));
        this.selectedChange.emit(buildSelectionDetail("primary", itemId, undefined, label, undefined, {}));
        if (!groupId) {
            this.selectedSecondaryParentKey = null;
            this.selectedSecondaryKey = null;
        }
    }
    onSecondaryActivate(itemId, parentGroupId, label) {
        this.selectedSecondaryParentKey = parentGroupId;
        this.selectedSecondaryKey = itemId;
        this.navigate.emit(buildNavigateTarget(itemId, label, parentGroupId, undefined, {}));
        this.selectedChange.emit(buildSelectionDetail("secondary", itemId, parentGroupId, label, undefined, {}));
    }
    showChevronForGroup(groupId) {
        return this.groups.has(groupId) && this.railExpanded;
    }
    isGroupChildrenVisible(groupId) {
        return this.railExpanded && this.isGroupExpanded(groupId);
    }
    primaryAriaExpanded(groupId) {
        return this.groups.has(groupId) && this.railExpanded
            ? this.isGroupExpanded(groupId)
            : null;
    }
    stateClass(itemId, forced) {
        return `ids-main-menu-left__primary-row--state-${toStateClass(this.getPrimaryState(itemId, forced))}`;
    }
    onToggleExpanded() {
        this.internalExpanded = !this.internalExpanded;
        this.expandedChange.emit(this.internalExpanded);
        this.expandedGroupId = null;
    }
    static ɵfac = function IdsMainMenuLeftComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsMainMenuLeftComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsMainMenuLeftComponent, selectors: [["ids-main-menu-left"]], hostAttrs: [1, "ids-main-menu-left-host"], inputs: { items: "items", expanded: "expanded", defaultSelectedItemId: "defaultSelectedItemId", forceStates: "forceStates", ariaLabel: "ariaLabel", compositionMode: "compositionMode" }, outputs: { expandedChange: "expandedChange", selectedChange: "selectedChange", navigate: "navigate" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_MAIN_MENU_LEFT_CONTEXT, useExisting: IdsMainMenuLeftComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c0, decls: 7, vars: 9, consts: [[1, "ids-main-menu-left"], [1, "ids-main-menu-left__content"], [3, "items", "railExpanded", "forceStates", "selectedKey", "expandedChildrenKey", "selectedSecondaryParentKey", "selectedSecondaryKey"], [1, "ids-main-menu-left__bottom-toggle"], ["type", "button", 1, "ids-main-menu-left__bottom-toggle-button", 3, "click"], ["className", "ids-main-menu-left__bottom-toggle-icon", "variant", "mask", 3, "shapeName", "size"], [3, "selectedKeyChange", "expandedChildrenKeyChange", "selectedSecondaryParentKeyChange", "selectedSecondaryKeyChange", "navigate", "selectedChange", "items", "railExpanded", "forceStates", "selectedKey", "expandedChildrenKey", "selectedSecondaryParentKey", "selectedSecondaryKey"]], template: function IdsMainMenuLeftComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "nav", 0)(1, "div", 1);
            i0.ɵɵprojection(2);
            i0.ɵɵconditionalCreate(3, IdsMainMenuLeftComponent_Conditional_3_Template, 1, 7, "ids-main-menu-left-items-adapter", 2);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3)(5, "button", 4);
            i0.ɵɵlistener("click", function IdsMainMenuLeftComponent_Template_button_click_5_listener() { return ctx.onToggleExpanded(); });
            i0.ɵɵelement(6, "ids-icon", 5);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-main-menu-left--expanded", ctx.railExpanded)("ids-main-menu-left--collapsed", !ctx.railExpanded);
            i0.ɵɵattribute("aria-label", ctx.ariaLabel);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(!ctx.useComposition ? 3 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵattribute("aria-label", ctx.railExpanded ? "Collapse navigation" : "Expand navigation");
            i0.ɵɵadvance();
            i0.ɵɵproperty("shapeName", ctx.railExpanded ? "double-chev-left" : "double-chev-right")("size", 16);
        } }, dependencies: [IdsIconComponent, IdsMainMenuLeftItemsAdapterComponent], styles: ["/* Ported from storybook/src/components/MainMenuLeft.module.css (IDS rail) */\n\n.ids-main-menu-left {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  background: var(--color-background-component);\n  background-image:\n    linear-gradient(\n      180deg,\n      var(--color-background-gradient-left-nav-start, #ffffff) 0%,\n      var(--color-background-gradient-left-nav-end, #ffffff) 100%\n    ),\n    linear-gradient(90deg, var(--color-background-component) 0%, var(--color-background-component) 100%);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-top: none;\n  box-sizing: border-box;\n}\n\n.ids-main-menu-left--expanded {\n  width: 278px;\n  min-width: 278px;\n  max-width: 278px;\n}\n\n.ids-main-menu-left--collapsed {\n  width: 64px;\n  min-width: 64px;\n  max-width: 64px;\n}\n\n.ids-main-menu-left__logo-slot {\n  flex-shrink: 0;\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-24) 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__logo-slot {\n  justify-content: center;\n  padding-left: var(--padding-padding-24);\n  padding-right: var(--padding-padding-24);\n}\n\n.ids-main-menu-left__logo-button,\n.ids-main-menu-left__logo-static {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  line-height: 0;\n  cursor: default;\n}\n\n.ids-main-menu-left__logo-button {\n  cursor: pointer;\n}\n\n.ids-main-menu-left__logo-img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\n.ids-main-menu-left__logo-icon {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  box-sizing: border-box;\n  background-color: currentColor;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__composition-host {\n  display: contents;\n}\n\nids-main-menu-left-item,\nids-main-menu-left-group,\nids-main-menu-left-children,\nids-main-menu-left-logo {\n  display: block;\n}\n\nids-main-menu-left-item-icon {\n  display: inline-block;\n}\n\n.ids-main-menu-left__content {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-8);\n}\n\n.ids-main-menu-left__item-block {\n  width: 100%;\n  flex-shrink: 0;\n}\n\n.ids-main-menu-left__primary-row {\n  position: relative;\n  width: 100%;\n  min-height: 40px;\n  padding: var(--padding-padding-8) var(--padding-padding-24);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n  border: none;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n}\n\n.ids-main-menu-left__primary-icon {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  display: inline-block;\n  background-color: currentColor;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__primary-label {\n  flex: 1;\n  min-width: 0;\n  font-size: var(--font-size-body-1);\n  font-weight: 500;\n  line-height: var(--font-line-height-line-height-24);\n  color: var(--color-text-neutral-strong);\n  white-space: nowrap;\n}\n\n.ids-main-menu-left__link-host {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.ids-main-menu-left__link-host > a,\n.ids-main-menu-left__link-host > [routerlink],\n.ids-main-menu-left__secondary-row .ids-main-menu-left__link-host > a {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n  flex: 1 1 auto;\n  min-width: 0;\n  width: 100%;\n  color: inherit;\n  text-decoration: none;\n  font-size: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  background: transparent;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__link-host .ids-main-menu-left__primary-label {\n  display: none;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__link-host {\n  justify-content: center;\n}\n\n.ids-main-menu-left__chevron-icon {\n  width: 14px;\n  height: 14px;\n  display: inline-block;\n  background-color: currentColor;\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left__secondary-section {\n  width: 100%;\n}\n\n.ids-main-menu-left__secondary-section--hidden {\n  display: none;\n}\n\n.ids-main-menu-left__secondary-row {\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n  height: 32px;\n  border: none;\n  background: transparent;\n  text-align: left;\n  padding: var(--padding-padding-6, 6px) var(--padding-padding-58, 58px);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n}\n\n.ids-main-menu-left__secondary-row--selected {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  font-weight: 500;\n}\n\n.ids-main-menu-left__secondary-row--interactive:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__secondary-row--interactive:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:active {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__secondary-row--interactive:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: -1px;\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:focus-visible {\n  box-shadow: inset 4px 0 0 0 var(--color-border-brand-dark);\n}\n\n.ids-main-menu-left__bottom-toggle {\n  box-sizing: border-box;\n  height: 49px;\n  min-height: 49px;\n  max-height: 49px;\n  flex-shrink: 0;\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  padding: var(--padding-padding-16) var(--padding-padding-24);\n  display: flex;\n  align-items: center;\n}\n\n.ids-main-menu-left__bottom-toggle-button {\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 0;\n  font: inherit;\n  cursor: pointer;\n  appearance: none;\n  -webkit-appearance: none;\n}\n\n.ids-main-menu-left__bottom-toggle-icon {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n  flex-shrink: 0;\n  display: inline-block;\n  box-sizing: border-box;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__focus-ring {\n  position: absolute;\n  inset: 0;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n.ids-main-menu-left__selected-inset {\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: var(--color-border-brand-dark);\n}\n\n.ids-main-menu-left__primary-row--state-Default,\n.ids-main-menu-left__primary-row--state-DefaultFocus {\n  background: transparent;\n}\n\n.ids-main-menu-left__primary-row--state-Hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--state-Press {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__primary-row--state-Press .ids-main-menu-left__primary-label,\n.ids-main-menu-left__primary-row--state-Selected .ids-main-menu-left__primary-label,\n.ids-main-menu-left__primary-row--state-SelectedFocus .ids-main-menu-left__primary-label {\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__primary-row--state-Press .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left__primary-row--state-Selected,\n.ids-main-menu-left__primary-row--state-SelectedFocus {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--state-Selected .ids-main-menu-left__primary-icon,\n.ids-main-menu-left__primary-row--state-SelectedFocus .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-base, #0076ce);\n}\n\n.ids-main-menu-left__primary-row--secondary-parent-selected .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-base, #0076ce);\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__primary-row {\n  justify-content: center;\n  padding: var(--padding-padding-12) var(--padding-padding-24);\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__chevron-icon {\n  display: none;\n}\n\n.ids-main-menu-left__primary-row--interactive:hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--interactive:active {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__primary-row--interactive:active .ids-main-menu-left__primary-label {\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__primary-row--interactive:active .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left-host {\n  display: contents;\n}\n"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsMainMenuLeftComponent, [{
        type: Component,
        args: [{ selector: "ids-main-menu-left", standalone: true, imports: [IdsIconComponent, IdsMainMenuLeftItemsAdapterComponent], encapsulation: ViewEncapsulation.None, host: { class: "ids-main-menu-left-host" }, providers: [{ provide: IDS_MAIN_MENU_LEFT_CONTEXT, useExisting: IdsMainMenuLeftComponent }], template: "<nav\n  class=\"ids-main-menu-left\"\n  [class.ids-main-menu-left--expanded]=\"railExpanded\"\n  [class.ids-main-menu-left--collapsed]=\"!railExpanded\"\n  [attr.aria-label]=\"ariaLabel\"\n>\n  <div class=\"ids-main-menu-left__content\">\n    <ng-content />\n    @if (!useComposition) {\n      <ids-main-menu-left-items-adapter\n        [items]=\"legacyItems\"\n        [railExpanded]=\"railExpanded\"\n        [forceStates]=\"forceStates\"\n        [selectedKey]=\"selectedKey\"\n        [expandedChildrenKey]=\"expandedGroupId\"\n        [selectedSecondaryParentKey]=\"selectedSecondaryParentKey\"\n        [selectedSecondaryKey]=\"selectedSecondaryKey\"\n        (selectedKeyChange)=\"selectedKey = $event\"\n        (expandedChildrenKeyChange)=\"expandedGroupId = $event\"\n        (selectedSecondaryParentKeyChange)=\"selectedSecondaryParentKey = $event\"\n        (selectedSecondaryKeyChange)=\"selectedSecondaryKey = $event\"\n        (navigate)=\"navigate.emit($event)\"\n        (selectedChange)=\"selectedChange.emit($event)\"\n      />\n    }\n  </div>\n\n  <div class=\"ids-main-menu-left__bottom-toggle\">\n    <button\n      type=\"button\"\n      class=\"ids-main-menu-left__bottom-toggle-button\"\n      [attr.aria-label]=\"railExpanded ? 'Collapse navigation' : 'Expand navigation'\"\n      (click)=\"onToggleExpanded()\"\n    >\n      <ids-icon\n        className=\"ids-main-menu-left__bottom-toggle-icon\"\n        [shapeName]=\"railExpanded ? 'double-chev-left' : 'double-chev-right'\"\n        variant=\"mask\"\n        [size]=\"16\"\n      />\n    </button>\n  </div>\n</nav>\n", styles: ["/* Ported from storybook/src/components/MainMenuLeft.module.css (IDS rail) */\n\n.ids-main-menu-left {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  min-height: 0;\n  background: var(--color-background-component);\n  background-image:\n    linear-gradient(\n      180deg,\n      var(--color-background-gradient-left-nav-start, #ffffff) 0%,\n      var(--color-background-gradient-left-nav-end, #ffffff) 100%\n    ),\n    linear-gradient(90deg, var(--color-background-component) 0%, var(--color-background-component) 100%);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-top: none;\n  box-sizing: border-box;\n}\n\n.ids-main-menu-left--expanded {\n  width: 278px;\n  min-width: 278px;\n  max-width: 278px;\n}\n\n.ids-main-menu-left--collapsed {\n  width: 64px;\n  min-width: 64px;\n  max-width: 64px;\n}\n\n.ids-main-menu-left__logo-slot {\n  flex-shrink: 0;\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-24) 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__logo-slot {\n  justify-content: center;\n  padding-left: var(--padding-padding-24);\n  padding-right: var(--padding-padding-24);\n}\n\n.ids-main-menu-left__logo-button,\n.ids-main-menu-left__logo-static {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  line-height: 0;\n  cursor: default;\n}\n\n.ids-main-menu-left__logo-button {\n  cursor: pointer;\n}\n\n.ids-main-menu-left__logo-img {\n  display: block;\n  max-width: 100%;\n  height: auto;\n}\n\n.ids-main-menu-left__logo-icon {\n  width: 24px;\n  height: 24px;\n  display: inline-block;\n  box-sizing: border-box;\n  background-color: currentColor;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__composition-host {\n  display: contents;\n}\n\nids-main-menu-left-item,\nids-main-menu-left-group,\nids-main-menu-left-children,\nids-main-menu-left-logo {\n  display: block;\n}\n\nids-main-menu-left-item-icon {\n  display: inline-block;\n}\n\n.ids-main-menu-left__content {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-8);\n}\n\n.ids-main-menu-left__item-block {\n  width: 100%;\n  flex-shrink: 0;\n}\n\n.ids-main-menu-left__primary-row {\n  position: relative;\n  width: 100%;\n  min-height: 40px;\n  padding: var(--padding-padding-8) var(--padding-padding-24);\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n  border: none;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n}\n\n.ids-main-menu-left__primary-icon {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  display: inline-block;\n  background-color: currentColor;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__primary-label {\n  flex: 1;\n  min-width: 0;\n  font-size: var(--font-size-body-1);\n  font-weight: 500;\n  line-height: var(--font-line-height-line-height-24);\n  color: var(--color-text-neutral-strong);\n  white-space: nowrap;\n}\n\n.ids-main-menu-left__link-host {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n\n.ids-main-menu-left__link-host > a,\n.ids-main-menu-left__link-host > [routerlink],\n.ids-main-menu-left__secondary-row .ids-main-menu-left__link-host > a {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n  flex: 1 1 auto;\n  min-width: 0;\n  width: 100%;\n  color: inherit;\n  text-decoration: none;\n  font-size: inherit;\n  font-weight: inherit;\n  line-height: inherit;\n  background: transparent;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  box-sizing: border-box;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__link-host .ids-main-menu-left__primary-label {\n  display: none;\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__link-host {\n  justify-content: center;\n}\n\n.ids-main-menu-left__chevron-icon {\n  width: 14px;\n  height: 14px;\n  display: inline-block;\n  background-color: currentColor;\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left__secondary-section {\n  width: 100%;\n}\n\n.ids-main-menu-left__secondary-section--hidden {\n  display: none;\n}\n\n.ids-main-menu-left__secondary-row {\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n  height: 32px;\n  border: none;\n  background: transparent;\n  text-align: left;\n  padding: var(--padding-padding-6, 6px) var(--padding-padding-58, 58px);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n}\n\n.ids-main-menu-left__secondary-row--selected {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  font-weight: 500;\n}\n\n.ids-main-menu-left__secondary-row--interactive:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__secondary-row--interactive:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:active {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__secondary-row--interactive:focus-visible {\n  outline: var(--border-width-border-1) solid var(--color-border-brand-base);\n  outline-offset: -1px;\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-main-menu-left__secondary-row--interactive.ids-main-menu-left__secondary-row--selected:focus-visible {\n  box-shadow: inset 4px 0 0 0 var(--color-border-brand-dark);\n}\n\n.ids-main-menu-left__bottom-toggle {\n  box-sizing: border-box;\n  height: 49px;\n  min-height: 49px;\n  max-height: 49px;\n  flex-shrink: 0;\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  padding: var(--padding-padding-16) var(--padding-padding-24);\n  display: flex;\n  align-items: center;\n}\n\n.ids-main-menu-left__bottom-toggle-button {\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  background: transparent;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 0;\n  font: inherit;\n  cursor: pointer;\n  appearance: none;\n  -webkit-appearance: none;\n}\n\n.ids-main-menu-left__bottom-toggle-icon {\n  width: 16px;\n  height: 16px;\n  min-width: 16px;\n  min-height: 16px;\n  flex-shrink: 0;\n  display: inline-block;\n  box-sizing: border-box;\n  color: var(--color-icon-neutral-strong, #252525);\n}\n\n.ids-main-menu-left__focus-ring {\n  position: absolute;\n  inset: 0;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n  pointer-events: none;\n}\n\n.ids-main-menu-left__selected-inset {\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: var(--color-border-brand-dark);\n}\n\n.ids-main-menu-left__primary-row--state-Default,\n.ids-main-menu-left__primary-row--state-DefaultFocus {\n  background: transparent;\n}\n\n.ids-main-menu-left__primary-row--state-Hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--state-Press {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__primary-row--state-Press .ids-main-menu-left__primary-label,\n.ids-main-menu-left__primary-row--state-Selected .ids-main-menu-left__primary-label,\n.ids-main-menu-left__primary-row--state-SelectedFocus .ids-main-menu-left__primary-label {\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__primary-row--state-Press .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left__primary-row--state-Selected,\n.ids-main-menu-left__primary-row--state-SelectedFocus {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--state-Selected .ids-main-menu-left__primary-icon,\n.ids-main-menu-left__primary-row--state-SelectedFocus .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-base, #0076ce);\n}\n\n.ids-main-menu-left__primary-row--secondary-parent-selected .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-base, #0076ce);\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__primary-row {\n  justify-content: center;\n  padding: var(--padding-padding-12) var(--padding-padding-24);\n}\n\n.ids-main-menu-left--collapsed .ids-main-menu-left__chevron-icon {\n  display: none;\n}\n\n.ids-main-menu-left__primary-row--interactive:hover {\n  background: var(--color-background-brand-lighter);\n}\n\n.ids-main-menu-left__primary-row--interactive:active {\n  background: var(--color-background-brand-light);\n}\n\n.ids-main-menu-left__primary-row--interactive:active .ids-main-menu-left__primary-label {\n  color: var(--color-text-brand-strong);\n}\n\n.ids-main-menu-left__primary-row--interactive:active .ids-main-menu-left__primary-icon {\n  color: var(--color-icon-brand-strong, #0062ab);\n}\n\n.ids-main-menu-left-host {\n  display: contents;\n}\n"] }]
    }], null, { items: [{
            type: Input
        }], expanded: [{
            type: Input
        }], defaultSelectedItemId: [{
            type: Input
        }], forceStates: [{
            type: Input
        }], ariaLabel: [{
            type: Input
        }], compositionMode: [{
            type: Input
        }], expandedChange: [{
            type: Output
        }], selectedChange: [{
            type: Output
        }], navigate: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsMainMenuLeftComponent, { className: "IdsMainMenuLeftComponent", filePath: "src/components/ids-main-menu-left/ids-main-menu-left.component.ts", lineNumber: 41 }); })();
