import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";

import { IdsLink } from "../../../lib/react/ids/link";

import idsLinkStyles from "../../../lib/react/ids/link/IdsLink.module.css";

import { DropdownMenu } from "../../../lib/react/ids/dropdown-shared";

import styles from "./IdsBreadcrumb.module.css";



interface BreadcrumbItem {

  label: string;

  href?: string;

}



interface IdsBreadcrumbProps extends ComponentProps<"nav"> {

  /** Array of breadcrumb items */

  items: BreadcrumbItem[];

  /** Current page text (displayed below breadcrumb trail) */

  currentPage?: string;

  /** Maximum number of items to show before truncating (default: 3) */

  maxVisibleItems?: number;


}



export function IdsBreadcrumb({

  items,

  currentPage,

  maxVisibleItems = 3,

  className,

  ...rest

}: IdsBreadcrumbProps) {

  const shouldTruncate = items.length > maxVisibleItems;

  const visibleItems = shouldTruncate

    ? [items[0], items[items.length - 1]]

    : items;

  const hiddenItems = shouldTruncate ? items.slice(1, -1) : [];

  const [dropdownContainer, setDropdownContainer] = useState<HTMLDivElement | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!dropdownOpen || !dropdownContainer) return;
    const frame = requestAnimationFrame(() => {
      const firstItem = dropdownContainer.querySelector<HTMLElement>(
        'button:not(:disabled), [role="menuitem"]:not([aria-disabled="true"])',
      );
      firstItem?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [dropdownOpen, dropdownContainer]);

  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [labelCap, setLabelCap] = useState<number | null>(null);

  const displayedItems = useMemo(() => {
    if (labelCap == null) return visibleItems;
    return visibleItems.map((item) => {
      if (item.label.length <= labelCap) return item;
      return { ...item, label: `${item.label.slice(0, labelCap)}...` };
    });
  }, [visibleItems, labelCap]);

  const originalMax = useMemo(
    () => Math.max(0, ...visibleItems.map((item) => item.label.length)),
    [visibleItems],
  );

  useEffect(() => {
    const nav = navRef.current;
    const list = listRef.current;
    const parent = nav?.parentElement;
    if (!nav || !list) return;

    const checkOverflow = () => {
      const listRect = list.getBoundingClientRect();
      const contentRight = listRect.left + list.scrollWidth;

      let nextEdge: number | null = null;
      if (parent) {
        for (const child of parent.children) {
          if (child === nav) continue;
          const childRect = child.getBoundingClientRect();
          if (childRect.width === 0 || childRect.height === 0) continue;
          if (childRect.right > listRect.left) {
            if (nextEdge == null || childRect.left < nextEdge) {
              nextEdge = childRect.left;
            }
          }
        }
      }

      if (nextEdge == null) {
        const navRect = nav.getBoundingClientRect();
        nextEdge = navRect.left + nav.clientWidth;
      }

      const spacing = nextEdge - contentRight;
      if (spacing < 24) {
        setLabelCap((prev) => {
          if (prev == null) return Math.max(1, originalMax - 1);
          return Math.max(1, prev - 1);
        });
      } else if (spacing >= 48) {
        setLabelCap((prev) => {
          if (prev == null) return prev;
          const next = prev + 1;
          if (next >= originalMax) return null;
          return next;
        });
      }
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(nav);
    observer.observe(list);
    if (parent) observer.observe(parent);
    checkOverflow();
    return () => observer.disconnect();
  }, [originalMax]);



  return (

    <nav

      aria-label="Breadcrumb"

      ref={navRef}

      className={[styles.breadcrumbContainer, className].filter(Boolean).join(" ")}

      {...rest}

    >

      <ol ref={listRef} className={styles.breadcrumbList}>

        {displayedItems.map((item, index) => {

          const isLast = index === displayedItems.length - 1;



          return (

            <li key={index} className={styles.breadcrumbItem}>

              <IdsLink

                label={item.label}

                href={item.href ?? "#"}

                type="standalone"

              />

              {!isLast ? (

                <>

                  <span className={styles.separator} aria-hidden="true">

                    /

                  </span>

                  {shouldTruncate && index === 0 && (

                    <>

                      <DropdownMenu

                        trigger={

                          <span

                            className={[idsLinkStyles["ids-link"], idsLinkStyles["ids-link--standalone"]].join(" ")}

                            aria-label="Collapsed breadcrumbs"

                          >

                            ...

                          </span>

                        }

                        items={hiddenItems.map((hiddenItem) => ({

                          label: hiddenItem.label,

                          selectable: true,

                          onClick: () => {

                            window.location.href = hiddenItem.href ?? "#";

                          },

                        }))}

                        selectionMode="single"

                        menuWidth="content"
                        portalContainer={dropdownContainer}
                        onOpenChange={setDropdownOpen}

                      />

                      <div ref={setDropdownContainer} style={{ display: "contents" }} />

                    </>

                  )}

                  {shouldTruncate && index === 0 && (

                    <span className={styles.separator} aria-hidden="true">

                      /

                    </span>

                  )}

                </>

              ) : (

                <span className={styles.separator} aria-hidden="true">

                  /

                </span>

              )}

            </li>

          );

        })}

      </ol>

      {currentPage && (

        <span className={styles.currentPage} aria-current="page">

          {currentPage}

        </span>

      )}

    </nav>

  );

}

