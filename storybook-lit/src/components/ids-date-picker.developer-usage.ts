/**
 * Developer usage for IDS Lit Date Picker (design-spec + React API parity).
 */
export const DATE_PICKER_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-date-picker\` — calendar date field from
\`components/ids/date-picker/design-spec.md\`. API aligned with
\`@ids/react/date-picker\`.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`value\` | — (property) | \`Date \\| null\` | uncontrolled |
| \`size\` | \`size\` | \`large \\| small\` | \`large\` |
| \`placeholder\` | \`placeholder\` | \`string\` | dateFormat |
| \`label\` | \`label\` | \`string\` | — |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`inputId\` | \`input-id\` | \`string\` | generated |
| \`dateFormat\` | \`dateformat\` | \`string\` | \`MM-DD-YYYY\` |
| \`formatHint\` | \`formathint\` | \`string\` | \`MM-DD-YYYY\` |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`error\` | \`boolean\` | \`false\` |
| \`errorMessage\` | \`errormessage\` | \`string\` | — |
| \`minDate\` / \`maxDate\` | — | \`Date\` | — |
| \`disabledDates\` | — | \`Date[]\` | \`[]\` |
| \`rangeMode\` | \`rangemode\` | \`boolean\` | \`false\` |
| \`rangeStart\` / \`rangeEnd\` | — | \`Date \\| null\` | — |
| \`rangeField\` | \`rangefield\` | \`start \\| end\` | — |
| \`forceOpen\` | \`forceopen\` | \`boolean\` | \`false\` |
| \`popupPortal\` | \`popupportal\` | \`boolean\` | \`true\` |

## Events

| Event | Detail |
|-------|--------|
| \`change\` | \`{ date: Date \\| null }\` |
| \`range-change\` | \`{ start: Date \\| null, end: Date \\| null }\` |
| \`open-change\` | \`{ open: boolean }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const DATE_PICKER_SOURCE_CODE = `<ids-date-picker
  label="Start date"
  size="large"
  .value=\${new Date(2026, 0, 18)}
  @change=\${(e) => console.log(e.detail.date)}
></ids-date-picker>`;
