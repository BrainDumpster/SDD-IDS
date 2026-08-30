import type { ComponentProps, ReactNode } from "react";
import { Badge } from "./Badge";
import styles from "./Masthead.module.css";

interface MastheadProps extends ComponentProps<"header"> {
  /** Optional product logo — host-composed via shared Icon (32×32); omit when unused. */
  logo?: ReactNode;
  /** Required product title text/content, e.g. "Synapse". */
  productName: ReactNode;
  /**
   * Optional host-composed utility region (search, action icons, dropdowns, badges).
   * Masthead does not ship a fixed icon list — omit for none.
   */
  iconsSlot?: ReactNode;
  /** Optional host-composed App Launcher; omit when unused. */
  appLauncherSlot?: ReactNode;
  /** Optional host-composed avatar / account control; omit when unused. */
  avatarSlot?: ReactNode;
}

interface MastheadActionButtonContainerProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export interface MastheadActionIconButtonProps extends ComponentProps<"button"> {
  icon: ReactNode;
  badgeCount?: number;
  badgeType?: "default" | "controls" | "critical" | "warning" | "disabled" | "success";
}

interface MastheadAvatarProps extends Omit<ComponentProps<"button">, "children"> {
  initials?: string;
  /** User icon via shared Icon primitive — slug `user-single`, 16×16, `var(--color-icon-gray-white)`. */
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export function MastheadActionButtonContainer({
  children,
  className,
  ...rest
}: MastheadActionButtonContainerProps) {
  return (
    <div
      className={[styles.actionButtonContainer, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}

export function MastheadActionIconButton({
  icon,
  badgeCount,
  badgeType = "critical",
  className,
  type = "button",
  ...rest
}: MastheadActionIconButtonProps) {
  const showBadge = typeof badgeCount === "number" && badgeCount > 0;
  const badgeLabel = badgeCount && badgeCount > 99 ? "99+" : String(badgeCount ?? "");

  return (
    <button
      type={type}
      className={[styles.actionIconButton, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.actionIconGlyph} aria-hidden="true">
        {icon}
      </span>
      {showBadge ? (
        <span className={styles.badgeWrapper} aria-hidden="true">
          <Badge value={badgeLabel} type={badgeType} />
        </span>
      ) : null}
    </button>
  );
}

export function MastheadAvatar({
  initials,
  icon,
  imageSrc,
  imageAlt = "User avatar",
  className,
  type = "button",
  ...rest
}: MastheadAvatarProps) {
  return (
    <button
      type={type}
      className={[styles.avatarAction, className].filter(Boolean).join(" ")}
      aria-label={initials ? `User initials ${initials}` : imageAlt}
      {...rest}
    >
      <span
        className={[
          styles.avatarChip,
          imageSrc ? styles.avatarChipPhoto : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {imageSrc ? (
          <img className={styles.avatarImage} src={imageSrc} alt={imageAlt} />
        ) : icon ? (
          <span className={styles.avatarIcon} aria-hidden="true">
            {icon}
          </span>
        ) : (
          initials
        )}
      </span>
    </button>
  );
}

export function Masthead({
  logo,
  productName,
  iconsSlot,
  appLauncherSlot,
  avatarSlot,
  className,
  ...rest
}: MastheadProps) {
  return (
    <header
      className={[styles.masthead, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className={styles.left}>
        {logo ? <div className={styles.logo}>{logo}</div> : null}
        <div className={styles.productName}>{productName}</div>
      </div>
      {iconsSlot || appLauncherSlot || avatarSlot ? (
        <div className={styles.actions}>
          {iconsSlot ? <div className={styles.iconsSlot}>{iconsSlot}</div> : null}
          {appLauncherSlot ? (
            <div className={styles.appLauncherSlot}>{appLauncherSlot}</div>
          ) : null}
          {avatarSlot ? <div className={styles.avatarSlot}>{avatarSlot}</div> : null}
        </div>
      ) : null}
    </header>
  );
}
