import type { ReactNode } from "react";
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
}

export function IdsDropdownTriggerShell({
  size = "large",
  disabled = false,
  error = false,
  hover = false,
  focusVisible = false,
  left,
}: IdsDropdownTriggerShellProps) {
  return (
    <div
      className={styles.field}
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
