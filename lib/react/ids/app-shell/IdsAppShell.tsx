/**
 * IDS App Shell — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/app-shell`
 * Source: `components/ids/app-shell/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is IdsAppShell, not AppShellRoot).
 * Public names are Ids camelCase identifiers, not dotted compounds (AppShell.MastheadSlot).
 *   IdsAppShell
 *     IdsAppShellMastheadSlot → IdsMasthead (composed)
 *     IdsAppShellBodyRow
 *       IdsAppShellMainMenuSlot → IdsMainMenuLeft (composed)
 *       IdsAppShellMainColumn (`main#main-content`)
 *         IdsAppShellPageHeader
 *           IdsAppShellPageTitle
 *           IdsAppShellPageDescription?
 *         IdsAppShellBodyViewport
 *           IdsAppShellBodyContentSlot
 *         IdsAppShellFooterSlot → IdsFooter (composed)
 *
 * Host primitives: IdsAppShellHeaderActions (Masthead iconsSlot).
 * Prop-driven `pages` / `menuItems` emit this tree. Compound `children` fill the same slots.
 * Child chrome is composed from Masthead / Main Menu Left / Footer — never inlined.
 * No @base-ui-components dependency.
 */

import React, {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from "react";
import { AppLauncher } from "../app-launcher";
import { IdsFooter, type IdsFooterProps } from "../footer";
import { IdsIcon } from "../icon";
import {
  IdsMainMenuLeft,
  type IdsMainMenuLeftProps,
  type MainMenuLeftLogo,
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftSelectionDetail,
} from "../main-menu-left";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
  type IdsMastheadProps,
} from "../masthead";
import {
  collectMainSlots,
  findSlotElement,
  hasAppShellAnatomyChildren,
  markAppShellSlot,
} from "./IdsAppShell.compose";
import styles from "./IdsAppShell.module.css";

const MENU_EXPANDED_BREAKPOINT_PX = 1600;
const MENU_EXPANDED_STORAGE_KEY = "ids.app-shell.menuExpanded";

const s = {
  root: styles["IdsAppShell"],
  mastheadSlot: styles["IdsAppShellMastheadSlot"],
  bodyRow: styles["IdsAppShellBodyRow"],
  mainMenuSlot: styles["IdsAppShellMainMenuSlot"],
  mainColumn: styles["IdsAppShellMainColumn"],
  pageHeader: styles["IdsAppShellPageHeader"],
  pageTitle: styles["IdsAppShellPageTitle"],
  pageDescription: styles["IdsAppShellPageDescription"],
  bodyViewport: styles["IdsAppShellBodyViewport"],
  bodyContent: styles["IdsAppShellBodyContentSlot"],
  footerSlot: styles["IdsAppShellFooterSlot"],
  headerActions: styles["IdsAppShellHeaderActions"],
  mastheadLogo: styles["IdsAppShellMastheadLogo"],
  pagePanel: styles["IdsAppShellPagePanel"],
  pagePanelTitle: styles["IdsAppShellPagePanelTitle"],
  pagePanelBody: styles["IdsAppShellPagePanelBody"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function isDev(): boolean {
  try {
    return Boolean(import.meta.env?.DEV);
  } catch {
    return true;
  }
}

function mergeDefined<T extends object>(base: T, overlay: Partial<T>): T {
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

function mergeKnownChild<P extends object>(
  child: ReactNode,
  type: unknown,
  injected: Partial<P>,
): ReactNode {
  if (!isValidElement(child) || child.type !== type) return child;
  return cloneElement(child as ReactElement<P>, mergeDefined(injected, child.props as Partial<P>));
}

function shallowMerge<T extends object>(base: T, overlay?: Partial<T> | null): T {
  if (!overlay) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}

function readPersistedMenuExpanded(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MENU_EXPANDED_STORAGE_KEY);
    if (raw === "true") return true;
    if (raw === "false") return false;
    return null;
  } catch {
    return null;
  }
}

function writePersistedMenuExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(MENU_EXPANDED_STORAGE_KEY, expanded ? "true" : "false");
  } catch {
    /* quota / private-mode — breakpoint default applies next mount */
  }
}

export type IdsAppShellBreakpointPreset = "fluid" | "1920" | "1600" | "1366" | "1024";
export type IdsAppShellPageTitleLevel = 1 | 2;

export interface AppShellPage {
  id: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  content: ReactNode;
  menuItemId?: string;
}

export interface AppShellMastheadBundle {
  productName?: ReactNode;
  logo?: ReactNode;
  iconsSlot?: ReactNode;
  appLauncherSlot?: ReactNode;
  avatarSlot?: ReactNode;
}

export interface AppShellMainMenuBundle {
  items?: MainMenuLeftPrimaryItem[];
  logo?: MainMenuLeftLogo;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  defaultSelectedItemId?: string;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  ariaLabel?: string;
}

export interface IdsAppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  pages?: AppShellPage[];
  activePageId?: string;
  defaultPageId?: string;
  onPageChange?: (pageId: string, page: AppShellPage) => void;
  menuItems?: MainMenuLeftPrimaryItem[];
  menuLogo?: MainMenuLeftLogo;
  menuAriaLabel?: string;
  defaultMenuSelectedItemId?: string;
  menuExpanded?: boolean;
  defaultMenuExpanded?: boolean;
  persistMenuExpanded?: boolean;
  onMenuExpandedChange?: (expanded: boolean) => void;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  onMenuSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  mastheadProductName?: string;
  mastheadProductIconSlug?: string;
  mastheadLogo?: ReactNode;
  headerActions?: ReactNode;
  appLauncherSlot?: ReactNode;
  avatarSlot?: ReactNode;
  footerHostname?: string;
  footerSwid?: string;
  footerCurrentDateTime?: string;
  footerTimeZoneLabel?: string;
  showFooterHostname?: boolean;
  showFooterDateTime?: boolean;
  showFooterTimeZone?: boolean;
  onCopySwid?: (swid: string) => void;
  onTimeZoneClick?: () => void;
  masthead?: AppShellMastheadBundle;
  mainMenu?: AppShellMainMenuBundle;
  footer?: IdsFooterProps;
  showPageDescription?: boolean;
  focusManagementOnNavigate?: boolean;
  pageTitleLevel?: IdsAppShellPageTitleLevel;
  breakpointPreset?: IdsAppShellBreakpointPreset | string;
  children?: ReactNode;
}

export interface IdsAppShellMastheadSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellBodyRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellMainMenuSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellMainColumnProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface IdsAppShellPageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellPageTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export interface IdsAppShellPageDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export interface IdsAppShellBodyViewportProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellBodyContentSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellFooterSlotProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface IdsAppShellPagePanelProps extends HTMLAttributes<HTMLElement> {
  title: string;
  children?: ReactNode;
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsAppShellContextValue {
  pages: AppShellPage[];
  activePage?: AppShellPage;
  showDescription: boolean;
  pageTitleLevel: IdsAppShellPageTitleLevel;
  focusManagementOnNavigate: boolean;
  pageTitleRef: RefObject<HTMLHeadingElement | null>;
  masthead: AppShellMastheadBundle;
  mainMenu: AppShellMainMenuBundle;
  footer: IdsFooterProps;
  menuExpanded: boolean;
  handleMenuExpandedChange: (expanded: boolean) => void;
  handleNavigate: (target: MainMenuLeftNavigationTarget) => void;
}

const IdsAppShellContext = createContext<IdsAppShellContextValue | null>(null);

function useAppShell(slot: string): IdsAppShellContextValue {
  const ctx = useContext(IdsAppShellContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within AppShell.`);
  }
  return ctx;
}

function resolveBreakpointPreset(value: unknown): IdsAppShellBreakpointPreset {
  if (value === "1920" || value === "1600" || value === "1366" || value === "1024" || value === "fluid") {
    return value;
  }
  return "fluid";
}

function presetMenuExpandedDefault(preset: IdsAppShellBreakpointPreset): boolean | null {
  if (preset === "1920" || preset === "1600") return true;
  if (preset === "1366" || preset === "1024") return false;
  return null;
}

function useBreakpointMenuDefault(preset: IdsAppShellBreakpointPreset): boolean {
  const pinned = presetMenuExpandedDefault(preset);
  const [expandedDefault, setExpandedDefault] = useState(() => {
    if (pinned !== null) return pinned;
    if (typeof window === "undefined") return true;
    return window.matchMedia(`(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`).matches;
  });

  useEffect(() => {
    const nextPinned = presetMenuExpandedDefault(preset);
    if (nextPinned !== null) {
      setExpandedDefault(nextPinned);
      return undefined;
    }
    const mq = window.matchMedia(`(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`);
    const onChange = () => setExpandedDefault(mq.matches);
    setExpandedDefault(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preset]);

  return expandedDefault;
}

function resolvePageIdFromTarget(
  target: MainMenuLeftNavigationTarget,
  pages: AppShellPage[],
): string | null {
  const direct = pages.find(
    (page) => page.id === target.itemId || page.menuItemId === target.itemId,
  );
  if (direct) return direct.id;
  if (target.parentItemId) {
    const parentPage = pages.find((page) => page.id === target.parentItemId);
    if (parentPage) return parentPage.id;
  }
  return null;
}

function resolvePageTitle(page: AppShellPage | undefined): string {
  if (!page) return "";
  if (page.title == null || page.title === "") {
    if (isDev()) {
      console.error('[AppShell] pages[].title is required; rendering "Untitled".');
    }
    return "Untitled";
  }
  return page.title;
}

/* -------------------------------------------------------------------------- */
/* Header actions + story helpers                                             */
/* -------------------------------------------------------------------------- */

export function IdsAppShellHeaderActions({
  children,
  className,
  ...rest
}: IdsAppShellHeaderActionsProps) {
  return (
    <div
      className={cx(s.headerActions, className)}
      data-ids="IdsAppShellHeaderActions"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsAppShellHeaderActions.displayName = "IdsAppShellHeaderActions";
markAppShellSlot(IdsAppShellHeaderActions, "header-actions");

export function IdsAppShellPagePanel({
  title,
  children,
  className,
  ...rest
}: IdsAppShellPagePanelProps) {
  return (
    <section
      className={cx(s.pagePanel, className)}
      data-ids="IdsAppShellPagePanel"
      aria-label={title}
      {...rest}
    >
      <h2 className={s.pagePanelTitle}>{title}</h2>
      {children ? <div className={s.pagePanelBody}>{children}</div> : null}
    </section>
  );
}
IdsAppShellPagePanel.displayName = "IdsAppShellPagePanel";
markAppShellSlot(IdsAppShellPagePanel, "page-panel");

/* -------------------------------------------------------------------------- */
/* Projection slots                                                           */
/* -------------------------------------------------------------------------- */

export function IdsAppShellMastheadSlot({
  children,
  className,
  ...rest
}: IdsAppShellMastheadSlotProps) {
  const ctx = useAppShell("AppShell.MastheadSlot");
  const composed =
    children == null ? (
      <IdsMasthead
        productName={ctx.masthead.productName}
        logo={ctx.masthead.logo}
        iconsSlot={ctx.masthead.iconsSlot}
        appLauncherSlot={ctx.masthead.appLauncherSlot}
        avatarSlot={ctx.masthead.avatarSlot}
      />
    ) : (
      mergeKnownChild<IdsMastheadProps>(children, IdsMasthead, {
        productName: ctx.masthead.productName,
        logo: ctx.masthead.logo,
        iconsSlot: ctx.masthead.iconsSlot,
        appLauncherSlot: ctx.masthead.appLauncherSlot,
        avatarSlot: ctx.masthead.avatarSlot,
      })
    );
  return (
    <div
      className={cx(s.mastheadSlot, className)}
      data-ids="IdsAppShellMastheadSlot"
      {...rest}
    >
      {composed}
    </div>
  );
}
IdsAppShellMastheadSlot.displayName = "IdsAppShellMastheadSlot";
markAppShellSlot(IdsAppShellMastheadSlot, "masthead");

export function IdsAppShellMainMenuSlot({
  children,
  className,
  ...rest
}: IdsAppShellMainMenuSlotProps) {
  const ctx = useAppShell("AppShell.MainMenuSlot");
  const composed =
    children == null ? (
      <IdsMainMenuLeft
        items={ctx.mainMenu.items ?? []}
        logo={ctx.mainMenu.logo}
        expanded={ctx.menuExpanded}
        onExpandedChange={ctx.handleMenuExpandedChange}
        defaultSelectedItemId={ctx.mainMenu.defaultSelectedItemId}
        onNavigate={ctx.handleNavigate}
        onSelected={ctx.mainMenu.onSelected}
        ariaLabel={ctx.mainMenu.ariaLabel}
      />
    ) : (
      mergeKnownChild<IdsMainMenuLeftProps>(children, IdsMainMenuLeft, {
        items: ctx.mainMenu.items ?? [],
        logo: ctx.mainMenu.logo,
        expanded: ctx.menuExpanded,
        onExpandedChange: ctx.handleMenuExpandedChange,
        defaultSelectedItemId: ctx.mainMenu.defaultSelectedItemId,
        onNavigate: ctx.handleNavigate,
        onSelected: ctx.mainMenu.onSelected,
        ariaLabel: ctx.mainMenu.ariaLabel,
      })
    );
  return (
    <div
      className={cx(s.mainMenuSlot, className)}
      data-ids="IdsAppShellMainMenuSlot"
      {...rest}
    >
      {composed}
    </div>
  );
}
IdsAppShellMainMenuSlot.displayName = "IdsAppShellMainMenuSlot";
markAppShellSlot(IdsAppShellMainMenuSlot, "main-menu");

export function IdsAppShellFooterSlot({
  children,
  className,
  ...rest
}: IdsAppShellFooterSlotProps) {
  const ctx = useAppShell("AppShell.FooterSlot");
  const composed =
    children == null ? (
      <IdsFooter {...ctx.footer} />
    ) : (
      mergeKnownChild<IdsFooterProps>(children, IdsFooter, ctx.footer)
    );
  return (
    <div
      className={cx(s.footerSlot, className)}
      data-ids="IdsAppShellFooterSlot"
      {...rest}
    >
      {composed}
    </div>
  );
}
IdsAppShellFooterSlot.displayName = "IdsAppShellFooterSlot";
markAppShellSlot(IdsAppShellFooterSlot, "footer");

export function IdsAppShellPageTitle({
  children,
  className,
  ...rest
}: IdsAppShellPageTitleProps) {
  const ctx = useAppShell("AppShell.PageTitle");
  const content = children ?? resolvePageTitle(ctx.activePage);
  const headingClassName = cx(s.pageTitle, className);
  const tabIndex = ctx.focusManagementOnNavigate ? -1 : undefined;
  if (ctx.pageTitleLevel === 2) {
    return (
      <h2
        {...rest}
        ref={ctx.pageTitleRef}
        className={headingClassName}
        data-ids="IdsAppShellPageTitle"
        tabIndex={tabIndex}
      >
        {content}
      </h2>
    );
  }
  return (
    <h1
      {...rest}
      ref={ctx.pageTitleRef}
      className={headingClassName}
      data-ids="IdsAppShellPageTitle"
      tabIndex={tabIndex}
    >
      {content}
    </h1>
  );
}
IdsAppShellPageTitle.displayName = "IdsAppShellPageTitle";
markAppShellSlot(IdsAppShellPageTitle, "page-title");

export function IdsAppShellPageDescription({
  children,
  className,
  id = "page-description",
  ...rest
}: IdsAppShellPageDescriptionProps) {
  const ctx = useAppShell("AppShell.PageDescription");
  const content = children ?? ctx.activePage?.description;
  if (!ctx.showDescription && children == null) return null;
  if (content == null || content === false || content === "") return null;
  return (
    <p
      id={id}
      className={cx(s.pageDescription, className)}
      data-ids="IdsAppShellPageDescription"
      {...rest}
    >
      {content}
    </p>
  );
}
IdsAppShellPageDescription.displayName = "IdsAppShellPageDescription";
markAppShellSlot(IdsAppShellPageDescription, "page-description");

export function IdsAppShellBodyContentSlot({
  children,
  className,
  ...rest
}: IdsAppShellBodyContentSlotProps) {
  const ctx = useAppShell("AppShell.BodyContentSlot");
  return (
    <div
      className={cx(s.bodyContent, className)}
      data-ids="IdsAppShellBodyContentSlot"
      {...rest}
    >
      {children ?? ctx.activePage?.content}
    </div>
  );
}
IdsAppShellBodyContentSlot.displayName = "IdsAppShellBodyContentSlot";
markAppShellSlot(IdsAppShellBodyContentSlot, "body-content");

/* -------------------------------------------------------------------------- */
/* Layout slots (always fill missing inner anatomy)                           */
/* -------------------------------------------------------------------------- */

export function IdsAppShellPageHeader({
  children,
  className,
  ...rest
}: IdsAppShellPageHeaderProps) {
  useAppShell("AppShell.PageHeader");
  const title = findSlotElement(children, "page-title") ?? <IdsAppShellPageTitle />;
  const description =
    findSlotElement(children, "page-description") ?? <IdsAppShellPageDescription />;
  return (
    <div
      className={cx(s.pageHeader, className)}
      data-ids="IdsAppShellPageHeader"
      {...rest}
    >
      {title}
      {description}
    </div>
  );
}
IdsAppShellPageHeader.displayName = "IdsAppShellPageHeader";
markAppShellSlot(IdsAppShellPageHeader, "page-header");

export function IdsAppShellBodyViewport({
  children,
  className,
  ...rest
}: IdsAppShellBodyViewportProps) {
  useAppShell("AppShell.BodyViewport");
  const content = findSlotElement(children, "body-content") ?? <IdsAppShellBodyContentSlot />;
  return (
    <div
      className={cx(s.bodyViewport, className)}
      data-ids="IdsAppShellBodyViewport"
      {...rest}
    >
      {content}
    </div>
  );
}
IdsAppShellBodyViewport.displayName = "IdsAppShellBodyViewport";
markAppShellSlot(IdsAppShellBodyViewport, "body-viewport");

export function IdsAppShellMainColumn({
  children,
  className,
  ...rest
}: IdsAppShellMainColumnProps) {
  const ctx = useAppShell("AppShell.MainColumn");
  const header = findSlotElement(children, "page-header") ?? <IdsAppShellPageHeader />;
  const viewport = findSlotElement(children, "body-viewport") ?? <IdsAppShellBodyViewport />;
  const footer = findSlotElement(children, "footer") ?? <IdsAppShellFooterSlot />;
  return (
    <main
      id="main-content"
      className={cx(s.mainColumn, className)}
      data-ids="IdsAppShellMainColumn"
      aria-describedby={ctx.showDescription ? "page-description" : undefined}
      {...rest}
    >
      {header}
      {viewport}
      {footer}
    </main>
  );
}
IdsAppShellMainColumn.displayName = "IdsAppShellMainColumn";
markAppShellSlot(IdsAppShellMainColumn, "main-column");

export function IdsAppShellBodyRow({
  children,
  className,
  ...rest
}: IdsAppShellBodyRowProps) {
  useAppShell("AppShell.BodyRow");
  const menu = findSlotElement(children, "main-menu") ?? <IdsAppShellMainMenuSlot />;
  const column = findSlotElement(children, "main-column") ?? <IdsAppShellMainColumn />;
  return (
    <div
      className={cx(s.bodyRow, className)}
      data-ids="IdsAppShellBodyRow"
      {...rest}
    >
      {menu}
      {column}
    </div>
  );
}
IdsAppShellBodyRow.displayName = "IdsAppShellBodyRow";
markAppShellSlot(IdsAppShellBodyRow, "body-row");

/* -------------------------------------------------------------------------- */
/* Root — AppShell (not AppShellRoot)                                         */
/* -------------------------------------------------------------------------- */

export function IdsAppShell({
  pages = [],
  activePageId: activePageIdProp,
  defaultPageId,
  onPageChange,
  menuItems,
  menuLogo,
  menuAriaLabel,
  defaultMenuSelectedItemId,
  menuExpanded: menuExpandedProp,
  defaultMenuExpanded,
  persistMenuExpanded = false,
  onMenuExpandedChange,
  onNavigate,
  onMenuSelected,
  mastheadProductName,
  mastheadProductIconSlug,
  mastheadLogo,
  headerActions,
  appLauncherSlot,
  avatarSlot,
  footerHostname,
  footerSwid,
  footerCurrentDateTime,
  footerTimeZoneLabel,
  showFooterHostname,
  showFooterDateTime,
  showFooterTimeZone,
  onCopySwid,
  onTimeZoneClick,
  masthead: mastheadBundle,
  mainMenu: mainMenuBundle,
  footer: footerBundle,
  showPageDescription = true,
  focusManagementOnNavigate = true,
  pageTitleLevel = 1,
  breakpointPreset: breakpointPresetProp,
  children,
  className,
  ...rest
}: IdsAppShellProps) {
  const breakpointPreset = resolveBreakpointPreset(breakpointPresetProp);
  const breakpointExpanded = useBreakpointMenuDefault(breakpointPreset);
  const anatomy = hasAppShellAnatomyChildren(children);
  const slots = useMemo(() => collectMainSlots(children), [children]);

  const menuExpandedFromBundle = mainMenuBundle?.expanded;
  const menuControlled = menuExpandedProp !== undefined || menuExpandedFromBundle !== undefined;

  useEffect(() => {
    if (isDev() && menuExpandedProp !== undefined && !onMenuExpandedChange && !mainMenuBundle?.onExpandedChange) {
      console.warn(
        "[AppShell] menuExpanded is controlled without onMenuExpandedChange; treating as read-only.",
      );
    }
  }, [menuExpandedProp, onMenuExpandedChange, mainMenuBundle?.onExpandedChange]);

  useEffect(() => {
    if (isDev() && !mastheadProductName && !mastheadBundle?.productName && !slots.masthead) {
      console.error("[AppShell] mastheadProductName is required when MastheadSlot is not composed.");
    }
  }, [mastheadProductName, mastheadBundle?.productName, slots.masthead]);

  useEffect(() => {
    if (isDev() && pages.length === 0) {
      console.error("[AppShell] pages[] is empty; rendering page header with empty title and body.");
    }
  }, [pages.length]);

  const [internalMenuExpanded, setInternalMenuExpanded] = useState(() => {
    if (defaultMenuExpanded !== undefined) return defaultMenuExpanded;
    if (persistMenuExpanded) {
      const stored = readPersistedMenuExpanded();
      if (stored !== null) return stored;
    }
    return breakpointExpanded;
  });

  useEffect(() => {
    if (menuControlled || defaultMenuExpanded !== undefined) return;
    if (persistMenuExpanded) {
      const stored = readPersistedMenuExpanded();
      if (stored !== null) {
        setInternalMenuExpanded(stored);
        return;
      }
    }
    setInternalMenuExpanded(breakpointExpanded);
  }, [breakpointExpanded, menuControlled, defaultMenuExpanded, persistMenuExpanded]);

  const menuExpanded = menuControlled
    ? Boolean(menuExpandedFromBundle ?? menuExpandedProp)
    : internalMenuExpanded;

  const fallbackPageId = defaultPageId ?? pages[0]?.id ?? "";
  const pageControlled = activePageIdProp !== undefined;
  const [internalPageId, setInternalPageId] = useState(fallbackPageId);
  const activePageId = pageControlled ? (activePageIdProp as string) : internalPageId;

  const activePage = useMemo(() => {
    if (pages.length === 0) return undefined;
    const found = pages.find((page) => page.id === activePageId);
    if (found) return found;
    if (isDev() && activePageId) {
      console.warn(
        `[AppShell] Unknown activePageId "${activePageId}"; falling back to "${fallbackPageId || pages[0].id}".`,
      );
    }
    return pages.find((page) => page.id === fallbackPageId) ?? pages[0];
  }, [pages, activePageId, fallbackPageId]);

  useEffect(() => {
    if (pageControlled) return;
    if (!pages.find((page) => page.id === internalPageId)) {
      setInternalPageId(fallbackPageId);
    }
  }, [pageControlled, pages, internalPageId, fallbackPageId]);

  const pageTitleRef = useRef<HTMLHeadingElement | null>(null);

  const setActivePage = useCallback(
    (pageId: string) => {
      const page = pages.find((entry) => entry.id === pageId);
      if (!page) return;
      if (!pageControlled) {
        setInternalPageId(pageId);
      }
      onPageChange?.(pageId, page);
      if (focusManagementOnNavigate) {
        requestAnimationFrame(() => pageTitleRef.current?.focus());
      }
    },
    [pages, pageControlled, onPageChange, focusManagementOnNavigate],
  );

  const handleNavigate = useCallback(
    (target: MainMenuLeftNavigationTarget) => {
      const hostNavigate = mainMenuBundle?.onNavigate ?? onNavigate;
      hostNavigate?.(target);
      const pageId = resolvePageIdFromTarget(target, pages);
      if (pageId) {
        setActivePage(pageId);
      }
    },
    [mainMenuBundle?.onNavigate, onNavigate, pages, setActivePage],
  );

  const handleMenuExpandedChange = useCallback(
    (expanded: boolean) => {
      if (!menuControlled) {
        setInternalMenuExpanded(expanded);
      }
      if (persistMenuExpanded) {
        writePersistedMenuExpanded(expanded);
      }
      const hostChange = mainMenuBundle?.onExpandedChange ?? onMenuExpandedChange;
      hostChange?.(expanded);
    },
    [menuControlled, persistMenuExpanded, mainMenuBundle?.onExpandedChange, onMenuExpandedChange],
  );

  const resolvedLogo =
    mastheadLogo ??
    (mastheadProductIconSlug ? (
      <span className={s.mastheadLogo} aria-hidden="true">
        <IdsIcon shape={mastheadProductIconSlug} variant="img" size={32} />
      </span>
    ) : undefined);

  const masthead = shallowMerge<AppShellMastheadBundle>(
    {
      productName: mastheadProductName,
      logo: resolvedLogo,
      iconsSlot: headerActions ?? slots.headerActions,
      appLauncherSlot,
      avatarSlot,
    },
    mastheadBundle,
  );

  const initialMenuSelectedItemId =
    defaultMenuSelectedItemId ?? defaultPageId ?? pages[0]?.menuItemId ?? pages[0]?.id;

  const mainMenu = shallowMerge<AppShellMainMenuBundle>(
    {
      items: menuItems ?? [],
      logo: menuLogo,
      expanded: menuExpanded,
      onExpandedChange: handleMenuExpandedChange,
      defaultSelectedItemId: initialMenuSelectedItemId,
      onNavigate: handleNavigate,
      onSelected: onMenuSelected,
      ariaLabel: menuAriaLabel,
    },
    mainMenuBundle,
  );

  const footer = shallowMerge<IdsFooterProps>(
    {
      hostname: footerHostname,
      swid: footerSwid,
      currentDateTime: footerCurrentDateTime,
      timeZoneLabel: footerTimeZoneLabel,
      showHostname: showFooterHostname,
      showCurrentDateAndTime: showFooterDateTime,
      showTimeZone: showFooterTimeZone,
      onCopySwid,
      onTimeZoneClick,
    },
    footerBundle,
  );

  const descriptionFromSlot = slots.pageDescription
    ? (slots.pageDescription.props as { children?: ReactNode }).children
    : undefined;
  const showDescription =
    Boolean(descriptionFromSlot) ||
    (showPageDescription &&
      activePage?.showDescription !== false &&
      Boolean(activePage?.description));

  const ctx: IdsAppShellContextValue = {
    pages,
    activePage,
    showDescription,
    pageTitleLevel: pageTitleLevel === 2 ? 2 : 1,
    focusManagementOnNavigate,
    pageTitleRef,
    masthead,
    mainMenu: {
      ...mainMenu,
      expanded: menuExpanded,
      onExpandedChange: handleMenuExpandedChange,
      onNavigate: handleNavigate,
      onSelected: mainMenu.onSelected ?? onMenuSelected,
    },
    footer,
    menuExpanded,
    handleMenuExpandedChange,
    handleNavigate,
  };

  const tree = anatomy ? (
    <>
      {slots.masthead ?? <IdsAppShellMastheadSlot />}
      {slots.bodyRow ?? (
        <IdsAppShellBodyRow>
          {slots.mainMenu ?? <IdsAppShellMainMenuSlot />}
          {slots.mainColumn ?? (
            <IdsAppShellMainColumn>
              {slots.pageHeader ?? (
                <IdsAppShellPageHeader>
                  {slots.pageTitle ?? <IdsAppShellPageTitle />}
                  {slots.pageDescription ?? <IdsAppShellPageDescription />}
                </IdsAppShellPageHeader>
              )}
              {slots.bodyViewport ?? (
                <IdsAppShellBodyViewport>
                  {slots.bodyContent ?? <IdsAppShellBodyContentSlot />}
                </IdsAppShellBodyViewport>
              )}
              {slots.footer ?? <IdsAppShellFooterSlot />}
            </IdsAppShellMainColumn>
          )}
        </IdsAppShellBodyRow>
      )}
    </>
  ) : (
    <>
      <IdsAppShellMastheadSlot />
      <IdsAppShellBodyRow />
    </>
  );

  return (
    <IdsAppShellContext.Provider value={ctx}>
      <div
        className={cx(s.root, className)}
        data-ids="IdsAppShell"
        data-breakpoint-preset={breakpointPreset}
        {...rest}
      >
        {tree}
      </div>
    </IdsAppShellContext.Provider>
  );
}

IdsAppShell.displayName = "IdsAppShell";

export const IdsAppShellCompound = Object.assign(IdsAppShell, {
  MastheadSlot: IdsAppShellMastheadSlot,
  BodyRow: IdsAppShellBodyRow,
  MainMenuSlot: IdsAppShellMainMenuSlot,
  MainColumn: IdsAppShellMainColumn,
  PageHeader: IdsAppShellPageHeader,
  PageTitle: IdsAppShellPageTitle,
  PageDescription: IdsAppShellPageDescription,
  BodyViewport: IdsAppShellBodyViewport,
  BodyContentSlot: IdsAppShellBodyContentSlot,
  FooterSlot: IdsAppShellFooterSlot,
  HeaderActions: IdsAppShellHeaderActions,
  PagePanel: IdsAppShellPagePanel,
});

/** Anatomy alias — root is AppShell, not AppShellRoot. */
export const AppShell = IdsAppShellCompound;

/** Re-export Masthead action primitives for composition inside `headerActions`. */
export {
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
};

/** Figma App Shell sample actions (`43478:46307`) — Storybook / demos only. */
export function AppShellSpecAccurateHeaderActions(): ReactNode {
  return (
    <IdsAppShellHeaderActions>
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton
          aria-label="Search"
          icon={<IdsIcon shape="search-16" size={16} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Alerts, 3 unread"
          badgeCount={3}
          badgeType="critical"
          icon={<IdsIcon shape="alert-bell-16" size={16} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Jobs queue, 2 active"
          badgeCount={2}
          badgeType="success"
          icon={<IdsIcon shape="jobs-queue-stack" size={16} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Settings"
          icon={<IdsIcon shape="setting-gear-16" size={16} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Help"
          icon={<IdsIcon shape="help-circ-16" size={16} />}
        />
      </IdsMastheadActionButtonContainer>
    </IdsAppShellHeaderActions>
  );
}

/** Default App Launcher instance for spec-accurate Storybook samples. */
export function AppShellSpecAccurateAppLauncher(): ReactNode {
  return (
    <AppLauncher
      triggerVariant="masthead"
      sideOffset={0}
      products={[
        { id: "p1", name: "Product Name 1" },
        { id: "p2", name: "Product Name 2" },
      ]}
    />
  );
}

export default IdsAppShellCompound;
