import { Slider as BaseSlider } from "@base-ui-components/react/slider";
import styles from "./Slider.module.css";

interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  value?: number;
  onValueChange?: (value: number) => void;
}

export function Slider({
  min = 0,
  max = 100,
  defaultValue,
  step = 1,
  disabled,
  label,
  value,
  onValueChange,
}: SliderProps) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <BaseSlider.Root
        className={styles.root}
        min={min}
        max={max}
        defaultValue={defaultValue}
        value={value}
        step={step}
        disabled={disabled}
        onValueChange={(val) => onValueChange?.(val as number)}
      >
        <BaseSlider.Control className={styles.control}>
          <BaseSlider.Track className={styles.track}>
            <BaseSlider.Indicator className={styles.indicator} />
            <BaseSlider.Thumb className={styles.thumb} />
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
    </div>
  );
}
