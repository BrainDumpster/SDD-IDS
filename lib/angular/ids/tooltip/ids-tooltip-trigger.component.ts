import { Component, ElementRef, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOOLTIP_CONTEXT } from "./ids-tooltip-context";

@Component({
  selector: "ids-tooltip-trigger",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    class: "ids-tooltip__trigger",
    tabindex: "0",
    "[attr.aria-describedby]": "tooltip.triggerDescribedBy",
    "(mouseenter)": "tooltip.onTriggerPointerEnter()",
    "(mouseleave)": "tooltip.onTriggerPointerLeave()",
    "(focusin)": "tooltip.onTriggerFocusIn()",
    "(focusout)": "tooltip.onTriggerFocusOut($event)",
  },
})
export class IdsTooltipTriggerComponent {
  readonly tooltip = inject(IDS_TOOLTIP_CONTEXT);
  constructor(readonly host: ElementRef<HTMLElement>) {}
}
