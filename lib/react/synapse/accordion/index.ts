/**
 * Synapse façade — strategy: reexport.
 * IDS implementation: `lib/react/ids/accordion`.
 * Load `components/synapse-theme.css` only (not `ids-theme.css`).
 */
export {
  IdsAccordion as SynapseAccordion,
  IdsAccordionCompound as SynapseAccordionCompound,
  IdsAccordionItem as SynapseAccordionItem,
  IdsAccordionHeader as SynapseAccordionHeader,
  IdsAccordionChevron as SynapseAccordionChevron,
  IdsAccordionBody as SynapseAccordionBody,
  IdsAccordionPanel as SynapseAccordionPanel,
  IdsAccordionContent as SynapseAccordionContent,
  type IdsAccordionItemInput as SynapseAccordionItemInput,
  type IdsAccordionProps as SynapseAccordionProps,
  type IdsAccordionItemProps as SynapseAccordionItemProps,
  type IdsAccordionHeaderProps as SynapseAccordionHeaderProps,
  type IdsAccordionChevronProps as SynapseAccordionChevronProps,
  type IdsAccordionBodyProps as SynapseAccordionBodyProps,
  type IdsAccordionContentProps as SynapseAccordionContentProps,
} from "../../ids/accordion";
