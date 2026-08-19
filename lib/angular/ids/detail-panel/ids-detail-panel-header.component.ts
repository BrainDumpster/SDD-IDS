import { Component, ViewEncapsulation } from "@angular/core";
import { IdsDetailPanelToggleButtonComponent } from "./ids-detail-panel-toggle-button.component";

/** Detail panel header — title slot plus built-in toggle (datagrid expanded). */
@Component({
  selector: "ids-detail-panel-header",
  standalone: true,
  imports: [IdsDetailPanelToggleButtonComponent],
  styles: [":host { display: contents; }"],
  template: `
    <header class="ids-detail-panel__header">
      <h3 class="ids-detail-panel__title">
        <ng-content select="ids-detail-panel-title" />
        <ng-content />
      </h3>
      <div class="ids-detail-panel__controls">
        <ids-detail-panel-toggle-button />
      </div>
    </header>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelHeaderComponent {}
