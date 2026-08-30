// url=<FIGMA_IDS_ACCORDION>
// source=lib/react/ids/accordion/IdsAccordion.tsx
// component=IdsAccordion
import figma from 'figma'

const instance = figma.selectedInstance

// Figma variant `chevronPosition` → IdsAccordion.chevronPosition
const chevronPosition = instance.getEnum('chevronPosition', {
  left: 'left',
  right: 'right',
})

// Figma variant `multipl` (typo in library) → IdsAccordion.multiple
const multiple = instance.getEnum('multipl', {
  true: true,
  false: false,
})

const nestedItems = instance.findConnectedInstances(
  (node) => node.codeConnectId() === 'ids-accordion-item' || node.name === 'Accordion-Item',
)

const item0 =
  nestedItems[0] && nestedItems[0].type === 'INSTANCE'
    ? nestedItems[0].executeTemplate().example
    : undefined
const item1 =
  nestedItems[1] && nestedItems[1].type === 'INSTANCE'
    ? nestedItems[1].executeTemplate().example
    : undefined
const item2 =
  nestedItems[2] && nestedItems[2].type === 'INSTANCE'
    ? nestedItems[2].executeTemplate().example
    : undefined

// Fallback when connected instances aren't available yet (pre-publish)
const fallbackItem = instance.findInstance('Accordion-Item')
let fallbackItemCode
if (!item0 && fallbackItem && fallbackItem.type === 'INSTANCE') {
  fallbackItemCode = fallbackItem.executeTemplate().example
}

export default {
  example: figma.code`
    <IdsAccordion
      chevronPosition="${chevronPosition}"
      ${multiple ? 'multiple' : ''}
    >
      ${item0}${item1}${item2}${fallbackItemCode}
    </IdsAccordion>
  `,
  imports: [
    'import { IdsAccordion } from "@ids/react/accordion"',
  ],
  id: 'ids-accordion',
  metadata: {
    nestable: true,
  },
}
