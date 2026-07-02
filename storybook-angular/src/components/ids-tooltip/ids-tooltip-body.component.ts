import { Component, ViewEncapsulation } from "@angular/core";

/** Required tooltip body slot — maps to spec `BodyContent`. */
@Component({
  selector: "ids-tooltip-body",
  standalone: true,
  template: `<div class="ids-tooltip__body"><ng-content /></div>`,
  styles: [`:host { display: contents; }`],
  encapsulation: ViewEncapsulation.None,
})
export class IdsTooltipBodyComponent {}
