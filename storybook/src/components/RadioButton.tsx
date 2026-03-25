import { RadioGroup } from "@base-ui-components/react/radio-group";
import { Radio } from "@base-ui-components/react/radio";
import styles from "./RadioButton.module.css";

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioButtonProps {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
}

export function RadioButton({
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
      {options.map((option) => (
        <label
          key={option.value}
          className={styles.wrapper}
          data-disabled={option.disabled || undefined}
        >
          <Radio.Root
            className={styles.root}
            value={option.value}
            disabled={option.disabled}
          >
            <Radio.Indicator className={styles.indicator} />
          </Radio.Root>
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </RadioGroup>
  );
}
