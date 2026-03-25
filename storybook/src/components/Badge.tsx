import type { ReactNode } from "react";
import styles from "./Badge.module.css";

interface BadgeProps {
  count?: number;
  dot?: boolean;
  children: ReactNode;
}

export function Badge({ count, dot, children }: BadgeProps) {
  const showBadge = dot || (count != null && count > 0);
  const displayCount = count != null && count > 99 ? "99+" : count;

  return (
    <span className={styles.wrapper}>
      {children}
      {showBadge && (
        <span className={`${styles.badge} ${dot ? styles.dot : styles.count}`}>
          {!dot && displayCount}
        </span>
      )}
    </span>
  );
}
