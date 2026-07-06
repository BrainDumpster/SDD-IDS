import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, ViewChild, } from "@angular/core";
import { NgClass } from "@angular/common";
import { PAGINATION_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/pagination.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
const _c0 = ["perPageTrigger"];
const _c1 = ["perPageMenuLayer"];
const _c2 = ["pageOffsetTrigger"];
const _c3 = ["pageOffsetMenuLayer"];
function IdsPaginationComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5)(1, "span", 10);
    i0.ɵɵtext(2, "Show:");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 11)(4, "button", 12, 0);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_1_Template_button_click_4_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.togglePerPageMenu()); })("blur", function IdsPaginationComponent_Conditional_1_Template_button_blur_4_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPerPageTriggerBlur($event)); });
    i0.ɵɵelementStart(6, "span");
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "ids-icon", 13);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(9, "span", 10);
    i0.ɵɵtext(10, "per page");
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("disabled", ctx_r1.disabled);
    i0.ɵɵattribute("aria-expanded", ctx_r1.resolvedPerPageDropdownState !== "collapsed");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.safePageSize);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.caretIconSize);
} }
function IdsPaginationComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "span");
} }
function IdsPaginationComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 7);
    i0.ɵɵtext(1, "1 page");
    i0.ɵɵelementEnd();
} }
function IdsPaginationComponent_Conditional_5_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 22);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_5_Conditional_0_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r4); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onFirstPage()); });
    i0.ɵɵelement(1, "ids-icon", 23);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.disabled || ctx_r1.atFirstPage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.navIconSize);
} }
function IdsPaginationComponent_Conditional_5_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 17)(1, "button", 24, 1);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_5_Conditional_3_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.togglePageOffsetMenu()); })("blur", function IdsPaginationComponent_Conditional_5_Conditional_3_Template_button_blur_1_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPageOffsetTriggerBlur($event)); });
    i0.ɵɵelementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(5, "ids-icon", 25);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.disabled);
    i0.ɵɵattribute("aria-expanded", ctx_r1.resolvedPageOffsetDropdownState !== "collapsed");
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(ctx_r1.safeCurrentPage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.caretIconSize);
} }
function IdsPaginationComponent_Conditional_5_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 18)(1, "input", 26);
    i0.ɵɵlistener("input", function IdsPaginationComponent_Conditional_5_Conditional_4_Template_input_input_1_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPageInputChange($event.target.value)); })("blur", function IdsPaginationComponent_Conditional_5_Conditional_4_Template_input_blur_1_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.commitPageInput()); })("keydown", function IdsPaginationComponent_Conditional_5_Conditional_4_Template_input_keydown_1_listener($event) { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onPageInputKeydown($event)); });
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r1.pageInputValue);
} }
function IdsPaginationComponent_Conditional_5_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 27);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_5_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onLastPage()); });
    i0.ɵɵelement(1, "ids-icon", 28);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", ctx_r1.disabled || ctx_r1.atLastPage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.navIconSize);
} }
function IdsPaginationComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵconditionalCreate(0, IdsPaginationComponent_Conditional_5_Conditional_0_Template, 2, 2, "button", 14);
    i0.ɵɵelementStart(1, "button", 15);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_5_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPreviousPage()); });
    i0.ɵɵelement(2, "ids-icon", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(3, IdsPaginationComponent_Conditional_5_Conditional_3_Template, 6, 4, "div", 17)(4, IdsPaginationComponent_Conditional_5_Conditional_4_Template, 2, 1, "div", 18);
    i0.ɵɵelementStart(5, "span", 7);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(7, "button", 19);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_5_Template_button_click_7_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onNextPage()); });
    i0.ɵɵelement(8, "ids-icon", 20);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(9, IdsPaginationComponent_Conditional_5_Conditional_9_Template, 2, 2, "button", 21);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.showFirstLast ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.disabled || ctx_r1.atFirstPage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.navIconSize);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showPageOffset ? 3 : 4);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1("of ", ctx_r1.safeTotalPages);
    i0.ɵɵadvance();
    i0.ɵɵproperty("disabled", ctx_r1.disabled || ctx_r1.atLastPage);
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", ctx_r1.navIconSize);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showFirstLast ? 9 : -1);
} }
function IdsPaginationComponent_Conditional_6_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li", 30)(1, "button", 31);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_6_For_3_Template_button_click_1_listener() { const option_r9 = i0.ɵɵrestoreView(_r8).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectPageSize(option_r9)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("dropdownOptionSelected", option_r9 === ctx_r1.safePageSize);
    i0.ɵɵattribute("aria-selected", option_r9 === ctx_r1.safePageSize);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", option_r9, " ");
} }
function IdsPaginationComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul", 29, 2);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_6_Template_ul_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵrepeaterCreate(2, IdsPaginationComponent_Conditional_6_For_3_Template, 3, 4, "li", 30, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("position", "fixed")("top", (ctx_r1.perPageMenuPos == null ? null : ctx_r1.perPageMenuPos.top) ?? 0, "px")("left", (ctx_r1.perPageMenuPos == null ? null : ctx_r1.perPageMenuPos.left) ?? 0, "px")("width", (ctx_r1.perPageMenuPos == null ? null : ctx_r1.perPageMenuPos.width) ?? 90, "px");
    i0.ɵɵclassProp("dropdownMenuAbove", ctx_r1.resolvedPerPageDropdownState === "expanded-above")("dropdownMenuBelow", ctx_r1.resolvedPerPageDropdownState === "expanded-below");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.safePageSizeOptions);
} }
function IdsPaginationComponent_Conditional_7_For_3_Template(rf, ctx) { if (rf & 1) {
    const _r10 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "li", 33)(1, "button", 34);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_7_For_3_Template_button_click_1_listener() { const pageOffset_r11 = i0.ɵɵrestoreView(_r10).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.selectPageOffset(pageOffset_r11)); });
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const pageOffset_r11 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("pageOffsetOptionSelected", pageOffset_r11 === ctx_r1.safeCurrentPage);
    i0.ɵɵattribute("aria-selected", pageOffset_r11 === ctx_r1.safeCurrentPage);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", pageOffset_r11, " ");
} }
function IdsPaginationComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ul", 32, 3);
    i0.ɵɵlistener("click", function IdsPaginationComponent_Conditional_7_Template_ul_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵrepeaterCreate(2, IdsPaginationComponent_Conditional_7_For_3_Template, 3, 4, "li", 33, i0.ɵɵrepeaterTrackByIdentity);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵstyleProp("position", "fixed")("top", (ctx_r1.pageOffsetMenuPos == null ? null : ctx_r1.pageOffsetMenuPos.top) ?? 0, "px")("left", (ctx_r1.pageOffsetMenuPos == null ? null : ctx_r1.pageOffsetMenuPos.left) ?? 0, "px")("width", (ctx_r1.pageOffsetMenuPos == null ? null : ctx_r1.pageOffsetMenuPos.width) ?? 40, "px");
    i0.ɵɵclassProp("pageOffsetMenuAbove", ctx_r1.resolvedPageOffsetDropdownState === "expanded-above")("pageOffsetMenuBelow", ctx_r1.resolvedPageOffsetDropdownState === "expanded-below");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r1.offsetOptions);
} }
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function normalizePositiveOptions(options) {
    const uniquePositive = Array.from(new Set(options.filter((value) => Number.isFinite(value) && value > 0)));
    return uniquePositive.length > 0 ? uniquePositive : [25, 50, 75, 100];
}
export class IdsPaginationComponent {
    cdr;
    navIconSize = 16;
    caretIconSize = 10;
    perPageTrigger;
    perPageMenuLayer;
    pageOffsetTrigger;
    pageOffsetMenuLayer;
    currentPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.currentPage;
    totalPages = PAGINATION_SPEC_ACCURATE_DEFAULTS.totalPages;
    pageSize = PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSize;
    pageSizeOptions = [
        ...PAGINATION_SPEC_ACCURATE_DEFAULTS.pageSizeOptions,
    ];
    pageOffsetOptions = null;
    showPerPage = PAGINATION_SPEC_ACCURATE_DEFAULTS.showPerPage;
    showFirstLast = PAGINATION_SPEC_ACCURATE_DEFAULTS.showFirstLast;
    showPageOffset = PAGINATION_SPEC_ACCURATE_DEFAULTS.showPageOffset;
    dropdownState = PAGINATION_SPEC_ACCURATE_DEFAULTS.dropdownState;
    pageOffsetDropdownState = PAGINATION_SPEC_ACCURATE_DEFAULTS.pageOffsetDropdownState;
    background = PAGINATION_SPEC_ACCURATE_DEFAULTS.background;
    embeddedInDatagrid = false;
    disabled = PAGINATION_SPEC_ACCURATE_DEFAULTS.disabled;
    pageChange = new EventEmitter();
    pageSizeChange = new EventEmitter();
    firstPageNavigate = new EventEmitter();
    previousPageNavigate = new EventEmitter();
    nextPageNavigate = new EventEmitter();
    lastPageNavigate = new EventEmitter();
    perPageMenuOpen = false;
    pageOffsetMenuOpen = false;
    pageInputValue = String(this.currentPage);
    perPageMenuPos = null;
    pageOffsetMenuPos = null;
    overlayRepositionCleanup = null;
    constructor(cdr) {
        this.cdr = cdr;
    }
    get safeTotalPages() {
        return Math.max(1, this.totalPages);
    }
    get safeCurrentPage() {
        return clamp(this.currentPage, 1, this.safeTotalPages);
    }
    get safePageSizeOptions() {
        return normalizePositiveOptions(this.pageSizeOptions);
    }
    get safePageSize() {
        return this.safePageSizeOptions.includes(this.pageSize)
            ? this.pageSize
            : this.safePageSizeOptions[0];
    }
    get offsetOptions() {
        if (this.pageOffsetOptions && this.pageOffsetOptions.length > 0) {
            return normalizePositiveOptions(this.pageOffsetOptions).map((value) => clamp(value, 1, this.safeTotalPages));
        }
        return Array.from({ length: this.safeTotalPages }, (_, index) => index + 1);
    }
    get atFirstPage() {
        return this.safeCurrentPage <= 1;
    }
    get atLastPage() {
        return this.safeCurrentPage >= this.safeTotalPages;
    }
    get resolvedPerPageDropdownState() {
        if (this.dropdownState !== "collapsed") {
            return this.dropdownState;
        }
        return this.perPageMenuOpen ? "expanded-below" : "collapsed";
    }
    get resolvedPageOffsetDropdownState() {
        if (this.pageOffsetDropdownState !== "collapsed") {
            return this.pageOffsetDropdownState;
        }
        return this.pageOffsetMenuOpen ? "expanded-below" : "collapsed";
    }
    get rootClass() {
        return {
            rootWhite: this.background === "white",
            rootNone: this.background === "none",
            rootGray: this.background === "gray",
            rootEmbedded: this.embeddedInDatagrid,
        };
    }
    ngOnChanges() {
        this.pageInputValue = String(this.safeCurrentPage);
        if (this.resolvedPerPageDropdownState !== "collapsed") {
            this.bindOverlayRepositionListeners();
            this.scheduleOverlayPortalAndPosition("perPage");
        }
        if (this.resolvedPageOffsetDropdownState !== "collapsed") {
            this.bindOverlayRepositionListeners();
            this.scheduleOverlayPortalAndPosition("pageOffset");
        }
    }
    ngOnDestroy() {
        this.unbindOverlayRepositionListeners();
    }
    goToPage(nextPage) {
        if (this.disabled)
            return;
        const clamped = clamp(nextPage, 1, this.safeTotalPages);
        this.pageInputValue = String(clamped);
        this.pageChange.emit(clamped);
    }
    onFirstPage() {
        if (this.disabled || this.atFirstPage)
            return;
        this.firstPageNavigate.emit();
        this.goToPage(1);
    }
    onPreviousPage() {
        if (this.disabled || this.atFirstPage)
            return;
        this.previousPageNavigate.emit();
        this.goToPage(this.safeCurrentPage - 1);
    }
    onNextPage() {
        if (this.disabled || this.atLastPage)
            return;
        this.nextPageNavigate.emit();
        this.goToPage(this.safeCurrentPage + 1);
    }
    onLastPage() {
        if (this.disabled || this.atLastPage)
            return;
        this.lastPageNavigate.emit();
        this.goToPage(this.safeTotalPages);
    }
    onPageInputChange(value) {
        this.pageInputValue = value.replace(/[^\d]/g, "");
    }
    commitPageInput() {
        const parsed = Number.parseInt(this.pageInputValue, 10);
        if (!Number.isFinite(parsed)) {
            this.pageInputValue = String(this.safeCurrentPage);
            return;
        }
        this.goToPage(parsed);
    }
    onPageInputKeydown(event) {
        if (event.key === "Enter") {
            this.commitPageInput();
            event.target?.blur();
        }
    }
    togglePerPageMenu() {
        if (this.disabled)
            return;
        this.closePageOffsetMenu();
        this.perPageMenuOpen = !this.perPageMenuOpen;
        if (this.perPageMenuOpen) {
            this.bindOverlayRepositionListeners();
            this.scheduleOverlayPortalAndPosition("perPage");
        }
        else {
            this.closePerPageMenu();
        }
        this.cdr.markForCheck();
    }
    closePerPageMenu() {
        this.perPageMenuOpen = false;
        this.perPageMenuPos = null;
        if (this.resolvedPageOffsetDropdownState === "collapsed") {
            this.unbindOverlayRepositionListeners();
        }
        this.cdr.markForCheck();
    }
    selectPageSize(size) {
        this.pageSizeChange.emit(size);
        this.closePerPageMenu();
    }
    togglePageOffsetMenu() {
        if (this.disabled)
            return;
        this.closePerPageMenu();
        this.pageOffsetMenuOpen = !this.pageOffsetMenuOpen;
        if (this.pageOffsetMenuOpen) {
            this.bindOverlayRepositionListeners();
            this.scheduleOverlayPortalAndPosition("pageOffset");
        }
        else {
            this.closePageOffsetMenu();
        }
        this.cdr.markForCheck();
    }
    closePageOffsetMenu() {
        this.pageOffsetMenuOpen = false;
        this.pageOffsetMenuPos = null;
        if (this.resolvedPerPageDropdownState === "collapsed") {
            this.unbindOverlayRepositionListeners();
        }
        this.cdr.markForCheck();
    }
    selectPageOffset(page) {
        this.goToPage(page);
        this.closePageOffsetMenu();
    }
    onPerPageTriggerBlur(event) {
        const nextTarget = event.relatedTarget;
        if (nextTarget?.closest("[data-ids-pagination-per-page-menu]"))
            return;
        this.closePerPageMenu();
    }
    onPageOffsetTriggerBlur(event) {
        const nextTarget = event.relatedTarget;
        if (nextTarget?.closest("[data-ids-pagination-page-offset-menu]"))
            return;
        this.closePageOffsetMenu();
    }
    onViewportChange() {
        if (this.resolvedPerPageDropdownState !== "collapsed") {
            this.updatePerPageMenuPos();
        }
        if (this.resolvedPageOffsetDropdownState !== "collapsed") {
            this.updatePageOffsetMenuPos();
        }
        this.cdr.markForCheck();
    }
    updatePerPageMenuPos() {
        const trigger = this.perPageTrigger?.nativeElement;
        const menu = this.perPageMenuLayer?.nativeElement;
        if (!trigger)
            return;
        const rect = trigger.getBoundingClientRect();
        const width = rect.width;
        const left = rect.left;
        if (this.resolvedPerPageDropdownState === "expanded-above") {
            const menuHeight = menu?.getBoundingClientRect().height ?? 0;
            this.perPageMenuPos = { top: rect.top + 1 - menuHeight, left, width };
            return;
        }
        this.perPageMenuPos = { top: rect.top + rect.height - 1, left, width };
    }
    updatePageOffsetMenuPos() {
        const trigger = this.pageOffsetTrigger?.nativeElement;
        const menu = this.pageOffsetMenuLayer?.nativeElement;
        if (!trigger)
            return;
        const rect = trigger.getBoundingClientRect();
        const width = rect.width;
        const left = rect.left;
        if (this.resolvedPageOffsetDropdownState === "expanded-above") {
            const menuHeight = menu?.getBoundingClientRect().height ?? 0;
            this.pageOffsetMenuPos = { top: rect.top + 1 - menuHeight, left, width };
            return;
        }
        this.pageOffsetMenuPos = { top: rect.top + rect.height - 1, left, width };
    }
    portalToBody(el) {
        if (el && el.parentElement !== document.body) {
            document.body.appendChild(el);
        }
    }
    scheduleOverlayPortalAndPosition(kind) {
        requestAnimationFrame(() => {
            if (kind === "perPage" && this.resolvedPerPageDropdownState === "collapsed")
                return;
            if (kind === "pageOffset" && this.resolvedPageOffsetDropdownState === "collapsed")
                return;
            if (kind === "perPage") {
                this.portalToBody(this.perPageMenuLayer?.nativeElement);
                this.updatePerPageMenuPos();
            }
            else {
                this.portalToBody(this.pageOffsetMenuLayer?.nativeElement);
                this.updatePageOffsetMenuPos();
            }
            this.cdr.markForCheck();
            requestAnimationFrame(() => {
                if (kind === "perPage" && this.resolvedPerPageDropdownState === "collapsed")
                    return;
                if (kind === "pageOffset" && this.resolvedPageOffsetDropdownState === "collapsed")
                    return;
                if (kind === "perPage") {
                    this.updatePerPageMenuPos();
                }
                else {
                    this.updatePageOffsetMenuPos();
                }
                this.cdr.markForCheck();
            });
        });
    }
    bindOverlayRepositionListeners() {
        if (this.overlayRepositionCleanup)
            return;
        const onUpdate = () => {
            let changed = false;
            if (this.resolvedPerPageDropdownState !== "collapsed") {
                this.updatePerPageMenuPos();
                changed = true;
            }
            if (this.resolvedPageOffsetDropdownState !== "collapsed") {
                this.updatePageOffsetMenuPos();
                changed = true;
            }
            if (changed)
                this.cdr.markForCheck();
        };
        window.addEventListener("resize", onUpdate);
        window.addEventListener("scroll", onUpdate, true);
        this.overlayRepositionCleanup = () => {
            window.removeEventListener("resize", onUpdate);
            window.removeEventListener("scroll", onUpdate, true);
            this.overlayRepositionCleanup = null;
        };
    }
    unbindOverlayRepositionListeners() {
        this.overlayRepositionCleanup?.();
        this.overlayRepositionCleanup = null;
    }
    static ɵfac = function IdsPaginationComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsPaginationComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsPaginationComponent, selectors: [["ids-pagination"]], viewQuery: function IdsPaginationComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5)(_c2, 5)(_c3, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.perPageTrigger = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.perPageMenuLayer = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pageOffsetTrigger = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.pageOffsetMenuLayer = _t.first);
        } }, hostBindings: function IdsPaginationComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function IdsPaginationComponent_resize_HostBindingHandler() { return ctx.onViewportChange(); }, i0.ɵɵresolveWindow)("scroll", function IdsPaginationComponent_scroll_HostBindingHandler() { return ctx.onViewportChange(); }, i0.ɵɵresolveWindow);
        } }, inputs: { currentPage: "currentPage", totalPages: "totalPages", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", pageOffsetOptions: "pageOffsetOptions", showPerPage: "showPerPage", showFirstLast: "showFirstLast", showPageOffset: "showPageOffset", dropdownState: "dropdownState", pageOffsetDropdownState: "pageOffsetDropdownState", background: "background", embeddedInDatagrid: "embeddedInDatagrid", disabled: "disabled" }, outputs: { pageChange: "pageChange", pageSizeChange: "pageSizeChange", firstPageNavigate: "firstPageNavigate", previousPageNavigate: "previousPageNavigate", nextPageNavigate: "nextPageNavigate", lastPageNavigate: "lastPageNavigate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 8, vars: 5, consts: [["perPageTrigger", ""], ["pageOffsetTrigger", ""], ["perPageMenuLayer", ""], ["pageOffsetMenuLayer", ""], ["aria-label", "Pagination", 1, "root", 3, "ngClass"], [1, "resultsGroup"], [1, "pageNavGroup"], [1, "countText"], ["data-ids-pagination-per-page-menu", "", "role", "listbox", "aria-label", "Items per page options", 1, "dropdownMenu", "dropdownMenuPortaled", 3, "dropdownMenuAbove", "dropdownMenuBelow", "position", "top", "left", "width"], ["data-ids-pagination-page-offset-menu", "", "role", "listbox", "aria-label", "Page offsets", 1, "pageOffsetMenu", "pageOffsetMenuPortaled", 3, "pageOffsetMenuAbove", "pageOffsetMenuBelow", "position", "top", "left", "width"], [1, "label"], [1, "dropdownWrap"], ["type", "button", "aria-haspopup", "listbox", "aria-label", "Items per page", 1, "dropdownTrigger", 3, "click", "blur", "disabled"], ["shapeName", "arrow-drop-tri-caret", "className", "caretIcon", "variant", "mask", 3, "size"], ["type", "button", "aria-label", "First page", 1, "iconButton", 3, "disabled"], ["type", "button", "aria-label", "Previous page", 1, "iconButton", 3, "click", "disabled"], ["shapeName", "chev-left", "className", "navIcon", "variant", "mask", 3, "size"], [1, "pageOffsetWrap"], [1, "pageInputWrap"], ["type", "button", "aria-label", "Next page", 1, "iconButton", 3, "click", "disabled"], ["shapeName", "chev-right", "className", "navIcon", "variant", "mask", 3, "size"], ["type", "button", "aria-label", "Last page", 1, "iconButton", 3, "disabled"], ["type", "button", "aria-label", "First page", 1, "iconButton", 3, "click", "disabled"], ["shapeName", "double-chev-left", "className", "navIcon", "variant", "mask", 3, "size"], ["type", "button", "aria-haspopup", "listbox", "aria-label", "Page offset", 1, "pageOffsetTrigger", 3, "click", "blur", "disabled"], ["shapeName", "arrow-drop-tri-caret", "className", "pageOffsetCaretIcon", "variant", "mask", 3, "size"], ["aria-label", "Current page", 1, "pageInput", 3, "input", "blur", "keydown", "value"], ["type", "button", "aria-label", "Last page", 1, "iconButton", 3, "click", "disabled"], ["shapeName", "double-chev-right", "className", "navIcon", "variant", "mask", 3, "size"], ["data-ids-pagination-per-page-menu", "", "role", "listbox", "aria-label", "Items per page options", 1, "dropdownMenu", "dropdownMenuPortaled", 3, "click"], [1, "dropdownOptionWrap"], ["type", "button", "role", "option", 1, "dropdownOption", 3, "click"], ["data-ids-pagination-page-offset-menu", "", "role", "listbox", "aria-label", "Page offsets", 1, "pageOffsetMenu", "pageOffsetMenuPortaled", 3, "click"], [1, "pageOffsetOptionWrap"], ["type", "button", "role", "option", 1, "pageOffsetOption", 3, "click"]], template: function IdsPaginationComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "nav", 4);
            i0.ɵɵconditionalCreate(1, IdsPaginationComponent_Conditional_1_Template, 11, 4, "div", 5)(2, IdsPaginationComponent_Conditional_2_Template, 1, 0, "span");
            i0.ɵɵelementStart(3, "div", 6);
            i0.ɵɵconditionalCreate(4, IdsPaginationComponent_Conditional_4_Template, 2, 0, "span", 7)(5, IdsPaginationComponent_Conditional_5_Template, 10, 8);
            i0.ɵɵelementEnd()();
            i0.ɵɵconditionalCreate(6, IdsPaginationComponent_Conditional_6_Template, 4, 12, "ul", 8);
            i0.ɵɵconditionalCreate(7, IdsPaginationComponent_Conditional_7_Template, 4, 12, "ul", 9);
        } if (rf & 2) {
            i0.ɵɵproperty("ngClass", ctx.rootClass);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPerPage ? 1 : 2);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.safeTotalPages <= 1 ? 4 : 5);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.resolvedPerPageDropdownState !== "collapsed" ? 6 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.resolvedPageOffsetDropdownState !== "collapsed" ? 7 : -1);
        } }, dependencies: [NgClass, IdsIconComponent], styles: ["@import \"../../../../components/ids-theme.css\";\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n\n.root[_ngcontent-%COMP%] {\n  position: relative;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-16);\n  height: 48px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  padding: var(--padding-padding-8) calc(var(--padding-padding-16) * 2) var(--padding-padding-8)\n    var(--padding-padding-24);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.rootNone[_ngcontent-%COMP%] {\n  background: transparent;\n}\n\n.rootGray[_ngcontent-%COMP%] {\n  background: var(--color-background-surface-1);\n}\n\n.rootWhite[_ngcontent-%COMP%] {\n  background: var(--color-background-component);\n}\n\n.root.rootEmbedded[_ngcontent-%COMP%] {\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.resultsGroup[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n}\n\n.label[_ngcontent-%COMP%] {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.dropdownWrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.dropdownTrigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-10);\n  width: 90px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  padding: 6px var(--padding-padding-16);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.dropdownTrigger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: var(--color-border-strong);\n}\n\n.dropdownTrigger[_ngcontent-%COMP%]:focus-visible, \n.iconButton[_ngcontent-%COMP%]:focus-visible, \n.dropdownOption[_ngcontent-%COMP%]:focus-visible, \n.pageInput[_ngcontent-%COMP%]:focus-visible, \n.pageOffsetTrigger[_ngcontent-%COMP%]:focus-visible, \n.pageOffsetOption[_ngcontent-%COMP%]:focus-visible {\n  outline: var(--border-width-border-default, 1px) solid var(--color-border-brand-base);\n  outline-offset: 4px;\n  border-radius: 4px;\n}\n\n.dropdownTrigger[_ngcontent-%COMP%]:disabled, \n.iconButton[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n}\n\n.dropdownTrigger[_ngcontent-%COMP%]:disabled     .caretIcon {\n  color: var(--color-icon-disabled);\n}\n\n.dropdownTrigger[_ngcontent-%COMP%]:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n  .caretIcon {\n  color: var(--color-icon-neutral);\n}\n\n\n.dropdownMenu[_ngcontent-%COMP%] {\n  width: 90px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  background: var(--color-background-component);\n  list-style: none;\n  margin: 0;\n  padding: 0 1px;\n  overflow: clip;\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.dropdownMenuPortaled[_ngcontent-%COMP%] {\n  z-index: 10000;\n}\n\n.dropdownMenuBelow[_ngcontent-%COMP%] {\n  border-top: none;\n}\n\n.dropdownMenuAbove[_ngcontent-%COMP%] {\n  border-bottom: none;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.dropdownOptionWrap[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n}\n\n.dropdownOption[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid transparent;\n  border-bottom: var(--border-width-border-default, 1px) solid transparent;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  text-align: left;\n  padding: 10px var(--padding-padding-24) 10px var(--padding-padding-16);\n  min-height: 40px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.dropdownOption[_ngcontent-%COMP%]:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.dropdownOption[_ngcontent-%COMP%]:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.dropdownOptionSelected[_ngcontent-%COMP%] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageNavGroup[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n}\n\n.iconButton[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  color: var(--color-icon-brand-base);\n  cursor: pointer;\n}\n\n.iconButton[_ngcontent-%COMP%]:disabled {\n  color: var(--color-icon-disabled);\n}\n\n  .navIcon {\n  color: currentColor;\n}\n\n.pageInputWrap[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  box-sizing: border-box;\n  width: 40px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: 5px 0 6px;\n}\n\n.pageInput[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  border: 0;\n  background: transparent;\n  color: var(--color-text-neutral);\n  text-align: center;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  padding: 0;\n}\n\n.pageInput[_ngcontent-%COMP%]:focus {\n  outline: 0;\n}\n\n.pageOffsetWrap[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.pageOffsetTrigger[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-10);\n  width: 40px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  padding: 5px 6px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.pageOffsetTrigger[_ngcontent-%COMP%]:hover:not(:disabled) {\n  border-color: var(--color-border-strong);\n}\n\n.pageOffsetTrigger[_ngcontent-%COMP%]:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.pageOffsetTrigger[_ngcontent-%COMP%]:disabled     .pageOffsetCaretIcon {\n  color: var(--color-icon-disabled);\n}\n\n  .pageOffsetCaretIcon {\n  color: var(--color-icon-neutral);\n}\n\n\n.pageOffsetMenu[_ngcontent-%COMP%] {\n  width: 40px;\n  max-height: 160px;\n  overflow-y: auto;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  background: var(--color-background-component);\n  list-style: none;\n  margin: 0;\n  padding: 0 1px;\n  overflow-x: clip;\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.pageOffsetMenuPortaled[_ngcontent-%COMP%] {\n  z-index: 10000;\n}\n\n.pageOffsetMenuBelow[_ngcontent-%COMP%] {\n  border-top: none;\n}\n\n.pageOffsetMenuAbove[_ngcontent-%COMP%] {\n  border-bottom: none;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.pageOffsetOptionWrap[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n}\n\n.pageOffsetOption[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid transparent;\n  border-bottom: var(--border-width-border-default, 1px) solid transparent;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  text-align: right;\n  padding: 10px 6px;\n  min-height: 40px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.pageOffsetOption[_ngcontent-%COMP%]:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageOffsetOption[_ngcontent-%COMP%]:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageOffsetOptionSelected[_ngcontent-%COMP%] {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.countText[_ngcontent-%COMP%] {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsPaginationComponent, [{
        type: Component,
        args: [{ selector: "ids-pagination", standalone: true, imports: [NgClass, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: "<nav class=\"root\" [ngClass]=\"rootClass\" aria-label=\"Pagination\">\n  @if (showPerPage) {\n    <div class=\"resultsGroup\">\n      <span class=\"label\">Show:</span>\n      <div class=\"dropdownWrap\">\n        <button\n          #perPageTrigger\n          class=\"dropdownTrigger\"\n          type=\"button\"\n          [disabled]=\"disabled\"\n          aria-haspopup=\"listbox\"\n          [attr.aria-expanded]=\"resolvedPerPageDropdownState !== 'collapsed'\"\n          aria-label=\"Items per page\"\n          (click)=\"togglePerPageMenu()\"\n          (blur)=\"onPerPageTriggerBlur($event)\"\n        >\n          <span>{{ safePageSize }}</span>\n          <ids-icon\n            shapeName=\"arrow-drop-tri-caret\"\n            className=\"caretIcon\"\n            [size]=\"caretIconSize\"\n            variant=\"mask\"\n          />\n        </button>\n      </div>\n      <span class=\"label\">per page</span>\n    </div>\n  } @else {\n    <span></span>\n  }\n\n  <div class=\"pageNavGroup\">\n    @if (safeTotalPages <= 1) {\n      <span class=\"countText\">1 page</span>\n    } @else {\n      @if (showFirstLast) {\n        <button\n          class=\"iconButton\"\n          type=\"button\"\n          [disabled]=\"disabled || atFirstPage\"\n          aria-label=\"First page\"\n          (click)=\"onFirstPage()\"\n        >\n          <ids-icon\n            shapeName=\"double-chev-left\"\n            className=\"navIcon\"\n            [size]=\"navIconSize\"\n            variant=\"mask\"\n          />\n        </button>\n      }\n      <button\n        class=\"iconButton\"\n        type=\"button\"\n        [disabled]=\"disabled || atFirstPage\"\n        aria-label=\"Previous page\"\n        (click)=\"onPreviousPage()\"\n      >\n        <ids-icon\n          shapeName=\"chev-left\"\n          className=\"navIcon\"\n          [size]=\"navIconSize\"\n          variant=\"mask\"\n        />\n      </button>\n      @if (showPageOffset) {\n        <div class=\"pageOffsetWrap\">\n          <button\n            #pageOffsetTrigger\n            class=\"pageOffsetTrigger\"\n            type=\"button\"\n            [disabled]=\"disabled\"\n            aria-haspopup=\"listbox\"\n            [attr.aria-expanded]=\"resolvedPageOffsetDropdownState !== 'collapsed'\"\n            aria-label=\"Page offset\"\n            (click)=\"togglePageOffsetMenu()\"\n            (blur)=\"onPageOffsetTriggerBlur($event)\"\n          >\n            <span>{{ safeCurrentPage }}</span>\n            <ids-icon\n              shapeName=\"arrow-drop-tri-caret\"\n              className=\"pageOffsetCaretIcon\"\n              [size]=\"caretIconSize\"\n              variant=\"mask\"\n            />\n          </button>\n        </div>\n      } @else {\n        <div class=\"pageInputWrap\">\n          <input\n            class=\"pageInput\"\n            [value]=\"pageInputValue\"\n            aria-label=\"Current page\"\n            (input)=\"onPageInputChange($any($event.target).value)\"\n            (blur)=\"commitPageInput()\"\n            (keydown)=\"onPageInputKeydown($event)\"\n          />\n        </div>\n      }\n      <span class=\"countText\">of {{ safeTotalPages }}</span>\n      <button\n        class=\"iconButton\"\n        type=\"button\"\n        [disabled]=\"disabled || atLastPage\"\n        aria-label=\"Next page\"\n        (click)=\"onNextPage()\"\n      >\n        <ids-icon\n          shapeName=\"chev-right\"\n          className=\"navIcon\"\n          [size]=\"navIconSize\"\n          variant=\"mask\"\n        />\n      </button>\n      @if (showFirstLast) {\n        <button\n          class=\"iconButton\"\n          type=\"button\"\n          [disabled]=\"disabled || atLastPage\"\n          aria-label=\"Last page\"\n          (click)=\"onLastPage()\"\n        >\n          <ids-icon\n            shapeName=\"double-chev-right\"\n            className=\"navIcon\"\n            [size]=\"navIconSize\"\n            variant=\"mask\"\n          />\n        </button>\n      }\n    }\n  </div>\n</nav>\n\n@if (resolvedPerPageDropdownState !== \"collapsed\") {\n  <ul\n    #perPageMenuLayer\n    class=\"dropdownMenu dropdownMenuPortaled\"\n    [class.dropdownMenuAbove]=\"resolvedPerPageDropdownState === 'expanded-above'\"\n    [class.dropdownMenuBelow]=\"resolvedPerPageDropdownState === 'expanded-below'\"\n    data-ids-pagination-per-page-menu\n    [style.position]=\"'fixed'\"\n    [style.top.px]=\"perPageMenuPos?.top ?? 0\"\n    [style.left.px]=\"perPageMenuPos?.left ?? 0\"\n    [style.width.px]=\"perPageMenuPos?.width ?? 90\"\n    role=\"listbox\"\n    aria-label=\"Items per page options\"\n    (click)=\"$event.stopPropagation()\"\n  >\n    @for (option of safePageSizeOptions; track option) {\n      <li class=\"dropdownOptionWrap\">\n        <button\n          type=\"button\"\n          role=\"option\"\n          class=\"dropdownOption\"\n          [class.dropdownOptionSelected]=\"option === safePageSize\"\n          [attr.aria-selected]=\"option === safePageSize\"\n          (click)=\"selectPageSize(option)\"\n        >\n          {{ option }}\n        </button>\n      </li>\n    }\n  </ul>\n}\n\n@if (resolvedPageOffsetDropdownState !== \"collapsed\") {\n  <ul\n    #pageOffsetMenuLayer\n    class=\"pageOffsetMenu pageOffsetMenuPortaled\"\n    [class.pageOffsetMenuAbove]=\"resolvedPageOffsetDropdownState === 'expanded-above'\"\n    [class.pageOffsetMenuBelow]=\"resolvedPageOffsetDropdownState === 'expanded-below'\"\n    data-ids-pagination-page-offset-menu\n    [style.position]=\"'fixed'\"\n    [style.top.px]=\"pageOffsetMenuPos?.top ?? 0\"\n    [style.left.px]=\"pageOffsetMenuPos?.left ?? 0\"\n    [style.width.px]=\"pageOffsetMenuPos?.width ?? 40\"\n    role=\"listbox\"\n    aria-label=\"Page offsets\"\n    (click)=\"$event.stopPropagation()\"\n  >\n    @for (pageOffset of offsetOptions; track pageOffset) {\n      <li class=\"pageOffsetOptionWrap\">\n        <button\n          type=\"button\"\n          role=\"option\"\n          class=\"pageOffsetOption\"\n          [class.pageOffsetOptionSelected]=\"pageOffset === safeCurrentPage\"\n          [attr.aria-selected]=\"pageOffset === safeCurrentPage\"\n          (click)=\"selectPageOffset(pageOffset)\"\n        >\n          {{ pageOffset }}\n        </button>\n      </li>\n    }\n  </ul>\n}\n", styles: ["@import \"../../../../components/ids-theme.css\";\n\n:host {\n  display: block;\n  width: 100%;\n}\n\n.root {\n  position: relative;\n  box-sizing: border-box;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-16);\n  height: 48px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  padding: var(--padding-padding-8) calc(var(--padding-padding-16) * 2) var(--padding-padding-8)\n    var(--padding-padding-24);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.rootNone {\n  background: transparent;\n}\n\n.rootGray {\n  background: var(--color-background-surface-1);\n}\n\n.rootWhite {\n  background: var(--color-background-component);\n}\n\n.root.rootEmbedded {\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.resultsGroup {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n}\n\n.label {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.dropdownWrap {\n  position: relative;\n}\n\n.dropdownTrigger {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-10);\n  width: 90px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  padding: 6px var(--padding-padding-16);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.dropdownTrigger:hover:not(:disabled) {\n  border-color: var(--color-border-strong);\n}\n\n.dropdownTrigger:focus-visible,\n.iconButton:focus-visible,\n.dropdownOption:focus-visible,\n.pageInput:focus-visible,\n.pageOffsetTrigger:focus-visible,\n.pageOffsetOption:focus-visible {\n  outline: var(--border-width-border-default, 1px) solid var(--color-border-brand-base);\n  outline-offset: 4px;\n  border-radius: 4px;\n}\n\n.dropdownTrigger:disabled,\n.iconButton:disabled {\n  cursor: not-allowed;\n}\n\n.dropdownTrigger:disabled ::ng-deep .caretIcon {\n  color: var(--color-icon-disabled);\n}\n\n.dropdownTrigger:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n::ng-deep .caretIcon {\n  color: var(--color-icon-neutral);\n}\n\n/* Position (`fixed` + `top`/`left`/`width`) set inline when portaled to `document.body` */\n.dropdownMenu {\n  width: 90px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  background: var(--color-background-component);\n  list-style: none;\n  margin: 0;\n  padding: 0 1px;\n  overflow: clip;\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.dropdownMenuPortaled {\n  z-index: 10000;\n}\n\n.dropdownMenuBelow {\n  border-top: none;\n}\n\n.dropdownMenuAbove {\n  border-bottom: none;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.dropdownOptionWrap {\n  margin: 0;\n  padding: 0;\n}\n\n.dropdownOption {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid transparent;\n  border-bottom: var(--border-width-border-default, 1px) solid transparent;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  text-align: left;\n  padding: 10px var(--padding-padding-24) 10px var(--padding-padding-16);\n  min-height: 40px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.dropdownOption:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.dropdownOption:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.dropdownOptionSelected {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageNavGroup {\n  display: flex;\n  align-items: center;\n  gap: var(--spacing-space-16);\n}\n\n.iconButton {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  border: 0;\n  padding: 0;\n  background: transparent;\n  color: var(--color-icon-brand-base);\n  cursor: pointer;\n}\n\n.iconButton:disabled {\n  color: var(--color-icon-disabled);\n}\n\n::ng-deep .navIcon {\n  color: currentColor;\n}\n\n.pageInputWrap {\n  display: inline-flex;\n  align-items: center;\n  box-sizing: border-box;\n  width: 40px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  padding: 5px 0 6px;\n}\n\n.pageInput {\n  width: 100%;\n  min-width: 0;\n  border: 0;\n  background: transparent;\n  color: var(--color-text-neutral);\n  text-align: center;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  padding: 0;\n}\n\n.pageInput:focus {\n  outline: 0;\n}\n\n.pageOffsetWrap {\n  position: relative;\n}\n\n.pageOffsetTrigger {\n  display: inline-flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--spacing-space-10);\n  width: 40px;\n  height: 32px;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  padding: 5px 6px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.pageOffsetTrigger:hover:not(:disabled) {\n  border-color: var(--color-border-strong);\n}\n\n.pageOffsetTrigger:disabled {\n  background: var(--color-background-gray-lighter);\n  border-color: var(--color-border-disabled);\n  color: var(--color-text-disabled);\n}\n\n.pageOffsetTrigger:disabled ::ng-deep .pageOffsetCaretIcon {\n  color: var(--color-icon-disabled);\n}\n\n::ng-deep .pageOffsetCaretIcon {\n  color: var(--color-icon-neutral);\n}\n\n/* Position (`fixed` + `top`/`left`/`width`) set inline when portaled to `document.body` */\n.pageOffsetMenu {\n  width: 40px;\n  max-height: 160px;\n  overflow-y: auto;\n  border: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n  border-top: none;\n  background: var(--color-background-component);\n  list-style: none;\n  margin: 0;\n  padding: 0 1px;\n  overflow-x: clip;\n  box-shadow:\n    0 4px 4px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08)),\n    0 2px 2px 0 var(--shadow-shadow-4-drop-shadow-4-color, rgba(37, 37, 37, 0.08));\n}\n\n.pageOffsetMenuPortaled {\n  z-index: 10000;\n}\n\n.pageOffsetMenuBelow {\n  border-top: none;\n}\n\n.pageOffsetMenuAbove {\n  border-bottom: none;\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-accessible);\n}\n\n.pageOffsetOptionWrap {\n  margin: 0;\n  padding: 0;\n}\n\n.pageOffsetOption {\n  display: block;\n  width: 100%;\n  box-sizing: border-box;\n  border: 0;\n  border-top: var(--border-width-border-default, 1px) solid transparent;\n  border-bottom: var(--border-width-border-default, 1px) solid transparent;\n  background: var(--color-background-component);\n  color: var(--color-text-neutral);\n  text-align: right;\n  padding: 10px 6px;\n  min-height: 40px;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.pageOffsetOption:hover {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-neutral);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageOffsetOption:active {\n  background: var(--color-background-brand-light);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.pageOffsetOptionSelected {\n  background: var(--color-background-brand-lighter);\n  color: var(--color-text-brand-strong);\n  border-top: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n  border-bottom: var(--border-width-border-default, 1px) solid var(--color-border-brand-neutral);\n}\n\n.countText {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { perPageTrigger: [{
            type: ViewChild,
            args: ["perPageTrigger"]
        }], perPageMenuLayer: [{
            type: ViewChild,
            args: ["perPageMenuLayer"]
        }], pageOffsetTrigger: [{
            type: ViewChild,
            args: ["pageOffsetTrigger"]
        }], pageOffsetMenuLayer: [{
            type: ViewChild,
            args: ["pageOffsetMenuLayer"]
        }], currentPage: [{
            type: Input
        }], totalPages: [{
            type: Input
        }], pageSize: [{
            type: Input
        }], pageSizeOptions: [{
            type: Input
        }], pageOffsetOptions: [{
            type: Input
        }], showPerPage: [{
            type: Input
        }], showFirstLast: [{
            type: Input
        }], showPageOffset: [{
            type: Input
        }], dropdownState: [{
            type: Input
        }], pageOffsetDropdownState: [{
            type: Input
        }], background: [{
            type: Input
        }], embeddedInDatagrid: [{
            type: Input
        }], disabled: [{
            type: Input
        }], pageChange: [{
            type: Output
        }], pageSizeChange: [{
            type: Output
        }], firstPageNavigate: [{
            type: Output
        }], previousPageNavigate: [{
            type: Output
        }], nextPageNavigate: [{
            type: Output
        }], lastPageNavigate: [{
            type: Output
        }], onViewportChange: [{
            type: HostListener,
            args: ["window:resize"]
        }, {
            type: HostListener,
            args: ["window:scroll"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsPaginationComponent, { className: "IdsPaginationComponent", filePath: "src/components/ids-pagination/ids-pagination.component.ts", lineNumber: 43 }); })();
