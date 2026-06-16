import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import {
  defaultIdsDataGridDateFilterState,
  isIdsDataGridDateFilterActive,
  matchesIdsDataGridDateFilter,
  type IdsDataGridDateFilterState,
} from "./IdsDataGridDateFilter";
import {
  defaultIdsDataGridDateTimeFilterState,
  isIdsDataGridDateTimeFilterActive,
  matchesIdsDataGridDateAndTimeFilter,
  type IdsDataGridDateTimeFilterState,
} from "./IdsDataGridDateAndTimeFilter";
import {
  defaultIdsDataGridNumericFilterState,
  isIdsDataGridNumericFilterActive,
  matchesIdsDataGridNumericFilter,
  type IdsDataGridNumericFilterState,
} from "./IdsDataGridNumericFilter";
import { IdsDataGridTypeComboboxSingleSelectFilterPanel } from "./IdsDataGridTypeComboboxSingleSelectFilterPanel";
import { IdsDataGridTypeDateAndTimeFilterPanel } from "./IdsDataGridTypeDateAndTimeFilterPanel";
import { IdsDataGridTypeDateFilterPanel } from "./IdsDataGridTypeDateFilterPanel";
import { IdsDataGridTypeMultiselectFilterPanel } from "./IdsDataGridTypeMultiselectFilterPanel";
import {
  IdsDataGridTypeNumericFilterPanel,
  type NumericFilterUnitOption,
} from "./IdsDataGridTypeNumericFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const TYPE_COLUMN_KEY = "type";
const STATUS_COLUMN_KEY = "status";
const OWNER_COLUMN_KEY = "owner";
const REGION_COLUMN_KEY = "region";
const AMOUNT_COLUMN_KEY = "amount";
const DUE_DATE_COLUMN_KEY = "dueDate";
const UPDATED_AT_COLUMN_KEY = "updatedAt";

function useDistinctValues(rows: IdsDataGridProps["rows"], key: string) {
  return useMemo(() => {
    const s = new Set<string>();
    for (const row of rows) {
      const v = row.values[key];
      if (v != null && String(v) !== "") s.add(String(v));
    }
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [rows, key]);
}

function useColumnKeys(columns: IdsDataGridColumn[]) {
  return useMemo(() => new Set(columns.map((c) => c.key)), [columns]);
}

export interface IdsDataGridDefaultStoryHostProps extends IdsDataGridProps {
  /** Optional unit options for the numeric filter column (`amount`). */
  numericUnitOptions?: NumericFilterUnitOption[];
}

/**
 * Storybook host for the spec-accurate grid: wires select/combobox filters plus optional
 * numeric (`44360:182265`), date (`37822:90838`), and date-time (`44360:181306`) columns
 * when those keys are present in `columns`.
 */
export function IdsDataGridDefaultStoryHost({
  numericUnitOptions,
  ...props
}: IdsDataGridDefaultStoryHostProps) {
  const columnKeys = useColumnKeys(props.columns);

  const typeOptions = useDistinctValues(props.rows, TYPE_COLUMN_KEY);
  const statusOptions = useDistinctValues(props.rows, STATUS_COLUMN_KEY);
  const ownerOptions = useDistinctValues(props.rows, OWNER_COLUMN_KEY);
  const regionOptions = useDistinctValues(props.rows, REGION_COLUMN_KEY);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => [...typeOptions]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => [...statusOptions]);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [numericFilter, setNumericFilter] = useState<IdsDataGridNumericFilterState>(
    defaultIdsDataGridNumericFilterState,
  );
  const [dateFilter, setDateFilter] = useState<IdsDataGridDateFilterState>(
    defaultIdsDataGridDateFilterState,
  );
  const [dateTimeFilter, setDateTimeFilter] = useState<IdsDataGridDateTimeFilterState>(
    defaultIdsDataGridDateTimeFilterState,
  );

  const filteredRows = useMemo(() => {
    if (columnKeys.has(TYPE_COLUMN_KEY) && selectedTypes.length === 0) return [];
    if (columnKeys.has(STATUS_COLUMN_KEY) && selectedStatuses.length === 0) return [];

    const allowTypes = new Set(selectedTypes);
    const allowStatuses = new Set(selectedStatuses);

    return props.rows.filter((row) => {
      if (
        columnKeys.has(TYPE_COLUMN_KEY) &&
        !allowTypes.has(String(row.values[TYPE_COLUMN_KEY] ?? ""))
      ) {
        return false;
      }
      if (
        columnKeys.has(STATUS_COLUMN_KEY) &&
        !allowStatuses.has(String(row.values[STATUS_COLUMN_KEY] ?? ""))
      ) {
        return false;
      }
      if (
        columnKeys.has(OWNER_COLUMN_KEY) &&
        selectedOwner != null &&
        String(row.values[OWNER_COLUMN_KEY] ?? "") !== selectedOwner
      ) {
        return false;
      }
      if (
        columnKeys.has(REGION_COLUMN_KEY) &&
        selectedRegion != null &&
        String(row.values[REGION_COLUMN_KEY] ?? "") !== selectedRegion
      ) {
        return false;
      }
      if (
        columnKeys.has(AMOUNT_COLUMN_KEY) &&
        !matchesIdsDataGridNumericFilter(row.values[AMOUNT_COLUMN_KEY], numericFilter)
      ) {
        return false;
      }
      if (
        columnKeys.has(DUE_DATE_COLUMN_KEY) &&
        !matchesIdsDataGridDateFilter(row.values[DUE_DATE_COLUMN_KEY], dateFilter)
      ) {
        return false;
      }
      if (
        columnKeys.has(UPDATED_AT_COLUMN_KEY) &&
        !matchesIdsDataGridDateAndTimeFilter(row.values[UPDATED_AT_COLUMN_KEY], dateTimeFilter)
      ) {
        return false;
      }
      return true;
    });
  }, [
    props.rows,
    columnKeys,
    selectedTypes,
    selectedStatuses,
    selectedOwner,
    selectedRegion,
    numericFilter,
    dateFilter,
    dateTimeFilter,
  ]);

  const columns = useMemo(
    (): IdsDataGridColumn[] =>
      props.columns.map((col) => {
        if (col.key === TYPE_COLUMN_KEY) {
          const filterActive =
            typeOptions.length > 0 &&
            (selectedTypes.length === 0 || selectedTypes.length < typeOptions.length);
          return {
            ...col,
            filterable: true,
            filterActive,
            filterPanel: (
              <IdsDataGridTypeMultiselectFilterPanel
                options={typeOptions}
                selectedValues={selectedTypes}
                onSelectedValuesChange={setSelectedTypes}
                groupLabel={col.title}
                showSearch={false}
              />
            ),
          };
        }
        if (col.key === STATUS_COLUMN_KEY) {
          const filterActive =
            statusOptions.length > 0 &&
            (selectedStatuses.length === 0 || selectedStatuses.length < statusOptions.length);
          return {
            ...col,
            filterable: true,
            filterActive,
            filterPanel: (
              <IdsDataGridTypeMultiselectFilterPanel
                options={statusOptions}
                selectedValues={selectedStatuses}
                onSelectedValuesChange={setSelectedStatuses}
                groupLabel={col.title}
              />
            ),
          };
        }
        if (col.key === OWNER_COLUMN_KEY) {
          return {
            ...col,
            filterable: true,
            filterActive: selectedOwner != null,
            filterPanel: (
              <IdsDataGridTypeComboboxSingleSelectFilterPanel
                options={ownerOptions}
                selectedValue={selectedOwner}
                onSelectedValueChange={setSelectedOwner}
                groupLabel={col.title}
                showSearch={false}
              />
            ),
          };
        }
        if (col.key === REGION_COLUMN_KEY) {
          return {
            ...col,
            filterable: true,
            filterActive: selectedRegion != null,
            filterPanel: (
              <IdsDataGridTypeComboboxSingleSelectFilterPanel
                options={regionOptions}
                selectedValue={selectedRegion}
                onSelectedValueChange={setSelectedRegion}
                groupLabel={col.title}
              />
            ),
          };
        }
        if (col.key === AMOUNT_COLUMN_KEY) {
          const filterActive = isIdsDataGridNumericFilterActive(numericFilter);
          return {
            ...col,
            filterable: true,
            filterActive,
            numericFilterState: filterActive ? numericFilter : undefined,
            filterPanel: (
              <IdsDataGridTypeNumericFilterPanel
                state={numericFilter}
                onStateChange={setNumericFilter}
                groupLabel={col.title}
                unitOptions={numericUnitOptions}
              />
            ),
          };
        }
        if (col.key === DUE_DATE_COLUMN_KEY) {
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
        }
        if (col.key === UPDATED_AT_COLUMN_KEY) {
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
        }
        return col;
      }),
    [
      props.columns,
      typeOptions,
      selectedTypes,
      statusOptions,
      selectedStatuses,
      ownerOptions,
      selectedOwner,
      regionOptions,
      selectedRegion,
      numericFilter,
      numericUnitOptions,
      dateFilter,
      dateTimeFilter,
    ],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
