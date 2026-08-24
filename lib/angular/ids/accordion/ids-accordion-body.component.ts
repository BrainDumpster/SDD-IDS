import { Component, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";

@Component({
  selector: "ids-accordion-body",
  standalone: true,
  templateUrl: "./ids-accordion-body.component.html",
})
export class IdsAccordionBodyComponent {
  readonly accordion = inject(IDS_ACCORDION_CONTEXT);
  readonly item = inject(IdsAccordionItemComponent);
}
