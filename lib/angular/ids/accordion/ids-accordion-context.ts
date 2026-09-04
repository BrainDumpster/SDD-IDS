import { InjectionToken } from "@angular/core";
import type { AccordionChevronPosition, AccordionVariant } from "@component-contracts/ids/accordion.contract";
import type { IdsAccordionItemComponent } from "./ids-accordion-item.component";

export interface IdsAccordionContext {
  readonly multiple: boolean;
  readonly chevronPosition: AccordionChevronPosition;
  readonly variant: AccordionVariant;
  readonly chevronSlug: string;
  isOpen(value: string): boolean;
  toggleItem(item: IdsAccordionItemComponent): void;
  onTriggerKeydown(event: KeyboardEvent, item: IdsAccordionItemComponent): void;
  onTriggerFocus(item: IdsAccordionItemComponent): void;
  triggerTabIndex(item: IdsAccordionItemComponent): number;
  panelId(value: string): string;
  triggerId(value: string): string;
  registerItems(items: readonly IdsAccordionItemComponent[]): void;
}

export const IDS_ACCORDION_CONTEXT = new InjectionToken<IdsAccordionContext>(
  "IDS_ACCORDION_CONTEXT",
);
