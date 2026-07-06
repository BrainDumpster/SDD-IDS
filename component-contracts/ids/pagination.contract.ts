export const IDS_PAGINATION_DESIGN_SPEC_PATH =
  "components/ids/pagination/design-spec.md" as const;

export type IdsPaginationBackground = "none" | "gray" | "white";

export type IdsPaginationDropdownState =
  | "collapsed"
  | "expanded-below"
  | "expanded-above";

export const PAGINATION_ROOT_PROP_KEYS = [
  "currentPage",
  "totalPages",
  "pageSize",
  "pageSizeOptions",
  "pageOffsetOptions",
  "showPerPage",
  "showFirstLast",
  "showPageOffset",
  "dropdownState",
  "pageOffsetDropdownState",
  "background",
  "embeddedInDatagrid",
  "disabled",
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

export const PAGINATION_SPEC_ACCURATE_DEFAULTS = {
  currentPage: 1,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100] as const,
  showPerPage: true,
  showFirstLast: true,
  showPageOffset: false,
  background: "gray" as IdsPaginationBackground,
  disabled: false,
  dropdownState: "collapsed" as IdsPaginationDropdownState,
  pageOffsetDropdownState: "collapsed" as IdsPaginationDropdownState,
};

/** @deprecated Use PAGINATION_SPEC_ACCURATE_DEFAULTS */
export const PAGINATION_API_DEFAULTS = PAGINATION_SPEC_ACCURATE_DEFAULTS;
