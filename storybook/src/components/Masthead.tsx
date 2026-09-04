import { useRef } from "react";
import type { ComponentProps, ReactNode, KeyboardEvent } from "react";
import { Badge } from "./Badge";
import { IdsTooltip } from "./IdsTooltip";
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
  const actionsRef = useRef<HTMLDivElement>(null);
  const productNameLong = typeof productName === "string" && productName.length > 45;

  const productNameSlot = (
    <div
      className={styles.productName}
      aria-label={typeof productName === "string" ? productName : undefined}
    >
      {productName}
    </div>
  );

  function handleActionKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const container = actionsRef.current;
    if (!container) return;
    const active = document.activeElement as HTMLElement | null;
    if (!active || !container.contains(active)) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>("button:not([disabled])")
    );
    const index = focusables.indexOf(active);
    if (index < 0) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % focusables.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + focusables.length) % focusables.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = focusables.length - 1;
    focusables[nextIndex]?.focus();
  }

  return (
    <header
      className={[styles.masthead, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className={styles.left}>
        {logo ? <div className={styles.logo}>{logo}</div> : null}
        {productNameLong ? (
          <IdsTooltip content={productName} side="bottom" triggerDisplay="block">
            {productNameSlot}
          </IdsTooltip>
        ) : (
          productNameSlot
        )}
      </div>
      <div
        ref={actionsRef}
        className={styles.actions}
        role="toolbar"
        aria-label="Masthead actions"
        onKeyDown={handleActionKeyDown}
      >
        {iconsSlot ? <div className={styles.iconsSlot}>{iconsSlot}</div> : null}
        {appLauncherSlot ? <div className={styles.appLauncherSlot}>{appLauncherSlot}</div> : null}
        <div className={styles.avatarSlot}>{avatarSlot}</div>
      </div>
    </header>
  );
}
