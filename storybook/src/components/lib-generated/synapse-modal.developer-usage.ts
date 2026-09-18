/** Developer usage + Docs tab copy for IDS Modal (React). */

export const SYNAPSE_MODAL_DOCS_DESCRIPTION = `
## Overview

Synapse Modal is an IDS-fork façade over \`lib/react/ids/modal\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/modal\`.

Dialog overlay with header, description, content, tabs, and footer composition.

\`\`\`
SynapseModal
  SynapseModalClose
  SynapseModalHeader
  SynapseModalTitle
  SynapseModalDescription
  SynapseModalTabs
  SynapseModalContent
  SynapseModalFooter
\`\`\`

Import from \`@synapse/react/modal\`.

## Props

### \`SynapseModalCloseProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseModalTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseModalHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`showSeverityIcon\` | \`boolean\` | — |

### \`SynapseModalDescriptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseModalTabsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`SynapseModalProps\` | \`(open: boolean) => void\` |
| \`onPageChange\` | \`SynapseModalProps\` | \`(pageId: string) => void\` |
| \`onClose\` | \`SynapseModalProps\` | \`() => void\` |
| \`onPrimaryAction\` | \`SynapseModalProps\` | \`() => void\` |
| \`onTertiaryAction\` | \`SynapseModalProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseModal,
  SynapseModalClose,
  SynapseModalHeader,
  SynapseModalTitle,
  SynapseModalDescription,
  SynapseModalTabs,
} from "@synapse/react/modal";
\`\`\`

### Usage

\`\`\`tsx
<SynapseModal>
  {/* project children / slots per anatomy */}
</SynapseModal>
\`\`\`
`.trim();

export const SYNAPSE_MODAL_SOURCE_CODE = `import {
  SynapseModal,
  SynapseModalClose,
  SynapseModalHeader,
  SynapseModalTitle,
  SynapseModalDescription,
  SynapseModalTabs,
} from "@synapse/react/modal";

export function Example() {
  return (
    <SynapseModal>
      {/* project children / slots */}
    </SynapseModal>
  );
}`;
