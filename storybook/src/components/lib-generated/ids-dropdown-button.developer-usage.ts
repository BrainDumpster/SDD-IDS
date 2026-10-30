/** Developer usage + Docs tab copy for IDS DropdownButton (React). */

export const DROPDOWN_BUTTON_DOCS_DESCRIPTION = `
## Overview

Button that opens a menu of actions via composition slots.

\`\`\`
IdsDropdownButton
  IdsDropdownTrigger
  IdsDropdownMenu
  IdsDropdownMenuItem
\`\`\`

Import from \`@ids/react/dropdown-button\`.

## Props

### \`IdsDropdownButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`open\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |
| \`items\` | \`IdsDropdownButtonItem[]\` | — |
| \`label\` | \`string\` | — |
| \`buttonStyle\` | \`IdsDropdownButtonStyle \\| string\` | — |
| \`size\` | \`IdsDropdownButtonSize \\| string\` | — |
| \`icon\` | \`ReactNode\` | — |
| \`iconOnly\` | \`boolean\` | — |
| \`ariaLabel\` | \`string\` | — |

### \`IdsDropdownTriggerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`disabled\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |

### \`IdsDropdownMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |
| \`placement\` | \`"menu" \\| "submenu"\` | — |

### \`IdsDropdownMenuItemProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`disabled\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`id\` | \`string\` | — |
| \`label\` | \`string\` | — |
| \`closeOnClick\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onOpenChange\` | \`IdsDropdownButtonProps\` | \`(open: boolean) => void\` |
| \`onSelect\` | \`IdsDropdownButtonProps\` | \`(item: IdsDropdownButtonItem) => void\` |
| \`onSelect\` | \`IdsDropdownMenuItemProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDropdownButton,
  IdsDropdownTrigger,
  IdsDropdownMenu,
  IdsDropdownMenuItem,
} from "@ids/react/dropdown-button";
\`\`\`

### Usage

\`\`\`tsx
<IdsDropdownButton>
  {/* project children / slots per anatomy */}
</IdsDropdownButton>
\`\`\`
`.trim();

export const DROPDOWN_BUTTON_SOURCE_CODE = `import {
  IdsDropdownButton,
  IdsDropdownTrigger,
  IdsDropdownMenu,
  IdsDropdownMenuItem,
} from "@ids/react/dropdown-button";

export function Example() {
  return (
    <IdsDropdownButton>
      {/* project children / slots */}
    </IdsDropdownButton>
  );
}`;
