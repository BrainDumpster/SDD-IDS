import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { AppLauncher } from "./AppLauncher";
import { Icon } from "./Icon";
import { IdsFooter, type IdsFooterProps } from "./IdsFooter";
import {
  IdsMasthead,
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
} from "./IdsMasthead";
import {
  MainMenuLeft,
  type MainMenuLeftLogo,
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftSelectionDetail,
} from "./MainMenuLeft";
import styles from "./AppShell.module.css";

/** Composes existing IDS Masthead + Main Menu / Left + Footer specs — see design-spec.md child mapping. */
const MENU_EXPANDED_BREAKPOINT_PX = 1600;
const MENU_EXPANDED_STORAGE_KEY = "ids.app-shell.menuExpanded";

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
    // Ignore quota / private-mode failures; breakpoint default applies next mount.
  }
}

export interface AppShellPage {
  id: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  content: ReactNode;
  menuItemId?: string;
}

export interface AppShellHeaderActionsProps {
  /** Any masthead action chrome: icon buttons, search fields, dropdown triggers, badges, etc. */
  children: ReactNode;
  className?: string;
}

/**
 * Composable masthead actions region (maps to Masthead `iconsSlot`).
 * Host supplies children and wires `(click)` / `onClick` on each control — no config array.
 *
 * @example
 * <AppShellHeaderActions>
 *   <MySearchInput />
 *   <IdsMastheadActionButtonContainer>
 *     <IdsMastheadActionIconButton
 *       aria-label="Alerts, 3 unread"
 *       badgeCount={3}
 *       badgeType="critical"
 *       icon={...}
 *       onClick={openAlerts}
 *     />
 *   </IdsMastheadActionButtonContainer>
 * </AppShellHeaderActions>
 */
export function AppShellHeaderActions({
  children,
  className,
}: AppShellHeaderActionsProps) {
  return (
    <div className={[styles.headerActions, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/** Re-export Masthead action primitives for composition inside `headerActions`. */
export {
  IdsMastheadActionButtonContainer,
  IdsMastheadActionIconButton,
  IdsMastheadAvatar,
};

export interface AppShellProps {
  pages: AppShellPage[];
  activePageId?: string;
  defaultPageId?: string;
  onPageChange?: (pageId: string, page: AppShellPage) => void;
  /** → Main Menu Left `items` — see `components/ids/main-menu-left/design-spec.md`. */
  menuItems: MainMenuLeftPrimaryItem[];
  /** → Main Menu Left `logo`. */
  menuLogo?: MainMenuLeftLogo;
  /** → Main Menu Left `ariaLabel`. */
  menuAriaLabel?: string;
  /** → Main Menu Left `defaultSelectedItemId` (initial highlight only). */
  defaultMenuSelectedItemId?: string;
  /** → Main Menu Left `expanded` (controlled with `onMenuExpandedChange`). */
  menuExpanded?: boolean;
  defaultMenuExpanded?: boolean;
  /**
   * Persist user menu expand/collapse in `sessionStorage` key `ids.app-shell.menuExpanded`
   * (`"true"` / `"false"`). Stored value wins over breakpoint default.
   */
  persistMenuExpanded?: boolean;
  /** ← Main Menu Left `onExpandedChange`. */
  onMenuExpandedChange?: (expanded: boolean) => void;
  /** ← Main Menu Left `onNavigate`. */
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  /** ← Main Menu Left `onSelected`. */
  onMenuSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  /** → Masthead `productName` — see `components/ids/masthead/design-spec.md`. */
  mastheadProductName: string;
  /**
   * Optional product-logo slug used only when `mastheadLogo` is omitted.
   * No runtime default — omit both to render product name only.
   */
  mastheadProductIconSlug?: string;
  /** → Masthead `logo` — optional host-composed mark; omit when unused. */
  mastheadLogo?: ReactNode;
  /**
   * → Masthead `iconsSlot`. Optional host-composed utility region (search, action icons, …).
   * Use `<AppShellHeaderActions>` or any custom tree; wire click handlers on each child.
   * Omit for none — no fixed Figma icon list is injected at runtime.
   */
  headerActions?: ReactNode;
  /** → Masthead `appLauncherSlot` — optional; omit when unused. */
  appLauncherSlot?: ReactNode;
  /** → Masthead `avatarSlot` — optional host-composed control; omit when unused. */
  avatarSlot?: ReactNode;
  footer?: IdsFooterProps;
  showPageDescription?: boolean;
  focusManagementOnNavigate?: boolean;
  className?: string;
}

/** Figma App Shell sample actions (`43478:46307`) — use in Storybook / demos only. */
export function AppShellSpecAccurateHeaderActions(): ReactNode {
  const iconProps = { width: 16, height: 16 } as const;
  return (
    <AppShellHeaderActions>
      <IdsMastheadActionButtonContainer>
        <IdsMastheadActionIconButton
          aria-label="Search"
          icon={<Icon shapeName="search-16" style={iconProps} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Alerts, 3 unread"
          badgeCount={3}
          badgeType="critical"
          icon={<Icon shapeName="alert-bell-16" style={iconProps} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Jobs queue, 2 active"
          badgeCount={2}
          badgeType="success"
          icon={<Icon shapeName="jobs-queue-stack" style={iconProps} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Settings"
          icon={<Icon shapeName="setting-gear-16" style={iconProps} />}
        />
        <IdsMastheadActionIconButton
          aria-label="Help"
          icon={<Icon shapeName="help-circ-16" style={iconProps} />}
        />
      </IdsMastheadActionButtonContainer>
    </AppShellHeaderActions>
  );
}

/** Default App Launcher instance for spec-accurate Storybook samples. */
export function AppShellSpecAccurateAppLauncher(): ReactNode {
  return (
    <AppLauncher
      triggerVariant="masthead"
      sideOffset={0}
      products={[
        { id: "p1", name: "Product Name 1", href: "#" },
        { id: "p2", name: "Product Name 2", href: "#" },
      ]}
    />
  );
}

function useBreakpointMenuDefault(): boolean {
  const [expandedDefault, setExpandedDefault] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia(`(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`);
    const onChange = () => setExpandedDefault(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

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

export function AppShell({
  pages,
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
  footer,
  showPageDescription = true,
  focusManagementOnNavigate = true,
  className,
}: AppShellProps) {
  const breakpointExpanded = useBreakpointMenuDefault();
  const menuControlled = menuExpandedProp !== undefined;
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

  const menuExpanded = menuControlled ? (menuExpandedProp as boolean) : internalMenuExpanded;

  const initialPageId = defaultPageId ?? pages[0]?.id ?? "";
  const pageControlled = activePageIdProp !== undefined;
  const [internalPageId, setInternalPageId] = useState(initialPageId);
  const activePageId = pageControlled ? (activePageIdProp as string) : internalPageId;
  const initialMenuSelectedItemId =
    defaultMenuSelectedItemId ?? defaultPageId ?? pages[0]?.menuItemId ?? pages[0]?.id;

  const activePage = useMemo(
    () => pages.find((page) => page.id === activePageId) ?? pages[0],
    [pages, activePageId],
  );

  const pageTitleRef = useRef<HTMLHeadingElement>(null);

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
      onNavigate?.(target);
      const pageId = resolvePageIdFromTarget(target, pages);
      if (pageId) {
        setActivePage(pageId);
      }
    },
    [onNavigate, pages, setActivePage],
  );

  const handleMenuExpandedChange = useCallback(
    (expanded: boolean) => {
      if (!menuControlled) {
        setInternalMenuExpanded(expanded);
      }
      if (persistMenuExpanded) {
        writePersistedMenuExpanded(expanded);
      }
      onMenuExpandedChange?.(expanded);
    },
    [menuControlled, persistMenuExpanded, onMenuExpandedChange],
  );

  const showDescription =
    showPageDescription &&
    activePage?.showDescription !== false &&
    Boolean(activePage?.description);

  const mainDescribedBy = showDescription ? "page-description" : undefined;

  const resolvedLogo =
    mastheadLogo ??
    (mastheadProductIconSlug ? (
      <span className={styles.mastheadLogo} aria-hidden="true">
        <Icon shapeName={mastheadProductIconSlug} style={{ width: 32, height: 32 }} />
      </span>
    ) : undefined);

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {/* Masthead — contracts from components/ids/masthead/design-spec.md */}
      <IdsMasthead
        logo={resolvedLogo}
        productName={mastheadProductName}
        iconsSlot={headerActions}
        appLauncherSlot={appLauncherSlot}
        avatarSlot={avatarSlot}
      />

      <div className={styles.bodyRow}>
        <div className={styles.mainMenuSlot}>
          {/* Main Menu / Left — contracts from components/ids/main-menu-left/design-spec.md */}
          <MainMenuLeft
            logo={menuLogo}
            ariaLabel={menuAriaLabel}
            expanded={menuExpanded}
            onExpandedChange={handleMenuExpandedChange}
            items={menuItems}
            defaultSelectedItemId={initialMenuSelectedItemId}
            onNavigate={handleNavigate}
            onSelected={onMenuSelected}
          />
        </div>

        <main
          id="main-content"
          className={styles.mainColumn}
          aria-describedby={mainDescribedBy}
        >
          {/* Page header is always present — title required; description optional */}
          <div className={styles.pageHeader}>
            <h1
              ref={pageTitleRef}
              className={styles.pageTitle}
              tabIndex={focusManagementOnNavigate ? -1 : undefined}
            >
              {activePage?.title ?? ""}
            </h1>
            {showDescription ? (
              <p id="page-description" className={styles.pageDescription}>
                {activePage?.description}
              </p>
            ) : null}
          </div>

          <div className={styles.bodyViewport}>
            <div className={styles.bodyContent}>{activePage?.content}</div>
          </div>

          <div className={styles.footerSlot}>
            <IdsFooter {...footer} />
          </div>
        </main>
      </div>
    </div>
  );
}

AppShell.HeaderActions = AppShellHeaderActions;

export function AppShellPagePanel({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className={styles.pagePanel} aria-label={title}>
      <h2 className={styles.pagePanelTitle}>{title}</h2>
      {children ? <div className={styles.pagePanelBody}>{children}</div> : null}
    </section>
  );
}
