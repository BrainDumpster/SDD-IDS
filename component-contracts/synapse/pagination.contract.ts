import type {
  IdsPaginationBackground,
  IdsPaginationDropdownState,
  IdsPaginationProps,
} from "../components/IdsPagination";

/**
 * Synapse Pagination — thin IDS fork; layout, anatomy, and Icon usage inherit IDS baseline.
 */
export const SYNAPSE_PAGINATION_DESIGN_SPEC_PATH =
  "components/synapse/pagination/design-spec.md" as const;

export const SYNAPSE_PAGINATION_IDS_BASELINE_SPEC_PATH =
  "components/ids/pagination/design-spec.md" as const;

export const SYNAPSE_PAGINATION_SPEC_PATTERN = "ids-fork" as const;

/** Synapse registry node (`data/synapse-component-registry.json`). */
export const SYNAPSE_PAGINATION_MAIN_NODE_ID = "37721:115815" as const;

/** IDS spec-accurate reference (Synapse inherits IDS pagination chrome). */
export const SYNAPSE_PAGINATION_SPEC_ACCURATE_NODE_ID = "11677:157840" as const;

export const SYNAPSE_PAGINATION_BACKGROUND_OPTIONS: IdsPaginationBackground[] = [
  "gray",
  "white",
  "none",
];

export const SYNAPSE_PAGINATION_DROPDOWN_STATES: IdsPaginationDropdownState[] = [
  "collapsed",
  "expanded-below",
  "expanded-above",
];

export const SYNAPSE_PAGINATION_API_DEFAULTS: Pick<
  IdsPaginationProps,
  | "currentPage"
  | "totalPages"
  | "pageSize"
  | "pageSizeOptions"
  | "showPerPage"
  | "showFirstLast"
  | "showPageOffset"
> = {
  currentPage: 2,
  totalPages: 16,
  pageSize: 25,
  pageSizeOptions: [25, 50, 75, 100],
  showPerPage: true,
  showFirstLast: true,
  showPageOffset: false,
};
