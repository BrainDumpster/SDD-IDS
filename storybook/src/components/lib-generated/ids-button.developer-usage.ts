/** Developer usage + Docs tab copy for IDS Button (React). */

export const BUTTON_DOCS_DESCRIPTION = `
## Overview

Primary interactive control with variants, sizes, loading, and leading-icon projection.

\`\`\`
IdsButton
  IdsButtonLeadingIcon
  IdsButtonLabel
\`\`\`

Import from \`@ids/react/button\`.

## Props

### \`IdsButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`variant\` | \`IdsButtonVariant\` | — |
| \`size\` | \`IdsButtonSize\` | — |
| \`iconOnly\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`loading\` | \`boolean\` | — |
| \`type\` | \`"button" \\| "submit" \\| "reset"\` | — |
| \`ariaLabel\` | \`string\` | — |
| \`dataState\` | \`IdsButtonDataState\` | — |

### \`IdsButtonLeadingIconProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`hidden\` | \`boolean\` | — |

### \`IdsButtonLabelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`hidden\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onPressStart\` | \`IdsButtonProps\` | \`(event: MouseEvent<HTMLButtonElement> \\| KeyboardEvent<HTMLBu…\` |
| \`onPressEnd\` | \`IdsButtonProps\` | \`(event: MouseEvent<HTMLButtonElement> \\| KeyboardEvent<HTMLBu…\` |

## API

### Import

\`\`\`tsx
import {
  IdsButton,
  IdsButtonLeadingIcon,
  IdsButtonLabel,
} from "@ids/react/button";
\`\`\`

### Usage

\`\`\`tsx
<IdsButton>
  {/* project children / slots per anatomy */}
</IdsButton>
\`\`\`
`.trim();

export const BUTTON_SOURCE_CODE = `import {
  IdsButton,
  IdsButtonLeadingIcon,
  IdsButtonLabel,
} from "@ids/react/button";

export function Example() {
  return (
    <IdsButton>
      {/* project children / slots */}
    </IdsButton>
  );
}`;
