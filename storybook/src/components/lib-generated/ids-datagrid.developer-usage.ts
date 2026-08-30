/** Developer usage + Docs tab copy for IDS Datagrid (React). */

export const DATAGRID_DOCS_DESCRIPTION = `
## Overview

Data table with sorting, filtering, selection, tree cells, and column visibility.

\`\`\`
IdsDatagrid
  IdsDatagridColumn
  IdsDatagridColumnTitle
  IdsDatagridFilter
  IdsDatagridBody
  IdsDatagridRow
  IdsDatagridCell
  IdsDatagridFooter
  IdsDatagridDetailPanel
  IdsDatagridTextFilter
  IdsDatagridMultiselectFilter
  IdsDatagridDropdownMultiSelectFilter
  IdsDatagridSingleSelectFilter
  IdsDatagridDropdownSingleSelectFilter
\`\`\`

Import from \`@ids/react/datagrid\`.

## Props

### \`IdsDatagridProps\`

| Prop | Type | Default |
|------|------|---------|
| \`children\` | \`ReactNode\` | — |
| \`columns\` | \`IdsDatagridColumnDef[]\` | — |
| \`rows\` | \`IdsDatagridRowDef[]\` | — |
| \`viewMode\` | \`IdsDatagridViewMode\` | — |
| \`treeNodes\` | \`IdsDatagridTreeNode[]\` | — |
| \`treeColumnKey\` | \`string\` | — |
| \`treeShowRowIcon\` | \`boolean\` | — |
| \`rowSelection\` | \`boolean\` | — |
| \`selectionMode\` | \`IdsDatagridSelectionMode\` | — |
| \`showSingleSelectionRadio\` | \`boolean\` | — |
| \`withDetailPanel\` | \`boolean\` | — |
| \`pageSize\` | \`number\` | — |
| \`readOnly\` | \`boolean\` | — |
| \`rowVerticalIndicator\` | \`boolean\` | — |
| \`headerColorAndBorder\` | \`boolean\` | — |
| \`columnResizeEnabled\` | \`boolean\` | — |
| \`showSettingsColumn\` | \`boolean\` | — |
| \`freezeUntilColumnKey\` | \`string \\| null\` | — |

### \`IdsDatagridColumnVisibilityPanelProps\`

| Prop | Type | Default |
|------|------|---------|
| \`hideableColumns\` | \`readonly IdsDatagridColumnDef[]\` | required |
| \`hiddenColumnKeys\` | \`ReadonlySet<string>\` | required |
| \`validationMessage\` | \`string \\| null\` | — |

### \`IdsDatagridTextFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`placeholder\` | \`string\` | — |
| \`value\` | \`string\` | — |

### \`IdsDatagridMultiselectFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`readonly string[]\` | required |
| \`selectedValues\` | \`readonly string[]\` | required |
| \`groupLabel\` | \`string\` | required |
| \`showSearch\` | \`boolean\` | — |

### \`IdsDatagridSingleSelectFilterProps\`

| Prop | Type | Default |
|------|------|---------|
| \`options\` | \`readonly string[]\` | required |
| \`selectedValue\` | \`string \\| null\` | required |
| \`groupLabel\` | \`string\` | required |
| \`showSearch\` | \`boolean\` | — |

## Events

| Callback | On | Signature |
|----------|----|-----------|
| \`onSortChange\` | \`IdsDatagridProps\` | \`(columnKey: string, direction: IdsDatagridSortDirection) => void\` |
| \`onFilterToggle\` | \`IdsDatagridProps\` | \`(columnKey: string, open: boolean) => void\` |
| \`onColumnResize\` | \`IdsDatagridProps\` | \`(columnKey: string, widthPx: number) => void\` |
| \`onColumnOrderChange\` | \`IdsDatagridProps\` | \`(orderedColumnKeys: string[]) => void\` |
| \`onColumnVisibilityChange\` | \`IdsDatagridProps\` | \`(columnKey: string, visible: boolean) => void\` |
| \`onRowClick\` | \`IdsDatagridProps\` | \`(rowKey: string) => void\` |
| \`onRowSelectionChange\` | \`IdsDatagridProps\` | \`(rowId: string \\| null) => void\` |
| \`onSelectedRowsChange\` | \`IdsDatagridProps\` | \`(rowIds: string[]) => void\` |
| \`onColumnVisibilityChange\` | \`IdsDatagridColumnVisibilityPanelProps\` | \`(columnKey: string, visible: boolean) => void\` |
| \`onChange\` | \`IdsDatagridTextFilterProps\` | \`(value: string) => void\` |
| \`onSelectedValuesChange\` | \`IdsDatagridMultiselectFilterProps\` | \`(next: string[]) => void\` |
| \`onSelectedValueChange\` | \`IdsDatagridSingleSelectFilterProps\` | \`(next: string \\| null) => void\` |

## API

### Import

\`\`\`tsx
import {
  IdsDatagrid,
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridFilter,
  IdsDatagridBody,
  IdsDatagridRow,
} from "@ids/react/datagrid";
\`\`\`

### Usage

\`\`\`tsx
<IdsDatagrid>
  {/* project children / slots per anatomy */}
</IdsDatagrid>
\`\`\`
`.trim();

export const DATAGRID_SOURCE_CODE = `import {
  IdsDatagrid,
  IdsDatagridColumn,
  IdsDatagridColumnTitle,
  IdsDatagridFilter,
  IdsDatagridBody,
  IdsDatagridRow,
} from "@ids/react/datagrid";

export function Example() {
  return (
    <IdsDatagrid>
      {/* project children / slots */}
    </IdsDatagrid>
  );
}`;
