import type { ComponentProps } from "react";
import styles from "./Link.module.css";

interface LinkProps extends Omit<ComponentProps<"a">, "target" | "rel"> {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  disabled?: boolean;
}

export function Link({
  href,
  children,
  external,
  disabled,
  className,
  ...rest
}: LinkProps) {
  return (
    <a
      href={disabled ? undefined : href}
      className={`${styles.link} ${className || ""}`}
      data-disabled={disabled || undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...rest}
    >
      {children}
      {external && (
        <ExternalIcon />
      )}
    </a>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={styles.externalIcon}
      aria-hidden="true"
    >
      <path
        d="M9 6.5V9.5C9 10.0523 8.55228 10.5 8 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V4C1.5 3.44772 1.94772 3 2.5 3H5.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 1.5H10.5V4.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7L10.5 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
