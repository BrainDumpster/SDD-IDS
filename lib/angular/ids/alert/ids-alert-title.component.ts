import { Component } from "@angular/core";

/** Inline detailed title slot — spec `AlertTitle`. */
@Component({
  selector: "ids-alert-title",
  standalone: true,
  template: `<p class="ids-alert__inline-title"><ng-content /></p>`,
})
export class IdsAlertTitleComponent {}
