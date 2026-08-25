/** Developer usage + Docs tab copy for IDS DropdownSingleSelect (React). */

export const DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION = `
## Overview

Dropdown that allows selecting a single option from a list.

\`\`\`
IdsDropdownSingleSelect
  IdsDropdownSingleSelectOptions
  IdsDropdownSingleSelectOption
\`\`\`

Import from \`@ids/react/dropdown-single-select\`.

## Props

### \`IdsDropdownSingleSelectProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`IdsDropdownSingleSelectSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`IdsDropdownSingleSelectMenuWidth \\| string\` | — |
| \`showClearAll\` | \`boolean\` | — |
| \`showRadio\` | \`boolean\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`IdsDropdownSingleSelectOptionModel[]\` | — |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`actionLabel\` | \`string\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`fullWidth\` | \`boolean\` | — |

### \`IdsDropdownSingleSelectOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`kind\` | \`"option" \\| "section" \\| "divider"\` | — |
| \`children\` | \`ReactNode\` | — |

### \`IdsDropdownSingleSelectOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`IdsDropdownSingleSelectProps\` | \`(value: string) => void\` |
| \`onAction\` | \`IdsDropdownSingleSelectProps\` | \`() => void\` |
| \`onOpenChange\` | \`IdsDropdownSingleSelectProps\` | \`(open: boolean) => void\` |
| \`onSearch\` | \`IdsDropdownSingleSelectProps\` | \`(query: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDropdownSingleSelect,
  IdsDropdownSingleSelectOptions,
  IdsDropdownSingleSelectOption,
} from "@ids/react/dropdown-single-select";
\`\`\`

### Usage

\`\`\`tsx
<IdsDropdownSingleSelect>
  {/* project children / slots per anatomy */}
</IdsDropdownSingleSelect>
\`\`\`
`.trim();

export const DROPDOWN_SINGLE_SELECT_SOURCE_CODE = `import {
  IdsDropdownSingleSelect,
  IdsDropdownSingleSelectOptions,
  IdsDropdownSingleSelectOption,
} from "@ids/react/dropdown-single-select";

export function Example() {
  return (
    <IdsDropdownSingleSelect>
      {/* project children / slots */}
    </IdsDropdownSingleSelect>
  );
}`;
