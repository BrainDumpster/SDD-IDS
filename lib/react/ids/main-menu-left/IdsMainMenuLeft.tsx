/**
 * IDS Main Menu/Left — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/main-menu-left`
 * Source: `components/ids/main-menu-left/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic slot order):
 *   MainMenuLeftRoot (`nav`)
 *     PrimaryMenuLogo?
 *     MainMenuList (scroll)
 *       MainMenuPrimaryItem[]
 *         PrimaryIcon · PrimaryLabel? · PrimaryChevron? · SelectedInset? · FocusRing?
 *         MainMenuSecondaryList? → MainMenuSecondaryItem[]
 *     ExpandCollapse
 *
 * Child components: none — slots are internal. Icons via shared `IdsIcon`.
 * No @base-ui-components dependency.
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IdsIcon } from "../icon";
import {
  IdsTooltip,
  TooltipBody,
  TooltipPanel,
  TooltipTrigger,
} from "../tooltip";
import styles from "./IdsMainMenuLeft.module.css";

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
  /** When `forceStates` is true: pins open/closed of `children` list (Storybook matrix only). */
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

export interface IdsMainMenuLeftProps {
  /** Optional branding block above `MainMenuList` (not in base Figma frame; product slot). */
  logo?: MainMenuLeftLogo;
  /**
   * Rail width mode: expanded `min 256px` / `max 356px` vs collapsed `64px`.
   * With `onExpandedChange`: **controlled** (parent must update this after toggle).
   * Without: **uncontrolled** initial value only (default `true`).
   */
  expanded?: boolean;
  /** Emits whenever the footer toggles expanded ↔ collapsed. */
  onExpandedChange?: (expanded: boolean) => void;
  items: MainMenuLeftPrimaryItem[];
  /**
   * Initial primary selection (must match resolved `item.id` or generated id for that row).
   * Spec Accurate Design: first row (Dashboard) uses `"dashboard"`.
   */
  defaultSelectedItemId?: string;
  /** When true, `item.state` fixes visual snapshot (Storybook matrix only). */
  forceStates?: boolean;
  /** Primary / secondary / logo activation (routing host handles `link`). */
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  /**
   * Emits when the active menu selection changes (primary or secondary row).
   * Does not fire on mount for `defaultSelectedItemId` alone — only on user-driven updates
   * (logo is excluded).
   */
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  /** Overrides default `aria-label` on root `nav`. */
  ariaLabel?: string;
  className?: string;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
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

function toPascal(value: MainMenuLeftPrimaryState): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

interface ClampedLabelProps {
  text: string;
  tooltip: string;
  wrapperClassName: string;
  textClassName: string;
}

/**
 * Two-line clamped label. Marks the wrapper `data-wrapped="true"` when the text
 * wraps to two lines (so the primary icon/chevron top-align via CSS `:has()`),
 * and wraps the text in `IdsTooltip` when it is truncated after clamping.
 */
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
        <IdsTooltip side="right" arrowAlign="start" hugContent>
          <TooltipTrigger display="block">{label}</TooltipTrigger>
          <TooltipPanel>
            <TooltipBody>{tooltip}</TooltipBody>
          </TooltipPanel>
        </IdsTooltip>
      ) : (
        label
      )}
    </span>
  );
}

export function IdsMainMenuLeft({
  logo,
  expanded = true,
  onExpandedChange,
  items,
  defaultSelectedItemId,
  forceStates = false,
  onNavigate,
  onSelected,
  ariaLabel = "Main menu left",
  className,
}: IdsMainMenuLeftProps) {
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
  const [expandedChildrenKey, setExpandedChildrenKey] = useState<string | null>(null);
  const [selectedSecondaryParentKey, setSelectedSecondaryParentKey] = useState<string | null>(
    null,
  );
  const [selectedSecondaryKey, setSelectedSecondaryKey] = useState<string | null>(null);

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

  return (
    <nav
      className={cx(
        styles.root,
        isExpanded ? styles.expanded : styles.collapsed,
        className,
      )}
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
            <div
              className={styles.logoStatic}
              role="img"
              aria-label={logo.alt}
              title={logo.tooltip}
            >
              <LogoMark logo={logo} />
            </div>
          )}
        </div>
      ) : null}

      <div className={styles.content} ref={contentRef}>
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
          // Parent takes aria-current when its selected secondary child is hidden (sub-menu collapsed).
          const primaryIsCurrentPage =
            (isSelected && !hasSelectedSecondary) ||
            (hasSelectedSecondary && !showChildrenList);
          const primaryLabel = primaryDisplayName(item);
          const primaryTitle = item.tooltip ?? primaryLabel;

          // Parent rows (with children, expanded rail): accordion only — no navigate/select.
          const togglePrimary = () => {
            if (hasForcedState) return;

            if (hasChildren && isExpanded) {
              setExpandedChildrenKey((prev: string | null) =>
                prev === itemId ? null : itemId,
              );
              return;
            }

            selectPrimary();
          };

          const selectPrimary = () => {
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

          // Enter/Space activation: a parent primary with a closed sub-menu opens it;
          // a leaf primary selects and emits.
          const openPrimary = () => {
            if (hasForcedState) return;

            if (hasChildren && isExpanded) {
              if (!showChildrenList) {
                setExpandedChildrenKey(itemId);
              }
              return;
            }

            selectPrimary();
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
                if (hasChildren && isExpanded) {
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
                title={!isExpanded ? primaryTitle : undefined}
                onClick={togglePrimary}
                onKeyDown={handlePrimaryKeyDown}
                className={cx(
                  styles.primaryRow,
                  !hasForcedState && styles.interactive,
                  styles[`state${toPascal(state)}` as keyof typeof styles],
                  hasSelectedSecondary && styles.secondaryParentSelected,
                  showSelectedInset && styles.selected,
                )}
                aria-current={primaryIsCurrentPage ? "page" : undefined}
                aria-expanded={showChevron ? showChildrenList : undefined}
                tabIndex={hasForcedState ? -1 : undefined}
              >
                <IdsIcon shape={primaryIconName} size={16} className={styles.primaryIcon} />
                {isExpanded ? (
                  <ClampedLabel
                    text={primaryLabel}
                    tooltip={item.tooltip ?? primaryLabel}
                    wrapperClassName={styles.primaryLabel}
                    textClassName={styles.primaryLabelText}
                  />
                ) : null}
                {showChevron ? (
                  <IdsIcon
                    shape={showChildrenList ? "chev-down-thick" : "chev-right-thick"}
                    size={14}
                    className={styles.chevronIcon}
                  />
                ) : null}
                {isFocused ? <span className={styles.focusRing} aria-hidden="true" /> : null}
                {showSelectedInset ? (
                  <span className={styles.selectedInset} aria-hidden="true" />
                ) : null}
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
                        buildSelectionDetail(
                          "secondary",
                          childId,
                          itemId,
                          childLabel,
                          child.link,
                          {
                            href: child.href,
                            routeRef: child.routeRef,
                          },
                        ),
                      );
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

                    return (
                      <button
                        key={childId}
                        type="button"
                        data-item-id={childId}
                        data-parent-id={itemId}
                        className={cx(
                          styles.secondaryRow,
                          styles.secondaryInteractive,
                          isSecondarySelected && styles.secondaryRowSelected,
                        )}
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
          <IdsIcon
            shape={isExpanded ? "double-chev-left" : "double-chev-right"}
            size={16}
            className={styles.bottomToggleIcon}
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
    return <IdsIcon shape={logo.iconName} size={24} className={styles.logoIcon} />;
  }
  return null;
}

export default IdsMainMenuLeft;
