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
 * Composition: lib `IdsIcon` for nav glyphs; the results-per-page control
 * composes the shared IDS single-select dropdown (`dropdown-shared`:
 * `DropdownMenu` + `IdsDropdownTriggerShell`).
 * Page number is always a numeric text input (never a dropdown).
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
import { DropdownMenu, IdsDropdownTriggerShell } from "../dropdown-shared";
import { IdsIcon } from "../icon";
import { IdsTextBox } from "../text-box";
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
  summaryFormatter?: (currentPage: number, totalPages: number) => string;
  /** Default `"auto"`. */
  responsiveMode?: IdsPaginationResponsiveMode;
  /** Collapse priority when `responsiveMode="auto"`. `"results-per-page"` is ignored — the results-per-page group always renders when `showResultsPerPage` is true. Default `["results-per-page"]`.
   */
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
  summaryFormatter,
  responsiveMode: responsiveModeProp = "auto",
  collapseOrder: collapseOrderProp,
  className,
  "aria-label": ariaLabel = "Pagination",
  ...rest
}: IdsPaginationProps): ReactElement {
  const menuId = useId();
  const rootRef = useRef<HTMLElement | null>(null);

  const background = resolveBackground(backgroundProp);
  const responsiveMode = resolveResponsiveMode(responsiveModeProp);
  // Results-per-page always renders — strip it from the collapse candidates.
  const collapseOrder = resolveCollapseOrder(collapseOrderProp).filter(
    (slot) => slot !== "results-per-page",
  );

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
  const [collapseLevel, setCollapseLevel] = useState(0);

  useEffect(() => {
    setPageInputValue(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const atFirstPage = safeCurrentPage <= 1;
  const atLastPage = safeCurrentPage >= safeTotalPages;
  const isSinglePage = safeTotalPages <= 1;

  const goToPage = useCallback(
    (nextPage: number) => {
      const clamped = clamp(nextPage, 1, safeTotalPages);
      onPageChange(clamped);
    },
    [onPageChange, safeTotalPages],
  );

  const commitPageInput = useCallback(() => {
    const parsed = Number.parseInt(pageInputValue, 10);
    if (!Number.isFinite(parsed)) {
      setPageInputValue(String(safeCurrentPage));
      return;
    }
    goToPage(parsed);
  }, [goToPage, pageInputValue, safeCurrentPage]);

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
              <DropdownMenu
                trigger={
                  <IdsDropdownTriggerShell
                    size="small"
                    filled
                    className={styles.perPageTrigger}
                    left={<span>{safePageSize}</span>}
                  />
                }
                items={safePageSizeOptions.map((option) => ({
                  label: String(option),
                  value: String(option),
                  selectable: true,
                  onClick: () => onPageSizeChange?.(option),
                }))}
                selectionMode="single"
                selectedValues={[String(safePageSize)]}
                matchTriggerWidth
                side="bottom"
                ariaLabel="Items per page"
                listboxId={menuId}
              />
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
                disabled={atFirstPage}
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
                disabled={atFirstPage}
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
                  styles.pageInput,
                  pageInputCollapsed && styles.pageInputCollapsed,
                )}
                onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                  if (event.key === "Enter") {
                    commitPageInput();
                    const input =
                      event.currentTarget.querySelector(
                        '[data-ids="ids-text-box-input"]',
                      ) as HTMLInputElement | null;
                    input?.blur();
                  }
                }}
                onBlurCapture={() => {
                  commitPageInput();
                }}
              >
                <IdsTextBox
                  componentType="text-input"
                  size="small"
                  inputType="text"
                  ariaLabel="Current page"
                  value={pageInputValue}
                  showIcon={false}
                  selectTextOnFocus={null}
                  onValueChange={(value) =>
                    setPageInputValue(value.replace(/[^\d]/g, ""))
                  }
                />
              </div>
              <span className={styles.countText}>{countText}</span>
              <button
                type="button"
                className={styles.iconButton}
                onClick={() => goToPage(safeCurrentPage + 1)}
                disabled={atLastPage}
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
                disabled={atLastPage}
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
    </>
  );
}

IdsPagination.displayName = "IdsPagination";

export default IdsPagination;
