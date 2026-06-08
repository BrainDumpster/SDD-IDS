import { Icon } from "./Icon";
import { IdsDataGridSelectionCheckbox } from "./IdsDataGridSelectionCheckbox";
import { IdsDataGridSelectionRadio } from "./IdsDataGridSelectionRadio";
import type { IdsDataGridTreeRowSelection } from "./IdsDataGridTree.utils";
import styles from "./IdsDataGrid.module.css";

const TREE_LEVEL_INDENT_PX = 16;

export interface IdsDataGridTreeCellProps {
  rowId: string;
  label: string;
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  treeRowSelection: IdsDataGridTreeRowSelection;
  treeShowRowIcon: boolean;
  iconSlug?: string;
  isCheckboxChecked?: boolean;
  onToggleExpand?: () => void;
  onCheckboxChange?: (checked: boolean) => void;
  onControlClick?: (event: React.MouseEvent) => void;
}

export function IdsDataGridTreeCell({
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
}: IdsDataGridTreeCellProps) {
  const indentPx = 16 + level * TREE_LEVEL_INDENT_PX;

  return (
    <div className={styles.treeCellContent} style={{ paddingLeft: `${indentPx}px` }}>
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
          <Icon
            shapeName="chev-right-thick"
            className={`${styles.treeChevronIcon} ${isExpanded ? styles.treeChevronIconExpanded : ""}`}
            style={{ width: 12, height: 12 }}
          />
        </button>
      ) : (
        <span className={styles.treeChevronSpacer} aria-hidden />
      )}

      {treeRowSelection === "checkbox" ? (
        <IdsDataGridSelectionCheckbox
          id={`ids-dg-tree-${rowId}`}
          label={`Select ${label}`}
          checked={isCheckboxChecked}
          onChange={(checked) => onCheckboxChange?.(checked)}
          onClick={(event) => {
            event.stopPropagation();
            onControlClick?.(event);
          }}
        />
      ) : null}

      {treeRowSelection === "radio" ? (
        <IdsDataGridSelectionRadio
          value={rowId}
          label={`Select ${label}`}
          onClick={(event) => {
            event.stopPropagation();
            onControlClick?.(event);
          }}
        />
      ) : null}

      {treeShowRowIcon ? (
        <Icon shapeName={iconSlug} className={styles.treeRowIcon} style={{ width: 16, height: 16 }} />
      ) : null}

      <span className={styles.cellText} title={label}>
        {label}
      </span>
    </div>
  );
}
