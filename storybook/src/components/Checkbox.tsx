import { Checkbox as BaseCheckbox } from "@base-ui-components/react/checkbox";
import { Icon } from "./Icon";
import styles from "./Checkbox.module.css";

interface CheckboxProps {
  id?: string;
  label: string;
  /** When false, label is sr-only (Figma “no label” column still needs a name for a11y). */
  showLabel?: boolean;
  /** Static demo only: draw the focus ring (e.g. Storybook matrix “Focus” row). */
  simulateFocusVisible?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Figma "partial" — maps to Base UI `indeterminate`. */
  partial?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  name?: string;
  value?: string;
  onChange?: (checked: boolean) => void;
  /** `datagrid`: 16×16 control only, no 44px label row height (selection column). */
  density?: "default" | "datagrid";
}

export function Checkbox({
  id,
  label,
  showLabel = true,
  simulateFocusVisible = false,
  checked,
  defaultChecked,
  partial,
  indeterminate,
  disabled,
  error = false,
  helperText,
  name,
  value,
  onChange,
  density = "default",
}: CheckboxProps) {
  const isPartial = partial ?? indeterminate;
  const resolvedId = id ?? `checkbox-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const assistiveId = helperText ? `${resolvedId}-assistive` : undefined;

  return (
    <div className={styles.field} data-density={density}>
      <label className={styles.wrapper}>
        <BaseCheckbox.Root
          id={resolvedId}
          name={name}
          value={value}
          className={[styles.root, simulateFocusVisible ? styles.rootSimulatedFocus : ""].filter(Boolean).join(" ")}
          checked={checked}
          defaultChecked={defaultChecked}
          indeterminate={isPartial}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={assistiveId}
          data-error={error ? "true" : undefined}
          onCheckedChange={(next) => onChange?.(next === true)}
        >
          <BaseCheckbox.Indicator
            className={styles.indicator}
            data-indicator-type={isPartial ? "minus" : "check"}
          />
        </BaseCheckbox.Root>
        <span className={showLabel ? styles.label : styles.visuallyHidden}>{label}</span>
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
          {error && !disabled ? (
            <Icon shapeName="status-critical-square-solid" variant="img" className={styles.errorIcon} />
          ) : null}
          {helperText}
        </div>
      ) : null}
    </div>
  );
}
