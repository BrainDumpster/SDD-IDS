/** Developer usage + Docs tab copy for IDS SegmentedButton (React). */

export const SEGMENTED_BUTTON_DOCS_DESCRIPTION = `
## Overview

Grouped toggle buttons for mutually exclusive options (text or icon).

\`\`\`
IdsSegmentedButton
  IdsSegmentedText
  IdsSegmentedIcon
\`\`\`

Import from \`@ids/react/segmented-button\`.

## Props

### \`IdsSegmentedTextProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`selected\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`simulatedState\` | \`IdsSegmentedSimulatedState\` | — |

### \`IdsSegmentedIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`value\` | \`string\` | required |
| \`shape\` | \`string\` | — |
| \`icon\` | \`IdsSegmentedIconSource\` | — |
| \`selected\` | \`boolean\` | — |
| \`title\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | required |
| \`simulatedState\` | \`IdsSegmentedSimulatedState\` | — |

### \`IdsSegmentedButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`type\` | \`"text" \\| "icon"\` | required |
| \`children\` | \`ReactNode\` | required |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`ariaLabelledby\` | \`string\` | — |
| \`iconsBasePath\` | \`string\` | — |
| \`className\` | \`string\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onSelected\` | \`IdsSegmentedButtonProps\` | \`(value: string, meta: IdsSegmentedButtonChangeMeta) => void\` |
| \`onChange\` | \`IdsSegmentedButtonProps\` | \`(value: string, meta: IdsSegmentedButtonChangeMeta) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsSegmentedButton,
  IdsSegmentedText,
  IdsSegmentedIcon,
} from "@ids/react/segmented-button";
\`\`\`

### Usage

\`\`\`tsx
<IdsSegmentedButton>
  {/* project children / slots per anatomy */}
</IdsSegmentedButton>
\`\`\`
`.trim();

export const SEGMENTED_BUTTON_SOURCE_CODE = `import {
  IdsSegmentedButton,
  IdsSegmentedText,
  IdsSegmentedIcon,
} from "@ids/react/segmented-button";

export function Example() {
  return (
    <IdsSegmentedButton>
      {/* project children / slots */}
    </IdsSegmentedButton>
  );
}`;
