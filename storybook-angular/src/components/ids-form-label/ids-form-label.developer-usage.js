/** Developer usage + Docs tab copy for IDS Form Label (Angular). */

export const FORM_LABEL_DOCS_DESCRIPTION = `
## Overview

Field label for form controls: label text with an optional required marker (\`*\`)
and an optional info icon. Built from Figma component set \`12065:229953\`.

## Props

### \`ids-form-label\`

| Input | Type | Default |
|-------|------|---------|
| \`label\` | \`string\` | \`""\` |
| \`size\` | \`IdsFormLabelSize \\| string\` | \`FORM_LABEL_RUNTIME_DEFAULTS.size\` |
| \`required\` | \`boolean \\| string\` | \`false\` |
| \`showInfoIcon\` | \`boolean \\| string\` | \`false\` |
| \`infoLabel\` | \`string\` | - |
| \`htmlFor\` | \`string\` | - |

Label text can be provided via the \`label\` input or projected content.

## Sizes

\`size\` maps to the Figma \`Size\` variant and sets the row height by vertical padding
around the fixed 20px Body-2 line: \`sm\`=24px, \`md\`=32px, \`lg\`=40px. The info icon is
always 16px.

## API

Import from the component imports barrel.

\`\`\`ts
import { IDS_FORM_LABEL_IMPORTS } from "@ids/angular/form-label";
\`\`\`

## Accessibility

- Associate the label to its control via \`htmlFor\` or \`aria-labelledby\`.
- The \`*\` marker is \`aria-hidden\`; convey required state on the control.
- Provide \`infoLabel\` to give the info icon an accessible name; otherwise it is decorative.
`.trim();

export const FORM_LABEL_SOURCE_CODE = `
<ids-form-label
  label="Email"
  size="md"
  [required]="true"
  [showInfoIcon]="true"
  htmlFor="email"
  infoLabel="More information"
></ids-form-label>
`.trim();
