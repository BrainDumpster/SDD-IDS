import { Progress } from "@base-ui-components/react/progress";
import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value?: number;
  label?: string;
  helperText?: string;
  type?: "with-label" | "inline" | "indeterminate";
  thickness?: "thin" | "medium" | "thick";
  state?:
    | "in-progress"
    | "completed-success"
    | "completed-warning"
    | "failed-error";
  showHelperText?: boolean;
}

function HelperStateIcon({
  state,
}: {
  state: "in-progress" | "completed-success" | "completed-warning" | "failed-error";
}) {
  if (state === "in-progress") {
    return null;
  }

  if (state === "completed-success") {
    // status-ok-circ-solid
    return (
      <svg className={styles.helperIcon} viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" className={styles.helperIconSuccess} />
        <path d="M4.3 8.2 6.9 10.7 11.8 5.6" className={styles.helperIconStroke} />
      </svg>
    );
  }

  if (state === "completed-warning") {
    // status-warn-tri-solid
    return (
      <svg className={styles.helperIcon} viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1.3 15 14.2H1z" className={styles.helperIconWarning} />
        <path d="M8 5.2v4.6M8 11.9h.01" className={styles.helperIconStroke} />
      </svg>
    );
  }

  // failed-error => status-critical-square-solid
  return (
    <svg className={styles.helperIcon} viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.5" y="1.5" width="13" height="13" rx="2" className={styles.helperIconError} />
      <path d="M5.1 5.1 10.9 10.9M10.9 5.1 5.1 10.9" className={styles.helperIconStroke} />
    </svg>
  );
}

export function ProgressBar({
  value = 0,
  label,
  helperText,
  type = "inline",
  thickness = "medium",
  state = "in-progress",
  showHelperText = false,
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const isIndeterminate = type === "indeterminate";
  const showMeta = type === "with-label";

  return (
    <Progress.Root
      className={`${styles.root} ${styles[state]} ${isIndeterminate ? styles.indeterminate : ""}`}
      value={isIndeterminate ? undefined : clampedValue}
      aria-label={label ?? "Progress"}
    >
      {showMeta && (
        <div className={styles.meta}>
          {label && <span className={styles.label}>{label}</span>}
          {!isIndeterminate && (
            <Progress.Value className={styles.value}>
              {(_formatted, val) => `${Math.round(val ?? 0)}%`}
            </Progress.Value>
          )}
        </div>
      )}
      <Progress.Track className={`${styles.track} ${styles[thickness]}`}>
        <Progress.Indicator className={styles.indicator} />
      </Progress.Track>
      {showHelperText && helperText && (
        <div className={styles.helperRow}>
          <HelperStateIcon state={state} />
          <p className={styles.helperText}>{helperText}</p>
        </div>
      )}
    </Progress.Root>
  );
}
