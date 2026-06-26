import { Component, ContentChild, ElementRef, HostBinding, Input, inject, } from "@angular/core";
import { IdsAlertMessageComponent } from "./ids-alert-message.component";
import { IdsAlertLinkComponent } from "./ids-alert-link.component";
import { IdsAlertActionComponent } from "./ids-alert-action.component";
import { IDS_ALERT_GROUP_CONTEXT } from "./ids-alert-group-context";
import * as i0 from "@angular/core";
const _c0 = [[["ids-alert-message"]], [["ids-alert-link"]], [["ids-alert-action"]]];
const _c1 = ["ids-alert-message", "ids-alert-link", "ids-alert-action"];
/**
 * One logical global alert item — projected into the group's single `ids-alert` chrome.
 * Maps to spec `AlertItem` / Clarity `clr-alert-item`.
 */
export class IdsAlertItemComponent {
    group = inject(IDS_ALERT_GROUP_CONTEXT, { optional: true });
    messageRef;
    linkSlot;
    actionSlot;
    severity;
    /** Shorthand when `ids-alert-message` is not projected. */
    message = "";
    linkLabel = "";
    linkHref = "";
    actionLabel = "";
    itemIndex = 0;
    messageFromSlot = "";
    itemClass = true;
    get hiddenAttr() {
        return "";
    }
    get ariaHidden() {
        return "true";
    }
    ngAfterContentInit() {
        this.syncFromSlots();
    }
    refreshFromSlots() {
        this.syncFromSlots();
    }
    get resolvedMessage() {
        return this.messageFromSlot || this.message;
    }
    get resolvedLinkLabel() {
        return this.linkSlot?.label || this.linkLabel;
    }
    get resolvedLinkHref() {
        return this.linkSlot?.href || this.linkHref;
    }
    get resolvedActionLabel() {
        return this.actionSlot?.label || this.actionLabel;
    }
    isActive() {
        return this.group?.isActive(this) ?? false;
    }
    setItemIndex(index) {
        this.itemIndex = index;
    }
    syncFromSlots() {
        const el = this.messageRef?.nativeElement;
        this.messageFromSlot = el?.textContent?.trim() ?? "";
    }
    static ɵfac = function IdsAlertItemComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertItemComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertItemComponent, selectors: [["ids-alert-item"]], contentQueries: function IdsAlertItemComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsAlertMessageComponent, 5, ElementRef)(dirIndex, IdsAlertLinkComponent, 5)(dirIndex, IdsAlertActionComponent, 5);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.messageRef = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.linkSlot = _t.first);
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.actionSlot = _t.first);
        } }, hostVars: 4, hostBindings: function IdsAlertItemComponent_HostBindings(rf, ctx) { if (rf & 2) {
            i0.ɵɵattribute("hidden", ctx.hiddenAttr)("aria-hidden", ctx.ariaHidden);
            i0.ɵɵclassProp("ids-alert-item", ctx.itemClass);
        } }, inputs: { severity: "severity", message: "message", linkLabel: "linkLabel", linkHref: "linkHref", actionLabel: "actionLabel" }, ngContentSelectors: _c1, decls: 3, vars: 0, template: function IdsAlertItemComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵprojection(0);
            i0.ɵɵprojection(1, 1);
            i0.ɵɵprojection(2, 2);
        } }, encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertItemComponent, [{
        type: Component,
        args: [{
                selector: "ids-alert-item",
                standalone: true,
                template: `
    <ng-content select="ids-alert-message" />
    <ng-content select="ids-alert-link" />
    <ng-content select="ids-alert-action" />
  `,
            }]
    }], null, { messageRef: [{
            type: ContentChild,
            args: [IdsAlertMessageComponent, { read: ElementRef }]
        }], linkSlot: [{
            type: ContentChild,
            args: [IdsAlertLinkComponent]
        }], actionSlot: [{
            type: ContentChild,
            args: [IdsAlertActionComponent]
        }], severity: [{
            type: Input,
            args: [{ required: true }]
        }], message: [{
            type: Input
        }], linkLabel: [{
            type: Input
        }], linkHref: [{
            type: Input
        }], actionLabel: [{
            type: Input
        }], itemClass: [{
            type: HostBinding,
            args: ["class.ids-alert-item"]
        }], hiddenAttr: [{
            type: HostBinding,
            args: ["attr.hidden"]
        }], ariaHidden: [{
            type: HostBinding,
            args: ["attr.aria-hidden"]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertItemComponent, { className: "IdsAlertItemComponent", filePath: "src/components/ids-alert/ids-alert-item.component.ts", lineNumber: 29 }); })();
