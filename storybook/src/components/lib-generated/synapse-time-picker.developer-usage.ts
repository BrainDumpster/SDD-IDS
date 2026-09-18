/** Developer usage + Docs tab copy for IDS TimePicker (React). */

export const SYNAPSE_TIME_PICKER_DOCS_DESCRIPTION = `
## Overview

Synapse Time Picker is an IDS-fork façade over \`lib/react/ids/time-picker\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/time-picker\`.

Time-of-day selection control.

Import from \`@synapse/react/time-picker\`.

## Props

### \`SynapseTimePickerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string \\| null\` | — |
| \`size\` | \`"large" \\| "small"\` | — |
| \`placeholder\` | \`string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`formatHint\` | \`string\` | — |
| \`clockType\` | \`"12h" \\| "24h"\` | — |
| \`showSeconds\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`error\` | \`boolean\` | — |
| \`errorMessage\` | \`string\` | — |
| \`forceOpen\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseTimePickerProps\` | \`(value: string \\| null) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseTimePicker } from "@synapse/react/time-picker";
\`\`\`

### Usage

\`\`\`tsx
<SynapseTimePicker>
  {/* project children / slots per anatomy */}
</SynapseTimePicker>
\`\`\`
`.trim();

export const SYNAPSE_TIME_PICKER_SOURCE_CODE = `import { SynapseTimePicker } from "@synapse/react/time-picker";

export function Example() {
  return (
    <SynapseTimePicker>
      {/* project children / slots */}
    </SynapseTimePicker>
  );
}`;
