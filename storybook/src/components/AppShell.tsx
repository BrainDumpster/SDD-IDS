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
  type MainMenuLeftNavigationTarget,
  type MainMenuLeftPrimaryItem,
  type MainMenuLeftSelectionDetail,
} from "./MainMenuLeft";
import styles from "./AppShell.module.css";

const MENU_EXPANDED_BREAKPOINT_PX = 1600;

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
  menuItems: MainMenuLeftPrimaryItem[];
  menuExpanded?: boolean;
  defaultMenuExpanded?: boolean;
  onMenuExpandedChange?: (expanded: boolean) => void;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  onMenuSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  mastheadProductName: string;
  mastheadProductIconSlug?: string;
  mastheadLogo?: ReactNode;
  /**
   * Composed masthead utility region (left → right), before App Launcher and avatar.
   * Use `<AppShellHeaderActions>` or any custom tree; wire click handlers on each child.
   */
  headerActions?: ReactNode;
  /** Trailing App Launcher; omit for none. */
  appLauncherSlot?: ReactNode;
  /** Trailing user avatar control; defaults to initials chip when omitted. */
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
  menuExpanded: menuExpandedProp,
  defaultMenuExpanded,
  onMenuExpandedChange,
  onNavigate,
  onMenuSelected,
  mastheadProductName,
  mastheadProductIconSlug = "shield-cloud",
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
  const [internalMenuExpanded, setInternalMenuExpanded] = useState(
    defaultMenuExpanded ?? breakpointExpanded,
  );

  useEffect(() => {
    if (!menuControlled && defaultMenuExpanded === undefined) {
      setInternalMenuExpanded(breakpointExpanded);
    }
  }, [breakpointExpanded, menuControlled, defaultMenuExpanded]);

  const menuExpanded = menuControlled ? (menuExpandedProp as boolean) : internalMenuExpanded;

  const initialPageId = defaultPageId ?? pages[0]?.id ?? "";
  const pageControlled = activePageIdProp !== undefined;
  const [internalPageId, setInternalPageId] = useState(initialPageId);
  const activePageId = pageControlled ? (activePageIdProp as string) : internalPageId;

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
      onMenuExpandedChange?.(expanded);
    },
    [menuControlled, onMenuExpandedChange],
  );

  const showDescription =
    showPageDescription &&
    activePage?.showDescription !== false &&
    Boolean(activePage?.description);

  const mainDescribedBy = showDescription ? "page-description" : undefined;

  const resolvedLogo =
    mastheadLogo ?? (
      <span className={styles.mastheadLogo} aria-hidden="true">
        <Icon shapeName={mastheadProductIconSlug} style={{ width: 32, height: 32 }} />
      </span>
    );

  const resolvedAvatar = avatarSlot ?? <IdsMastheadAvatar initials="DT" />;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <IdsMasthead
        logo={resolvedLogo}
        productName={mastheadProductName}
        iconsSlot={headerActions}
        appLauncherSlot={appLauncherSlot}
        avatarSlot={resolvedAvatar}
      />

      <div className={styles.bodyRow}>
        <div className={styles.mainMenuSlot}>
          <MainMenuLeft
            expanded={menuExpanded}
            onExpandedChange={handleMenuExpandedChange}
            items={menuItems}
            defaultSelectedItemId={activePage?.menuItemId ?? activePage?.id}
            onNavigate={handleNavigate}
            onSelected={onMenuSelected}
          />
        </div>

        <main
          id="main-content"
          className={styles.mainColumn}
          aria-describedby={mainDescribedBy}
        >
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
