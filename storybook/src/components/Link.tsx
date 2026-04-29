import type { ComponentProps, ReactNode } from "react";
import styles from "./Link.module.css";

type LinkType = "standalone" | "inline" | "dark-bg";
type LinkDemoState = "default" | "hover" | "press" | "focus-visible";

interface LinkProps extends Omit<ComponentProps<"a">, "target" | "rel"> {
  href: string;
  children: ReactNode;
  type?: LinkType;
  showExternalLinkIcon?: boolean;
  demoState?: LinkDemoState;
  disabled?: boolean;
}

export function Link({
  href,
  children,
  type = "standalone",
  showExternalLinkIcon,
  demoState = "default",
  disabled,
  className,
  ...rest
}: LinkProps) {
  const target = showExternalLinkIcon ? "_blank" : undefined;
  const rel = showExternalLinkIcon ? "noopener noreferrer" : undefined;

  return (
    <a
      href={disabled ? undefined : href}
      className={[styles.link, className || ""].join(" ")}
      data-disabled={disabled || undefined}
      data-type={type}
      data-demo-state={demoState}
      target={target}
      rel={rel}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      {...rest}
    >
      {children}
      {showExternalLinkIcon && <ExternalIcon />}
    </a>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={styles.externalIcon}
      aria-hidden="true"
    >
      <path
        d="M12 8.667V12.667C12 13.4034 11.4034 14 10.667 14H3.333C2.597 14 2 13.4034 2 12.667V5.333C2 4.597 2.597 4 3.333 4H7.333"
        stroke="currentColor"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 2H14V6"
        stroke="currentColor"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.667 9.333L14 2"
        stroke="currentColor"
        strokeWidth="1.333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
