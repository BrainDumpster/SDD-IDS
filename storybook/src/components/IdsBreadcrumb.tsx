import type { ComponentProps } from "react";

import { IdsLink } from "../../../lib/react/ids/link";

import idsLinkStyles from "../../../lib/react/ids/link/IdsLink.module.css";

import { DropdownMenu } from "./DropdownMenu";

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

  /** Whether to truncate with "..." when items exceed maxVisibleItems */

  truncate?: boolean;

  /** Maximum number of items to show before truncating (default: 3) */

  maxVisibleItems?: number;

  /** Whether to show dropdown menu on hover of "..." */

  showDropdown?: boolean;

}



export function IdsBreadcrumb({

  items,

  currentPage,

  truncate = false,

  maxVisibleItems = 3,

  showDropdown = false,

  className,

  ...rest

}: IdsBreadcrumbProps) {

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

                    showDropdown ? (

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

                          onClick: () => {

                            window.location.href = hiddenItem.href ?? "#";

                          },

                        }))}

                        selectionMode="none"

                        menuWidth="content"

                      />

                    ) : (

                      <span

                        className={[idsLinkStyles["ids-link"], idsLinkStyles["ids-link--standalone"]].join(" ")}

                      >

                        ...

                      </span>

                    )

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

