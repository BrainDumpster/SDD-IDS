/** Developer usage + Docs tab copy for IDS Toast (React). */

export const SYNAPSE_TOAST_DOCS_DESCRIPTION = `
## Overview

Synapse Toast is an IDS-fork façade over \`lib/react/ids/toast\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/toast\`.

Transient notification viewport and toast items with auto-dismiss.

\`\`\`
SynapseToastItem
  SynapseToastViewport
\`\`\`

Import from \`@synapse/react/toast\`.

## Props

### \`SynapseToastItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | — |
| \`type\` | \`SynapseToastType \\| string\` | — |
| \`message\` | \`string\` | required |
| \`duration\` | \`number\` | — |
| \`closable\` | \`boolean\` | — |
| \`link\` | \`SynapseToastLink\` | — |
| \`role\` | \`"status" \\| "alert"\` | — |
| \`className\` | \`string\` | — |

### \`SynapseToastViewportProps\`

| Prop | Type | Default |
|------|------|---------|
| \`position\` | \`SynapseToastPosition \\| string\` | — |
| \`maxVisible\` | \`number\` | — |
| \`items\` | \`SynapseToastQueueItem[]\` | — |
| \`defaultItems\` | \`SynapseToastQueueItem[]\` | — |
| \`id\` | \`string\` | required |
| \`reason\` | \`SynapseToastCloseReason\` | required |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onClose\` | \`SynapseToastItemProps\` | \`(detail: { id?: string; reason: SynapseToastCloseReason }) => void\` |
| \`onTimeout\` | \`SynapseToastItemProps\` | \`(detail: { id?: string }) => void\` |
| \`onItemsChange\` | \`SynapseToastViewportProps\` | \`(items: SynapseToastQueueItem[]) => void\` |
| \`onItemClose\` | \`SynapseToastViewportProps\` | \`(detail: {\` |
| \`onItemTimeout\` | \`SynapseToastViewportProps\` | \`(detail: { id: string }) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseToastItem,
  SynapseToastViewport,
} from "@synapse/react/toast";
\`\`\`

### Usage

\`\`\`tsx
<SynapseToastItem>
  {/* project children / slots per anatomy */}
</SynapseToastItem>
\`\`\`
`.trim();

export const SYNAPSE_TOAST_SOURCE_CODE = `import {
  SynapseToastItem,
  SynapseToastViewport,
} from "@synapse/react/toast";

export function Example() {
  return (
    <SynapseToastItem>
      {/* project children / slots */}
    </SynapseToastItem>
  );
}`;
