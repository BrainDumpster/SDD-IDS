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

## Icon-only contract

When \`iconOnly\` is \`true\` (or \`variant\` is \`ghostNeutral\` / \`ghost\`):

- \`ariaLabel\` is **required** (native \`aria-label\` also accepted).
- Project \`IdsButtonLeadingIcon\` (no label).
- Control is **square**: small \`24×24\`, medium \`32×32\`, large \`40×40\`.
- Glyph: small \`12×12\`, medium \`14×14\`, large \`16×16\` (Ghost Neutral large = \`14×14\`).

## Props

### \`IdsButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`variant\` | \`IdsButtonVariant\` | \`primary\` |
| \`size\` | \`IdsButtonSize\` | \`large\` |
| \`iconOnly\` | \`boolean\` | \`false\` |
| \`disabled\` | \`boolean\` | \`false\` |
| \`loading\` | \`boolean\` | \`false\` |
| \`type\` | \`"button" \\| "submit" \\| "reset"\` | \`button\` |
| \`ariaLabel\` | \`string\` | — (required when \`iconOnly\`) |
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
<IdsButton variant="primary">
  <IdsButtonLabel>Button</IdsButtonLabel>
</IdsButton>

<IdsButton variant="tertiary" iconOnly ariaLabel="Settings" size="large">
  <IdsButtonLeadingIcon>
    <IdsIcon shape="settings-gear-detailed" size={16} />
  </IdsButtonLeadingIcon>
</IdsButton>
\`\`\`
`.trim();

export const BUTTON_SOURCE_CODE = `import {
  IdsButton,
  IdsButtonLeadingIcon,
  IdsButtonLabel,
} from "@ids/react/button";
import { IdsIcon } from "@ids/react/icon";

export function Example() {
  return (
    <>
      <IdsButton variant="primary">
        <IdsButtonLabel>Button</IdsButtonLabel>
      </IdsButton>
      <IdsButton iconOnly ariaLabel="Settings" size="medium">
        <IdsButtonLeadingIcon>
          <IdsIcon shape="settings-gear-detailed" size={14} />
        </IdsButtonLeadingIcon>
      </IdsButton>
    </>
  );
}`;
