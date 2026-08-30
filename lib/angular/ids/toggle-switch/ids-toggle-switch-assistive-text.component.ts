import { Component, ViewEncapsulation, inject } from "@angular/core";
import { IDS_TOGGLE_SWITCH_CONTEXT } from "./ids-toggle-switch-context";

@Component({
  selector: "ids-toggle-switch-assistive-text",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `
    <span class="ids-toggle-switch__assistive" [attr.id]="toggle.assistiveId || null">
      <ng-content />
    </span>
  `,
})
export class IdsToggleSwitchAssistiveTextComponent {
  readonly toggle = inject(IDS_TOGGLE_SWITCH_CONTEXT);
}
