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

Scenarios:

- **\`dialog\`** — always 640px wide, height follows the content (Figma ModalDialog-Main). \`size\` does not apply.
- **\`single-page\` / \`multi-page\`** — \`size\` sets width and minimum height: \`x-small\` 640 × 328, \`small\` 960 × 497, \`medium\` 1280 × 667, \`large\` 1600 × 826 (Figma Modal-Main). Footer has a top rule; multi-page pages render as \`IdsTabs\` (primary, transparent surface).

Footer actions (prop-driven): tertiary, secondary and primary, in that order (Figma "Three Button Group").

## Props

### \`IdsModalProps\` (footer actions)

| Prop | Type | Default |
|------|------|---------|
| \`primaryActionLabel\` | \`string\` | — |
| \`secondaryActionLabel\` | \`string\` | — |
| \`tertiaryActionLabel\` | \`string\` | — |
| \`enablePrimaryAction\` / \`enableSecondaryAction\` / \`enableTertiaryAction\` | \`boolean\` | \`true\` |

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
| \`onSecondaryAction\` | \`IdsModalProps\` | \`() => void\` |

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
