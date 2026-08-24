import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-detail-panel-title",
  standalone: true,
  template: `<ng-content />`,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelTitleComponent {}
