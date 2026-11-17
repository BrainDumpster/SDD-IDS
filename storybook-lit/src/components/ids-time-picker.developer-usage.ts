/**
 * Developer usage for IDS Lit Time Picker (design-spec + React API parity).
 */
export const TIME_PICKER_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-time-picker\` — time-of-day field from
\`components/ids/time-picker/design-spec.md\`. API aligned with
\`@ids/react/time-picker\`.

Live Figma verified 2026-11-10: TimePicker-Main \`42159:132203\`,
TimePicker-Element-Dropdown \`42159:132108\`.

## Props

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`value\` | — (property) | \`string \\| null\` | uncontrolled |
| \`size\` | \`size\` | \`large \\| small\` | \`large\` |
| \`placeholder\` | \`placeholder\` | \`string\` | \`HH:MM AM/PM\` |
| \`label\` | \`label\` | \`string\` | — |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`inputId\` | \`input-id\` | \`string\` | generated |
| \`formatHint\` | \`formathint\` | \`string\` | \`HH:MM AM/PM\` |
| \`clockType\` | \`clocktype\` | \`12h \\| 24h\` | \`12h\` |
| \`showSeconds\` | \`showseconds\` | \`boolean\` | \`false\` |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`error\` | \`boolean\` | \`false\` |
| \`errorMessage\` | \`errormessage\` | \`string\` | — |
| \`forceOpen\` | \`forceopen\` | \`boolean\` | \`false\` |
| \`popupPortal\` | \`popupportal\` | \`boolean\` | \`true\` |

## Events

| Event | Detail |
|-------|--------|
| \`change\` | \`{ value: string \\| null }\` |
| \`open-change\` | \`{ open: boolean }\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const TIME_PICKER_SOURCE_CODE = `<ids-time-picker
  label="Time"
  size="large"
  .value=\${"09:30 PM"}
  @change=\${(e) => console.log(e.detail.value)}
></ids-time-picker>`;
