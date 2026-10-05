/** Developer usage + Docs tab copy for IDS Checkbox (React). */

export const CHECKBOX_DOCS_DESCRIPTION = `
## Overview

Binary or partial selection control with label, helper, and error projection.

\`\`\`
IdsCheckbox
  IdsCheckboxLabel
\`\`\`

Import from \`@ids/react/checkbox\`.

## Props

### \`IdsCheckboxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`checked\` | \`boolean\` | — |
| \`defaultChecked\` | \`boolean\` | — |
| \`partial\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`name\` | \`string\` | — |
| \`value\` | \`string\` | — |
| \`dataState\` | \`IdsCheckboxDataState\` | — |

### \`IdsCheckboxLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`IdsCheckboxProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsCheckbox,
  IdsCheckboxLabel,
} from "@ids/react/checkbox";
\`\`\`

### Usage

\`\`\`tsx
<IdsCheckbox>
  {/* project children / slots per anatomy */}
</IdsCheckbox>
\`\`\`
`.trim();

export const CHECKBOX_SOURCE_CODE = `import {
  IdsCheckbox,
  IdsCheckboxLabel,
} from "@ids/react/checkbox";

export function Example() {
  return (
    <IdsCheckbox>
      {/* project children / slots */}
    </IdsCheckbox>
  );
}`;
