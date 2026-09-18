/** Developer usage + Docs tab copy for IDS Wizard (React). */

export const SYNAPSE_WIZARD_DOCS_DESCRIPTION = `
## Overview

Synapse Wizard is an IDS-fork façade over \`lib/react/ids/wizard\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/wizard\`.

Multi-step guided flow with steps pane, content, and footer actions.

\`\`\`
SynapseWizard
  SynapseWizardHeader
  SynapseWizardHeaderTitle
  SynapseWizardCloseAction
  SynapseWizardBody
  SynapseWizardStepsPane
  SynapseWizardStepItem
  SynapseWizardStepLabel
  SynapseWizardStepStatusIndicator
  SynapseWizardSubstepList
  SynapseWizardSubstepItem
  SynapseWizardContentPane
  SynapseWizardPageTitle
  SynapseWizardPageContent
\`\`\`

Import from \`@synapse/react/wizard\`.

## Props

### \`SynapseWizardStepInput\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`pageTitle\` | \`string\` | — |
| \`content\` | \`ReactNode\` | — |
| \`status\` | \`SynapseWizardStepStatus\` | — |
| \`statusIconSlug\` | \`string \\| null\` | — |
| \`isVisible\` | \`boolean \\| ((ctx: SynapseWizardContext) => boolean)\` | — |
| \`children\` | \`SynapseWizardStepInput[]\` | — |
| \`footerButtons\` | \`SynapseWizardFooterButtons\` | — |

### \`SynapseWizardProps\`

| Prop | Type | Default |
|------|------|---------|
| \`mode\` | \`SynapseWizardMode\` | — |
| \`size\` | \`SynapseWizardSize\` | — |
| \`title\` | \`string\` | required |
| \`steps\` | \`SynapseWizardStepInput[]\` | required |
| \`initialStepId\` | \`string\` | — |
| \`showCloseButton\` | \`boolean\` | — |
| \`isPrimaryEnabled\` | \`boolean \\| ((ctx: SynapseWizardContext) => boolean)\` | — |
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |

### \`SynapseWizardHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseWizardHeaderTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseWizardCloseActionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onCancel\` | \`SynapseWizardProps\` | \`(event: SynapseWizardEventPayload) => void\` |
| \`onPrevious\` | \`SynapseWizardProps\` | \`(event: SynapseWizardEventPayload) => void\` |
| \`onNext\` | \`SynapseWizardProps\` | \`(event: SynapseWizardEventPayload) => void\` |
| \`onFinish\` | \`SynapseWizardProps\` | \`(event: SynapseWizardEventPayload) => void\` |
| \`onStepChange\` | \`SynapseWizardProps\` | \`(event: SynapseWizardEventPayload) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseWizard,
  SynapseWizardHeader,
  SynapseWizardHeaderTitle,
  SynapseWizardCloseAction,
  SynapseWizardBody,
  SynapseWizardStepsPane,
} from "@synapse/react/wizard";
\`\`\`

### Usage

\`\`\`tsx
<SynapseWizard>
  {/* project children / slots per anatomy */}
</SynapseWizard>
\`\`\`
`.trim();

export const SYNAPSE_WIZARD_SOURCE_CODE = `import {
  SynapseWizard,
  SynapseWizardHeader,
  SynapseWizardHeaderTitle,
  SynapseWizardCloseAction,
  SynapseWizardBody,
  SynapseWizardStepsPane,
} from "@synapse/react/wizard";

export function Example() {
  return (
    <SynapseWizard>
      {/* project children / slots */}
    </SynapseWizard>
  );
}`;
