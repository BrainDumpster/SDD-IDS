/**
 * Developer usage for IDS Lit Radio Button (design-spec + Angular/React API parity).
 */
export const RADIO_BUTTON_DOCS_DESCRIPTION = `
## Overview

Lit \`ids-radio-button-group\` / \`ids-radio-button\` — single-choice selection from
\`components/ids/radio-button/design-spec.md\`. Items must be projected inside the group.

**Labels** are projected light-DOM \`<label>\` children (not string props):

- Group form label → direct \`<label>\` child of \`ids-radio-button-group\`
- Option label → direct \`<label>\` child of \`ids-radio-button\`

\`value\` remains a required prop on \`ids-radio-button\`.

## Props (\`ids-radio-button\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| \`value\` | \`value\` | \`string\` | required |
| — | child \`<label>\` | projected option label | required |
| \`disabled\` | \`disabled\` | \`boolean\` | \`false\` |
| \`error\` | \`error\` | \`boolean\` | \`false\` |
| \`helperText\` | \`helpertext\` | \`string\` | — |
| \`simulatedState\` | \`simulatedstate\` | \`default \\| hover \\| focus-visible\` | docs only |

## Props (\`ids-radio-button-group\`)

| Prop | Attribute | Type | Default |
|------|-----------|------|---------|
| — | child \`<label>\` | projected form label | required for visible group label |
| \`name\` | \`name\` | \`string\` | \`ids-radio-default\` |
| \`value\` | \`value\` | \`string\` | controlled when set |
| \`defaultValue\` | \`defaultvalue\` | \`string\` | \`option1\` |
| \`showLabel\` | \`showlabel\` | \`boolean\` | \`true\` |
| \`ariaLabel\` | \`arialabel\` | \`string\` | — |
| \`labelPosition\` | \`labelposition\` | \`left \\| top\` | \`left\` |
| \`required\` | \`required\` | \`boolean\` | \`false\` |
| \`labelIcon\` | \`labelicon\` | \`boolean\` | \`false\` |
| \`error\` / \`errorText\` | \`error\` / \`errortext\` | group validation | — |
| \`orientation\` | \`orientation\` | \`vertical \\| horizontal\` | \`vertical\` |
| \`disabled\` | \`disabled\` | cascades to children | \`false\` |

## Events

| Event | Detail |
|-------|--------|
| \`value-change\` | \`string\` |

## Theme

\`\`\`ts
import "@ids/core/ids-theme.css";
import { applyIdsTheme } from "@ids/core/theme";
applyIdsTheme({ theme: "light" });
\`\`\`
`.trim();

export const RADIO_BUTTON_SOURCE_CODE = `<ids-radio-button-group
  name="ids-radio-default"
  defaultvalue="option1"
  labelposition="left"
>
  <label>Radio Group:</label>
  <ids-radio-button value="option1"><label>Option 1</label></ids-radio-button>
  <ids-radio-button value="option2"><label>Option 2</label></ids-radio-button>
  <ids-radio-button value="option3"><label>Option 3</label></ids-radio-button>
</ids-radio-button-group>`;
