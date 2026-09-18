/** Developer usage + Docs tab copy for IDS Footer (React). */

export const SYNAPSE_FOOTER_DOCS_DESCRIPTION = `
## Overview

Synapse Footer is an IDS-fork façade over \`lib/react/ids/footer\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/footer\`.

Application footer with hostname and status/meta content.

Import from \`@synapse/react/footer\`.

## Props

### \`SynapseFooterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`hostname\` | \`string\` | — |
| \`swid\` | \`string\` | — |
| \`currentDateTime\` | \`string\` | — |
| \`timeZoneLabel\` | \`string\` | — |
| \`showHostname\` | \`boolean\` | — |
| \`showCurrentDateAndTime\` | \`boolean\` | — |
| \`showTimeZone\` | \`boolean\` | — |
| \`copyDisabled\` | \`boolean\` | — |
| \`timeZoneDisabled\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onCopySwid\` | \`SynapseFooterProps\` | \`(swid: string) => void\` |
| \`onTimeZoneClick\` | \`SynapseFooterProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import { SynapseFooter } from "@synapse/react/footer";
\`\`\`

### Usage

\`\`\`tsx
<SynapseFooter>
  {/* project children / slots per anatomy */}
</SynapseFooter>
\`\`\`
`.trim();

export const SYNAPSE_FOOTER_SOURCE_CODE = `import { SynapseFooter } from "@synapse/react/footer";

export function Example() {
  return (
    <SynapseFooter>
      {/* project children / slots */}
    </SynapseFooter>
  );
}`;
