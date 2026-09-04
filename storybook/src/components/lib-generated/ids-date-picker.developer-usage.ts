/** Developer usage + Docs tab copy for IDS DatePicker (React). */

export const DATE_PICKER_DOCS_DESCRIPTION = `
## Overview

Calendar-based date selection control with value and change callbacks.

Import from \`@ids/react/date-picker\`.

## Props

### \`IdsDatePickerProps\`

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
| \`onChange\` | \`IdsDatePickerProps\` | \`(d: Date \\| null) => void\` |
| \`onRangeChange\` | \`IdsDatePickerProps\` | \`(start: Date \\| null, end: Date \\| null) => void\` |

## API

### Import

\`\`\`tsx
import { IdsDatePicker } from "@ids/react/date-picker";
\`\`\`

### Usage

\`\`\`tsx
<IdsDatePicker>
  {/* project children / slots per anatomy */}
</IdsDatePicker>
\`\`\`
`.trim();

export const DATE_PICKER_SOURCE_CODE = `import { IdsDatePicker } from "@ids/react/date-picker";

export function Example() {
  return (
    <IdsDatePicker>
      {/* project children / slots */}
    </IdsDatePicker>
  );
}`;
