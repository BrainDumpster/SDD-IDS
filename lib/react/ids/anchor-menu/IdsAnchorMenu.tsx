/**
 * IDS Anchor Menu — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/anchor-menu`
 * Source: `components/ids/anchor-menu/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy / Codegen slots:
 *   AnchorMenuRoot
 *     AnchorMenuHeader?
 *     repeated AnchorMenuItem
 *     AnchorActiveIndicator (left-border indicator on active/hover item)
 *
 * Composition & API (runtime) only — no invented variants/props.
 * No @base-ui-components dependency.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import styles from "./IdsAnchorMenu.module.css";
import { IdsTooltip } from "../tooltip";

export interface IdsAnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

export interface IdsAnchorMenuProps
  extends Omit<ComponentProps<"nav">, "children" | "onClick" | "title"> {
  /** Required. Empty array renders empty state without crash. */
  items: IdsAnchorMenuItem[];
  /** Optional section heading. Default `"On this page"`. */
  title?: string;
  /** Show/hide the heading. Default `true`. */
  header?: boolean;
  /** Sticky positioning for long-page usage. Default `true`. */
  sticky?: boolean;
  /**
   * Gap (px) left above a section when scrolling to it, so it stops a little
   * below the viewport top instead of flush against the edge. Default `24`.
   */
  scrollOffset?: number;
  /**
   * Reveal truncated labels with the browser's built-in `title` tooltip instead
   * of the branded `IdsTooltip`. Default `false` (use `IdsTooltip`).
   */
  nativeTooltip?: boolean;
  onItemClick?: (href: string) => void;
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function hasNavigableHref(href: unknown): href is string {
  return typeof href === "string" && href.trim() !== "";
}

function sectionIdFromHref(href: string): string | null {
  if (!href.startsWith("#") || href.length < 2) return null;
  return href.slice(1);
}

function resolveActiveHref(
  items: IdsAnchorMenuItem[],
  controlled: string | undefined,
): string | undefined {
  if (controlled !== undefined) return controlled;
  const marked = items.find((item) => item.active);
  return marked?.href;
}

export function IdsAnchorMenu({
  items,
  title = "On this page",
  header = true,
  sticky = true,
  scrollOffset = 24,
  nativeTooltip = false,
  onItemClick,
  className,
  ...rest
}: IdsAnchorMenuProps): ReactElement {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeHref, setActiveHref] = useState<string | undefined>(() =>
    resolveActiveHref(safeItems, undefined),
  );
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const labelRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const [truncatedIndexes, setTruncatedIndexes] = useState<Set<number>>(new Set());

  // A manual selection (click / keyboard) is authoritative: it stays active
  // even where the trailing sections share the final viewport, until the user
  // scrolls again themselves. Lock the scroll-spy on selection and release it
  // only on a genuine user scroll gesture — never on the programmatic smooth
  // scroll it triggers, so the indicator can't snap back mid-scroll.
  const spyLockedRef = useRef(false);
  const lockScrollSpy = useCallback(() => {
    spyLockedRef.current = true;
  }, []);

  // Auto-flip the label tooltip: when the menu sits in the right half of the
  // viewport (e.g. a right-hand rail), anchor tooltips on the left so they open
  // toward the page instead of overflowing off the right edge. IdsTooltip has
  // no built-in collision detection, so the menu picks the side itself.
  const navRef = useRef<HTMLElement>(null);
  const [tooltipSide, setTooltipSide] = useState<"left" | "right">("right");

  useEffect(() => {
    if (nativeTooltip || typeof window === "undefined") return;
    const updateSide = () => {
      const nav = navRef.current;
      if (!nav) return;
      const rect = nav.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      setTooltipSide(center > window.innerWidth / 2 ? "left" : "right");
    };
    updateSide();
    window.addEventListener("resize", updateSide);
    return () => window.removeEventListener("resize", updateSide);
  }, [nativeTooltip]);

  const hashTargets = useMemo(
    () =>
      safeItems
        .map((item) =>
          hasNavigableHref(item.href) ? sectionIdFromHref(item.href) : null,
        )
        .filter((id): id is string => id != null),
    [safeItems],
  );

  const propsActiveHref = useMemo(
    () => safeItems.find((item) => item.active)?.href,
    [safeItems],
  );

  // Sync when consumer marks a different `active` item.
  useEffect(() => {
    if (propsActiveHref !== undefined) {
      setActiveHref(propsActiveHref);
    }
  }, [propsActiveHref]);

  // Scroll spy — updates active item from section scroll position.
  useEffect(() => {
    if (typeof window === "undefined" || hashTargets.length === 0) return;

    const elements = hashTargets
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null);

    if (elements.length === 0) return;

    // The active section is the one whose top has last crossed this line near
    // the viewport top (aligned with where clicks land). Computing it from the
    // real positions of ALL sections — rather than from whichever entries an
    // IntersectionObserver batch happens to report — keeps the selection
    // monotonic and matching the section actually in view, so it never jumps
    // around or backwards while scrolling.
    const activeLine = scrollOffset + 1;
    let rafId = 0;

    const computeActive = () => {
      rafId = 0;
      // A manual selection is smooth-scrolling — don't override it.
      if (spyLockedRef.current) return;

      // At the page bottom the trailing sections can't scroll past the line, so
      // pick the last one explicitly to keep it reachable.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveHref(`#${elements[elements.length - 1].id}`);
        return;
      }

      // Among the sections that have crossed the line, take the lowest one
      // (closest to the line from above); before any crosses, take the topmost.
      let currentId: string | null = null;
      let bestTop = -Infinity;
      let topmostId = elements[0].id;
      let topmost = Infinity;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top - activeLine;
        if (top <= 0 && top > bestTop) {
          bestTop = top;
          currentId = el.id;
        }
        if (top < topmost) {
          topmost = top;
          topmostId = el.id;
        }
      }
      setActiveHref(`#${currentId ?? topmostId}`);
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(computeActive);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    computeActive();

    // Release the manual-selection lock only on a real user scroll gesture, so
    // scroll-spy resumes once the user takes over — but never during the
    // programmatic smooth scroll a click starts (that emits no wheel/touch).
    const releaseLock = () => {
      spyLockedRef.current = false;
    };
    const PAGE_SCROLL_KEYS = new Set(["PageUp", "PageDown", "Home", "End"]);
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!spyLockedRef.current || !PAGE_SCROLL_KEYS.has(event.key)) return;
      // Ignore keys handled inside the menu itself.
      if (navRef.current?.contains(event.target as Node)) return;
      releaseLock();
    };
    window.addEventListener("wheel", releaseLock, { passive: true });
    window.addEventListener("touchmove", releaseLock, { passive: true });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", releaseLock);
      window.removeEventListener("touchmove", releaseLock);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [hashTargets, scrollOffset]);

  const navigateToHref = useCallback(
    (href: string) => {
      if (!hasNavigableHref(href)) return;

      setActiveHref(href);
      lockScrollSpy();
      onItemClick?.(href);

      const sectionId = sectionIdFromHref(href);
      if (sectionId != null) {
        const el = document.getElementById(sectionId);
        if (el && typeof window !== "undefined") {
          const top =
            el.getBoundingClientRect().top + window.scrollY - scrollOffset;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        }
        if (typeof window !== "undefined" && window.history?.replaceState) {
          window.history.replaceState(null, "", href);
        }
      } else if (typeof window !== "undefined") {
        window.location.assign(href);
      }
    },
    [onItemClick, lockScrollSpy, scrollOffset],
  );

  const handleItemClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    navigable: boolean,
  ) => {
    if (!navigable) {
      event.preventDefault();
      return;
    }
    if (href.startsWith("#")) {
      event.preventDefault();
      navigateToHref(href);
      return;
    }
    setActiveHref(href);
    onItemClick?.(href);
  };

  const focusItemAt = (index: number) => {
    const len = safeItems.length;
    if (len === 0) return;
    const next = ((index % len) + len) % len;
    itemRefs.current[next]?.focus();
  };

  const handleItemKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
    href: string,
    navigable: boolean,
  ) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusItemAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusItemAt(index - 1);
        break;
      case "Enter":
      case " ":
      case "Spacebar": {
        const isSpace = event.key !== "Enter";
        // Space would otherwise scroll the page; anchors also ignore it, so
        // intercept and activate the link the same way Enter does.
        if (isSpace) event.preventDefault();
        if (!navigable) {
          event.preventDefault();
          return;
        }
        if (href.startsWith("#")) {
          event.preventDefault();
          navigateToHref(href);
        } else if (isSpace) {
          // Enter follows an external link natively; Space must trigger it.
          navigateToHref(href);
        }
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    const nextTruncated = new Set<number>();
    labelRefs.current.forEach((el, index) => {
      if (el.scrollHeight > el.clientHeight) {
        nextTruncated.add(index);
      }
    });
    setTruncatedIndexes(nextTruncated);
  }, [safeItems]);

  return (
    <nav
      {...rest}
      ref={navRef}
      aria-label={title}
      data-ids="ids-anchor-menu"
      data-sticky={sticky ? "true" : "false"}
      className={cx(
        styles["ids-anchor-menu"],
        sticky && styles["ids-anchor-menu--sticky"],
        className,
      )}
    >
      {header ? (
        <span
          className={styles["ids-anchor-menu-header"]}
          data-ids="ids-anchor-menu-header"
        >
          {title}
        </span>
      ) : null}

      <ul className={styles["ids-anchor-menu-list"]} data-ids="ids-anchor-menu-list">
        {safeItems.map((item, index) => {
          const navigable = hasNavigableHref(item.href);
          const href = navigable ? item.href : "";
          const isActive =
            navigable && activeHref !== undefined
              ? activeHref === item.href
              : Boolean(item.active);

          const isTruncated = truncatedIndexes.has(index);
          const useIdsTooltip = isTruncated && !nativeTooltip;
          const nativeTitle =
            isTruncated && nativeTooltip ? item.label : undefined;

          const labelSpan = (
            <span
              ref={(el) => {
                if (el) {
                  labelRefs.current.set(index, el);
                } else {
                  labelRefs.current.delete(index);
                }
              }}
              className={styles["ids-anchor-menu-label"]}
              title={nativeTitle}
            >
              {item.label}
            </span>
          );

          // In `"ids"` mode, anchor the tooltip to the label text (not the
          // padded link) so it sits right beside the text edge.
          const labelContent = useIdsTooltip ? (
            <IdsTooltip side={tooltipSide} arrowAlign="start">
              <IdsTooltip.Trigger display="inline">
                {labelSpan}
              </IdsTooltip.Trigger>
              <IdsTooltip.Panel>
                <IdsTooltip.Body>{item.label}</IdsTooltip.Body>
              </IdsTooltip.Panel>
            </IdsTooltip>
          ) : (
            labelSpan
          );

          const link = (
            <a
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              href={navigable ? href : undefined}
              className={styles["ids-anchor-menu-link"]}
              data-ids="ids-anchor-menu-link"
              aria-current={isActive ? "page" : undefined}
              aria-disabled={navigable ? undefined : true}
              tabIndex={navigable ? 0 : -1}
              onClick={(event) => handleItemClick(event, href, navigable)}
              onKeyDown={(event) =>
                handleItemKeyDown(event, index, href, navigable)
              }
              onFocus={(event) => event.stopPropagation()}
            >
              {labelContent}
            </a>
          );

          return (
            <li
              key={`${item.href}-${index}`}
              className={styles["ids-anchor-menu-item"]}
              data-ids="ids-anchor-menu-item"
            >
              {link}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

IdsAnchorMenu.displayName = "IdsAnchorMenu";

export default IdsAnchorMenu;
