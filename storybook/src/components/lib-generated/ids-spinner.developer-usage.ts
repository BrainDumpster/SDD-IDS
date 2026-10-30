/** Developer usage + Docs tab copy for IDS Spinner (React). */

export const SPINNER_DOCS_DESCRIPTION = `
## Overview

Loading indicator for in-progress operations.

Import from \`@ids/react/spinner\`.

## Props

### \`IdsSpinnerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`size\` | \`IdsSpinnerSize \\| string\` | — |
| \`mode\` | \`IdsSpinnerMode \\| string\` | — |
| \`label\` | \`string\` | — |
| \`labelVisibility\` | \`IdsSpinnerLabelVisibility \\| string\` | — |
| \`ariaLive\` | \`IdsSpinnerAriaLive \\| string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { IdsSpinner } from "@ids/react/spinner";
\`\`\`

### Usage

\`\`\`tsx
<IdsSpinner>
  {/* project children / slots per anatomy */}
</IdsSpinner>
\`\`\`
`.trim();

export const SPINNER_SOURCE_CODE = `import { IdsSpinner } from "@ids/react/spinner";

export function Example() {
  return (
    <IdsSpinner>
      {/* project children / slots */}
    </IdsSpinner>
  );
}`;
