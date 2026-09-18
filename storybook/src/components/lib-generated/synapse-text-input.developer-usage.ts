/** Developer usage + Docs tab copy for IDS TextInput (React). */

export const SYNAPSE_TEXT_INPUT_DOCS_DESCRIPTION = `
## Overview

Synapse Text Input is an IDS-fork façade over \`lib/react/ids/text-box\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/text-input\`.

Text input with label, helper, and error composition support.

Import from \`@synapse/react/text-input\`.

## Props

### \`SynapseTextInputProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`componentType\` | \`SynapseTextInputComponentType\` | — |
| \`size\` | \`SynapseTextInputSize\` | — |
| \`state\` | \`SynapseTextInputState\` | — |
| \`label\` | \`string\` | — |
| \`showLabel\` | \`boolean\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`invalid\` | \`boolean\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`iconName\` | \`string\` | — |
| \`id\` | \`string\` | — |
| \`name\` | \`string\` | — |
| \`rows\` | \`number\` | — |
| \`inputType\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onValueChange\` | \`SynapseTextInputProps\` | \`(value: string) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseTextInput } from "@synapse/react/text-input";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTextInput>
  {/* project children / slots per anatomy */}
</SynapseTextInput>
\`\`\`
`.trim();

export const SYNAPSE_TEXT_INPUT_SOURCE_CODE = `import { SynapseTextInput } from "@synapse/react/text-input";

export function Example() {
  return (
    <SynapseTextInput>
      {/* project children / slots */}
    </SynapseTextInput>
  );
}`;
