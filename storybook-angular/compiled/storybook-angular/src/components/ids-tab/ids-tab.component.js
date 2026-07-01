import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TAB_API_DEFAULTS, TAB_SPEC_ACCURATE_DEFAULTS, computeTabOverflowMenuItems, computeTabOverflowVisibleCount, } from "../../../../component-contracts/ids/tab.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_TAB_CONTEXT } from "./ids-tab-context";
import { IdsTabItemComponent } from "./ids-tab-item.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = ["listWrapRef"];
const _c1 = ["*"];
const _forTrack0 = ($index, $item) => $item.itemId;
function IdsTabComponent_For_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 10);
    i0.ɵɵelement(1, "ids-icon", 13);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", item_r2.iconSlug)("size", 16);
} }
function IdsTabComponent_For_5_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 12);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r2.badgeCount);
} }
function IdsTabComponent_For_5_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 8);
    i0.ɵɵlistener("click", function IdsTabComponent_For_5_Template_button_click_0_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.selectVisible(item_r2)); })("keydown", function IdsTabComponent_For_5_Template_button_keydown_0_listener($event) { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onTabKeydown($event, item_r2)); })("focus", function IdsTabComponent_For_5_Template_button_focus_0_listener() { const item_r2 = i0.ɵɵrestoreView(_r1).$implicit; const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onTabFocus(item_r2)); });
    i0.ɵɵelementStart(1, "span", 9);
    i0.ɵɵconditionalCreate(2, IdsTabComponent_For_5_Conditional_2_Template, 2, 2, "span", 10);
    i0.ɵɵelementStart(3, "span", 11);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, IdsTabComponent_For_5_Conditional_5_Template, 2, 1, "span", 12);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("min-width", ctx_r2.minTabWidth, "px")("max-width", ctx_r2.maxTabWidth, "px");
    i0.ɵɵclassProp("ids-tab__tab--primary", ctx_r2.resolvedType === "primary")("ids-tab__tab--secondary", ctx_r2.resolvedType === "secondary")("ids-tab__tab--selected", ctx_r2.isActive(item_r2));
    i0.ɵɵproperty("id", ctx_r2.tabId(item_r2))("disabled", item_r2.disabled)("tabIndex", ctx_r2.tabTabIndex(item_r2));
    i0.ɵɵattribute("data-disabled", item_r2.disabled ? true : null)("data-simulated-state", item_r2.simulatedState ?? null)("aria-controls", ctx_r2.panelId(item_r2))("aria-selected", ctx_r2.isActive(item_r2));
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r2.iconSlug ? 2 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.label);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r2.badgeCount !== undefined && item_r2.badgeCount > 0 ? 5 : -1);
} }
function IdsTabComponent_Conditional_6_Conditional_4_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function IdsTabComponent_Conditional_6_Conditional_4_For_2_Template_button_click_0_listener($event) { const item_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r2 = i0.ɵɵnextContext(3); ctx_r2.selectHidden(item_r6); return i0.ɵɵresetView($event.stopPropagation()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r6 = ctx.$implicit;
    i0.ɵɵproperty("disabled", item_r6.disabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r6.label, " ");
} }
function IdsTabComponent_Conditional_6_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵrepeaterCreate(1, IdsTabComponent_Conditional_6_Conditional_4_For_2_Template, 2, 2, "button", 17, _forTrack0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r2.overflowMenuItems);
} }
function IdsTabComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "button", 14);
    i0.ɵɵlistener("click", function IdsTabComponent_Conditional_6_Template_button_click_1_listener($event) { i0.ɵɵrestoreView(_r4); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.toggleOverflowMenu($event)); });
    i0.ɵɵtext(2);
    i0.ɵɵelement(3, "ids-icon", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(4, IdsTabComponent_Conditional_6_Conditional_4_Template, 3, 0, "div", 16);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ids-tab__more-trigger--primary", ctx_r2.resolvedType === "primary")("ids-tab__more-trigger--secondary", ctx_r2.resolvedType === "secondary")("ids-tab__more-trigger--selected", ctx_r2.overflowTriggerSelected);
    i0.ɵɵattribute("aria-expanded", ctx_r2.overflowOpen)("aria-haspopup", true);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r2.overflowLabel ?? ctx_r2.moreLabel, " ");
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r2.moreIconSlug)("size", 12);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r2.overflowOpen && ctx_r2.overflowMenuItems.length > 0 ? 4 : -1);
} }
function IdsTabComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 19);
    i0.ɵɵlistener("click", function IdsTabComponent_Conditional_7_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r2 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r2.onAddTabClick()); });
    i0.ɵɵelement(1, "ids-icon", 20);
    i0.ɵɵelementStart(2, "span", 21);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("ids-tab__add--primary", ctx_r2.resolvedType === "primary")("ids-tab__add--secondary", ctx_r2.resolvedType === "secondary");
    i0.ɵɵattribute("aria-label", ctx_r2.addTabLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r2.addIconSlug)("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r2.addTabLabel);
} }
function IdsTabComponent_Conditional_8_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function IdsTabComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 7);
    i0.ɵɵtemplate(1, IdsTabComponent_Conditional_8_ng_container_1_Template, 1, 0, "ng-container", 22);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r8 = ctx;
    const ctx_r2 = i0.ɵɵnextContext();
    i0.ɵɵproperty("id", ctx_r2.panelId(item_r8));
    i0.ɵɵattribute("aria-labelledby", ctx_r2.tabId(item_r8));
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngTemplateOutlet", item_r8.panelTpl);
} }
export class IdsTabComponent {
    cdr;
    addIconSlug = "state-add-circ-solid";
    moreIconSlug = "arrow-tri-down-solid";
    itemQuery;
    listWrapRef;
    type = TAB_SPEC_ACCURATE_DEFAULTS.type;
    /** Backward-compatible alias of `type`; `type` wins when both are set. */
    variant;
    surface = TAB_SPEC_ACCURATE_DEFAULTS.surface;
    activeItemId;
    defaultActiveItemId = TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId;
    allowAddTab = TAB_API_DEFAULTS.allowAddTab;
    addTabLabel = TAB_API_DEFAULTS.addTabLabel;
    moreLabel = TAB_API_DEFAULTS.moreLabel;
    overflow = TAB_API_DEFAULTS.overflow;
    minTabWidth = TAB_API_DEFAULTS.minTabWidth;
    maxTabWidth = TAB_API_DEFAULTS.maxTabWidth;
    activeItemChange = new EventEmitter();
    tabSelect = new EventEmitter();
    addTab = new EventEmitter();
    overflowSelection = new EventEmitter();
    visibleCount = 0;
    overflowOpen = false;
    overflowLabel = null;
    items = [];
    internalActiveId = TAB_SPEC_ACCURATE_DEFAULTS.defaultActiveItemId;
    focusedIndex = 0;
    resizeObserver;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngOnInit() {
        if (!this.isControlled) {
            this.internalActiveId = this.resolveInitialActiveId();
        }
    }
    ngOnChanges(changes) {
        if (changes["activeItemId"] && this.activeItemId !== undefined) {
            this.internalActiveId = this.activeItemId;
            this.cdr.markForCheck();
        }
        if (changes["defaultActiveItemId"] && this.activeItemId === undefined) {
            this.internalActiveId = this.resolveInitialActiveId();
            this.cdr.markForCheck();
        }
    }
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    ngAfterViewInit() {
        requestAnimationFrame(() => this.setupResizeObserver());
    }
    ngOnDestroy() {
        this.resizeObserver?.disconnect();
    }
    get resolvedType() {
        return this.type ?? this.variant ?? TAB_API_DEFAULTS.type;
    }
    get isControlled() {
        return this.activeItemId !== undefined;
    }
    get resolvedActiveId() {
        return this.isControlled ? (this.activeItemId ?? "") : this.internalActiveId;
    }
    get visibleItems() {
        if (!this.overflow || this.items.length <= this.visibleCount) {
            return this.items;
        }
        return this.items.slice(0, this.visibleCount);
    }
    get hiddenItems() {
        if (!this.overflow || this.items.length <= this.visibleCount) {
            return [];
        }
        return this.items.slice(this.visibleCount);
    }
    get overflowMenuItems() {
        const refs = this.hiddenItems.map((item) => ({ id: item.itemId, item }));
        return computeTabOverflowMenuItems(refs, this.resolvedActiveId).map((row) => row.item);
    }
    get activeItem() {
        return this.items.find((item) => item.itemId === this.resolvedActiveId) ?? this.items[0];
    }
    get overflowTriggerSelected() {
        return this.overflowLabel !== null;
    }
    isActive(item) {
        return item.itemId === this.resolvedActiveId;
    }
    isVisible(item) {
        return this.visibleItems.includes(item);
    }
    selectVisible(item) {
        if (item.disabled) {
            return;
        }
        this.activateItem(item);
        this.overflowLabel = null;
    }
    selectHidden(item) {
        if (item.disabled) {
            return;
        }
        this.activateItem(item);
        this.overflowLabel = item.label;
        this.overflowSelection.emit(item.itemId);
        this.overflowOpen = false;
        this.cdr.detectChanges();
    }
    tabId(item) {
        return `ids-tab-${item.itemId}`;
    }
    panelId(item) {
        return `ids-tab-panel-${item.itemId}`;
    }
    onTabKeydown(event, item) {
        const visible = this.visibleItems;
        const enabled = visible.filter((row) => !row.disabled);
        if (!enabled.length) {
            return;
        }
        const currentPos = enabled.indexOf(item);
        let target = item;
        switch (event.key) {
            case "ArrowRight":
                event.preventDefault();
                target = enabled[(currentPos + 1) % enabled.length];
                break;
            case "ArrowLeft":
                event.preventDefault();
                target = enabled[(currentPos - 1 + enabled.length) % enabled.length];
                break;
            case "Home":
                event.preventDefault();
                target = enabled[0];
                break;
            case "End":
                event.preventDefault();
                target = enabled[enabled.length - 1];
                break;
            case " ":
            case "Enter":
                event.preventDefault();
                this.selectVisible(item);
                return;
            default:
                return;
        }
        this.focusedIndex = visible.indexOf(target);
        document.getElementById(this.tabId(target))?.focus();
    }
    tabTabIndex(item) {
        const visible = this.visibleItems;
        const index = visible.indexOf(item);
        return index === this.focusedIndex ? 0 : -1;
    }
    onTabFocus(item) {
        this.focusedIndex = this.visibleItems.indexOf(item);
    }
    toggleOverflowMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        const willOpen = !this.overflowOpen;
        if (willOpen && this.overflowMenuItems.length === 0) {
            return;
        }
        this.overflowOpen = willOpen;
        this.cdr.detectChanges();
    }
    closeOverflowMenu() {
        this.overflowOpen = false;
        this.cdr.markForCheck();
    }
    onAddTabClick() {
        this.addTab.emit();
    }
    onDocumentClick(event) {
        if (!this.overflowOpen) {
            return;
        }
        const target = event.target;
        if (!target) {
            return;
        }
        const moreRoot = this.listWrapRef?.nativeElement.querySelector(".ids-tab__more");
        if (moreRoot?.contains(target)) {
            return;
        }
        this.closeOverflowMenu();
        this.cdr.detectChanges();
    }
    setupResizeObserver() {
        const list = this.listWrapRef?.nativeElement;
        if (!list) {
            return;
        }
        this.resizeObserver?.disconnect();
        if (typeof ResizeObserver === "undefined") {
            this.applyVisibleCount(this.items.length);
            return;
        }
        const recompute = () => {
            const available = list.clientWidth;
            if (available <= 0) {
                requestAnimationFrame(() => recompute());
                return;
            }
            const next = computeTabOverflowVisibleCount({
                containerWidth: available,
                itemCount: this.items.length,
                overflow: this.overflow,
                allowAddTab: this.allowAddTab,
                addTabLabel: this.addTabLabel,
                minTabWidth: this.minTabWidth,
            });
            this.applyVisibleCount(next);
        };
        recompute();
        this.resizeObserver = new ResizeObserver(() => recompute());
        this.resizeObserver.observe(list);
    }
    applyVisibleCount(next) {
        if (next === this.visibleCount) {
            return;
        }
        this.visibleCount = next;
        if (this.hiddenItems.length === 0 && this.overflowLabel !== null) {
            this.overflowLabel = null;
        }
        this.cdr.markForCheck();
    }
    bindItems() {
        this.items = this.itemQuery.toArray();
        if (!this.items.some((item) => item.itemId === this.resolvedActiveId)) {
            this.internalActiveId = this.resolveInitialActiveId();
        }
        this.visibleCount = this.items.length;
        requestAnimationFrame(() => this.setupResizeObserver());
        this.cdr.markForCheck();
    }
    resolveInitialActiveId() {
        const preferred = this.defaultActiveItemId;
        const preferredItem = this.items.find((item) => item.itemId === preferred && !item.disabled);
        if (preferredItem) {
            return preferredItem.itemId;
        }
        return this.items.find((item) => !item.disabled)?.itemId ?? "";
    }
    activateItem(item) {
        if (!this.isControlled) {
            this.internalActiveId = item.itemId;
        }
        this.activeItemChange.emit(item.itemId);
        this.tabSelect.emit({ id: item.itemId, label: item.label });
        this.cdr.markForCheck();
    }
    static ɵfac = function IdsTabComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTabComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTabComponent, selectors: [["ids-tab"]], contentQueries: function IdsTabComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsTabItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, viewQuery: function IdsTabComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.listWrapRef = _t.first);
        } }, hostBindings: function IdsTabComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("click", function IdsTabComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, i0.ɵɵresolveDocument);
        } }, inputs: { type: "type", variant: "variant", surface: "surface", activeItemId: "activeItemId", defaultActiveItemId: "defaultActiveItemId", allowAddTab: "allowAddTab", addTabLabel: "addTabLabel", moreLabel: "moreLabel", overflow: "overflow", minTabWidth: "minTabWidth", maxTabWidth: "maxTabWidth" }, outputs: { activeItemChange: "activeItemChange", tabSelect: "tabSelect", addTab: "addTab", overflowSelection: "overflowSelection" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_TAB_CONTEXT, useExisting: IdsTabComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c1, decls: 10, vars: 5, consts: [["listWrapRef", ""], [1, "ids-tab"], [1, "ids-tab__list-wrap"], ["role", "tablist", "aria-label", "Tabs", 1, "ids-tab__list"], ["type", "button", "role", "tab", 1, "ids-tab__tab", 3, "ids-tab__tab--primary", "ids-tab__tab--secondary", "ids-tab__tab--selected", "id", "disabled", "tabIndex", "min-width", "max-width"], [1, "ids-tab__more"], ["type", "button", 1, "ids-tab__add", 3, "ids-tab__add--primary", "ids-tab__add--secondary"], ["role", "tabpanel", 1, "ids-tab__panel", 3, "id"], ["type", "button", "role", "tab", 1, "ids-tab__tab", 3, "click", "keydown", "focus", "id", "disabled", "tabIndex"], [1, "ids-tab__tab-inner"], [1, "ids-tab__tab-icon"], [1, "ids-tab__tab-label"], [1, "ids-tab__badge"], [3, "shapeName", "size"], ["type", "button", "aria-label", "More tabs", 1, "ids-tab__more-trigger", 3, "click"], ["className", "ids-tab__more-icon", 3, "shapeName", "size"], ["role", "menu", 1, "ids-tab__more-menu"], ["type", "button", "role", "menuitem", 1, "ids-tab__more-item", 3, "disabled"], ["type", "button", "role", "menuitem", 1, "ids-tab__more-item", 3, "click", "disabled"], ["type", "button", 1, "ids-tab__add", 3, "click"], ["className", "ids-tab__add-icon", 3, "shapeName", "size"], [1, "ids-tab__add-label"], [4, "ngTemplateOutlet"]], template: function IdsTabComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "div", 1)(1, "div", 2, 0)(3, "div", 3);
            i0.ɵɵrepeaterCreate(4, IdsTabComponent_For_5_Template, 6, 20, "button", 4, _forTrack0);
            i0.ɵɵconditionalCreate(6, IdsTabComponent_Conditional_6_Template, 5, 12, "div", 5);
            i0.ɵɵconditionalCreate(7, IdsTabComponent_Conditional_7_Template, 4, 8, "button", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(8, IdsTabComponent_Conditional_8_Template, 2, 3, "div", 7);
            i0.ɵɵprojection(9);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_6_0;
            i0.ɵɵattribute("data-surface", ctx.surface)("data-type", ctx.resolvedType);
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.visibleItems);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.hiddenItems.length > 0 ? 6 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.allowAddTab ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional((tmp_6_0 = ctx.activeItem) ? 8 : -1, tmp_6_0);
        } }, dependencies: [CommonModule, i1.NgTemplateOutlet, IdsIconComponent], styles: ["ids-tab-item,\nids-tab-panel {\n  display: block;\n}\n\n.ids-tab {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.ids-tab[data-surface=\"transparent\"] .ids-tab__tab,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__more-trigger,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__add {\n  background: transparent;\n}\n\n.ids-tab[data-surface=\"transparent\"] .ids-tab__tab--selected,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__more-trigger--selected {\n  background: transparent;\n}\n\n.ids-tab__list-wrap {\n  width: 100%;\n  /* Visible tab count is computed in JS; do not clip the More menu popup. */\n  overflow: visible;\n}\n\n.ids-tab__list {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  width: 100%;\n  min-width: 0;\n}\n\n.ids-tab__tab {\n  height: 38px;\n  padding: 9px var(--padding-padding-24);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  background: var(--color-background-surface-2);\n  border: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  cursor: pointer;\n  transition: all 150ms ease;\n  outline: none;\n  white-space: nowrap;\n  font-family: inherit;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-24);\n  flex: 0 1 auto;\n  min-width: 80px;\n  max-width: 250px;\n  position: relative;\n}\n\n.ids-tab__tab-inner {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  flex: 1 1 auto;\n}\n\n.ids-tab__tab::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__tab--secondary::after {\n  display: none;\n}\n\n.ids-tab__tab:hover:not([data-disabled]):not([data-simulated-state]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__tab[data-simulated-state=\"hover\"] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__tab:focus-visible,\n.ids-tab__tab[data-simulated-state=\"focus-visible\"] {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__tab--primary::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ids-tab__tab--primary:not(.ids-tab__tab--selected)::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected::before {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected {\n  box-shadow: inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark);\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected:focus-visible,\n.ids-tab__tab--primary.ids-tab__tab--selected[data-simulated-state=\"focus-visible\"] {\n  border-radius: var(--corner-radius-radius-4);\n  box-shadow:\n    inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark),\n    inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n}\n\n.ids-tab__tab--selected {\n  background: var(--color-background-surface-2);\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-tab__tab--selected::after {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__tab--secondary.ids-tab__tab--selected {\n  border-bottom: 0;\n}\n\n.ids-tab__tab--secondary.ids-tab__tab--selected::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n  bottom: 0;\n}\n\n.ids-tab__tab[data-disabled] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ids-tab__tab-icon {\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.ids-tab__tab-label {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ids-tab__badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  font-size: 11px;\n  line-height: 1;\n  background: var(--color-background-alerting-critical);\n  color: var(--color-text-white);\n}\n\n.ids-tab__more {\n  position: relative;\n  flex-shrink: 0;\n}\n\n.ids-tab__more-trigger {\n  all: unset;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--component-gap-s, var(--spacing-space-8));\n  padding: var(--padding-padding-8) var(--padding-padding-12);\n  height: 38px;\n  background: var(--color-background-surface-2);\n  border: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n  position: relative;\n}\n\n.ids-tab__more-trigger::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__more-trigger--secondary::after {\n  display: none;\n}\n\n.ids-tab__more-trigger:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__more-trigger--selected {\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-tab__more-trigger--secondary.ids-tab__more-trigger--selected::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n  bottom: 0;\n}\n\n.ids-tab__more-trigger:focus-visible {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__more-trigger--primary::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ids-tab__more-trigger--primary:not(.ids-tab__more-trigger--selected)::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected::before {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected {\n  box-shadow: inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark);\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected:focus-visible {\n  box-shadow:\n    inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark),\n    inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__more-icon {\n  width: 12px;\n  height: 12px;\n}\n\n.ids-tab__more-menu {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 100;\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-lighter);\n  box-shadow:\n    var(--shadow-drop-shadow-8-x)\n    var(--shadow-drop-shadow-8-y)\n    var(--shadow-drop-shadow-8-blur)\n    var(--shadow-drop-shadow-8-color);\n  min-width: 160px;\n  overflow: hidden;\n}\n\n.ids-tab__more-item {\n  all: unset;\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  padding: var(--padding-padding-8) var(--padding-padding-12);\n  color: var(--color-text-neutral-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.ids-tab__more-item:hover {\n  background: var(--color-background-n-tabs-x-hover);\n}\n\n.ids-tab__add {\n  all: unset;\n  box-sizing: border-box;\n  width: auto;\n  min-width: 56px;\n  height: 38px;\n  background: var(--color-background-surface-2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-space-8);\n  padding: 9px var(--padding-padding-24);\n  cursor: pointer;\n  color: var(--color-text-brand-strong);\n  flex-shrink: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  position: relative;\n}\n\n.ids-tab__add:focus-visible {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__add::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__more + .ids-tab__add::before {\n  display: none;\n}\n\n.ids-tab__add--secondary::before {\n  display: none;\n}\n\n.ids-tab__add--primary::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__add:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-tab__add-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.ids-tab__add-label {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-brand-strong);\n  white-space: nowrap;\n}\n\n.ids-tab__panel {\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  margin-top: -1px;\n  padding: var(--padding-padding-16) 0;\n  font-size: var(--font-size-body-2);\n  color: var(--color-text-neutral-strong);\n  line-height: var(--font-line-height-line-height-20);\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTabComponent, [{
        type: Component,
        args: [{ selector: "ids-tab", standalone: true, imports: [CommonModule, IdsIconComponent], encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.OnPush, providers: [{ provide: IDS_TAB_CONTEXT, useExisting: IdsTabComponent }], template: "<div\n  class=\"ids-tab\"\n  [attr.data-surface]=\"surface\"\n  [attr.data-type]=\"resolvedType\"\n>\n  <div class=\"ids-tab__list-wrap\" #listWrapRef>\n    <div class=\"ids-tab__list\" role=\"tablist\" aria-label=\"Tabs\">\n      @for (item of visibleItems; track item.itemId) {\n        <button\n          type=\"button\"\n          role=\"tab\"\n          class=\"ids-tab__tab\"\n          [class.ids-tab__tab--primary]=\"resolvedType === 'primary'\"\n          [class.ids-tab__tab--secondary]=\"resolvedType === 'secondary'\"\n          [class.ids-tab__tab--selected]=\"isActive(item)\"\n          [attr.data-disabled]=\"item.disabled ? true : null\"\n          [attr.data-simulated-state]=\"item.simulatedState ?? null\"\n          [id]=\"tabId(item)\"\n          [attr.aria-controls]=\"panelId(item)\"\n          [attr.aria-selected]=\"isActive(item)\"\n          [disabled]=\"item.disabled\"\n          [tabIndex]=\"tabTabIndex(item)\"\n          [style.min-width.px]=\"minTabWidth\"\n          [style.max-width.px]=\"maxTabWidth\"\n          (click)=\"selectVisible(item)\"\n          (keydown)=\"onTabKeydown($event, item)\"\n          (focus)=\"onTabFocus(item)\"\n        >\n          <span class=\"ids-tab__tab-inner\">\n            @if (item.iconSlug) {\n              <span class=\"ids-tab__tab-icon\">\n                <ids-icon [shapeName]=\"item.iconSlug\" [size]=\"16\" />\n              </span>\n            }\n            <span class=\"ids-tab__tab-label\">{{ item.label }}</span>\n            @if (item.badgeCount !== undefined && item.badgeCount > 0) {\n              <span class=\"ids-tab__badge\">{{ item.badgeCount }}</span>\n            }\n          </span>\n        </button>\n      }\n\n      @if (hiddenItems.length > 0) {\n        <div class=\"ids-tab__more\">\n          <button\n            type=\"button\"\n            class=\"ids-tab__more-trigger\"\n            [class.ids-tab__more-trigger--primary]=\"resolvedType === 'primary'\"\n            [class.ids-tab__more-trigger--secondary]=\"resolvedType === 'secondary'\"\n            [class.ids-tab__more-trigger--selected]=\"overflowTriggerSelected\"\n            [attr.aria-expanded]=\"overflowOpen\"\n            [attr.aria-haspopup]=\"true\"\n            aria-label=\"More tabs\"\n            (click)=\"toggleOverflowMenu($event)\"\n          >\n            {{ overflowLabel ?? moreLabel }}\n            <ids-icon [shapeName]=\"moreIconSlug\" [size]=\"12\" className=\"ids-tab__more-icon\" />\n          </button>\n          @if (overflowOpen && overflowMenuItems.length > 0) {\n            <div class=\"ids-tab__more-menu\" role=\"menu\">\n              @for (item of overflowMenuItems; track item.itemId) {\n                <button\n                  type=\"button\"\n                  class=\"ids-tab__more-item\"\n                  role=\"menuitem\"\n                  [disabled]=\"item.disabled\"\n                  (click)=\"selectHidden(item); $event.stopPropagation()\"\n                >\n                  {{ item.label }}\n                </button>\n              }\n            </div>\n          }\n        </div>\n      }\n\n      @if (allowAddTab) {\n        <button\n          type=\"button\"\n          class=\"ids-tab__add\"\n          [class.ids-tab__add--primary]=\"resolvedType === 'primary'\"\n          [class.ids-tab__add--secondary]=\"resolvedType === 'secondary'\"\n          [attr.aria-label]=\"addTabLabel\"\n          (click)=\"onAddTabClick()\"\n        >\n          <ids-icon [shapeName]=\"addIconSlug\" [size]=\"16\" className=\"ids-tab__add-icon\" />\n          <span class=\"ids-tab__add-label\">{{ addTabLabel }}</span>\n        </button>\n      }\n    </div>\n  </div>\n\n  @if (activeItem; as item) {\n    <div\n      class=\"ids-tab__panel\"\n      role=\"tabpanel\"\n      [id]=\"panelId(item)\"\n      [attr.aria-labelledby]=\"tabId(item)\"\n    >\n      <ng-container *ngTemplateOutlet=\"item.panelTpl\" />\n    </div>\n  }\n\n  <ng-content />\n</div>\n", styles: ["ids-tab-item,\nids-tab-panel {\n  display: block;\n}\n\n.ids-tab {\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.ids-tab[data-surface=\"transparent\"] .ids-tab__tab,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__more-trigger,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__add {\n  background: transparent;\n}\n\n.ids-tab[data-surface=\"transparent\"] .ids-tab__tab--selected,\n.ids-tab[data-surface=\"transparent\"] .ids-tab__more-trigger--selected {\n  background: transparent;\n}\n\n.ids-tab__list-wrap {\n  width: 100%;\n  /* Visible tab count is computed in JS; do not clip the More menu popup. */\n  overflow: visible;\n}\n\n.ids-tab__list {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  width: 100%;\n  min-width: 0;\n}\n\n.ids-tab__tab {\n  height: 38px;\n  padding: 9px var(--padding-padding-24);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n  background: var(--color-background-surface-2);\n  border: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  cursor: pointer;\n  transition: all 150ms ease;\n  outline: none;\n  white-space: nowrap;\n  font-family: inherit;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-24);\n  flex: 0 1 auto;\n  min-width: 80px;\n  max-width: 250px;\n  position: relative;\n}\n\n.ids-tab__tab-inner {\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  min-width: 0;\n  flex: 1 1 auto;\n}\n\n.ids-tab__tab::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__tab--secondary::after {\n  display: none;\n}\n\n.ids-tab__tab:hover:not([data-disabled]):not([data-simulated-state]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__tab[data-simulated-state=\"hover\"] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__tab:focus-visible,\n.ids-tab__tab[data-simulated-state=\"focus-visible\"] {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__tab--primary::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ids-tab__tab--primary:not(.ids-tab__tab--selected)::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected::before {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected {\n  box-shadow: inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark);\n}\n\n.ids-tab__tab--primary.ids-tab__tab--selected:focus-visible,\n.ids-tab__tab--primary.ids-tab__tab--selected[data-simulated-state=\"focus-visible\"] {\n  border-radius: var(--corner-radius-radius-4);\n  box-shadow:\n    inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark),\n    inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n}\n\n.ids-tab__tab--selected {\n  background: var(--color-background-surface-2);\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-tab__tab--selected::after {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__tab--secondary.ids-tab__tab--selected {\n  border-bottom: 0;\n}\n\n.ids-tab__tab--secondary.ids-tab__tab--selected::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n  bottom: 0;\n}\n\n.ids-tab__tab[data-disabled] {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ids-tab__tab-icon {\n  width: 16px;\n  height: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n\n.ids-tab__tab-label {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.ids-tab__badge {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  font-size: 11px;\n  line-height: 1;\n  background: var(--color-background-alerting-critical);\n  color: var(--color-text-white);\n}\n\n.ids-tab__more {\n  position: relative;\n  flex-shrink: 0;\n}\n\n.ids-tab__more-trigger {\n  all: unset;\n  box-sizing: border-box;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--component-gap-s, var(--spacing-space-8));\n  padding: var(--padding-padding-8) var(--padding-padding-12);\n  height: 38px;\n  background: var(--color-background-surface-2);\n  border: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n  position: relative;\n}\n\n.ids-tab__more-trigger::after {\n  content: \"\";\n  position: absolute;\n  right: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__more-trigger--secondary::after {\n  display: none;\n}\n\n.ids-tab__more-trigger:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-tab__more-trigger--selected {\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-tab__more-trigger--secondary.ids-tab__more-trigger--selected::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n  bottom: 0;\n}\n\n.ids-tab__more-trigger:focus-visible {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__more-trigger--primary::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  width: 1px;\n  background: var(--color-border-accessible);\n  pointer-events: none;\n  z-index: 0;\n}\n\n.ids-tab__more-trigger--primary:not(.ids-tab__more-trigger--selected)::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected::before {\n  top: 0;\n  height: 100%;\n  transform: none;\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected {\n  box-shadow: inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark);\n}\n\n.ids-tab__more-trigger--primary.ids-tab__more-trigger--selected:focus-visible {\n  box-shadow:\n    inset 0 var(--border-width-border-thick) 0 0 var(--color-border-brand-dark),\n    inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__more-icon {\n  width: 12px;\n  height: 12px;\n}\n\n.ids-tab__more-menu {\n  position: absolute;\n  top: 100%;\n  right: 0;\n  z-index: 100;\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-lighter);\n  box-shadow:\n    var(--shadow-drop-shadow-8-x)\n    var(--shadow-drop-shadow-8-y)\n    var(--shadow-drop-shadow-8-blur)\n    var(--shadow-drop-shadow-8-color);\n  min-width: 160px;\n  overflow: hidden;\n}\n\n.ids-tab__more-item {\n  all: unset;\n  box-sizing: border-box;\n  display: block;\n  width: 100%;\n  padding: var(--padding-padding-8) var(--padding-padding-12);\n  color: var(--color-text-neutral-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.ids-tab__more-item:hover {\n  background: var(--color-background-n-tabs-x-hover);\n}\n\n.ids-tab__add {\n  all: unset;\n  box-sizing: border-box;\n  width: auto;\n  min-width: 56px;\n  height: 38px;\n  background: var(--color-background-surface-2);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: var(--spacing-space-8);\n  padding: 9px var(--padding-padding-24);\n  cursor: pointer;\n  color: var(--color-text-brand-strong);\n  flex-shrink: 0;\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  position: relative;\n}\n\n.ids-tab__add:focus-visible {\n  outline: none;\n  box-shadow: inset 0 0 0 var(--border-width-border-thick) var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.ids-tab__add::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 1px;\n  height: 24px;\n  transform: translateY(-50%);\n  background: var(--color-border-accessible);\n}\n\n.ids-tab__more + .ids-tab__add::before {\n  display: none;\n}\n\n.ids-tab__add--secondary::before {\n  display: none;\n}\n\n.ids-tab__add--primary::before {\n  top: 50%;\n  height: var(--sizing-size-24);\n  transform: translateY(-50%);\n}\n\n.ids-tab__add:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n}\n\n.ids-tab__add-icon {\n  width: 16px;\n  height: 16px;\n}\n\n.ids-tab__add-label {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-brand-strong);\n  white-space: nowrap;\n}\n\n.ids-tab__panel {\n  border-top: var(--border-width-border-1) solid var(--color-border-accessible);\n  margin-top: -1px;\n  padding: var(--padding-padding-16) 0;\n  font-size: var(--font-size-body-2);\n  color: var(--color-text-neutral-strong);\n  line-height: var(--font-line-height-line-height-20);\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { itemQuery: [{
            type: ContentChildren,
            args: [IdsTabItemComponent]
        }], listWrapRef: [{
            type: ViewChild,
            args: ["listWrapRef"]
        }], type: [{
            type: Input
        }], variant: [{
            type: Input
        }], surface: [{
            type: Input
        }], activeItemId: [{
            type: Input
        }], defaultActiveItemId: [{
            type: Input
        }], allowAddTab: [{
            type: Input
        }], addTabLabel: [{
            type: Input
        }], moreLabel: [{
            type: Input
        }], overflow: [{
            type: Input
        }], minTabWidth: [{
            type: Input
        }], maxTabWidth: [{
            type: Input
        }], activeItemChange: [{
            type: Output
        }], tabSelect: [{
            type: Output
        }], addTab: [{
            type: Output
        }], overflowSelection: [{
            type: Output
        }], onDocumentClick: [{
            type: HostListener,
            args: ["document:click", ["$event"]]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTabComponent, { className: "IdsTabComponent", filePath: "src/components/ids-tab/ids-tab.component.ts", lineNumber: 44 }); })();
