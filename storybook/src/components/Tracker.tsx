import styles from "./Tracker.module.css";

type TrackerStatus = "complete" | "active" | "pending";

interface TrackerItem {
  label: string;
  status: TrackerStatus;
}

interface TrackerProps {
  items: TrackerItem[];
}

export function Tracker({ items }: TrackerProps) {
  return (
    <div className={styles.root}>
      <div className={styles.bar} role="list">
        {items.map((item, index) => (
          <div
            key={index}
            className={[styles.segment, styles[item.status]].join(" ")}
            role="listitem"
            aria-label={`${item.label}: ${item.status}`}
            title={`${item.label}: ${item.status}`}
          />
        ))}
      </div>
      <div className={styles.labels}>
        {items.map((item, index) => (
          <span
            key={index}
            className={[styles.label, styles[`label_${item.status}`]].join(" ")}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
