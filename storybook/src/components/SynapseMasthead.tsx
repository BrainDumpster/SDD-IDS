import type { ComponentProps, ReactNode } from "react";
import { Badge } from "./Badge";
import styles from "./SynapseMasthead.module.css";

export interface SynapseMastheadProps extends ComponentProps<"header"> {
  logo?: ReactNode;
  productName: ReactNode;
  iconsSlot?: ReactNode;
  appLauncherSlot?: ReactNode;
  avatarSlot: ReactNode;
}

export function SynapseMastheadActionButtonContainer({
  children,
  className,
  ...rest
}: ComponentProps<"div">) {
  return (
    <div className={[styles.actionButtonContainer, className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </div>
  );
}

export interface SynapseMastheadActionIconButtonProps extends ComponentProps<"button"> {
  icon: ReactNode;
  badgeCount?: number;
  badgeType?: "critical" | "success";
}

export function SynapseMastheadActionIconButton({
  icon,
  badgeCount,
  badgeType = "critical",
  className,
  type = "button",
  ...rest
}: SynapseMastheadActionIconButtonProps) {
  const showBadge = typeof badgeCount === "number" && badgeCount > 0;
  const badgeLabel = badgeCount && badgeCount > 99 ? "99+" : String(badgeCount);

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
          <Badge variant={badgeType === "success" ? "success" : "critical"}>{badgeLabel}</Badge>
        </span>
      ) : null}
    </button>
  );
}

export interface SynapseMastheadAvatarProps extends Omit<ComponentProps<"button">, "children"> {
  initials?: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

export function SynapseMastheadAvatar({
  initials,
  icon,
  imageSrc,
  imageAlt = "User avatar",
  className,
  type = "button",
  ...rest
}: SynapseMastheadAvatarProps) {
  return (
    <button
      type={type}
      className={[styles.avatarAction, className].filter(Boolean).join(" ")}
      aria-label={initials ? `User initials ${initials}` : imageAlt}
      {...rest}
    >
      <span className={styles.avatarChip}>
        {imageSrc ? (
          <img className={styles.avatarImage} src={imageSrc} alt={imageAlt} />
        ) : icon ? (
          icon
        ) : (
          initials
        )}
      </span>
    </button>
  );
}

export {
  SynapseMastheadHelpMenu,
  type SynapseMastheadHelpMenuOption,
  type SynapseMastheadHelpMenuProps,
} from "./SynapseMastheadHelpMenu";

export {
  SynapseMastheadUserMenu,
  SynapseMastheadUserMenuDefaultIcon,
  type SynapseMastheadUserMenuOption,
  type SynapseMastheadUserMenuProps,
} from "./SynapseMastheadUserMenu";

export function SynapseMasthead({
  logo,
  productName,
  iconsSlot,
  appLauncherSlot,
  avatarSlot,
  className,
  ...rest
}: SynapseMastheadProps) {
  return (
    <header className={[styles.masthead, className].filter(Boolean).join(" ")} {...rest}>
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
