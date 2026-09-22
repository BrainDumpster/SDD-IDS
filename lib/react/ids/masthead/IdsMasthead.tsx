/**
 * IDS Masthead — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/masthead`
 * Source: `components/ids/masthead/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is Masthead / IdsMasthead, not MastheadRoot):
 *   IdsMasthead
 *     IdsMastheadBrandSlot
 *       IdsMastheadLogo?
 *       IdsMastheadProductName
 *     IdsMastheadActionsRow?
 *       IdsMastheadIconsSlot?
 *       IdsMastheadAppLauncherSlot?
 *       IdsMastheadAvatarSlot?
 *
 * Host primitives (compose inside IconsSlot / AvatarSlot):
 *   IdsMastheadActionButtonContainer
 *     IdsMastheadActionIconButton[]
 *   IdsMastheadAvatar
 *
 * Prop-driven `logo` / `iconsSlot` / `appLauncherSlot` / `avatarSlot` emit this tree.
 * Compound `children` fill the same slots. No runtime defaults for optional chrome.
 * No @base-ui-components dependency.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { IdsBadge, type IdsBadgeType } from "../badge";
import { IdsTooltip } from "../tooltip";
import {
  collectMainSlots,
  findSlotElement,
  hasMastheadAnatomyChildren,
  markMastheadSlot,
} from "./IdsMasthead.compose";
import styles from "./IdsMasthead.module.css";

const s = {
  root: styles["IdsMasthead"],
  brand: styles["IdsMastheadBrandSlot"],
  logo: styles["IdsMastheadLogo"],
  productName: styles["IdsMastheadProductName"],
  actions: styles["IdsMastheadActionsRow"],
  icons: styles["IdsMastheadIconsSlot"],
  appLauncher: styles["IdsMastheadAppLauncherSlot"],
  avatarSlot: styles["IdsMastheadAvatarSlot"],
  actionButtonContainer: styles["IdsMastheadActionButtonContainer"],
  actionIconButton: styles["IdsMastheadActionIconButton"],
  actionIconGlyph: styles["IdsMastheadActionIconGlyph"],
  badgeWrapper: styles["IdsMastheadBadgeWrapper"],
  avatar: styles["IdsMastheadAvatar"],
  avatarChip: styles["IdsMastheadAvatarChip"],
  avatarChipPhoto: styles["IdsMastheadAvatarChip--photo"],
  avatarIcon: styles["IdsMastheadAvatarIcon"],
  avatarImage: styles["IdsMastheadAvatarImage"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type IdsMastheadBadgeType =
  | "default"
  | "controls"
  | "critical"
  | "warning"
  | "disabled"
  | "success";

export interface IdsMastheadProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  /** Required brand label. Compound `Masthead.ProductName` children take precedence. */
  productName?: ReactNode;
  /** Optional host-composed leading mark (32×32). Omit when unused. */
  logo?: ReactNode;
  /** Optional host-composed utilities. Omit when unused. */
  iconsSlot?: ReactNode;
  /** Optional host-composed App Launcher. Omit when unused. */
  appLauncherSlot?: ReactNode;
  /** Optional host-composed avatar / account control. Omit when unused. */
  avatarSlot?: ReactNode;
  children?: ReactNode;
}

export interface IdsMastheadBrandSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsMastheadLogoProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsMastheadProductNameProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsMastheadActionsRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsMastheadIconsSlotProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsMastheadAppLauncherSlotProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsMastheadAvatarSlotProps {
  children?: ReactNode;
  className?: string;
}

export interface IdsMastheadActionButtonContainerProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsMastheadActionIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  /** Required accessible name. */
  "aria-label": string;
  badgeCount?: number;
  badgeType?: IdsMastheadBadgeType;
}

export interface IdsMastheadAvatarProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  initials?: string;
  icon?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsMastheadContextValue {
  productName?: ReactNode;
  logo?: ReactNode;
  iconsSlot?: ReactNode;
  appLauncherSlot?: ReactNode;
  avatarSlot?: ReactNode;
}

const IdsMastheadContext = createContext<IdsMastheadContextValue | null>(null);

function useMasthead(slot: string): IdsMastheadContextValue {
  const ctx = useContext(IdsMastheadContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within Masthead.`);
  }
  return ctx;
}

function resolveBadgeType(value: unknown): IdsBadgeType {
  if (value === "critical" || value === "warning" || value === "disabled" || value === "success") {
    return value;
  }
  return "default";
}

/* -------------------------------------------------------------------------- */
/* Brand slots                                                                */
/* -------------------------------------------------------------------------- */

export function IdsMastheadLogo({ children, className }: IdsMastheadLogoProps) {
  const ctx = useMasthead("Masthead.Logo");
  const content = children ?? ctx.logo;
  if (content == null || content === false) return null;
  return (
    <div className={cx(s.logo, className)} data-ids="IdsMastheadLogo">
      {content}
    </div>
  );
}
IdsMastheadLogo.displayName = "IdsMastheadLogo";
markMastheadSlot(IdsMastheadLogo, "logo");

export function IdsMastheadProductName({ children, className }: IdsMastheadProductNameProps) {
  const ctx = useMasthead("Masthead.ProductName");
  const content = children ?? ctx.productName;
  if (content == null || content === false || content === "") return null;
  const productNameSlot = (
    <div className={cx(s.productName, className)} data-ids="IdsMastheadProductName">
      {content}
    </div>
  );
  if (typeof content === "string" && content.length > 45) {
    return (
      <IdsTooltip side="bottom" hugContent>
        <IdsTooltip.Trigger display="block">{productNameSlot}</IdsTooltip.Trigger>
        <IdsTooltip.Panel>
          <IdsTooltip.Body>{content}</IdsTooltip.Body>
        </IdsTooltip.Panel>
      </IdsTooltip>
    );
  }
  return productNameSlot;
}
IdsMastheadProductName.displayName = "IdsMastheadProductName";
markMastheadSlot(IdsMastheadProductName, "product-name");

export function IdsMastheadBrandSlot({ children, className, ...rest }: IdsMastheadBrandSlotProps) {
  useMasthead("Masthead.BrandSlot");
  const logo = findSlotElement(children, "logo") ?? <IdsMastheadLogo />;
  const name = findSlotElement(children, "product-name") ?? <IdsMastheadProductName />;
  return (
    <div className={cx(s.brand, className)} data-ids="IdsMastheadBrandSlot" {...rest}>
      {logo}
      {name}
    </div>
  );
}
IdsMastheadBrandSlot.displayName = "IdsMastheadBrandSlot";
markMastheadSlot(IdsMastheadBrandSlot, "brand");

/* -------------------------------------------------------------------------- */
/* Actions row + projection slots                                             */
/* -------------------------------------------------------------------------- */

export function IdsMastheadIconsSlot({ children, className }: IdsMastheadIconsSlotProps) {
  const ctx = useMasthead("Masthead.IconsSlot");
  const content = children ?? ctx.iconsSlot;
  if (content == null || content === false) return null;
  return (
    <div className={cx(s.icons, className)} data-ids="IdsMastheadIconsSlot">
      {content}
    </div>
  );
}
IdsMastheadIconsSlot.displayName = "IdsMastheadIconsSlot";
markMastheadSlot(IdsMastheadIconsSlot, "icons");

export function IdsMastheadAppLauncherSlot({ children, className }: IdsMastheadAppLauncherSlotProps) {
  const ctx = useMasthead("Masthead.AppLauncherSlot");
  const content = children ?? ctx.appLauncherSlot;
  if (content == null || content === false) return null;
  return (
    <div className={cx(s.appLauncher, className)} data-ids="IdsMastheadAppLauncherSlot">
      {content}
    </div>
  );
}
IdsMastheadAppLauncherSlot.displayName = "IdsMastheadAppLauncherSlot";
markMastheadSlot(IdsMastheadAppLauncherSlot, "app-launcher");

export function IdsMastheadAvatarSlot({ children, className }: IdsMastheadAvatarSlotProps) {
  const ctx = useMasthead("Masthead.AvatarSlot");
  const content = children ?? ctx.avatarSlot;
  if (content == null || content === false) return null;
  return (
    <div className={cx(s.avatarSlot, className)} data-ids="IdsMastheadAvatarSlot">
      {content}
    </div>
  );
}
IdsMastheadAvatarSlot.displayName = "IdsMastheadAvatarSlot";
markMastheadSlot(IdsMastheadAvatarSlot, "avatar-slot");

export function IdsMastheadActionsRow({
  children,
  className,
  onKeyDown,
  "aria-label": ariaLabel,
  ...rest
}: IdsMastheadActionsRowProps) {
  useMasthead("Masthead.ActionsRow");
  const actionsRef = useRef<HTMLDivElement>(null);

  const icons = findSlotElement(children, "icons") ?? <IdsMastheadIconsSlot />;
  const launcher = findSlotElement(children, "app-launcher") ?? <IdsMastheadAppLauncherSlot />;
  const avatar = findSlotElement(children, "avatar-slot") ?? <IdsMastheadAvatarSlot />;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      onKeyDown?.(event);
      return;
    }
    const container = actionsRef.current;
    if (!container) return;
    const active = document.activeElement as HTMLElement | null;
    if (!active || !container.contains(active)) {
      onKeyDown?.(event);
      return;
    }
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>("button:not([disabled])"),
    );
    const index = focusables.indexOf(active);
    if (index < 0) {
      onKeyDown?.(event);
      return;
    }
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % focusables.length;
    else if (event.key === "ArrowLeft")
      nextIndex = (index - 1 + focusables.length) % focusables.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = focusables.length - 1;
    focusables[nextIndex]?.focus();
    onKeyDown?.(event);
  }

  return (
    <div
      ref={actionsRef}
      className={cx(s.actions, className)}
      data-ids="IdsMastheadActionsRow"
      {...rest}
      role="toolbar"
      aria-label={ariaLabel ?? "Masthead actions"}
      onKeyDown={handleKeyDown}
    >
      {icons}
      {launcher}
      {avatar}
    </div>
  );
}
IdsMastheadActionsRow.displayName = "IdsMastheadActionsRow";
markMastheadSlot(IdsMastheadActionsRow, "actions-row");

/* -------------------------------------------------------------------------- */
/* Host primitives                                                            */
/* -------------------------------------------------------------------------- */

export function IdsMastheadActionButtonContainer({
  children,
  className,
  ...rest
}: IdsMastheadActionButtonContainerProps) {
  return (
    <div
      className={cx(s.actionButtonContainer, className)}
      data-ids="IdsMastheadActionButtonContainer"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsMastheadActionButtonContainer.displayName = "IdsMastheadActionButtonContainer";
markMastheadSlot(IdsMastheadActionButtonContainer, "action-button-container");

export function IdsMastheadActionIconButton({
  icon,
  badgeCount,
  badgeType = "critical",
  className,
  type = "button",
  ...rest
}: IdsMastheadActionIconButtonProps) {
  const showBadge = typeof badgeCount === "number" && badgeCount > 0;
  const badgeLabel = badgeCount && badgeCount > 99 ? "99+" : String(badgeCount ?? "");
  return (
    <button
      {...rest}
      type={type}
      className={cx(s.actionIconButton, className)}
      data-ids="IdsMastheadActionIconButton"
    >
      <span className={s.actionIconGlyph} aria-hidden="true">
        {icon}
      </span>
      {showBadge ? (
        <span className={s.badgeWrapper} aria-hidden="true">
          <IdsBadge value={badgeLabel} type={resolveBadgeType(badgeType)} />
        </span>
      ) : null}
    </button>
  );
}
IdsMastheadActionIconButton.displayName = "IdsMastheadActionIconButton";
markMastheadSlot(IdsMastheadActionIconButton, "action-icon-button");

export function IdsMastheadAvatar({
  initials,
  icon,
  imageSrc,
  imageAlt = "User avatar",
  className,
  type = "button",
  ...rest
}: IdsMastheadAvatarProps) {
  return (
    <button
      {...rest}
      type={type}
      className={cx(s.avatar, className)}
      data-ids="IdsMastheadAvatar"
      aria-label={rest["aria-label"] ?? (initials ? `User initials ${initials}` : imageAlt)}
    >
      <span className={cx(s.avatarChip, imageSrc && s.avatarChipPhoto)}>
        {imageSrc ? (
          <img className={s.avatarImage} src={imageSrc} alt={imageAlt} />
        ) : icon ? (
          <span className={s.avatarIcon} aria-hidden="true">
            {icon}
          </span>
        ) : (
          initials
        )}
      </span>
    </button>
  );
}
IdsMastheadAvatar.displayName = "IdsMastheadAvatar";
markMastheadSlot(IdsMastheadAvatar, "avatar");

/* -------------------------------------------------------------------------- */
/* Root — Masthead (not MastheadRoot)                                         */
/* -------------------------------------------------------------------------- */

function DefaultActionsRow() {
  const ctx = useMasthead("Masthead.ActionsRow");
  if (!ctx.iconsSlot && !ctx.appLauncherSlot && !ctx.avatarSlot) return null;
  return (
    <IdsMastheadActionsRow>
      <IdsMastheadIconsSlot />
      <IdsMastheadAppLauncherSlot />
      <IdsMastheadAvatarSlot />
    </IdsMastheadActionsRow>
  );
}

export function IdsMasthead({
  productName,
  logo,
  iconsSlot,
  appLauncherSlot,
  avatarSlot,
  children,
  className,
  ...rest
}: IdsMastheadProps) {
  const anatomy = hasMastheadAnatomyChildren(children);
  const slots = useMemo(() => collectMainSlots(children), [children]);

  const nameFromChildren = slots.productName
    ? (slots.productName.props as { children?: ReactNode }).children
    : undefined;
  const resolvedName =
    nameFromChildren !== undefined && nameFromChildren !== null && nameFromChildren !== ""
      ? nameFromChildren
      : productName;

  const ctx: IdsMastheadContextValue = {
    productName: resolvedName,
    logo,
    iconsSlot,
    appLauncherSlot,
    avatarSlot,
  };

  const showActions =
    Boolean(slots.actionsRow) ||
    Boolean(slots.icons) ||
    Boolean(slots.appLauncher) ||
    Boolean(slots.avatarSlot) ||
    Boolean(iconsSlot) ||
    Boolean(appLauncherSlot) ||
    Boolean(avatarSlot);

  const tree = anatomy ? (
    <>
      {slots.brand ?? (
        <IdsMastheadBrandSlot>
          {slots.logo ?? <IdsMastheadLogo />}
          {slots.productName ?? <IdsMastheadProductName>{resolvedName}</IdsMastheadProductName>}
        </IdsMastheadBrandSlot>
      )}
      {showActions
        ? (slots.actionsRow ?? (
            <IdsMastheadActionsRow>
              {slots.icons ?? <IdsMastheadIconsSlot />}
              {slots.appLauncher ?? <IdsMastheadAppLauncherSlot />}
              {slots.avatarSlot ?? <IdsMastheadAvatarSlot />}
            </IdsMastheadActionsRow>
          ))
        : null}
    </>
  ) : (
    <>
      <IdsMastheadBrandSlot>
        <IdsMastheadLogo />
        <IdsMastheadProductName />
      </IdsMastheadBrandSlot>
      <DefaultActionsRow />
    </>
  );

  return (
    <IdsMastheadContext.Provider value={ctx}>
      <header className={cx(s.root, className)} data-ids="IdsMasthead" {...rest}>
        {tree}
      </header>
    </IdsMastheadContext.Provider>
  );
}

IdsMasthead.displayName = "Masthead";

export const IdsMastheadCompound = Object.assign(IdsMasthead, {
  BrandSlot: IdsMastheadBrandSlot,
  Logo: IdsMastheadLogo,
  ProductName: IdsMastheadProductName,
  ActionsRow: IdsMastheadActionsRow,
  IconsSlot: IdsMastheadIconsSlot,
  AppLauncherSlot: IdsMastheadAppLauncherSlot,
  AvatarSlot: IdsMastheadAvatarSlot,
  ActionButtonContainer: IdsMastheadActionButtonContainer,
  ActionIconButton: IdsMastheadActionIconButton,
  Avatar: IdsMastheadAvatar,
});

/** Anatomy alias — root is Masthead, not MastheadRoot. */
export const Masthead = IdsMastheadCompound;

export default IdsMastheadCompound;
