import { Component } from "@angular/core";

/** Primary copy slot — maps to Clarity `.alert-text` / spec `AlertMessage`. */
@Component({
  selector: "ids-alert-message",
  standalone: true,
  host: {
    class: "ids-alert-message-slot",
    style: "display: none",
  },
  template: `<ng-content />`,
})
export class IdsAlertMessageComponent {}
