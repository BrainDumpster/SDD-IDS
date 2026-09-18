/** Developer usage + Docs tab copy for IDS Link (React). */

export const SYNAPSE_LINK_DOCS_DESCRIPTION = `
## Overview

Synapse Link is an IDS-fork façade over \`lib/react/ids/link\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/link\`.

Text link control styled with IDS semantic tokens. Renders as \`<a>\` when \`href\` is set, otherwise as a button-like control.

Import from \`@synapse/react/link\`.

## Props

### \`SynapseLinkProps\`

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
import { SynapseLink } from "@synapse/react/link";
\`\`\`

### Usage

\`\`\`tsx
<SynapseLink label="Learn more" type="standalone" href="#" />
<SynapseLink label="Open docs" href="https://example.com" target="_blank" showExternalLinkIcon />
\`\`\`
`.trim();

export const SYNAPSE_LINK_SOURCE_CODE = `import { SynapseLink } from "@synapse/react/link";

export function Example() {
  return <SynapseLink label="This is a link" type="standalone" href="#" />;
}`;
