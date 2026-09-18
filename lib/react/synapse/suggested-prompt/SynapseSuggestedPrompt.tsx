/**
 * Synapse Suggested Prompt — standalone (no IDS counterpart).
 * Source: components/synapse/suggested-prompt/design-spec.md
 * Theme: components/synapse-theme.css
 *
 * Anatomy:
 *   SynapseSuggestedPrompt (button)
 *     SynapseSuggestedPromptInner
 *       SynapseSuggestedPromptIcon?
 *       SynapseSuggestedPromptLabel
 */
import React from "react";
import { SynapseIcon } from "../icon";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseSuggestedPrompt.module.css";

const SAMPLE_LABEL = "Summarize the health of my environment";
const ICON_SHAPE = "arrow-right";

export type SynapseSuggestedPromptListLayout = "vertical" | "wrap";
export type SynapseSuggestedPromptVisualState = "default" | "hover" | "focus";

export interface SynapseSuggestedPromptProps {
  /** User-defined prompt text. Empty → do not render. */
  label?: string;
  /** Figma `AI Gradient` variant. Unknown/undefined → false. */
  aiGradient?: boolean;
  /** Leading `arrow-right` 16px when true. */
  icon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Optional alias for chip activate — payload is the label. */
  onSelect?: (label: string) => void;
  className?: string;
  /** Demo/testing only. */
  visualState?: SynapseSuggestedPromptVisualState;
}

export interface SynapseSuggestedPromptListProps {
  layout?: SynapseSuggestedPromptListLayout | string;
  children?: React.ReactNode;
  className?: string;
}

function resolveLayout(value: unknown): SynapseSuggestedPromptListLayout {
  return value === "wrap" ? "wrap" : "vertical";
}

export function SynapseSuggestedPrompt({
  label = SAMPLE_LABEL,
  aiGradient = false,
  icon = false,
  disabled = false,
  onClick,
  onSelect,
  className,
  visualState,
}: SynapseSuggestedPromptProps) {
  const resolved = String(label ?? "").trim();
  if (!resolved) return null;

  return (
    <button
      type="button"
      className={cx(styles.SynapseSuggestedPrompt, className)}
      data-ids="SynapseSuggestedPrompt"
      data-ai-gradient={aiGradient ? "true" : "false"}
      data-visual-state={visualState}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onClick?.();
        onSelect?.(resolved);
      }}
    >
      <span
        className={styles.SynapseSuggestedPromptInner}
        data-ids="SynapseSuggestedPromptInner"
      >
        {icon ? (
          <span
            className={styles.SynapseSuggestedPromptIcon}
            data-ids="SynapseSuggestedPromptIcon"
            aria-hidden="true"
          >
            <SynapseIcon shape={ICON_SHAPE} size={16} />
          </span>
        ) : null}
        <span
          className={styles.SynapseSuggestedPromptLabel}
          data-ids="SynapseSuggestedPromptLabel"
        >
          {resolved}
        </span>
      </span>
    </button>
  );
}

SynapseSuggestedPrompt.displayName = "SynapseSuggestedPrompt";

export function SynapseSuggestedPromptList({
  layout: layoutProp = "vertical",
  children,
  className,
}: SynapseSuggestedPromptListProps) {
  const layout = resolveLayout(layoutProp);
  return (
    <div
      className={cx(
        layout === "wrap"
          ? styles.SynapseSuggestedPromptListWrap
          : styles.SynapseSuggestedPromptList,
        className,
      )}
      data-ids="SynapseSuggestedPromptList"
      data-layout={layout}
    >
      {children}
    </div>
  );
}

SynapseSuggestedPromptList.displayName = "SynapseSuggestedPromptList";
