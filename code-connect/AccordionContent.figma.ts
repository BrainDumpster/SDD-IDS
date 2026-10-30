// url=<FIGMA_IDS_ACCORDION_CONTENT>
// source=lib/react/ids/accordion/IdsAccordion.tsx
// component=IdsAccordionContent
import figma from 'figma'

const instance = figma.selectedInstance

const swapContent = instance.findInstance('.SwapContent')
let childrenCode
if (swapContent && swapContent.type === 'INSTANCE') {
  childrenCode = swapContent.executeTemplate().example
}

export default {
  example: figma.code`
    <IdsAccordionContent>
      ${childrenCode}
    </IdsAccordionContent>
  `,
  imports: [
    'import { IdsAccordionContent } from "@ids/react/accordion"',
  ],
  id: 'ids-accordion-content',
  metadata: {
    nestable: true,
  },
}
