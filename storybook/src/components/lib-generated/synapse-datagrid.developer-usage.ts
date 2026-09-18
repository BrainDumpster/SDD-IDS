/** Developer usage + Docs tab copy for IDS Datagrid (React). */

export const SYNAPSE_DATAGRID_DOCS_DESCRIPTION = `
## Overview

Synapse Datagrid is an IDS-fork façade over \`lib/react/ids/datagrid\` (\`reexport\` strategy).
Load \`components/synapse-theme.css\` only — do not load \`ids-theme.css\`.

Import from \`@synapse/react/datagrid\`.

Data table with sorting, filtering, selection, tree cells, and column visibility.

\`\`\`
SynapseDatagrid
  SynapseDatagridColumn
  SynapseDatagridColumnTitle
  SynapseDatagridFilter
  SynapseDatagridBody
  SynapseDatagridRow
  SynapseDatagridCell
  SynapseDatagridFooter
  SynapseDatagridDetailPanel
  SynapseDatagridTextFilter
  SynapseDatagridMultiselectFilter
  SynapseDatagridDropdownMultiSelectFilter
  SynapseDatagridSingleSelectFilter
  SynapseDatagridDropdownSingleSelectFilter
\`\`\`

Import from \`@synapse/react/datagrid\`.

## Props

### \`SynapseDatagridProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`columns\` | \`SynapseDatagridColumnDef[]\` | — |
| \`rows\` | \`SynapseDatagridRowDef[]\` | — |
| \`viewMode\` | \`SynapseDatagridViewMode\` | — |
| \`treeNodes\` | \`SynapseDatagridTreeNode[]\` | — |
| \`treeColumnKey\` | \`string\` | — |
| \`treeShowRowIcon\` | \`boolean\` | — |
| \`rowSelection\` | \`boolean\` | — |
| \`selectionMode\` | \`SynapseDatagridSelectionMode\` | — |
| \`showSingleSelectionRadio\` | \`boolean\` | — |
| \`withDetailPanel\` | \`boolean\` | — |
| \`pageSize\` | \`number\` | — |
| \`readOnly\` | \`boolean\` | — |
| \`rowVerticalIndicator\` | \`boolean\` | — |
| \`headerColorAndBorder\` | \`boolean\` | — |
| \`columnResizeEnabled\` | \`boolean\` | — |
| \`showSettingsColumn\` | \`boolean\` | — |
| \`freezeUntilColumnKey\` | \`string \\| null\` | — |

### \`SynapseDatagridColumnVisibilityPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`hideableColumns\` | \`readonly SynapseDatagridColumnDef[]\` | required |
| \`hiddenColumnKeys\` | \`ReadonlySet<string>\` | required |
| \`validationMessage\` | \`string \\| null\` | — |

### \`SynapseDatagridTextFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`placeholder\` | \`string\` | — |
| \`value\` | \`string\` | — |

### \`SynapseDatagridMultiselectFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`readonly string[]\` | required |
| \`selectedValues\` | \`readonly string[]\` | required |
| \`groupLabel\` | \`string\` | required |
| \`showSearch\` | \`boolean\` | — |

### \`SynapseDatagridSingleSelectFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`readonly string[]\` | required |
| \`selectedValue\` | \`string \\| null\` | required |
| \`groupLabel\` | \`string\` | required |
| \`showSearch\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onSortChange\` | \`SynapseDatagridProps\` | \`(columnKey: string, direction: SynapseDatagridSortDirection) => void\` |
| \`onFilterToggle\` | \`SynapseDatagridProps\` | \`(columnKey: string, open: boolean) => void\` |
| \`onColumnResize\` | \`SynapseDatagridProps\` | \`(columnKey: string, widthPx: number) => void\` |
| \`onColumnOrderChange\` | \`SynapseDatagridProps\` | \`(orderedColumnKeys: string[]) => void\` |
| \`onColumnVisibilityChange\` | \`SynapseDatagridProps\` | \`(columnKey: string, visible: boolean) => void\` |
| \`onRowClick\` | \`SynapseDatagridProps\` | \`(rowKey: string) => void\` |
| \`onRowSelectionChange\` | \`SynapseDatagridProps\` | \`(rowId: string \\| null) => void\` |
| \`onSelectedRowsChange\` | \`SynapseDatagridProps\` | \`(rowIds: string[]) => void\` |
| \`onColumnVisibilityChange\` | \`SynapseDatagridColumnVisibilityPanelProps\` | \`(columnKey: string, visible: boolean) => void\` |
| \`onChange\` | \`SynapseDatagridTextFilterProps\` | \`(value: string) => void\` |
| \`onSelectedValuesChange\` | \`SynapseDatagridMultiselectFilterProps\` | \`(next: string[]) => void\` |
| \`onSelectedValueChange\` | \`SynapseDatagridSingleSelectFilterProps\` | \`(next: string \\| null) => void\` |

## API

### Import

\`\`\`tsx
import {
  SynapseDatagrid,
  SynapseDatagridColumn,
  SynapseDatagridColumnTitle,
  SynapseDatagridFilter,
  SynapseDatagridBody,
  SynapseDatagridRow,
} from "@synapse/react/datagrid";
\`\`\`

### Usage

\`\`\`tsx
<SynapseDatagrid>
  {/* project children / slots per anatomy */}
</SynapseDatagrid>
\`\`\`
`.trim();

export const SYNAPSE_DATAGRID_SOURCE_CODE = `import {
  SynapseDatagrid,
  SynapseDatagridColumn,
  SynapseDatagridColumnTitle,
  SynapseDatagridFilter,
  SynapseDatagridBody,
  SynapseDatagridRow,
} from "@synapse/react/datagrid";

export function Example() {
  return (
    <SynapseDatagrid>
      {/* project children / slots */}
    </SynapseDatagrid>
  );
}`;
