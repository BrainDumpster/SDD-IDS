import { Button as BaseButton } from "@base-ui-components/react/button";
import type { ComponentProps, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "destructive";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  /** Leading 16×16 icon (Figma: Icon=Yes, Icon Only=No). */
  icon?: ReactNode;
  /** Canonical icon slug from `assets/icons/<slug>.svg`. */
  iconSlug?: string;
  /** Rendering mode for `iconSlug` path; default keeps IDS tintable behavior. */
  iconVariant?: "mask" | "img";
  /** Icon only — use with `icon` and an accessible `aria-label` (Figma: Icon Only=Yes; Large/Medium in set). */
  iconOnly?: boolean;
}

const iconUrlBySlug: Record<string, string> = (() => {
  const modules = import.meta.glob<string>("../../../assets/icons/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });
  const out: Record<string, string> = {};
  for (const path of Object.keys(modules)) {
    const file = path.replace(/^.*\/([^/]+)\.svg$/, "$1");
    if (file && modules[path] != null) out[file] = modules[path] as string;
  }
  return out;
})();

function resolveIconUrl(iconSlug: string): string | undefined {
  if (!/^[a-z0-9-]+$/.test(iconSlug)) return undefined;
  return iconUrlBySlug[iconSlug];
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconSlug,
  iconVariant = "mask",
  iconOnly = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  const variantClass = variant === "destructive" ? "danger" : variant;
  const iconUrl = iconSlug ? resolveIconUrl(iconSlug) : undefined;
  const slugIconNode = iconUrl ? <img src={iconUrl} alt="" aria-hidden="true" className={styles.iconImage} /> : undefined;
  const resolvedIcon = icon ?? slugIconNode;
  const hasIcon = Boolean(resolvedIcon);
  const showIconWithLabel = hasIcon && !loading;

  return (
    <BaseButton
      className={() =>
        [
          styles.button,
          styles[variantClass],
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
            {resolvedIcon}
          </span>
        )
      ) : (
        <>
          {showIconWithLabel && (
            <span className={styles.iconSlot} aria-hidden="true">
              {resolvedIcon}
            </span>
          )}
          <span className={loading ? styles.labelHidden : ""}>{children}</span>
        </>
      )}
    </BaseButton>
  );
}
