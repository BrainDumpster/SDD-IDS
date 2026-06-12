import type { ReactNode } from "react";

import {
  SYNAPSE_SUGGESTED_PROMPT_ICON_SHAPE,
  SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL,
} from "../spec-contracts/synapse-suggested-prompt.contract";
import { Icon } from "./Icon";
import styles from "./SuggestedPrompt.module.css";

export type SuggestedPromptListLayout = "vertical" | "wrap";

export interface SuggestedPromptProps {
  /** User-defined prompt label (Body 2). */
  label?: string;
  /** Figma `AI Gradient` variant axis. */
  aiGradient?: boolean;
  /** Figma `icon` variant — leading `arrow-right` 16px. */
  icon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Demo/testing only — do not block runtime interaction in production. */
  visualState?: "default" | "hover" | "focus";
}

export interface SuggestedPromptListProps {
  layout?: SuggestedPromptListLayout;
  children: ReactNode;
  className?: string;
}

export function SuggestedPrompt({
  label = SYNAPSE_SUGGESTED_PROMPT_SAMPLE_LABEL,
  aiGradient = false,
  icon = false,
  disabled = false,
  onClick,
  visualState,
}: SuggestedPromptProps) {
  return (
    <button
      type="button"
      className={styles.root}
      data-ai-gradient={aiGradient ? "true" : "false"}
      data-visual-state={visualState}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.inner}>
        {icon ? (
          <Icon shapeName={SYNAPSE_SUGGESTED_PROMPT_ICON_SHAPE} style={{ width: 16, height: 16 }} />
        ) : null}
        <span className={styles.label}>{label}</span>
      </span>
    </button>
  );
}

export function SuggestedPromptList({
  layout = "vertical",
  children,
  className,
}: SuggestedPromptListProps) {
  const listClass = layout === "wrap" ? styles.listWrap : styles.listVertical;
  return <div className={[listClass, className].filter(Boolean).join(" ")}>{children}</div>;
}
