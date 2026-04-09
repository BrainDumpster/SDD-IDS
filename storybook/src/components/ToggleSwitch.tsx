import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import styles from "./ToggleSwitch.module.css";

export interface ToggleSwitchProps {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  value?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  onCheckedChange?: (checked: boolean) => void;
}

export function ToggleSwitch({
  label,
  checked,
  defaultChecked,
  disabled = false,
  id,
  name,
  value,
  ariaLabel,
  ariaDescribedBy,
  onCheckedChange,
}: ToggleSwitchProps) {
  return (
    <label className={styles.root}>
      <BaseSwitch.Root
        id={id}
        name={name}
        value={value}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={styles.switch}
        onCheckedChange={onCheckedChange}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
}
