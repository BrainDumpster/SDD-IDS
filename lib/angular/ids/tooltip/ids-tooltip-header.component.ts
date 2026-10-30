import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-tooltip-header",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <div class="ids-tooltip__header">
      <ng-content select="ids-tooltip-title" />
      <ng-content />
    </div>
  `,
})
export class IdsTooltipHeaderComponent {}
