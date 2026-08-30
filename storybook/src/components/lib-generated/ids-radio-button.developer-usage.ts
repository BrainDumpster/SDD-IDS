/** Developer usage + Docs tab copy for IDS RadioButton (React). */

export const RADIO_BUTTON_DOCS_DESCRIPTION = `
## Overview

Single-choice selection within a radio group, with label projection.

\`\`\`
IdsRadioButton
  IdsRadioGroup
  IdsRadioLabel
\`\`\`

Import from \`@ids/react/radio-button\`.

## Props

### \`IdsRadioGroupProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`name\` | \`string\` | required |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`orientation\` | \`IdsRadioOrientation\` | — |

### \`IdsRadioLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |

### \`IdsRadioButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`value\` | \`string\` | required |
| \`name\` | \`string\` | — |
| \`checked\` | \`boolean\` | — |
| \`defaultChecked\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`dataState\` | \`IdsRadioDataState\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`IdsRadioGroupProps\` | \`(value: string) => void\` |
| \`onChange\` | \`IdsRadioButtonProps\` | \`(checked: boolean) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsRadioButton,
  IdsRadioGroup,
  IdsRadioLabel,
} from "@ids/react/radio-button";
\`\`\`

### Usage

\`\`\`tsx
<IdsRadioButton>
  {/* project children / slots per anatomy */}
</IdsRadioButton>
\`\`\`
`.trim();

export const RADIO_BUTTON_SOURCE_CODE = `import {
  IdsRadioButton,
  IdsRadioGroup,
  IdsRadioLabel,
} from "@ids/react/radio-button";

export function Example() {
  return (
    <IdsRadioButton>
      {/* project children / slots */}
    </IdsRadioButton>
  );
}`;
