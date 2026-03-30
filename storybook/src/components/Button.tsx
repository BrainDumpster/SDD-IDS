import { Button as BaseButton } from "@base-ui-components/react/button";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Leading 16×16 icon (Figma: Icon=Yes, Icon Only=No). */
  icon?: ReactNode;
  /** Icon only — use with `icon` and an accessible `aria-label` (Figma: Icon Only=Yes; Large/Medium in set). */
  iconOnly?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconOnly = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const hasIcon = Boolean(icon);
  const showIconWithLabel = hasIcon && !loading;

  return (
    <BaseButton
      className={() =>
        [
          styles.button,
          styles[variant],
          styles[size],
          iconOnly ? styles.iconOnly : "",
          loading ? styles.loading : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")
      }
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {iconOnly ? (
        hasIcon && (
          <span
            className={[styles.iconSlot, loading ? styles.visuallyHidden : ""].filter(Boolean).join(" ")}
            aria-hidden="true"
          >
            {icon}
          </span>
        )
      ) : (
        <>
          {showIconWithLabel && (
            <span className={styles.iconSlot} aria-hidden="true">
              {icon}
            </span>
          )}
          <span className={loading ? styles.labelHidden : ""}>{children}</span>
        </>
      )}
    </BaseButton>
  );
}
