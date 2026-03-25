import { useState } from "react";
import styles from "./GlobalAlert.module.css";

type AlertVariant = "info" | "success" | "warning" | "error";

interface GlobalAlertProps {
  variant?: AlertVariant;
  title: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function GlobalAlert({
  variant = "info",
  title,
  description,
  dismissible = false,
  onDismiss,
}: GlobalAlertProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={`${styles.banner} ${styles[variant]}`}
      role="alert"
    >
      <div className={styles.inner}>
        <span className={styles.icon}>
          <VariantIcon variant={variant} />
        </span>
        <div className={styles.text}>
          <span className={styles.title}>{title}</span>
          {description && (
            <span className={styles.description}>{description}</span>
          )}
        </div>
        {dismissible && (
          <button
            className={styles.close}
            onClick={handleDismiss}
            aria-label="Dismiss alert"
            type="button"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function VariantIcon({ variant }: { variant: AlertVariant }) {
  const size = 20;
  switch (variant) {
    case "info":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="6.5" r="1" fill="currentColor" />
        </svg>
      );
    case "success":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "warning":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path d="M10 2L19 18H1L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
          <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="10" cy="15" r="1" fill="currentColor" />
        </svg>
      );
    case "error":
      return (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M7 7L13 13M13 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M12 4L4 12M4 4L12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
