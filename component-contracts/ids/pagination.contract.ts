export const IDS_PAGINATION_DESIGN_SPEC_PATH =
  "components/ids/pagination/design-spec.md" as const;

export type IdsPaginationBackground = "none" | "gray" | "white";

export type IdsPaginationDropdownState =
  | "collapsed"
  | "expanded-below"
  | "expanded-above";

export type IdsPaginationResponsiveMode = "auto" | "keep-inline";

export type IdsPaginationCollapseSlot =
  | "results-per-page"
  | "page-input"
  | "first-last-buttons";

export const PAGINATION_ROOT_PROP_KEYS = [
  "currentPage",
  "totalPages",
  "pageSize",
  "pageSizeOptions",
  "showPerPage",
  "showFirstLast",
  "dropdownState",
  "background",
  "embeddedInDatagrid",
  "disabled",
  "responsiveMode",
  "collapseOrder",
] as const;

export const PAGINATION_EVENT_KEYS = [
  "pageChange",
  "pageSizeChange",
  "firstPageNavigate",
  "previousPageNavigate",
  "nextPageNavigate",
  "lastPageNavigate",
] as const;

export const PAGINATION_BACKGROUND_OPTIONS: IdsPaginationBackground[] = [
  "gray",
  "white",
  "none",
];

export const PAGINATION_DROPDOWN_STATES: IdsPaginationDropdownState[] = [
  "collapsed",
  "expanded-below",
  "expanded-above",
];

export const PAGINATION_COLLAPSE_SLOTS: IdsPaginationCollapseSlot[] = [
  "results-per-page",
  "page-input",
  "first-last-buttons",
];

export const PAGINATION_RESPONSIVE_MODES: IdsPaginationResponsiveMode[] = [
  "auto",
  "keep-inline",
];

export const PAGINATION_SPEC_ACCURATE_DEFAULTS = {
  currentPage: 1,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100] as const,
  showPerPage: true,
  showFirstLast: true,
  background: "gray" as IdsPaginationBackground,
  disabled: false,
  dropdownState: "collapsed" as IdsPaginationDropdownState,
  responsiveMode: "auto" as IdsPaginationResponsiveMode,
  collapseOrder: ["results-per-page"] as IdsPaginationCollapseSlot[],
};

/** @deprecated Use PAGINATION_SPEC_ACCURATE_DEFAULTS */
export const PAGINATION_API_DEFAULTS = PAGINATION_SPEC_ACCURATE_DEFAULTS;
