import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { Icon } from "../Icon";
import styles from "./IdsPagination.module.css";

export type IdsPaginationDropdownState = "collapsed" | "expanded-below" | "expanded-above";
export type IdsPaginationBackground = "none" | "gray";

export interface IdsPaginationProps extends ComponentProps<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  showPerPage?: boolean;
  showFirstLast?: boolean;
  showPageOffset?: boolean;
  pageOffsetOptions?: number[];
  dropdownState?: IdsPaginationDropdownState;
  pageOffsetDropdownState?: IdsPaginationDropdownState;
  background?: IdsPaginationBackground;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePageSizeOptions(options: number[]): number[] {
  const uniquePositive = Array.from(new Set(options.filter((value) => Number.isFinite(value) && value > 0)));
  return uniquePositive.length > 0 ? uniquePositive : [25, 50, 75, 100];
}

export function IdsPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 25,
  pageSizeOptions = [25, 50, 75, 100],
  onPageSizeChange,
  showPerPage = true,
  showFirstLast = true,
  showPageOffset = false,
  pageOffsetOptions,
  dropdownState = "collapsed",
  pageOffsetDropdownState = "collapsed",
  background = "none",
  disabled = false,
  className,
  ...rest
}: IdsPaginationProps) {
  const pageOffsetRef = useRef<HTMLDivElement | null>(null);
  const safeTotalPages = Math.max(1, totalPages);
  const controlledCurrentPage = clamp(currentPage, 1, safeTotalPages);
  const safePageSizeOptions = normalizePageSizeOptions(pageSizeOptions);
  const safePageSize = safePageSizeOptions.includes(pageSize) ? pageSize : safePageSizeOptions[0];
  const offsetOptions = useMemo(
    () =>
      pageOffsetOptions && pageOffsetOptions.length > 0
        ? normalizePageSizeOptions(pageOffsetOptions).map((value) => clamp(value, 1, safeTotalPages))
        : Array.from({ length: safeTotalPages }, (_, index) => index + 1),
    [pageOffsetOptions, safeTotalPages]
  );
  const [internalPage, setInternalPage] = useState(controlledCurrentPage);
  const [pageInputValue, setPageInputValue] = useState(String(controlledCurrentPage));
  const [perPageMenuOpen, setPerPageMenuOpen] = useState(false);
  const [pageOffsetMenuOpen, setPageOffsetMenuOpen] = useState(false);
  const resolvedPerPageDropdownState =
    dropdownState !== "collapsed" ? dropdownState : perPageMenuOpen ? "expanded-below" : "collapsed";
  const safeCurrentPage = onPageChange ? controlledCurrentPage : internalPage;
  const resolvedPageOffsetDropdownState =
    pageOffsetDropdownState !== "collapsed"
      ? pageOffsetDropdownState
      : pageOffsetMenuOpen
        ? "expanded-below"
        : "collapsed";

  useEffect(() => {
    if (onPageChange) return;
    setInternalPage(controlledCurrentPage);
  }, [controlledCurrentPage, onPageChange]);

  useEffect(() => {
    setPageInputValue(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const atFirstPage = safeCurrentPage <= 1;
  const atLastPage = safeCurrentPage >= safeTotalPages;

  const goToPage = (nextPage: number) => {
    if (disabled) return;
    const clamped = clamp(nextPage, 1, safeTotalPages);
    if (onPageChange) {
      onPageChange(clamped);
      return;
    }
    setInternalPage(clamped);
  };

  const commitPageInput = () => {
    const parsed = Number.parseInt(pageInputValue, 10);
    if (!Number.isFinite(parsed)) {
      setPageInputValue(String(safeCurrentPage));
      return;
    }
    goToPage(parsed);
  };

  const togglePageOffsetMenu = () => {
    if (disabled) return;
    setPageOffsetMenuOpen((prev) => !prev);
  };

  const closePageOffsetMenu = () => {
    setPageOffsetMenuOpen(false);
  };

  const togglePerPageMenu = () => {
    if (disabled) return;
    setPerPageMenuOpen((prev) => !prev);
  };

  const closePerPageMenu = () => {
    setPerPageMenuOpen(false);
  };

  return (
    <nav
      aria-label="Pagination"
      className={[
        styles.root,
        background === "gray" ? styles.rootGray : styles.rootNone,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {showPerPage ? (
        <div className={styles.resultsGroup}>
          <span className={styles.label}>Show:</span>
          <div className={styles.dropdownWrap}>
            <button
              className={styles.dropdownTrigger}
              type="button"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={resolvedPerPageDropdownState !== "collapsed"}
              aria-label="Items per page"
              onClick={togglePerPageMenu}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (nextTarget && event.currentTarget.parentElement?.contains(nextTarget)) return;
                closePerPageMenu();
              }}
            >
              <span>{safePageSize}</span>
              <Icon shapeName="arrow-drop-tri-caret" className={styles.caretIcon} />
            </button>
            {resolvedPerPageDropdownState !== "collapsed" ? (
              <ul
                className={[
                  styles.dropdownMenu,
                  resolvedPerPageDropdownState === "expanded-above"
                    ? styles.dropdownMenuAbove
                    : styles.dropdownMenuBelow,
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="listbox"
                aria-label="Items per page options"
              >
                {safePageSizeOptions.map((option) => {
                  const selected = option === safePageSize;
                  return (
                    <li key={option} className={styles.dropdownOptionWrap}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={[styles.dropdownOption, selected ? styles.dropdownOptionSelected : ""]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => {
                          onPageSizeChange?.(option);
                          closePerPageMenu();
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          <span className={styles.label}>per page</span>
        </div>
      ) : (
        <span />
      )}

      <div className={styles.pageNavGroup}>
        {showFirstLast ? (
          <button
            className={styles.iconButton}
            type="button"
            onClick={() => goToPage(1)}
            disabled={disabled || atFirstPage}
            aria-label="First page"
          >
            <Icon shapeName="double-chev-left" className={styles.navIcon} />
          </button>
        ) : null}
        <button
          className={styles.iconButton}
          type="button"
          onClick={() => goToPage(safeCurrentPage - 1)}
          disabled={disabled || atFirstPage}
          aria-label="Previous page"
        >
          <Icon shapeName="chev-left" className={styles.navIcon} />
        </button>
        {showPageOffset ? (
          <div className={styles.pageOffsetWrap}>
            <button
              ref={pageOffsetRef}
              className={styles.pageOffsetTrigger}
              type="button"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={resolvedPageOffsetDropdownState !== "collapsed"}
              aria-label="Page offset"
              onClick={togglePageOffsetMenu}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (nextTarget && pageOffsetRef.current?.parentElement?.contains(nextTarget)) return;
                closePageOffsetMenu();
              }}
            >
              <span>{safeCurrentPage}</span>
              <Icon shapeName="arrow-drop-tri-caret" className={styles.pageOffsetCaretIcon} />
            </button>
            {resolvedPageOffsetDropdownState !== "collapsed" ? (
              <ul
                className={[
                  styles.pageOffsetMenu,
                  resolvedPageOffsetDropdownState === "expanded-above"
                    ? styles.pageOffsetMenuAbove
                    : styles.pageOffsetMenuBelow,
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="listbox"
                aria-label="Page offsets"
              >
                {offsetOptions.map((pageOffset) => {
                  const selected = pageOffset === safeCurrentPage;
                  return (
                    <li key={pageOffset} className={styles.pageOffsetOptionWrap}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        className={[styles.pageOffsetOption, selected ? styles.pageOffsetOptionSelected : ""]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => {
                          goToPage(pageOffset);
                          closePageOffsetMenu();
                        }}
                      >
                        {pageOffset}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className={styles.pageInputWrap}>
            <input
              className={styles.pageInput}
              value={pageInputValue}
              onChange={(event) => setPageInputValue(event.target.value.replace(/[^\d]/g, ""))}
              onBlur={commitPageInput}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitPageInput();
                  event.currentTarget.blur();
                }
              }}
              aria-label="Current page"
            />
          </div>
        )}
        <span className={styles.countText}>of {safeTotalPages}</span>
        <button
          className={styles.iconButton}
          type="button"
          onClick={() => goToPage(safeCurrentPage + 1)}
          disabled={disabled || atLastPage}
          aria-label="Next page"
        >
          <Icon shapeName="chev-right" className={styles.navIcon} />
        </button>
        {showFirstLast ? (
          <button
            className={styles.iconButton}
            type="button"
            onClick={() => goToPage(safeTotalPages)}
            disabled={disabled || atLastPage}
            aria-label="Last page"
          >
            <Icon shapeName="double-chev-right" className={styles.navIcon} />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
