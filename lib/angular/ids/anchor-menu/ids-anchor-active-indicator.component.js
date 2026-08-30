var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";
let IdsAnchorActiveIndicatorComponent = class IdsAnchorActiveIndicatorComponent {
    menu = inject(IDS_ANCHOR_MENU_CONTEXT);
    get topPx() {
        return this.menu.activeIndicatorTopPx;
    }
};
IdsAnchorActiveIndicatorComponent = __decorate([
    Component({
        selector: "ids-anchor-active-indicator",
        standalone: true,
        template: `
    @if (topPx !== null) {
      <span
        class="ids-anchor-menu__active-indicator"
        [style.top.px]="topPx"
        aria-hidden="true"
      ></span>
    }
  `,
    })
], IdsAnchorActiveIndicatorComponent);
export { IdsAnchorActiveIndicatorComponent };
