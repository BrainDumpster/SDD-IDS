import { Component, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "ids-toggle-switch-thumb",
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [":host { display: contents; }"],
  template: `<span class="ids-toggle-switch__thumb" aria-hidden="true"></span>`,
})
export class IdsToggleSwitchThumbComponent {}
