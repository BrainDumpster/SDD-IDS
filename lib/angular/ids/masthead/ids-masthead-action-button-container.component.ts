import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-masthead-action-button-container",
  standalone: true,
  template: `<div class="ids-masthead-action-button-container"><ng-content /></div>`,
  styles: [
    `
      .ids-masthead-action-button-container {
        display: inline-flex;
        align-items: center;
        gap: 0;
        height: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class IdsMastheadActionButtonContainerComponent {}
