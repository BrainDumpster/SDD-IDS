import { registerElementSafely } from "../internal/registration.js";
import { IdsAccordion } from "./accordion.element.js";
import { IdsAccordionPanel } from "./accordion-panel.element.js";
import { IdsAccordionTitle } from "./accordion-title.element.js";
import { IdsAccordionContent } from "./accordion-content.element.js";
import "../icon/register.js";

registerElementSafely("ids-accordion", IdsAccordion);
registerElementSafely("ids-accordion-panel", IdsAccordionPanel);
registerElementSafely("ids-accordion-title", IdsAccordionTitle);
registerElementSafely("ids-accordion-content", IdsAccordionContent);

export {
  IdsAccordion,
  IdsAccordionPanel,
  IdsAccordionTitle,
  IdsAccordionContent,
};
