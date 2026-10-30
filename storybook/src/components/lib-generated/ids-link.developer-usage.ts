/** Developer usage + Docs tab copy for IDS Link (React). */

export const LINK_DOCS_DESCRIPTION = `
## Overview

Text link control styled with IDS semantic tokens. Renders as \`<a>\` when \`href\` is set, otherwise as a button-like control.

Import from \`@ids/react/link\`.

## Props

### \`IdsLinkProps\`

| Prop | Type | Default |
|------|------|---------|
| \`label\` | \`string\` | required |
| \`type\` | \`'standalone' \\| 'inline' \\| 'dark-bg'\` | \`standalone\` |
| \`href\` | \`string\` | — |
| \`showExternalLinkIcon\` | \`boolean\` | \`false\` |
| \`target\` | \`'_self' \\| '_blank' \\| '_parent' \\| '_top'\` | — |
| \`rel\` | \`string\` | — |
| \`disabled\` | \`boolean\` | \`false\` |
| \`dataState\` | \`'default' \\| 'hover' \\| 'press' \\| 'focus-visible'\` | — (demo only) |
| \`className\` | \`string\` | — |

## Events

| Callback | Signature |
|----------|-----------|
| \`onClick\` | \`(event: MouseEvent<HTMLAnchorElement \\| HTMLButtonElement>) => void\` |

## API

### Import

\`\`\`tsx
import { IdsLink } from "@ids/react/link";
\`\`\`

### Usage

\`\`\`tsx
<IdsLink label="Learn more" type="standalone" href="#" />
<IdsLink label="Open docs" href="https://example.com" target="_blank" showExternalLinkIcon />
\`\`\`
`.trim();

export const LINK_SOURCE_CODE = `import { IdsLink } from "@ids/react/link";

export function Example() {
  return <IdsLink label="This is a link" type="standalone" href="#" />;
}`;
