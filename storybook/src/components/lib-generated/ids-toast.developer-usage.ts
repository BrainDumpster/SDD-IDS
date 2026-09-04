/** Developer usage + Docs tab copy for IDS Toast (React). */

export const TOAST_DOCS_DESCRIPTION = `
## Overview

Transient notification viewport and toast items with auto-dismiss.

\`\`\`
IdsToastItem
  IdsToastViewport
\`\`\`

Import from \`@ids/react/toast\`.

## Props

### \`IdsToastItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | — |
| \`type\` | \`IdsToastType \\| string\` | — |
| \`message\` | \`string\` | required |
| \`duration\` | \`number\` | — |
| \`closable\` | \`boolean\` | — |
| \`link\` | \`IdsToastLink\` | — |
| \`role\` | \`"status" \\| "alert"\` | — |
| \`className\` | \`string\` | — |

### \`IdsToastViewportProps\`

| Prop | Type | Default |
|------|------|---------|
| \`position\` | \`IdsToastPosition \\| string\` | — |
| \`maxVisible\` | \`number\` | — |
| \`items\` | \`IdsToastQueueItem[]\` | — |
| \`defaultItems\` | \`IdsToastQueueItem[]\` | — |
| \`id\` | \`string\` | required |
| \`reason\` | \`IdsToastCloseReason\` | required |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onClose\` | \`IdsToastItemProps\` | \`(detail: { id?: string; reason: IdsToastCloseReason }) => void\` |
| \`onTimeout\` | \`IdsToastItemProps\` | \`(detail: { id?: string }) => void\` |
| \`onItemsChange\` | \`IdsToastViewportProps\` | \`(items: IdsToastQueueItem[]) => void\` |
| \`onItemClose\` | \`IdsToastViewportProps\` | \`(detail: {\` |
| \`onItemTimeout\` | \`IdsToastViewportProps\` | \`(detail: { id: string }) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsToastItem,
  IdsToastViewport,
} from "@ids/react/toast";
\`\`\`

### Usage

\`\`\`tsx
<IdsToastItem>
  {/* project children / slots per anatomy */}
</IdsToastItem>
\`\`\`
`.trim();

export const TOAST_SOURCE_CODE = `import {
  IdsToastItem,
  IdsToastViewport,
} from "@ids/react/toast";

export function Example() {
  return (
    <IdsToastItem>
      {/* project children / slots */}
    </IdsToastItem>
  );
}`;
