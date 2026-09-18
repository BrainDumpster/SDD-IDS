/** Developer usage + Docs tab copy for IDS RadioButton (React). */

export const SYNAPSE_RADIO_BUTTON_DOCS_DESCRIPTION = `
## Overview

Synapse Radio Button is an IDS-fork façade over \`lib/react/ids/radio-button\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/radio-button\`.

Single-choice selection within a radio group, with label projection.

\`\`\`
SynapseRadioButton
  SynapseRadioGroup
  SynapseRadioLabel
\`\`\`

Import from \`@synapse/react/radio-button\`.

## Props

### \`SynapseRadioGroupProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`name\` | \`string\` | required |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`orientation\` | \`SynapseRadioOrientation\` | — |

### \`SynapseRadioLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`SynapseRadioButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`value\` | \`string\` | required |
| \`name\` | \`string\` | — |
| \`checked\` | \`boolean\` | — |
| \`defaultChecked\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`dataState\` | \`SynapseRadioDataState\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseRadioGroupProps\` | \`(value: string) => void\` |
| \`onChange\` | \`SynapseRadioButtonProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseRadioButton,
  SynapseRadioGroup,
  SynapseRadioLabel,
} from "@synapse/react/radio-button";
\`\`\`

### Usage

\`\`\`tsx
<SynapseRadioButton>
  {/* project children / slots per anatomy */}
</SynapseRadioButton>
\`\`\`
`.trim();

export const SYNAPSE_RADIO_BUTTON_SOURCE_CODE = `import {
  SynapseRadioButton,
  SynapseRadioGroup,
  SynapseRadioLabel,
} from "@synapse/react/radio-button";

export function Example() {
  return (
    <SynapseRadioButton>
      {/* project children / slots */}
    </SynapseRadioButton>
  );
}`;
