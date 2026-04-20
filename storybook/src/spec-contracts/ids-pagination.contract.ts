import type {
  IdsPaginationBackground,
  IdsPaginationDropdownState,
  IdsPaginationProps,
} from "../components/dap/IdsPagination";

export const IDS_PAGINATION_DESIGN_SPEC_PATH =
  "components/DAP/pagination/design-spec.mdx" as const;

export const PAGINATION_ROOT_PROP_KEYS = [
  "currentPage",
  "totalPages",
  "onPageChange",
  "pageSize",
  "pageSizeOptions",
  "onPageSizeChange",
  "showPerPage",
  "showFirstLast",
  "showPageOffset",
  "pageOffsetOptions",
  "dropdownState",
  "pageOffsetDropdownState",
  "background",
  "disabled",
] as const;

export const PAGINATION_CODEGEN_ANATOMY = [
  "PaginationRoot",
  "PaginationPrev?",
  "PaginationPageList",
  "PaginationPageButton",
  "PaginationEllipsis?",
  "PaginationNext?",
  "PaginationSummary?",
  "PaginationPageSize?",
  "PaginationJumpToPage?",
] as const;

export const PAGINATION_BACKGROUND_OPTIONS: IdsPaginationBackground[] = ["none", "gray"];
export const PAGINATION_DROPDOWN_STATES: IdsPaginationDropdownState[] = [
  "collapsed",
  "expanded-below",
  "expanded-above",
];

export const PAGINATION_API_DEFAULTS: Pick<
  IdsPaginationProps,
  | "currentPage"
  | "totalPages"
  | "pageSize"
  | "pageSizeOptions"
  | "showPerPage"
  | "showFirstLast"
  | "showPageOffset"
> = {
  currentPage: 1,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100],
  showPerPage: true,
  showFirstLast: true,
  showPageOffset: false,
};
