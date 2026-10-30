import { Component, ViewEncapsulation } from "@angular/core";

/** Required tooltip body slot — maps to spec `BodyContent`. */
@Component({
  selector: "ids-tooltip-body",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<div class="ids-tooltip__body"><ng-content /></div>`,
})
export class IdsTooltipBodyComponent {}
