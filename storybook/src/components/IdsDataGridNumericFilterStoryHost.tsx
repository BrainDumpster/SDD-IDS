import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import {
  defaultIdsDataGridNumericFilterState,
  isIdsDataGridNumericFilterActive,
  matchesIdsDataGridNumericFilter,
  type IdsDataGridNumericFilterState,
} from "./IdsDataGridNumericFilter";
import {
  IdsDataGridTypeNumericFilterPanel,
  type NumericFilterUnitOption,
} from "./IdsDataGridTypeNumericFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const NUMERIC_COLUMN_KEY = "amount";

export interface IdsDataGridNumericFilterStoryHostProps extends IdsDataGridProps {
  numericColumnKey?: string;
  /** Optional unit options for the numeric filter dropdown (user-defined). */
  numericUnitOptions?: NumericFilterUnitOption[];
}

/**
 * Storybook host: wires a numeric column filter (Figma `44360:182265`) with live row filtering.
 */
export function IdsDataGridNumericFilterStoryHost({
  numericColumnKey = NUMERIC_COLUMN_KEY,
  numericUnitOptions,
  ...props
}: IdsDataGridNumericFilterStoryHostProps) {
  const [numericFilter, setNumericFilter] = useState<IdsDataGridNumericFilterState>(
    defaultIdsDataGridNumericFilterState,
  );

  const filteredRows = useMemo(() => {
    return props.rows.filter((row) =>
      matchesIdsDataGridNumericFilter(row.values[numericColumnKey], numericFilter),
    );
  }, [props.rows, numericColumnKey, numericFilter]);

  const columns = useMemo(
    (): IdsDataGridColumn[] =>
      props.columns.map((col) => {
        if (col.key !== numericColumnKey) return col;
        return {
          ...col,
          filterable: true,
          filterActive: isIdsDataGridNumericFilterActive(numericFilter),
          filterPanel: (
            <IdsDataGridTypeNumericFilterPanel
              state={numericFilter}
              onStateChange={setNumericFilter}
              groupLabel={col.title}
              unitOptions={numericUnitOptions}
            />
          ),
        };
      }),
    [props.columns, numericColumnKey, numericFilter],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
