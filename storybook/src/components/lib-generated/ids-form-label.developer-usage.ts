/** Developer usage + Docs tab copy for IDS Form Label (React). */

export const FORM_LABEL_DOCS_DESCRIPTION = `
## Overview

Field label for form controls: label text with an optional required marker (\`*\`)
and an optional info icon. Built from Figma component set \`12065:229953\`.

\`\`\`
IdsFormLabel
  labelGroup (<label for>)
    labelText
    requiredMarker?
  infoIcon?
\`\`\`

Import from \`@ids/react/form-label\`.

## Props

### \`IdsFormLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`"sm" \\| "md" \\| "lg"\` | \`"md"\` |
| \`required\` | \`boolean\` | \`false\` |
| \`showInfoIcon\` | \`boolean\` | \`false\` |
| \`infoLabel\` | \`string\` | — |
| \`htmlFor\` | \`string\` | — |

## Sizes

\`size\` maps to the Figma \`Size\` variant and sets the row height by vertical padding
around the fixed 20px Body-2 line: \`sm\`=24px, \`md\`=32px, \`lg\`=40px. The info icon is
always 16px.

## Accessibility

- Associate the label to its control via \`htmlFor\` (native \`<label for>\`) or \`aria-labelledby\`.
- The \`*\` marker is \`aria-hidden\`; convey required state on the control (\`required\` / \`aria-required\`).
- Provide \`infoLabel\` to give the info icon an accessible name; otherwise it is decorative.

## Tokens

- Label + marker: \`var(--color-text-gray-neutral-strong)\`, Body 2 (Roboto 400, 14/20).
- Info icon: \`info-circ-solid\` (blue disc \`var(--color-icon-alerting-info-base)\` + white glyph).
- Gaps: text↔marker \`var(--spacing-space-2)\`, group↔icon \`var(--spacing-space-8)\`.
`.trim();

export const FORM_LABEL_SOURCE_CODE = `
import { IdsFormLabel } from "@ids/react/form-label";

export function Example() {
  return (
    <IdsFormLabel size="md" required showInfoIcon htmlFor="email" infoLabel="More information">
      Email
    </IdsFormLabel>
  );
}
`.trim();
