import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import {
  defaultIdsDataGridDateTimeFilterState,
  isIdsDataGridDateTimeFilterActive,
  matchesIdsDataGridDateAndTimeFilter,
  type IdsDataGridDateTimeFilterState,
} from "./IdsDataGridDateAndTimeFilter";
import { IdsDataGridTypeDateAndTimeFilterPanel } from "./IdsDataGridTypeDateAndTimeFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const DATETIME_COLUMN_KEY = "updatedAt";

export interface IdsDataGridDateAndTimeFilterStoryHostProps extends IdsDataGridProps {
  dateTimeColumnKey?: string;
}

/**
 * Storybook host: wires a date-time column filter (Figma `44360:181306`) with live row filtering.
 */
export function IdsDataGridDateAndTimeFilterStoryHost({
  dateTimeColumnKey = DATETIME_COLUMN_KEY,
  ...props
}: IdsDataGridDateAndTimeFilterStoryHostProps) {
  const [dateTimeFilter, setDateTimeFilter] = useState<IdsDataGridDateTimeFilterState>(
    defaultIdsDataGridDateTimeFilterState,
  );

  const filteredRows = useMemo(() => {
    return props.rows.filter((row) =>
      matchesIdsDataGridDateAndTimeFilter(row.values[dateTimeColumnKey], dateTimeFilter),
    );
  }, [props.rows, dateTimeColumnKey, dateTimeFilter]);

  const columns = useMemo(
    (): IdsDataGridColumn[] =>
      props.columns.map((col) => {
        if (col.key !== dateTimeColumnKey) return col;
        const filterActive = isIdsDataGridDateTimeFilterActive(dateTimeFilter);
        return {
          ...col,
          filterable: true,
          filterActive,
          dateTimeFilterState: filterActive ? dateTimeFilter : undefined,
          filterPanel: (
            <IdsDataGridTypeDateAndTimeFilterPanel
              state={dateTimeFilter}
              onStateChange={setDateTimeFilter}
              groupLabel={col.title}
            />
          ),
        };
      }),
    [props.columns, dateTimeColumnKey, dateTimeFilter],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
