import { Component } from "@angular/core";

/** Optional product logo slot — omit entirely when no product mark is needed (Figma `Show Product Icon=No`). */
@Component({
  selector: "ids-masthead-logo, [mastheadLogo]",
  standalone: true,
  template: `<ng-content />`,
})
export class IdsMastheadLogoComponent {}
