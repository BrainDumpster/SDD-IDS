import { useMemo, useState } from "react";
import { Icon } from "./Icon";
import styles from "./IdsDataGridTypeComboboxSingleSelectFilterPanel.module.css";

export interface IdsDataGridTypeComboboxSingleSelectFilterPanelProps {
  options: readonly string[];
  selectedValue: string | null;
  onSelectedValueChange: (next: string | null) => void;
  groupLabel: string;
  /** When false, hides search row — use for `Single-select` (Figma `44360:179201`). Default true. */
  showSearch?: boolean;
}

/**
 * Single-select column filter — plain-text option list.
 * - With search: Combobox-SingleSelect (Figma `44360:179074`).
 * - Without search: Dropdown-SingleSelect (Figma `44360:179201`).
 * Tokens: components/ids/dropdown-single-select/design-spec.mdx.
 */
export function IdsDataGridTypeComboboxSingleSelectFilterPanel({
  options,
  selectedValue,
  onSelectedValueChange,
  groupLabel,
  showSearch = true,
}: IdsDataGridTypeComboboxSingleSelectFilterPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, searchQuery, showSearch]);

  return (
    <div
      className={styles.root}
      role="group"
      aria-label={`${groupLabel}: single-select filter`}
    >
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
            </div>
          </div>
        </div>
      )}

      <ul
        className={styles.optionList}
        role="listbox"
        aria-label={`${groupLabel} options`}
      >
        {filteredOptions.map((opt) => {
          const isSelected = opt === selectedValue;
          return (
            <li
              key={opt}
              role="option"
              aria-selected={isSelected}
              className={`${styles.optionItem} ${isSelected ? styles.optionItemSelected : ""}`}
              onClick={() => onSelectedValueChange(opt)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectedValueChange(opt);
                }
              }}
              tabIndex={0}
            >
              <span className={styles.optionLabel}>{opt}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
