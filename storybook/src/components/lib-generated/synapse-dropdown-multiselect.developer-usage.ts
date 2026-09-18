/** Developer usage + Docs tab copy for IDS DropdownMultiSelect (React). */

export const SYNAPSE_DROPDOWN_MULTISELECT_DOCS_DESCRIPTION = `
## Overview

Synapse Dropdown Multi Select is an IDS-fork façade over \`lib/react/ids/dropdown-multiselect\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dropdown-multiselect\`.

Dropdown that allows selecting multiple options from a list.

\`\`\`
SynapseDropdownMultiSelect
  SynapseDropdownMultiSelectOptions
  SynapseDropdownMultiSelectOption
\`\`\`

Import from \`@synapse/react/dropdown-multiselect\`.

## Props

### \`SynapseDropdownMultiSelectProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`SynapseDropdownMultiSelectSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`SynapseDropdownMultiSelectMenuWidth \\| string\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`SynapseDropdownMultiSelectOptionModel[]\` | — |
| \`value\` | \`string[]\` | — |
| \`defaultValue\` | \`string[]\` | — |
| \`showSelectAllClearAll\` | \`boolean\` | — |
| \`selectAllLabel\` | \`string\` | — |
| \`clearAllLabel\` | \`string\` | — |
| \`clearAllDisabled\` | \`boolean\` | — |
| \`showSelectedBadge\` | \`boolean\` | — |

### \`SynapseDropdownMultiSelectOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`kind\` | \`"option" \\| "section" \\| "divider"\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseDropdownMultiSelectOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseDropdownMultiSelectProps\` | \`(values: string[]) => void\` |
| \`onSelectAll\` | \`SynapseDropdownMultiSelectProps\` | \`(visibleValues?: string[]) => void\` |
| \`onClearAll\` | \`SynapseDropdownMultiSelectProps\` | \`(visibleValues?: string[]) => void\` |
| \`onAction\` | \`SynapseDropdownMultiSelectProps\` | \`() => void\` |
| \`onOpenChange\` | \`SynapseDropdownMultiSelectProps\` | \`(open: boolean) => void\` |
| \`onSearch\` | \`SynapseDropdownMultiSelectProps\` | \`(query: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDropdownMultiSelect,
  SynapseDropdownMultiSelectOptions,
  SynapseDropdownMultiSelectOption,
} from "@synapse/react/dropdown-multiselect";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDropdownMultiSelect>
  {/* project children / slots per anatomy */}
</SynapseDropdownMultiSelect>
\`\`\`
`.trim();

export const SYNAPSE_DROPDOWN_MULTISELECT_SOURCE_CODE = `import {
  SynapseDropdownMultiSelect,
  SynapseDropdownMultiSelectOptions,
  SynapseDropdownMultiSelectOption,
} from "@synapse/react/dropdown-multiselect";

export function Example() {
  return (
    <SynapseDropdownMultiSelect>
      {/* project children / slots */}
    </SynapseDropdownMultiSelect>
  );
}`;
