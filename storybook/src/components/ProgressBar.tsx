import { Progress } from "@base-ui-components/react/progress";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md";
}

export function ProgressBar({
  value,
  label,
  showValue = false,
  size = "md",
}: ProgressBarProps) {
  return (
    <Progress.Root className={styles.root} value={value}>
      {(label || showValue) && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && (
            <Progress.Value className={styles.value}>
              {(_formatted, val) => `${Math.round(val ?? 0)}%`}
            </Progress.Value>
          )}
        </div>
      )}
      <Progress.Track className={`${styles.track} ${styles[size]}`}>
        <Progress.Indicator className={styles.indicator} />
      </Progress.Track>
    </Progress.Root>
  );
}
