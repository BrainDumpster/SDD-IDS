import { useMemo, useState } from "react";
import { Checkbox } from "./Checkbox";
import { Icon } from "./Icon";
import styles from "./IdsDataGridTypeMultiselectFilterPanel.module.css";

export interface IdsDataGridTypeMultiselectFilterPanelProps {
  options: readonly string[];
  selectedValues: readonly string[];
  onSelectedValuesChange: (next: string[]) => void;
  /** Accessible name for the group (e.g. column title "Type"). */
  groupLabel: string;
  /** When false, hides search row — use for `Multi-select` (Figma `44360:179348`). Default true. */
  showSearch?: boolean;
}

function optionId(groupLabel: string, value: string, index: number): string {
  const slug = `${groupLabel}-${value}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `ids-datagrid-filter-${slug}`;
}

/**
 * Multiselect column filter — checkbox list.
 * - With search: Combobox-Multiselect (Figma `44360:147581`).
 * - Without search: Dropdown-MultiSelect (Figma `44360:179348`).
 * Tokens: components/ids/checkbox/design-spec.md.
 */
export function IdsDataGridTypeMultiselectFilterPanel({
  options,
  selectedValues,
  onSelectedValuesChange,
  groupLabel,
  showSearch = true,
}: IdsDataGridTypeMultiselectFilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, searchQuery, showSearch]);

  const selectedCount = useMemo(
    () => filteredOptions.reduce((n, o) => n + (selectedSet.has(o) ? 1 : 0), 0),
    [filteredOptions, selectedSet],
  );
  const allChecked = filteredOptions.length > 0 && selectedCount === filteredOptions.length;
  const indeterminate = selectedCount > 0 && selectedCount < filteredOptions.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      const next = new Set(selectedSet);
      for (const o of filteredOptions) next.add(o);
      onSelectedValuesChange([...next]);
    } else {
      const remove = new Set(filteredOptions);
      onSelectedValuesChange(selectedValues.filter((v) => !remove.has(v)));
    }
  };

  const clearAll = () => {
    const remove = new Set(filteredOptions);
    onSelectedValuesChange(selectedValues.filter((v) => !remove.has(v)));
  };

  const toggleOne = (value: string, checked: boolean) => {
    const next = new Set(selectedSet);
    if (checked) next.add(value);
    else next.delete(value);
    onSelectedValuesChange([...next]);
  };

  const clearAllDisabled = selectedCount === 0;

  return (
    <div className={styles.root} role="group" aria-label={`${groupLabel}: multiselect filter`}>
      {showSearch && (
        <div className={styles.searchRow}>
          <div className={styles.searchField}>
            <Icon shapeName="search-16" className={styles.searchIcon} />
            <div className={styles.searchInputWrap}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search"
                aria-label={`Search ${groupLabel} options`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.length > 0 ? (
                <button
                  type="button"
                  className={styles.searchClear}
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <Icon
                    shapeName="ctrl-close-16"
                    className={styles.searchClearIcon}
                    style={{ width: 12, height: 12 }}
                  />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className={styles.selectAllRow}>
        <div className={styles.selectAllLeft}>
          <Checkbox
            id={`ids-datagrid-filter-${groupLabel}-select-all`.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            label="Select All"
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={toggleAll}
          />
        </div>
        <button
          type="button"
          className={styles.clearAllBtn}
          onClick={clearAll}
          disabled={clearAllDisabled}
        >
          Clear All
        </button>
      </div>

      {/* Scrollable option list */}
      <ul className={styles.optionList} role="listbox" aria-label={`${groupLabel} options`}>
        {filteredOptions.map((opt, index) => (
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
