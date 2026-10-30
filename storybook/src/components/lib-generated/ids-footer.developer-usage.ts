/** Developer usage + Docs tab copy for IDS Footer (React). */

export const FOOTER_DOCS_DESCRIPTION = `
## Overview

Application footer with hostname and status/meta content.

Import from \`@ids/react/footer\`.

## Props

### \`IdsFooterProps\`

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
| \`onCopySwid\` | \`IdsFooterProps\` | \`(swid: string) => void\` |
| \`onTimeZoneClick\` | \`IdsFooterProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import { IdsFooter } from "@ids/react/footer";
\`\`\`

### Usage

\`\`\`tsx
<IdsFooter>
  {/* project children / slots per anatomy */}
</IdsFooter>
\`\`\`
`.trim();

export const FOOTER_SOURCE_CODE = `import { IdsFooter } from "@ids/react/footer";

export function Example() {
  return (
    <IdsFooter>
      {/* project children / slots */}
    </IdsFooter>
  );
}`;
