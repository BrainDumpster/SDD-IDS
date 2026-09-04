import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOGGLE_SWITCH_CONTEXT } from "./ids-toggle-switch-context";

@Component({
  selector: "ids-toggle-switch-label",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <span class="ids-toggle-switch__label">
      <ng-content />
    </span>
  `,
})
export class IdsToggleSwitchLabelComponent {
  constructor() {
    inject(IDS_TOGGLE_SWITCH_CONTEXT);
  }
}
