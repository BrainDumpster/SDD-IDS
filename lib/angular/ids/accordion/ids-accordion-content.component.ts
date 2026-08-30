import { Component } from "@angular/core";

@Component({
  selector: "ids-accordion-content",
  standalone: true,
  template: `
    <div class="ids-accordion__content">
      <div class="ids-accordion__content-card">
        <ng-content />
      </div>
    </div>
  `,
})
export class IdsAccordionContentComponent {}
