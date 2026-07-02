import { Component, ViewEncapsulation } from "@angular/core";

/** Optional tooltip header slot — Body 2 Medium (`Header` in design spec). */
@Component({
  selector: "ids-tooltip-title",
  standalone: true,
  template: `<div class="ids-tooltip__title"><ng-content /></div>`,
  styles: [`:host { display: contents; }`],
  encapsulation: ViewEncapsulation.None,
})
export class IdsTooltipTitleComponent {}
