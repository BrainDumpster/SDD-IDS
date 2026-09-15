/**
 * Synapse Empty State — standalone (no IDS counterpart).
 * Source: components/synapse/emptystate/design-spec.md
 */
import React, { type ReactNode } from "react";
import { cx } from "../../shared/utils/cx";
import { SynapseButton, SynapseButtonLabel } from "../button";
import styles from "./SynapseEmptyState.module.css";

export interface SynapseEmptyStateAction {
  label: string;
  onClick: () => void;
}

export interface SynapseEmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: SynapseEmptyStateAction;
  className?: string;
}

export function SynapseEmptyState({
  icon,
  title,
  description,
  action,
  className,
}: SynapseEmptyStateProps) {
  return (
    <div
      className={cx(styles.SynapseEmptyState, className)}
      data-ids="SynapseEmptyState"
    >
      {icon ? (
        <div className={styles.SynapseEmptyStateIcon} data-ids="SynapseEmptyStateIcon">
          {icon}
        </div>
      ) : null}
      <h3 className={styles.SynapseEmptyStateTitle} data-ids="SynapseEmptyStateTitle">
        {title}
      </h3>
      <p
        className={styles.SynapseEmptyStateDescription}
        data-ids="SynapseEmptyStateDescription"
      >
        {description}
      </p>
      {action ? (
        <div className={styles.SynapseEmptyStateAction} data-ids="SynapseEmptyStateAction">
          <SynapseButton type="button" variant="primary" size="medium" onClick={action.onClick}>
            <SynapseButtonLabel>{action.label}</SynapseButtonLabel>
          </SynapseButton>
        </div>
      ) : null}
    </div>
  );
}

SynapseEmptyState.displayName = "SynapseEmptyState";
