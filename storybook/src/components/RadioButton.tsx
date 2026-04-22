import { RadioGroup } from "@base-ui-components/react/radio-group";
import { Radio } from "@base-ui-components/react/radio";
import styles from "./RadioButton.module.css";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

interface RadioButtonProps {
  id?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
}

export function RadioButton({
  id,
  name,
  options,
  value,
  defaultValue,
  onChange,
  orientation = "vertical",
}: RadioButtonProps) {
  return (
    <RadioGroup
      className={`${styles.group} ${orientation === "horizontal" ? styles.horizontal : styles.vertical}`}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
    >
      {options.map((option) => {
        const assistiveId = option.helperText ? `${id ?? name}-${option.value}-assistive` : undefined;
        return (
          <div key={option.value} className={styles.field}>
            <label className={styles.wrapper} data-disabled={option.disabled || undefined}>
              <Radio.Root
                className={styles.root}
                value={option.value}
                disabled={option.disabled}
                aria-invalid={option.error || undefined}
                aria-describedby={assistiveId}
                data-error={option.error ? "true" : undefined}
              >
                <Radio.Indicator className={styles.indicator} />
              </Radio.Root>
              <span className={[styles.label, option.error ? styles.labelError : ""].filter(Boolean).join(" ")}>
                {option.label}
              </span>
            </label>
            {option.helperText ? (
              <div
                id={assistiveId}
                className={[
                  styles.assistiveText,
                  option.error ? styles.assistiveTextError : "",
                  option.disabled ? styles.assistiveTextDisabled : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {option.helperText}
              </div>
            ) : null}
          </div>
        );
      })}
    </RadioGroup>
  );
}
