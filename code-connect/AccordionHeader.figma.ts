// url=<FIGMA_IDS_ACCORDION_HEADER>
// source=lib/react/ids/accordion/IdsAccordion.tsx
// component=IdsAccordionHeader
import figma from 'figma'

const instance = figma.selectedInstance

const titleNode = instance.findText('Panel')
const title = titleNode.type === 'TEXT' ? titleNode.textContent : 'Panel'

// chevronPosition is owned by IdsAccordion root — omitted on header.

export default {
  example: figma.code`
    <IdsAccordionHeader title="${title}" />
  `,
  imports: [
    'import { IdsAccordionHeader } from "@ids/react/accordion"',
  ],
  id: 'ids-accordion-header',
  metadata: {
    nestable: true,
  },
}
