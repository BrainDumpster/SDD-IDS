import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import styles from "./Switch.module.css";

interface SwitchProps {
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  showOnOffOption?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({
  label = "Label:",
  showLabel = true,
  required = true,
  showOnOffOption = true,
  checked,
  defaultChecked,
  disabled,
  onChange,
}: SwitchProps) {
  const resolvedChecked = checked ?? defaultChecked ?? false;

  return (
    <label className={styles.wrapper}>
      {showLabel ? (
        <span className={styles.formLabel}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </span>
      ) : null}
      <BaseSwitch.Root
        className={styles.root}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={onChange}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      {showOnOffOption ? (
        <span className={disabled ? styles.stateTextDisabled : styles.stateText}>
          {resolvedChecked ? "On" : "Off"}
        </span>
      ) : null}
    </label>
  );
}
