/**
 * Synapse Recommendation Feedback — standalone (no IDS counterpart).
 * Source: components/synapse/recommendation-feedback/design-spec.md
 * Theme: components/synapse-theme.css
 *
 * Anatomy:
 *   SynapseRecommendationFeedback
 *     SynapseRecommendationFeedbackPrompt
 *     SynapseRecommendationFeedbackActions
 *       Copy / ThumbUp / ThumbDown
 *       SynapseRecommendationFeedbackTimestamp
 */
import React from "react";
import { SynapseIcon } from "../icon";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseRecommendationFeedback.module.css";

const SAMPLE_PROMPT = "What did you think about this recommendation?";
const SAMPLE_TIMESTAMP = "24 Sep, 11:30 PM";

export interface SynapseRecommendationFeedbackProps {
  prompt?: string;
  timestamp?: string;
  onCopy?: () => void;
  onThumbUp?: () => void;
  onThumbDown?: () => void;
  className?: string;
}

function ActionButton({
  label,
  iconShape,
  onClick,
}: {
  label: string;
  iconShape: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.SynapseRecommendationFeedbackAction}
      data-ids="SynapseRecommendationFeedbackAction"
      onClick={onClick}
      aria-label={label}
    >
      <SynapseIcon
        shape={iconShape}
        size={16}
        color="var(--color-icon-neutral)"
      />
    </button>
  );
}

export function SynapseRecommendationFeedback({
  prompt,
  timestamp = SAMPLE_TIMESTAMP,
  onCopy,
  onThumbUp,
  onThumbDown,
  className,
}: SynapseRecommendationFeedbackProps) {
  const resolvedPrompt = String(prompt ?? "").trim() || SAMPLE_PROMPT;
  const showTimestamp = timestamp !== "";

  return (
    <div
      className={cx(styles.SynapseRecommendationFeedback, className)}
      data-ids="SynapseRecommendationFeedback"
    >
      <p
        className={styles.SynapseRecommendationFeedbackPrompt}
        data-ids="SynapseRecommendationFeedbackPrompt"
      >
        {resolvedPrompt}
      </p>
      <div
        className={styles.SynapseRecommendationFeedbackActions}
        data-ids="SynapseRecommendationFeedbackActions"
      >
        <ActionButton
          label="Copy recommendation"
          iconShape="copy"
          onClick={onCopy}
        />
        <ActionButton
          label="Good recommendation"
          iconShape="thumb-up"
          onClick={onThumbUp}
        />
        <ActionButton
          label="Bad recommendation"
          iconShape="thumb-down"
          onClick={onThumbDown}
        />
        {showTimestamp ? (
          <time
            className={styles.SynapseRecommendationFeedbackTimestamp}
            data-ids="SynapseRecommendationFeedbackTimestamp"
            dateTime={timestamp}
          >
            {timestamp}
          </time>
        ) : null}
      </div>
    </div>
  );
}

SynapseRecommendationFeedback.displayName = "SynapseRecommendationFeedback";
