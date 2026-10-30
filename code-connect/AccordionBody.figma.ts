// url=<FIGMA_IDS_ACCORDION_BODY>
// source=lib/react/ids/accordion/IdsAccordion.tsx
// component=IdsAccordionBody
import figma from 'figma'

const instance = figma.selectedInstance

const content = instance.findInstance('Accordion-Content')
let contentCode
if (content && content.type === 'INSTANCE') {
  contentCode = content.executeTemplate().example
}

export default {
  example: figma.code`
    <IdsAccordionBody>
      ${contentCode}
    </IdsAccordionBody>
  `,
  imports: [
    'import { IdsAccordionBody } from "@ids/react/accordion"',
  ],
  id: 'ids-accordion-body',
  metadata: {
    nestable: true,
  },
}
