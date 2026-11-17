/**
 * Pagination constants — from `components/ids/pagination/design-spec.md`
 * and React `lib/react/ids/pagination` API.
 */

export type IdsPaginationBackground = "gray" | "white" | "none";
export type IdsPaginationResponsiveMode = "auto" | "keep-inline";
export type IdsPaginationCollapseSlot =
  | "results-per-page"
  | "page-input"
  | "first-last-buttons";
export type IdsPaginationDropdownState =
  | "collapsed"
  | "expanded-below"
  | "expanded-above";

export const PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 75, 100] as const;

export const PAGINATION_DEFAULT_COLLAPSE_ORDER: IdsPaginationCollapseSlot[] = [
  "results-per-page",
];

export const PAGINATION_BACKGROUNDS = new Set<IdsPaginationBackground>([
  "gray",
  "white",
  "none",
]);

export const PAGINATION_RESPONSIVE_MODES = new Set<IdsPaginationResponsiveMode>([
  "auto",
  "keep-inline",
]);

export const PAGINATION_COLLAPSE_SLOTS = new Set<IdsPaginationCollapseSlot>([
  "results-per-page",
  "page-input",
  "first-last-buttons",
]);

export const PAGINATION_RUNTIME_DEFAULTS = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 25,
  pageSizeOptions: [...PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS],
  showResultsPerPage: true,
  background: "gray" as IdsPaginationBackground,
  responsiveMode: "auto" as IdsPaginationResponsiveMode,
  collapseOrder: [...PAGINATION_DEFAULT_COLLAPSE_ORDER],
  ariaLabel: "Pagination",
} as const;

/** Spec Accurate Design story defaults (Figma Main / page nav). */
export const PAGINATION_SPEC_ACCURATE_DEFAULTS = {
  currentPage: 1,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [...PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS],
  showResultsPerPage: true,
  background: "gray" as IdsPaginationBackground,
  responsiveMode: "auto" as IdsPaginationResponsiveMode,
  collapseOrder: [...PAGINATION_DEFAULT_COLLAPSE_ORDER],
} as const;

export const PAGINATION_NAV_ICON_SIZE = 16;
export const PAGINATION_CARET_ICON_SIZE = 10;

export const PAGINATION_ICON_SHAPES = {
  first: "double-chev-left",
  previous: "chev-left",
  next: "chev-right",
  last: "double-chev-right",
  caret: "arrow-drop-tri-caret",
} as const;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function normalizePageSizeOptions(
  options: number[] | undefined,
): number[] {
  if (!options || options.length === 0) {
    return [...PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS];
  }
  const uniquePositive = Array.from(
    new Set(options.filter((value) => Number.isFinite(value) && value > 0)),
  );
  return uniquePositive.length > 0
    ? uniquePositive
    : [...PAGINATION_DEFAULT_PAGE_SIZE_OPTIONS];
}

export function resolveBackground(
  value: IdsPaginationBackground | string | undefined,
): IdsPaginationBackground {
  if (value != null && PAGINATION_BACKGROUNDS.has(value as IdsPaginationBackground)) {
    return value as IdsPaginationBackground;
  }
  return "gray";
}

export function resolveResponsiveMode(
  value: IdsPaginationResponsiveMode | string | undefined,
): IdsPaginationResponsiveMode {
  if (
    value != null &&
    PAGINATION_RESPONSIVE_MODES.has(value as IdsPaginationResponsiveMode)
  ) {
    return value as IdsPaginationResponsiveMode;
  }
  return "auto";
}

export function resolveCollapseOrder(
  value: IdsPaginationCollapseSlot[] | undefined,
): IdsPaginationCollapseSlot[] {
  if (!value || value.length === 0) {
    return [...PAGINATION_DEFAULT_COLLAPSE_ORDER];
  }
  const filtered = value.filter((slot) => PAGINATION_COLLAPSE_SLOTS.has(slot));
  return filtered.length > 0 ? filtered : [...PAGINATION_DEFAULT_COLLAPSE_ORDER];
}

export function defaultPageCountText(
  _currentPage: number,
  totalPages: number,
): string {
  if (totalPages <= 1) return "1 page";
  return `of ${totalPages}`;
}

/** Boolean attrs that default to `true` — only `"false"` turns them off. */
export const trueByDefault = {
  fromAttribute: (value: string | null) => value !== "false",
  toAttribute: (value: boolean) => (value ? "true" : "false"),
};
