import { Component, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";

@Component({
  selector: "ids-accordion-header",
  standalone: true,
  templateUrl: "./ids-accordion-header.component.html",
})
export class IdsAccordionHeaderComponent {
  readonly accordion = inject(IDS_ACCORDION_CONTEXT);
  readonly item = inject(IdsAccordionItemComponent);

  iconMask(): string {
    return `url(/assets/icons/${this.accordion.chevronSlug}.svg)`;
  }

  onClick(): void {
    this.item.toggle();
  }

  onKeydown(event: KeyboardEvent): void {
    this.accordion.onTriggerKeydown(event, this.item);
  }

  onFocus(): void {
    this.accordion.onTriggerFocus(this.item);
  }
}
