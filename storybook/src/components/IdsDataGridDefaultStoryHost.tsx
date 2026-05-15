import { useMemo, useState, type ComponentProps } from "react";
import { IdsDataGrid, type IdsDataGridColumn } from "./IdsDataGrid";
import { IdsDataGridTypeMultiselectFilterPanel } from "./IdsDataGridTypeMultiselectFilterPanel";

type IdsDataGridProps = ComponentProps<typeof IdsDataGrid>;

const TYPE_COLUMN_KEY = "type";

/**
 * Default Storybook sample: Name search filter + Type multiselect (checkbox) filter with live row filtering.
 */
export function IdsDataGridDefaultStoryHost(props: IdsDataGridProps) {
  const typeOptions = useMemo(() => {
    const s = new Set<string>();
    for (const row of props.rows) {
      const v = row.values[TYPE_COLUMN_KEY];
      if (v != null && String(v) !== "") s.add(String(v));
    }
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [props.rows]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => [...typeOptions]);

  const filteredRows = useMemo(() => {
    if (selectedTypes.length === 0) return [];
    const allow = new Set(selectedTypes);
    return props.rows.filter((row) => allow.has(String(row.values[TYPE_COLUMN_KEY] ?? "")));
  }, [props.rows, selectedTypes]);

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
              />
            ),
          };
        }
        return col;
      }),
    [props.columns, typeOptions, selectedTypes],
  );

  return <IdsDataGrid {...props} columns={columns} rows={filteredRows} />;
}
