import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_DETAIL_PANEL_CONTEXT } from "./ids-detail-panel-context";

/** Detail panel body slot — scrollable content region. */
@Component({
  selector: "ids-detail-panel-body",
  standalone: true,
  template: `<div [id]="panel.bodyId" class="ids-detail-panel__body"><ng-content /></div>`,
  styles: [":host { display: contents; }"],
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelBodyComponent {
  readonly panel = inject(IDS_DETAIL_PANEL_CONTEXT);
}
