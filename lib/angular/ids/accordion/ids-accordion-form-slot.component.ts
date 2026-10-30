import { Component } from "@angular/core";

@Component({
  selector: "ids-accordion-form-slot",
  standalone: true,
  template: `<div class="ids-accordion__form-slot"><ng-content /></div>`,
})
export class IdsAccordionFormSlotComponent {}
