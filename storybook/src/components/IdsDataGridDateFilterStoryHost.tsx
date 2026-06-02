import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import {
  defaultIdsDataGridDateFilterState,
  isIdsDataGridDateFilterActive,
  matchesIdsDataGridDateFilter,
  type IdsDataGridDateFilterState,
} from "./IdsDataGridDateFilter";
import { IdsDataGridTypeDateFilterPanel } from "./IdsDataGridTypeDateFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const DATE_COLUMN_KEY = "dueDate";

export interface IdsDataGridDateFilterStoryHostProps extends IdsDataGridProps {
  dateColumnKey?: string;
}

/**
 * Storybook host: wires a date-only column filter (Figma `37822:90838`) with live row filtering.
 */
export function IdsDataGridDateFilterStoryHost({
  dateColumnKey = DATE_COLUMN_KEY,
  ...props
}: IdsDataGridDateFilterStoryHostProps) {
  const [dateFilter, setDateFilter] = useState<IdsDataGridDateFilterState>(
    defaultIdsDataGridDateFilterState,
  );

  const filteredRows = useMemo(() => {
    return props.rows.filter((row) =>
      matchesIdsDataGridDateFilter(row.values[dateColumnKey], dateFilter),
    );
  }, [props.rows, dateColumnKey, dateFilter]);

  const columns = useMemo(
    (): IdsDataGridColumn[] =>
      props.columns.map((col) => {
        if (col.key !== dateColumnKey) return col;
        const filterActive = isIdsDataGridDateFilterActive(dateFilter);
        return {
          ...col,
          filterable: true,
          filterActive,
          dateFilterState: filterActive ? dateFilter : undefined,
          filterPanel: (
            <IdsDataGridTypeDateFilterPanel
              state={dateFilter}
              onStateChange={setDateFilter}
              groupLabel={col.title}
            />
          ),
        };
      }),
    [props.columns, dateColumnKey, dateFilter],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
