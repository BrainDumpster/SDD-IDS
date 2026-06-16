import type { CSSProperties } from "react";
import { Progress } from "@base-ui-components/react/progress";
import { Icon } from "./Icon";
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

const helperIconByState: Record<
  Exclude<ProgressBarProps["state"], "in-progress" | undefined>,
  string
> = {
  "completed-success": "status-ok-circ-solid",
  "completed-warning": "status-warn-tri-solid",
  "failed-error": "status-critical-square-solid",
};

function HelperStateIcon({
  state,
}: {
  state: Exclude<ProgressBarProps["state"], "in-progress" | undefined>;
}) {
  return (
    <Icon shapeName={helperIconByState[state]} variant="img" className={styles.helperIcon} />
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
  const isWithLabel = type === "with-label";
  const isInline = type === "inline";
  const showPercentage = !isIndeterminate;

  const track = (
    <Progress.Track className={`${styles.track} ${styles[thickness]}`}>
      <div className={styles.trackBg} aria-hidden="true" />
      <Progress.Indicator className={styles.indicator} />
    </Progress.Track>
  );

  const progressClip = isIndeterminate ? "0%" : `${clampedValue}%`;

  return (
    <Progress.Root
      className={`${styles.root} ${styles[state]} ${isIndeterminate ? styles.indeterminate : ""}`}
      value={isIndeterminate ? null : clampedValue}
      data-value-full={!isIndeterminate && clampedValue >= 100 ? "true" : undefined}
      aria-label={label ?? "Progress"}
      style={{ "--progress-clip": progressClip } as CSSProperties}
    >
      {isWithLabel ? (
        <div className={styles.labeledBlock}>
          <div className={styles.meta}>
            {label && <span className={styles.label}>{label}</span>}
            {showPercentage && (
              <Progress.Value className={styles.value}>
                {(_formatted, val) => `${Math.round(val ?? 0)}%`}
              </Progress.Value>
            )}
          </div>
          {track}
        </div>
      ) : isInline ? (
        <div className={styles.inlineRow}>
          {track}
          {showPercentage && (
            <Progress.Value className={styles.inlineValue}>
              {(_formatted, val) => `${Math.round(val ?? 0)}%`}
            </Progress.Value>
          )}
        </div>
      ) : (
        track
      )}
      {showHelperText && helperText && (
        <div className={styles.helperRow}>
          {state !== "in-progress" && <HelperStateIcon state={state} />}
          <p className={styles.helperText}>{helperText}</p>
        </div>
      )}
    </Progress.Root>
  );
}
