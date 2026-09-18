/** Developer usage + Docs tab copy for IDS DropdownComboBox (React). */

export const SYNAPSE_DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION = `
## Overview

Synapse Dropdown Combo Box is an IDS-fork façade over \`lib/react/ids/dropdown-combo-box\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dropdown-combo-box\`.

Searchable combobox dropdown for selecting a single option.

\`\`\`
SynapseDropdownComboBox
  SynapseComboboxOptions
  SynapseComboboxOption
\`\`\`

Import from \`@synapse/react/dropdown-combo-box\`.

## Props

### \`SynapseComboboxOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseComboboxOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`SynapseDropdownComboBoxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`mode\` | \`SynapseDropdownComboBoxMode \\| string\` | — |
| \`size\` | \`SynapseDropdownComboBoxSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`SynapseDropdownComboBoxMenuWidth \\| string\` | — |
| \`showClearAll\` | \`boolean\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`SynapseDropdownComboBoxOption[]\` | — |
| \`value\` | \`string \\| string[]\` | — |
| \`defaultValue\` | \`string \\| string[]\` | — |
| \`showSelectedPanel\` | \`boolean\` | — |
| \`showSelectedExpanded\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |

### \`SynapseDropdownTriggerShellProps\`

| Prop | Type | Default |
|------|------|---------|
| \`size\` | \`SynapseDropdownTriggerSize\` | — |
| \`disabled\` | \`boolean\` | — |
| \`error\` | \`boolean\` | — |
| \`hover\` | \`boolean\` | — |
| \`focusVisible\` | \`boolean\` | — |
| \`filled\` | \`boolean\` | — |
| \`left\` | \`ReactNode\` | required |
| \`className\` | \`string\` | — |
| \`style\` | \`CSSProperties\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseDropdownComboBoxProps\` | \`(payload: string \\| string[]) => void\` |
| \`onSearch\` | \`SynapseDropdownComboBoxProps\` | \`(query: string) => void\` |
| \`onOpenChange\` | \`SynapseDropdownComboBoxProps\` | \`(open: boolean) => void\` |
| \`onSelectAll\` | \`SynapseDropdownComboBoxProps\` | \`(visibleValues?: string[]) => void\` |
| \`onClearAll\` | \`SynapseDropdownComboBoxProps\` | \`(visibleValues?: string[]) => void\` |
| \`onShowSelectedExpandedChange\` | \`SynapseDropdownComboBoxProps\` | \`(expanded: boolean) => void\` |
| \`onRemoveSelectedTag\` | \`SynapseDropdownComboBoxProps\` | \`(value: string) => void\` |
| \`onShowSelectedPanelClear\` | \`SynapseDropdownComboBoxProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDropdownComboBox,
  SynapseComboboxOptions,
  SynapseComboboxOption,
} from "@synapse/react/dropdown-combo-box";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDropdownComboBox>
  {/* project children / slots per anatomy */}
</SynapseDropdownComboBox>
\`\`\`
`.trim();

export const SYNAPSE_DROPDOWN_COMBO_BOX_SOURCE_CODE = `import {
  SynapseDropdownComboBox,
  SynapseComboboxOptions,
  SynapseComboboxOption,
} from "@synapse/react/dropdown-combo-box";

export function Example() {
  return (
    <SynapseDropdownComboBox>
      {/* project children / slots */}
    </SynapseDropdownComboBox>
  );
}`;
