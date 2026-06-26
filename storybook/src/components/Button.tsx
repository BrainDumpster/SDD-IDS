import { Button as BaseButton } from "@base-ui-components/react/button";
import { forwardRef, useMemo, type ComponentProps, type ReactNode } from "react";
import {
  BUTTON_SPEC_ACCURATE_DEFAULTS,
  type ButtonSize,
  type ButtonVariantExtended,
} from "../../../../component-contracts/ids/button.contract";
import { Icon } from "./Icon";
import styles from "./Button.module.css";

interface ButtonProps extends ComponentProps<"button"> {
  /** Programme chrome (`synapse`: ::after focus ring; radius from theme aliases). */
  programme?: "ids" | "synapse";
  variant?: ButtonVariantExtended;
  size?: ButtonSize;
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    programme = "ids",
    variant = BUTTON_SPEC_ACCURATE_DEFAULTS.variant,
    size = BUTTON_SPEC_ACCURATE_DEFAULTS.size,
    loading = BUTTON_SPEC_ACCURATE_DEFAULTS.loading,
    icon,
    iconSlug,
    iconVariant = "mask",
    iconOnly = false,
    disabled,
    children,
    className,
    ...rest
  },
  forwardedRef,
) {
  const variantClass = variant === "destructive" ? "danger" : variant;
  const isDestructive = variant === "destructive" || variant === "danger";
  const iconUrl = iconSlug ? resolveIconUrl(iconSlug) : undefined;
  const slugIconNode =
    iconSlug && iconUrl ? <Icon shapeName={iconSlug} variant={iconVariant} /> : undefined;
  const resolvedIcon = isDestructive ? undefined : (icon ?? slugIconNode);
  const resolvedIconOnly = isDestructive ? false : iconOnly;
  const hasIcon = Boolean(resolvedIcon);
  const showIconWithLabel = hasIcon && !loading;
  const resolvedClassName = useMemo(
    () =>
      [
        styles.button,
        styles[variantClass],
        styles[size],
        programme === "synapse" ? styles.programmeSynapse : "",
        resolvedIconOnly ? styles.iconOnly : "",
        loading ? styles.loading : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className, loading, programme, resolvedIconOnly, size, variantClass],
  );

  return (
    <BaseButton
      ref={forwardedRef}
      className={resolvedClassName}
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
});

Button.displayName = "Button";
