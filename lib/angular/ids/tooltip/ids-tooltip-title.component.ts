import { Component, ViewEncapsulation } from "@angular/core";

/** Optional tooltip title — Body 2 Medium (`Header` / `TooltipTitle` in design spec). */
@Component({
  selector: "ids-tooltip-title",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<div class="ids-tooltip__title"><ng-content /></div>`,
})
export class IdsTooltipTitleComponent {}
