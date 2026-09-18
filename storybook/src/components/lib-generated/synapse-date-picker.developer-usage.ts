/** Developer usage + Docs tab copy for IDS DatePicker (React). */

export const SYNAPSE_DATE_PICKER_DOCS_DESCRIPTION = `
## Overview

Synapse Date Picker is an IDS-fork façade over \`lib/react/ids/date-picker\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/date-picker\`.

Calendar-based date selection control with value and change callbacks.

Import from \`@synapse/react/date-picker\`.

## Props

### \`SynapseDatePickerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`Date \\| null\` | — |
| \`size\` | \`"large" \\| "small"\` | — |
| \`placeholder\` | \`string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`dateFormat\` | \`string\` | — |
| \`formatHint\` | \`string\` | — |
| \`helperText\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`error\` | \`boolean\` | — |
| \`errorMessage\` | \`string\` | — |
| \`minDate\` | \`Date\` | — |
| \`maxDate\` | \`Date\` | — |
| \`disabledDates\` | \`Date[]\` | — |
| \`rangeMode\` | \`boolean\` | — |
| \`rangeStart\` | \`Date \\| null\` | — |
| \`rangeEnd\` | \`Date \\| null\` | — |
| \`forceOpen\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseDatePickerProps\` | \`(d: Date \\| null) => void\` |
| \`onRangeChange\` | \`SynapseDatePickerProps\` | \`(start: Date \\| null, end: Date \\| null) => void\` |

## API

### Import

\`\`\`tsx
import { SynapseDatePicker } from "@synapse/react/date-picker";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDatePicker>
  {/* project children / slots per anatomy */}
</SynapseDatePicker>
\`\`\`
`.trim();

export const SYNAPSE_DATE_PICKER_SOURCE_CODE = `import { SynapseDatePicker } from "@synapse/react/date-picker";

export function Example() {
  return (
    <SynapseDatePicker>
      {/* project children / slots */}
    </SynapseDatePicker>
  );
}`;
