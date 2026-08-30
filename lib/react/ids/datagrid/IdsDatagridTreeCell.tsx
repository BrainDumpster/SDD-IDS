import React from "react";
import { IdsCheckbox, IdsCheckboxLabel } from "../checkbox";
import { IdsIcon } from "../icon";
import { IdsRadioButton, IdsRadioLabel } from "../radio-button";
import styles from "./IdsDatagrid.module.css";
import type { IdsDatagridTreeRowSelection } from "./IdsDatagridTree";

const TREE_LEVEL_INDENT_PX = 16;

export interface IdsDatagridTreeCellProps {
  rowId: string;
  label: string;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  treeRowSelection: IdsDatagridTreeRowSelection;
  treeShowRowIcon: boolean;
  iconSlug?: string;
  isCheckboxChecked?: boolean;
  onToggleExpand?: () => void;
  onCheckboxChange?: (checked: boolean) => void;
  onControlClick?: (event: React.MouseEvent) => void;
}

export function IdsDatagridTreeCell({
  rowId,
  label,
  level,
  hasChildren,
  isExpanded,
  treeRowSelection,
  treeShowRowIcon,
  iconSlug = "folder-closed",
  isCheckboxChecked = false,
  onToggleExpand,
  onCheckboxChange,
  onControlClick,
}: IdsDatagridTreeCellProps) {
  const indentPx = 16 + level * TREE_LEVEL_INDENT_PX;

  return (
    <div
      className={styles.treeCellContent}
      style={{ paddingLeft: `${indentPx}px` }}
      data-ids="ids-datagrid-tree-cell"
    >
      {hasChildren ? (
        <button
          type="button"
          className={styles.treeChevronButton}
          aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={isExpanded}
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpand?.();
          }}
        >
          <IdsIcon
            shape="chev-right-thick"
            className={`${styles.treeChevronIcon} ${isExpanded ? styles.treeChevronIconExpanded : ""}`}
            style={{ width: 12, height: 12 }}
          />
        </button>
      ) : (
        <span className={styles.treeChevronSpacer} aria-hidden />
      )}

      {treeRowSelection === "checkbox" ? (
        <div
          className={styles.selectionHost}
          onClick={(event) => {
            event.stopPropagation();
            onControlClick?.(event);
          }}
        >
          <IdsCheckbox
            id={`ids-dg-tree-${rowId}`}
            checked={isCheckboxChecked}
            onChange={(checked) => onCheckboxChange?.(checked)}
          >
            <IdsCheckboxLabel>
              <span className={styles.visuallyHidden}>Select {label}</span>
            </IdsCheckboxLabel>
          </IdsCheckbox>
        </div>
      ) : null}

      {treeRowSelection === "radio" ? (
        <div
          className={styles.selectionHost}
          onClick={(event) => {
            event.stopPropagation();
            onControlClick?.(event);
          }}
        >
          <IdsRadioButton value={rowId}>
            <IdsRadioLabel>
              <span className={styles.visuallyHidden}>Select {label}</span>
            </IdsRadioLabel>
          </IdsRadioButton>
        </div>
      ) : null}

      {treeShowRowIcon ? (
        <IdsIcon shape={iconSlug} className={styles.treeRowIcon} style={{ width: 16, height: 16 }} />
      ) : null}

      <span className={styles.cellText} title={label}>
        {label}
      </span>
    </div>
  );
}
