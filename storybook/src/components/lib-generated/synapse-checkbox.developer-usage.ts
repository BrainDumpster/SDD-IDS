/** Developer usage + Docs tab copy for IDS Checkbox (React). */

export const SYNAPSE_CHECKBOX_DOCS_DESCRIPTION = `
## Overview

Synapse Checkbox is an IDS-fork façade over \`lib/react/ids/checkbox\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/checkbox\`.

Binary or indeterminate selection control with label, helper, and error projection.

\`\`\`
SynapseCheckbox
  SynapseCheckboxLabel
\`\`\`

Import from \`@synapse/react/checkbox\`.

## Props

### \`SynapseCheckboxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`checked\` | \`boolean\` | — |
| \`defaultChecked\` | \`boolean\` | — |
| \`indeterminate\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`name\` | \`string\` | — |
| \`value\` | \`string\` | — |
| \`dataState\` | \`SynapseCheckboxDataState\` | — |

### \`SynapseCheckboxLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseCheckboxProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseCheckbox,
  SynapseCheckboxLabel,
} from "@synapse/react/checkbox";
\`\`\`

### Usage

\`\`\`tsx
<SynapseCheckbox>
  {/* project children / slots per anatomy */}
</SynapseCheckbox>
\`\`\`
`.trim();

export const SYNAPSE_CHECKBOX_SOURCE_CODE = `import {
  SynapseCheckbox,
  SynapseCheckboxLabel,
} from "@synapse/react/checkbox";

export function Example() {
  return (
    <SynapseCheckbox>
      {/* project children / slots */}
    </SynapseCheckbox>
  );
}`;
