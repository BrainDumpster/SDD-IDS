/**
 * Synapse Tracker — standalone (no IDS counterpart).
 * Source: components/synapse/tracker/design-spec.md
 */
import React from "react";
import { cx } from "../../shared/utils/cx";
import styles from "./SynapseTracker.module.css";

export type SynapseTrackerStatus = "complete" | "active" | "pending";

export interface SynapseTrackerItem {
  label: string;
  status: SynapseTrackerStatus;
}

export interface SynapseTrackerProps {
  items: SynapseTrackerItem[];
  className?: string;
}

export function SynapseTracker({ items, className }: SynapseTrackerProps) {
  return (
    <div className={cx(styles.SynapseTracker, className)} data-ids="SynapseTracker">
      <div className={styles.SynapseTrackerBar} data-ids="SynapseTrackerBar" role="list">
        {items.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={cx(
              styles.SynapseTrackerSegment,
              item.status === "complete" && styles.SynapseTrackerSegmentComplete,
              item.status === "active" && styles.SynapseTrackerSegmentActive,
              item.status === "pending" && styles.SynapseTrackerSegmentPending,
            )}
            data-ids="SynapseTrackerSegment"
            data-status={item.status}
            role="listitem"
            aria-label={`${item.label}: ${item.status}`}
            title={`${item.label}: ${item.status}`}
          />
        ))}
      </div>
      <div className={styles.SynapseTrackerLabels} data-ids="SynapseTrackerLabels">
        {items.map((item, index) => (
          <span
            key={`${item.label}-label-${index}`}
            className={cx(
              styles.SynapseTrackerLabel,
              item.status === "complete" && styles.SynapseTrackerLabelComplete,
              item.status === "active" && styles.SynapseTrackerLabelActive,
              item.status === "pending" && styles.SynapseTrackerLabelPending,
            )}
            data-ids="SynapseTrackerLabel"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

SynapseTracker.displayName = "SynapseTracker";
