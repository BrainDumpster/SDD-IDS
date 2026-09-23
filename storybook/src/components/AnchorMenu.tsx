import { useState, useEffect, useRef, type ComponentProps } from "react";
import { IdsTooltip } from "./IdsTooltip";
import styles from "./AnchorMenu.module.css";

interface AnchorMenuItem {
  label: string;
  href: string;
  active?: boolean;
}

interface AnchorMenuProps extends ComponentProps<"nav"> {
  items: AnchorMenuItem[];
  header?: boolean;
  title?: string;
}

export function AnchorMenu({ items, header = true, title = "On this page", className, ...rest }: AnchorMenuProps) {
  const [activeHref, setActiveHref] = useState<string | undefined>(
    () => items.find((item) => item.active)?.href
  );
  const [truncatedIndexes, setTruncatedIndexes] = useState<Set<number>>(new Set());
  const labelRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const linkRefs = useRef<HTMLAnchorElement[]>([]);
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLSpanElement | null>(null);
  const [headerTruncated, setHeaderTruncated] = useState(false);

  useEffect(() => {
    const measure = () => {
      const nextTruncated = new Set<number>();
      labelRefs.current.forEach((el, index) => {
        if (el.scrollHeight > el.clientHeight) {
          nextTruncated.add(index);
        }
      });
      setTruncatedIndexes((prev) =>
        prev.size === nextTruncated.size &&
        [...nextTruncated].every((i) => prev.has(i))
          ? prev
          : nextTruncated,
      );

      const headerEl = headerRef.current;
      setHeaderTruncated(
        headerEl ? headerEl.scrollHeight > headerEl.clientHeight : false,
      );
    };

    measure();

    // `-webkit-line-clamp` can settle `clientHeight` a frame after the initial
    // effect runs, and the rail width can change responsively — both flip
    // truncation. A ResizeObserver re-measures once layout is stable.
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => measure());
    if (navRef.current) observer.observe(navRef.current);
    return () => observer.disconnect();
  }, [items, title, header]);

  // Anchor the tooltip to the label (not the padded wrapper) so it lines up
  // with the heading text instead of sitting above it in the padding.
  const headingLabel = (
    <span ref={headerRef} className={styles.headingLabel}>
      {title}
    </span>
  );

  return (
    <nav
      ref={navRef}
      aria-label={title}
      className={[styles.nav, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {header && (
        <span className={styles.heading}>
          {headerTruncated ? (
            <IdsTooltip content={title} triggerDisplay="block">
              {headingLabel}
            </IdsTooltip>
          ) : (
            headingLabel
          )}
        </span>
      )}
      <ul className={styles.list}>
        {items.map((item, index) => {
          const isActive = activeHref !== undefined ? activeHref === item.href : !!item.active;
          const isTruncated = truncatedIndexes.has(index);
          const link = (
            <a
              href={item.href}
              className={[styles.link, isActive ? styles.active : ""]
                .filter(Boolean)
                .join(" ")}
              aria-current={isActive ? "page" : undefined}
              ref={(el) => {
                if (el) {
                  linkRefs.current[index] = el;
                }
              }}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
                if (e.key === "ArrowDown" && index < items.length - 1) {
                  e.preventDefault();
                  linkRefs.current[index + 1]?.focus();
                }
                if (e.key === "ArrowUp" && index > 0) {
                  e.preventDefault();
                  linkRefs.current[index - 1]?.focus();
                }
              }}
              onClick={(e) => {
                setActiveHref(item.href);
                if (item.href.startsWith("#")) {
                  e.preventDefault();
                  document
                    .getElementById(item.href.slice(1))
                    ?.scrollIntoView({ behavior: "smooth" });
                  window.history.replaceState(null, "", item.href);
                }
              }}
            >
              <span
                className={styles.label}
                ref={(el) => {
                  if (el) {
                    labelRefs.current.set(index, el);
                  } else {
                    labelRefs.current.delete(index);
                  }
                }}
              >
                {item.label}
              </span>
            </a>
          );
          return (
            <li key={index} className={styles.item}>
              {isTruncated ? (
                <IdsTooltip content={item.label} triggerDisplay="block">
                  {link}
                </IdsTooltip>
              ) : (
                link
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
