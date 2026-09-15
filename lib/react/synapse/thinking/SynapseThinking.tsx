/**
 * Synapse Thinking — standalone (no IDS counterpart).
 * Source: components/synapse/thinking/design-spec.md
 * Composes SynapseSpinner / SynapseProgressBar (IDS-fork façade).
 */
import React from "react";
import { SynapseProgressBar } from "../progress-bar";
import { SynapseSpinner } from "../spinner";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseThinking.module.css";

export type SynapseThinkingVariant = "spinner" | "progressBar";

export interface SynapseThinkingSpinnerProps {
  variant: "spinner";
  label?: string;
  className?: string;
}

export interface SynapseThinkingProgressBarProps {
  variant: "progressBar";
  label?: string;
  progress?: number;
  className?: string;
}

export type SynapseThinkingProps =
  | SynapseThinkingSpinnerProps
  | SynapseThinkingProgressBarProps;

const SPINNER_SAMPLE = "Collecting information";
const PROGRESS_SAMPLE = "Calculating...";
const PROGRESS_SAMPLE_VALUE = 10;

export function SynapseThinking(props: SynapseThinkingProps) {
  if (props.variant === "spinner") {
    const label = props.label ?? SPINNER_SAMPLE;
    return (
      <div
        className={cx(
          styles.SynapseThinking,
          styles.SynapseThinkingSpinnerVariant,
          props.className,
        )}
        data-ids="SynapseThinking"
        data-thinking-variant="spinner"
        role="status"
        aria-live="polite"
      >
        <div
          className={styles.SynapseThinkingSpinnerRow}
          data-ids="SynapseThinkingSpinnerRow"
        >
          <SynapseSpinner size="sm" label={label} labelVisibility="sr-only" />
          <p
            className={styles.SynapseThinkingStatusLabel}
            data-ids="SynapseThinkingStatusLabel"
          >
            {label}
          </p>
        </div>
      </div>
    );
  }

  const label = props.label ?? PROGRESS_SAMPLE;
  const progress = props.progress ?? PROGRESS_SAMPLE_VALUE;

  return (
    <div
      className={cx(
        styles.SynapseThinking,
        styles.SynapseThinkingProgressVariant,
        props.className,
      )}
      data-ids="SynapseThinking"
      data-thinking-variant="progressBar"
      role="status"
      aria-live="polite"
    >
      <p
        className={styles.SynapseThinkingStatusLabel}
        data-ids="SynapseThinkingStatusLabel"
      >
        {label}
      </p>
      <div
        className={styles.SynapseThinkingProgressTrackWrap}
        data-ids="SynapseThinkingProgressTrackWrap"
      >
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

SynapseThinking.displayName = "SynapseThinking";
