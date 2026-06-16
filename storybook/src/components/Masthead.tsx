import type { ComponentProps, ReactNode } from "react";
import styles from "./Masthead.module.css";

interface MastheadProps extends ComponentProps<"header"> {
  /** Optional leading brand logo/icon. */
  logo?: ReactNode;
  /** Required product title text/content, e.g. "Synapse". */
  productName: ReactNode;
  /** Optional user-defined icon slot (e.g. help/status icons). */
  iconsSlot?: ReactNode;
  /** Optional app launcher slot; usually <AppLauncher />. */
  appLauncherSlot?: ReactNode;
  /** Trailing avatar slot (initials or user icon). */
  avatarSlot: ReactNode;
}

interface MastheadActionButtonContainerProps extends ComponentProps<"div"> {
  children: ReactNode;
}

interface MastheadActionIconButtonProps extends ComponentProps<"button"> {
  icon: ReactNode;
}

interface MastheadAvatarProps extends Omit<ComponentProps<"button">, "children"> {
  initials?: string;
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
  className,
  type = "button",
  ...rest
}: MastheadActionIconButtonProps) {
  return (
    <button
      type={type}
      className={[styles.actionIconButton, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.actionIconGlyph} aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}

export function MastheadAvatar({
  initials,
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
      <span className={styles.avatarChip}>
        {imageSrc ? <img className={styles.avatarImage} src={imageSrc} alt={imageAlt} /> : initials}
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
      <div className={styles.actions}>
        {iconsSlot ? <div className={styles.iconsSlot}>{iconsSlot}</div> : null}
        {appLauncherSlot ? <div className={styles.appLauncherSlot}>{appLauncherSlot}</div> : null}
        <div className={styles.avatarSlot}>{avatarSlot}</div>
      </div>
    </header>
  );
}
