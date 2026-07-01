import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, inject, } from "@angular/core";
import { IdsDropdownMenuItemComponent } from "./ids-dropdown-menu-item.component";
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class IdsDropdownMenuGroupComponent {
    elementRef = inject((ElementRef));
    groupName;
    itemQuery;
    items = [];
    ngAfterContentInit() {
        this.bindItems();
        this.itemQuery.changes.subscribe(() => this.bindItems());
    }
    bindItems() {
        this.items = this.itemQuery.toArray();
    }
    toMenuModels() {
        const header = {
            id: `section-${this.groupName}`,
            label: this.groupName,
            kind: "section",
        };
        return [header, ...this.items.map((item) => item.toMenuModel())];
    }
    static ɵfac = function IdsDropdownMenuGroupComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || IdsDropdownMenuGroupComponent)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: IdsDropdownMenuGroupComponent, selectors: [["ids-dropdown-menu-group"]], contentQueries: function IdsDropdownMenuGroupComponent_ContentQueries(rf, ctx, dirIndex) { if (rf & 1) {
            i0.ɵɵcontentQuery(dirIndex, IdsDropdownMenuItemComponent, 4);
        } if (rf & 2) {
            let _t;
            i0.ɵɵqueryRefresh(_t = i0.ɵɵloadQuery()) && (ctx.itemQuery = _t);
        } }, inputs: { groupName: "groupName" }, ngContentSelectors: _c0, decls: 1, vars: 0, template: function IdsDropdownMenuGroupComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵprojection(0);
        } }, encapsulation: 2, changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(IdsDropdownMenuGroupComponent, [{
        type: Component,
        args: [{
                selector: "ids-dropdown-menu-group",
                standalone: true,
                template: `<ng-content />`,
                changeDetection: ChangeDetectionStrategy.OnPush,
            }]
    }], null, { groupName: [{
            type: Input,
            args: [{ required: true }]
        }], itemQuery: [{
            type: ContentChildren,
            args: [IdsDropdownMenuItemComponent]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(IdsDropdownMenuGroupComponent, { className: "IdsDropdownMenuGroupComponent", filePath: "src/components/ids-dropdown/ids-dropdown-menu-group.component.ts", lineNumber: 20 }); })();
