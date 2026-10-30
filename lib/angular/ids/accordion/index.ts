import { IdsAccordionComponent } from "./ids-accordion.component";
import { IdsAccordionItemComponent } from "./ids-accordion-item.component";
import { IdsAccordionHeaderComponent } from "./ids-accordion-header.component";
import { IdsAccordionBodyComponent } from "./ids-accordion-body.component";
import { IdsAccordionContentComponent } from "./ids-accordion-content.component";
import { IdsAccordionMetaComponent } from "./ids-accordion-meta.component";
import { IdsAccordionFormSlotComponent } from "./ids-accordion-form-slot.component";
import { IdsIconComponent } from "../icon/ids-icon.component";

export const IDS_ACCORDION_IMPORTS = [
  IdsAccordionComponent,
  IdsAccordionItemComponent,
  IdsAccordionHeaderComponent,
  IdsAccordionBodyComponent,
  IdsAccordionContentComponent,
  IdsAccordionMetaComponent,
  IdsAccordionFormSlotComponent,
  IdsIconComponent,
] as const;

export {
  IdsAccordionComponent,
  IdsAccordionItemComponent,
  IdsAccordionHeaderComponent,
  IdsAccordionBodyComponent,
  IdsAccordionContentComponent,
  IdsAccordionMetaComponent,
  IdsAccordionFormSlotComponent,
};
