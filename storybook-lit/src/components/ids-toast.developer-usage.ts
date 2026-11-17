/** Developer usage + Docs tab copy for IDS Lit Toast. */

export const TOAST_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-toast-item\` + \`ids-toast-viewport\` — transient notifications from
\`components/ids/toast/design-spec.md\`. API aligned with \`@ids/react/toast\`
(\`onClose\`, \`onTimeout\`, viewport \`onItemsChange\` / \`onItemClose\` / \`onItemTimeout\`).

\`\`\`
ids-toast-viewport
  ids-toast-item (×N, FIFO via items[])
\`\`\`

## Props — \`ids-toast-item\`

| Prop / attr | Type | Default |
|-------------|------|---------|
| \`id\` | host HTML id | — (included in close/timeout detail) |
| \`type\` | \`info \\| critical \\| major-warning \\| minor-warning \\| success\` | \`info\` |
| \`message\` | \`string\` | required |
| \`duration\` | \`number\` | \`8000\` (\`0\` disables) |
| \`closable\` | \`boolean\` | \`true\` |
| \`link\` | \`IdsToastLink\` (property) | — |
| \`itemrole\` | \`status \\| alert\` | \`status\` |
| \`onClose\` | \`(detail) => void\` (property) | — |
| \`onTimeout\` | \`(detail) => void\` (property) | — |

## Props — \`ids-toast-viewport\`

| Prop / attr | Type | Default |
|-------------|------|---------|
| \`position\` | six corner/edge positions | \`top-right\` |
| \`maxvisible\` | \`number\` | \`3\` |
| \`items\` | \`IdsToastQueueItem[]\` (property) | controlled list |
| \`defaultItems\` | \`IdsToastQueueItem[]\` (property) | uncontrolled seed |
| \`onItemsChange\` | \`(items) => void\` (property) | — |
| \`onItemClose\` | \`(detail) => void\` (property) | — |
| \`onItemTimeout\` | \`(detail) => void\` (property) | — |

## Events (React API names)

| Event / callback | Detail |
|------------------|--------|
| \`onClose\` | \`{ id?, reason: close-click \\| timeout \\| programmatic }\` |
| \`onTimeout\` | \`{ id? }\` |
| \`onItemsChange\` | \`{ items }\` (DOM) / \`items\` (callback) |
| \`onItemClose\` | \`{ id, reason }\` |
| \`onItemTimeout\` | \`{ id }\` |

## Usage

\`\`\`html
<ids-toast-item
  type="info"
  message="Saved."
  .duration=\${0}
  .onClose=\${({ id, reason }) => console.log(id, reason)}
  .onTimeout=\${({ id }) => console.log("timeout", id)}
></ids-toast-item>
\`\`\`

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const TOAST_SOURCE_CODE = `<ids-toast-item
  type="info"
  message="This is a temporary and brief notification following a user action."
  .duration=\${0}
  .onClose=\${({ id, reason }) => { /* … */ }}
  .onTimeout=\${({ id }) => { /* … */ }}
  closable
></ids-toast-item>`;
