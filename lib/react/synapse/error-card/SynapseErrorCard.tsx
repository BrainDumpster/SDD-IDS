/**
 * Synapse Error Card — standalone (no IDS counterpart).
 * Source: components/synapse/errorcard/design-spec.md
 */
import React from "react";
import { SynapseIcon } from "../icon";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseErrorCard.module.css";

export interface SynapseErrorCardAction {
  label: string;
  onClick: () => void;
}

export interface SynapseErrorCardProps {
  title: string;
  message: string;
  action?: SynapseErrorCardAction;
  className?: string;
}

export function SynapseErrorCard({
  title,
  message,
  action,
  className,
}: SynapseErrorCardProps) {
  return (
    <div
      className={cx(styles.SynapseErrorCard, className)}
      data-ids="SynapseErrorCard"
      role="alert"
    >
      <div className={styles.SynapseErrorCardAccent} data-ids="SynapseErrorCardAccent" />
      <div className={styles.SynapseErrorCardBody} data-ids="SynapseErrorCardBody">
        <div
          className={styles.SynapseErrorCardIconWrapper}
          data-ids="SynapseErrorCardIconWrapper"
          aria-hidden="true"
        >
          <SynapseIcon
            shape="status-critical-square-solid"
            size={24}
            color="var(--alert-red-500)"
          />
        </div>
        <div className={styles.SynapseErrorCardContent} data-ids="SynapseErrorCardContent">
          <h3 className={styles.SynapseErrorCardTitle} data-ids="SynapseErrorCardTitle">
            {title}
          </h3>
          <p className={styles.SynapseErrorCardMessage} data-ids="SynapseErrorCardMessage">
            {message}
          </p>
          {action ? (
            <button
              type="button"
              className={styles.SynapseErrorCardAction}
              data-ids="SynapseErrorCardAction"
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

SynapseErrorCard.displayName = "SynapseErrorCard";
