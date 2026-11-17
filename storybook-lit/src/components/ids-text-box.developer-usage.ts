/**
 * Developer usage for IDS Lit Text Box (composition + standalone).
 */
export const TEXT_BOX_DOCS_DESCRIPTION = `
## Overview

Lit Text Box from \`components/ids/text-box/design-spec.md\`.

**Preferred composition** (checkbox-group pattern):

\`\`\`html
<ids-textbox-container>
  <label>Email:</label>
  <ids-text-box placeholder="Placeholder Text"></ids-text-box>
  <ids-control-helper>Helper text</ids-control-helper>
  <ids-control-error>Error message</ids-control-error>
</ids-textbox-container>
\`\`\`

- When \`error\` / \`invalid\` is set on the container, \`ids-control-error\` is shown and \`ids-control-helper\` is hidden.
- \`ids-control-helper\` / \`ids-control-error\` are shared primitives for checkbox, radio, and other form fields.
- Standalone \`ids-text-box\` still supports Angular-style \`helpertext\` / \`errortext\` props.

## Container props

| Prop | Type | Default |
|------|------|---------|
| \`error\` / \`invalid\` | \`boolean\` | \`false\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`required\` | \`boolean\` | \`false\` |
| \`labelPosition\` / \`labelposition\` | \`left \\| top\` | \`left\` |
| \`size\` | \`large \\| small\` | \`large\` (label padding) |
| \`showInfoIcon\` / \`showinfoicon\` | \`boolean\` | \`false\` |

## Control props (\`ids-text-box\`)

| Prop / attr | Type | Default |
|-------------|------|---------|
| \`componentType\` / \`componenttype\` | \`text-input \\| text-area\` | \`text-input\` |
| \`size\` | \`large \\| small\` | \`large\` |
| \`state\` | demo override | \`default\` |
| \`placeholder\` | \`string\` | \`Placeholder Text\` |
| \`value\` | \`string\` | — (controlled when set) |
| \`selectTextOnFocus\` / \`selecttextonfocus\` | \`boolean \\| null\` | \`true\` |
| \`showIcon\` / \`showicon\` | \`boolean\` | \`true\` |
| \`iconName\` / \`iconname\` | \`string\` | \`mail\` |

## Events

| Event | Detail |
|-------|--------|
| \`value-change\` | \`string\` |
`.trim();

export const TEXT_BOX_SOURCE_CODE = `<ids-textbox-container>
  <label>Label:</label>
  <ids-text-box placeholder="Placeholder Text"></ids-text-box>
  <ids-control-helper>Helper text</ids-control-helper>
  <ids-control-error>Error message</ids-control-error>
</ids-textbox-container>`;

export const TEXT_BOX_STORY_SOURCE_CODE = TEXT_BOX_SOURCE_CODE;
