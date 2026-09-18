/** Developer usage + Docs tab copy for IDS Spinner (React). */

export const SYNAPSE_SPINNER_DOCS_DESCRIPTION = `
## Overview

Synapse Spinner is an IDS-fork façade over \`lib/react/ids/spinner\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/spinner\`.

Loading indicator for in-progress operations.

Import from \`@synapse/react/spinner\`.

## Props

### \`SynapseSpinnerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`size\` | \`SynapseSpinnerSize \\| string\` | — |
| \`mode\` | \`SynapseSpinnerMode \\| string\` | — |
| \`label\` | \`string\` | — |
| \`labelVisibility\` | \`SynapseSpinnerLabelVisibility \\| string\` | — |
| \`ariaLive\` | \`SynapseSpinnerAriaLive \\| string\` | — |

## Events

No dedicated callback props beyond standard DOM handlers on native elements.

## API

### Import

\`\`\`tsx
import { SynapseSpinner } from "@synapse/react/spinner";
\`\`\`

### Usage

\`\`\`tsx
<SynapseSpinner>
  {/* project children / slots per anatomy */}
</SynapseSpinner>
\`\`\`
`.trim();

export const SYNAPSE_SPINNER_SOURCE_CODE = `import { SynapseSpinner } from "@synapse/react/spinner";

export function Example() {
  return (
    <SynapseSpinner>
      {/* project children / slots */}
    </SynapseSpinner>
  );
}`;
