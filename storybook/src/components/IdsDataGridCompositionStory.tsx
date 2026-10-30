import type { ComponentProps } from "react";
import {
  DATAGRID_SPEC_ACCURATE_DEFAULTS,
  DATAGRID_SPEC_COLUMNS,
  DATAGRID_SPEC_ROWS,
} from "@component-contracts/ids/datagrid.contract";
import {
  IdsDataGridCell,
  IdsDataGridColumn,
  IdsDataGridComposed,
  IdsDataGridFilter,
  IdsDataGridFilterSearchField,
  IdsDataGridFooter,
  IdsDataGridRow,
} from "./IdsDataGridComposition";

export type IdsDataGridCompositionStoryProps = Omit<
  ComponentProps<typeof IdsDataGridComposed>,
  "children"
> & {
  columns?: typeof DATAGRID_SPEC_COLUMNS;
  rows?: typeof DATAGRID_SPEC_ROWS;
};

/** Spec-accurate composition tree for Storybook (projected columns + rows). */
export function IdsDataGridCompositionStory({
  columns = DATAGRID_SPEC_COLUMNS,
  rows = DATAGRID_SPEC_ROWS,
  wireDefaultFilters = true,
  ...gridProps
}: IdsDataGridCompositionStoryProps) {
  const mergedProps = { ...DATAGRID_SPEC_ACCURATE_DEFAULTS, ...gridProps };

  return (
    <IdsDataGridComposed wireDefaultFilters={wireDefaultFilters} {...mergedProps}>
      {columns.map((column) => (
        <IdsDataGridColumn
          key={column.key}
          field={column.key}
          title={column.title}
          sortable={column.sortable}
          filterable={column.filterable}
          minWidth={column.minWidth}
          width={column.width}
          columnHideable={column.columnHideable}
        >
          {column.key === "name" ? (
            <IdsDataGridFilter>
              <IdsDataGridFilterSearchField aria-label="Search name column" />
            </IdsDataGridFilter>
          ) : null}
        </IdsDataGridColumn>
      ))}
      {rows.map((row) => (
        <IdsDataGridRow key={row.id} rowId={row.id}>
          {columns.map((column) => (
            <IdsDataGridCell key={`${row.id}-${column.key}`} field={column.key}>
              {String(row.values[column.key] ?? "")}
            </IdsDataGridCell>
          ))}
        </IdsDataGridRow>
      ))}
      <IdsDataGridFooter />
    </IdsDataGridComposed>
  );
}
