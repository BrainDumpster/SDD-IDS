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
  onItemClick,
  className,
  ...rest
}: IdsAnchorMenuProps): ReactElement {
  const safeItems = Array.isArray(items) ? items : [];
  const [activeHref, setActiveHref] = useState<string | undefined>(() =>
    resolveActiveHref(safeItems, undefined),
  );
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

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

  return (
    <nav
      {...rest}
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

          return (
            <li
              key={`${item.href}-${index}`}
              className={styles["ids-anchor-menu-item"]}
              data-ids="ids-anchor-menu-item"
            >
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
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

IdsAnchorMenu.displayName = "IdsAnchorMenu";

export default IdsAnchorMenu;
