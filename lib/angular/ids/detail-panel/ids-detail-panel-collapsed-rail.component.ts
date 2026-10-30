import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_DETAIL_PANEL_CONTEXT } from "./ids-detail-panel-context";

@Component({
  selector: "ids-detail-panel-collapsed-rail",
  standalone: true,
  styles: [":host { display: block; height: 100%; }"],
  template: `
    <div
      class="ids-detail-panel__collapsed-rail"
      [class.ids-detail-panel__collapsed-rail--page]="panel.attachMode === 'page'"
      [class.ids-detail-panel__collapsed-rail--datagrid]="panel.attachMode === 'datagrid'"
    >
      <div class="ids-detail-panel__controls">
        <ng-content select="ids-detail-panel-toggle-button" />
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelCollapsedRailComponent {
  readonly panel = inject(IDS_DETAIL_PANEL_CONTEXT);
}
