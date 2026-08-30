// url=<FIGMA_IDS_ACCORDION_ITEM>
// source=lib/react/ids/accordion/IdsAccordion.tsx
// component=IdsAccordionItem
import figma from 'figma'

const instance = figma.selectedInstance

// isOpen is controlled on IdsAccordion via value/defaultValue — no item prop.
// chevronPosition is set on IdsAccordion root — omitted here.
// state=Default only — no matching IdsAccordionItem prop.

const header = instance.findInstance('Accordion-Header')
let headerCode
if (header && header.type === 'INSTANCE') {
  headerCode = header.executeTemplate().example
}

const body = instance.findInstance('Accordion-Body')
let bodyCode
if (body && body.type === 'INSTANCE') {
  bodyCode = body.executeTemplate().example
}

export default {
  example: figma.code`
    <IdsAccordionItem value="item">
      ${headerCode}
      ${bodyCode}
    </IdsAccordionItem>
  `,
  imports: [
    'import { IdsAccordionItem } from "@ids/react/accordion"',
  ],
  id: 'ids-accordion-item',
  metadata: {
    nestable: true,
  },
}
