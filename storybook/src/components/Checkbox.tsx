import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  id?: string;
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({
  id,
  label,
  checked,
  defaultChecked,
  indeterminate,
  disabled,
  error = false,
  helperText,
  name,
  value,
  onChange,
}: CheckboxProps) {
  const resolvedId = id ?? `checkbox-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const assistiveId = helperText ? `${resolvedId}-assistive` : undefined;

  return (
    <div className={styles.field}>
      <label className={styles.wrapper}>
        <BaseCheckbox.Root
          id={resolvedId}
          name={name}
          value={value}
          className={styles.root}
          checked={checked}
          defaultChecked={defaultChecked}
          indeterminate={indeterminate}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={assistiveId}
          data-error={error ? "true" : undefined}
          onCheckedChange={(next) => onChange?.(next === true)}
        >
          <BaseCheckbox.Indicator
            className={styles.indicator}
            data-indicator-type={indeterminate ? "minus" : "check"}
          />
        </BaseCheckbox.Root>
        <span className={[styles.label, error ? styles.labelError : ""].filter(Boolean).join(" ")}>{label}</span>
      </label>
      {helperText ? (
        <div
          id={assistiveId}
          className={[
            styles.assistiveText,
            error ? styles.assistiveTextError : "",
            disabled ? styles.assistiveTextDisabled : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
