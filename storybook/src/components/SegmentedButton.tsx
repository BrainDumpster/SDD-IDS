import { ToggleGroup } from "@base-ui-components/react/toggle-group";
import { Toggle } from "@base-ui-components/react/toggle";
import styles from "./SegmentedButton.module.css";

interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedButtonProps {
  options: SegmentedOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function SegmentedButton({
  options,
  value,
  onChange,
}: SegmentedButtonProps) {
  return (
    <ToggleGroup
      className={styles.root}
      value={value ? [value] : []}
      onValueChange={(newValue) => {
        if (newValue.length > 0 && onChange) {
          onChange(newValue[newValue.length - 1]);
        }
      }}
    >
      {options.map((option) => (
        <Toggle
          key={option.value}
          value={option.value}
          className={(state) =>
            [styles.button, state.pressed ? styles.selected : ""]
              .filter(Boolean)
              .join(" ")
          }
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
