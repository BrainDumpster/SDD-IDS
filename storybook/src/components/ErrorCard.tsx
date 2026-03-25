import type { ReactNode } from "react";
import styles from "./ErrorCard.module.css";

interface ErrorCardProps {
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function ErrorCard({ title, message, action }: ErrorCardProps) {
  return (
    <div className={styles.card} role="alert">
      <div className={styles.accent} />
      <div className={styles.body}>
        <div className={styles.iconWrapper}>
          <ErrorIcon />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.message}>{message}</p>
          {action && (
            <button
              type="button"
              className={styles.action}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 8V12M12 16H12.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
