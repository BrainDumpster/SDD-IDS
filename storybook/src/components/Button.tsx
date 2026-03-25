import { Button as BaseButton } from "@base-ui-components/react/button";
import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <BaseButton
      className={() =>
        [
          styles.button,
          styles[variant],
          styles[size],
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
      <span className={loading ? styles.labelHidden : ""}>{children}</span>
    </BaseButton>
  );
}
