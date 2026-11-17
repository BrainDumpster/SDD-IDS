/**
 * IDS Dropdown (shared) — constants, option model types and pure resolvers.
 *
 * Specs: `components/ids/dropdown-single-select|dropdown-multiselect|dropdown-combo-box/design-spec.md`
 * API:   `lib/react/ids/dropdown-shared` (+ per-variant wrappers)
 *
 * Live Figma (file `0bHk3XhrjFhowgFkz9yLr4`, verified via Figma MCP 2026-11-06):
 *   - single-select matrix `11099:58099`; field Container `12579:77895` → `Corner Radius/radius-none`
 *   - multiselect field `12608:96588` → `radius-none`
 *   - combo box field `29393:149487` → `radius-none`
 */

export type IdsDropdownSize = "small" | "large";
export type IdsDropdownMenuWidth = "trigger" | "content";
export type IdsDropdownOptionKind = "option" | "section" | "divider";

/** Option model — identical to the React `*OptionModel` (`{ id, label, disabled?, kind? }`). */
export interface IdsDropdownOption {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: IdsDropdownOptionKind;
}

/** Selection model of the shared menu. */
export type IdsDropdownSelectionMode = "single" | "multi";

/** Internal normalised menu row (React `DropdownMenu` `MenuItem`). */
export interface IdsDropdownMenuItem {
  id: string;
  label: string;
  kind?: IdsDropdownOptionKind;
  /** Selectable option rows only (not sections / dividers). */
  selectable: boolean;
  disabled?: boolean;
}

/** `ids-change` detail. */
export interface IdsDropdownChangeDetail {
  value: string | string[];
}

/** `ids-open-change` detail. */
export interface IdsDropdownOpenChangeDetail {
  open: boolean;
}

/** `ids-search` detail. */
export interface IdsDropdownSearchDetail {
  query: string;
}

/** Visible option ids reported by `ids-select-all` / `ids-clear-all` (`undefined` = no filter). */
export interface IdsDropdownBulkDetail {
  visibleValues?: string[];
}

/** Field widths (shell `min-width` / `max-width`) and menu clamp — design-spec Layout. */
export const DROPDOWN_MENU_MIN_WIDTH = 186;
export const DROPDOWN_MENU_MAX_WIDTH = 700;

/** `.item` min-height (large) — used for `maxVisibleItems` → scroll-region height. */
export const DROPDOWN_OPTION_ROW_HEIGHT = 40;

/** Default number of option rows visible before the list scrolls. */
export const DROPDOWN_DEFAULT_MAX_VISIBLE_ITEMS = 6;

/** Popup min-height (combo box, searchable): search only / search + Select All row. */
export const DROPDOWN_SEARCH_MIN_HEIGHT = 212;
export const DROPDOWN_SEARCH_SELECT_ALL_MIN_HEIGHT = 252;

/** Popup `sideOffset` (px): −1 so the popup top border merges with the field bottom border. */
export const DROPDOWN_SIDE_OFFSET = -1;

/** Viewport margin used when deciding to flip the popup above the field. */
export const DROPDOWN_VIEWPORT_MARGIN = 8;

/** Matches React `.popup { z-index: 1060 }` (tooltip panels sit at 1070). */
export const DROPDOWN_PORTAL_Z_INDEX = 1060;

/** Icon slugs (assets under `assets/icons/`). */
export const DROPDOWN_CARET_ICON_SLUG = "arrow-drop-tri-caret";
export const DROPDOWN_ERROR_ICON_SLUG = "status-critical-square-solid";
export const DROPDOWN_SEARCH_ICON_SLUG = "search-16";
export const DROPDOWN_SEARCH_CLEAR_ICON_SLUG = "ctrl-close-16";
export const DROPDOWN_TAG_CLOSE_ICON_SLUG = "shape-x-thick";

export function resolveSize(value: unknown): IdsDropdownSize {
  return value === "small" ? "small" : "large";
}

export function resolveMenuWidth(value: unknown): IdsDropdownMenuWidth {
  return value === "content" ? "content" : "trigger";
}

export function isSelectableOption(option: IdsDropdownOption): boolean {
  return option.kind !== "section" && option.kind !== "divider";
}

/** Options → menu rows (sections / dividers are not selectable). */
export function toMenuItems(options: readonly IdsDropdownOption[]): IdsDropdownMenuItem[] {
  return options.map((option) => {
    if (option.kind === "section" || option.kind === "divider") {
      return {
        id: option.id,
        label: option.label,
        kind: option.kind,
        selectable: false,
      };
    }
    return {
      id: option.id,
      label: option.label,
      kind: "option" as const,
      selectable: true,
      disabled: option.disabled,
    };
  });
}

/**
 * Case-insensitive substring filter on the option label. Sections / dividers
 * are hidden while a query is active; empty query → unchanged list.
 */
export function filterMenuItems(
  items: readonly IdsDropdownMenuItem[],
  query: string,
  searchable: boolean,
): IdsDropdownMenuItem[] {
  const q = (query ?? "").trim().toLowerCase();
  if (!searchable || q.length === 0) return [...items];
  return items.filter((item) => {
    if (item.kind === "section" || item.kind === "divider") return false;
    return item.label.toLowerCase().includes(q);
  });
}

/**
 * Inline autocomplete (combo-box spec): when the typed keyword is a prefix of
 * exactly one selectable option, return the remaining tail (preserving the
 * option's own casing). Otherwise `""`.
 */
export function computeGhostSuffix(
  items: readonly IdsDropdownMenuItem[],
  typed: string,
): string {
  if (typed.length === 0) return "";
  const q = typed.toLowerCase();
  const prefixMatches = items.filter(
    (item) =>
      item.kind !== "section" &&
      item.kind !== "divider" &&
      item.selectable &&
      item.label.toLowerCase().startsWith(q),
  );
  if (prefixMatches.length === 1 && prefixMatches[0].label.toLowerCase() !== q) {
    return prefixMatches[0].label.slice(typed.length);
  }
  return "";
}

/** Normalise a `string | string[]` selection (combo box). */
export function normalizeSelected(
  multi: boolean,
  value: string | string[] | undefined | null,
): string[] {
  if (value == null) return [];
  if (multi) {
    return Array.isArray(value) ? value.filter(Boolean) : value ? [value] : [];
  }
  if (Array.isArray(value)) return value[0] ? [value[0]] : [];
  return value ? [value] : [];
}

/** Boolean attribute that defaults to `true`; `attr="false"` turns it off. */
export const defaultTrueBooleanConverter = {
  fromAttribute: (value: string | null): boolean => value !== null && value !== "false",
  toAttribute: (value: boolean): string | null => (value ? "" : null),
};

/** Optional boolean (`undefined` = unset) — presence → true, `"false"` → false. */
export const optionalBooleanConverter = {
  fromAttribute: (value: string | null): boolean | undefined =>
    value === null ? undefined : value !== "false",
};
