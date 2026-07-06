export const IDS_PAGINATION_DESIGN_SPEC_PATH = "components/ids/pagination/design-spec.md";
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
];
export const PAGINATION_EVENT_KEYS = [
    "pageChange",
    "pageSizeChange",
    "firstPageNavigate",
    "previousPageNavigate",
    "nextPageNavigate",
    "lastPageNavigate",
];
export const PAGINATION_BACKGROUND_OPTIONS = [
    "gray",
    "white",
    "none",
];
export const PAGINATION_DROPDOWN_STATES = [
    "collapsed",
    "expanded-below",
    "expanded-above",
];
export const PAGINATION_SPEC_ACCURATE_DEFAULTS = {
    currentPage: 1,
    totalPages: 16,
    pageSize: 25,
    pageSizeOptions: [25, 50, 75, 100],
    showPerPage: true,
    showFirstLast: true,
    showPageOffset: false,
    background: "gray",
    disabled: false,
    dropdownState: "collapsed",
    pageOffsetDropdownState: "collapsed",
};
/** @deprecated Use PAGINATION_SPEC_ACCURATE_DEFAULTS */
export const PAGINATION_API_DEFAULTS = PAGINATION_SPEC_ACCURATE_DEFAULTS;
