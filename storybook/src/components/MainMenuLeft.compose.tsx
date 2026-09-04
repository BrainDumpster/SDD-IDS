import type { CSSProperties, ReactNode } from "react";
import { useEffect } from "react";
import styles from "./MainMenuLeft.module.css";
import { Icon } from "./Icon";
import {
  MainMenuLeftGroupContext,
  useMainMenuLeftContext,
  useMainMenuLeftGroupContext,
} from "./MainMenuLeftContext";
import type { MainMenuLeftItemLevel, MainMenuLeftPrimaryState } from "./MainMenuLeft.types";
import { toPascalState } from "./MainMenuLeft.utils";

export interface MainMenuLeftItemProps {
  itemId: string;
  level?: MainMenuLeftItemLevel;
  forceState?: MainMenuLeftPrimaryState;
  tooltip?: string;
  children: ReactNode;
}

export function MainMenuLeftItem({
  itemId,
  level = "primary",
  forceState,
  tooltip,
  children,
}: MainMenuLeftItemProps) {
  const ctx = useMainMenuLeftContext();
  const group = useMainMenuLeftGroupContext();
  const groupId = group?.groupId;
  const isPrimary = level === "primary";
  const isSecondary = level === "secondary";

  const forcedSelected =
    Boolean(ctx.forceStates && forceState) &&
    (forceState === "selected" || forceState === "selected-focus");
  const forcedFocus =
    Boolean(ctx.forceStates && forceState) &&
    (forceState === "default-focus" || forceState === "selected-focus");
  const state = isPrimary ? ctx.getPrimaryState(itemId, forceState) : "default";
  const isSelected = isPrimary
    ? ctx.isPrimarySelected(itemId, forceState)
    : forcedSelected || Boolean(groupId && ctx.isSecondarySelected(itemId, groupId));
  const isFocused = isPrimary ? ctx.isPrimaryFocused(itemId, forceState) : forcedFocus;
  const showInset = isPrimary ? ctx.showPrimaryInset(itemId, groupId, forceState) : false;
  const showChevron =
    isPrimary && groupId ? ctx.showChevronForGroup(groupId) && ctx.railExpanded : false;

  const rowClass = isPrimary
    ? [
        styles.primaryRow,
        !(ctx.forceStates && forceState) ? styles.interactive : "",
        styles[`state${toPascalState(state)}`],
        groupId && ctx.hasSelectedSecondaryInGroup(groupId) ? styles.secondaryParentSelected : "",
        showInset ? styles.selected : "",
      ]
        .filter(Boolean)
        .join(" ")
    : [
        styles.secondaryRow,
        !(ctx.forceStates && forceState) ? styles.secondaryInteractive : "",
        isSelected ? styles.secondaryRowSelected : "",
        forceState === "hover" ? styles.secondaryRowStateHover : "",
        forceState === "press" ? styles.secondaryRowStatePress : "",
      ]
        .filter(Boolean)
        .join(" ");

  const row = (
    <div
      className={rowClass}
      title={tooltip}
      aria-current={
        isPrimary
          ? ctx.primaryAriaCurrent(itemId, groupId, forceState)
          : isSelected
            ? "page"
            : undefined
      }
      aria-expanded={isPrimary && groupId ? ctx.primaryAriaExpanded(groupId) : undefined}
      onClick={(event) => {
        if (ctx.forceStates && forceState) return;
        const label = tooltip ?? itemId;
        if (isSecondary && groupId) {
          ctx.onSecondaryActivate(itemId, groupId, label);
          return;
        }
        if (isPrimary && groupId && ctx.railExpanded) {
          event.preventDefault();
          ctx.toggleGroup(groupId);
          return;
        }
        ctx.onPrimaryActivate(itemId, label, groupId);
      }}
    >
      <div className={styles.linkHost}>{children}</div>
      {showChevron ? (
        <Icon
          shapeName={
            groupId && ctx.isGroupChildrenVisible(groupId)
              ? "chev-down-thick"
              : "chev-right-thick"
          }
          className={styles.chevronIcon}
        />
      ) : null}
      {isFocused ? <span className={styles.focusRing} aria-hidden="true" /> : null}
      {showInset ? <span className={styles.selectedInset} aria-hidden="true" /> : null}
    </div>
  );

  if (isSecondary || group) return row;
  return <div className={styles.itemBlock}>{row}</div>;
}

export interface MainMenuLeftItemIconProps {
  shapeName: string;
  className?: string;
  style?: CSSProperties;
}

export function MainMenuLeftItemIcon({
  shapeName,
  className,
  style,
}: MainMenuLeftItemIconProps) {
  return (
    <Icon
      shapeName={shapeName}
      className={[styles.primaryIcon, className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}

export interface MainMenuLeftChildrenProps {
  children: ReactNode;
}

export function MainMenuLeftChildren({ children }: MainMenuLeftChildrenProps) {
  const group = useMainMenuLeftGroupContext();
  const ctx = useMainMenuLeftContext();
  const hidden = group && !ctx.isGroupChildrenVisible(group.groupId);
  return (
    <div
      className={[styles.secondarySection, hidden ? styles.secondarySectionHidden : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export interface MainMenuLeftGroupProps {
  groupId: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

export function MainMenuLeftGroup({
  groupId,
  defaultExpanded = false,
  children,
}: MainMenuLeftGroupProps) {
  const { registerGroup, unregisterGroup, forceStates } = useMainMenuLeftContext();

  useEffect(() => {
    registerGroup(groupId, {
      defaultExpanded,
      childrenMenuPinned: forceStates,
    });
    return () => unregisterGroup(groupId);
  }, [registerGroup, unregisterGroup, groupId, defaultExpanded, forceStates]);

  return (
    <MainMenuLeftGroupContext.Provider value={{ groupId }}>
      <div className={styles.itemBlock}>{children}</div>
    </MainMenuLeftGroupContext.Provider>
  );
}

export interface MainMenuLeftLogoSlotProps {
  alt: string;
  src?: string;
  iconName?: string;
  tooltip?: string;
  href?: string;
  children?: ReactNode;
}

export function MainMenuLeftLogoSlot({
  alt,
  src,
  iconName,
  tooltip,
  href,
  children,
}: MainMenuLeftLogoSlotProps) {
  const content = children ?? (
    <>
      {src ? <img src={src} alt="" className={styles.logoImg} width={32} height={32} /> : null}
      {iconName ? <Icon shapeName={iconName} className={styles.logoIcon} /> : null}
    </>
  );

  return (
    <div className={styles.logoSlot}>
      {href ? (
        <a
          className={styles.logoButton}
          href={href}
          title={tooltip ?? alt}
          aria-label={alt}
        >
          {content}
        </a>
      ) : (
        <div className={styles.logoStatic} role="img" aria-label={alt} title={tooltip}>
          {content}
        </div>
      )}
    </div>
  );
}
