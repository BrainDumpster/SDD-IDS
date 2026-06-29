import { ChangeDetectionStrategy, Component, ContentChild, EventEmitter, HostListener, Input, Output, ViewChild, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MODAL_API_DEFAULTS, MODAL_DIALOG_TYPE_ICON, MODAL_TWO_BUTTON_DIALOG_TYPES, } from "../../../../component-contracts/ids/modal.contract.js";
import { IdsButtonComponent } from "../ids-button/ids-button.component";
import { IdsCheckboxComponent } from "../ids-checkbox/ids-checkbox.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_MODAL_CONTEXT } from "./ids-modal-context";
import { IdsModalBodyComponent } from "./ids-modal-body.component";
import { IdsModalFooterComponent } from "./ids-modal-footer.component";
import { IdsModalTitleComponent } from "./ids-modal-title.component";
import * as i0 from "@angular/core";
const _c0 = ["dialogRef"];
const _c1 = ["legacyContentRef"];
const _c2 = [[["ids-modal-title"]], [["ids-modal-body"]], [["ids-modal-footer"]], "*"];
const _c3 = ["ids-modal-title", "ids-modal-body", "ids-modal-footer", "*"];
const _forTrack0 = ($index, $item) => $item.id;
function IdsModalComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "span", 5);
    i0.ɵɵelement(1, "ids-icon", 10);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("shapeName", ctx_r0.severityIconSlug)("size", 24);
} }
function IdsModalComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h2", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("id", ctx_r0.titleId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.title);
} }
function IdsModalComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    const _r2 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 11);
    i0.ɵɵlistener("click", function IdsModalComponent_Conditional_8_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r2); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.closeModal()); });
    i0.ɵɵelement(1, "ids-icon", 12);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 16);
} }
function IdsModalComponent_Conditional_10_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 13);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("id", ctx_r0.descriptionId);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.description);
} }
function IdsModalComponent_Conditional_10_Conditional_3_For_2_Template(rf, ctx) { if (rf & 1) {
    const _r4 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function IdsModalComponent_Conditional_10_Conditional_3_For_2_Template_button_click_0_listener() { const page_r5 = i0.ɵɵrestoreView(_r4).$implicit; const ctx_r0 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r0.selectPage(page_r5.id)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const page_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵclassProp("ids-modal__tab--active", ctx_r0.isPageActive(page_r5.id));
    i0.ɵɵattribute("aria-selected", ctx_r0.isPageActive(page_r5.id));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", page_r5.label, " ");
} }
function IdsModalComponent_Conditional_10_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "nav", 15);
    i0.ɵɵrepeaterCreate(1, IdsModalComponent_Conditional_10_Conditional_3_For_2_Template, 2, 4, "button", 16, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "div", 17);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.pages);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r0.activePageContent, " ");
} }
function IdsModalComponent_Conditional_10_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 3);
} }
function IdsModalComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵconditionalCreate(0, IdsModalComponent_Conditional_10_Conditional_0_Template, 2, 2, "p", 13);
    i0.ɵɵelementStart(1, "div", 14, 1);
    i0.ɵɵlistener("scroll", function IdsModalComponent_Conditional_10_Template_div_scroll_1_listener() { i0.ɵɵrestoreView(_r3); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onContentScroll()); });
    i0.ɵɵconditionalCreate(3, IdsModalComponent_Conditional_10_Conditional_3_Template, 5, 1)(4, IdsModalComponent_Conditional_10_Conditional_4_Template, 1, 0);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r0.showLegacyDescription ? 0 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("ids-modal__content--scrollable", ctx_r0.bodyScrollable)("ids-modal__content--hidden", !ctx_r0.showLegacyContentRegion)("ids-modal__content--with-tabs", ctx_r0.showTabs);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.showTabs ? 3 : 4);
} }
function IdsModalComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "div", 8);
} }
function IdsModalComponent_Conditional_13_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ids-checkbox", 20);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("label", ctx_r0.footerCheckboxLabel)("showLabel", true);
} }
function IdsModalComponent_Conditional_13_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-button", 24);
    i0.ɵɵlistener("clicked", function IdsModalComponent_Conditional_13_Conditional_3_Template_ids_button_clicked_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r0 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r0.onTertiaryClick()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("disabled", !ctx_r0.enableTertiaryAction);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.tertiaryActionLabel, " ");
} }
function IdsModalComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "footer", 19);
    i0.ɵɵconditionalCreate(1, IdsModalComponent_Conditional_13_Conditional_1_Template, 1, 2, "ids-checkbox", 20);
    i0.ɵɵelementStart(2, "div", 21);
    i0.ɵɵconditionalCreate(3, IdsModalComponent_Conditional_13_Conditional_3_Template, 2, 2, "ids-button", 22);
    i0.ɵɵelementStart(4, "ids-button", 23);
    i0.ɵɵlistener("clicked", function IdsModalComponent_Conditional_13_Template_ids_button_clicked_4_listener() { i0.ɵɵrestoreView(_r6); const ctx_r0 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r0.onPrimaryClick()); });
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("ids-modal__footer--bordered", ctx_r0.showFooterBorder);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.footerCheckbox ? 1 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.showTertiaryAction ? 3 : -1);
    i0.ɵɵadvance();
    i0.ɵɵproperty("variant", ctx_r0.primaryButtonVariant)("disabled", !ctx_r0.enablePrimaryAction);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.primaryActionLabel, " ");
} }
export class IdsModalComponent {
    cdr;
    dialogRef;
    legacyContentRef;
    titleSlot;
    bodySlot;
    footerSlot;
    open;
    defaultOpen = false;
    scenario = MODAL_API_DEFAULTS.scenario;
    type = MODAL_API_DEFAULTS.type;
    size = MODAL_API_DEFAULTS.size;
    /** Shorthand when `ids-modal-title` is not projected. */
    title = "";
    /** Shorthand when `ids-modal-body` is not projected. */
    description;
    closable = MODAL_API_DEFAULTS.closable;
    scrollBar = MODAL_API_DEFAULTS.scrollBar;
    tabs = MODAL_API_DEFAULTS.tabs;
    footerCheckbox = MODAL_API_DEFAULTS.footerCheckbox;
    fullScreen = MODAL_API_DEFAULTS.fullScreen;
    pages = [];
    activePageId;
    /** Shorthand when footer buttons are not projected in `ids-modal-footer`. */
    primaryActionLabel = "";
    tertiaryActionLabel;
    enablePrimaryAction = MODAL_API_DEFAULTS.enablePrimaryAction;
    enableTertiaryAction = MODAL_API_DEFAULTS.enableTertiaryAction;
    openChange = new EventEmitter();
    closed = new EventEmitter();
    primaryAction = new EventEmitter();
    tertiaryAction = new EventEmitter();
    pageChange = new EventEmitter();
    titleId = `ids-modal-title-${Math.random().toString(36).slice(2, 9)}`;
    descriptionId = `ids-modal-desc-${Math.random().toString(36).slice(2, 9)}`;
    footerCheckboxLabel = "Don't show again until the next update";
    activePage = "";
    bodyScrollable = false;
    showScrollShadow = false;
    internalOpen = false;
    hasLegacyBodyContent = false;
    contentElement = null;
    constructor(cdr) {
        this.cdr = cdr;
    }
    ngAfterContentInit() {
        this.cdr.markForCheck();
    }
    ngAfterViewInit() {
        this.ensureActivePage();
        this.syncDialogOpenState();
        queueMicrotask(() => {
            this.syncContentElement();
            this.detectLegacyBodyContent();
            this.updateContentOverflow();
        });
    }
    ngOnChanges(changes) {
        if (changes["pages"] || changes["activePageId"]) {
            this.ensureActivePage();
        }
        if (changes["open"] || changes["defaultOpen"]) {
            this.syncDialogOpenState();
        }
        if (changes["scrollBar"]) {
            queueMicrotask(() => this.updateContentOverflow());
        }
    }
    get hasTitleSlot() {
        return Boolean(this.titleSlot);
    }
    get hasBodySlot() {
        return Boolean(this.bodySlot);
    }
    get hasFooterSlot() {
        return Boolean(this.footerSlot);
    }
    get controlled() {
        return this.open !== undefined;
    }
    get resolvedScenario() {
        if (this.scenario === "wizard" || this.scenario === "custom") {
            return "single-page";
        }
        return this.scenario;
    }
    get showSeverityIcon() {
        return this.resolvedScenario === "dialog" && this.type !== "non-alerting";
    }
    get severityIconSlug() {
        if (this.type === "non-alerting") {
            return "";
        }
        return MODAL_DIALOG_TYPE_ICON[this.type];
    }
    get showTabs() {
        return this.resolvedScenario === "multi-page" && this.tabs && this.pages.length > 0;
    }
    get showFooterBorder() {
        return this.resolvedScenario !== "dialog";
    }
    get showLegacyDescription() {
        return !this.hasBodySlot && Boolean(this.description);
    }
    get showLegacyContentRegion() {
        if (this.hasBodySlot) {
            return false;
        }
        if (this.showTabs) {
            return true;
        }
        if (this.resolvedScenario !== "dialog") {
            return true;
        }
        return this.hasLegacyBodyContent;
    }
    get showTertiaryAction() {
        if (this.hasFooterSlot) {
            return false;
        }
        if (!this.tertiaryActionLabel) {
            return false;
        }
        if (this.resolvedScenario === "dialog") {
            return MODAL_TWO_BUTTON_DIALOG_TYPES.includes(this.type);
        }
        return true;
    }
    get primaryButtonVariant() {
        return this.type === "destructive" ? "destructive" : "primary";
    }
    get activePageContent() {
        const page = this.pages.find((item) => item.id === this.activePage);
        return page?.content ?? "";
    }
    get sizeClass() {
        return `ids-modal--${this.size}`;
    }
    get surfaceClass() {
        return [
            "ids-modal__surface",
            this.sizeClass,
            this.fullScreen ? "ids-modal__surface--fullscreen" : "",
        ]
            .filter(Boolean)
            .join(" ");
    }
    get ariaDescribedBy() {
        if (this.hasBodySlot && this.bodySlot?.resolvedDescription) {
            return this.descriptionId;
        }
        if (this.showLegacyDescription) {
            return this.descriptionId;
        }
        return null;
    }
    registerContentElement(element) {
        this.contentElement = element;
        queueMicrotask(() => this.updateContentOverflow());
    }
    openModal() {
        if (this.controlled) {
            this.openChange.emit(true);
            return;
        }
        this.internalOpen = true;
        this.dialogRef?.nativeElement.showModal();
        this.cdr.markForCheck();
        queueMicrotask(() => {
            this.syncContentElement();
            this.detectLegacyBodyContent();
            this.updateContentOverflow();
        });
    }
    closeModal() {
        if (!this.closable) {
            return;
        }
        if (this.controlled) {
            this.openChange.emit(false);
            this.closed.emit();
            return;
        }
        this.internalOpen = false;
        this.dialogRef?.nativeElement.close();
        this.closed.emit();
        this.cdr.markForCheck();
    }
    onDialogCancel(event) {
        if (!this.closable) {
            event.preventDefault();
            return;
        }
        if (this.controlled) {
            event.preventDefault();
            this.openChange.emit(false);
            this.closed.emit();
            return;
        }
        this.internalOpen = false;
        this.closed.emit();
        this.cdr.markForCheck();
    }
    onDialogClose() {
        if (this.controlled) {
            this.openChange.emit(false);
        }
        else {
            this.internalOpen = false;
        }
        this.closed.emit();
        this.cdr.markForCheck();
    }
    onPrimaryClick() {
        this.primaryAction.emit();
    }
    onTertiaryClick() {
        this.tertiaryAction.emit();
    }
    selectPage(pageId) {
        if (pageId === this.activePage) {
            return;
        }
        this.activePage = pageId;
        this.pageChange.emit(pageId);
        this.cdr.markForCheck();
        queueMicrotask(() => this.updateContentOverflow());
    }
    isPageActive(pageId) {
        return this.activePage === pageId;
    }
    onContentScroll() {
        this.updateContentOverflow();
    }
    onWindowResize() {
        this.updateContentOverflow();
    }
    syncContentElement() {
        if (this.hasBodySlot) {
            return;
        }
        this.contentElement = this.legacyContentRef?.nativeElement ?? null;
    }
    ensureActivePage() {
        if (!this.pages.length) {
            this.activePage = "";
            return;
        }
        const preferred = this.activePageId ?? this.activePage;
        const exists = this.pages.some((page) => page.id === preferred);
        this.activePage = exists ? preferred : this.pages[0].id;
    }
    syncDialogOpenState() {
        const dialog = this.dialogRef?.nativeElement;
        if (!dialog) {
            return;
        }
        const shouldOpen = this.controlled ? Boolean(this.open) : this.defaultOpen;
        if (shouldOpen && !dialog.open) {
            dialog.showModal();
            if (!this.controlled) {
                this.internalOpen = true;
            }
        }
        else if (!shouldOpen && dialog.open) {
            dialog.close();
            if (!this.controlled) {
                this.internalOpen = false;
            }
        }
        this.cdr.markForCheck();
    }
    updateContentOverflow() {
        const el = this.contentElement;
        if (!el) {
            this.bodyScrollable = false;
            this.showScrollShadow = false;
            this.cdr.markForCheck();
            return;
        }
        const scrollable = this.scrollBar && el.scrollHeight - el.clientHeight > 1;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
        this.bodyScrollable = scrollable;
        this.showScrollShadow = scrollable && !atBottom;
        this.cdr.markForCheck();
    }
    detectLegacyBodyContent() {
        const el = this.legacyContentRef?.nativeElement;
        const next = Boolean(el && (el.children.length > 0 || (el.textContent?.trim().length ?? 0) > 0));
        if (next !== this.hasLegacyBodyContent) {
            this.hasLegacyBodyContent = next;
            this.cdr.markForCheck();
        }
    }
    static ɵfac = function IdsModalComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsModalComponent)(i0.ɵɵdirectiveInject(i0.ChangeDetectorRef)); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsModalComponent, selectors: [["ids-modal"]], contentQueries: function IdsModalComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsModalTitleComponent, 5)(dirIndex, IdsModalBodyComponent, 5)(dirIndex, IdsModalFooterComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.titleSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.bodySlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.footerSlot = _t.first);
        } }, viewQuery: function IdsModalComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.dialogRef = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.legacyContentRef = _t.first);
        } }, hostBindings: function IdsModalComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function IdsModalComponent_resize_HostBindingHandler() { return ctx.onWindowResize(); }, i0.ɵɵresolveWindow);
        } }, inputs: { open: "open", defaultOpen: "defaultOpen", scenario: "scenario", type: "type", size: "size", title: "title", description: "description", closable: "closable", scrollBar: "scrollBar", tabs: "tabs", footerCheckbox: "footerCheckbox", fullScreen: "fullScreen", pages: "pages", activePageId: "activePageId", primaryActionLabel: "primaryActionLabel", tertiaryActionLabel: "tertiaryActionLabel", enablePrimaryAction: "enablePrimaryAction", enableTertiaryAction: "enableTertiaryAction" }, outputs: { openChange: "openChange", closed: "closed", primaryAction: "primaryAction", tertiaryAction: "tertiaryAction", pageChange: "pageChange" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_MODAL_CONTEXT, useExisting: IdsModalComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c3, decls: 14, vars: 10, consts: [["dialogRef", ""], ["legacyContentRef", ""], ["role", "dialog", "aria-modal", "true", 1, "ids-modal", 3, "cancel", "close"], [1, "ids-modal__header"], [1, "ids-modal__header-left"], ["aria-hidden", "true", 1, "ids-modal__severity-icon"], [1, "ids-modal__title", 3, "id"], ["type", "button", "aria-label", "Close", 1, "ids-modal__close"], ["aria-hidden", "true", 1, "ids-modal__scroll-shadow"], [1, "ids-modal__footer", 3, "ids-modal__footer--bordered"], [3, "shapeName", "size"], ["type", "button", "aria-label", "Close", 1, "ids-modal__close", 3, "click"], ["shapeName", "shape-x", 3, "size"], [1, "ids-modal__description", 3, "id"], [1, "ids-modal__content", 3, "scroll"], ["aria-label", "Modal pages", 1, "ids-modal__tabs"], ["type", "button", "role", "tab", 1, "ids-modal__tab", 3, "ids-modal__tab--active"], ["role", "tabpanel", 1, "ids-modal__page-panel"], ["type", "button", "role", "tab", 1, "ids-modal__tab", 3, "click"], [1, "ids-modal__footer"], [3, "label", "showLabel"], [1, "ids-modal__actions"], ["variant", "tertiary", "size", "lg", 3, "disabled"], ["size", "lg", 3, "clicked", "variant", "disabled"], ["variant", "tertiary", "size", "lg", 3, "clicked", "disabled"]], template: function IdsModalComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c2);
            i0.ɵɵelementStart(0, "dialog", 2, 0);
            i0.ɵɵlistener("cancel", function IdsModalComponent_Template_dialog_cancel_0_listener($event) { return ctx.onDialogCancel($event); })("close", function IdsModalComponent_Template_dialog_close_0_listener() { return ctx.onDialogClose(); });
            i0.ɵɵelementStart(2, "div")(3, "header", 3)(4, "div", 4);
            i0.ɵɵconditionalCreate(5, IdsModalComponent_Conditional_5_Template, 2, 2, "span", 5);
            i0.ɵɵprojection(6);
            i0.ɵɵconditionalCreate(7, IdsModalComponent_Conditional_7_Template, 2, 2, "h2", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(8, IdsModalComponent_Conditional_8_Template, 2, 1, "button", 7);
            i0.ɵɵelementEnd();
            i0.ɵɵprojection(9, 1);
            i0.ɵɵconditionalCreate(10, IdsModalComponent_Conditional_10_Template, 5, 8);
            i0.ɵɵconditionalCreate(11, IdsModalComponent_Conditional_11_Template, 1, 0, "div", 8);
            i0.ɵɵprojection(12, 2);
            i0.ɵɵconditionalCreate(13, IdsModalComponent_Conditional_13_Template, 6, 7, "footer", 9);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵattribute("aria-labelledby", ctx.titleId)("aria-describedby", ctx.ariaDescribedBy);
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.surfaceClass);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.showSeverityIcon ? 5 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.hasTitleSlot ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.closable ? 8 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.hasBodySlot ? 10 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showScrollShadow ? 11 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(!ctx.hasFooterSlot ? 13 : -1);
        } }, dependencies: [CommonModule, IdsButtonComponent, IdsCheckboxComponent, IdsIconComponent], styles: [":host {\n  display: contents;\n}\n\n.ids-modal {\n  border: none;\n  padding: 0;\n  margin: 0;\n  max-width: none;\n  max-height: none;\n  background: transparent;\n  overflow: visible;\n}\n\n.ids-modal::backdrop {\n  background: var(--color-background-overlay-1);\n}\n\n.ids-modal__surface {\n  display: flex;\n  flex-direction: column;\n  max-height: 85vh;\n  box-sizing: border-box;\n  overflow: hidden;\n  --ids-modal-inset-inline: var(--padding-padding-24, 24px);\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--modal-control-radius);\n  box-shadow:\n    var(--shadow-drop-shadow-32-x) var(--shadow-drop-shadow-32-y)\n    var(--shadow-drop-shadow-32-blur) var(--shadow-drop-shadow-32-color);\n  outline: none;\n}\n\n.ids-modal__surface--fullscreen {\n  width: calc(100vw - var(--padding-padding-48));\n  height: calc(100vh - var(--padding-padding-48));\n  max-height: none;\n}\n\n.ids-modal--x-small {\n  width: min(640px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--small {\n  width: min(960px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--medium {\n  width: min(1280px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--large {\n  width: min(1600px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-shrink: 0;\n  padding: var(--padding-padding-24) var(--ids-modal-inset-inline) var(--padding-padding-8);\n}\n\n.ids-modal__header-left {\n  display: flex;\n  align-items: center;\n  gap: var(--padding-padding-16);\n  min-width: 0;\n}\n\n.ids-modal__severity-icon {\n  display: inline-flex;\n  flex-shrink: 0;\n  color: var(--color-icon-neutral);\n}\n\n.ids-modal__title {\n  margin: 0;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-header-5);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-32);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-modal__close {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  border-radius: var(--corner-radius-radius-4);\n  background: transparent;\n  color: var(--color-icon-neutral);\n  cursor: pointer;\n  flex-shrink: 0;\n  line-height: 0;\n}\n\n.ids-modal__close:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-modal__description {\n  margin: 0;\n  padding: var(--padding-padding-8) var(--ids-modal-inset-inline);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n}\n\n.ids-modal__tabs {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  width: 100%;\n  padding: var(--padding-padding-8) 0 0;\n  overflow-x: auto;\n}\n\n.ids-modal__tab {\n  position: relative;\n  border: none;\n  background: var(--color-background-surface-2);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  padding: 9px var(--ids-modal-inset-inline);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n  white-space: nowrap;\n  flex: 0 1 auto;\n}\n\n.ids-modal__tab--active {\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-modal__tab--active::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n}\n\n.ids-modal__tab--active::after {\n  content: none;\n}\n\n.ids-modal__tab:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-modal__content {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: var(--padding-padding-16) var(--ids-modal-inset-inline) var(--padding-padding-24);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-modal__content > * {\n  box-sizing: border-box;\n  max-width: 100%;\n  min-width: 0;\n}\n\n.ids-modal__content--with-tabs {\n  padding: 0 var(--ids-modal-inset-inline) var(--padding-padding-24);\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n}\n\n.ids-modal__content--scrollable {\n  overflow-y: auto;\n}\n\n.ids-modal__content--hidden {\n  display: none;\n  padding: 0;\n  min-height: 0;\n}\n\n.ids-modal__page-panel {\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 120px;\n  min-width: 0;\n  padding: var(--padding-padding-16) 0 0;\n  overflow-wrap: anywhere;\n  overflow-x: hidden;\n}\n\n.ids-modal__scroll-shadow {\n  height: 19px;\n  flex-shrink: 0;\n  background: linear-gradient(\n    180deg,\n    var(--color-gradient-overflow-vertical-end, rgba(255, 255, 255, 0)) 0%,\n    var(--color-gradient-overflow-vertical-start, rgba(182, 182, 182, 0.4)) 100%\n  );\n}\n\n.ids-modal__footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--padding-padding-16);\n  flex-shrink: 0;\n  padding: var(--padding-padding-24) var(--ids-modal-inset-inline);\n}\n\n.ids-modal__footer--bordered {\n  border-top: var(--border-width-border-1) solid var(--color-border-neutral-light);\n}\n\n.ids-modal__actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: var(--padding-padding-12);\n  margin-left: auto;\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsModalComponent, [{
        type: Component,
        args: [{ selector: "ids-modal", standalone: true, imports: [CommonModule, IdsButtonComponent, IdsCheckboxComponent, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_MODAL_CONTEXT, useExisting: IdsModalComponent }], template: "<dialog\n  #dialogRef\n  class=\"ids-modal\"\n  role=\"dialog\"\n  aria-modal=\"true\"\n  [attr.aria-labelledby]=\"titleId\"\n  [attr.aria-describedby]=\"ariaDescribedBy\"\n  (cancel)=\"onDialogCancel($event)\"\n  (close)=\"onDialogClose()\"\n>\n  <div [class]=\"surfaceClass\">\n    <header class=\"ids-modal__header\">\n      <div class=\"ids-modal__header-left\">\n        @if (showSeverityIcon) {\n          <span class=\"ids-modal__severity-icon\" aria-hidden=\"true\">\n            <ids-icon [shapeName]=\"severityIconSlug\" [size]=\"24\" />\n          </span>\n        }\n\n        <ng-content select=\"ids-modal-title\" />\n\n        @if (!hasTitleSlot) {\n          <h2 [id]=\"titleId\" class=\"ids-modal__title\">{{ title }}</h2>\n        }\n      </div>\n\n      @if (closable) {\n        <button\n          type=\"button\"\n          class=\"ids-modal__close\"\n          aria-label=\"Close\"\n          (click)=\"closeModal()\"\n        >\n          <ids-icon shapeName=\"shape-x\" [size]=\"16\" />\n        </button>\n      }\n    </header>\n\n    <ng-content select=\"ids-modal-body\" />\n\n    @if (!hasBodySlot) {\n      @if (showLegacyDescription) {\n        <p [id]=\"descriptionId\" class=\"ids-modal__description\">{{ description }}</p>\n      }\n\n      <div\n        #legacyContentRef\n        class=\"ids-modal__content\"\n        [class.ids-modal__content--scrollable]=\"bodyScrollable\"\n        [class.ids-modal__content--hidden]=\"!showLegacyContentRegion\"\n        [class.ids-modal__content--with-tabs]=\"showTabs\"\n        (scroll)=\"onContentScroll()\"\n      >\n        @if (showTabs) {\n          <nav class=\"ids-modal__tabs\" aria-label=\"Modal pages\">\n            @for (page of pages; track page.id) {\n              <button\n                type=\"button\"\n                class=\"ids-modal__tab\"\n                [class.ids-modal__tab--active]=\"isPageActive(page.id)\"\n                [attr.aria-selected]=\"isPageActive(page.id)\"\n                role=\"tab\"\n                (click)=\"selectPage(page.id)\"\n              >\n                {{ page.label }}\n              </button>\n            }\n          </nav>\n          <div class=\"ids-modal__page-panel\" role=\"tabpanel\">\n            {{ activePageContent }}\n          </div>\n        } @else {\n          <ng-content />\n        }\n      </div>\n    }\n\n    @if (showScrollShadow) {\n      <div class=\"ids-modal__scroll-shadow\" aria-hidden=\"true\"></div>\n    }\n\n    <ng-content select=\"ids-modal-footer\" />\n\n    @if (!hasFooterSlot) {\n      <footer\n        class=\"ids-modal__footer\"\n        [class.ids-modal__footer--bordered]=\"showFooterBorder\"\n      >\n        @if (footerCheckbox) {\n          <ids-checkbox [label]=\"footerCheckboxLabel\" [showLabel]=\"true\" />\n        }\n\n        <div class=\"ids-modal__actions\">\n          @if (showTertiaryAction) {\n            <ids-button\n              variant=\"tertiary\"\n              size=\"lg\"\n              [disabled]=\"!enableTertiaryAction\"\n              (clicked)=\"onTertiaryClick()\"\n            >\n              {{ tertiaryActionLabel }}\n            </ids-button>\n          }\n          <ids-button\n            [variant]=\"primaryButtonVariant\"\n            size=\"lg\"\n            [disabled]=\"!enablePrimaryAction\"\n            (clicked)=\"onPrimaryClick()\"\n          >\n            {{ primaryActionLabel }}\n          </ids-button>\n        </div>\n      </footer>\n    }\n  </div>\n</dialog>\n", styles: [":host {\n  display: contents;\n}\n\n.ids-modal {\n  border: none;\n  padding: 0;\n  margin: 0;\n  max-width: none;\n  max-height: none;\n  background: transparent;\n  overflow: visible;\n}\n\n.ids-modal::backdrop {\n  background: var(--color-background-overlay-1);\n}\n\n.ids-modal__surface {\n  display: flex;\n  flex-direction: column;\n  max-height: 85vh;\n  box-sizing: border-box;\n  overflow: hidden;\n  --ids-modal-inset-inline: var(--padding-padding-24, 24px);\n  background: var(--color-background-component);\n  border: var(--border-width-border-1) solid var(--color-border-accessible);\n  border-radius: var(--modal-control-radius);\n  box-shadow:\n    var(--shadow-drop-shadow-32-x) var(--shadow-drop-shadow-32-y)\n    var(--shadow-drop-shadow-32-blur) var(--shadow-drop-shadow-32-color);\n  outline: none;\n}\n\n.ids-modal__surface--fullscreen {\n  width: calc(100vw - var(--padding-padding-48));\n  height: calc(100vh - var(--padding-padding-48));\n  max-height: none;\n}\n\n.ids-modal--x-small {\n  width: min(640px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--small {\n  width: min(960px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--medium {\n  width: min(1280px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal--large {\n  width: min(1600px, calc(100vw - var(--padding-padding-48)));\n}\n\n.ids-modal__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-shrink: 0;\n  padding: var(--padding-padding-24) var(--ids-modal-inset-inline) var(--padding-padding-8);\n}\n\n.ids-modal__header-left {\n  display: flex;\n  align-items: center;\n  gap: var(--padding-padding-16);\n  min-width: 0;\n}\n\n.ids-modal__severity-icon {\n  display: inline-flex;\n  flex-shrink: 0;\n  color: var(--color-icon-neutral);\n}\n\n.ids-modal__title {\n  margin: 0;\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-header-5);\n  font-weight: 400;\n  line-height: var(--font-line-height-line-height-32);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-modal__close {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 16px;\n  height: 16px;\n  padding: 0;\n  margin: 0;\n  border: none;\n  border-radius: var(--corner-radius-radius-4);\n  background: transparent;\n  color: var(--color-icon-neutral);\n  cursor: pointer;\n  flex-shrink: 0;\n  line-height: 0;\n}\n\n.ids-modal__close:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-modal__description {\n  margin: 0;\n  padding: var(--padding-padding-8) var(--ids-modal-inset-inline);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-neutral);\n}\n\n.ids-modal__tabs {\n  display: flex;\n  align-items: stretch;\n  gap: 0;\n  flex-shrink: 0;\n  box-sizing: border-box;\n  width: 100%;\n  padding: var(--padding-padding-8) 0 0;\n  overflow-x: auto;\n}\n\n.ids-modal__tab {\n  position: relative;\n  border: none;\n  background: var(--color-background-surface-2);\n  border-bottom: var(--border-width-border-1) solid var(--color-border-accessible);\n  padding: 9px var(--ids-modal-inset-inline);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral);\n  cursor: pointer;\n  white-space: nowrap;\n  flex: 0 1 auto;\n}\n\n.ids-modal__tab--active {\n  color: var(--color-text-brand-strong);\n  border-bottom-color: transparent;\n  z-index: 1;\n}\n\n.ids-modal__tab--active::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: var(--border-width-border-thick);\n  background: var(--color-border-brand-dark);\n  pointer-events: none;\n}\n\n.ids-modal__tab--active::after {\n  content: none;\n}\n\n.ids-modal__tab:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: -2px;\n}\n\n.ids-modal__content {\n  flex: 1 1 auto;\n  min-height: 0;\n  min-width: 0;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  padding: var(--padding-padding-16) var(--ids-modal-inset-inline) var(--padding-padding-24);\n  font-family: var(--typography-font-style-primary, \"Roboto\", sans-serif);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  color: var(--color-text-neutral-strong);\n}\n\n.ids-modal__content > * {\n  box-sizing: border-box;\n  max-width: 100%;\n  min-width: 0;\n}\n\n.ids-modal__content--with-tabs {\n  padding: 0 var(--ids-modal-inset-inline) var(--padding-padding-24);\n  display: flex;\n  flex-direction: column;\n  min-height: 0;\n}\n\n.ids-modal__content--scrollable {\n  overflow-y: auto;\n}\n\n.ids-modal__content--hidden {\n  display: none;\n  padding: 0;\n  min-height: 0;\n}\n\n.ids-modal__page-panel {\n  box-sizing: border-box;\n  flex: 1 1 auto;\n  min-height: 120px;\n  min-width: 0;\n  padding: var(--padding-padding-16) 0 0;\n  overflow-wrap: anywhere;\n  overflow-x: hidden;\n}\n\n.ids-modal__scroll-shadow {\n  height: 19px;\n  flex-shrink: 0;\n  background: linear-gradient(\n    180deg,\n    var(--color-gradient-overflow-vertical-end, rgba(255, 255, 255, 0)) 0%,\n    var(--color-gradient-overflow-vertical-start, rgba(182, 182, 182, 0.4)) 100%\n  );\n}\n\n.ids-modal__footer {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: var(--padding-padding-16);\n  flex-shrink: 0;\n  padding: var(--padding-padding-24) var(--ids-modal-inset-inline);\n}\n\n.ids-modal__footer--bordered {\n  border-top: var(--border-width-border-1) solid var(--color-border-neutral-light);\n}\n\n.ids-modal__actions {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: var(--padding-padding-12);\n  margin-left: auto;\n}\n"] }]
    }], () => [{ type: i0.ChangeDetectorRef }], { dialogRef: [{
            type: ViewChild,
            args: ["dialogRef"]
        }], legacyContentRef: [{
            type: ViewChild,
            args: ["legacyContentRef"]
        }], titleSlot: [{
            type: ContentChild,
            args: [IdsModalTitleComponent]
        }], bodySlot: [{
            type: ContentChild,
            args: [IdsModalBodyComponent]
        }], footerSlot: [{
            type: ContentChild,
            args: [IdsModalFooterComponent]
        }], open: [{
            type: Input
        }], defaultOpen: [{
            type: Input
        }], scenario: [{
            type: Input
        }], type: [{
            type: Input
        }], size: [{
            type: Input
        }], title: [{
            type: Input
        }], description: [{
            type: Input
        }], closable: [{
            type: Input
        }], scrollBar: [{
            type: Input
        }], tabs: [{
            type: Input
        }], footerCheckbox: [{
            type: Input
        }], fullScreen: [{
            type: Input
        }], pages: [{
            type: Input
        }], activePageId: [{
            type: Input
        }], primaryActionLabel: [{
            type: Input
        }], tertiaryActionLabel: [{
            type: Input
        }], enablePrimaryAction: [{
            type: Input
        }], enableTertiaryAction: [{
            type: Input
        }], openChange: [{
            type: Output
        }], closed: [{
            type: Output
        }], primaryAction: [{
            type: Output
        }], tertiaryAction: [{
            type: Output
        }], pageChange: [{
            type: Output
        }], onWindowResize: [{
            type: HostListener,
            args: ["window:resize"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsModalComponent, { className: "IdsModalComponent", filePath: "src/components/ids-modal/ids-modal.component.ts", lineNumber: 46 }); })();
