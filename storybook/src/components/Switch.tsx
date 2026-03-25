import { Switch as BaseSwitch } from "@base-ui-components/react/switch";
import styles from "./Switch.module.css";

interface SwitchProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Switch({
  label,
  checked,
  defaultChecked,
  disabled,
  onChange,
}: SwitchProps) {
  return (
    <label className={styles.wrapper}>
      <BaseSwitch.Root
        className={styles.root}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        onCheckedChange={onChange}
      >
        <BaseSwitch.Thumb className={styles.thumb} />
      </BaseSwitch.Root>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
