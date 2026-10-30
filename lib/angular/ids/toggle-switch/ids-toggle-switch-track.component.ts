import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-toggle-switch-track",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<span class="ids-toggle-switch__track" aria-hidden="true"></span>`,
})
export class IdsToggleSwitchTrackComponent {}
