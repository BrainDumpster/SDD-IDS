import { useMemo } from "react";
import { Checkbox } from "./Checkbox";
import styles from "./IdsDataGridTypeMultiselectFilterPanel.module.css";

export interface IdsDataGridTypeMultiselectFilterPanelProps {
  options: readonly string[];
  selectedValues: readonly string[];
  onSelectedValuesChange: (next: string[]) => void;
  /** Accessible name for the group (e.g. column title "Type"). */
  groupLabel: string;
}

function optionId(groupLabel: string, value: string, index: number): string {
  const slug = `${groupLabel}-${value}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ids-datagrid-filter-${slug}`;
}

/**
 * Multiselect column filter using Storybook `Checkbox` (implements `components/ids/checkbox/design-spec.mdx`).
 */
export function IdsDataGridTypeMultiselectFilterPanel({
  options,
  selectedValues,
  onSelectedValuesChange,
  groupLabel,
}: IdsDataGridTypeMultiselectFilterPanelProps) {
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
  const selectedCount = useMemo(
    () => options.reduce((n, o) => n + (selectedSet.has(o) ? 1 : 0), 0),
    [options, selectedSet],
  );
  const allChecked = options.length > 0 && selectedCount === options.length;
  const indeterminate = selectedCount > 0 && selectedCount < options.length;

  const toggleAll = (checked: boolean) => {
    onSelectedValuesChange(checked ? [...options] : []);
  };

  const toggleOne = (value: string, checked: boolean) => {
    const next = new Set(selectedSet);
    if (checked) next.add(value);
    else next.delete(value);
    onSelectedValuesChange([...next]);
  };

  return (
    <div className={styles.root} role="group" aria-label={`${groupLabel}: multiselect filter`}>
      <div className={styles.selectAllRow}>
        <Checkbox
          id={`ids-datagrid-filter-${groupLabel}-select-all`.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
          label="Select all"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={toggleAll}
        />
      </div>
      <ul className={styles.optionList}>
        {options.map((opt, index) => (
          <li key={opt} className={styles.optionItem}>
            <Checkbox
              id={optionId(groupLabel, opt, index)}
              label={opt}
              name="ids-datagrid-type-filter"
              value={opt}
              checked={selectedSet.has(opt)}
              onChange={(c) => toggleOne(opt, c)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
