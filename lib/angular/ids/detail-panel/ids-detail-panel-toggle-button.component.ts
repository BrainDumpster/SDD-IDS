import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IdsIconComponent } from "../icon/ids-icon.component";
import { IDS_DETAIL_PANEL_CONTEXT } from "./ids-detail-panel-context";

@Component({
  selector: "ids-detail-panel-toggle-button",
  standalone: true,
  imports: [IdsIconComponent],
  styles: [":host { display: contents; }"],
  template: `
    <button
      type="button"
      class="ids-detail-panel__toggle"
      [attr.aria-label]="panel.toggleAriaLabel"
      [attr.aria-expanded]="panel.expanded"
      [attr.aria-controls]="panel.expanded ? panel.bodyId : null"
      (click)="panel.toggle()"
      (keydown)="panel.onToggleKeydown($event)"
    >
      <ids-icon [shapeName]="panel.toggleIcon" [size]="16" className="ids-detail-panel__toggle-icon" />
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelToggleButtonComponent {
  readonly panel = inject(IDS_DETAIL_PANEL_CONTEXT);
}
