import { Checkbox } from "./Checkbox";
import { Icon } from "./Icon";
import type { IdsDataGridColumn } from "./IdsDataGrid";
import styles from "./IdsDataGridColumnVisibilityPanel.module.css";

export interface IdsDataGridColumnVisibilityPanelProps {
  /** Only `columnHideable` columns (caller filters). */
  hideableColumns: readonly IdsDataGridColumn[];
  hiddenColumnKeys: ReadonlySet<string>;
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void;
  validationMessage?: string | null;
}

/**
 * Settings (gear) popup body — column show/hide checkboxes.
 * Checkbox + label per `components/ids/checkbox/design-spec.md` (16×16 control, 8px label gap, Body 2 label).
 */
export function IdsDataGridColumnVisibilityPanel({
  hideableColumns,
  hiddenColumnKeys,
  onColumnVisibilityChange,
  validationMessage,
}: IdsDataGridColumnVisibilityPanelProps) {
  return (
    <div
      className={styles.root}
      role="group"
      aria-label="Show or hide columns"
      data-column-visibility-panel=""
    >
      <ul className={styles.optionList}>
        {hideableColumns.map((column) => {
          const visible = !hiddenColumnKeys.has(column.key);
          const inputId = `ids-datagrid-col-vis-${column.key}`;
          return (
            <li key={column.key} className={styles.optionItem}>
              <div className={styles.checkboxHost}>
                <Checkbox
                  id={inputId}
                  label={column.title}
                  checked={visible}
                  onChange={(checked) => onColumnVisibilityChange(column.key, checked)}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {validationMessage ? (
        <div className={styles.validation} role="alert">
          <Icon
            shapeName="status-critical-square-solid"
            variant="img"
            className={styles.validationIcon}
            style={{ width: 16, height: 16 }}
          />
          <span className={styles.validationText}>{validationMessage}</span>
        </div>
      ) : null}
    </div>
  );
}
