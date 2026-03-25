import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  onChange,
}: CheckboxProps) {
  return (
    <label className={styles.wrapper}>
      <BaseCheckbox.Root
        className={styles.root}
        checked={checked}
        defaultChecked={defaultChecked}
        indeterminate={indeterminate}
        disabled={disabled}
        onCheckedChange={onChange}
      >
        <BaseCheckbox.Indicator className={styles.indicator}>
          {indeterminate ? (
            <MinusIcon />
          ) : (
            <CheckIcon />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      <span className={styles.label}>{label}</span>
    </label>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2.5 6H9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
