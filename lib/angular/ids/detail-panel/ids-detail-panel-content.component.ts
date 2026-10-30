import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-detail-panel-content",
  standalone: true,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        height: 100%;
      }
    `,
  ],
  template: `
    <ng-content select="ids-detail-panel-header" />
    <ng-content select="ids-detail-panel-body" />
    <ng-content select="ids-detail-panel-footer" />
  `,
  encapsulation: ViewEncapsulation.None,
})
export class IdsDetailPanelContentComponent {}
