import React from "react";
import { IdsCheckbox, IdsCheckboxLabel } from "../checkbox";
import { IdsIcon } from "../icon";
import type { IdsDatagridColumnDef } from "./IdsDatagridSlots";
import styles from "./IdsDatagridColumnVisibility.module.css";

export interface IdsDatagridColumnVisibilityPanelProps {
  hideableColumns: readonly IdsDatagridColumnDef[];
  hiddenColumnKeys: ReadonlySet<string>;
  onColumnVisibilityChange: (columnKey: string, visible: boolean) => void;
  validationMessage?: string | null;
}

export function IdsDatagridColumnVisibilityPanel({
  hideableColumns,
  hiddenColumnKeys,
  onColumnVisibilityChange,
  validationMessage,
}: IdsDatagridColumnVisibilityPanelProps) {
  return (
    <div
      className={styles.root}
      role="group"
      aria-label="Show or hide columns"
      data-column-visibility-panel=""
      data-ids="ids-datagrid-column-visibility"
    >
      <ul className={styles.optionList}>
        {hideableColumns.map((column) => {
          const visible = !hiddenColumnKeys.has(column.key);
          const inputId = `ids-datagrid-col-vis-${column.key}`;
          return (
            <li key={column.key} className={styles.optionItem}>
              <div className={styles.checkboxHost}>
                <IdsCheckbox
                  id={inputId}
                  checked={visible}
                  onChange={(checked) => onColumnVisibilityChange(column.key, checked)}
                >
                  <IdsCheckboxLabel>{column.title}</IdsCheckboxLabel>
                </IdsCheckbox>
              </div>
            </li>
          );
        })}
      </ul>
      {validationMessage ? (
        <div className={styles.validation} role="alert">
          <IdsIcon
            shape="status-critical-square-solid"
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
