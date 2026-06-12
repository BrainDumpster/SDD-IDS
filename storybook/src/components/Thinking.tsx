import { SynapseProgressBar } from "./SynapseProgressBar";
import { SynapseSpinner } from "./SynapseSpinner";
import {
  SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL,
  SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE,
  SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL,
} from "../spec-contracts/synapse-thinking.contract";
import styles from "./Thinking.module.css";

export type ThinkingVariant = "spinner" | "progressBar";

export interface ThinkingSpinnerProps {
  variant: "spinner";
  /** User-defined status copy (Body 1); shown inline beside the spinner. */
  label?: string;
}

export interface ThinkingProgressBarProps {
  variant: "progressBar";
  /** User-defined placeholder / status copy above the progress bar (Body 1). */
  label?: string;
  /** Dynamic completion percentage (`0`–`100`). */
  progress?: number;
}

export type ThinkingProps = ThinkingSpinnerProps | ThinkingProgressBarProps;

export function Thinking(props: ThinkingProps) {
  if (props.variant === "spinner") {
    const label = props.label ?? SYNAPSE_THINKING_SPINNER_SAMPLE_LABEL;

    return (
      <div
        className={[styles.root, styles.spinnerVariant].join(" ")}
        role="status"
        aria-live="polite"
        data-thinking-variant="spinner"
      >
        <div className={styles.spinnerRow}>
          <SynapseSpinner size="sm" label={label} labelVisibility="sr-only" />
          <p className={styles.statusLabel}>{label}</p>
        </div>
      </div>
    );
  }

  const label = props.label ?? SYNAPSE_THINKING_PROGRESS_SAMPLE_LABEL;
  const progress = props.progress ?? SYNAPSE_THINKING_PROGRESS_SAMPLE_VALUE;

  return (
    <div
      className={[styles.root, styles.progressVariant].join(" ")}
      role="status"
      aria-live="polite"
      data-thinking-variant="progressBar"
    >
      <p className={styles.statusLabel}>{label}</p>
      <div className={styles.progressTrackWrap}>
        <SynapseProgressBar
          type="inline"
          thickness="thin"
          state="in-progress"
          value={progress}
          label={label}
        />
      </div>
    </div>
  );
}
