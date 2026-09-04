/** Developer usage + Docs tab copy for IDS DropdownMultiSelect (React). */

export const DROPDOWN_MULTISELECT_DOCS_DESCRIPTION = `
## Overview

Dropdown that allows selecting multiple options from a list.

\`\`\`
IdsDropdownMultiSelect
  IdsDropdownMultiSelectOptions
  IdsDropdownMultiSelectOption
\`\`\`

Import from \`@ids/react/dropdown-multiselect\`.

## Props

### \`IdsDropdownMultiSelectProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`IdsDropdownMultiSelectSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`IdsDropdownMultiSelectMenuWidth \\| string\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`IdsDropdownMultiSelectOptionModel[]\` | — |
| \`value\` | \`string[]\` | — |
| \`defaultValue\` | \`string[]\` | — |
| \`showSelectAllClearAll\` | \`boolean\` | — |
| \`selectAllLabel\` | \`string\` | — |
| \`clearAllLabel\` | \`string\` | — |
| \`clearAllDisabled\` | \`boolean\` | — |
| \`showSelectedBadge\` | \`boolean\` | — |

### \`IdsDropdownMultiSelectOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`kind\` | \`"option" \\| "section" \\| "divider"\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsDropdownMultiSelectOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`IdsDropdownMultiSelectProps\` | \`(values: string[]) => void\` |
| \`onSelectAll\` | \`IdsDropdownMultiSelectProps\` | \`(visibleValues?: string[]) => void\` |
| \`onClearAll\` | \`IdsDropdownMultiSelectProps\` | \`(visibleValues?: string[]) => void\` |
| \`onAction\` | \`IdsDropdownMultiSelectProps\` | \`() => void\` |
| \`onOpenChange\` | \`IdsDropdownMultiSelectProps\` | \`(open: boolean) => void\` |
| \`onSearch\` | \`IdsDropdownMultiSelectProps\` | \`(query: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDropdownMultiSelect,
  IdsDropdownMultiSelectOptions,
  IdsDropdownMultiSelectOption,
} from "@ids/react/dropdown-multiselect";
\`\`\`

### Usage

\`\`\`tsx
<IdsDropdownMultiSelect>
  {/* project children / slots per anatomy */}
</IdsDropdownMultiSelect>
\`\`\`
`.trim();

export const DROPDOWN_MULTISELECT_SOURCE_CODE = `import {
  IdsDropdownMultiSelect,
  IdsDropdownMultiSelectOptions,
  IdsDropdownMultiSelectOption,
} from "@ids/react/dropdown-multiselect";

export function Example() {
  return (
    <IdsDropdownMultiSelect>
      {/* project children / slots */}
    </IdsDropdownMultiSelect>
  );
}`;
