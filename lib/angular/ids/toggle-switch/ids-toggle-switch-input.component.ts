import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOGGLE_SWITCH_CONTEXT } from "./ids-toggle-switch-context";

@Component({
  selector: "ids-toggle-switch-input",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <input
      type="checkbox"
      class="ids-toggle-switch__input"
      [id]="toggle.resolvedId"
      [attr.name]="toggle.resolvedName || null"
      [attr.value]="toggle.resolvedValue || null"
      [checked]="toggle.resolvedChecked"
      [disabled]="toggle.resolvedDisabled"
      [attr.aria-label]="toggle.ariaLabel || null"
      [attr.aria-describedby]="toggle.describedBy || null"
      (change)="toggle.onInputChange($event)"
    />
  `,
})
export class IdsToggleSwitchInputComponent {
  readonly toggle = inject(IDS_TOGGLE_SWITCH_CONTEXT);
}
