import { useEffect, useState } from "react";
import styles from "./MainMenuLeft.module.css";
import { Icon } from "./Icon";

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

export function MainMenuLeft({
  logo,
  expanded = true,
  onExpandedChange,
  items,
  defaultSelectedItemId,
  defaultExpandedChildrenItemId,
  defaultSelectedSecondaryItemId,
  forceStates = false,
  onNavigate,
  onSecondaryContextMenu,
  onSelected,
  ariaLabel = "Main menu left",
  programme = "ids",
  menuLead,
}: MainMenuLeftProps) {
  const controlled = onExpandedChange !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(expanded);
  useEffect(() => {
    if (!controlled) {
      setInternalExpanded(expanded);
    }
  }, [expanded, controlled]);

  const isExpanded = controlled ? (expanded ?? true) : internalExpanded;

  const setRailExpanded = (next: boolean) => {
    if (!controlled) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  };

  const [selectedKey, setSelectedKey] = useState<string | null>(() =>
    resolveInitialSelectedKey(items, defaultSelectedItemId),
  );
  const [expandedChildrenKey, setExpandedChildrenKey] = useState<string | null>(
    () => defaultExpandedChildrenItemId ?? null,
  );
  const [selectedSecondaryParentKey, setSelectedSecondaryParentKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.parentItemId ?? null,
  );
  const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string | null>(
    () => defaultSelectedSecondaryItemId?.childId ?? null,
  );

  return (
    <nav
      className={[
        styles.root,
        isExpanded ? styles.expanded : styles.collapsed,
        programme === "synapse" ? styles.programmeSynapse : "",
        programme === "synapse" && isExpanded ? styles.programmeSynapseExpanded : "",
        programme === "synapse" && !isExpanded ? styles.programmeSynapseCollapsed : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
    >
      {logo ? (
        <div className={styles.logoSlot}>
          {logo.link ? (
            <button
              type="button"
              className={styles.logoButton}
              title={logo.tooltip ?? logo.alt}
              aria-label={logo.alt}
              onClick={() =>
                onNavigate?.(
                  buildNavigateTarget("__logo__", logo.alt, undefined, logo.link, {}),
                )
              }
            >
              <LogoMark logo={logo} />
            </button>
          ) : (
            <div className={styles.logoStatic} role="img" aria-label={logo.alt} title={logo.tooltip}>
              <LogoMark logo={logo} />
            </div>
          )}
        </div>
      ) : null}

      <div className={styles.content}>
        {menuLead && (isExpanded || programme === "synapse") ? (
          <div
            className={[
              styles.menuLeadBlock,
              !isExpanded ? styles.menuLeadBlockCollapsed : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              type="button"
              className={[
                styles.menuLeadButton,
                !isExpanded ? styles.menuLeadButtonCollapsed : "",
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
              {isExpanded ? (
                <span className={styles.menuLeadLabel}>{menuLead.label ?? "New Chat"}</span>
              ) : null}
            </button>
          </div>
        ) : null}
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
            isExpanded &&
            hasChildren &&
            (hasForcedState ? item.childrenMenu === "expanded" : expandedChildrenKey === itemId);
          const showChevron = isExpanded && hasChildren;
          const primaryIconName = item.iconName ?? "home";
          const hasSelectedSecondary = selectedSecondaryParentKey === itemId;
          const showSelectedInset = hasForcedState
            ? state === "selected" || state === "selected-focus"
            : hasChildren
              ? hasSelectedSecondary
              : selectedKey === itemId;
          const primaryLabel = primaryDisplayName(item);
          const primaryTitle = item.tooltip ?? primaryLabel;
          const secondaryContextMenuEnabled =
            programme === "synapse" && Boolean(item.childrenContextMenu);

          return (
            <div key={itemId} className={styles.itemBlock}>
              <button
                type="button"
                title={primaryTitle}
                onClick={() => {
                  if (hasForcedState) return;
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
                  if (!hasChildren) {
                    setSelectedSecondaryParentKey(null);
                    setSelectedSecondaryKey(null);
                    return;
                  }
                  if (!isExpanded) return;
                  setExpandedChildrenKey((prev) => {
                    const next = prev === itemId ? null : itemId;
                    if (next === null) {
                      setSelectedSecondaryParentKey(null);
                      setSelectedSecondaryKey(null);
                    }
                    return next;
                  });
                }}
                className={[
                  styles.primaryRow,
                  !hasForcedState ? styles.interactive : "",
                  styles[`state${toPascal(state)}`],
                  hasSelectedSecondary ? styles.secondaryParentSelected : "",
                  showSelectedInset ? styles.selected : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-current={
                  isSelected && !(hasChildren && hasSelectedSecondary) ? "page" : undefined
                }
                aria-expanded={showChevron ? showChildrenList : undefined}
              >
                <Icon shapeName={primaryIconName} className={styles.primaryIcon} />
                {isExpanded ? <span className={styles.primaryLabel}>{primaryLabel}</span> : null}
                {showChevron ? (
                  <Icon
                    shapeName={showChildrenList ? "chev-down-thick" : "chev-right-thick"}
                    className={styles.chevronIcon}
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
                            title={child.tooltip ?? childLabel}
                            className={styles.secondaryRowLabel}
                            aria-current={isSecondarySelected ? "page" : undefined}
                            onClick={activateSecondary}
                          >
                            {childLabel}
                          </button>
                          <button
                            type="button"
                            className={styles.secondaryContextButton}
                            title="More actions"
                            aria-label={`More actions for ${childLabel}`}
                            aria-haspopup="menu"
                            onClick={(event) => {
                              event.stopPropagation();
                              onSecondaryContextMenu?.({
                                parentItemId: itemId,
                                childId,
                                name: childLabel,
                              });
                            }}
                          >
                            <Icon
                              shapeName="overflow-menu-dots"
                              className={styles.secondaryContextIcon}
                              style={{ width: 16, height: 16 }}
                            />
                          </button>
                        </div>
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
      </div>

      <div className={styles.bottomToggle}>
        <button
          type="button"
          className={styles.bottomToggleButton}
          aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
          onClick={() => {
            setRailExpanded(!isExpanded);
            setExpandedChildrenKey(null);
          }}
        >
          <Icon
            shapeName={isExpanded ? "double-chev-left" : "double-chev-right"}
            className={styles.bottomToggleIcon}
            style={{ width: 16, height: 16, flexShrink: 0 }}
          />
        </button>
      </div>
    </nav>
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

function toPascal(value: MainMenuLeftPrimaryState): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
