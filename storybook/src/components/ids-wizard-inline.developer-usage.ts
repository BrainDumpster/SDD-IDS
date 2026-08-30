/** Developer usage + Docs tab copy for IDS Wizard Inline (React). */

export const WIZARD_INLINE_DOCS_DESCRIPTION = `
## Overview

Inline multi-step wizard embedded in the page content area.

Import the component used by the IDS Storybook example for **Wizard Inline**.

## Props

### \`IdsWizard\`

| Prop | Type | Default |
|------|------|---------|
| \`programme\` | \`"ids" \\| "synapse"\` | — |
| \`mode\` | \`IdsWizardMode\` | — |
| \`size\` | \`IdsWizardSize\` | — |
| \`title\` | \`string\` | required |
| \`steps\` | \`IdsWizardStep[]\` | required |
| \`initialStepId\` | \`string\` | — |
| \`showCloseButton\` | \`boolean\` | — |
| \`isPrimaryEnabled\` | \`boolean \\| ((ctx: IdsWizardContext) => boolean)\` | — |
| \`trigger\` | \`ReactNode\` | — |

## Events

| Callback | Signature |
|----------|-----------|
| \`onCancel\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onPrevious\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onNext\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onFinish\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onStepChange\` | \`(event: IdsWizardEventPayload) => void\` |

## API

### Usage

\`\`\`tsx
<IdsWizard />
\`\`\`
`.trim();

export const WIZARD_INLINE_SOURCE_CODE = `<IdsWizard />`;
