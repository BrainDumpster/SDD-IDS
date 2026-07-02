import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, HostListener, inject, Input, Output, ViewChild, ViewEncapsulation, } from "@angular/core";
import { CommonModule, DOCUMENT } from "@angular/common";
import { TOOLTIP_API_DEFAULTS, } from "../../../../component-contracts/ids/tooltip.contract.js";
import { IdsIconComponent } from "../ids-icon/ids-icon.component";
import { IDS_TOOLTIP_CONTEXT } from "./ids-tooltip-context";
import { IdsTooltipBodyComponent } from "./ids-tooltip-body.component";
import { IdsTooltipTitleComponent } from "./ids-tooltip-title.component";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
const _c0 = ["triggerRef"];
const _c1 = ["popupRef"];
const _c2 = ["*", [["ids-tooltip-title"]], [["ids-tooltip-body"]]];
const _c3 = ["*", "ids-tooltip-title", "ids-tooltip-body"];
function IdsTooltipComponent_Conditional_3_Conditional_9_ng_container_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function IdsTooltipComponent_Conditional_3_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 12);
    i0.ɵɵtemplate(1, IdsTooltipComponent_Conditional_3_Conditional_9_ng_container_1_Template, 1, 0, "ng-container", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(2, "button", 14);
    i0.ɵɵlistener("click", function IdsTooltipComponent_Conditional_3_Conditional_9_Template_button_click_2_listener() { i0.ɵɵrestoreView(_r3); const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCloseClick()); });
    i0.ɵɵelement(3, "ids-icon", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    const panelCopyTpl_r4 = i0.ɵɵreference(5);
    i0.ɵɵadvance();
    i0.ɵɵproperty("ngTemplateOutlet", panelCopyTpl_r4);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("shapeName", ctx_r1.closeIconShapeName)("size", 12);
} }
function IdsTooltipComponent_Conditional_3_Conditional_10_ng_container_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementContainer(0);
} }
function IdsTooltipComponent_Conditional_3_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵtemplate(0, IdsTooltipComponent_Conditional_3_Conditional_10_ng_container_0_Template, 1, 0, "ng-container", 13);
} if (rf & 2) {
    i0.ɵɵnextContext(2);
    const panelCopyTpl_r4 = i0.ɵɵreference(5);
    i0.ɵɵproperty("ngTemplateOutlet", panelCopyTpl_r4);
} }
function IdsTooltipComponent_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "div", 5, 2);
    i0.ɵɵlistener("mouseenter", function IdsTooltipComponent_Conditional_3_Template_div_mouseenter_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPopupPointerEnter()); })("mouseleave", function IdsTooltipComponent_Conditional_3_Template_div_mouseleave_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPopupPointerLeave()); })("keydown", function IdsTooltipComponent_Conditional_3_Template_div_keydown_0_listener($event) { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onPopupKeydown($event)); });
    i0.ɵɵelementStart(2, "div", 6)(3, "span", 7);
    i0.ɵɵnamespaceSVG();
    i0.ɵɵelementStart(4, "svg", 8);
    i0.ɵɵelement(5, "path", 9)(6, "path", 10);
    i0.ɵɵelementEnd()()();
    i0.ɵɵnamespaceHTML();
    i0.ɵɵelementStart(7, "div", 11)(8, "div");
    i0.ɵɵconditionalCreate(9, IdsTooltipComponent_Conditional_3_Conditional_9_Template, 4, 3)(10, IdsTooltipComponent_Conditional_3_Conditional_10_Template, 1, 1, "ng-container");
    i0.ɵɵelementEnd()()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r1.popupClass);
    i0.ɵɵstyleProp("top", ctx_r1.popupTop, "px")("left", ctx_r1.popupLeft, "px")("visibility", ctx_r1.positioned ? "visible" : "hidden");
    i0.ɵɵproperty("id", ctx_r1.tooltipId);
    i0.ɵɵadvance(2);
    i0.ɵɵattribute("data-side", ctx_r1.side)("data-align", ctx_r1.resolvedArrowAlign);
    i0.ɵɵadvance(6);
    i0.ɵɵclassMap(ctx_r1.contentClass);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.closable ? 9 : 10);
} }
function IdsTooltipComponent_ng_template_4_Conditional_0_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 1);
} }
function IdsTooltipComponent_ng_template_4_Conditional_0_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 19);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.title);
} }
function IdsTooltipComponent_ng_template_4_Conditional_0_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 16);
    i0.ɵɵconditionalCreate(1, IdsTooltipComponent_ng_template_4_Conditional_0_Conditional_1_Template, 1, 0)(2, IdsTooltipComponent_ng_template_4_Conditional_0_Conditional_2_Template, 2, 1, "div", 19);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.hasTitleSlot ? 1 : ctx_r1.title ? 2 : -1);
} }
function IdsTooltipComponent_ng_template_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵprojection(0, 2);
} }
function IdsTooltipComponent_ng_template_4_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 18);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.content);
} }
function IdsTooltipComponent_ng_template_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵconditionalCreate(0, IdsTooltipComponent_ng_template_4_Conditional_0_Template, 3, 1, "div", 16);
    i0.ɵɵelementStart(1, "div", 17);
    i0.ɵɵconditionalCreate(2, IdsTooltipComponent_ng_template_4_Conditional_2_Template, 1, 0)(3, IdsTooltipComponent_ng_template_4_Conditional_3_Template, 2, 1, "div", 18);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵconditional(ctx_r1.showTitleInPanel ? 0 : -1);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r1.hasBodySlot ? 2 : 3);
} }
let tooltipInstanceCounter = 0;
export class IdsTooltipComponent {
    triggerRef;
    popupRef;
    titleSlot;
    bodySlot;
    side = TOOLTIP_API_DEFAULTS.side;
    /** `arrowAlign` in design spec. */
    arrowAlign = TOOLTIP_API_DEFAULTS.arrowAlign;
    /** @deprecated Use `arrowAlign`. */
    align;
    closable = TOOLTIP_API_DEFAULTS.closable;
    triggerDisplay = TOOLTIP_API_DEFAULTS.triggerDisplay;
    open;
    defaultOpen = false;
    /** Shorthand when `ids-tooltip-title` is not projected. */
    title = "";
    /** Shorthand when `ids-tooltip-body` is not projected. */
    content = "";
    closeIconShapeName = "ctrl-close-16";
    openChange = new EventEmitter();
    closed = new EventEmitter();
    tooltipId = `ids-tooltip-${++tooltipInstanceCounter}`;
    hasTitleSlot = false;
    hasBodySlot = false;
    isOpen = false;
    popupTop = 0;
    popupLeft = 0;
    positioned = false;
    manuallyDismissed = false;
    pointerInside = false;
    controlled = false;
    needsPositionUpdate = false;
    positionFrameId = null;
    leaveGraceTimer = null;
    document = inject(DOCUMENT);
    cdr = inject(ChangeDetectorRef);
    ngAfterContentInit() {
        this.hasTitleSlot = Boolean(this.titleSlot);
        this.hasBodySlot = Boolean(this.bodySlot);
        document.addEventListener("scroll", this.onScrollCapture, true);
        this.cdr.markForCheck();
    }
    ngOnChanges(changes) {
        if (changes["open"]) {
            this.controlled = changes["open"].currentValue !== undefined;
            if (this.controlled) {
                this.isOpen = Boolean(this.open);
            }
        }
        if (changes["defaultOpen"]?.firstChange && !this.controlled) {
            this.isOpen = this.defaultOpen;
        }
        if ((changes["side"] || changes["arrowAlign"] || changes["align"]) && this.isOpen) {
            this.schedulePositionUpdate();
        }
    }
    ngAfterViewChecked() {
        if (this.isOpen && this.needsPositionUpdate) {
            this.updatePosition();
        }
    }
    ngOnDestroy() {
        document.removeEventListener("scroll", this.onScrollCapture, true);
        this.cancelPositionUpdate();
        this.clearLeaveGraceTimer();
    }
    onScrollCapture = () => {
        if (this.isOpen) {
            this.schedulePositionUpdate();
        }
    };
    get resolvedArrowAlign() {
        return this.arrowAlign ?? this.align ?? "center";
    }
    get hasTitle() {
        return this.hasTitleSlot || Boolean(this.title?.trim());
    }
    get showTitleInPanel() {
        return this.hasTitle;
    }
    get popupClass() {
        return [
            "ids-tooltip__popup",
            this.closable ? "ids-tooltip__popup--closable" : "ids-tooltip__popup--standard",
            this.hasTitle ? "ids-tooltip__popup--with-title" : "ids-tooltip__popup--no-title",
        ].join(" ");
    }
    get contentClass() {
        return this.closable
            ? "ids-tooltip__content ids-tooltip__content--closable"
            : "ids-tooltip__content";
    }
    get triggerDescribedBy() {
        return this.isOpen ? this.tooltipId : null;
    }
    onTriggerPointerEnter() {
        this.clearLeaveGraceTimer();
        this.setOpen(true);
    }
    onTriggerPointerLeave() {
        if (this.closable) {
            return;
        }
        this.scheduleCloseAfterGrace();
    }
    onTriggerFocusIn() {
        this.clearLeaveGraceTimer();
        this.setOpen(true);
    }
    onTriggerFocusOut(event) {
        if (this.closable) {
            return;
        }
        const next = event.relatedTarget;
        const popup = this.popupRef?.nativeElement;
        if (popup && next && popup.contains(next)) {
            return;
        }
        this.setOpen(false);
    }
    onPopupPointerEnter() {
        this.clearLeaveGraceTimer();
        this.pointerInside = true;
        if (!this.closable) {
            this.setOpen(true);
        }
    }
    onPopupPointerLeave() {
        this.pointerInside = false;
        if (!this.closable) {
            this.scheduleCloseAfterGrace();
        }
    }
    onPopupKeydown(event) {
        if (event.key === "Escape" && this.closable) {
            this.dismiss("escape");
        }
    }
    onCloseClick() {
        this.dismiss("close-click");
    }
    onWindowResize() {
        if (this.isOpen) {
            this.schedulePositionUpdate();
        }
    }
    dismiss(reason) {
        this.manuallyDismissed = true;
        this.setOpen(false);
        this.closed.emit(reason);
    }
    setOpen(nextOpen) {
        if (this.controlled) {
            this.openChange.emit(nextOpen);
            return;
        }
        if (this.closable && !nextOpen && !this.manuallyDismissed) {
            return;
        }
        if (nextOpen) {
            this.manuallyDismissed = false;
        }
        if (this.isOpen === nextOpen) {
            return;
        }
        this.isOpen = nextOpen;
        this.openChange.emit(nextOpen);
        if (nextOpen) {
            this.positioned = false;
            this.schedulePositionUpdate();
        }
        else {
            this.positioned = false;
            this.cancelPositionUpdate();
            this.cdr.markForCheck();
        }
    }
    schedulePositionUpdate() {
        this.needsPositionUpdate = true;
        this.cancelPositionUpdate();
        this.positionFrameId = requestAnimationFrame(() => {
            this.positionFrameId = requestAnimationFrame(() => {
                this.positionFrameId = null;
                this.updatePosition();
            });
        });
        this.cdr.markForCheck();
    }
    cancelPositionUpdate() {
        if (this.positionFrameId !== null) {
            cancelAnimationFrame(this.positionFrameId);
            this.positionFrameId = null;
        }
        this.needsPositionUpdate = false;
    }
    clearLeaveGraceTimer() {
        if (this.leaveGraceTimer !== null) {
            clearTimeout(this.leaveGraceTimer);
            this.leaveGraceTimer = null;
        }
    }
    scheduleCloseAfterGrace() {
        this.clearLeaveGraceTimer();
        this.leaveGraceTimer = setTimeout(() => {
            this.leaveGraceTimer = null;
            if (!this.pointerInside) {
                this.setOpen(false);
            }
        }, 80);
    }
    ensurePopupPortaled() {
        const popup = this.popupRef?.nativeElement;
        if (!popup) {
            return;
        }
        const body = this.document.body;
        if (popup.parentElement !== body) {
            body.appendChild(popup);
        }
    }
    updatePosition() {
        const trigger = this.triggerRef?.nativeElement;
        const popup = this.popupRef?.nativeElement;
        if (!trigger || !popup) {
            this.needsPositionUpdate = true;
            return;
        }
        this.ensurePopupPortaled();
        const triggerRect = trigger.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        if (popupRect.width === 0 || popupRect.height === 0) {
            this.needsPositionUpdate = true;
            return;
        }
        const gap = 16;
        const side = this.side;
        const align = this.resolvedArrowAlign;
        let top = 0;
        let left = 0;
        switch (side) {
            case "top":
                top = triggerRect.top - popupRect.height - gap;
                left = this.alignOnAxis(triggerRect, popupRect, align, "horizontal");
                break;
            case "bottom":
                top = triggerRect.bottom + gap;
                left = this.alignOnAxis(triggerRect, popupRect, align, "horizontal");
                break;
            case "left":
                left = triggerRect.left - popupRect.width - gap;
                top = this.alignOnAxis(triggerRect, popupRect, align, "vertical");
                break;
            case "right":
                left = triggerRect.right + gap;
                top = this.alignOnAxis(triggerRect, popupRect, align, "vertical");
                break;
            default:
                top = triggerRect.top - popupRect.height - gap;
                left = this.alignOnAxis(triggerRect, popupRect, "center", "horizontal");
                break;
        }
        this.popupTop = Math.round(top);
        this.popupLeft = Math.round(left);
        this.positioned = true;
        this.needsPositionUpdate = false;
        this.cdr.markForCheck();
    }
    alignOnAxis(triggerRect, popupRect, align, axis) {
        if (axis === "horizontal") {
            switch (align) {
                case "start":
                    return triggerRect.left;
                case "end":
                    return triggerRect.right - popupRect.width;
                case "center":
                default:
                    return triggerRect.left + triggerRect.width / 2 - popupRect.width / 2;
            }
        }
        switch (align) {
            case "start":
                return triggerRect.top;
            case "end":
                return triggerRect.bottom - popupRect.height;
            case "center":
            default:
                return triggerRect.top + triggerRect.height / 2 - popupRect.height / 2;
        }
    }
    static ɵfac = function IdsTooltipComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsTooltipComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsTooltipComponent, selectors: [["ids-tooltip"]], contentQueries: function IdsTooltipComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsTooltipTitleComponent, 5)(dirIndex, IdsTooltipBodyComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.titleSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.bodySlot = _t.first);
        } }, viewQuery: function IdsTooltipComponent_Query(rf, ctx) { if (rf & 1) {
            i0.ɵɵviewQuery(_c0, 5)(_c1, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.triggerRef = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.popupRef = _t.first);
        } }, hostAttrs: [1, "ids-tooltip-host"], hostVars: 2, hostBindings: function IdsTooltipComponent_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("resize", function IdsTooltipComponent_resize_HostBindingHandler() { return ctx.onWindowResize(); }, i0.ɵɵresolveWindow);
        } if (rf & 2) {
            i0.ɵɵclassProp("ids-tooltip-host--block", ctx.triggerDisplay === "block");
        } }, inputs: { side: "side", arrowAlign: "arrowAlign", align: "align", closable: "closable", triggerDisplay: "triggerDisplay", open: "open", defaultOpen: "defaultOpen", title: "title", content: "content", closeIconShapeName: "closeIconShapeName" }, outputs: { openChange: "openChange", closed: "closed" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_TOOLTIP_CONTEXT, useExisting: IdsTooltipComponent }]), i0.ɵɵNgOnChangesFeature], ngContentSelectors: _c3, decls: 6, vars: 2, consts: [["triggerRef", ""], ["panelCopyTpl", ""], ["popupRef", ""], ["tabindex", "0", 1, "ids-tooltip__trigger", 3, "mouseenter", "mouseleave", "focusin", "focusout"], ["role", "tooltip", 3, "id", "class", "top", "left", "visibility"], ["role", "tooltip", 3, "mouseenter", "mouseleave", "keydown", "id"], ["aria-hidden", "true", 1, "ids-tooltip__arrow"], [1, "ids-tooltip__arrow-graphic"], ["viewBox", "0 0 10 6", 1, "ids-tooltip__arrow-svg"], ["d", "M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z", 1, "ids-tooltip__arrow-fill"], ["d", "M0.5 5.5L5 0.5L9.5 5.5", 1, "ids-tooltip__arrow-stroke"], [1, "ids-tooltip__panel"], [1, "ids-tooltip__content-column"], [4, "ngTemplateOutlet"], ["type", "button", "aria-label", "Close tooltip", 1, "ids-tooltip__close", 3, "click"], ["className", "ids-tooltip__close-icon", 3, "shapeName", "size"], [1, "ids-tooltip__header"], [1, "ids-tooltip__body-slot"], [1, "ids-tooltip__body"], [1, "ids-tooltip__title"]], template: function IdsTooltipComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c2);
            i0.ɵɵelementStart(0, "span", 3, 0);
            i0.ɵɵlistener("mouseenter", function IdsTooltipComponent_Template_span_mouseenter_0_listener() { return ctx.onTriggerPointerEnter(); })("mouseleave", function IdsTooltipComponent_Template_span_mouseleave_0_listener() { return ctx.onTriggerPointerLeave(); })("focusin", function IdsTooltipComponent_Template_span_focusin_0_listener() { return ctx.onTriggerFocusIn(); })("focusout", function IdsTooltipComponent_Template_span_focusout_0_listener($event) { return ctx.onTriggerFocusOut($event); });
            i0.ɵɵprojection(2);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(3, IdsTooltipComponent_Conditional_3_Template, 11, 14, "div", 4);
            i0.ɵɵtemplate(4, IdsTooltipComponent_ng_template_4_Template, 4, 2, "ng-template", null, 1, i0.ɵɵtemplateRefExtractor);
        } if (rf & 2) {
            i0.ɵɵattribute("aria-describedby", ctx.triggerDescribedBy);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.isOpen ? 3 : -1);
        } }, dependencies: [CommonModule, i1.NgTemplateOutlet, IdsIconComponent], styles: ["/* Ported from storybook/src/components/IdsTooltip.module.css */\n\n.ids-tooltip-host {\n  display: inline;\n  position: relative;\n  overflow: visible;\n}\n\n.ids-tooltip-host--block {\n  display: block;\n  width: 100%;\n}\n\n.ids-tooltip__trigger {\n  display: inline-flex;\n  max-width: 100%;\n  cursor: default;\n}\n\n.ids-tooltip-host--block .ids-tooltip__trigger {\n  display: flex;\n  width: 100%;\n}\n\n.ids-tooltip__popup {\n  position: fixed;\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  box-shadow: none;\n  max-width: 264px;\n  overflow: visible;\n  z-index: 1070;\n}\n\n.ids-tooltip__popup--standard {\n  width: 240px;\n}\n\n.ids-tooltip__popup--closable {\n  width: 264px;\n}\n\n.ids-tooltip__popup--with-title .ids-tooltip__body,\n.ids-tooltip__popup--no-title .ids-tooltip__body {\n  min-height: 80px;\n}\n\n.ids-tooltip__panel {\n  position: relative;\n  z-index: 0;\n  box-sizing: border-box;\n  width: 100%;\n  background: var(--color-background-surface-2);\n  color: var(--color-text-neutral);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--tooltip-control-radius);\n  box-shadow: 1px 1px 3px rgba(37, 37, 37, 0.25);\n}\n\n.ids-tooltip__arrow {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 0;\n  z-index: 1;\n  pointer-events: none;\n}\n\n.ids-tooltip__arrow-graphic {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 6px;\n  line-height: 0;\n}\n\n.ids-tooltip__arrow-svg {\n  width: 10px;\n  height: 6px;\n  display: block;\n  flex-shrink: 0;\n  overflow: visible;\n}\n\n.ids-tooltip__arrow-fill {\n  fill: var(--color-background-surface-2);\n}\n\n.ids-tooltip__arrow-stroke {\n  fill: none;\n  stroke: var(--color-border-accessible);\n  stroke-width: 1;\n  vector-effect: non-scaling-stroke;\n  stroke-linecap: butt;\n  stroke-linejoin: miter;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"] .ids-tooltip__arrow-svg {\n  transform: rotate(180deg);\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"] .ids-tooltip__arrow-svg {\n  transform: rotate(0deg);\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] .ids-tooltip__arrow-graphic,\n.ids-tooltip__arrow[data-side=\"right\"] .ids-tooltip__arrow-graphic {\n  width: 6px;\n  height: 10px;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] .ids-tooltip__arrow-svg {\n  transform: rotate(90deg);\n}\n\n.ids-tooltip__arrow[data-side=\"right\"] .ids-tooltip__arrow-svg {\n  transform: rotate(-90deg);\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"] {\n  top: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"] {\n  bottom: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"end\"] {\n  bottom: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"] {\n  left: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] {\n  right: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"start\"] {\n  left: 8px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"start\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"center\"] {\n  left: calc(50% - 5px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"center\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"end\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"end\"] {\n  left: calc(100% - 18px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"end\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"start\"] {\n  top: 8px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"start\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"start\"] {\n  left: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"center\"] {\n  top: calc(50% - 5px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"center\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"center\"] {\n  left: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"end\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"end\"] {\n  top: calc(100% - 18px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"end\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"end\"] {\n  left: -3px !important;\n}\n\n.ids-tooltip__content {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  padding: var(--padding-padding-12);\n}\n\n.ids-tooltip__content--closable {\n  flex-direction: row;\n  align-items: flex-start;\n  gap: 0;\n}\n\n.ids-tooltip__content-column {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  min-width: 0;\n  padding-right: var(--spacing-space-8);\n}\n\n.ids-tooltip__header {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n}\n\n.ids-tooltip__title {\n  color: var(--color-text-neutral-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n}\n\n.ids-tooltip__body {\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.ids-tooltip__close {\n  box-sizing: border-box;\n  width: 12px;\n  height: 12px;\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--color-text-neutral-strong);\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-tooltip__close-icon {\n  display: inline-block;\n  flex-shrink: 0;\n}\n\n[data-theme=\"dark\"] .ids-tooltip__close,\n.ids-theme-dark .ids-tooltip__close {\n  color: #4d4d4d;\n}\n"], encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsTooltipComponent, [{
        type: Component,
        args: [{ selector: "ids-tooltip", standalone: true, imports: [CommonModule, IdsIconComponent], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_TOOLTIP_CONTEXT, useExisting: IdsTooltipComponent }], host: {
                    class: "ids-tooltip-host",
                    "[class.ids-tooltip-host--block]": 'triggerDisplay === "block"',
                }, template: "<span\n  #triggerRef\n  class=\"ids-tooltip__trigger\"\n  tabindex=\"0\"\n  [attr.aria-describedby]=\"triggerDescribedBy\"\n  (mouseenter)=\"onTriggerPointerEnter()\"\n  (mouseleave)=\"onTriggerPointerLeave()\"\n  (focusin)=\"onTriggerFocusIn()\"\n  (focusout)=\"onTriggerFocusOut($event)\"\n>\n  <ng-content />\n</span>\n\n@if (isOpen) {\n  <div\n    #popupRef\n    [id]=\"tooltipId\"\n    [class]=\"popupClass\"\n    role=\"tooltip\"\n    [style.top.px]=\"popupTop\"\n    [style.left.px]=\"popupLeft\"\n    [style.visibility]=\"positioned ? 'visible' : 'hidden'\"\n    (mouseenter)=\"onPopupPointerEnter()\"\n    (mouseleave)=\"onPopupPointerLeave()\"\n    (keydown)=\"onPopupKeydown($event)\"\n  >\n    <div\n      class=\"ids-tooltip__arrow\"\n      [attr.data-side]=\"side\"\n      [attr.data-align]=\"resolvedArrowAlign\"\n      aria-hidden=\"true\"\n    >\n      <span class=\"ids-tooltip__arrow-graphic\">\n        <svg class=\"ids-tooltip__arrow-svg\" viewBox=\"0 0 10 6\">\n          <path\n            class=\"ids-tooltip__arrow-fill\"\n            d=\"M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z\"\n          />\n          <path class=\"ids-tooltip__arrow-stroke\" d=\"M0.5 5.5L5 0.5L9.5 5.5\" />\n        </svg>\n      </span>\n    </div>\n\n    <div class=\"ids-tooltip__panel\">\n      <div [class]=\"contentClass\">\n        @if (closable) {\n          <div class=\"ids-tooltip__content-column\">\n            <ng-container *ngTemplateOutlet=\"panelCopyTpl\" />\n          </div>\n          <button\n            type=\"button\"\n            class=\"ids-tooltip__close\"\n            aria-label=\"Close tooltip\"\n            (click)=\"onCloseClick()\"\n          >\n            <ids-icon\n              [shapeName]=\"closeIconShapeName\"\n              [size]=\"12\"\n              className=\"ids-tooltip__close-icon\"\n            />\n          </button>\n        } @else {\n          <ng-container *ngTemplateOutlet=\"panelCopyTpl\" />\n        }\n      </div>\n    </div>\n  </div>\n}\n\n<ng-template #panelCopyTpl>\n  @if (showTitleInPanel) {\n    <div class=\"ids-tooltip__header\">\n      @if (hasTitleSlot) {\n        <ng-content select=\"ids-tooltip-title\" />\n      } @else if (title) {\n        <div class=\"ids-tooltip__title\">{{ title }}</div>\n      }\n    </div>\n  }\n  <div class=\"ids-tooltip__body-slot\">\n    @if (hasBodySlot) {\n      <ng-content select=\"ids-tooltip-body\" />\n    } @else {\n      <div class=\"ids-tooltip__body\">{{ content }}</div>\n    }\n  </div>\n</ng-template>\n", styles: ["/* Ported from storybook/src/components/IdsTooltip.module.css */\n\n.ids-tooltip-host {\n  display: inline;\n  position: relative;\n  overflow: visible;\n}\n\n.ids-tooltip-host--block {\n  display: block;\n  width: 100%;\n}\n\n.ids-tooltip__trigger {\n  display: inline-flex;\n  max-width: 100%;\n  cursor: default;\n}\n\n.ids-tooltip-host--block .ids-tooltip__trigger {\n  display: flex;\n  width: 100%;\n}\n\n.ids-tooltip__popup {\n  position: fixed;\n  box-sizing: border-box;\n  background: transparent;\n  border: none;\n  box-shadow: none;\n  max-width: 264px;\n  overflow: visible;\n  z-index: 1070;\n}\n\n.ids-tooltip__popup--standard {\n  width: 240px;\n}\n\n.ids-tooltip__popup--closable {\n  width: 264px;\n}\n\n.ids-tooltip__popup--with-title .ids-tooltip__body,\n.ids-tooltip__popup--no-title .ids-tooltip__body {\n  min-height: 80px;\n}\n\n.ids-tooltip__panel {\n  position: relative;\n  z-index: 0;\n  box-sizing: border-box;\n  width: 100%;\n  background: var(--color-background-surface-2);\n  color: var(--color-text-neutral);\n  border: var(--border-width-border-default) solid var(--color-border-accessible);\n  border-radius: var(--tooltip-control-radius);\n  box-shadow: 1px 1px 3px rgba(37, 37, 37, 0.25);\n}\n\n.ids-tooltip__arrow {\n  position: absolute;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 0;\n  z-index: 1;\n  pointer-events: none;\n}\n\n.ids-tooltip__arrow-graphic {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 10px;\n  height: 6px;\n  line-height: 0;\n}\n\n.ids-tooltip__arrow-svg {\n  width: 10px;\n  height: 6px;\n  display: block;\n  flex-shrink: 0;\n  overflow: visible;\n}\n\n.ids-tooltip__arrow-fill {\n  fill: var(--color-background-surface-2);\n}\n\n.ids-tooltip__arrow-stroke {\n  fill: none;\n  stroke: var(--color-border-accessible);\n  stroke-width: 1;\n  vector-effect: non-scaling-stroke;\n  stroke-linecap: butt;\n  stroke-linejoin: miter;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"] .ids-tooltip__arrow-svg {\n  transform: rotate(180deg);\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"] .ids-tooltip__arrow-svg {\n  transform: rotate(0deg);\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] .ids-tooltip__arrow-graphic,\n.ids-tooltip__arrow[data-side=\"right\"] .ids-tooltip__arrow-graphic {\n  width: 6px;\n  height: 10px;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] .ids-tooltip__arrow-svg {\n  transform: rotate(90deg);\n}\n\n.ids-tooltip__arrow[data-side=\"right\"] .ids-tooltip__arrow-svg {\n  transform: rotate(-90deg);\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"] {\n  top: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"] {\n  bottom: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"end\"] {\n  bottom: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"] {\n  left: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"] {\n  right: -4px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"start\"] {\n  left: 8px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"start\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"center\"] {\n  left: calc(50% - 5px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"center\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"end\"],\n.ids-tooltip__arrow[data-side=\"top\"][data-align=\"end\"] {\n  left: calc(100% - 18px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"bottom\"][data-align=\"end\"] {\n  top: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"start\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"start\"] {\n  top: 8px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"start\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"start\"] {\n  left: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"center\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"center\"] {\n  top: calc(50% - 5px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"center\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"center\"] {\n  left: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"end\"],\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"end\"] {\n  top: calc(100% - 18px) !important;\n}\n\n.ids-tooltip__arrow[data-side=\"left\"][data-align=\"end\"] {\n  right: -5px !important;\n}\n\n.ids-tooltip__arrow[data-side=\"right\"][data-align=\"end\"] {\n  left: -3px !important;\n}\n\n.ids-tooltip__content {\n  display: flex;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  padding: var(--padding-padding-12);\n}\n\n.ids-tooltip__content--closable {\n  flex-direction: row;\n  align-items: flex-start;\n  gap: 0;\n}\n\n.ids-tooltip__content-column {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: column;\n  gap: var(--spacing-space-4);\n  min-width: 0;\n  padding-right: var(--spacing-space-8);\n}\n\n.ids-tooltip__header {\n  display: flex;\n  align-items: center;\n  min-width: 0;\n}\n\n.ids-tooltip__title {\n  color: var(--color-text-neutral-strong);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 500;\n}\n\n.ids-tooltip__body {\n  color: var(--color-text-neutral);\n  font-size: var(--font-size-body-2);\n  line-height: var(--font-line-height-line-height-20);\n  font-weight: 400;\n}\n\n.ids-tooltip__close {\n  box-sizing: border-box;\n  width: 12px;\n  height: 12px;\n  display: inline-flex;\n  flex-shrink: 0;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background: transparent;\n  color: var(--color-text-neutral-strong);\n  padding: 0;\n  cursor: pointer;\n}\n\n.ids-tooltip__close-icon {\n  display: inline-block;\n  flex-shrink: 0;\n}\n\n[data-theme=\"dark\"] .ids-tooltip__close,\n.ids-theme-dark .ids-tooltip__close {\n  color: #4d4d4d;\n}\n"] }]
    }], null, { triggerRef: [{
            type: ViewChild,
            args: ["triggerRef"]
        }], popupRef: [{
            type: ViewChild,
            args: ["popupRef"]
        }], titleSlot: [{
            type: ContentChild,
            args: [IdsTooltipTitleComponent]
        }], bodySlot: [{
            type: ContentChild,
            args: [IdsTooltipBodyComponent]
        }], side: [{
            type: Input
        }], arrowAlign: [{
            type: Input
        }], align: [{
            type: Input
        }], closable: [{
            type: Input
        }], triggerDisplay: [{
            type: Input
        }], open: [{
            type: Input
        }], defaultOpen: [{
            type: Input
        }], title: [{
            type: Input
        }], content: [{
            type: Input
        }], closeIconShapeName: [{
            type: Input
        }], openChange: [{
            type: Output
        }], closed: [{
            type: Output
        }], onWindowResize: [{
            type: HostListener,
            args: ["window:resize"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsTooltipComponent, { className: "IdsTooltipComponent", filePath: "src/components/ids-tooltip/ids-tooltip.component.ts", lineNumber: 48 }); })();
