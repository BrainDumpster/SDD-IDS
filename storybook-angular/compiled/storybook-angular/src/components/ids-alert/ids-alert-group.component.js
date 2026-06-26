import { Component, ContentChildren, EventEmitter, Input, Output, ViewEncapsulation, } from "@angular/core";
import { IDS_ALERT_GROUP_CONTEXT, } from "./ids-alert-group-context";
import { IdsAlertItemComponent } from "./ids-alert-item.component";
import { IdsAlertComponent } from "./ids-alert.component";
import * as i0 from "@angular/core";
const _c0 = [[["ids-alert-item"]]];
const _c1 = ["ids-alert-item"];
function IdsAlertGroupComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    const _r1 = i0.ɵɵgetCurrentView();
    i0.ɵɵelementStart(0, "ids-alert", 2);
    i0.ɵɵlistener("carouselPrevious", function IdsAlertGroupComponent_Conditional_2_Template_ids_alert_carouselPrevious_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.previous()); })("carouselNext", function IdsAlertGroupComponent_Conditional_2_Template_ids_alert_carouselNext_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.next()); })("dismiss", function IdsAlertGroupComponent_Conditional_2_Template_ids_alert_dismiss_0_listener() { i0.ɵɵrestoreView(_r1); const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.onDismiss()); });
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r3 = ctx;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵproperty("severity", item_r3.severity)("carousel", ctx_r1.carousel)("message", item_r3.resolvedMessage)("linkLabel", item_r3.resolvedLinkLabel)("linkHref", item_r3.resolvedLinkHref)("actionLabel", item_r3.resolvedActionLabel)("dismissible", true);
} }
export class IdsAlertGroupComponent {
    itemQuery;
    activeIndex = 0;
    activeIndexChange = new EventEmitter();
    dismiss = new EventEmitter();
    dismissed = false;
    items = [];
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    get activeItem() {
        return this.items[this.activeIndex] ?? null;
    }
    get carousel() {
        if (this.items.length <= 1) {
            return null;
        }
        return {
            currentItem: this.activeIndex + 1,
            totalItems: this.items.length,
        };
    }
    isActive(item) {
        return this.activeItem === item;
    }
    previous() {
        this.setActiveIndex(this.activeIndex - 1);
    }
    next() {
        this.setActiveIndex(this.activeIndex + 1);
    }
    onDismiss() {
        this.dismissed = true;
        this.dismiss.emit();
    }
    bindItems() {
        this.items = this.itemQuery.toArray();
        this.items.forEach((item, index) => {
            item.setItemIndex(index);
            item.refreshFromSlots();
        });
        if (this.activeIndex >= this.items.length) {
            this.activeIndex = Math.max(0, this.items.length - 1);
        }
    }
    setActiveIndex(index) {
        const len = this.items.length;
        if (len === 0) {
            return;
        }
        const wrapped = ((index % len) + len) % len;
        this.activeIndex = wrapped;
        this.activeIndexChange.emit(wrapped);
    }
    static ɵfac = function IdsAlertGroupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsAlertGroupComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsAlertGroupComponent, selectors: [["ids-alert-group"]], contentQueries: function IdsAlertGroupComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsAlertItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, inputs: { activeIndex: "activeIndex" }, outputs: { activeIndexChange: "activeIndexChange", dismiss: "dismiss" }, features: [i0.ɵɵProvidersFeature([{ provide: IDS_ALERT_GROUP_CONTEXT, useExisting: IdsAlertGroupComponent }])], ngContentSelectors: _c1, decls: 3, vars: 1, consts: [[1, "ids-alert-group"], ["display", "global", 3, "severity", "carousel", "message", "linkLabel", "linkHref", "actionLabel", "dismissible"], ["display", "global", 3, "carouselPrevious", "carouselNext", "dismiss", "severity", "carousel", "message", "linkLabel", "linkHref", "actionLabel", "dismissible"]], template: function IdsAlertGroupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef(_c0);
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵconditionalCreate(2, IdsAlertGroupComponent_Conditional_2_Template, 1, 7, "ids-alert", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            let tmp_0_0;
            i0.ɵɵadvance(2);
            i0.ɵɵconditional((tmp_0_0 = !ctx.dismissed && ctx.activeItem) ? 2 : -1, tmp_0_0);
        } }, dependencies: [IdsAlertComponent], encapsulation: 2 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsAlertGroupComponent, [{
        type: Component,
        args: [{ selector: "ids-alert-group", standalone: true, imports: [IdsAlertComponent], encapsulation: ViewEncapsulation.None, providers: [{ provide: IDS_ALERT_GROUP_CONTEXT, useExisting: IdsAlertGroupComponent }], template: "<div class=\"ids-alert-group\">\n  <ng-content select=\"ids-alert-item\" />\n\n  @if (!dismissed && activeItem; as item) {\n    <ids-alert\n      display=\"global\"\n      [severity]=\"item.severity\"\n      [carousel]=\"carousel\"\n      [message]=\"item.resolvedMessage\"\n      [linkLabel]=\"item.resolvedLinkLabel\"\n      [linkHref]=\"item.resolvedLinkHref\"\n      [actionLabel]=\"item.resolvedActionLabel\"\n      [dismissible]=\"true\"\n      (carouselPrevious)=\"previous()\"\n      (carouselNext)=\"next()\"\n      (dismiss)=\"onDismiss()\"\n    />\n  }\n</div>\n" }]
    }], null, { itemQuery: [{
            type: ContentChildren,
            args: [IdsAlertItemComponent]
        }], activeIndex: [{
            type: Input
        }], activeIndexChange: [{
            type: Output
        }], dismiss: [{
            type: Output
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsAlertGroupComponent, { className: "IdsAlertGroupComponent", filePath: "src/components/ids-alert/ids-alert-group.component.ts", lineNumber: 27 }); })();
