import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  LeftNavSecondaryContextMenu,
  type LeftNavSecondaryContextMenuOption,
} from "./LeftNavSecondaryContextMenu";
import {
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
  MainMenuLeftLogoSlot,
} from "./MainMenuLeft.compose";
import { MainMenuLeftContext, type MainMenuLeftContextValue } from "./MainMenuLeftContext";
import styles from "./MainMenuLeft.module.css";
import { Icon } from "./Icon";
import { IdsTooltip } from "./IdsTooltip";
import { toPascalState } from "./MainMenuLeft.utils";

export type MainMenuLeftContextMenuOption = LeftNavSecondaryContextMenuOption;

export type MainMenuLeftPrimaryState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "default-focus"
  | "selected-focus";

/** Discriminated navigation target (framework adapters map to `<a>`, `RouterLink`, `<Link>`, etc.). */
export type MainMenuLeftLink =
  | {
      type: "href";
      href: string;
      target?: "_self" | "_blank";
      rel?: string;
    }
  | {
      type: "routerLink";
      /** Angular: `string | any[]`; React Router: `string` — adapter-specific. */
      routerLink: string | readonly string[];
      queryParams?: Record<string, unknown>;
      fragment?: string;
    }
  | { type: "action" };

export interface MainMenuLeftLogo {
  /** Accessible name (required). */
  alt: string;
  /** Raster / SVG URL for brand mark. */
  src?: string;
  /** Or IDS icon slug instead of `src`. */
  iconName?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftSecondaryItem {
  /** Stable id; if omitted, runtime derives from `name`/`label` + parent id + index. */
  id?: string;
  /** Visible text (canonical). */
  name?: string;
  /** Legacy alias for `name` (at least one of `name` / `label` should be set). */
  label?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
  /** @deprecated Use `link: { type: 'href', href }`. */
  href?: string;
  /** @deprecated Use `link: { type: 'routerLink', routerLink }`. */
  routeRef?: string;
  /**
   * User-defined overflow menu rows (Synapse `childrenContextMenu` parents).
   * Popup chrome uses Synapse detached menu (`dropdown-combo-box` spec, Figma `53325:280088`).
   */
  contextMenuOptions?: MainMenuLeftContextMenuOption[];
  /** Storybook / demo — open context menu on mount for this row. */
  contextMenuDefaultOpen?: boolean;
}

export interface MainMenuLeftPrimaryItem {
  id?: string;
  /** Visible text (canonical). */
  name?: string;
  /** Legacy alias for `name` (at least one of `name` / `label` should be set). */
  label?: string;
  tooltip?: string;
  /** Canonical icon slug (`assets/icons/<slug>.svg`). */
  iconName?: string;
  link?: MainMenuLeftLink;
  /** Optional nested rows under this primary item. */
  children?: MainMenuLeftSecondaryItem[];
  /**
   * When true (Synapse), each secondary row under this primary shows an overflow-menu trigger on hover.
   * Host handles menu content via `onSecondaryContextMenu`.
   */
  childrenContextMenu?: boolean;
  /** When `forceStates` is true: initial open state of `children` list in matrix stories. */
  childrenMenu?: "expanded" | "collapsed";
  state?: MainMenuLeftPrimaryState;
  /** @deprecated Use `link: { type: 'href', href }`. */
  href?: string;
  /** @deprecated Use `link: { type: 'routerLink', routerLink }`. */
  routeRef?: string;
}

export interface MainMenuLeftNavigationTarget {
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
  /** @deprecated Populated from legacy `href` when `link` omitted. */
  href?: string;
  /** @deprecated Populated from legacy `routeRef` when `link` omitted. */
  routeRef?: string;
}

/** Current rail selection (deepest active row: secondary beats primary parent). */
export interface MainMenuLeftSelectionDetail {
  level: "primary" | "secondary";
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
  /** @deprecated Mirrors legacy item fields when `link` was inferred. */
  href?: string;
  /** @deprecated Mirrors legacy item fields when `link` was inferred. */
  routeRef?: string;
}

/** Overflow-menu activation on a secondary row (`childrenContextMenu` parent). */
export interface MainMenuLeftSecondaryContextMenuDetail {
  parentItemId: string;
  childId: string;
  name: string;
}

export interface MainMenuLeftProps {
  /** Optional branding block above `MainMenuList` (not in base Figma frame; product slot). */
  logo?: MainMenuLeftLogo;
  /**
   * Rail width mode: expanded `278px` vs collapsed `64px`.
   * With `onExpandedChange`: **controlled** (parent must update this after toggle).
   * Without: **uncontrolled** initial value only.
   */
  expanded?: boolean;
  /** Emits whenever the footer toggles expanded ↔ collapsed (Angular: `@Output()`). */
  onExpandedChange?: (expanded: boolean) => void;
  items: MainMenuLeftPrimaryItem[];
  /**
   * Initial primary selection (must match resolved `item.id` or generated id for that row).
   * Spec Accurate Design: first row (Dashboard) uses `"dashboard"`.
   */
  defaultSelectedItemId?: string;
  /** Pin a primary row’s `children` list open on mount (e.g. Synapse Recent expanded). */
  defaultExpandedChildrenItemId?: string;
  /** Initial secondary selection for demos / Figma parity stories. */
  defaultSelectedSecondaryItemId?: { parentItemId: string; childId: string };
  /** When true, `item.state` fixes visual snapshot (Storybook matrix only). */
  forceStates?: boolean;
  /** Primary / secondary / logo activation (routing host handles `link`). */
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  /** Overflow-menu trigger on a secondary row (Synapse `childrenContextMenu` parents). */
  onSecondaryContextMenu?: (detail: MainMenuLeftSecondaryContextMenuDetail) => void;
  /**
   * Supplies overflow menu options per secondary row when `contextMenuOptions` is omitted on the child.
   * When options resolve to a non-empty list, the built-in popup is rendered (Synapse detached menu, Figma `53325:280088`).
   */
  getSecondaryContextMenuOptions?: (
    detail: MainMenuLeftSecondaryContextMenuDetail,
  ) => MainMenuLeftContextMenuOption[];
  /**
   * Emits when the active menu selection changes (primary or secondary row).
   * **Angular:** `@Output() selectedChange` or `selectionChange` mapping to this callback.
   * Does not fire on mount for `defaultSelectedItemId` alone — only on user-driven updates (and logo is excluded).
   */
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  /** Overrides default `aria-label` on root `nav`. */
  ariaLabel?: string;
  /** Programme layout tokens (`synapse` → 250px rail + neutral-light chrome). Default `ids`. */
  programme?: "ids" | "synapse";
  /**
   * Optional lead row inside `MainMenuList` (Synapse “New Chat”; first in scroll stack, expanded only).
   */
  menuLead?: { label?: string; onAction?: () => void };
  children?: React.ReactNode;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolvePrimaryId(item: MainMenuLeftPrimaryItem, index: number): string {
  if (item.id) return item.id;
  const base = slugify(primaryDisplayName(item));
  return base || `primary-${index}`;
}

function resolveSecondaryId(
  child: MainMenuLeftSecondaryItem,
  parentId: string,
  index: number,
): string {
  if (child.id) return child.id;
  const base = slugify(secondaryDisplayName(child));
  return base ? `${parentId}-${base}` : `${parentId}-child-${index}`;
}

function primaryDisplayName(item: MainMenuLeftPrimaryItem): string {
  return item.name ?? item.label ?? "";
}

function secondaryDisplayName(child: MainMenuLeftSecondaryItem): string {
  return child.name ?? child.label ?? "";
}

function resolveLink(
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftLink | undefined {
  if (link) return link;
  if (legacy.href) return { type: "href", href: legacy.href };
  if (legacy.routeRef) return { type: "routerLink", routerLink: legacy.routeRef };
  return undefined;
}

function buildNavigateTarget(
  itemId: string,
  name: string,
  parentItemId: string | undefined,
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftNavigationTarget {
  const resolved = resolveLink(link, legacy);
  return {
    itemId,
    parentItemId,
    name,
    link: resolved,
    href: legacy.href,
    routeRef: legacy.routeRef,
  };
}

function buildSelectionDetail(
  level: "primary" | "secondary",
  itemId: string,
  parentItemId: string | undefined,
  name: string,
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftSelectionDetail {
  const resolved = resolveLink(link, legacy);
  return {
    level,
    itemId,
    parentItemId,
    name,
    link: resolved,
    href: legacy.href,
    routeRef: legacy.routeRef,
  };
}

function resolveInitialSelectedKey(
  list: MainMenuLeftPrimaryItem[],
  defaultSelectedItemId?: string,
): string | null {
  if (!defaultSelectedItemId) return null;
  for (let i = 0; i < list.length; i++) {
    if (resolvePrimaryId(list[i], i) === defaultSelectedItemId) {
      return defaultSelectedItemId;
    }
  }
  return null;
}

interface ClampedLabelProps {
  text: string;
  tooltip: string;
  wrapperClassName: string;
  textClassName: string;
}

function ClampedLabel({
  text,
  tooltip,
  wrapperClassName,
  textClassName,
}: ClampedLabelProps) {
  const [element, setElement] = useState<HTMLSpanElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);

  useLayoutEffect(() => {
    if (!element) return;

    const check = () => {
      setIsTruncated(
        element.scrollHeight > element.clientHeight + 1 ||
          element.scrollWidth > element.clientWidth + 1,
      );
      setIsWrapped(element.clientHeight > 32);
    };

    check();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(check);
      observer.observe(element);
    }

    return () => observer?.disconnect();
  }, [text, element]);

  const label = (
    <span ref={setElement} className={textClassName}>
      {text}
    </span>
  );

  return (
    <span
      className={wrapperClassName}
      data-wrapped={isWrapped ? "true" : undefined}
    >
      {isTruncated ? (
        <IdsTooltip
          content={tooltip}
          triggerDisplay="block"
          side="right"
          arrowAlign="start"
        >
          {label}
        </IdsTooltip>
      ) : (
        label
      )}
    </span>
  );
}

export function MainMenuLeft({
  logo,
  expanded = true,
  onExpandedChange,
  items,
  children,
  defaultSelectedItemId,
  defaultExpandedChildrenItemId,
  defaultSelectedSecondaryItemId,
  forceStates = false,
  onNavigate,
  onSecondaryContextMenu,
  getSecondaryContextMenuOptions,
  onSelected,
  ariaLabel = "Main menu left",
  programme = "ids",
  menuLead,
}: MainMenuLeftProps) {
  const useComposition = items === undefined;
  const controlled = onExpandedChange !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  useEffect(() => {
    if (!controlled) setInternalExpanded(expanded);
  }, [expanded, controlled]);

  const railExpanded = controlled ? (expanded ?? true) : internalExpanded;

  const setRailExpanded = (next: boolean) => {
    if (!controlled) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    resolveInitialSelectedKey(items ?? [], defaultSelectedItemId),
  );
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(
    () => defaultExpandedChildrenItemId ?? null,
  );
  const [selectedSecondaryParentKey, setSelectedSecondaryParentKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.parentItemId ?? null,
  );
  const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.childId ?? null,
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const getFocusableButtons = () => {
    const container = contentRef.current;
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLButtonElement>(
        'button:not([tabindex="-1"])',
      ),
    );
  };

  const moveFocus = (delta: number) => {
    const buttons = getFocusableButtons();
    const active = document.activeElement as HTMLButtonElement | null;
    if (!active) return;
    const index = buttons.indexOf(active);
    if (index === -1) return;
    const nextIndex = index + delta;
    if (nextIndex >= 0 && nextIndex < buttons.length) {
      buttons[nextIndex].focus();
    }
  };

  const focusFirst = () => {
    const buttons = getFocusableButtons();
    buttons[0]?.focus();
  };

  const focusLast = () => {
    const buttons = getFocusableButtons();
    buttons[buttons.length - 1]?.focus();
  };

  const focusParent = (parentItemId: string) => {
    contentRef.current
      ?.querySelector<HTMLButtonElement>(`[data-item-id="${parentItemId}"]`)
      ?.focus();
  };

  const contextValue = { railExpanded, forceStates } as unknown as MainMenuLeftContextValue;

  return (
    <MainMenuLeftContext.Provider value={contextValue}>
      <nav
        className={[
          styles.root,
          railExpanded ? styles.expanded : styles.collapsed,
          programme === "synapse" ? styles.programmeSynapse : "",
          programme === "synapse" && railExpanded ? styles.programmeSynapseExpanded : "",
          programme === "synapse" && !railExpanded ? styles.programmeSynapseCollapsed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-label={ariaLabel}
      >
        {logo ? <MainMenuLeftLogoFromData logo={logo} onNavigate={onNavigate} /> : null}

        <div className={styles.content} ref={contentRef}>
          {menuLead && (railExpanded || programme === "synapse") ? (
            <MenuLeadBlock menuLead={menuLead} railExpanded={railExpanded} />
          ) : null}

          {useComposition ? (
            children
          ) : (
            <MainMenuLeftItemsAdapter
              items={items ?? []}
              railExpanded={railExpanded}
              forceStates={forceStates}
              selectedKey={selectedKey}
              expandedChildrenKey={expandedGroupId}
              selectedSecondaryParentKey={selectedSecondaryParentKey}
              selectedSecondaryKey={selectedSecondaryKey}
              programme={programme}
              onNavigate={onNavigate}
              onSelected={onSelected}
              onSecondaryContextMenu={onSecondaryContextMenu}
              getSecondaryContextMenuOptions={getSecondaryContextMenuOptions}
              setSelectedKey={setSelectedKey}
              setExpandedChildrenKey={setExpandedGroupId}
              setSelectedSecondaryParentKey={setSelectedSecondaryParentKey}
              setSelectedSecondaryKey={setSelectedSecondaryKey}
              moveFocus={moveFocus}
              focusFirst={focusFirst}
              focusLast={focusLast}
              focusParent={focusParent}
            />
          )}
        </div>

      <div className={styles.bottomToggle}>
        <button
          type="button"
          className={styles.bottomToggleButton}
          aria-label={railExpanded ? "Collapse" : "Expand"}
          onClick={() => setRailExpanded(!railExpanded)}
        >
          <Icon
            shapeName={railExpanded ? "double-chev-left" : "double-chev-right"}
            className={styles.bottomToggleIcon}
            style={{ width: 16, height: 16, flexShrink: 0 }}
          />
        </button>
      </div>
      </nav>
    </MainMenuLeftContext.Provider>
  );
}

function MainMenuLeftLogoFromData({
  logo,
  onNavigate,
}: {
  logo: MainMenuLeftLogo;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
}) {
  if (logo.link) {
    return (
      <div className={styles.logoSlot}>
        <button
          type="button"
          className={styles.logoButton}
          title={logo.tooltip ?? logo.alt}
          aria-label={logo.alt}
          onClick={() =>
            onNavigate?.(buildNavigateTarget("__logo__", logo.alt, undefined, logo.link, {}))
          }
        >
          <LogoMark logo={logo} />
        </button>
      </div>
    );
  }
  return (
    <MainMenuLeftLogoSlot
      alt={logo.alt}
      src={logo.src}
      iconName={logo.iconName}
      tooltip={logo.tooltip}
    />
  );
}

function LogoMark({ logo }: { logo: MainMenuLeftLogo }) {
  if (logo.src) {
    return <img src={logo.src} alt="" className={styles.logoImg} width={32} height={32} />;
  }
  if (logo.iconName) {
    return <Icon shapeName={logo.iconName} className={styles.logoIcon} />;
  }
  return null;
}

function MenuLeadBlock({
  menuLead,
  railExpanded,
}: {
  menuLead: NonNullable<MainMenuLeftProps["menuLead"]>;
  railExpanded: boolean;
}) {
  return (
    <div
      className={[styles.menuLeadBlock, !railExpanded ? styles.menuLeadBlockCollapsed : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <button
        type="button"
        className={[
          styles.menuLeadButton,
          !railExpanded ? styles.menuLeadButtonCollapsed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title={menuLead.label ?? "New Chat"}
        aria-label={menuLead.label ?? "New Chat"}
        onClick={() => menuLead.onAction?.()}
      >
        <span className={styles.menuLeadIcon} aria-hidden="true">
          <Icon shapeName="shape-plus" style={{ width: 16, height: 16 }} />
        </span>
        {railExpanded ? (
          <span className={styles.menuLeadLabel}>{menuLead.label ?? "New Chat"}</span>
        ) : null}
      </button>
    </div>
  );
}

interface ItemsAdapterProps {
  items: MainMenuLeftPrimaryItem[];
  railExpanded: boolean;
  forceStates: boolean;
  selectedKey: string | null;
  expandedChildrenKey: string | null;
  selectedSecondaryParentKey: string | null;
  selectedSecondaryKey: string | null;
  programme: "ids" | "synapse";
  onNavigate?: MainMenuLeftProps["onNavigate"];
  onSelected?: MainMenuLeftProps["onSelected"];
  onSecondaryContextMenu?: MainMenuLeftProps["onSecondaryContextMenu"];
  getSecondaryContextMenuOptions?: MainMenuLeftProps["getSecondaryContextMenuOptions"];
  setSelectedKey: (key: string | null) => void;
  setExpandedChildrenKey: (key: string | null) => void;
  setSelectedSecondaryParentKey: (key: string | null) => void;
  setSelectedSecondaryKey: (key: string | null) => void;
  moveFocus: (delta: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusParent: (parentItemId: string) => void;
}

function MainMenuLeftItemsAdapter({
  items,
  railExpanded,
  forceStates,
  selectedKey,
  expandedChildrenKey,
  selectedSecondaryParentKey,
  selectedSecondaryKey,
  programme,
  onNavigate,
  onSelected,
  onSecondaryContextMenu,
  getSecondaryContextMenuOptions,
  setSelectedKey,
  setExpandedChildrenKey,
  setSelectedSecondaryParentKey,
  setSelectedSecondaryKey,
  moveFocus,
  focusFirst,
  focusLast,
  focusParent,
}: ItemsAdapterProps) {
  return (
    <>
        {items.map((item, itemIndex) => {
          const itemId = resolvePrimaryId(item, itemIndex);
          const hasForcedState = forceStates && Boolean(item.state);
          const state = hasForcedState
            ? item.state!
            : selectedKey === itemId
              ? "selected"
              : "default";
          const isSelected = state === "selected" || state === "selected-focus";
          const isFocused = state === "default-focus" || state === "selected-focus";
          const childList = item.children ?? [];
          const hasChildren = childList.length > 0;
          const showChildrenList =
            railExpanded &&
            hasChildren &&
            (hasForcedState ? item.childrenMenu === "expanded" : expandedChildrenKey === itemId);
          const showChevron = railExpanded && hasChildren;
          const primaryIconName = item.iconName ?? "home";
          const hasSelectedSecondary = selectedSecondaryParentKey === itemId;
          const showSelectedInset = hasForcedState
            ? state === "selected" || state === "selected-focus"
            : hasChildren
              ? hasSelectedSecondary
              : selectedKey === itemId;
          // The primary row is the active page when it is a selected leaf, or when it
          // is a parent whose selected secondary child is currently hidden (sub-menu
          // collapsed) — so the row stays marked as the current page after collapse.
          const primaryIsCurrentPage =
            (isSelected && !hasSelectedSecondary) ||
            (hasSelectedSecondary && !showChildrenList);
          const primaryLabel = primaryDisplayName(item);
          const primaryTitle = item.tooltip ?? primaryLabel;
          const secondaryContextMenuEnabled =
            programme === "synapse" && Boolean(item.childrenContextMenu);

          const openPrimary = () => {
            if (hasForcedState) return;

            if (hasChildren && railExpanded) {
              if (!showChildrenList) {
                // Open the sub-menu.
                setExpandedChildrenKey(itemId);
              }
              return;
            }

            setSelectedKey(itemId);
            onNavigate?.(
              buildNavigateTarget(itemId, primaryLabel, undefined, item.link, {
                href: item.href,
                routeRef: item.routeRef,
              }),
            );
            onSelected?.(
              buildSelectionDetail("primary", itemId, undefined, primaryLabel, item.link, {
                href: item.href,
                routeRef: item.routeRef,
              }),
            );
            setSelectedSecondaryParentKey(null);
            setSelectedSecondaryKey(null);
          };

          const togglePrimary = () => {
            if (hasForcedState) return;

            // Parent rows (with children) act as sub-menu accordions when the
            // rail is expanded. Expanding/collapsing only toggles the sub-menu —
            // it must not navigate or change the active selection, so the user
            // stays on the current page. Navigation comes from the secondary rows.
            if (hasChildren && railExpanded) {
              setExpandedChildrenKey(expandedChildrenKey === itemId ? null : itemId);
              return;
            }

            setSelectedKey(itemId);
            onNavigate?.(
              buildNavigateTarget(itemId, primaryLabel, undefined, item.link, {
                href: item.href,
                routeRef: item.routeRef,
              }),
            );
            onSelected?.(
              buildSelectionDetail("primary", itemId, undefined, primaryLabel, item.link, {
                href: item.href,
                routeRef: item.routeRef,
              }),
            );
            setSelectedSecondaryParentKey(null);
            setSelectedSecondaryKey(null);
          };

          const handlePrimaryKeyDown = (
            event: React.KeyboardEvent<HTMLButtonElement>,
          ) => {
            if (hasForcedState) return;

            switch (event.key) {
              case "ArrowUp":
                event.preventDefault();
                moveFocus(-1);
                break;
              case "ArrowDown":
                event.preventDefault();
                moveFocus(1);
                break;
              case "Home":
                event.preventDefault();
                focusFirst();
                break;
              case "End":
                event.preventDefault();
                focusLast();
                break;
              case "ArrowRight":
                if (hasChildren && railExpanded) {
                  event.preventDefault();
                  if (!showChildrenList) {
                    setExpandedChildrenKey(itemId);
                    setTimeout(() => moveFocus(1), 0);
                  } else {
                    moveFocus(1);
                  }
                }
                break;
              case "ArrowLeft":
                if (showChildrenList) {
                  event.preventDefault();
                  setExpandedChildrenKey(null);
                }
                break;
              case "Escape":
                if (showChildrenList) {
                  event.preventDefault();
                  setExpandedChildrenKey(null);
                }
                break;
              case "Enter":
              case " ":
                event.preventDefault();
                openPrimary();
                break;
            }
          };

          return (
            <div key={itemId} className={styles.itemBlock}>
              <button
                type="button"
                data-item-id={itemId}
                title={!railExpanded ? primaryTitle : undefined}
                onClick={togglePrimary}
                onKeyDown={handlePrimaryKeyDown}
                className={[
                  styles.primaryRow,
                  !hasForcedState ? styles.interactive : "",
                  styles[`state${toPascalState(state)}`],
                  hasSelectedSecondary ? styles.secondaryParentSelected : "",
                  showSelectedInset ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={primaryIsCurrentPage ? "page" : undefined}
                aria-expanded={showChevron ? showChildrenList : undefined}
                // Forced-state snapshot rows (matrix) are visual only: keep them out of
                // the tab order so they never take real keyboard focus / a real focus ring.
                tabIndex={hasForcedState ? -1 : undefined}
              >
                <Icon shapeName={primaryIconName} className={styles.primaryIcon} />
                {railExpanded ? (
                  <ClampedLabel
                    text={primaryLabel}
                    tooltip={item.tooltip ?? primaryLabel}
                    wrapperClassName={styles.primaryLabel}
                    textClassName={styles.primaryLabelText}
                  />
                ) : null}
                {showChevron ? (
                  <Icon
                    shapeName={showChildrenList ? "chev-down-thick" : "chev-right-thick"}
                    className={styles.chevronIcon}
                    style={{ width: 14, height: 14 }}
                  />
                ) : null}
                {isFocused ? <span className={styles.focusRing} aria-hidden="true" /> : null}
                {showSelectedInset ? <span className={styles.selectedInset} aria-hidden="true" /> : null}
              </button>

            {showChildrenList ? (
              <div className={styles.secondarySection}>
                {childList.map((child, childIndex) => {
                  const childId = resolveSecondaryId(child, itemId, childIndex);
                  const childLabel = secondaryDisplayName(child);
                  const isSecondarySelected =
                    selectedSecondaryParentKey === itemId && selectedSecondaryKey === childId;

                  const activateSecondary = () => {
                    setSelectedKey(null);
                    setSelectedSecondaryParentKey(itemId);
                    setSelectedSecondaryKey(childId);
                    onNavigate?.(
                      buildNavigateTarget(childId, childLabel, itemId, child.link, {
                        href: child.href,
                        routeRef: child.routeRef,
                      }),
                    );
                    onSelected?.(
                      buildSelectionDetail("secondary", childId, itemId, childLabel, child.link, {
                        href: child.href,
                        routeRef: child.routeRef,
                      }),
                    );
                  };

                  if (secondaryContextMenuEnabled) {
                    const contextMenuDetail: MainMenuLeftSecondaryContextMenuDetail = {
                      parentItemId: itemId,
                      childId,
                      name: childLabel,
                    };

                    const handleSecondaryKeyDown = (
                      event: React.KeyboardEvent<HTMLButtonElement>,
                    ) => {
                      switch (event.key) {
                        case "ArrowUp":
                          event.preventDefault();
                          moveFocus(-1);
                          break;
                        case "ArrowDown":
                          event.preventDefault();
                          moveFocus(1);
                          break;
                        case "Home":
                          event.preventDefault();
                          focusFirst();
                          break;
                        case "End":
                          event.preventDefault();
                          focusLast();
                          break;
                        case "ArrowLeft":
                          event.preventDefault();
                          focusParent(itemId);
                          break;
                        case "Escape":
                          event.preventDefault();
                          setExpandedChildrenKey(null);
                          setTimeout(() => focusParent(itemId), 0);
                          break;
                        case "Enter":
                        case " ":
                          event.preventDefault();
                          activateSecondary();
                          break;
                      }
                    };

                    if (secondaryContextMenuEnabled) {
                      const contextMenuDetail: MainMenuLeftSecondaryContextMenuDetail = {
                        parentItemId: itemId,
                        childId,
                        name: childLabel,
                      };
                      const resolvedContextMenuOptions =
                        child.contextMenuOptions?.length
                          ? child.contextMenuOptions
                          : getSecondaryContextMenuOptions?.(contextMenuDetail) ?? [];

                      return (
                        <div
                          key={childId}
                          className={[
                            styles.secondaryRowWrap,
                            isSecondarySelected ? styles.secondaryRowSelected : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <button
                            type="button"
                            data-item-id={childId}
                            data-parent-id={itemId}
                            className={styles.secondaryRowLabel}
                            aria-current={isSecondarySelected ? "page" : undefined}
                            onClick={activateSecondary}
                            onKeyDown={handleSecondaryKeyDown}
                          >
                            <ClampedLabel
                              text={childLabel}
                              tooltip={child.tooltip ?? childLabel}
                              wrapperClassName={styles.secondaryRowLabelInner}
                              textClassName={styles.secondaryRowLabelText}
                            />
                          </button>
                          {resolvedContextMenuOptions.length > 0 ? (
                            <LeftNavSecondaryContextMenu
                              childLabel={childLabel}
                              options={resolvedContextMenuOptions}
                              defaultOpen={child.contextMenuDefaultOpen}
                              onOpenChange={(nextOpen) => {
                                if (nextOpen) {
                                  onSecondaryContextMenu?.(contextMenuDetail);
                                }
                              }}
                            />
                          ) : (
                            <button
                              type="button"
                              className={styles.secondaryContextButton}
                              title="More actions"
                              aria-label={`More actions for ${childLabel}`}
                              aria-haspopup="menu"
                              onClick={(event) => {
                                event.stopPropagation();
                                onSecondaryContextMenu?.(contextMenuDetail);
                              }}
                            >
                              <Icon
                                shapeName="overflow-menu-dots"
                                className={styles.secondaryContextIcon}
                                style={{ width: 16, height: 16 }}
                              />
                            </button>
                          )}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={childId}
                        type="button"
                        data-item-id={childId}
                        data-parent-id={itemId}
                        className={[
                          styles.secondaryRowWrap,
                          isSecondarySelected ? styles.secondaryRowSelected : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-current={isSecondarySelected ? "page" : undefined}
                        onClick={activateSecondary}
                        onKeyDown={handleSecondaryKeyDown}
                      >
                        <ClampedLabel
                          text={childLabel}
                          tooltip={child.tooltip ?? childLabel}
                          wrapperClassName={styles.secondaryLabel}
                          textClassName={styles.secondaryLabelText}
                        />
                      </button>
                    );
                  }

                  return (
                    <button
                      key={childId}
                      type="button"
                      title={child.tooltip ?? childLabel}
                      className={[
                        styles.secondaryRow,
                        styles.secondaryInteractive,
                        isSecondarySelected ? styles.secondaryRowSelected : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-current={isSecondarySelected ? "page" : undefined}
                      onClick={activateSecondary}
                    >
                      {childLabel}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export {
  MainMenuLeftChildren,
  MainMenuLeftGroup,
  MainMenuLeftItem,
  MainMenuLeftItemIcon,
  MainMenuLeftLogoSlot,
} from "./MainMenuLeft.compose";
