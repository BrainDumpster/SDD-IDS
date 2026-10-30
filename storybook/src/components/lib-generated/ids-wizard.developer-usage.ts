/** Developer usage + Docs tab copy for IDS Wizard (React). */

export const WIZARD_DOCS_DESCRIPTION = `
## Overview

Multi-step guided flow with steps pane, content, and footer actions.

\`\`\`
IdsWizard
  IdsWizardHeader
  IdsWizardHeaderTitle
  IdsWizardCloseAction
  IdsWizardBody
  IdsWizardStepsPane
  IdsWizardStepItem
  IdsWizardStepLabel
  IdsWizardStepStatusIndicator
  IdsWizardSubstepList
  IdsWizardSubstepItem
  IdsWizardContentPane
  IdsWizardPageTitle
  IdsWizardPageContent
\`\`\`

Import from \`@ids/react/wizard\`.

## Props

### \`IdsWizardStepInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`pageTitle\` | \`string\` | — |
| \`content\` | \`ReactNode\` | — |
| \`status\` | \`IdsWizardStepStatus\` | — |
| \`statusIconSlug\` | \`string \\| null\` | — |
| \`isVisible\` | \`boolean \\| ((ctx: IdsWizardContext) => boolean)\` | — |
| \`children\` | \`IdsWizardStepInput[]\` | — |
| \`footerButtons\` | \`IdsWizardFooterButtons\` | — |

### \`IdsWizardProps\`

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`IdsWizardMode\` | — |
| \`size\` | \`IdsWizardSize\` | — |
| \`title\` | \`string\` | required |
| \`steps\` | \`IdsWizardStepInput[]\` | required |
| \`initialStepId\` | \`string\` | — |
| \`showCloseButton\` | \`boolean\` | — |
| \`isPrimaryEnabled\` | \`boolean \\| ((ctx: IdsWizardContext) => boolean)\` | — |
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |

### \`IdsWizardHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsWizardHeaderTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsWizardCloseActionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onCancel\` | \`IdsWizardProps\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onPrevious\` | \`IdsWizardProps\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onNext\` | \`IdsWizardProps\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onFinish\` | \`IdsWizardProps\` | \`(event: IdsWizardEventPayload) => void\` |
| \`onStepChange\` | \`IdsWizardProps\` | \`(event: IdsWizardEventPayload) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsWizard,
  IdsWizardHeader,
  IdsWizardHeaderTitle,
  IdsWizardCloseAction,
  IdsWizardBody,
  IdsWizardStepsPane,
} from "@ids/react/wizard";
\`\`\`

### Usage

\`\`\`tsx
<IdsWizard>
  {/* project children / slots per anatomy */}
</IdsWizard>
\`\`\`
`.trim();

export const WIZARD_SOURCE_CODE = `import {
  IdsWizard,
  IdsWizardHeader,
  IdsWizardHeaderTitle,
  IdsWizardCloseAction,
  IdsWizardBody,
  IdsWizardStepsPane,
} from "@ids/react/wizard";

export function Example() {
  return (
    <IdsWizard>
      {/* project children / slots */}
    </IdsWizard>
  );
}`;
