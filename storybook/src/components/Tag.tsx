import styles from "./Tag.module.css";

type TagVariant = "default" | "info" | "success" | "warning" | "error";

interface TagProps {
  label: string;
  variant?: TagVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  disabled?: boolean;
}

export function Tag({
  label,
  variant = "default",
  dismissible = false,
  onDismiss,
  disabled,
}: TagProps) {
  return (
    <span
      className={`${styles.tag} ${styles[variant]}`}
      data-disabled={disabled || undefined}
    >
      <span className={styles.label}>{label}</span>
      {dismissible && (
        <button
          className={styles.dismiss}
          onClick={onDismiss}
          disabled={disabled}
          aria-label={`Remove ${label}`}
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
}
