/** Developer usage + Docs tab copy for IDS DropdownSingleSelect (React). */

export const SYNAPSE_DROPDOWN_SINGLE_SELECT_DOCS_DESCRIPTION = `
## Overview

Synapse Dropdown Single Select is an IDS-fork façade over \`lib/react/ids/dropdown-single-select\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/dropdown-single-select\`.

Dropdown that allows selecting a single option from a list.

\`\`\`
SynapseDropdownSingleSelect
  SynapseDropdownSingleSelectOptions
  SynapseDropdownSingleSelectOption
\`\`\`

Import from \`@synapse/react/dropdown-single-select\`.

## Props

### \`SynapseDropdownSingleSelectProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`size\` | \`SynapseDropdownSingleSelectSize \\| string\` | — |
| \`label\` | \`string\` | — |
| \`required\` | \`boolean\` | — |
| \`placeholder\` | \`string\` | — |
| \`disabled\` | \`boolean\` | — |
| \`searchable\` | \`boolean\` | — |
| \`menuWidth\` | \`SynapseDropdownSingleSelectMenuWidth \\| string\` | — |
| \`showClearAll\` | \`boolean\` | — |
| \`showRadio\` | \`boolean\` | — |
| \`maxVisibleItems\` | \`number\` | — |
| \`noResultsLabel\` | \`string\` | — |
| \`options\` | \`SynapseDropdownSingleSelectOptionModel[]\` | — |
| \`value\` | \`string\` | — |
| \`defaultValue\` | \`string\` | — |
| \`actionLabel\` | \`string\` | — |
| \`defaultOpen\` | \`boolean\` | — |
| \`fullWidth\` | \`boolean\` | — |

### \`SynapseDropdownSingleSelectOptionProps\`

| Prop | Type | Default |
|------|------|---------|
| \`id\` | \`string\` | required |
| \`label\` | \`string\` | required |
| \`disabled\` | \`boolean\` | — |
| \`kind\` | \`"option" \\| "section" \\| "divider"\` | — |
| \`children\` | \`ReactNode\` | — |

### \`SynapseDropdownSingleSelectOptionsProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onChange\` | \`SynapseDropdownSingleSelectProps\` | \`(value: string) => void\` |
| \`onAction\` | \`SynapseDropdownSingleSelectProps\` | \`() => void\` |
| \`onOpenChange\` | \`SynapseDropdownSingleSelectProps\` | \`(open: boolean) => void\` |
| \`onSearch\` | \`SynapseDropdownSingleSelectProps\` | \`(query: string) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDropdownSingleSelect,
  SynapseDropdownSingleSelectOptions,
  SynapseDropdownSingleSelectOption,
} from "@synapse/react/dropdown-single-select";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDropdownSingleSelect>
  {/* project children / slots per anatomy */}
</SynapseDropdownSingleSelect>
\`\`\`
`.trim();

export const SYNAPSE_DROPDOWN_SINGLE_SELECT_SOURCE_CODE = `import {
  SynapseDropdownSingleSelect,
  SynapseDropdownSingleSelectOptions,
  SynapseDropdownSingleSelectOption,
} from "@synapse/react/dropdown-single-select";

export function Example() {
  return (
    <SynapseDropdownSingleSelect>
      {/* project children / slots */}
    </SynapseDropdownSingleSelect>
  );
}`;
