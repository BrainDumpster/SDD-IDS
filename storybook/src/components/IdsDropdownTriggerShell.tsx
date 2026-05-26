import type { CSSProperties, ReactNode } from "react";
import { Icon } from "./Icon";
import styles from "./IdsDropdownTriggerShell.module.css";

export type IdsDropdownTriggerSize = "small" | "large";

export interface IdsDropdownTriggerShellProps {
  size?: IdsDropdownTriggerSize;
  disabled?: boolean;
  error?: boolean;
  /** Demo-only: simulates Figma hover border (`var(--color-border-strong)`). */
  hover?: boolean;
  /** Demo-only: keyboard focus ring (`outline-offset: 5px`). */
  focusVisible?: boolean;
  left: ReactNode;
  /** Optional className for the field wrapper (e.g. for width overrides). */
  className?: string;
  /** Optional inline style for the field wrapper. */
  style?: CSSProperties;
}

export function IdsDropdownTriggerShell({
  size = "large",
  disabled = false,
  error = false,
  hover = false,
  focusVisible = false,
  left,
  className,
  style,
}: IdsDropdownTriggerShellProps) {
  return (
    <div
      className={className ? `${styles.field} ${className}` : styles.field}
      style={style}
      data-size={size === "small" ? "small" : undefined}
      data-disabled={disabled || undefined}
      data-error={error || undefined}
      data-hover={hover || undefined}
      data-focus={focusVisible || undefined}
    >
      <div className={styles.main}>{left}</div>
      <span className={styles.caretWrap} aria-hidden>
        <Icon shapeName="arrow-drop-tri-caret" style={{ width: 10, height: 10 }} />
      </span>
    </div>
  );
}
