/**
 * IDS Pagination — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/pagination`
 * Source: `components/ids/pagination/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy:
 *   PaginationRoot (nav)
 *     ResultsPerPageGroup?  (Show: + PerPageDropdown + per page)
 *     PageNavigationGroup
 *       FirstPageButton + PrevPageButton + PageInput + PageCountText
 *       + NextPageButton + LastPageButton
 *
 * Composition: lib `IdsIcon` for nav glyphs + per-page caret.
 * Page number is always a numeric text input (never a dropdown).
 * No @base-ui-components dependency.
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";
import { IdsIcon } from "../icon";
import styles from "./IdsPagination.module.css";

export type IdsPaginationBackground = "gray" | "white" | "none";
export type IdsPaginationResponsiveMode = "auto" | "keep-inline";
export type IdsPaginationCollapseSlot =
  | "results-per-page"
  | "page-input"
  | "first-last-buttons";

export interface IdsPaginationProps
  extends Omit<ComponentProps<"nav">, "children" | "onChange"> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** Default `true`. */
  showResultsPerPage?: boolean;
  /** Default `"gray"`. */
  background?: IdsPaginationBackground;
  disabled?: boolean;
  summaryFormatter?: (currentPage: number, totalPages: number) => string;
  /** Default `"auto"`. */
  responsiveMode?: IdsPaginationResponsiveMode;
  /** Default `["results-per-page"]`. */
  collapseOrder?: IdsPaginationCollapseSlot[];
}

const DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 75, 100] as const;
const DEFAULT_COLLAPSE_ORDER: IdsPaginationCollapseSlot[] = [
  "results-per-page",
];

const BACKGROUNDS = new Set<IdsPaginationBackground>([
  "gray",
  "white",
  "none",
]);
const RESPONSIVE_MODES = new Set<IdsPaginationResponsiveMode>([
  "auto",
  "keep-inline",
]);
const COLLAPSE_SLOTS = new Set<IdsPaginationCollapseSlot>([
  "results-per-page",
  "page-input",
  "first-last-buttons",
]);

type PerPageMenuPlacement = "below" | "above";
type PaginationMenuPos = { top: number; left: number; width: number };

function computePerPageMenuPos(
  trigger: HTMLElement | null,
  menu: HTMLElement | null,
  placement: PerPageMenuPlacement,
): PaginationMenuPos | null {
  if (!trigger) return null;
  const rect = trigger.getBoundingClientRect();
  const width = rect.width;
  const left = rect.left;
  if (placement === "above") {
    const menuHeight = menu?.getBoundingClientRect().height ?? 0;
    return { top: rect.top + 1 - menuHeight, left, width };
  }
  return { top: rect.top + rect.height - 1, left, width };
}

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function normalizePageSizeOptions(options: number[] | undefined): number[] {
  if (!options || options.length === 0) {
    return [...DEFAULT_PAGE_SIZE_OPTIONS];
  }
  const uniquePositive = Array.from(
    new Set(options.filter((value) => Number.isFinite(value) && value > 0)),
  );
  return uniquePositive.length > 0
    ? uniquePositive
    : [...DEFAULT_PAGE_SIZE_OPTIONS];
}

function resolveBackground(
  value: IdsPaginationBackground | string | undefined,
): IdsPaginationBackground {
  if (value != null && BACKGROUNDS.has(value as IdsPaginationBackground)) {
    return value as IdsPaginationBackground;
  }
  return "gray";
}

function resolveResponsiveMode(
  value: IdsPaginationResponsiveMode | string | undefined,
): IdsPaginationResponsiveMode {
  if (
    value != null &&
    RESPONSIVE_MODES.has(value as IdsPaginationResponsiveMode)
  ) {
    return value as IdsPaginationResponsiveMode;
  }
  return "auto";
}

function resolveCollapseOrder(
  value: IdsPaginationCollapseSlot[] | undefined,
): IdsPaginationCollapseSlot[] {
  if (!value || value.length === 0) return [...DEFAULT_COLLAPSE_ORDER];
  const filtered = value.filter((slot) => COLLAPSE_SLOTS.has(slot));
  return filtered.length > 0 ? filtered : [...DEFAULT_COLLAPSE_ORDER];
}

function defaultPageCountText(currentPage: number, totalPages: number): string {
  if (totalPages <= 1) return "1 page";
  return `of ${totalPages}`;
}

export function IdsPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  showResultsPerPage = true,
  background: backgroundProp = "gray",
  disabled = false,
  summaryFormatter,
  responsiveMode: responsiveModeProp = "auto",
  collapseOrder: collapseOrderProp,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...rest
}: IdsPaginationProps): ReactElement {
  const menuId = useId();
  const rootRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const background = resolveBackground(backgroundProp);
  const responsiveMode = resolveResponsiveMode(responsiveModeProp);
  const collapseOrder = resolveCollapseOrder(collapseOrderProp);

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = clamp(currentPage, 1, safeTotalPages);
  const safePageSizeOptions = normalizePageSizeOptions(pageSizeOptions);
  const safePageSize =
    pageSize != null && safePageSizeOptions.includes(pageSize)
      ? pageSize
      : safePageSizeOptions[0];

  const [pageInputValue, setPageInputValue] = useState(
    String(safeCurrentPage),
  );
  const [perPageMenuOpen, setPerPageMenuOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] =
    useState<PerPageMenuPlacement>("below");
  const [perPageMenuPos, setPerPageMenuPos] =
    useState<PaginationMenuPos | null>(null);
  const [collapseLevel, setCollapseLevel] = useState(0);

  useEffect(() => {
    setPageInputValue(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const atFirstPage = safeCurrentPage <= 1;
  const atLastPage = safeCurrentPage >= safeTotalPages;
  const isSinglePage = safeTotalPages <= 1;

  const goToPage = useCallback(
    (nextPage: number) => {
      if (disabled) return;
      const clamped = clamp(nextPage, 1, safeTotalPages);
      onPageChange(clamped);
    },
    [disabled, onPageChange, safeTotalPages],
  );

  const commitPageInput = useCallback(() => {
    const parsed = Number.parseInt(pageInputValue, 10);
    if (!Number.isFinite(parsed)) {
      setPageInputValue(String(safeCurrentPage));
      return;
    }
    goToPage(parsed);
  }, [goToPage, pageInputValue, safeCurrentPage]);

  const closePerPageMenu = useCallback(() => {
    setPerPageMenuOpen(false);
    setPerPageMenuPos(null);
  }, []);

  const syncPerPageOverlay = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      setMenuPlacement("below");
      setPerPageMenuPos(null);
      return;
    }
    const rect = trigger.getBoundingClientRect();
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : rect.bottom + 200;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const estimatedMenuHeight = Math.max(
      menuRef.current?.offsetHeight ?? 0,
      safePageSizeOptions.length * 40,
    );
    const nextPlacement: PerPageMenuPlacement =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow
        ? "above"
        : "below";
    setMenuPlacement(nextPlacement);
    setPerPageMenuPos(
      computePerPageMenuPos(trigger, menuRef.current, nextPlacement),
    );
  }, [safePageSizeOptions.length]);

  const togglePerPageMenu = useCallback(() => {
    if (disabled) return;
    setPerPageMenuOpen((prev) => !prev);
  }, [disabled]);

  useLayoutEffect(() => {
    if (!perPageMenuOpen) {
      setPerPageMenuPos(null);
      return;
    }
    syncPerPageOverlay();
    const frame = requestAnimationFrame(() => {
      syncPerPageOverlay();
    });
    const onReposition = () => {
      syncPerPageOverlay();
    };
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [perPageMenuOpen, syncPerPageOverlay]);

  useEffect(() => {
    if (!perPageMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePerPageMenu();
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closePerPageMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [closePerPageMenu, perPageMenuOpen]);

  // Responsive: reset collapse on container resize, then progressively apply
  // `collapseOrder` until content fits (spec Layout & Measurements → Responsiveness).
  useLayoutEffect(() => {
    if (responsiveMode !== "auto") {
      setCollapseLevel(0);
      return;
    }
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const onResize = () => {
      setCollapseLevel(0);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(root);
    return () => ro.disconnect();
  }, [responsiveMode, collapseOrder, showResultsPerPage, safeTotalPages]);

  useLayoutEffect(() => {
    if (responsiveMode !== "auto") return;
    const root = rootRef.current;
    if (!root) return;
    if (root.scrollWidth <= root.clientWidth + 1) return;
    if (collapseLevel < collapseOrder.length) {
      setCollapseLevel((level) => level + 1);
    }
  }, [
    collapseLevel,
    collapseOrder,
    responsiveMode,
    showResultsPerPage,
    safeTotalPages,
    background,
    pageInputValue,
    safePageSize,
  ]);

  const collapsedSlots = new Set(collapseOrder.slice(0, collapseLevel));
  const resultsCollapsed = collapsedSlots.has("results-per-page");
  const pageInputCollapsed = collapsedSlots.has("page-input");
  const firstLastCollapsed = collapsedSlots.has("first-last-buttons");
  const renderResultsGroup = showResultsPerPage && !resultsCollapsed;

  const countText =
    summaryFormatter?.(safeCurrentPage, safeTotalPages) ??
    defaultPageCountText(safeCurrentPage, safeTotalPages);

  const rootBackgroundClass =
    background === "white"
      ? styles.rootWhite
      : background === "none"
        ? styles.rootNone
        : styles.rootGray;

  return (
    <>
      <nav
        {...rest}
        ref={rootRef}
        aria-label={ariaLabel}
        className={cx(styles.root, rootBackgroundClass, className)}
        data-ids="ids-pagination"
        data-background={background}
        data-responsive-mode={responsiveMode}
      >
        {renderResultsGroup ? (
          <div
            className={styles.resultsGroup}
            data-ids="ids-pagination-results"
          >
            <span className={styles.label}>Show:</span>
            <div className={styles.dropdownWrap}>
              <button
                ref={triggerRef}
                type="button"
                className={styles.dropdownTrigger}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={perPageMenuOpen}
                aria-controls={perPageMenuOpen ? menuId : undefined}
                aria-label="Items per page"
                onClick={togglePerPageMenu}
              >
                <span>{safePageSize}</span>
                <IdsIcon
                  shape="arrow-drop-tri-caret"
                  className={styles.caretIcon}
                  size={10}
                  color="currentColor"
                  style={{ width: 10, height: 10 }}
                />
              </button>
            </div>
            <span className={styles.label}>per page</span>
          </div>
        ) : null}

        <div className={styles.pageNavGroup} data-ids="ids-pagination-nav">
          {isSinglePage ? (
            <span className={styles.countText}>{countText}</span>
          ) : (
            <>
              <button
                type="button"
                className={cx(
                  styles.iconButton,
                  firstLastCollapsed && styles.iconButtonCollapsed,
                )}
                onClick={() => goToPage(1)}
                disabled={disabled || atFirstPage}
                aria-label="First page"
              >
                <IdsIcon
                  shape="double-chev-left"
                  size={16}
                  color="currentColor"
                  style={{ width: 16, height: 16 }}
                />
              </button>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => goToPage(safeCurrentPage - 1)}
                disabled={disabled || atFirstPage}
                aria-label="Previous page"
              >
                <IdsIcon
                  shape="chev-left"
                  size={16}
                  color="currentColor"
                  style={{ width: 16, height: 16 }}
                />
              </button>
              <div
                className={cx(
                  styles.pageInputWrap,
                  pageInputCollapsed && styles.pageInputWrapCollapsed,
                )}
              >
                <input
                  className={styles.pageInput}
                  value={pageInputValue}
                  disabled={disabled}
                  inputMode="numeric"
                  aria-label="Current page"
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
                />
              </div>
              <span className={styles.countText}>{countText}</span>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={disabled || atLastPage}
                aria-label="Next page"
              >
                <IdsIcon
                  shape="chev-right"
                  size={16}
                  color="currentColor"
                  style={{ width: 16, height: 16 }}
                />
              </button>
              <button
                type="button"
                className={cx(
                  styles.iconButton,
                  firstLastCollapsed && styles.iconButtonCollapsed,
                )}
                onClick={() => goToPage(safeTotalPages)}
                disabled={disabled || atLastPage}
                aria-label="Last page"
              >
                <IdsIcon
                  shape="double-chev-right"
                  size={16}
                  color="currentColor"
                  style={{ width: 16, height: 16 }}
                />
              </button>
            </>
          )}
        </div>
      </nav>
      {perPageMenuOpen && typeof document !== "undefined"
        ? createPortal(
            <ul
              ref={menuRef}
              id={menuId}
              className={cx(
                styles.dropdownMenu,
                styles.dropdownMenuPortaled,
                menuPlacement === "above"
                  ? styles.dropdownMenuAbove
                  : styles.dropdownMenuBelow,
              )}
              role="listbox"
              aria-label="Items per page options"
              data-ids-pagination-per-page-menu
              data-placement={menuPlacement}
              style={{
                position: "fixed",
                top: perPageMenuPos?.top ?? 0,
                left: perPageMenuPos?.left ?? 0,
                width: perPageMenuPos?.width ?? 90,
              }}
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
                      className={cx(
                        styles.dropdownOption,
                        selected && styles.dropdownOptionSelected,
                      )}
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
    </>
  );
}

IdsPagination.displayName = "IdsPagination";

export default IdsPagination;
