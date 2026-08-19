import { Component, inject } from "@angular/core";
import { IDS_ANCHOR_MENU_CONTEXT } from "./ids-anchor-menu-context";

@Component({
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
export class IdsAnchorActiveIndicatorComponent {
  private readonly menu = inject(IDS_ANCHOR_MENU_CONTEXT);

  get topPx(): number | null {
    return this.menu.activeIndicatorTopPx;
  }
}
