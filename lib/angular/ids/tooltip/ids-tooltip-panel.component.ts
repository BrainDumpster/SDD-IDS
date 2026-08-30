import { Component, ElementRef, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOOLTIP_CONTEXT } from "./ids-tooltip-context";

@Component({
  selector: "ids-tooltip-panel",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-content select="ids-tooltip-arrow" />
    <div class="ids-tooltip__panel">
      <div [class]="tooltip.contentClass">
        <div class="ids-tooltip__content-column">
          <ng-content select="ids-tooltip-header" />
          <ng-content select="ids-tooltip-body" />
        </div>
        <ng-content select="ids-tooltip-close" />
      </div>
    </div>
  `,
  host: {
    "[class]": "tooltip.popupClass",
    role: "tooltip",
    "[id]": "tooltip.tooltipId",
    "[style.top.px]": "tooltip.popupTop",
    "[style.left.px]": "tooltip.popupLeft",
    "[style.visibility]": "tooltip.isOpen && tooltip.positioned ? 'visible' : 'hidden'",
    "[style.pointer-events]": "tooltip.isOpen ? 'auto' : 'none'",
    "(mouseenter)": "tooltip.onPopupPointerEnter()",
    "(mouseleave)": "tooltip.onPopupPointerLeave()",
    "(keydown)": "tooltip.onPopupKeydown($event)",
  },
})
export class IdsTooltipPanelComponent {
  readonly tooltip = inject(IDS_TOOLTIP_CONTEXT);
  constructor(readonly host: ElementRef<HTMLElement>) {}
}
