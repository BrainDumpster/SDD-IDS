import { useState } from "react";
import type { ComponentProps } from "react";
import styles from "./IdsBreadcrumb.module.css";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface IdsBreadcrumbProps extends ComponentProps<"nav"> {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Current page text (for two-line variant) */
  currentPage?: string;
  /** Whether to use two-line layout */
  twoLines?: boolean;
  /** Whether to truncate with "..." when items exceed maxVisibleItems */
  truncate?: boolean;
  /** Maximum number of items to show before truncating (default: 4) */
  maxVisibleItems?: number;
  /** Whether to show dropdown menu on hover of "..." */
  showDropdown?: boolean;
}

export function IdsBreadcrumb({
  items,
  currentPage,
  twoLines = false,
  truncate = false,
  maxVisibleItems = 4,
  showDropdown = false,
  className,
  ...rest
}: IdsBreadcrumbProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const shouldTruncate = truncate && items.length > maxVisibleItems;
  const visibleItems = shouldTruncate
    ? [items[0], items[items.length - 1]]
    : items;
  const hiddenItems = shouldTruncate ? items.slice(1, -1) : [];

  return (
    <nav
      aria-label="Breadcrumb"
      className={[styles.breadcrumbContainer, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <ol className={styles.breadcrumbList}>
        {visibleItems.map((item, index) => {
          const isLast = index === visibleItems.length - 1;

          return (
            <li key={index} className={styles.breadcrumbItem}>
              <a href={item.href ?? "#"} className={styles.breadcrumbLink}>
                {item.label}
              </a>
              {!isLast ? (
                <>
                  <span className={styles.separator} aria-hidden="true">
                    /
                  </span>
                  {shouldTruncate && index === 0 && (
                    <span
                      className={[styles.breadcrumbLink, styles.ellipsis].join(" ")}
                      onMouseEnter={() => showDropdown && setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                      aria-haspopup={showDropdown ? "true" : undefined}
                      aria-expanded={showDropdown ? dropdownOpen : undefined}
                    >
                      ...
                      {showDropdown && dropdownOpen && (
                        <div
                          className={styles.dropdownMenu}
                          onMouseEnter={() => setDropdownOpen(true)}
                          onMouseLeave={() => setDropdownOpen(false)}
                        >
                          <div className={styles.dropdownOptions}>
                            {hiddenItems.map((hiddenItem, hiddenIndex) => (
                              <a
                                key={hiddenIndex}
                                href={hiddenItem.href ?? "#"}
                                className={styles.dropdownOption}
                              >
                                {hiddenItem.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </span>
                  )}
                  {shouldTruncate && index === 0 && (
                    <span className={styles.separator} aria-hidden="true">
                      /
                    </span>
                  )}
                </>
              ) : twoLines && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {twoLines && currentPage && (
        <span className={styles.currentPage} aria-current="page">
          {currentPage}
        </span>
      )}
    </nav>
  );
}
