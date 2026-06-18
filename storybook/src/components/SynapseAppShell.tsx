import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { ChatArea } from "./ChatArea";
import { ChatInputBox } from "./ChatInputBox";
import { Icon } from "./Icon";
import { SynapseAppLauncher } from "./SynapseAppLauncher";
import {
  SynapseLeftNav,
  type SynapseLeftNavNavigationTarget,
  type SynapseLeftNavPrimaryItem,
  type SynapseLeftNavSelectionDetail,
} from "./SynapseLeftNav";
import {
  SynapseMasthead,
  SynapseMastheadActionButtonContainer,
  SynapseMastheadActionIconButton,
  SynapseMastheadAvatar,
} from "./SynapseMasthead";
import { SynapseTabs, type SynapseTabItem } from "./SynapseTabs";
import styles from "./SynapseAppShell.module.css";

const MENU_EXPANDED_BREAKPOINT_PX = 1600;

export interface SynapseAppShellPage {
  id: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  content: ReactNode;
  menuItemId?: string;
}

export interface SynapseAppShellHeaderActionsProps {
  children: ReactNode;
  className?: string;
}

export function SynapseAppShellHeaderActions({
  children,
  className,
}: SynapseAppShellHeaderActionsProps) {
  return (
    <div className={[styles.headerActions, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export {
  SynapseMastheadActionButtonContainer,
  SynapseMastheadActionIconButton,
  SynapseMastheadAvatar,
};

export interface SynapseChatTrackerPanelProps {
  title?: string;
  items?: string[];
  className?: string;
}

/** Optional right rail — Chat Tracker placeholder aligned to Figma `48463:143536`. */
export function SynapseChatTrackerPanel({
  title = "Chat Tracker",
  items = [
    "Recommendation",
    "Tracker item placeholder text",
    "Tracker item placeholder text",
    "1. Sub title name",
  ],
  className,
}: SynapseChatTrackerPanelProps) {
  return (
    <aside
      className={[styles.chatTrackerPanel, className].filter(Boolean).join(" ")}
      aria-label={title}
    >
      <h2 className={styles.chatTrackerTitle}>{title}</h2>
      <ul className={styles.chatTrackerList}>
        {items.map((label) => (
          <li key={label} className={styles.chatTrackerItem}>
            <Icon shapeName="shape-check-thick" style={{ width: 16, height: 16 }} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export interface SynapseAppShellProps {
  pages: SynapseAppShellPage[];
  activePageId?: string;
  defaultPageId?: string;
  onPageChange?: (pageId: string, page: SynapseAppShellPage) => void;
  menuItems: SynapseLeftNavPrimaryItem[];
  menuExpanded?: boolean;
  defaultMenuExpanded?: boolean;
  onMenuExpandedChange?: (expanded: boolean) => void;
  onNavigate?: (target: SynapseLeftNavNavigationTarget) => void;
  onMenuSelected?: (detail: SynapseLeftNavSelectionDetail) => void;
  newChat?: { label?: string; onAction?: () => void };
  mastheadProductName: string;
  mastheadLogo?: ReactNode;
  headerActions?: ReactNode;
  appLauncherSlot?: ReactNode;
  avatarSlot?: ReactNode;
  tabBarSlot?: ReactNode;
  showTabBar?: boolean;
  tabItems?: SynapseTabItem[];
  defaultActiveTabId?: string;
  pageHeaderActionsSlot?: ReactNode;
  chatTrackerSlot?: ReactNode;
  showChatTracker?: boolean;
  footerSlot?: ReactNode;
  showFooter?: boolean;
  showPageDescription?: boolean;
  focusManagementOnNavigate?: boolean;
  className?: string;
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
  target: SynapseLeftNavNavigationTarget,
  pages: SynapseAppShellPage[],
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

const icon16 = { width: 16, height: 16 } as const;

/** Figma `48463:143536` masthead utility actions — Storybook / demos only. */
export function SynapseAppShellSpecAccurateHeaderActions(): ReactNode {
  return (
    <SynapseAppShellHeaderActions>
      <SynapseMastheadActionButtonContainer>
        <SynapseMastheadActionIconButton
          aria-label="Help"
          icon={<Icon shapeName="help-circ-16" style={icon16} />}
        />
      </SynapseMastheadActionButtonContainer>
    </SynapseAppShellHeaderActions>
  );
}

export function SynapseAppShellSpecAccurateAppLauncher(): ReactNode {
  return (
    <SynapseAppLauncher
      triggerVariant="masthead"
      sideOffset={0}
      products={[
        { id: "p1", name: "Product Name 1", href: "#" },
        { id: "p2", name: "Product Name 2", href: "#" },
      ]}
    />
  );
}

export function SynapseAppShellSpecAccurateTabBar(): ReactNode {
  return (
    <SynapseTabs
      items={[{ id: "home", label: "Home" }]}
      defaultActiveTabId="home"
      showAddTab
    />
  );
}

export function SynapseAppShellSpecAccuratePageHeaderActions(): ReactNode {
  return (
    <>
      <button type="button" className={styles.pageHeaderIconButton} aria-label="Favorite">
        <Icon shapeName="star-fav" style={icon16} />
      </button>
      <button type="button" className={styles.pageHeaderIconButton} aria-label="Split view">
        <Icon shapeName="view-sort-grid-alt" style={icon16} />
      </button>
      <button type="button" className={styles.pageHeaderIconButton} aria-label="More actions">
        <Icon shapeName="overflow-menu-dots" style={icon16} />
      </button>
    </>
  );
}

const specAccurateChatMessages = [
  {
    id: "u1",
    content: "Show me any high-risk anomalies in the last hour",
    sender: "user" as const,
  },
  {
    id: "s1",
    content:
      "There are 2 high-risk anomalies. The compute cluster is experiencing sustained CPU saturation caused by two workloads competing for resources. In the storage tier, we detected an IO latency spike affecting read operations on NAS-20.",
    sender: "system" as const,
    timestamp: "24 Sep, 11:30 PM",
  },
];

export function SynapseAppShellSpecAccurateChatBody(): ReactNode {
  return (
    <>
      <div className={styles.bodyContent}>
        <ChatArea messages={specAccurateChatMessages} />
      </div>
      <div className={styles.chatInputRegion}>
        <ChatInputBox layout="default" placeholder="Ask me anything" showFooter={false} />
      </div>
    </>
  );
}

export function SynapseAppShell({
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
  newChat,
  mastheadProductName,
  mastheadLogo,
  headerActions,
  appLauncherSlot,
  avatarSlot,
  tabBarSlot,
  showTabBar = false,
  tabItems,
  defaultActiveTabId = "home",
  pageHeaderActionsSlot,
  chatTrackerSlot,
  showChatTracker = false,
  footerSlot,
  showFooter = false,
  showPageDescription = false,
  focusManagementOnNavigate = true,
  className,
}: SynapseAppShellProps) {
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
    (target: SynapseLeftNavNavigationTarget) => {
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

  const resolvedAvatar = avatarSlot ?? <SynapseMastheadAvatar initials="YK" />;

  const resolvedTabBar =
    tabBarSlot ??
    (tabItems ? (
      <SynapseTabs items={tabItems} defaultActiveTabId={defaultActiveTabId} showAddTab />
    ) : (
      <SynapseAppShellSpecAccurateTabBar />
    ));

  const resolvedChatTracker =
    chatTrackerSlot ?? (showChatTracker ? <SynapseChatTrackerPanel /> : null);

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      <SynapseMasthead
        logo={mastheadLogo}
        productName={mastheadProductName}
        iconsSlot={headerActions}
        appLauncherSlot={appLauncherSlot}
        avatarSlot={resolvedAvatar}
      />

      {showTabBar ? <div className={styles.tabBarSlot}>{resolvedTabBar}</div> : null}

      <div className={styles.bodyRow}>
        <div className={styles.leftNavSlot}>
          <SynapseLeftNav
            expanded={menuExpanded}
            onExpandedChange={handleMenuExpandedChange}
            items={menuItems}
            newChat={newChat}
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
            <div className={styles.pageHeaderText}>
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
            {pageHeaderActionsSlot ? (
              <div className={styles.pageHeaderActions}>{pageHeaderActionsSlot}</div>
            ) : null}
          </div>

          <div className={styles.bodyViewport}>{activePage?.content}</div>

          {showFooter && footerSlot ? (
            <div className={styles.footerSlot}>{footerSlot}</div>
          ) : null}
        </main>

        {showChatTracker && resolvedChatTracker ? (
          <div className={styles.chatTrackerSlot}>{resolvedChatTracker}</div>
        ) : null}
      </div>
    </div>
  );
}

SynapseAppShell.HeaderActions = SynapseAppShellHeaderActions;
