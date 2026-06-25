import { RadioGroup } from "@base-ui-components/react/radio-group";
import { Radio } from "@base-ui-components/react/radio";
import { Icon } from "./Icon";
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
        const isDisabled = disabled || Boolean(option.disabled);
        const optionId = `${id ?? name}-${option.value}`;
        const assistiveId = option.helperText ? `${optionId}-assistive` : undefined;

        return (
          <div key={option.value} className={styles.field}>
            <label className={styles.wrapper} data-disabled={isDisabled || undefined}>
              <Radio.Root
                className={styles.root}
                value={option.value}
                disabled={isDisabled}
                data-simulated-state={option.simulatedState}
                data-error={option.error ? "true" : undefined}
                aria-invalid={option.error || undefined}
                aria-describedby={assistiveId}
              >
                <Radio.Indicator className={styles.indicator} />
              </Radio.Root>
              <span className={styles.label}>{option.label}</span>
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
                {option.error && !isDisabled ? (
                  <Icon shapeName="status-critical-square-solid" variant="img" className={styles.errorIcon} />
                ) : null}
                {option.helperText}
              </div>
            ) : null}
          </div>
        );
      })}
    </RadioGroup>
  );
}
