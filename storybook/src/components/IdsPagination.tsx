import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { createPortal } from "react-dom";
import { Icon } from "./Icon";
import styles from "./IdsPagination.module.css";

export type IdsPaginationDropdownState =
  | "collapsed"
  | "expanded-below"
  | "expanded-above";
export type IdsPaginationBackground = "none" | "gray" | "white";

const CARET_ICON_SIZE = { width: 10, height: 10 } as const;
const NAV_ICON_SIZE = { width: 16, height: 16 } as const;

export interface IdsPaginationProps extends ComponentProps<"nav"> {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onFirstPageNavigate?: () => void;
  onPreviousPageNavigate?: () => void;
  onNextPageNavigate?: () => void;
  onLastPageNavigate?: () => void;
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
  embeddedInDatagrid?: boolean;
  disabled?: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePageSizeOptions(options: number[]): number[] {
  const uniquePositive = Array.from(
    new Set(options.filter((value) => Number.isFinite(value) && value > 0)),
  );
  return uniquePositive.length > 0 ? uniquePositive : [25, 50, 75, 100];
}

type PaginationMenuPos = { top: number; left: number; width: number };

function computeMenuPos(
  trigger: HTMLElement | null,
  menu: HTMLElement | null,
  placement: Exclude<IdsPaginationDropdownState, "collapsed">,
): PaginationMenuPos | null {
  if (!trigger) return null;
  const rect = trigger.getBoundingClientRect();
  const width = rect.width;
  const left = rect.left;
  if (placement === "expanded-above") {
    const menuHeight = menu?.getBoundingClientRect().height ?? 0;
    return { top: rect.top + 1 - menuHeight, left, width };
  }
  return { top: rect.top + rect.height - 1, left, width };
}

function usePortaledMenuPosition(
  open: boolean,
  placement: IdsPaginationDropdownState,
  triggerRef: React.RefObject<HTMLElement | null>,
  menuRef: React.RefObject<HTMLElement | null>,
): PaginationMenuPos | null {
  const [pos, setPos] = useState<PaginationMenuPos | null>(null);

  useEffect(() => {
    if (!open || placement === "collapsed") {
      setPos(null);
      return;
    }

    const update = () => {
      const next = computeMenuPos(
        triggerRef.current,
        menuRef.current,
        placement,
      );
      setPos(next);
    };

    update();
    const frame = requestAnimationFrame(() => {
      update();
    });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [menuRef, open, placement, triggerRef]);

  return pos;
}

export function IdsPagination({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onFirstPageNavigate,
  onPreviousPageNavigate,
  onNextPageNavigate,
  onLastPageNavigate,
  pageSize = 25,
  pageSizeOptions = [25, 50, 75, 100],
  showPerPage = true,
  showFirstLast = true,
  showPageOffset = false,
  pageOffsetOptions,
  dropdownState = "collapsed",
  pageOffsetDropdownState = "collapsed",
  background = "gray",
  embeddedInDatagrid = false,
  disabled = false,
  className,
  ...rest
}: IdsPaginationProps) {
  const pageOffsetRef = useRef<HTMLButtonElement | null>(null);
  const perPageTriggerRef = useRef<HTMLButtonElement | null>(null);
  const perPageMenuRef = useRef<HTMLUListElement | null>(null);
  const pageOffsetMenuRef = useRef<HTMLUListElement | null>(null);
  const safeTotalPages = Math.max(1, totalPages);
  const controlledCurrentPage = clamp(currentPage, 1, safeTotalPages);
  const safePageSizeOptions = normalizePageSizeOptions(pageSizeOptions);
  const safePageSize = safePageSizeOptions.includes(pageSize)
    ? pageSize
    : safePageSizeOptions[0];
  const offsetOptions = useMemo(
    () =>
      pageOffsetOptions && pageOffsetOptions.length > 0
        ? normalizePageSizeOptions(pageOffsetOptions).map((value) =>
            clamp(value, 1, safeTotalPages),
          )
        : Array.from({ length: safeTotalPages }, (_, index) => index + 1),
    [pageOffsetOptions, safeTotalPages],
  );
  const [internalPage, setInternalPage] = useState(controlledCurrentPage);
  const [pageInputValue, setPageInputValue] = useState(
    String(controlledCurrentPage),
  );
  const [perPageMenuOpen, setPerPageMenuOpen] = useState(false);
  const [pageOffsetMenuOpen, setPageOffsetMenuOpen] = useState(false);
  const resolvedPerPageDropdownState =
    dropdownState !== "collapsed"
      ? dropdownState
      : perPageMenuOpen
        ? "expanded-below"
        : "collapsed";
  const safeCurrentPage = onPageChange ? controlledCurrentPage : internalPage;
  const resolvedPageOffsetDropdownState =
    pageOffsetDropdownState !== "collapsed"
      ? pageOffsetDropdownState
      : pageOffsetMenuOpen
        ? "expanded-below"
        : "collapsed";
  const perPageMenuPos = usePortaledMenuPosition(
    resolvedPerPageDropdownState !== "collapsed",
    resolvedPerPageDropdownState,
    perPageTriggerRef,
    perPageMenuRef,
  );
  const pageOffsetMenuPos = usePortaledMenuPosition(
    resolvedPageOffsetDropdownState !== "collapsed",
    resolvedPageOffsetDropdownState,
    pageOffsetRef,
    pageOffsetMenuRef,
  );

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
    closePerPageMenu();
    setPageOffsetMenuOpen((prev) => !prev);
  };

  const closePageOffsetMenu = () => {
    setPageOffsetMenuOpen(false);
  };

  const togglePerPageMenu = () => {
    if (disabled) return;
    closePageOffsetMenu();
    setPerPageMenuOpen((prev) => !prev);
  };

  const closePerPageMenu = () => {
    setPerPageMenuOpen(false);
  };

  return (
    <>
    <nav
      aria-label="Pagination"
      className={[
        styles.root,
        background === "white"
          ? styles.rootWhite
          : background === "none"
            ? styles.rootNone
            : styles.rootGray,
        embeddedInDatagrid ? styles.rootEmbedded : "",
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
              ref={perPageTriggerRef}
              className={styles.dropdownTrigger}
              type="button"
              disabled={disabled}
              aria-haspopup="listbox"
              aria-expanded={resolvedPerPageDropdownState !== "collapsed"}
              aria-label="Items per page"
              onClick={togglePerPageMenu}
              onBlur={(event) => {
                const nextTarget = event.relatedTarget as Node | null;
                if (nextTarget?.closest("[data-ids-pagination-per-page-menu]")) return;
                closePerPageMenu();
              }}
            >
              <span>{safePageSize}</span>
              <Icon
                shapeName="arrow-drop-tri-caret"
                className={styles.caretIcon}
                style={CARET_ICON_SIZE}
              />
            </button>
          </div>
          <span className={styles.label}>per page</span>
        </div>
      ) : (
        <span />
      )}

      <div className={styles.pageNavGroup}>
        {safeTotalPages <= 1 ? (
          <span className={styles.countText}>1 page</span>
        ) : (
          <>
            {showFirstLast ? (
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => {
                  onFirstPageNavigate?.();
                  goToPage(1);
                }}
                disabled={disabled || atFirstPage}
                aria-label="First page"
              >
                <Icon
                  shapeName="double-chev-left"
                  className={styles.navIcon}
                  style={NAV_ICON_SIZE}
                />
              </button>
            ) : null}
            <button
              className={styles.iconButton}
              type="button"
              onClick={() => {
                onPreviousPageNavigate?.();
                goToPage(safeCurrentPage - 1);
              }}
              disabled={disabled || atFirstPage}
              aria-label="Previous page"
            >
              <Icon
                shapeName="chev-left"
                className={styles.navIcon}
                style={NAV_ICON_SIZE}
              />
            </button>
            {showPageOffset ? (
              <div className={styles.pageOffsetWrap}>
                <button
                  ref={pageOffsetRef}
                  className={styles.pageOffsetTrigger}
                  type="button"
                  disabled={disabled}
                  aria-haspopup="listbox"
                  aria-expanded={
                    resolvedPageOffsetDropdownState !== "collapsed"
                  }
                  aria-label="Page offset"
                  onClick={togglePageOffsetMenu}
                  onBlur={(event) => {
                    const nextTarget = event.relatedTarget as Node | null;
                    if (nextTarget?.closest("[data-ids-pagination-page-offset-menu]"))
                      return;
                    closePageOffsetMenu();
                  }}
                >
                  <span>{safeCurrentPage}</span>
                  <Icon
                    shapeName="arrow-drop-tri-caret"
                    className={styles.pageOffsetCaretIcon}
                    style={CARET_ICON_SIZE}
                  />
                </button>
              </div>
            ) : (
              <div className={styles.pageInputWrap}>
                <input
                  className={styles.pageInput}
                  value={pageInputValue}
                  onChange={(event) =>
                    setPageInputValue(event.target.value.replace(/[^\d]/g, ""))
                  }
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
              onClick={() => {
                onNextPageNavigate?.();
                goToPage(safeCurrentPage + 1);
              }}
              disabled={disabled || atLastPage}
              aria-label="Next page"
            >
              <Icon
                shapeName="chev-right"
                className={styles.navIcon}
                style={NAV_ICON_SIZE}
              />
            </button>
            {showFirstLast ? (
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => {
                  onLastPageNavigate?.();
                  goToPage(safeTotalPages);
                }}
                disabled={disabled || atLastPage}
                aria-label="Last page"
              >
                <Icon
                  shapeName="double-chev-right"
                  className={styles.navIcon}
                  style={NAV_ICON_SIZE}
                />
              </button>
            ) : null}
          </>
        )}
      </div>
    </nav>
    {resolvedPerPageDropdownState !== "collapsed" &&
    typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={perPageMenuRef}
            className={[
              styles.dropdownMenu,
              styles.dropdownMenuPortaled,
              resolvedPerPageDropdownState === "expanded-above"
                ? styles.dropdownMenuAbove
                : styles.dropdownMenuBelow,
            ]
              .filter(Boolean)
              .join(" ")}
            data-ids-pagination-per-page-menu
            style={{
              position: "fixed",
              top: perPageMenuPos?.top ?? 0,
              left: perPageMenuPos?.left ?? 0,
              width: perPageMenuPos?.width ?? 90,
            }}
            role="listbox"
            aria-label="Items per page options"
            onClick={(event) => event.stopPropagation()}
          >
            {safePageSizeOptions.map((option) => {
              const selected = option === safePageSize;
              return (
                <li key={option} className={styles.dropdownOptionWrap}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={[
                      styles.dropdownOption,
                      selected ? styles.dropdownOptionSelected : "",
                    ]
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
          </ul>,
          document.body,
        )
      : null}
    {resolvedPageOffsetDropdownState !== "collapsed" &&
    typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={pageOffsetMenuRef}
            className={[
              styles.pageOffsetMenu,
              styles.pageOffsetMenuPortaled,
              resolvedPageOffsetDropdownState === "expanded-above"
                ? styles.pageOffsetMenuAbove
                : styles.pageOffsetMenuBelow,
            ]
              .filter(Boolean)
              .join(" ")}
            data-ids-pagination-page-offset-menu
            style={{
              position: "fixed",
              top: pageOffsetMenuPos?.top ?? 0,
              left: pageOffsetMenuPos?.left ?? 0,
              width: pageOffsetMenuPos?.width ?? 40,
            }}
            role="listbox"
            aria-label="Page offsets"
            onClick={(event) => event.stopPropagation()}
          >
            {offsetOptions.map((pageOffset) => {
              const selected = pageOffset === safeCurrentPage;
              return (
                <li key={pageOffset} className={styles.pageOffsetOptionWrap}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={[
                      styles.pageOffsetOption,
                      selected ? styles.pageOffsetOptionSelected : "",
                    ]
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
          </ul>,
          document.body,
        )
      : null}
    </>
  );
}
