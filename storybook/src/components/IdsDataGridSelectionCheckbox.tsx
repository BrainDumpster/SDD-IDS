import { Checkbox } from "./Checkbox";
import styles from "./IdsDataGridSelectionCheckbox.module.css";

export interface IdsDataGridSelectionCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * Datagrid row / select-all checkbox — delegates to IDS Checkbox (`components/ids/checkbox/design-spec.md`).
 */
export function IdsDataGridSelectionCheckbox({
  id,
  label,
  checked,
  indeterminate,
  onChange,
  onClick,
}: IdsDataGridSelectionCheckboxProps) {
  return (
    <div className={styles.host} onClick={onClick}>
      <Checkbox
        id={id}
        label={label}
        showLabel={false}
        density="datagrid"
        checked={checked}
        indeterminate={indeterminate}
        onChange={onChange}
      />
    </div>
  );
}
