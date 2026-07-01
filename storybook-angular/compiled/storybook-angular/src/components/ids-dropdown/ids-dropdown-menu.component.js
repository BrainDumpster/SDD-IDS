import { NgStyle } from "@angular/common";
import { ChangeDetectionStrategy, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject, } from "@angular/core";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_DROPDOWN_CONTEXT } from "./ids-dropdown-context";
import { IdsDropdownMenuFooterComponent } from "./ids-dropdown-menu-footer.component";
import { IdsDropdownMenuGroupComponent } from "./ids-dropdown-menu-group.component";
import { IdsDropdownMenuItemComponent } from "./ids-dropdown-menu-item.component";
import { IdsDropdownTagComponent } from "./ids-dropdown-tag.component";
import { IdsDropdownTriggerShellComponent } from "./ids-dropdown-trigger-shell.component";
import * as i0 from "@angular/core";
const _c0 = ["triggerMeasure"];
const _c1 = ["compositionSource"];
const _c2 = [[["ids-dropdown-trigger-shell"]], [["ids-dropdown-menu-group"], ["ids-dropdown-menu-item"], ["ids-dropdown-menu-footer"]]];
const _c3 = ["ids-dropdown-trigger-shell", "ids-dropdown-menu-group, ids-dropdown-menu-item, ids-dropdown-menu-footer"];
const _forTrack0 = ($index, $item) => $item.id ?? $index;
const _forTrack1 = ($index, $item) => $item.value;
function IdsDropdownMenuComponent_Conditional_4_Conditional_2_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_2_Conditional_5_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onSearchClear()); });
    i0.ɵɵelement(1, "ids-icon", 19);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 10);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 8)(1, "div", 13);
    i0.ɵɵelement(2, "ids-icon", 14);
    i0.ɵɵelementStart(3, "div", 15)(4, "input", 16);
    i0.ɵɵlistener("input", function IdsDropdownMenuComponent_Conditional_4_Conditional_2_Template_input_input_4_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onSearchInput($event)); })("keydown", function IdsDropdownMenuComponent_Conditional_4_Conditional_2_Template_input_keydown_4_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, IdsDropdownMenuComponent_Conditional_4_Conditional_2_Conditional_5_Template, 2, 1, "button", 17);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r1.searchValue)("placeholder", ctx_r1.searchPlaceholder);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showSearchClear ? 5 : -1);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_3_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 22);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_3_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 23);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 9)(1, "button", 20);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_3_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onSelectAll()); });
    i0.ɵɵelementStart(2, "span", 21);
    i0.ɵɵconditionalCreate(3, IdsDropdownMenuComponent_Conditional_4_Conditional_3_Conditional_3_Template, 1, 0, "span", 22)(4, IdsDropdownMenuComponent_Conditional_4_Conditional_3_Conditional_4_Template, 1, 0, "span", 23);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "span");
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(7, "button", 24);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_3_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onClearAll()); });
    i0.ɵɵtext(8);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵattribute("data-checked", ctx_r1.selectAllChecked ? "true" : null)("data-indeterminate", ctx_r1.selectAllIndeterminate ? "true" : null);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.selectAllIndeterminate ? 3 : ctx_r1.selectAllChecked ? 4 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.selectAllLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.clearAllDisabled);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.clearAllLabel, " ");
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Conditional_8_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-dropdown-tag", 31);
    i0.ɵɵlistener("dismiss", function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Conditional_8_For_2_Template_ids_dropdown_tag_dismiss_0_listener() { const tag_r7 = i0.ɵɵrestoreView(_r6).$implicit; const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.removeSelectedTag.emit(tag_r7.value)); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const tag_r7 = ctx.$implicit;
    i0.ɵɵproperty("label", tag_r7.label);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29);
    i0.ɵɵrepeaterCreate(1, IdsDropdownMenuComponent_Conditional_4_Conditional_4_Conditional_8_For_2_Template, 1, 1, "ids-dropdown-tag", 30, _forTrack1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.selectedTagItems);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 10)(1, "div", 25)(2, "button", 26);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleShowSelectedExpanded()); });
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "ids-icon", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "button", 28);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_4_Template_button_click_6_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPanelClear()); });
    i0.ɵɵelement(7, "ids-icon", 19);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(8, IdsDropdownMenuComponent_Conditional_4_Conditional_4_Conditional_8_Template, 3, 0, "div", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵattribute("data-expanded", ctx_r1.isShowSelectedExpanded ? "true" : null);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("aria-expanded", ctx_r1.isShowSelectedExpanded);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.isShowSelectedExpanded ? ctx_r1.hideSelectedLabel : ctx_r1.showSelectedLabel);
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("transform", ctx_r1.isShowSelectedExpanded ? "rotate(180deg)" : null);
    i0.ɵɵproperty("size", 10);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("size", 10);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isShowSelectedExpanded ? 8 : -1);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(item_r8.label);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 33);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 22);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 23);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37)(1, "span", 38);
    i0.ɵɵconditionalCreate(2, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Conditional_2_Template, 1, 0, "span", 22)(3, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Conditional_3_Template, 1, 0, "span", 23);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r8.indeterminate ? 2 : ctx_r1.isItemSelected(item_r8) ? 3 : -1);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span", 40);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 37)(1, "span", 39);
    i0.ɵɵconditionalCreate(2, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_2_Conditional_2_Template, 1, 0, "span", 40);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext(2).$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.isItemSelected(item_r8) ? 2 : -1);
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 36);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r9); const item_r8 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onItemClick(item_r8, $event)); });
    i0.ɵɵconditionalCreate(1, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_1_Template, 4, 1, "span", 37);
    i0.ɵɵconditionalCreate(2, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Conditional_2_Template, 3, 1, "span", 37);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", item_r8.disabled);
    i0.ɵɵattribute("data-disabled", item_r8.disabled ? "true" : null)("data-selection-mode", ctx_r1.selectionMode)("data-selected", ctx_r1.isItemSelected(item_r8) ? "true" : null)("data-indeterminate", item_r8.indeterminate ? "true" : null)("role", ctx_r1.itemRole(item_r8))("aria-checked", ctx_r1.itemAriaChecked(item_r8, ctx_r1.isItemSelected(item_r8)));
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectionMode === "multi" ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.selectionMode === "single" && ctx_r1.showSingleSelectRadio ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r8.label, " ");
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 41);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_3_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r10); const item_r8 = i0.ɵɵnextContext().$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onItemClick(item_r8, $event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r8 = i0.ɵɵnextContext().$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", item_r8.disabled);
    i0.ɵɵattribute("data-selected", ctx_r1.isItemSelected(item_r8) ? "true" : null);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r8.label, " ");
} }
function IdsDropdownMenuComponent_Conditional_4_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_0_Template, 2, 1, "div", 32)(1, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_1_Template, 1, 0, "div", 33)(2, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_2_Template, 4, 10, "button", 34)(3, IdsDropdownMenuComponent_Conditional_4_For_7_Conditional_3_Template, 2, 3, "button", 35);
} if (rf & 2) {
    const item_r8 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵconditional(item_r8.kind === "section" ? 0 : item_r8.kind === "divider" ? 1 : ctx_r1.isSelectableItem(item_r8) ? 2 : 3);
} }
function IdsDropdownMenuComponent_Conditional_4_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 42);
    i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Conditional_4_Conditional_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onFooterAction()); });
    i0.ɵɵelementStart(1, "span", 43);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.footerActionLabel);
} }
function IdsDropdownMenuComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 6)(1, "div", 7);
    i0.ɵɵconditionalCreate(2, IdsDropdownMenuComponent_Conditional_4_Conditional_2_Template, 6, 4, "div", 8);
    i0.ɵɵconditionalCreate(3, IdsDropdownMenuComponent_Conditional_4_Conditional_3_Template, 9, 6, "div", 9);
    i0.ɵɵconditionalCreate(4, IdsDropdownMenuComponent_Conditional_4_Conditional_4_Template, 9, 8, "div", 10);
    i0.ɵɵelementStart(5, "div", 11);
    i0.ɵɵrepeaterCreate(6, IdsDropdownMenuComponent_Conditional_4_For_7_Template, 4, 1, null, null, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(8, IdsDropdownMenuComponent_Conditional_4_Conditional_8_Template, 3, 1, "button", 12);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("positioner--align-end", ctx_r1.popupAlignment === "end")("positioner--above", ctx_r1.popupPlacement === "above");
    i0.ɵɵproperty("ngStyle", ctx_r1.positionerStyle);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("popup--above", ctx_r1.popupPlacement === "above");
    i0.ɵɵproperty("ngStyle", ctx_r1.popupStyle);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showSearch ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showSelectAllClearAll ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showSelectedPanel && ctx_r1.selectionMode === "multi" && ctx_r1.resolvedSelectedValues.length > 0 ? 4 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngStyle", ctx_r1.optionsScrollStyle);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r1.resolvedItems);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.footerActionLabel ? 8 : -1);
} }
/** IDS field + menu minimum width (Figma / design-spec). */
const DROPDOWN_MENU_MIN_WIDTH_PX = 186;
const VIEWPORT_EDGE_PADDING_PX = 8;
export class IdsDropdownMenuComponent {
    cdr;
    dropdown = inject(IDS_DROPDOWN_CONTEXT, { optional: true });
    elementRef = inject((ElementRef));
    triggerMeasure;
    compositionSource;
    triggerShell;
    groupQuery;
    directItemQuery;
    footer;
    /** Imperative fallback when composition children are absent. */
    items = [];
    disabled = false;
    selectionMode = "none";
    showSingleSelectRadio = false;
    showSelectAllClearAll = false;
    selectAllLabel = "Select All";
    clearAllLabel = "Clear All";
    selectAllChecked = false;
    selectAllIndeterminate = false;
    clearAllDisabled = false;
    selectedValues = [];
    maxHeight;
    sideOffset = 0;
    matchTriggerWidth = true;
    defaultOpen = false;
    showSearch = false;
    searchValue = "";
    searchPlaceholder = "Search";
    showSelectedPanel = false;
    showSelectedExpanded;
    defaultShowSelectedExpanded = false;
    showSelectedLabel = "Show Selected";
    hideSelectedLabel = "Hide Selected";
    fullWidth = true;
    /** Space-separated id refs — set by `ids-dropdown` when helper/error slots register. */
    describedBy = "";
    get triggerAriaDescribedBy() {
        const ids = this.dropdown?.describedByIds() || this.describedBy;
        return ids || null;
    }
    openChange = new EventEmitter();
    searchValueChange = new EventEmitter();
    selectAllClick = new EventEmitter();
    clearAllClick = new EventEmitter();
    showSelectedExpandedChange = new EventEmitter();
    removeSelectedTag = new EventEmitter();
    showSelectedPanelClear = new EventEmitter();
    isOpen = false;
    triggerWidth;
    popupAlignment = "start";
    popupPlacement = "below";
    internalShowSelectedExpanded = false;
    resolvedItems = [];
    resizeObserver;
    groupItemSubscriptions = [];
    constructor(cdr) {
        this.cdr = cdr;
    }
    get resolvedSelectedValues() {
        if (this.dropdown?.selectedValues) {
            return [...this.dropdown.selectedValues];
        }
        return this.selectedValues;
    }
    ngOnChanges(changes) {
        if (changes["defaultOpen"] && changes["defaultOpen"].firstChange) {
            this.isOpen = this.defaultOpen && !this.disabled;
        }
        if (changes["defaultShowSelectedExpanded"]?.firstChange) {
            this.internalShowSelectedExpanded = this.defaultShowSelectedExpanded;
        }
        if (changes["disabled"] && this.disabled) {
            this.isOpen = false;
        }
        if (changes["items"]) {
            this.rebuildResolvedItems();
        }
    }
    ngAfterContentInit() {
        if (this.dropdown) {
            this.selectionMode = this.dropdown.selectionMode;
            this.showSingleSelectRadio = this.dropdown.showSingleSelectRadio;
            this.selectedValues = [...this.dropdown.selectedValues];
            this.disabled = this.dropdown.disabled;
        }
        this.bindGroupListeners();
        this.rebuildResolvedItems();
        this.groupQuery.changes.subscribe(() => {
            this.bindGroupListeners();
            this.rebuildResolvedItems();
        });
        this.directItemQuery.changes.subscribe(() => this.rebuildResolvedItems());
    }
    ngAfterViewInit() {
        const el = this.triggerMeasure?.nativeElement;
        if (!el || !this.matchTriggerWidth) {
            return;
        }
        const updateLayout = () => this.updatePopupLayout();
        updateLayout();
        this.resizeObserver = new ResizeObserver(updateLayout);
        this.resizeObserver.observe(el);
        const field = el.querySelector(".field");
        if (field instanceof HTMLElement) {
            this.resizeObserver.observe(field);
        }
        this.rebuildResolvedItems();
    }
    ngOnDestroy() {
        this.resizeObserver?.disconnect();
        this.groupItemSubscriptions.forEach((sub) => sub.unsubscribe());
    }
    onWindowResize() {
        if (this.isOpen) {
            this.updatePopupLayout();
        }
    }
    get footerActionLabel() {
        return this.footer?.actionLabel;
    }
    get isShowSelectedExpandedControlled() {
        return this.showSelectedExpanded !== undefined;
    }
    get isShowSelectedExpanded() {
        return this.isShowSelectedExpandedControlled
            ? Boolean(this.showSelectedExpanded)
            : this.internalShowSelectedExpanded;
    }
    get showSearchClear() {
        return Boolean(this.searchValue?.length);
    }
    get selectedTagItems() {
        return this.resolvedSelectedValues.map((value) => {
            const item = this.resolvedItems.find((entry) => entry.value === value || entry.label === value);
            return { value, label: item?.label ?? value };
        });
    }
    get effectivePopupWidth() {
        if (!this.matchTriggerWidth || !this.triggerWidth) {
            return undefined;
        }
        return Math.max(this.triggerWidth, DROPDOWN_MENU_MIN_WIDTH_PX);
    }
    get popupStyle() {
        const width = this.effectivePopupWidth;
        if (!width) {
            return {};
        }
        const px = `${width}px`;
        return {
            width: px,
            minWidth: px,
            maxWidth: px,
            "--dropdown-trigger-width": px,
        };
    }
    get positionerStyle() {
        const width = this.effectivePopupWidth;
        if (!width) {
            return { marginTop: `${this.sideOffset}px` };
        }
        const px = `${width}px`;
        return {
            width: px,
            minWidth: px,
            maxWidth: px,
            "--dropdown-trigger-width": px,
            marginTop: `${this.sideOffset}px`,
        };
    }
    get optionsScrollStyle() {
        if (!this.maxHeight) {
            return undefined;
        }
        return { maxHeight: `${this.maxHeight}px`, overflowY: "auto" };
    }
    onDocumentClick(event) {
        if (!this.isOpen) {
            return;
        }
        const target = event.target;
        if (target && this.elementRef.nativeElement.contains(target)) {
            return;
        }
        this.setOpen(false);
    }
    onEscape() {
        if (this.isOpen) {
            this.setOpen(false);
        }
    }
    toggleOpen() {
        if (this.disabled) {
            return;
        }
        this.setOpen(!this.isOpen);
    }
    setOpen(next) {
        if (this.disabled && next) {
            return;
        }
        this.isOpen = next;
        this.openChange.emit(next);
        if (next) {
            queueMicrotask(() => this.updatePopupLayout());
        }
        this.cdr.markForCheck();
    }
    onSearchInput(event) {
        const value = event.target.value;
        this.searchValue = value;
        this.searchValueChange.emit(value);
        this.cdr.markForCheck();
    }
    onSearchClear() {
        this.searchValue = "";
        this.searchValueChange.emit("");
        this.cdr.markForCheck();
    }
    onSelectAll() {
        this.selectAllClick.emit();
    }
    onClearAll() {
        this.clearAllClick.emit();
    }
    onFooterAction() {
        this.footer?.action.emit();
    }
    toggleShowSelectedExpanded() {
        const next = !this.isShowSelectedExpanded;
        if (!this.isShowSelectedExpandedControlled) {
            this.internalShowSelectedExpanded = next;
        }
        this.showSelectedExpandedChange.emit(next);
        this.cdr.markForCheck();
    }
    onPanelClear() {
        if (this.showSelectedPanelClear.observed) {
            this.showSelectedPanelClear.emit();
        }
        else {
            this.clearAllClick.emit();
        }
    }
    onItemClick(item, event) {
        event.stopPropagation();
        if (item.disabled) {
            return;
        }
        item.onClick?.();
        if (this.selectionMode === "single") {
            this.setOpen(false);
        }
        this.cdr.markForCheck();
    }
    isSelectableItem(item) {
        return Boolean(item.selectable && (this.selectionMode === "single" || this.selectionMode === "multi"));
    }
    isItemSelected(item) {
        if (item.selected !== undefined) {
            return item.selected;
        }
        return item.value ? this.resolvedSelectedValues.includes(item.value) : false;
    }
    itemRole(item) {
        return this.selectionMode === "multi" ? "menuitemcheckbox" : "menuitemradio";
    }
    itemAriaChecked(item, selected) {
        if (this.selectionMode === "multi" && item.indeterminate) {
            return "mixed";
        }
        return selected;
    }
    bindGroupListeners() {
        this.groupItemSubscriptions.forEach((sub) => sub.unsubscribe());
        this.groupItemSubscriptions = [];
        for (const group of this.groupQuery ?? []) {
            const sub = group.itemQuery.changes.subscribe(() => this.rebuildResolvedItems());
            this.groupItemSubscriptions.push(sub);
        }
    }
    rebuildResolvedItems() {
        const groups = this.groupQuery?.toArray() ?? [];
        const directItems = this.directItemQuery?.toArray() ?? [];
        const composed = [];
        const compositionRoot = this.compositionSource?.nativeElement;
        if (compositionRoot) {
            for (const node of Array.from(compositionRoot.children)) {
                if (!(node instanceof HTMLElement)) {
                    continue;
                }
                const tag = node.tagName.toLowerCase();
                if (tag === "ids-dropdown-menu-group") {
                    const group = groups.find((entry) => entry.elementRef.nativeElement === node);
                    if (group) {
                        composed.push(...this.withSelectionHandlers(group.toMenuModels()));
                    }
                    continue;
                }
                if (tag === "ids-dropdown-menu-item") {
                    const item = directItems.find((entry) => entry.elementRef.nativeElement === node);
                    if (item) {
                        composed.push(this.withSelectionHandler(item.toMenuModel()));
                    }
                }
            }
        }
        if (composed.length > 0) {
            this.resolvedItems = composed;
        }
        else if (this.items.length > 0) {
            this.resolvedItems = this.items.map((item) => this.withSelectionHandler(item));
        }
        else if (groups.length > 0 || directItems.length > 0) {
            this.resolvedItems = [
                ...groups.flatMap((group) => this.withSelectionHandlers(group.toMenuModels())),
                ...directItems.map((item) => this.withSelectionHandler(item.toMenuModel())),
            ];
        }
        else {
            this.resolvedItems = [];
        }
        this.cdr.markForCheck();
    }
    withSelectionHandlers(models) {
        return models.map((model) => this.withSelectionHandler(model));
    }
    withSelectionHandler(model) {
        if (model.kind === "section" || model.kind === "divider" || !model.selectable || !model.value) {
            return model;
        }
        const value = model.value;
        return {
            ...model,
            onClick: () => this.dropdown?.toggleValue(value),
        };
    }
    updatePopupLayout() {
        if (!this.matchTriggerWidth) {
            return;
        }
        const measureRoot = this.triggerMeasure?.nativeElement;
        if (!measureRoot) {
            return;
        }
        const fieldEl = measureRoot.querySelector(".field");
        const measureTarget = fieldEl instanceof HTMLElement ? fieldEl : measureRoot;
        const nextWidth = Math.round(measureTarget.getBoundingClientRect().width);
        const popupWidth = Math.max(nextWidth, DROPDOWN_MENU_MIN_WIDTH_PX);
        const nextAlign = this.resolvePopupAlignment(measureTarget, popupWidth, nextWidth);
        const nextPlacement = this.resolvePopupPlacement(measureTarget);
        const changed = this.triggerWidth !== nextWidth ||
            this.popupAlignment !== nextAlign ||
            this.popupPlacement !== nextPlacement;
        this.triggerWidth = nextWidth;
        this.popupAlignment = nextAlign;
        this.popupPlacement = nextPlacement;
        if (changed) {
            this.cdr.markForCheck();
        }
    }
    resolvePopupAlignment(measureTarget, popupWidth, triggerWidth) {
        // Wider popup than trigger: anchor popup right edge to trigger right edge.
        if (popupWidth > triggerWidth) {
            return "end";
        }
        const rect = measureTarget.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const pad = VIEWPORT_EDGE_PADDING_PX;
        const overflowsRight = rect.left + popupWidth > viewportWidth - pad;
        const fitsWhenRightAligned = rect.right - popupWidth >= pad;
        if (overflowsRight && fitsWhenRightAligned) {
            return "end";
        }
        return "start";
    }
    resolvePopupPlacement(measureTarget) {
        const rect = measureTarget.getBoundingClientRect();
        const estimatedHeight = this.maxHeight ?? 220;
        const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_EDGE_PADDING_PX;
        const spaceAbove = rect.top - VIEWPORT_EDGE_PADDING_PX;
        if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
            return "above";
        }
        return "below";
    }
    static ɵfac = function IdsDropdownMenuComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownMenuComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownMenuComponent, selectors: [["ids-dropdown-menu"]], contentQueries: function IdsDropdownMenuComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDropdownTriggerShellComponent, 5)(dirIndex, IdsDropdownMenuFooterComponent, 5)(dirIndex, IdsDropdownMenuGroupComponent, 4)(dirIndex, IdsDropdownMenuItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.triggerShell = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.footer = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.groupQuery = _t);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.directItemQuery = _t);
        } }, viewQuery: function IdsDropdownMenuComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.triggerMeasure = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.compositionSource = _t.first);
        } }, hostAttrs: [1, "ids-dropdown-menu"], hostVars: 4, hostBindings: function IdsDropdownMenuComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function IdsDropdownMenuComponent_resize_HostBindingHandler() { return ctx.onWindowResize(); }, i0.ɵɵresolveWindow)("click", function IdsDropdownMenuComponent_click_HostBindingHandler($event) { return ctx.onDocumentClick($event); }, i0.ɵɵresolveDocument)("keydown.escape", function IdsDropdownMenuComponent_keydown_escape_HostBindingHandler() { return ctx.onEscape(); }, i0.ɵɵresolveDocument);
        } if (rf & 2) {
            i0.ɵɵattribute("data-popup-open", ctx.isOpen && !ctx.disabled ? true : null)("data-popup-side", ctx.isOpen && !ctx.disabled ? ctx.popupPlacement : null);
            i0.ɵɵclassProp("ids-dropdown-menu--full-width", ctx.fullWidth);
        } }, inputs: { items: "items", disabled: "disabled", selectionMode: "selectionMode", showSingleSelectRadio: "showSingleSelectRadio", showSelectAllClearAll: "showSelectAllClearAll", selectAllLabel: "selectAllLabel", clearAllLabel: "clearAllLabel", selectAllChecked: "selectAllChecked", selectAllIndeterminate: "selectAllIndeterminate", clearAllDisabled: "clearAllDisabled", selectedValues: "selectedValues", maxHeight: "maxHeight", sideOffset: "sideOffset", matchTriggerWidth: "matchTriggerWidth", defaultOpen: "defaultOpen", showSearch: "showSearch", searchValue: "searchValue", searchPlaceholder: "searchPlaceholder", showSelectedPanel: "showSelectedPanel", showSelectedExpanded: "showSelectedExpanded", defaultShowSelectedExpanded: "defaultShowSelectedExpanded", showSelectedLabel: "showSelectedLabel", hideSelectedLabel: "hideSelectedLabel", fullWidth: "fullWidth", describedBy: "describedBy" }, outputs: { openChange: "openChange", searchValueChange: "searchValueChange", selectAllClick: "selectAllClick", clearAllClick: "clearAllClick", showSelectedExpandedChange: "showSelectedExpandedChange", removeSelectedTag: "removeSelectedTag", showSelectedPanelClear: "showSelectedPanelClear" }, features: [i0.ɵɵProvidersFeature([
                {
                    provide: IDS_DROPDOWN_CONTEXT,
                    useFactory: () => inject(IDS_DROPDOWN_CONTEXT, { skipSelf: true, optional: true }),
                },
            ]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c3, decls: 8, vars: 8, consts: [["triggerMeasure", ""], ["compositionSource", ""], ["type", "button", "aria-haspopup", "listbox", 1, "triggerReset", 3, "click", "disabled"], [1, "triggerMeasure"], [1, "positioner", 3, "positioner--align-end", "positioner--above", "ngStyle"], ["hidden", "", "aria-hidden", "true", 1, "composition-source"], [1, "positioner", 3, "ngStyle"], ["role", "listbox", 1, "popup", 3, "ngStyle"], [1, "searchRow"], [1, "selectAllClearAllRow"], [1, "showSelectedPanel"], [1, "optionsScrollRegion", 3, "ngStyle"], ["type", "button", 1, "footerAction"], [1, "searchField"], ["shapeName", "search-16", "variant", "mask", 1, "searchIcon", 3, "size"], [1, "searchInputWrap"], ["type", "text", 1, "searchInput", 3, "input", "keydown", "value", "placeholder"], ["type", "button", "aria-label", "Clear search", 1, "searchClearButton"], ["type", "button", "aria-label", "Clear search", 1, "searchClearButton", 3, "click"], ["shapeName", "shape-x-thick", 3, "size"], ["type", "button", 1, "selectAllButton", 3, "click"], ["aria-hidden", "true", 1, "checkboxOuter", "selectAllCheckbox"], [1, "checkboxDash"], [1, "checkboxTick"], ["type", "button", 1, "clearAllButton", 3, "click", "disabled"], [1, "showSelectedHeader"], ["type", "button", 1, "showSelectedToggle", 3, "click"], ["shapeName", "arrow-drop-tri-caret", 1, "showSelectedCaret", 3, "size"], ["type", "button", "aria-label", "Clear all selected items", 1, "showSelectedClear", 3, "click"], [1, "showSelectedTags"], [3, "label"], [3, "dismiss", "label"], ["role", "presentation", 1, "sectionHeader"], ["role", "presentation", 1, "sectionDivider"], ["type", "button", "data-selectable", "true", 1, "item", 3, "disabled"], ["type", "button", "data-selectable", "false", 1, "item", 3, "disabled"], ["type", "button", "data-selectable", "true", 1, "item", 3, "click", "disabled"], ["aria-hidden", "true", 1, "leadingControl"], [1, "checkboxOuter"], [1, "radioOuter"], [1, "radioInner"], ["type", "button", "data-selectable", "false", 1, "item", 3, "click", "disabled"], ["type", "button", 1, "footerAction", 3, "click"], [1, "footerActionButton"]], template: function IdsDropdownMenuComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c2);
            i0.ɵɵelementStart(0, "button", 2);
            i0.ɵɵlistener("click", function IdsDropdownMenuComponent_Template_button_click_0_listener() { return ctx.toggleOpen(); });
            i0.ɵɵelementStart(1, "span", 3, 0);
            i0.ɵɵprojection(3);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(4, IdsDropdownMenuComponent_Conditional_4_Template, 9, 13, "div", 4);
            i0.ɵɵelementStart(5, "div", 5, 1);
            i0.ɵɵprojection(7, 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵstyleProp("cursor", ctx.disabled ? "not-allowed" : "pointer");
            i0.ɵɵclassProp("triggerFull", ctx.fullWidth);
            i0.ɵɵproperty("disabled", ctx.disabled);
            i0.ɵɵattribute("aria-expanded", ctx.isOpen)("aria-describedby", ctx.triggerAriaDescribedBy);
            i0.ɵɵadvance(4);
            i0.ɵɵconditional(ctx.isOpen && !ctx.disabled ? 4 : -1);
        } }, dependencies: [NgStyle, IdsIconComponent, IdsDropdownTagComponent], styles: [".triggerReset[_ngcontent-%COMP%] {\n  all: unset;\n  display: flex;\n  box-sizing: border-box;\n}\n\n.triggerFull[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.triggerMeasure[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.popup[_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  box-sizing: border-box;\n  width: var(--dropdown-trigger-width, auto) !important;\n  min-width: var(--dropdown-trigger-width, auto) !important;\n  max-width: var(--dropdown-trigger-width, auto) !important;\n  \n  border-radius: 0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius);\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n  padding: 0;\n  outline: none;\n  font-family: inherit;\n  z-index: 1060;\n  overflow: clip;\n}\n\n\n.popupStandalone[_ngcontent-%COMP%] {\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-radius: var(--dropdown-menu-radius);\n  width: auto !important;\n  min-width: 186px !important;\n  max-width: none !important;\n}\n\n.searchRow[_ngcontent-%COMP%] {\n  padding: var(--padding-padding-8);\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.searchField[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border-radius: 0;\n}\n\n.searchIcon[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  background: var(--color-icon-brand-base);\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-size: contain;\n  -webkit-mask-position: center;\n  mask-repeat: no-repeat;\n  mask-size: contain;\n  mask-position: center;\n}\n\n.searchInput[_ngcontent-%COMP%] {\n  all: unset;\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.searchInput[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-neutral);\n}\n\n.searchInputWrap[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-8);\n  flex: 1 1 auto;\n  min-width: 0;\n  padding-left: var(--padding-padding-8);\n  padding-top: var(--padding-padding-4);\n  padding-bottom: var(--padding-padding-4);\n}\n\n.searchClearButton[_ngcontent-%COMP%] {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  cursor: pointer;\n}\n\n.searchClearButton[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.searchClearIcon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n\n.showSelectedPanel[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n  border-bottom: var(--border-width-border-default) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) 0;\n}\n\n.showSelectedPanel[data-expanded=\"true\"][_ngcontent-%COMP%] {\n  padding-bottom: var(--padding-padding-16);\n}\n\n.showSelectedHeader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  padding-right: var(--padding-padding-8);\n}\n\n.showSelectedToggle[_ngcontent-%COMP%] {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.showSelectedCaret[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  transition: transform 150ms ease;\n}\n\n.showSelectedClear[_ngcontent-%COMP%] {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  margin-left: auto;\n  cursor: pointer;\n}\n\n.showSelectedClear[_ngcontent-%COMP%]:focus-visible, \n.showSelectedToggle[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.showSelectedClearIcon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n\n.showSelectedTags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-end;\n  align-content: flex-end;\n  gap: var(--spacing-space-4);\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--spacing-space-8) var(--padding-padding-8) 0 var(--padding-padding-16);\n}\n\n.optionsScrollRegion[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n\n.selectAllClearAllRow[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-neutral-light);\n  background: var(--color-background-component);\n}\n\n.selectAllButton[_ngcontent-%COMP%] {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.clearAllButton[_ngcontent-%COMP%] {\n  all: unset;\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.clearAllButton[_ngcontent-%COMP%]:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n}\n\n.selectAllButton[data-checked=\"true\"][_ngcontent-%COMP%]   .selectAllCheckbox[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-icon-white);\n}\n\n.selectAllButton[data-checked=\"true\"][_ngcontent-%COMP%]:hover   .selectAllCheckbox[_ngcontent-%COMP%], \n.selectAllButton[data-checked=\"true\"][_ngcontent-%COMP%]:active   .selectAllCheckbox[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.selectAllButton[data-indeterminate=\"true\"][_ngcontent-%COMP%]   .selectAllCheckbox[_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.item[_ngcontent-%COMP%] {\n  appearance: none;\n  -webkit-appearance: none;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n  width: 100%;\n  box-sizing: border-box;\n  border: none;\n  background: var(--color-background-component);\n  text-align: left;\n  font-size: var(--font-size-body-2);\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  outline: none;\n  transition: background 80ms ease;\n  user-select: none;\n  min-height: 40px;\n}\n\n.item[data-selectable=\"false\"][_ngcontent-%COMP%] {\n  gap: var(--spacing-space-16);\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%] {\n  padding: var(--padding-padding-10) var(--padding-padding-24) var(--padding-padding-10) var(--padding-padding-16);\n  min-height: 44px;\n}\n\n.item[_ngcontent-%COMP%]:hover:not([data-disabled]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-base),\n    inset 0 -1px 0 0 var(--color-border-brand-base);\n}\n\n.item[data-highlighted][_ngcontent-%COMP%] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-base),\n    inset 0 -1px 0 0 var(--color-border-brand-base);\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:hover:not([data-disabled]), \n.item[data-selection-mode=\"single\"][data-highlighted][_ngcontent-%COMP%]:not([data-disabled]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n.item[data-focus-visible][_ngcontent-%COMP%] {\n  outline: none;\n}\n\n.item[_ngcontent-%COMP%]:focus-visible {\n  outline: none;\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:focus-visible {\n  outline: 1px solid var(--color-border-brand-base);\n  outline-offset: -1px;\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:focus-visible   .radioOuter[_ngcontent-%COMP%]::after {\n  content: none;\n}\n\n.item[data-disabled][_ngcontent-%COMP%], \n.item[_ngcontent-%COMP%]:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n  background: var(--color-background-gray-lighter);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:has(.radioOuter)[data-disabled], \n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:has(.radioOuter):disabled {\n  background: var(--color-background-component);\n  outline: none;\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:not(:has(.radioOuter))[data-disabled], \n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:not(:has(.radioOuter)):disabled {\n  background: var(--color-background-gray-lighter);\n  outline: 1px solid var(--color-border-disabled);\n}\n\n.item[data-selectable=\"false\"][data-disabled][_ngcontent-%COMP%], \n.item[data-selectable=\"false\"][_ngcontent-%COMP%]:disabled {\n  border-bottom: var(--border-width-border-1) solid var(--color-border-neutral-light);\n  box-shadow:\n    inset 0 -1px 0 0 var(--color-border-neutral-light),\n    0 -1px 0 0 var(--color-border-disabled);\n}\n\n.sectionHeader[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  padding: var(--padding-padding-6) var(--padding-padding-16);\n  border-top: var(--border-width-border-default) solid var(--color-border-accessible);\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n}\n\n.sectionHeader[_ngcontent-%COMP%]:first-child {\n  border-top: none;\n}\n\n.sectionDivider[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  background: var(--color-border-accessible);\n}\n\n.footerAction[_ngcontent-%COMP%] {\n  all: unset;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  width: 100%;\n  padding: var(--padding-padding-8) 0;\n  border-top: var(--border-width-border-default) solid var(--color-border-accessible);\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.footerActionButton[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border-radius: var(--corner-radius-radius-2);\n}\n\n.leadingControl[_ngcontent-%COMP%] {\n  display: inline-flex;\n  width: 18px;\n  height: 18px;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]   .leadingControl[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n\n.radioOuter[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n\n.radioInner[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--color-background-controls-brand-base);\n}\n\n.checkboxOuter[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border-radius: var(--corner-radius-radius-2);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--color-background-component);\n  position: relative;\n}\n\n.selectAllCheckbox[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n\n.item[data-selection-mode=\"multi\"][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n\n.checkboxTick[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  background: currentColor;\n  clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%);\n  transform: translateY(-0.5px);\n}\n\n.checkboxDash[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 2px;\n  background: var(--color-icon-brand-base);\n  border-radius: 2px;\n}\n\n.item[data-selection-mode=\"multi\"][data-focus-visible][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%]::after, \n.item[data-selection-mode=\"multi\"][_ngcontent-%COMP%]:focus-visible   .checkboxOuter[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-2);\n}\n\n.item[data-selection-mode=\"multi\"][_ngcontent-%COMP%]:not([data-selected]):not([data-indeterminate]) {\n  color: var(--color-text-neutral-strong);\n}\n\n.item[data-selected][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-icon-white);\n}\n\n.item[data-selected][_ngcontent-%COMP%] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:not(:has(.radioOuter))[data-selected] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:has(.radioOuter)[data-selected] {\n  background: var(--color-background-component);\n  color: var(--color-text-brand-strong);\n  outline: none;\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"multi\"][data-selected][_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"multi\"][data-indeterminate][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.item[_ngcontent-%COMP%]:active:not([data-disabled]) {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:active:not([data-disabled]) {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n\n\n\n.item[_ngcontent-%COMP%]:hover:not([data-disabled])   .radioOuter[_ngcontent-%COMP%], \n.item[_ngcontent-%COMP%]:active:not([data-disabled])   .radioOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-strong);\n}\n\n.item[_ngcontent-%COMP%]:hover:not([data-disabled])   .checkboxOuter[_ngcontent-%COMP%], \n.item[_ngcontent-%COMP%]:active:not([data-disabled])   .checkboxOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-strong);\n  background: var(--color-background-component);\n}\n\n\n.item[data-selected][_ngcontent-%COMP%]   .radioOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-brand-base);\n}\n\n.item[data-focus-visible][_ngcontent-%COMP%]   .radioOuter[_ngcontent-%COMP%]::after, \n.item[_ngcontent-%COMP%]:focus-visible   .radioOuter[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: 50%;\n}\n\n.item[data-selection-mode=\"single\"][data-focus-visible][_ngcontent-%COMP%]   .radioOuter[_ngcontent-%COMP%]::after, \n.item[data-selection-mode=\"single\"][_ngcontent-%COMP%]:focus-visible   .radioOuter[_ngcontent-%COMP%]::after {\n  content: none;\n}\n\n\n.item[data-selected][_ngcontent-%COMP%]:hover   .radioOuter[_ngcontent-%COMP%], \n.item[data-selected][_ngcontent-%COMP%]:active   .radioOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-strong);\n}\n\n\n.item[data-selected][_ngcontent-%COMP%]:hover   .checkboxOuter[_ngcontent-%COMP%], \n.item[data-selected][_ngcontent-%COMP%]:active   .checkboxOuter[_ngcontent-%COMP%] {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.item[data-selection-mode=\"multi\"][data-indeterminate][_ngcontent-%COMP%]:hover   .checkboxOuter[_ngcontent-%COMP%], \n.item[data-selection-mode=\"multi\"][data-indeterminate][_ngcontent-%COMP%]:active   .checkboxOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-strong);\n}\n\n\n.item[data-selectable=\"true\"][data-disabled][_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled {\n  background: var(--color-background-component);\n  color: var(--color-text-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][_ngcontent-%COMP%]   .radioOuter[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled   .radioOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-disabled);\n  background: var(--color-background-gray-lighter);\n}\n\n.item[data-selectable=\"true\"][data-disabled][_ngcontent-%COMP%]   .radioInner[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled   .radioInner[_ngcontent-%COMP%] {\n  background: var(--color-icon-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled   .checkboxOuter[_ngcontent-%COMP%] {\n  border-color: var(--color-border-disabled);\n  background: var(--color-background-gray-lighter);\n  color: var(--color-icon-inverse);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-indeterminate][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled[data-indeterminate]   .checkboxOuter[_ngcontent-%COMP%] {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-indeterminate][_ngcontent-%COMP%]   .checkboxDash[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled[data-indeterminate]   .checkboxDash[_ngcontent-%COMP%] {\n  background: var(--color-border-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-selected][_ngcontent-%COMP%]   .checkboxOuter[_ngcontent-%COMP%], \n.item[data-selectable=\"true\"][_ngcontent-%COMP%]:disabled[data-selected]   .checkboxOuter[_ngcontent-%COMP%] {\n  background: var(--color-background-gray-base);\n}\n[_nghost-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  position: relative;\n  vertical-align: top;\n}\n\n.ids-dropdown-menu--full-width[_nghost-%COMP%] {\n  width: 100%;\n}\n\n.positioner[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1060;\n  box-sizing: border-box;\n}\n\n.positioner--align-end[_ngcontent-%COMP%] {\n  left: auto;\n  right: 0;\n}\n\n.positioner--above[_ngcontent-%COMP%] {\n  top: auto;\n  bottom: 100%;\n}\n\n.popup--above[_ngcontent-%COMP%] {\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-radius: var(--dropdown-menu-radius) var(--dropdown-menu-radius) 0 0;\n  box-shadow:\n    0 -2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 -4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.search-icon[_ngcontent-%COMP%] {\n  color: var(--color-icon-brand-base);\n}\n\n\n.composition-source[_ngcontent-%COMP%] {\n  display: none !important;\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownMenuComponent, [{
        type: Component,
        args: [{ selector: "ids-dropdown-menu", standalone: true, imports: [NgStyle, IdsIconComponent, IdsDropdownTagComponent], changeDetection: ChangeDetectionStrategy.OnPush, providers: [
                    {
                        provide: IDS_DROPDOWN_CONTEXT,
                        useFactory: () => inject(IDS_DROPDOWN_CONTEXT, { skipSelf: true, optional: true }),
                    },
                ], host: {
                    class: "ids-dropdown-menu",
                    "[attr.data-popup-open]": "isOpen && !disabled ? true : null",
                    "[attr.data-popup-side]": "isOpen && !disabled ? popupPlacement : null",
                    "[class.ids-dropdown-menu--full-width]": "fullWidth",
                }, template: "<button\n  type=\"button\"\n  class=\"triggerReset\"\n  [class.triggerFull]=\"fullWidth\"\n  [disabled]=\"disabled\"\n  [style.cursor]=\"disabled ? 'not-allowed' : 'pointer'\"\n  (click)=\"toggleOpen()\"\n  [attr.aria-expanded]=\"isOpen\"\n  [attr.aria-describedby]=\"triggerAriaDescribedBy\"\n  aria-haspopup=\"listbox\"\n>\n  <span #triggerMeasure class=\"triggerMeasure\">\n    <ng-content select=\"ids-dropdown-trigger-shell\" />\n  </span>\n</button>\n\n@if (isOpen && !disabled) {\n  <div\n    class=\"positioner\"\n    [class.positioner--align-end]=\"popupAlignment === 'end'\"\n    [class.positioner--above]=\"popupPlacement === 'above'\"\n    [ngStyle]=\"positionerStyle\"\n  >\n    <div\n      class=\"popup\"\n      [class.popup--above]=\"popupPlacement === 'above'\"\n      [ngStyle]=\"popupStyle\"\n      role=\"listbox\"\n    >\n      @if (showSearch) {\n        <div class=\"searchRow\">\n          <div class=\"searchField\">\n            <ids-icon class=\"searchIcon\" shapeName=\"search-16\" variant=\"mask\" [size]=\"16\" />\n            <div class=\"searchInputWrap\">\n              <input\n                class=\"searchInput\"\n                type=\"text\"\n                [value]=\"searchValue\"\n                [placeholder]=\"searchPlaceholder\"\n                (input)=\"onSearchInput($event)\"\n                (keydown)=\"$event.stopPropagation()\"\n              />\n              @if (showSearchClear) {\n                <button\n                  type=\"button\"\n                  class=\"searchClearButton\"\n                  aria-label=\"Clear search\"\n                  (click)=\"onSearchClear()\"\n                >\n                  <ids-icon shapeName=\"shape-x-thick\" [size]=\"10\" />\n                </button>\n              }\n            </div>\n          </div>\n        </div>\n      }\n\n      @if (showSelectAllClearAll) {\n        <div class=\"selectAllClearAllRow\">\n          <button\n            type=\"button\"\n            class=\"selectAllButton\"\n            [attr.data-checked]=\"selectAllChecked ? 'true' : null\"\n            [attr.data-indeterminate]=\"selectAllIndeterminate ? 'true' : null\"\n            (click)=\"onSelectAll()\"\n          >\n            <span class=\"checkboxOuter selectAllCheckbox\" aria-hidden=\"true\">\n              @if (selectAllIndeterminate) {\n                <span class=\"checkboxDash\"></span>\n              } @else if (selectAllChecked) {\n                <span class=\"checkboxTick\"></span>\n              }\n            </span>\n            <span>{{ selectAllLabel }}</span>\n          </button>\n          <button\n            type=\"button\"\n            class=\"clearAllButton\"\n            [disabled]=\"clearAllDisabled\"\n            (click)=\"onClearAll()\"\n          >\n            {{ clearAllLabel }}\n          </button>\n        </div>\n      }\n\n      @if (showSelectedPanel && selectionMode === 'multi' && resolvedSelectedValues.length > 0) {\n        <div class=\"showSelectedPanel\" [attr.data-expanded]=\"isShowSelectedExpanded ? 'true' : null\">\n          <div class=\"showSelectedHeader\">\n            <button\n              type=\"button\"\n              class=\"showSelectedToggle\"\n              [attr.aria-expanded]=\"isShowSelectedExpanded\"\n              (click)=\"toggleShowSelectedExpanded()\"\n            >\n              <span>{{ isShowSelectedExpanded ? hideSelectedLabel : showSelectedLabel }}</span>\n              <ids-icon\n                class=\"showSelectedCaret\"\n                shapeName=\"arrow-drop-tri-caret\"\n                [size]=\"10\"\n                [style.transform]=\"isShowSelectedExpanded ? 'rotate(180deg)' : null\"\n              />\n            </button>\n            <button\n              type=\"button\"\n              class=\"showSelectedClear\"\n              aria-label=\"Clear all selected items\"\n              (click)=\"onPanelClear()\"\n            >\n              <ids-icon shapeName=\"shape-x-thick\" [size]=\"10\" />\n            </button>\n          </div>\n          @if (isShowSelectedExpanded) {\n            <div class=\"showSelectedTags\">\n              @for (tag of selectedTagItems; track tag.value) {\n                <ids-dropdown-tag\n                  [label]=\"tag.label\"\n                  (dismiss)=\"removeSelectedTag.emit(tag.value)\"\n                />\n              }\n            </div>\n          }\n        </div>\n      }\n\n      <div class=\"optionsScrollRegion\" [ngStyle]=\"optionsScrollStyle\">\n        @for (item of resolvedItems; track item.id ?? $index) {\n          @if (item.kind === 'section') {\n            <div class=\"sectionHeader\" role=\"presentation\">{{ item.label }}</div>\n          } @else if (item.kind === 'divider') {\n            <div class=\"sectionDivider\" role=\"presentation\"></div>\n          } @else if (isSelectableItem(item)) {\n            <button\n              type=\"button\"\n              class=\"item\"\n              [disabled]=\"item.disabled\"\n              [attr.data-disabled]=\"item.disabled ? 'true' : null\"\n              data-selectable=\"true\"\n              [attr.data-selection-mode]=\"selectionMode\"\n              [attr.data-selected]=\"isItemSelected(item) ? 'true' : null\"\n              [attr.data-indeterminate]=\"item.indeterminate ? 'true' : null\"\n              [attr.role]=\"itemRole(item)\"\n              [attr.aria-checked]=\"itemAriaChecked(item, isItemSelected(item))\"\n              (click)=\"onItemClick(item, $event)\"\n            >\n              @if (selectionMode === 'multi') {\n                <span class=\"leadingControl\" aria-hidden=\"true\">\n                  <span class=\"checkboxOuter\">\n                    @if (item.indeterminate) {\n                      <span class=\"checkboxDash\"></span>\n                    } @else if (isItemSelected(item)) {\n                      <span class=\"checkboxTick\"></span>\n                    }\n                  </span>\n                </span>\n              }\n              @if (selectionMode === 'single' && showSingleSelectRadio) {\n                <span class=\"leadingControl\" aria-hidden=\"true\">\n                  <span class=\"radioOuter\">\n                    @if (isItemSelected(item)) {\n                      <span class=\"radioInner\"></span>\n                    }\n                  </span>\n                </span>\n              }\n              {{ item.label }}\n            </button>\n          } @else {\n            <button\n              type=\"button\"\n              class=\"item\"\n              [disabled]=\"item.disabled\"\n              data-selectable=\"false\"\n              [attr.data-selected]=\"isItemSelected(item) ? 'true' : null\"\n              (click)=\"onItemClick(item, $event)\"\n            >\n              {{ item.label }}\n            </button>\n          }\n        }\n      </div>\n\n      @if (footerActionLabel) {\n        <button type=\"button\" class=\"footerAction\" (click)=\"onFooterAction()\">\n          <span class=\"footerActionButton\">{{ footerActionLabel }}</span>\n        </button>\n      }\n    </div>\n  </div>\n}\n\n<div #compositionSource class=\"composition-source\" hidden aria-hidden=\"true\">\n  <ng-content select=\"ids-dropdown-menu-group, ids-dropdown-menu-item, ids-dropdown-menu-footer\" />\n</div>\n", styles: [".triggerReset {\n  all: unset;\n  display: flex;\n  box-sizing: border-box;\n}\n\n.triggerFull {\n  width: 100%;\n}\n\n.triggerMeasure {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.popup {\n  background: var(--color-background-component);\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  box-sizing: border-box;\n  width: var(--dropdown-trigger-width, auto) !important;\n  min-width: var(--dropdown-trigger-width, auto) !important;\n  max-width: var(--dropdown-trigger-width, auto) !important;\n  /* Field-attached: bottom corners only (Figma Rounded Corners=True \u2192 radius-4). IDS menu radius = 0. */\n  border-radius: 0 0 var(--dropdown-menu-radius) var(--dropdown-menu-radius);\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n  padding: 0;\n  outline: none;\n  font-family: inherit;\n  z-index: 1060;\n  overflow: clip;\n}\n\n/* Detached menu (context menu, masthead help) \u2014 full border; not field-attached. */\n.popupStandalone {\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-radius: var(--dropdown-menu-radius);\n  width: auto !important;\n  min-width: 186px !important;\n  max-width: none !important;\n}\n\n.searchRow {\n  padding: var(--padding-padding-8);\n  width: 100%;\n  box-sizing: border-box;\n}\n\n.searchField {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border-radius: 0;\n}\n\n.searchIcon {\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n  background: var(--color-icon-brand-base);\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-size: contain;\n  -webkit-mask-position: center;\n  mask-repeat: no-repeat;\n  mask-size: contain;\n  mask-position: center;\n}\n\n.searchInput {\n  all: unset;\n  flex: 1 1 auto;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n}\n\n.searchInput::placeholder {\n  color: var(--color-text-neutral);\n}\n\n.searchInputWrap {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-8);\n  flex: 1 1 auto;\n  min-width: 0;\n  padding-left: var(--padding-padding-8);\n  padding-top: var(--padding-padding-4);\n  padding-bottom: var(--padding-padding-4);\n}\n\n.searchClearButton {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  cursor: pointer;\n}\n\n.searchClearButton:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.searchClearIcon {\n  flex-shrink: 0;\n}\n\n.showSelectedPanel {\n  width: 100%;\n  box-sizing: border-box;\n  border-bottom: var(--border-width-border-default) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: var(--padding-padding-8) var(--padding-padding-16) var(--padding-padding-8) 0;\n}\n\n.showSelectedPanel[data-expanded=\"true\"] {\n  padding-bottom: var(--padding-padding-16);\n}\n\n.showSelectedHeader {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  padding-right: var(--padding-padding-8);\n}\n\n.showSelectedToggle {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.showSelectedCaret {\n  flex-shrink: 0;\n  transition: transform 150ms ease;\n}\n\n.showSelectedClear {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 10px;\n  flex-shrink: 0;\n  margin-left: auto;\n  cursor: pointer;\n}\n\n.showSelectedClear:focus-visible,\n.showSelectedToggle:focus-visible {\n  outline: var(--border-width-border-default) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.showSelectedClearIcon {\n  flex-shrink: 0;\n}\n\n.showSelectedTags {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: flex-end;\n  align-content: flex-end;\n  gap: var(--spacing-space-4);\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--spacing-space-8) var(--padding-padding-8) 0 var(--padding-padding-16);\n}\n\n.optionsScrollRegion {\n  width: 100%;\n  min-width: 0;\n  box-sizing: border-box;\n}\n\n.selectAllClearAllRow {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-neutral-light);\n  background: var(--color-background-component);\n}\n\n.selectAllButton {\n  all: unset;\n  display: inline-flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.clearAllButton {\n  all: unset;\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.clearAllButton:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n}\n\n.selectAllButton[data-checked=\"true\"] .selectAllCheckbox {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-icon-white);\n}\n\n.selectAllButton[data-checked=\"true\"]:hover .selectAllCheckbox,\n.selectAllButton[data-checked=\"true\"]:active .selectAllCheckbox {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.selectAllButton[data-indeterminate=\"true\"] .selectAllCheckbox {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.item {\n  appearance: none;\n  -webkit-appearance: none;\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-8);\n  padding: var(--padding-padding-10) var(--padding-padding-16);\n  width: 100%;\n  box-sizing: border-box;\n  border: none;\n  background: var(--color-background-component);\n  text-align: left;\n  font-size: var(--font-size-body-2);\n  color: var(--color-text-neutral);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n  outline: none;\n  transition: background 80ms ease;\n  user-select: none;\n  min-height: 40px;\n}\n\n.item[data-selectable=\"false\"] {\n  gap: var(--spacing-space-16);\n}\n\n.item[data-selection-mode=\"single\"] {\n  padding: var(--padding-padding-10) var(--padding-padding-24) var(--padding-padding-10) var(--padding-padding-16);\n  min-height: 44px;\n}\n\n.item:hover:not([data-disabled]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-base),\n    inset 0 -1px 0 0 var(--color-border-brand-base);\n}\n\n.item[data-highlighted] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-base),\n    inset 0 -1px 0 0 var(--color-border-brand-base);\n}\n\n.item[data-selection-mode=\"single\"]:hover:not([data-disabled]),\n.item[data-selection-mode=\"single\"][data-highlighted]:not([data-disabled]) {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n.item[data-focus-visible] {\n  outline: none;\n}\n\n.item:focus-visible {\n  outline: none;\n}\n\n.item[data-selection-mode=\"single\"]:focus-visible {\n  outline: 1px solid var(--color-border-brand-base);\n  outline-offset: -1px;\n  border-radius: var(--corner-radius-radius-4);\n}\n\n.item[data-selection-mode=\"single\"]:focus-visible .radioOuter::after {\n  content: none;\n}\n\n.item[data-disabled],\n.item:disabled {\n  color: var(--color-text-disabled);\n  cursor: not-allowed;\n  background: var(--color-background-gray-lighter);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"single\"]:has(.radioOuter)[data-disabled],\n.item[data-selection-mode=\"single\"]:has(.radioOuter):disabled {\n  background: var(--color-background-component);\n  outline: none;\n}\n\n.item[data-selection-mode=\"single\"]:not(:has(.radioOuter))[data-disabled],\n.item[data-selection-mode=\"single\"]:not(:has(.radioOuter)):disabled {\n  background: var(--color-background-gray-lighter);\n  outline: 1px solid var(--color-border-disabled);\n}\n\n.item[data-selectable=\"false\"][data-disabled],\n.item[data-selectable=\"false\"]:disabled {\n  border-bottom: var(--border-width-border-1) solid var(--color-border-neutral-light);\n  box-shadow:\n    inset 0 -1px 0 0 var(--color-border-neutral-light),\n    0 -1px 0 0 var(--color-border-disabled);\n}\n\n.sectionHeader {\n  display: flex;\n  align-items: center;\n  padding: var(--padding-padding-6) var(--padding-padding-16);\n  border-top: var(--border-width-border-default) solid var(--color-border-accessible);\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n}\n\n.sectionHeader:first-child {\n  border-top: none;\n}\n\n.sectionDivider {\n  width: 100%;\n  height: 1px;\n  background: var(--color-border-accessible);\n}\n\n.footerAction {\n  all: unset;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  width: 100%;\n  padding: var(--padding-padding-8) 0;\n  border-top: var(--border-width-border-default) solid var(--color-border-accessible);\n  color: var(--color-text-brand-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.footerActionButton {\n  display: inline-flex;\n  align-items: center;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border-radius: var(--corner-radius-radius-2);\n}\n\n.leadingControl {\n  display: inline-flex;\n  width: 18px;\n  height: 18px;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  pointer-events: none;\n}\n\n.item[data-selection-mode=\"single\"] .leadingControl {\n  width: 16px;\n  height: 16px;\n}\n\n.radioOuter {\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n}\n\n.radioInner {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: var(--color-background-controls-brand-base);\n}\n\n.checkboxOuter {\n  width: 18px;\n  height: 18px;\n  border-radius: var(--corner-radius-radius-2);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--color-background-component);\n  position: relative;\n}\n\n.selectAllCheckbox {\n  width: 16px;\n  height: 16px;\n}\n\n.item[data-selection-mode=\"multi\"] .checkboxOuter {\n  width: 16px;\n  height: 16px;\n}\n\n.checkboxTick {\n  width: 8px;\n  height: 8px;\n  background: currentColor;\n  clip-path: polygon(0 54%, 12% 42%, 39% 67%, 86% 18%, 100% 32%, 39% 94%);\n  transform: translateY(-0.5px);\n}\n\n.checkboxDash {\n  width: 8px;\n  height: 2px;\n  background: var(--color-icon-brand-base);\n  border-radius: 2px;\n}\n\n.item[data-selection-mode=\"multi\"][data-focus-visible] .checkboxOuter::after,\n.item[data-selection-mode=\"multi\"]:focus-visible .checkboxOuter::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-2);\n}\n\n.item[data-selection-mode=\"multi\"]:not([data-selected]):not([data-indeterminate]) {\n  color: var(--color-text-neutral-strong);\n}\n\n.item[data-selected] .checkboxOuter {\n  background: var(--color-background-controls-brand-base);\n  border-color: var(--color-border-transparent-brand);\n  color: var(--color-icon-white);\n}\n\n.item[data-selected] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.item[data-selection-mode=\"single\"]:not(:has(.radioOuter))[data-selected] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"single\"]:has(.radioOuter)[data-selected] {\n  background: var(--color-background-component);\n  color: var(--color-text-brand-strong);\n  outline: none;\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"multi\"][data-selected] {\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  box-shadow: none;\n}\n\n.item[data-selection-mode=\"multi\"][data-indeterminate] .checkboxOuter {\n  background: var(--color-background-component);\n  border-color: var(--color-border-brand-base);\n}\n\n.item:active:not([data-disabled]) {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  box-shadow:\n    inset 0 1px 0 0 var(--color-border-brand-neutral),\n    inset 0 -1px 0 0 var(--color-border-brand-neutral);\n}\n\n.item[data-selection-mode=\"single\"]:active:not([data-disabled]) {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  outline: 1px solid var(--color-border-brand-neutral);\n  box-shadow: none;\n}\n\n/* --- Control-state parity (delegated from checkbox/radio specs) --- */\n\n/* Unselected hover/press: control border strengthens. */\n.item:hover:not([data-disabled]) .radioOuter,\n.item:active:not([data-disabled]) .radioOuter {\n  border-color: var(--color-border-strong);\n}\n\n.item:hover:not([data-disabled]) .checkboxOuter,\n.item:active:not([data-disabled]) .checkboxOuter {\n  border-color: var(--color-border-strong);\n  background: var(--color-background-component);\n}\n\n/* Selected default: radio ring uses brand border. */\n.item[data-selected] .radioOuter {\n  border-color: var(--color-border-brand-base);\n}\n\n.item[data-focus-visible] .radioOuter::after,\n.item:focus-visible .radioOuter::after {\n  content: \"\";\n  position: absolute;\n  inset: -4px;\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: 50%;\n}\n\n.item[data-selection-mode=\"single\"][data-focus-visible] .radioOuter::after,\n.item[data-selection-mode=\"single\"]:focus-visible .radioOuter::after {\n  content: none;\n}\n\n/* Selected hover/press: radio ring follows strong border state. */\n.item[data-selected]:hover .radioOuter,\n.item[data-selected]:active .radioOuter {\n  border-color: var(--color-border-strong);\n}\n\n/* Selected hover/press for checkbox follows controls-brand-strong fill. */\n.item[data-selected]:hover .checkboxOuter,\n.item[data-selected]:active .checkboxOuter {\n  background: var(--color-background-controls-brand-strong);\n  border-color: var(--color-border-transparent-brand);\n}\n\n.item[data-selection-mode=\"multi\"][data-indeterminate]:hover .checkboxOuter,\n.item[data-selection-mode=\"multi\"][data-indeterminate]:active .checkboxOuter {\n  border-color: var(--color-border-strong);\n}\n\n/* Figma parity: disabled selectable rows use component background + disabled controls/text. */\n.item[data-selectable=\"true\"][data-disabled],\n.item[data-selectable=\"true\"]:disabled {\n  background: var(--color-background-component);\n  color: var(--color-text-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled] .radioOuter,\n.item[data-selectable=\"true\"]:disabled .radioOuter {\n  border-color: var(--color-border-disabled);\n  background: var(--color-background-gray-lighter);\n}\n\n.item[data-selectable=\"true\"][data-disabled] .radioInner,\n.item[data-selectable=\"true\"]:disabled .radioInner {\n  background: var(--color-icon-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled] .checkboxOuter,\n.item[data-selectable=\"true\"]:disabled .checkboxOuter {\n  border-color: var(--color-border-disabled);\n  background: var(--color-background-gray-lighter);\n  color: var(--color-icon-inverse);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-indeterminate] .checkboxOuter,\n.item[data-selectable=\"true\"]:disabled[data-indeterminate] .checkboxOuter {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-indeterminate] .checkboxDash,\n.item[data-selectable=\"true\"]:disabled[data-indeterminate] .checkboxDash {\n  background: var(--color-border-disabled);\n}\n\n.item[data-selectable=\"true\"][data-disabled][data-selected] .checkboxOuter,\n.item[data-selectable=\"true\"]:disabled[data-selected] .checkboxOuter {\n  background: var(--color-background-gray-base);\n}\n:host {\n  display: inline-flex;\n  flex-direction: column;\n  position: relative;\n  vertical-align: top;\n}\n\n:host(.ids-dropdown-menu--full-width) {\n  width: 100%;\n}\n\n.positioner {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1060;\n  box-sizing: border-box;\n}\n\n.positioner--align-end {\n  left: auto;\n  right: 0;\n}\n\n.positioner--above {\n  top: auto;\n  bottom: 100%;\n}\n\n.popup--above {\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-radius: var(--dropdown-menu-radius) var(--dropdown-menu-radius) 0 0;\n  box-shadow:\n    0 -2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 -4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.search-icon {\n  color: var(--color-icon-brand-base);\n}\n\n/* Composition-only children \u2014 rendered via resolvedItems, not in-place. */\n.composition-source {\n  display: none !important;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { triggerMeasure: [{
            type: ViewChild,
            args: ["triggerMeasure"]
        }], compositionSource: [{
            type: ViewChild,
            args: ["compositionSource"]
        }], triggerShell: [{
            type: ContentChild,
            args: [IdsDropdownTriggerShellComponent]
        }], groupQuery: [{
            type: ContentChildren,
            args: [IdsDropdownMenuGroupComponent, { descendants: false }]
        }], directItemQuery: [{
            type: ContentChildren,
            args: [IdsDropdownMenuItemComponent, { descendants: false }]
        }], footer: [{
            type: ContentChild,
            args: [IdsDropdownMenuFooterComponent]
        }], items: [{
            type: Input
        }], disabled: [{
            type: Input
        }], selectionMode: [{
            type: Input
        }], showSingleSelectRadio: [{
            type: Input
        }], showSelectAllClearAll: [{
            type: Input
        }], selectAllLabel: [{
            type: Input
        }], clearAllLabel: [{
            type: Input
        }], selectAllChecked: [{
            type: Input
        }], selectAllIndeterminate: [{
            type: Input
        }], clearAllDisabled: [{
            type: Input
        }], selectedValues: [{
            type: Input
        }], maxHeight: [{
            type: Input
        }], sideOffset: [{
            type: Input
        }], matchTriggerWidth: [{
            type: Input
        }], defaultOpen: [{
            type: Input
        }], showSearch: [{
            type: Input
        }], searchValue: [{
            type: Input
        }], searchPlaceholder: [{
            type: Input
        }], showSelectedPanel: [{
            type: Input
        }], showSelectedExpanded: [{
            type: Input
        }], defaultShowSelectedExpanded: [{
            type: Input
        }], showSelectedLabel: [{
            type: Input
        }], hideSelectedLabel: [{
            type: Input
        }], fullWidth: [{
            type: Input
        }], describedBy: [{
            type: Input
        }], openChange: [{
            type: Output
        }], searchValueChange: [{
            type: Output
        }], selectAllClick: [{
            type: Output
        }], clearAllClick: [{
            type: Output
        }], showSelectedExpandedChange: [{
            type: Output
        }], removeSelectedTag: [{
            type: Output
        }], showSelectedPanelClear: [{
            type: Output
        }], onWindowResize: [{
            type: HostListener,
            args: ["window:resize"]
        }], onDocumentClick: [{
            type: HostListener,
            args: ["document:click", ["$event"]]
        }], onEscape: [{
            type: HostListener,
            args: ["document:keydown.escape"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownMenuComponent, { className: "IdsDropdownMenuComponent", filePath: "src/components/ids-dropdown/ids-dropdown-menu.component.ts", lineNumber: 59 }); })();
