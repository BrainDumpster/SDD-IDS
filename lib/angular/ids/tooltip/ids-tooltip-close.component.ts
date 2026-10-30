import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_TOOLTIP_CONTEXT } from "./ids-tooltip-context";

@Component({
  selector: "ids-tooltip-close",
  standalone: true,
  imports: [IdsIconComponent],
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-tooltip__close"
      aria-label="Close tooltip"
      (click)="tooltip.onCloseClick()"
    >
      <ids-icon
        [shapeName]="tooltip.closeIconShapeName"
        [size]="12"
        className="ids-tooltip__close-icon"
      />
    </button>
  `,
})
export class IdsTooltipCloseComponent {
  readonly tooltip = inject(IDS_TOOLTIP_CONTEXT);
}
