import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOOLTIP_CONTEXT } from "./ids-tooltip-context";

@Component({
  selector: "ids-tooltip-arrow",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <div
      class="ids-tooltip__arrow"
      [attr.data-side]="tooltip.side"
      [attr.data-align]="tooltip.resolvedArrowAlign"
      aria-hidden="true"
    >
      <span class="ids-tooltip__arrow-graphic">
        <svg class="ids-tooltip__arrow-svg" viewBox="0 0 10 6">
          <path
            class="ids-tooltip__arrow-fill"
            d="M0.5 5.5L5 0.5L9.5 5.5L9.5 6.5L0.5 6.5Z"
          />
          <path class="ids-tooltip__arrow-stroke" d="M0.5 5.5L5 0.5L9.5 5.5" />
        </svg>
      </span>
    </div>
  `,
})
export class IdsTooltipArrowComponent {
  readonly tooltip = inject(IDS_TOOLTIP_CONTEXT);
}
