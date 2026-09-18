/** Developer usage + Docs tab copy for IDS DropdownButton (React). */

export const SYNAPSE_DROPDOWN_BUTTON_DOCS_DESCRIPTION = `
## Overview

Synapse Dropdown Button is an IDS-fork façade over \`lib/react/ids/dropdown-button\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dropdown-button\`.

Button that opens a menu of actions via composition slots.

\`\`\`
SynapseDropdownButton
  SynapseDropdownTrigger
  SynapseDropdownMenu
  SynapseDropdownMenuItem
\`\`\`

Import from \`@synapse/react/dropdown-button\`.

## Props

### \`SynapseDropdownButtonProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`open\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`disabled\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |
| \`items\` | \`SynapseDropdownButtonItem[]\` | — |
| \`label\` | \`string\` | — |
| \`buttonStyle\` | \`SynapseDropdownButtonStyle \\| string\` | — |
| \`size\` | \`SynapseDropdownButtonSize \\| string\` | — |
| \`icon\` | \`ReactNode\` | — |
| \`iconOnly\` | \`boolean\` | — |
| \`ariaLabel\` | \`string\` | — |

### \`SynapseDropdownTriggerProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`disabled\` | \`boolean\` | — |
| \`className\` | \`string\` | — |
| \`ariaLabel\` | \`string\` | — |

### \`SynapseDropdownMenuProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |
| \`id\` | \`string\` | — |
| \`placement\` | \`"menu" \\| "submenu"\` | — |

### \`SynapseDropdownMenuItemProps\`

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
| \`onOpenChange\` | \`SynapseDropdownButtonProps\` | \`(open: boolean) => void\` |
| \`onSelect\` | \`SynapseDropdownButtonProps\` | \`(item: SynapseDropdownButtonItem) => void\` |
| \`onSelect\` | \`SynapseDropdownMenuItemProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDropdownButton,
  SynapseDropdownTrigger,
  SynapseDropdownMenu,
  SynapseDropdownMenuItem,
} from "@synapse/react/dropdown-button";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDropdownButton>
  {/* project children / slots per anatomy */}
</SynapseDropdownButton>
\`\`\`
`.trim();

export const SYNAPSE_DROPDOWN_BUTTON_SOURCE_CODE = `import {
  SynapseDropdownButton,
  SynapseDropdownTrigger,
  SynapseDropdownMenu,
  SynapseDropdownMenuItem,
} from "@synapse/react/dropdown-button";

export function Example() {
  return (
    <SynapseDropdownButton>
      {/* project children / slots */}
    </SynapseDropdownButton>
  );
}`;
