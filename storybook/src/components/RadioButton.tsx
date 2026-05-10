import { RadioGroup } from "@base-ui-components/react/radio-group";
import { Radio } from "@base-ui-components/react/radio";
import styles from "./RadioButton.module.css";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  simulatedState?: "default" | "hover" | "focus-visible";
}

interface RadioButtonProps {
  id?: string;
  name: string;
  options: RadioOption[];
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
}

export function RadioButton({
  id,
  name,
  options,
  disabled = false,
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
        const isDisabled = disabled || Boolean(option.disabled);
        return (
          <div key={option.value} className={styles.field}>
            <label className={styles.wrapper} data-disabled={isDisabled || undefined}>
              <Radio.Root
                className={styles.root}
                value={option.value}
                disabled={isDisabled}
                aria-invalid={option.error || undefined}
                aria-describedby={assistiveId}
                data-error={option.error ? "true" : undefined}
                data-simulated-state={option.simulatedState}
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
                  isDisabled ? styles.assistiveTextDisabled : "",
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
