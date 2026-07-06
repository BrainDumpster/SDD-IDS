import { Component, ViewEncapsulation } from "@angular/core";

/** Detail panel body slot — scrollable content region. */
@Component({
  selector: "ids-detail-panel-body",
  standalone: true,
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`],
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelBodyComponent {}
