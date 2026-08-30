import { Component, HostBinding, Input, inject } from "@angular/core";
import { IDS_ACCORDION_CONTEXT } from "./ids-accordion-context";

@Component({
  selector: "ids-accordion-item",
  standalone: true,
  template: `
    <ng-content select="ids-accordion-header" />
    <ng-content select="ids-accordion-body" />
  `,
})
export class IdsAccordionItemComponent {
  private readonly accordion = inject(IDS_ACCORDION_CONTEXT);

  @Input({ required: true }) value!: string;
  @Input() disabled = false;

  /** Set by AccordionRoot from ContentChildren order. */
  itemIndex = 0;

  @HostBinding("style.display")
  readonly display = "block";

  @HostBinding("class.ids-accordion__item")
  readonly itemClass = true;

  @HostBinding("class.ids-accordion__item--open")
  get openClass(): boolean {
    return this.accordion.isOpen(this.value);
  }

  @HostBinding("class.ids-accordion__item--first")
  get firstClass(): boolean {
    return this.itemIndex === 0;
  }

  @HostBinding("attr.data-open")
  get dataOpen(): string | null {
    return this.accordion.isOpen(this.value) ? "true" : null;
  }

  setItemIndex(index: number): void {
    this.itemIndex = index;
  }

  isOpen(): boolean {
    return this.accordion.isOpen(this.value);
  }

  toggle(): void {
    this.accordion.toggleItem(this);
  }
}
