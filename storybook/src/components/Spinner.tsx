import styles from "./Spinner.module.css";

type SpinnerSize = "sm" | "md" | "lg";
type SpinnerLabelVisibility = "sr-only" | "inline" | "below";

interface SpinnerProps {
  size?: SpinnerSize;
  label?: string;
  labelVisibility?: SpinnerLabelVisibility;
}

export function Spinner({
  size = "md",
  label = "Loading...",
  labelVisibility = "sr-only",
}: SpinnerProps) {
  const rootClassName = [
    styles.root,
    labelVisibility === "inline" ? styles.layoutInline : styles.layoutStack,
  ].join(" ");

  const visualClassName = [styles.spinner, styles[size]].join(" ");

  const visibleLabel =
    labelVisibility === "sr-only" ? null : (
      <span className={labelVisibility === "inline" ? styles.labelInline : styles.labelBelow}>
        {label}
      </span>
    );

  return (
    <span className={rootClassName} role="status" aria-live="polite" aria-label={label}>
      <span className={visualClassName} aria-hidden="true" />
      {visibleLabel}
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
