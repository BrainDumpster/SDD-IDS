/** Developer usage + Docs tab copy for IDS TimePicker (React). */

export const TIME_PICKER_DOCS_DESCRIPTION = `
## Overview

Time-of-day selection control.

Import from \`@ids/react/time-picker\`.

## Props

### \`IdsTimePickerProps\`

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
| \`onChange\` | \`IdsTimePickerProps\` | \`(value: string \\| null) => void\` |

## API

### Import

\`\`\`tsx
import { IdsTimePicker } from "@ids/react/time-picker";
\`\`\`

### Usage

\`\`\`tsx
<IdsTimePicker>
  {/* project children / slots per anatomy */}
</IdsTimePicker>
\`\`\`
`.trim();

export const TIME_PICKER_SOURCE_CODE = `import { IdsTimePicker } from "@ids/react/time-picker";

export function Example() {
  return (
    <IdsTimePicker>
      {/* project children / slots */}
    </IdsTimePicker>
  );
}`;
