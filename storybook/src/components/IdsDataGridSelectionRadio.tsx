import { Radio } from "@base-ui-components/react/radio";
import radioStyles from "./RadioButton.module.css";
import styles from "./IdsDataGridSelectionRadio.module.css";

export interface IdsDataGridSelectionRadioProps {
  value: string;
  /** Accessible name (visually hidden in the 48px selection column). */
  label: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * Datagrid row selection control — IDS Radio Button (`components/ids/radio-button/design-spec.mdx`).
 * Must be a descendant of `RadioGroup` (see `IdsDataGrid`).
 */
export function IdsDataGridSelectionRadio({
  value,
  label,
  disabled = false,
  onClick,
}: IdsDataGridSelectionRadioProps) {
  return (
    <div className={styles.host} onClick={onClick}>
      <label className={radioStyles.wrapper} data-disabled={disabled || undefined}>
        <Radio.Root value={value} disabled={disabled} className={radioStyles.root}>
          <Radio.Indicator className={radioStyles.indicator} />
        </Radio.Root>
        <span className={radioStyles.label} style={visuallyHidden}>
          {label}
        </span>
      </label>
    </div>
  );
}

const visuallyHidden: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
};
