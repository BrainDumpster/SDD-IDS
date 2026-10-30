var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ChangeDetectionStrategy, Component, Input, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
let IdsAnchorMenuHeaderComponent = class IdsAnchorMenuHeaderComponent {
    menu = inject(IDS_ANCHOR_MENU_CONTEXT);
    title;
    get resolvedTitle() {
        return this.title ?? this.menu.title;
    }
};
__decorate([
    Input()
], IdsAnchorMenuHeaderComponent.prototype, "title", void 0);
IdsAnchorMenuHeaderComponent = __decorate([
    Component({
        selector: "ids-anchor-menu-header",
        standalone: true,
        template: `<span class="ids-anchor-menu__header">{{ resolvedTitle }}</span>`,
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
], IdsAnchorMenuHeaderComponent);
export { IdsAnchorMenuHeaderComponent };
