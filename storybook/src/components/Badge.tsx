import styles from "./Badge.module.css";

type BadgeType = "default" | "critical" | "warning" | "disabled" | "success";

interface BadgeProps {
  value: string | number;
  type?: BadgeType;
  ariaLabel?: string;
}

export function Badge({
  value,
  type = "default",
  ariaLabel,
}: BadgeProps) {
  const valueText = String(value);
  const digitCount = valueText.length;
  const sizeClass =
    digitCount <= 1
      ? styles.singleDigit
      : digitCount === 2
        ? styles.twoDigits
        : styles.threePlusDigits;

  return (
    <span
      className={[styles.badge, styles[type], sizeClass].join(" ")}
      aria-label={ariaLabel}
    >
      <span className={styles.content}>{valueText}</span>
    </span>
  );
}
