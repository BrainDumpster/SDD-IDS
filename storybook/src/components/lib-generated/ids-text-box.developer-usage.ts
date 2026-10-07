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
| \`selectTextOnFocus\` | \`boolean \\| null\` | \`true\` |

## Focus

- **Click or Tab / Shift+Tab** — the Selected style: brand border, no outer ring. Same for text input and text area.
- **\`selectTextOnFocus\`** (Figma: *Select text when in focus*) decides what happens to a field that already holds text when it takes focus, by click or by Tab:
  - \`true\` (default) — selects the whole value, so typing replaces it. Use for simple values that are usually re-entered (name, location).
  - \`false\` — puts the caret at the end. Use for values that are usually edited in part, where replacing them by accident loses data (IP address, path).
  - A previous selection is never restored when the user comes back to the field.
  - \`null\` — leaves the caret to the browser. The option is for Text Box / Text Area only; components that embed the field (Pagination, Slider) pass \`null\`.

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
