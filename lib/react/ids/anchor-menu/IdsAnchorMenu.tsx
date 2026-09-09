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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0),
          );
        const top = visible[0];
        if (!top?.target?.id) return;
        setActiveHref(`#${top.target.id}`);
      },
      {
        root: null,
        rootMargin: "0px 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [hashTargets]);

  const navigateToHref = useCallback(
    (href: string) => {
      if (!hasNavigableHref(href)) return;

      setActiveHref(href);
      onItemClick?.(href);

      const sectionId = sectionIdFromHref(href);
      if (sectionId != null) {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
        if (typeof window !== "undefined" && window.history?.replaceState) {
          window.history.replaceState(null, "", href);
        }
      } else if (typeof window !== "undefined") {
        window.location.assign(href);
      }
    },
    [onItemClick],
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
        if (!navigable) {
          event.preventDefault();
          return;
        }
        if (href.startsWith("#")) {
          event.preventDefault();
          navigateToHref(href);
        }
        break;
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
