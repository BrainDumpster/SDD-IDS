/** Developer usage + Docs tab copy for IDS Modal (React). */

export const MODAL_DOCS_DESCRIPTION = `
## Overview

Dialog overlay with header, description, content, tabs, and footer composition.

\`\`\`
IdsModal
  IdsModalClose
  IdsModalHeader
  IdsModalTitle
  IdsModalDescription
  IdsModalTabs
  IdsModalContent
  IdsModalFooter
\`\`\`

Import from \`@ids/react/modal\`.

## Props

### \`IdsModalCloseProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsModalTitleProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsModalHeaderProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`showSeverityIcon\` | \`boolean\` | — |

### \`IdsModalDescriptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsModalTabsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`IdsModalProps\` | \`(open: boolean) => void\` |
| \`onPageChange\` | \`IdsModalProps\` | \`(pageId: string) => void\` |
| \`onClose\` | \`IdsModalProps\` | \`() => void\` |
| \`onPrimaryAction\` | \`IdsModalProps\` | \`() => void\` |
| \`onTertiaryAction\` | \`IdsModalProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsModal,
  IdsModalClose,
  IdsModalHeader,
  IdsModalTitle,
  IdsModalDescription,
  IdsModalTabs,
} from "@ids/react/modal";
\`\`\`

### Usage

\`\`\`tsx
<IdsModal>
  {/* project children / slots per anatomy */}
</IdsModal>
\`\`\`
`.trim();

export const MODAL_SOURCE_CODE = `import {
  IdsModal,
  IdsModalClose,
  IdsModalHeader,
  IdsModalTitle,
  IdsModalDescription,
  IdsModalTabs,
} from "@ids/react/modal";

export function Example() {
  return (
    <IdsModal>
      {/* project children / slots */}
    </IdsModal>
  );
}`;
