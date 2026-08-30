/** Developer usage + Docs tab copy for IDS TextBox (React). */

export const TEXT_BOX_DOCS_DESCRIPTION = `
## Overview

Text input with label, helper, and error composition support.

Import from \`@ids/react/text-box\`.

## Props

### \`IdsTextBoxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`componentType\` | \`IdsTextBoxComponentType\` | — |
| \`size\` | \`IdsTextBoxSize\` | — |
| \`state\` | \`IdsTextBoxState\` | — |
| \`label\` | \`string\` | — |
| \`showLabel\` | \`boolean\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`invalid\` | \`boolean\` | — |
| \`showIcon\` | \`boolean\` | — |
| \`iconName\` | \`string\` | — |
| \`id\` | \`string\` | — |
| \`name\` | \`string\` | — |
| \`rows\` | \`number\` | — |
| \`inputType\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onValueChange\` | \`IdsTextBoxProps\` | \`(value: string) => void\` |

## API

### Import

\`\`\`tsx
import { IdsTextBox } from "@ids/react/text-box";
\`\`\`

### Usage

\`\`\`tsx
<IdsTextBox>
  {/* project children / slots per anatomy */}
</IdsTextBox>
\`\`\`
`.trim();

export const TEXT_BOX_SOURCE_CODE = `import { IdsTextBox } from "@ids/react/text-box";

export function Example() {
  return (
    <IdsTextBox>
      {/* project children / slots */}
    </IdsTextBox>
  );
}`;
