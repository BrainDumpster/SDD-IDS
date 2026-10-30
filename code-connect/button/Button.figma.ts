// url=<FIGMA_IDS_BUTTON>
// source=lib/react/ids/button/IdsButton.tsx
// component=IdsButton
import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('Style', {
  Primary: 'primary',
  Secondary: 'secondary',
  Tertiary: 'tertiary',
  Destructive: 'destructive',
})

const size = instance.getEnum('Size', {
  Large: 'large',
  Medium: 'medium',
  Small: 'small',
})

const dataState = instance.getEnum('State', {
  Default: undefined,
  Hover: 'hover',
  Press: 'press',
  Focus: 'focus-visible',
  Disabled: 'disabled',
})

const disabled = dataState === 'disabled'
const hasIcon = instance.getEnum('Icon', {
  Yes: true,
  No: false,
})
const iconOnly = instance.getEnum('Icon Only', {
  Yes: true,
  No: false,
})

const labelNode = instance.findText('Button')
const label = labelNode.type === 'TEXT' ? labelNode.textContent : 'Button'

const showIcon = Boolean(hasIcon || iconOnly)
const icon = showIcon ? instance.getInstanceSwap('Select Icon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const leadingIcon = iconCode
  ? figma.code`
      <IdsButtonLeadingIcon>
        ${iconCode}
      </IdsButtonLeadingIcon>
    `
  : undefined

const labelSlot = !iconOnly
  ? figma.code`
      <IdsButtonLabel>${label}</IdsButtonLabel>
    `
  : undefined

export default {
  example: figma.code`
    <IdsButton
      variant="${variant}"
      size="${size}"
      ${iconOnly ? 'iconOnly' : ''}
      ${iconOnly ? `ariaLabel="${label}"` : ''}
      ${disabled ? 'disabled' : ''}
      ${dataState && dataState !== 'disabled' ? `dataState="${dataState}"` : ''}
    >
      ${leadingIcon}
      ${labelSlot}
    </IdsButton>
  `,
  imports: [
    'import { IdsButton, IdsButtonLeadingIcon, IdsButtonLabel } from "@ids/react/button"',
  ],
  id: 'ids-button',
  metadata: {
    nestable: true,
  },
}
