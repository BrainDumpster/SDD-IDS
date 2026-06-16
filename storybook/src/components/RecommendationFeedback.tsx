import {
  SYNAPSE_RECOMMENDATION_FEEDBACK_COPY_ICON,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_PROMPT,
  SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_TIMESTAMP,
  SYNAPSE_RECOMMENDATION_FEEDBACK_THUMB_DOWN_ICON,
  SYNAPSE_RECOMMENDATION_FEEDBACK_THUMB_UP_ICON,
} from "../spec-contracts/synapse-recommendation-feedback.contract";
import { Icon } from "./Icon";
import styles from "./RecommendationFeedback.module.css";

export interface RecommendationFeedbackProps {
  /** User-defined prompt (Body 1). */
  prompt?: string;
  /** Dynamic timestamp label (Body 3). */
  timestamp?: string;
  onCopy?: () => void;
  onThumbUp?: () => void;
  onThumbDown?: () => void;
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
    <button type="button" className={styles.actionButton} onClick={onClick} aria-label={label}>
      <Icon
        shapeName={iconShape}
        color="var(--color-icon-neutral)"
        style={{ width: 16, height: 16 }}
      />
    </button>
  );
}

export function RecommendationFeedback({
  prompt = SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_PROMPT,
  timestamp = SYNAPSE_RECOMMENDATION_FEEDBACK_SAMPLE_TIMESTAMP,
  onCopy,
  onThumbUp,
  onThumbDown,
}: RecommendationFeedbackProps) {
  return (
    <div className={styles.root} data-component="recommendation-feedback">
      <p className={styles.prompt}>{prompt}</p>
      <div className={styles.actions}>
        <ActionButton
          label="Copy recommendation"
          iconShape={SYNAPSE_RECOMMENDATION_FEEDBACK_COPY_ICON}
          onClick={onCopy}
        />
        <ActionButton
          label="Good recommendation"
          iconShape={SYNAPSE_RECOMMENDATION_FEEDBACK_THUMB_UP_ICON}
          onClick={onThumbUp}
        />
        <ActionButton
          label="Bad recommendation"
          iconShape={SYNAPSE_RECOMMENDATION_FEEDBACK_THUMB_DOWN_ICON}
          onClick={onThumbDown}
        />
        <time className={styles.timestamp} dateTime={timestamp}>
          {timestamp}
        </time>
      </div>
    </div>
  );
}
