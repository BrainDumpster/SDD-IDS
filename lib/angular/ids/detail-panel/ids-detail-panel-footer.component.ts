import { Component, ViewEncapsulation } from "@angular/core";
import { IdsDetailPanelToggleButtonComponent } from "./ids-detail-panel-toggle-button.component";

@Component({
  selector: "ids-detail-panel-footer",
  standalone: true,
  imports: [IdsDetailPanelToggleButtonComponent],
  styles: [":host { display: contents; }"],
  template: `
    <footer class="ids-detail-panel__footer">
      <ng-content />
      <div class="ids-detail-panel__controls">
        <ids-detail-panel-toggle-button />
      </div>
    </footer>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelFooterComponent {}
