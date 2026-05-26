import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import { IdsDataGridTypeMultiselectFilterPanel } from "./IdsDataGridTypeMultiselectFilterPanel";
import { IdsDataGridTypeComboboxSingleSelectFilterPanel } from "./IdsDataGridTypeComboboxSingleSelectFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const TYPE_COLUMN_KEY = "type";
const STATUS_COLUMN_KEY = "status";
const OWNER_COLUMN_KEY = "owner";
const REGION_COLUMN_KEY = "region";

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

/**
 * Default Storybook sample demonstrating all four filter types:
 *   - Type: Dropdown-MultiSelect (no search) — Figma `44360:179348`
 *   - Status: Combobox-Multiselect (with search) — Figma `44360:147581`
 *   - Owner: Dropdown-SingleSelect (no search) — Figma `44360:179201`
 *   - Region: Combobox-SingleSelect (with search) — Figma `44360:179074`
 */
export function IdsDataGridDefaultStoryHost(props: IdsDataGridProps) {
  const typeOptions = useDistinctValues(props.rows, TYPE_COLUMN_KEY);
  const statusOptions = useDistinctValues(props.rows, STATUS_COLUMN_KEY);
  const ownerOptions = useDistinctValues(props.rows, OWNER_COLUMN_KEY);
  const regionOptions = useDistinctValues(props.rows, REGION_COLUMN_KEY);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => [...typeOptions]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => [...statusOptions]);
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredRows = useMemo(() => {
    if (selectedTypes.length === 0 && selectedStatuses.length === 0) return [];
    const allowTypes = new Set(selectedTypes);
    const allowStatuses = new Set(selectedStatuses);
    return props.rows.filter((row) => {
      const typeMatch =
        selectedTypes.length === 0 || allowTypes.has(String(row.values[TYPE_COLUMN_KEY] ?? ""));
      const statusMatch =
        selectedStatuses.length === 0 ||
        allowStatuses.has(String(row.values[STATUS_COLUMN_KEY] ?? ""));
      const ownerMatch =
        selectedOwner == null ||
        String(row.values[OWNER_COLUMN_KEY] ?? "") === selectedOwner;
      const regionMatch =
        selectedRegion == null ||
        String(row.values[REGION_COLUMN_KEY] ?? "") === selectedRegion;
      return typeMatch && statusMatch && ownerMatch && regionMatch;
    });
  }, [props.rows, selectedTypes, selectedStatuses, selectedOwner, selectedRegion]);

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
    ],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
