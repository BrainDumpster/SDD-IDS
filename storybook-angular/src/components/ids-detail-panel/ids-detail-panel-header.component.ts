import { Component, inject, ViewEncapsulation } from "@angular/core";

/** Detail panel header slot — title projection for datagrid-attached expanded mode. */
@Component({
  selector: "ids-detail-panel-header",
  standalone: true,
  template: `<ng-content />`,
  styles: [`:host { display: contents; }`],
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelHeaderComponent {}
