/** Developer usage + Docs tab copy for IDS DropdownComboBox (React). */

export const DROPDOWN_COMBO_BOX_DOCS_DESCRIPTION = `
## Overview

Searchable combobox dropdown for selecting a single option.

\`\`\`
IdsDropdownComboBox
  IdsComboboxOptions
  IdsComboboxOption
\`\`\`

Import from \`@ids/react/dropdown-combo-box\`.

## Props

### \`IdsComboboxOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsComboboxOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

### \`IdsDropdownComboBoxProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`mode\` | \`IdsDropdownComboBoxMode \\| string\` | — |
| \`size\` | \`IdsDropdownComboBoxSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`IdsDropdownComboBoxMenuWidth \\| string\` | — |
| \`showClearAll\` | \`boolean\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`IdsDropdownComboBoxOption[]\` | — |
| \`value\` | \`string \\| string[]\` | — |
| \`defaultValue\` | \`string \\| string[]\` | — |
| \`showSelectedPanel\` | \`boolean\` | — |
| \`showSelectedExpanded\` | \`boolean\` | — |
| \`defaultOpen\` | \`boolean\` | — |

### \`IdsDropdownTriggerShellProps\`

| Prop | Type | Default |
|------|------|---------|
| \`size\` | \`IdsDropdownTriggerSize\` | — |
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
| \`onChange\` | \`IdsDropdownComboBoxProps\` | \`(payload: string \\| string[]) => void\` |
| \`onSearch\` | \`IdsDropdownComboBoxProps\` | \`(query: string) => void\` |
| \`onOpenChange\` | \`IdsDropdownComboBoxProps\` | \`(open: boolean) => void\` |
| \`onSelectAll\` | \`IdsDropdownComboBoxProps\` | \`(visibleValues?: string[]) => void\` |
| \`onClearAll\` | \`IdsDropdownComboBoxProps\` | \`(visibleValues?: string[]) => void\` |
| \`onShowSelectedExpandedChange\` | \`IdsDropdownComboBoxProps\` | \`(expanded: boolean) => void\` |
| \`onRemoveSelectedTag\` | \`IdsDropdownComboBoxProps\` | \`(value: string) => void\` |
| \`onShowSelectedPanelClear\` | \`IdsDropdownComboBoxProps\` | \`() => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDropdownComboBox,
  IdsComboboxOptions,
  IdsComboboxOption,
} from "@ids/react/dropdown-combo-box";
\`\`\`

### Usage

\`\`\`tsx
<IdsDropdownComboBox>
  {/* project children / slots per anatomy */}
</IdsDropdownComboBox>
\`\`\`
`.trim();

export const DROPDOWN_COMBO_BOX_SOURCE_CODE = `import {
  IdsDropdownComboBox,
  IdsComboboxOptions,
  IdsComboboxOption,
} from "@ids/react/dropdown-combo-box";

export function Example() {
  return (
    <IdsDropdownComboBox>
      {/* project children / slots */}
    </IdsDropdownComboBox>
  );
}`;
