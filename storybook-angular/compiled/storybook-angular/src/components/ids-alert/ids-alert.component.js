import { Component, ContentChild, ElementRef, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ALERT_GLOBAL_SEVERITY_ICON, ALERT_INLINE_SEVERITY_ICON, ALERT_SPEC_ACCURATE_DEFAULTS, } from "../../../../component-contracts/ids/alert.contract.js";
import { IDS_ALERT_CONTEXT } from "./ids-alert-context";
import { IdsAlertMessageComponent } from "./ids-alert-message.component";
import { IdsAlertTitleComponent } from "./ids-alert-title.component";
import { IdsAlertLinkComponent } from "./ids-alert-link.component";
import { IdsAlertActionComponent } from "./ids-alert-action.component";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-alert-link"]], [["ids-alert-link"]]];
const _c1 = ["ids-alert-link", "ids-alert-link"];
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 2)(1, "button", 10);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_1_Template_button_click_1_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.carouselPrevious.emit()); });
    i0.ɵɵelement(2, "ids-icon", 11);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "span", 12);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "button", 13);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_1_Template_button_click_5_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.carouselNext.emit()); });
    i0.ɵɵelement(6, "ids-icon", 14);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("size", 12);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(ctx_r1.carouselCounter);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("size", 12);
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0);
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 17);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_0_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const linkRef_r4 = i0.ɵɵnextContext();
    i0.ɵɵproperty("href", linkRef_r4.href, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", linkRef_r4.label, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 18);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r5); const ctx_r1 = i0.ɵɵnextContext(5); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const linkRef_r4 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", linkRef_r4.label, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_0_Template, 2, 2, "a", 15)(1, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Conditional_1_Template, 2, 1, "button", 16);
} if (rf & 2) {
    i0.ɵɵconditional(ctx.href ? 0 : 1);
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_0_Template, 1, 0)(1, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Conditional_1_Template, 2, 1);
} if (rf & 2) {
    let tmp_3_0;
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r1.linkSlot ? 0 : (tmp_3_0 = ctx_r1.resolvedLink) ? 1 : -1, tmp_3_0);
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r6 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 19);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_9_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r6); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.action.emit()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolvedActionLabel, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 20);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_0_Conditional_10_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r7); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.onDismissClick()); });
    i0.ɵɵelement(1, "ids-icon", 21);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 12);
} }
function IdsAlertComponent_Conditional_0_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 0);
    i0.ɵɵconditionalCreate(1, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_1_Template, 7, 3, "div", 2);
    i0.ɵɵelementStart(2, "div", 3)(3, "div", 4);
    i0.ɵɵelement(4, "ids-icon", 5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 6);
    i0.ɵɵtext(6);
    i0.ɵɵconditionalCreate(7, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_7_Template, 2, 1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(8, "div", 7);
    i0.ɵɵconditionalCreate(9, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_9_Template, 2, 1, "button", 8);
    i0.ɵɵconditionalCreate(10, IdsAlertComponent_Conditional_0_Conditional_0_Conditional_10_Template, 2, 1, "button", 9);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵattribute("data-severity", ctx_r1.severity)("data-carousel", ctx_r1.showCarousel ? "true" : "false");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showCarousel && ctx_r1.carousel ? 1 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("shapeName", ctx_r1.statusIconSlug())("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolvedMessage, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showLink ? 7 : -1);
    i0.ɵɵadvance();
    i0.ɵɵattribute("data-has-action", ctx_r1.showAction ? "true" : "false");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showAction ? 9 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showDismissGlobal ? 10 : -1);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.resolvedTitle);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.title);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    const _r8 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 27);
    i0.ɵɵconditionalCreate(1, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Conditional_1_Template, 2, 1, "p", 30)(2, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Conditional_2_Template, 2, 1, "p", 30);
    i0.ɵɵelementStart(3, "button", 31);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Template_button_click_3_listener() { i0.ɵɵrestoreView(_r8); const ctx_r1 = i0.ɵɵnextContext(3); return i0.ɵɵresetView(ctx_r1.action.emit()); });
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.hasTitleSlot ? 1 : 2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolvedActionLabel, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.resolvedTitle);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.title);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Conditional_0_Template, 2, 1, "p", 30)(1, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Conditional_1_Template, 2, 1, "p", 30);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵconditional(ctx_r1.hasTitleSlot ? 0 : 1);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    const _r9 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "a", 34);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_0_Template_a_click_0_listener($event) { i0.ɵɵrestoreView(_r9); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const linkRef_r10 = i0.ɵɵnextContext();
    i0.ɵɵproperty("href", linkRef_r10.href, i0.ɵɵsanitizeUrl);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", linkRef_r10.label, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r11 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 35);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_1_Template_button_click_0_listener($event) { i0.ɵɵrestoreView(_r11); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onLinkActivate($event)); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const linkRef_r10 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", linkRef_r10.label, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_0_Template, 2, 2, "a", 32)(1, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Conditional_1_Template, 2, 1, "button", 33);
} if (rf & 2) {
    i0.ɵɵconditional(ctx.href ? 0 : 1);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 1);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    const _r12 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 31);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_1_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r12); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.action.emit()); });
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(4);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolvedActionLabel, " ");
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r13 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "button", 38);
    i0.ɵɵlistener("click", function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_2_Template_button_click_0_listener() { i0.ɵɵrestoreView(_r13); const ctx_r1 = i0.ɵɵnextContext(4); return i0.ɵɵresetView(ctx_r1.onDismissClick()); });
    i0.ɵɵelement(1, "ids-icon", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    i0.ɵɵadvance();
    i0.ɵɵproperty("size", 12);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 29);
    i0.ɵɵconditionalCreate(1, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_1_Template, 2, 1, "button", 36);
    i0.ɵɵconditionalCreate(2, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Conditional_2_Template, 2, 1, "button", 37);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵattribute("data-has-action", ctx_r1.showActionInTrailing ? "true" : "false");
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showActionInTrailing ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showDismissInline ? 2 : -1);
} }
function IdsAlertComponent_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 22)(1, "div", 23)(2, "span", 24);
    i0.ɵɵelement(3, "ids-icon", 25);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "div", 26);
    i0.ɵɵconditionalCreate(5, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_5_Template, 5, 2, "div", 27)(6, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_6_Template, 2, 1);
    i0.ɵɵelementStart(7, "p", 28);
    i0.ɵɵtext(8);
    i0.ɵɵconditionalCreate(9, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_9_Template, 2, 1);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(10, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_10_Template, 1, 0);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(11, IdsAlertComponent_Conditional_0_Conditional_1_Conditional_11_Template, 3, 3, "div", 29);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    let tmp_10_0;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("ids-alert--inline-compact", ctx_r1.density === "compact")("ids-alert--inline-detailed", ctx_r1.density === "detailed");
    i0.ɵɵattribute("data-severity", ctx_r1.severity)("data-density", ctx_r1.density);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("shapeName", ctx_r1.statusIconSlug())("size", 16);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.showTitleRow ? 5 : ctx_r1.showTitle ? 6 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate1(" ", ctx_r1.resolvedMessage, " ");
    i0.ɵɵadvance();
    i0.ɵɵconditional((tmp_10_0 = ctx_r1.showLink && !ctx_r1.linkSlot && ctx_r1.resolvedLink) ? 9 : -1, tmp_10_0);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showLink && ctx_r1.linkSlot ? 10 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.showTrailing ? 11 : -1);
} }
function IdsAlertComponent_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Conditional_0_Template, 11, 10, "section", 0)(1, IdsAlertComponent_Conditional_0_Conditional_1_Template, 12, 13, "div", 1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.isGlobal ? 0 : 1);
} }
export class IdsAlertComponent {
    messageSlot;
    messageHost;
    titleSlot;
    titleHost;
    linkSlot;
    actionSlot;
    display = ALERT_SPEC_ACCURATE_DEFAULTS.display;
    severity = ALERT_SPEC_ACCURATE_DEFAULTS.severity;
    /** Shorthand when `ids-alert-message` is not projected. */
    message = ALERT_SPEC_ACCURATE_DEFAULTS.message;
    /** Shorthand when `ids-alert-title` is not projected. */
    title = "";
    density = ALERT_SPEC_ACCURATE_DEFAULTS.density;
    link = null;
    linkLabel = "";
    linkHref = "";
    actionLabel = "";
    dismissible = ALERT_SPEC_ACCURATE_DEFAULTS.dismissible;
    carousel = null;
    action = new EventEmitter();
    dismiss = new EventEmitter();
    linkClick = new EventEmitter();
    carouselPrevious = new EventEmitter();
    carouselNext = new EventEmitter();
    dismissed = false;
    hasMessageSlot = false;
    hasTitleSlot = false;
    ngAfterContentInit() {
        this.hasMessageSlot = Boolean(this.messageSlot);
        this.hasTitleSlot = Boolean(this.titleSlot);
    }
    get isGlobal() {
        return this.display === "global";
    }
    get resolvedLink() {
        if (this.linkSlot) {
            return { label: this.linkSlot.label, href: this.linkSlot.href || undefined };
        }
        if (this.link) {
            return this.link;
        }
        if (this.linkLabel) {
            return { label: this.linkLabel, href: this.linkHref || undefined };
        }
        return null;
    }
    get resolvedActionLabel() {
        return this.actionSlot?.label || this.actionLabel;
    }
    get showAction() {
        return Boolean(this.resolvedActionLabel);
    }
    get showLink() {
        return Boolean(this.resolvedLink?.label);
    }
    get showCarousel() {
        return this.isGlobal && Boolean(this.carousel);
    }
    get showDismissGlobal() {
        const allowed = this.dismissible ?? true;
        const sev = this.severity;
        return allowed && (sev !== "critical" || (this.showCarousel && !this.showAction));
    }
    get showDismissInline() {
        const allowed = this.dismissible ?? true;
        return allowed && this.severity !== "critical";
    }
    get showTitle() {
        return !this.isGlobal && this.density === "detailed" && (this.hasTitleSlot || Boolean(this.title));
    }
    get showTitleRow() {
        return this.showTitle && this.showAction;
    }
    get showActionInTitleRow() {
        return !this.isGlobal && this.density === "detailed" && this.showTitle && this.showAction;
    }
    get showActionInTrailing() {
        return this.showAction && !this.showActionInTitleRow;
    }
    get showTrailing() {
        return !this.isGlobal && (this.showActionInTrailing || this.showDismissInline);
    }
    get useMessageSlot() {
        return this.hasMessageSlot;
    }
    get resolvedMessage() {
        if (this.hasMessageSlot) {
            const slotText = this.messageHost?.nativeElement?.textContent?.trim();
            if (slotText) {
                return slotText;
            }
        }
        return this.message;
    }
    get resolvedTitle() {
        if (this.hasTitleSlot) {
            return this.titleHost?.nativeElement?.textContent?.trim() ?? "";
        }
        return this.title;
    }
    get carouselCounter() {
        if (!this.carousel) {
            return "";
        }
        const current = Math.max(1, this.carousel.currentItem);
        const total = Math.max(1, this.carousel.totalItems);
        return `${current} of ${total}`;
    }
    statusIconSlug() {
        if (this.isGlobal) {
            return ALERT_GLOBAL_SEVERITY_ICON[this.severity];
        }
        return ALERT_INLINE_SEVERITY_ICON[this.severity];
    }
    onDismissClick() {
        this.dismissed = true;
        this.dismiss.emit();
    }
    onLinkActivate(event) {
        this.linkClick.emit(event);
    }
    linkClass() {
        return this.isGlobal ? "ids-alert__link" : "ids-alert__inline-link";
    }
    linkButtonClass() {
        return this.isGlobal ? "ids-alert__link-button" : "ids-alert__inline-link-button";
    }
    static ɵfac = function IdsAlertComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertComponent, selectors: [["ids-alert"]], contentQueries: function IdsAlertComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsAlertMessageComponent, 5)(dirIndex, IdsAlertMessageComponent, 5, ElementRef)(dirIndex, IdsAlertTitleComponent, 5)(dirIndex, IdsAlertTitleComponent, 5, ElementRef)(dirIndex, IdsAlertLinkComponent, 5)(dirIndex, IdsAlertActionComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.messageSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.messageHost = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.titleSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.titleHost = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.linkSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.actionSlot = _t.first);
        } }, inputs: { display: "display", severity: "severity", message: "message", title: "title", density: "density", link: "link", linkLabel: "linkLabel", linkHref: "linkHref", actionLabel: "actionLabel", dismissible: "dismissible", carousel: "carousel" }, outputs: { action: "action", dismiss: "dismiss", linkClick: "linkClick", carouselPrevious: "carouselPrevious", carouselNext: "carouselNext" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_ALERT_CONTEXT, useExisting: IdsAlertComponent }])], ngContentSelectors: _c1, decls: 1, vars: 1, consts: [["role", "alert", "aria-live", "assertive", 1, "ids-alert", "ids-alert--global"], ["role", "alert", 1, "ids-alert", "ids-alert--inline", 3, "ids-alert--inline-compact", "ids-alert--inline-detailed"], [1, "ids-alert__carousel-rail"], [1, "ids-alert__global-content"], [1, "ids-alert__global-icon-wrap"], ["className", "ids-alert__global-icon", 3, "shapeName", "size"], [1, "ids-alert__global-message"], [1, "ids-alert__global-actions"], ["type", "button", 1, "ids-alert__global-action"], ["type", "button", "aria-label", "Dismiss alert", 1, "ids-alert__global-dismiss"], ["type", "button", "aria-label", "Previous alert", 1, "ids-alert__carousel-button", 3, "click"], ["shapeName", "chev-left-16", "className", "ids-alert__carousel-chevron", 3, "size"], [1, "ids-alert__carousel-count"], ["type", "button", "aria-label", "Next alert", 1, "ids-alert__carousel-button", 3, "click"], ["shapeName", "chev-right-16", "className", "ids-alert__carousel-chevron", 3, "size"], [1, "ids-alert__link", 3, "href"], ["type", "button", 1, "ids-alert__link-button"], [1, "ids-alert__link", 3, "click", "href"], ["type", "button", 1, "ids-alert__link-button", 3, "click"], ["type", "button", 1, "ids-alert__global-action", 3, "click"], ["type", "button", "aria-label", "Dismiss alert", 1, "ids-alert__global-dismiss", 3, "click"], ["shapeName", "shape-x", "className", "ids-alert__global-dismiss-icon", 3, "size"], ["role", "alert", 1, "ids-alert", "ids-alert--inline"], [1, "ids-alert__inline-main"], [1, "ids-alert__inline-icon-wrap"], ["className", "ids-alert__inline-icon", 3, "shapeName", "size"], [1, "ids-alert__inline-text"], [1, "ids-alert__title-row"], [1, "ids-alert__inline-message"], [1, "ids-alert__inline-trailing"], [1, "ids-alert__inline-title"], ["type", "button", 1, "ids-alert__inline-action", 3, "click"], [1, "ids-alert__inline-link", 3, "href"], ["type", "button", 1, "ids-alert__inline-link-button"], [1, "ids-alert__inline-link", 3, "click", "href"], ["type", "button", 1, "ids-alert__inline-link-button", 3, "click"], ["type", "button", 1, "ids-alert__inline-action"], ["type", "button", "aria-label", "Dismiss alert", 1, "ids-alert__inline-dismiss"], ["type", "button", "aria-label", "Dismiss alert", 1, "ids-alert__inline-dismiss", 3, "click"], ["shapeName", "shape-x", 3, "size"]], template: function IdsAlertComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵconditionalCreate(0, IdsAlertComponent_Conditional_0_Template, 2, 1);
        } if (rf & 2) {
            i0.ɵɵconditional(!ctx.dismissed ? 0 : -1);
        } }, dependencies: [CommonModule, IdsIconComponent], styles: ["/* Ported from storybook/src/components/Alert.module.css \u2014 single file for ngc inline (no @use). */\n\n.ids-alert__link,\n.ids-alert__link-button,\n.ids-alert__inline-link,\n.ids-alert__inline-link-button {\n  padding: 0;\n  border: none;\n  background: transparent;\n  font: inherit;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.ids-alert__link:focus-visible,\n.ids-alert__link-button:focus-visible,\n.ids-alert__inline-link:focus-visible,\n.ids-alert__inline-link-button:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n/* \u2014\u2014\u2014 Global \u2014\u2014\u2014 */\n.ids-alert--global {\n  position: relative;\n  width: 100%;\n  min-height: 40px;\n  display: flex;\n  align-items: stretch;\n  justify-content: space-between;\n  gap: var(--spacing-space-8);\n  padding-left: 0;\n  border: var(--border-width-border-1) solid transparent;\n  font-family: inherit;\n  box-sizing: border-box;\n}\n\n.ids-alert--global:not([data-carousel=\"true\"]) {\n  padding-left: var(--padding-padding-20);\n}\n\n.ids-alert__global-content {\n  min-width: 0;\n  flex: 1;\n  display: flex;\n  align-items: flex-start;\n  gap: var(--spacing-space-8);\n  padding-block: var(--padding-padding-10);\n}\n\n.ids-alert__global-actions {\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-end;\n  gap: var(--spacing-space-16);\n  padding: 14px var(--padding-padding-16);\n  flex-shrink: 0;\n}\n\n.ids-alert__global-actions[data-has-action=\"true\"] {\n  align-items: center;\n  padding-block: var(--padding-padding-8);\n}\n\n.ids-alert__global-icon-wrap {\n  display: flex;\n  align-items: center;\n  padding-top: 2px;\n}\n\n.ids-alert__global-icon {\n  flex-shrink: 0;\n}\n\n.ids-alert__global-message {\n  margin: 0;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: inherit;\n}\n\n.ids-alert__link,\n.ids-alert__link-button {\n  color: inherit;\n  line-height: inherit;\n  font-weight: 400;\n}\n\n.ids-alert__global-action {\n  min-height: 24px;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border: var(--border-width-border-1) solid currentColor;\n  border-radius: var(--corner-radius-radius-2);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  font-weight: 500;\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.ids-alert__global-dismiss,\n.ids-alert__carousel-button {\n  width: auto;\n  height: auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: inherit;\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-alert__global-dismiss-icon,\n.ids-alert__carousel-chevron {\n  flex-shrink: 0;\n}\n\n.ids-alert__global-dismiss:focus-visible,\n.ids-alert__carousel-button:focus-visible,\n.ids-alert__global-action:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-alert__carousel-rail {\n  position: absolute;\n  top: -1px;\n  bottom: -1px;\n  left: -1px;\n  width: 132px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 22px;\n  padding: var(--padding-padding-10) var(--padding-padding-14);\n  border: var(--border-width-border-1) solid;\n  border-color: inherit;\n  box-sizing: border-box;\n}\n\n.ids-alert--global[data-carousel=\"true\"] .ids-alert__global-content {\n  padding-left: 148px;\n}\n\n.ids-alert__carousel-count {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-white);\n  white-space: nowrap;\n}\n\n.ids-alert--global[data-severity=\"critical\"] {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-transparent-critical);\n  color: var(--color-text-white);\n}\n\n.ids-alert--global[data-severity=\"warning-major\"] {\n  background: var(--color-background-alerting-major);\n  border-color: var(--color-border-alerting-transparent-major);\n  color: var(--color-text-black);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] {\n  background: var(--color-background-alerting-minor);\n  border-color: var(--color-border-alerting-minor-transparent);\n  color: var(--color-text-black);\n}\n\n.ids-alert--global[data-severity=\"informational\"] {\n  background: var(--color-background-alerting-info);\n  border-color: var(--color-border-alerting-transparent-info);\n  color: var(--color-text-white);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-critical-strong);\n}\n\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-major-strong);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-minor-strong);\n}\n\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-info-strong);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__carousel-chevron,\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__carousel-chevron,\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__carousel-chevron {\n  filter: brightness(0) invert(1);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__carousel-chevron {\n  filter: brightness(0);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__global-dismiss-icon,\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__global-dismiss-icon,\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__global-dismiss-icon {\n  filter: brightness(0);\n}\n\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__global-dismiss-icon {\n  filter: brightness(0) invert(1);\n}\n\n/* \u2014\u2014\u2014 Inline \u2014\u2014\u2014 */\n.ids-alert--inline {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  min-height: var(--scale-40);\n  padding-left: var(--padding-padding-20);\n  border: var(--border-width-border-1) solid transparent;\n  border-radius: 0;\n  font-family: inherit;\n  gap: var(--spacing-space-12);\n  box-shadow: inset 4px 0 0 0 var(--inline-rail, var(--color-background-alerting-info));\n}\n\n.ids-alert__inline-main {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  align-items: flex-start;\n  gap: var(--spacing-space-8);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-main {\n  padding-block: var(--padding-padding-10);\n  padding-right: var(--padding-padding-8);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-main {\n  padding-block: var(--padding-padding-12);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-icon-wrap {\n  padding-top: var(--padding-padding-2);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-icon-wrap {\n  padding-top: var(--padding-padding-4);\n}\n\n.ids-alert__inline-icon-wrap {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n}\n\n.ids-alert__inline-icon {\n  flex-shrink: 0;\n}\n\n.ids-alert__inline-text {\n  min-width: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  padding-right: var(--padding-padding-16);\n}\n\n.ids-alert__inline-title {\n  margin: 0;\n  font-size: var(--font-size-body-1);\n  line-height: var(--font-line-height-line-height-24);\n  font-weight: 500;\n  color: var(--color-static-gray-900);\n}\n\n.ids-alert__inline-message {\n  margin: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-static-gray-900);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-message {\n  font-weight: 500;\n}\n\n.ids-alert__inline-link,\n.ids-alert__inline-link-button {\n  color: var(--color-static-brand-500);\n  font-size: inherit;\n  line-height: inherit;\n  font-weight: 400;\n}\n\n.ids-alert__inline-trailing {\n  display: flex;\n  flex-shrink: 0;\n  align-items: flex-start;\n  justify-content: flex-end;\n  gap: var(--spacing-space-16);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-trailing {\n  align-items: center;\n  height: var(--scale-40);\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-trailing[data-has-action=\"true\"] {\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-trailing {\n  padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0;\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-action {\n  margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16));\n}\n\n.ids-alert__inline-action {\n  min-height: 24px;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-2);\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  font: inherit;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  cursor: pointer;\n}\n\n.ids-alert__inline-dismiss {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  box-sizing: border-box;\n  border: none;\n  background: transparent;\n  color: var(--color-icon-black);\n  cursor: pointer;\n  /* 12\u00D712 glyph; 32\u00D732 min hit target extends left/up/down \u2014 trailing pad-right keeps icon 16px from alert edge */\n  padding: 10px 0 10px 20px;\n  min-width: var(--scale-32);\n  min-height: var(--scale-32);\n}\n\n.ids-alert__inline-dismiss:focus-visible,\n.ids-alert__inline-action:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.ids-alert--inline-detailed {\n  min-height: 85px;\n}\n\n.ids-alert__title-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 4px;\n  width: 100%;\n}\n\n.ids-alert__title-row .ids-alert__inline-title {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.ids-alert__title-row .ids-alert__inline-action {\n  flex-shrink: 0;\n}\n\n.ids-alert--inline[data-severity=\"informational\"] {\n  --inline-alert-icon: var(--color-icon-alerting-info);\n  --inline-rail: var(--color-background-alerting-info);\n  background: var(--color-background-alerting-info-light);\n  border-color: var(--color-border-alerting-info-transparent);\n}\n\n.ids-alert--inline[data-severity=\"success\"] {\n  --inline-alert-icon: var(--color-icon-alerting-success);\n  --inline-rail: var(--color-background-alerting-success);\n  background: var(--color-background-alerting-success-light);\n  border-color: var(--color-border-alerting-success-transparent);\n}\n\n.ids-alert--inline[data-severity=\"warning-minor\"] {\n  --inline-alert-icon: var(--color-icon-alerting-minor);\n  --inline-rail: var(--color-background-alerting-minor);\n  background: var(--color-background-alerting-minor-light);\n  border-color: var(--color-border-alerting-minor-transparent);\n  box-shadow: none;\n}\n\n.ids-alert--inline[data-severity=\"warning-minor\"]::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: linear-gradient(\n    90deg,\n    var(--color-background-alerting-minor) 0 75%,\n    var(--color-border-alerting-warning-accessible, var(--color-border-alerting-minor-minor)) 75% 100%\n  );\n  pointer-events: none;\n}\n\n.ids-alert--inline[data-severity=\"warning-major\"] {\n  --inline-alert-icon: var(--color-icon-alerting-major);\n  --inline-rail: var(--color-background-alerting-major);\n  background: var(--color-background-alerting-major-light);\n  border-color: var(--color-border-alerting-major-transparent);\n}\n\n.ids-alert--inline[data-severity=\"critical\"] {\n  --inline-alert-icon: var(--color-icon-alerting-critical);\n  --inline-rail: var(--color-background-alerting-critical);\n  background: var(--color-background-alerting-critical-light);\n  border-color: var(--color-border-alerting-critical-transparent);\n}\n"], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertComponent, [{
        type: Component,
        args: [{ selector: "ids-alert", standalone: true, imports: [CommonModule, IdsIconComponent], encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_ALERT_CONTEXT, useExisting: IdsAlertComponent }], template: "@if (!dismissed) {\n  @if (isGlobal) {\n    <section\n      class=\"ids-alert ids-alert--global\"\n      [attr.data-severity]=\"severity\"\n      [attr.data-carousel]=\"showCarousel ? 'true' : 'false'\"\n      role=\"alert\"\n      aria-live=\"assertive\"\n    >\n      @if (showCarousel && carousel) {\n        <div class=\"ids-alert__carousel-rail\">\n          <button\n            type=\"button\"\n            class=\"ids-alert__carousel-button\"\n            aria-label=\"Previous alert\"\n            (click)=\"carouselPrevious.emit()\"\n          >\n            <ids-icon shapeName=\"chev-left-16\" [size]=\"12\" className=\"ids-alert__carousel-chevron\" />\n          </button>\n          <span class=\"ids-alert__carousel-count\">{{ carouselCounter }}</span>\n          <button\n            type=\"button\"\n            class=\"ids-alert__carousel-button\"\n            aria-label=\"Next alert\"\n            (click)=\"carouselNext.emit()\"\n          >\n            <ids-icon shapeName=\"chev-right-16\" [size]=\"12\" className=\"ids-alert__carousel-chevron\" />\n          </button>\n        </div>\n      }\n\n      <div class=\"ids-alert__global-content\">\n        <div class=\"ids-alert__global-icon-wrap\">\n          <ids-icon\n            [shapeName]=\"statusIconSlug()\"\n            [size]=\"16\"\n            className=\"ids-alert__global-icon\"\n          />\n        </div>\n        <p class=\"ids-alert__global-message\">\n          {{ resolvedMessage }}\n          @if (showLink) {\n            @if (linkSlot) {\n              <ng-content select=\"ids-alert-link\" />\n            } @else if (resolvedLink; as linkRef) {\n              @if (linkRef.href) {\n                <a\n                  class=\"ids-alert__link\"\n                  [href]=\"linkRef.href\"\n                  (click)=\"onLinkActivate($event)\"\n                >\n                  {{ linkRef.label }}\n                </a>\n              } @else {\n                <button\n                  type=\"button\"\n                  class=\"ids-alert__link-button\"\n                  (click)=\"onLinkActivate($event)\"\n                >\n                  {{ linkRef.label }}\n                </button>\n              }\n            }\n          }\n        </p>\n      </div>\n\n      <div class=\"ids-alert__global-actions\" [attr.data-has-action]=\"showAction ? 'true' : 'false'\">\n        @if (showAction) {\n          <button type=\"button\" class=\"ids-alert__global-action\" (click)=\"action.emit()\">\n            {{ resolvedActionLabel }}\n          </button>\n        }\n        @if (showDismissGlobal) {\n          <button\n            type=\"button\"\n            class=\"ids-alert__global-dismiss\"\n            aria-label=\"Dismiss alert\"\n            (click)=\"onDismissClick()\"\n          >\n            <ids-icon shapeName=\"shape-x\" [size]=\"12\" className=\"ids-alert__global-dismiss-icon\" />\n          </button>\n        }\n      </div>\n    </section>\n  } @else {\n    <div\n      class=\"ids-alert ids-alert--inline\"\n      [class.ids-alert--inline-compact]=\"density === 'compact'\"\n      [class.ids-alert--inline-detailed]=\"density === 'detailed'\"\n      [attr.data-severity]=\"severity\"\n      [attr.data-density]=\"density\"\n      role=\"alert\"\n    >\n      <div class=\"ids-alert__inline-main\">\n        <span class=\"ids-alert__inline-icon-wrap\">\n          <ids-icon\n            [shapeName]=\"statusIconSlug()\"\n            [size]=\"16\"\n            className=\"ids-alert__inline-icon\"\n          />\n        </span>\n        <div class=\"ids-alert__inline-text\">\n          @if (showTitleRow) {\n            <div class=\"ids-alert__title-row\">\n              @if (hasTitleSlot) {\n                <p class=\"ids-alert__inline-title\">{{ resolvedTitle }}</p>\n              } @else {\n                <p class=\"ids-alert__inline-title\">{{ title }}</p>\n              }\n              <button type=\"button\" class=\"ids-alert__inline-action\" (click)=\"action.emit()\">\n                {{ resolvedActionLabel }}\n              </button>\n            </div>\n          } @else if (showTitle) {\n            @if (hasTitleSlot) {\n              <p class=\"ids-alert__inline-title\">{{ resolvedTitle }}</p>\n            } @else {\n              <p class=\"ids-alert__inline-title\">{{ title }}</p>\n            }\n          }\n\n          <p class=\"ids-alert__inline-message\">\n            {{ resolvedMessage }}\n            @if (showLink && !linkSlot && resolvedLink; as linkRef) {\n              @if (linkRef.href) {\n                <a\n                  class=\"ids-alert__inline-link\"\n                  [href]=\"linkRef.href\"\n                  (click)=\"onLinkActivate($event)\"\n                >\n                  {{ linkRef.label }}\n                </a>\n              } @else {\n                <button\n                  type=\"button\"\n                  class=\"ids-alert__inline-link-button\"\n                  (click)=\"onLinkActivate($event)\"\n                >\n                  {{ linkRef.label }}\n                </button>\n              }\n            }\n          </p>\n\n          @if (showLink && linkSlot) {\n            <ng-content select=\"ids-alert-link\" />\n          }\n        </div>\n      </div>\n\n      @if (showTrailing) {\n        <div\n          class=\"ids-alert__inline-trailing\"\n          [attr.data-has-action]=\"showActionInTrailing ? 'true' : 'false'\"\n        >\n          @if (showActionInTrailing) {\n            <button type=\"button\" class=\"ids-alert__inline-action\" (click)=\"action.emit()\">\n              {{ resolvedActionLabel }}\n            </button>\n          }\n          @if (showDismissInline) {\n            <button\n              type=\"button\"\n              class=\"ids-alert__inline-dismiss\"\n              aria-label=\"Dismiss alert\"\n              (click)=\"onDismissClick()\"\n            >\n              <ids-icon shapeName=\"shape-x\" [size]=\"12\" />\n            </button>\n          }\n        </div>\n      }\n    </div>\n  }\n}\n", styles: ["/* Ported from storybook/src/components/Alert.module.css \u2014 single file for ngc inline (no @use). */\n\n.ids-alert__link,\n.ids-alert__link-button,\n.ids-alert__inline-link,\n.ids-alert__inline-link-button {\n  padding: 0;\n  border: none;\n  background: transparent;\n  font: inherit;\n  text-decoration: underline;\n  cursor: pointer;\n}\n\n.ids-alert__link:focus-visible,\n.ids-alert__link-button:focus-visible,\n.ids-alert__inline-link:focus-visible,\n.ids-alert__inline-link-button:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n/* \u2014\u2014\u2014 Global \u2014\u2014\u2014 */\n.ids-alert--global {\n  position: relative;\n  width: 100%;\n  min-height: 40px;\n  display: flex;\n  align-items: stretch;\n  justify-content: space-between;\n  gap: var(--spacing-space-8);\n  padding-left: 0;\n  border: var(--border-width-border-1) solid transparent;\n  font-family: inherit;\n  box-sizing: border-box;\n}\n\n.ids-alert--global:not([data-carousel=\"true\"]) {\n  padding-left: var(--padding-padding-20);\n}\n\n.ids-alert__global-content {\n  min-width: 0;\n  flex: 1;\n  display: flex;\n  align-items: flex-start;\n  gap: var(--spacing-space-8);\n  padding-block: var(--padding-padding-10);\n}\n\n.ids-alert__global-actions {\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-end;\n  gap: var(--spacing-space-16);\n  padding: 14px var(--padding-padding-16);\n  flex-shrink: 0;\n}\n\n.ids-alert__global-actions[data-has-action=\"true\"] {\n  align-items: center;\n  padding-block: var(--padding-padding-8);\n}\n\n.ids-alert__global-icon-wrap {\n  display: flex;\n  align-items: center;\n  padding-top: 2px;\n}\n\n.ids-alert__global-icon {\n  flex-shrink: 0;\n}\n\n.ids-alert__global-message {\n  margin: 0;\n  min-width: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  color: inherit;\n}\n\n.ids-alert__link,\n.ids-alert__link-button {\n  color: inherit;\n  line-height: inherit;\n  font-weight: 400;\n}\n\n.ids-alert__global-action {\n  min-height: 24px;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border: var(--border-width-border-1) solid currentColor;\n  border-radius: var(--corner-radius-radius-2);\n  background: transparent;\n  color: inherit;\n  font: inherit;\n  font-weight: 500;\n  line-height: var(--font-line-height-line-height-20);\n  cursor: pointer;\n}\n\n.ids-alert__global-dismiss,\n.ids-alert__carousel-button {\n  width: auto;\n  height: auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: inherit;\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-alert__global-dismiss-icon,\n.ids-alert__carousel-chevron {\n  flex-shrink: 0;\n}\n\n.ids-alert__global-dismiss:focus-visible,\n.ids-alert__carousel-button:focus-visible,\n.ids-alert__global-action:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 2px;\n}\n\n.ids-alert__carousel-rail {\n  position: absolute;\n  top: -1px;\n  bottom: -1px;\n  left: -1px;\n  width: 132px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 22px;\n  padding: var(--padding-padding-10) var(--padding-padding-14);\n  border: var(--border-width-border-1) solid;\n  border-color: inherit;\n  box-sizing: border-box;\n}\n\n.ids-alert--global[data-carousel=\"true\"] .ids-alert__global-content {\n  padding-left: 148px;\n}\n\n.ids-alert__carousel-count {\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-text-white);\n  white-space: nowrap;\n}\n\n.ids-alert--global[data-severity=\"critical\"] {\n  background: var(--color-background-alerting-critical);\n  border-color: var(--color-border-alerting-transparent-critical);\n  color: var(--color-text-white);\n}\n\n.ids-alert--global[data-severity=\"warning-major\"] {\n  background: var(--color-background-alerting-major);\n  border-color: var(--color-border-alerting-transparent-major);\n  color: var(--color-text-black);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] {\n  background: var(--color-background-alerting-minor);\n  border-color: var(--color-border-alerting-minor-transparent);\n  color: var(--color-text-black);\n}\n\n.ids-alert--global[data-severity=\"informational\"] {\n  background: var(--color-background-alerting-info);\n  border-color: var(--color-border-alerting-transparent-info);\n  color: var(--color-text-white);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-critical-strong);\n}\n\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-major-strong);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-minor-strong);\n}\n\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__carousel-rail {\n  background: var(--color-background-alerting-info-strong);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__carousel-chevron,\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__carousel-chevron,\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__carousel-chevron {\n  filter: brightness(0) invert(1);\n}\n\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__carousel-chevron {\n  filter: brightness(0);\n}\n\n.ids-alert--global[data-severity=\"critical\"] .ids-alert__global-dismiss-icon,\n.ids-alert--global[data-severity=\"warning-major\"] .ids-alert__global-dismiss-icon,\n.ids-alert--global[data-severity=\"warning-minor\"] .ids-alert__global-dismiss-icon {\n  filter: brightness(0);\n}\n\n.ids-alert--global[data-severity=\"informational\"] .ids-alert__global-dismiss-icon {\n  filter: brightness(0) invert(1);\n}\n\n/* \u2014\u2014\u2014 Inline \u2014\u2014\u2014 */\n.ids-alert--inline {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  width: 100%;\n  box-sizing: border-box;\n  min-height: var(--scale-40);\n  padding-left: var(--padding-padding-20);\n  border: var(--border-width-border-1) solid transparent;\n  border-radius: 0;\n  font-family: inherit;\n  gap: var(--spacing-space-12);\n  box-shadow: inset 4px 0 0 0 var(--inline-rail, var(--color-background-alerting-info));\n}\n\n.ids-alert__inline-main {\n  flex: 1 1 auto;\n  min-width: 0;\n  display: flex;\n  align-items: flex-start;\n  gap: var(--spacing-space-8);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-main {\n  padding-block: var(--padding-padding-10);\n  padding-right: var(--padding-padding-8);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-main {\n  padding-block: var(--padding-padding-12);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-icon-wrap {\n  padding-top: var(--padding-padding-2);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-icon-wrap {\n  padding-top: var(--padding-padding-4);\n}\n\n.ids-alert__inline-icon-wrap {\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n}\n\n.ids-alert__inline-icon {\n  flex-shrink: 0;\n}\n\n.ids-alert__inline-text {\n  min-width: 0;\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  padding-right: var(--padding-padding-16);\n}\n\n.ids-alert__inline-title {\n  margin: 0;\n  font-size: var(--font-size-body-1);\n  line-height: var(--font-line-height-line-height-24);\n  font-weight: 500;\n  color: var(--color-static-gray-900);\n}\n\n.ids-alert__inline-message {\n  margin: 0;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n  color: var(--color-static-gray-900);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-message {\n  font-weight: 500;\n}\n\n.ids-alert__inline-link,\n.ids-alert__inline-link-button {\n  color: var(--color-static-brand-500);\n  font-size: inherit;\n  line-height: inherit;\n  font-weight: 400;\n}\n\n.ids-alert__inline-trailing {\n  display: flex;\n  flex-shrink: 0;\n  align-items: flex-start;\n  justify-content: flex-end;\n  gap: var(--spacing-space-16);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-trailing {\n  align-items: center;\n  height: var(--scale-40);\n  box-sizing: border-box;\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.ids-alert--inline-compact .ids-alert__inline-trailing[data-has-action=\"true\"] {\n  padding: var(--padding-padding-8) var(--padding-padding-16);\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-trailing {\n  padding: var(--padding-padding-16) 17px var(--padding-padding-16) 0;\n}\n\n.ids-alert--inline-detailed .ids-alert__inline-action {\n  margin-top: calc(var(--padding-padding-12) - var(--padding-padding-16));\n}\n\n.ids-alert__inline-action {\n  min-height: 24px;\n  padding: var(--padding-padding-2) var(--padding-padding-16);\n  border: var(--border-width-border-1) solid var(--color-border-brand-base);\n  border-radius: var(--corner-radius-radius-2);\n  background: transparent;\n  color: var(--color-text-brand-strong);\n  font: inherit;\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n  cursor: pointer;\n}\n\n.ids-alert__inline-dismiss {\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-end;\n  box-sizing: border-box;\n  border: none;\n  background: transparent;\n  color: var(--color-icon-black);\n  cursor: pointer;\n  /* 12\u00D712 glyph; 32\u00D732 min hit target extends left/up/down \u2014 trailing pad-right keeps icon 16px from alert edge */\n  padding: 10px 0 10px 20px;\n  min-width: var(--scale-32);\n  min-height: var(--scale-32);\n}\n\n.ids-alert__inline-dismiss:focus-visible,\n.ids-alert__inline-action:focus-visible {\n  outline: var(--border-width-border-2) solid var(--color-border-brand-base);\n  outline-offset: 1px;\n}\n\n.ids-alert--inline-detailed {\n  min-height: 85px;\n}\n\n.ids-alert__title-row {\n  display: flex;\n  align-items: flex-start;\n  gap: 4px;\n  width: 100%;\n}\n\n.ids-alert__title-row .ids-alert__inline-title {\n  flex: 1 1 auto;\n  min-width: 0;\n}\n\n.ids-alert__title-row .ids-alert__inline-action {\n  flex-shrink: 0;\n}\n\n.ids-alert--inline[data-severity=\"informational\"] {\n  --inline-alert-icon: var(--color-icon-alerting-info);\n  --inline-rail: var(--color-background-alerting-info);\n  background: var(--color-background-alerting-info-light);\n  border-color: var(--color-border-alerting-info-transparent);\n}\n\n.ids-alert--inline[data-severity=\"success\"] {\n  --inline-alert-icon: var(--color-icon-alerting-success);\n  --inline-rail: var(--color-background-alerting-success);\n  background: var(--color-background-alerting-success-light);\n  border-color: var(--color-border-alerting-success-transparent);\n}\n\n.ids-alert--inline[data-severity=\"warning-minor\"] {\n  --inline-alert-icon: var(--color-icon-alerting-minor);\n  --inline-rail: var(--color-background-alerting-minor);\n  background: var(--color-background-alerting-minor-light);\n  border-color: var(--color-border-alerting-minor-transparent);\n  box-shadow: none;\n}\n\n.ids-alert--inline[data-severity=\"warning-minor\"]::before {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 4px;\n  background: linear-gradient(\n    90deg,\n    var(--color-background-alerting-minor) 0 75%,\n    var(--color-border-alerting-warning-accessible, var(--color-border-alerting-minor-minor)) 75% 100%\n  );\n  pointer-events: none;\n}\n\n.ids-alert--inline[data-severity=\"warning-major\"] {\n  --inline-alert-icon: var(--color-icon-alerting-major);\n  --inline-rail: var(--color-background-alerting-major);\n  background: var(--color-background-alerting-major-light);\n  border-color: var(--color-border-alerting-major-transparent);\n}\n\n.ids-alert--inline[data-severity=\"critical\"] {\n  --inline-alert-icon: var(--color-icon-alerting-critical);\n  --inline-rail: var(--color-background-alerting-critical);\n  background: var(--color-background-alerting-critical-light);\n  border-color: var(--color-border-alerting-critical-transparent);\n}\n"] }]
    }], null, { messageSlot: [{
            type: ContentChild,
            args: [IdsAlertMessageComponent]
        }], messageHost: [{
            type: ContentChild,
            args: [IdsAlertMessageComponent, { read: ElementRef }]
        }], titleSlot: [{
            type: ContentChild,
            args: [IdsAlertTitleComponent]
        }], titleHost: [{
            type: ContentChild,
            args: [IdsAlertTitleComponent, { read: ElementRef }]
        }], linkSlot: [{
            type: ContentChild,
            args: [IdsAlertLinkComponent]
        }], actionSlot: [{
            type: ContentChild,
            args: [IdsAlertActionComponent]
        }], display: [{
            type: Input
        }], severity: [{
            type: Input
        }], message: [{
            type: Input
        }], title: [{
            type: Input
        }], density: [{
            type: Input
        }], link: [{
            type: Input
        }], linkLabel: [{
            type: Input
        }], linkHref: [{
            type: Input
        }], actionLabel: [{
            type: Input
        }], dismissible: [{
            type: Input
        }], carousel: [{
            type: Input
        }], action: [{
            type: Output
        }], dismiss: [{
            type: Output
        }], linkClick: [{
            type: Output
        }], carouselPrevious: [{
            type: Output
        }], carouselNext: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertComponent, { className: "IdsAlertComponent", filePath: "src/components/ids-alert/ids-alert.component.ts", lineNumber: 39 }); })();
