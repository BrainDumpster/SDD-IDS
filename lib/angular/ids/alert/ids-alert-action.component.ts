import { Component, Input } from "@angular/core";

/**
 * Action label carrier for composition markup.
 * `IdsAlertComponent` renders the outlined button in the correct region (title row vs trailing).
 */
@Component({
  selector: "ids-alert-action",
  standalone: true,
  template: "",
})
export class IdsAlertActionComponent {
  @Input() label = "";
}
