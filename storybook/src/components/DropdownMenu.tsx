import { Menu } from "@base-ui-components/react/menu";
import { ScrollArea } from "@base-ui-components/react/scroll-area";
import { useMemo, useRef, useState, type RefObject } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { Tag } from "./Tag";
import styles from "./DropdownMenu.module.css";
import search16Icon from "../../../assets/icons/search-16.svg";

interface MenuItem {
  id?: string;
  label: string;
  value?: string;
  onClick?: () => void;
  disabled?: boolean;
  kind?: "item" | "section" | "divider";
  selectable?: boolean;
  selected?: boolean;
  indeterminate?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: MenuItem[];
  disabled?: boolean;
  selectionMode?: "single" | "multi" | "none";
  showSingleSelectRadio?: boolean;
  showSelectAllClearAll?: boolean;
  /** Single-select only: shows a top "Clear All" row (footer-action visual with
   *  a bottom border) whenever a value is selected. Clicking fires
   *  `onClearAllClick`; once the selection is cleared the row disappears. */
  showClearAll?: boolean;
  selectAllLabel?: string;
  clearAllLabel?: string;
  selectAllChecked?: boolean;
  selectAllIndeterminate?: boolean;
  /**
   * Fired when "Select All" is clicked. While a search filter is active, receives the
   * list of currently-visible option values so the consumer can add only those to the
   * selection (keeping off-filter selections). No filter → called with `undefined`.
   */
  onSelectAllClick?: (visibleValues?: string[]) => void;
  /**
   * Fired when "Clear All" is clicked. While a search filter is active, receives the
   * list of currently-visible option values so the consumer can deselect only those
   * (keeping off-filter selections). No filter → called with `undefined`.
   */
  onClearAllClick?: (visibleValues?: string[]) => void;
  clearAllDisabled?: boolean;
  footerActionLabel?: string;
  onFooterActionClick?: () => void;
  selectedValues?: string[];
  /** Explicit max height (px) for the options scroll region. Overrides `maxVisibleItems`. */
  maxHeight?: number;
  /** Number of option rows visible before the list starts scrolling. Default `6`. */
  maxVisibleItems?: number;
  /**
   * Preferred side of the trigger the popup opens on. When the preferred side does not
   * fit, Base UI flips. Defaults to `bottom`.
   */
  side?: "top" | "bottom";
  sideOffset?: number;
  matchTriggerWidth?: boolean;
  /**
   * Menu width policy (Figma: dropdown width can follow the container or the
   * longest item):
   * - `"trigger"` (default): container-driven — menu matches the trigger/field
   *   width; long options truncate with an ellipsis.
   * - `"content"`: content-driven — menu grows to the widest option, clamped
   *   between the trigger width and 700px.
   */
  menuWidth?: "trigger" | "content";
  defaultOpen?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchValueChange?: (value: string) => void;
  /** Row text shown when a search query matches no options. */
  noResultsLabel?: string;
  /** Multi-select: Show Selected / Hide Selected panel with dismissible tag chips (Figma `12730:120316`). */
  showSelectedPanel?: boolean;
  showSelectedExpanded?: boolean;
  defaultShowSelectedExpanded?: boolean;
  onShowSelectedExpandedChange?: (expanded: boolean) => void;
  showSelectedLabel?: string;
  hideSelectedLabel?: string;
  onRemoveSelectedTag?: (value: string) => void;
  /** @deprecated No longer used — the panel's dismiss (x) control was removed. Use `onClearAllClick`; the panel auto-hides when no items remain selected. */
  onShowSelectedPanelClear?: () => void;
  /** When true the trigger stretches to fill its parent container. */
  fullWidth?: boolean;
  /** Portal menu into this element (e.g. modal popup) so it stays interactive inside modal dialogs. */
  portalContainer?: HTMLElement | RefObject<HTMLElement | null> | null;
}

export function DropdownMenu({
  trigger,
  items,
  disabled = false,
  selectionMode = "none",
  showSingleSelectRadio = false,
  showSelectAllClearAll = false,
  showClearAll = false,
  selectAllLabel = "Select All",
  clearAllLabel = "Clear All",
  selectAllChecked = false,
  selectAllIndeterminate = false,
  onSelectAllClick,
  onClearAllClick,
  clearAllDisabled = false,
  footerActionLabel,
  onFooterActionClick,
  selectedValues = [],
  maxHeight,
  maxVisibleItems = 6,
  side = "bottom",
  // -1 so the popup's top border overlaps the field's bottom border (they merge into
  // one 1px line) — the attached-dropdown look, while keeping a full 4-sided border.
  sideOffset = -1,
  matchTriggerWidth = true,
  menuWidth = "trigger",
  defaultOpen = false,
  showSearch = false,
  searchValue,
  searchPlaceholder = "Search",
  onSearchValueChange,
  noResultsLabel = "No results found",
  showSelectedPanel = false,
  showSelectedExpanded,
  defaultShowSelectedExpanded = false,
  onShowSelectedExpandedChange,
  showSelectedLabel = "Show Selected",
  hideSelectedLabel = "Hide Selected",
  onRemoveSelectedTag,
  fullWidth = false,
  portalContainer,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen && !disabled);
  const [internalShowSelectedExpanded, setInternalShowSelectedExpanded] = useState(defaultShowSelectedExpanded);

  const isShowSelectedExpandedControlled = showSelectedExpanded !== undefined;
  const isShowSelectedExpanded = isShowSelectedExpandedControlled
    ? showSelectedExpanded
    : internalShowSelectedExpanded;

  const setShowSelectedExpanded = (next: boolean) => {
    if (!isShowSelectedExpandedControlled) {
      setInternalShowSelectedExpanded(next);
    }
    onShowSelectedExpandedChange?.(next);
  };

  const selectedTagItems = useMemo(
    () =>
      selectedValues.map((value) => {
        const item = items.find((entry) => entry.value === value || entry.label === value);
        return { value, label: item?.label ?? value };
      }),
    [items, selectedValues],
  );

  // Search value: controlled via `searchValue` prop, else internal state.
  const isSearchControlled = searchValue !== undefined;
  const [internalSearch, setInternalSearch] = useState("");
  const currentSearch = isSearchControlled ? searchValue : internalSearch;

  const setSearch = (next: string) => {
    if (!isSearchControlled) {
      setInternalSearch(next);
    }
    onSearchValueChange?.(next);
  };

  // Inline autocomplete: when the typed keyword is a prefix of exactly one option,
  // show the remaining suffix of that option as greyed-out ghost text after the
  // caret (Figma combo-box: "if the keyword matches only one option, the suggested
  // result is autocompleted"). The typed value stays as-is; the ghost suffix is a
  // suggestion accepted with Tab / → / End. Only computed on text insertion —
  // deleting/clearing clears the suggestion.
  const searchInputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [ghostSuffix, setGhostSuffix] = useState("");
  const computeGhostSuffix = (typed: string): string => {
    if (typed.length === 0) return "";
    const q = typed.toLowerCase();
    const prefixMatches = items.filter(
      (item) =>
        item.kind !== "section" &&
        item.kind !== "divider" &&
        item.selectable !== false &&
        item.label.toLowerCase().startsWith(q),
    );
    if (prefixMatches.length === 1 && prefixMatches[0].label.toLowerCase() !== q) {
      // Preserve the option's own casing for the suggested tail.
      return prefixMatches[0].label.slice(typed.length);
    }
    return "";
  };
  const handleSearchInput = (typed: string, isInsertion: boolean) => {
    setSearch(typed);
    setGhostSuffix(isInsertion ? computeGhostSuffix(typed) : "");
  };

  const showSearchClear = Boolean(currentSearch && currentSearch.length > 0);

  // Filter options by substring (contains) match, case-insensitive — matches the
  // datagrid combobox/multiselect filter behavior.
  // Sections/dividers are hidden while searching; no match → nothing renders.
  const displayedItems = useMemo(() => {
    const query = (currentSearch ?? "").trim().toLowerCase();
    if (!showSearch || query.length === 0) return items;
    return items.filter((item) => {
      if (item.kind === "section" || item.kind === "divider") return false;
      return item.label.toLowerCase().includes(query);
    });
  }, [items, showSearch, currentSearch]);

  // Active search query yielding zero options → show a "No results found" row.
  const hasSearchQuery = (currentSearch ?? "").trim().length > 0;
  const showNoResults = showSearch && hasSearchQuery && displayedItems.length === 0;

  // Options scroll: show up to `maxVisibleItems` rows (default 6) before scrolling.
  // No overflow when the list fits; scroll kicks in only past the threshold.
  const OPTION_ROW_HEIGHT = 40; // .item min-height (large)
  const optionRowCount = displayedItems.filter(
    (item) => item.kind !== "section" && item.kind !== "divider",
  ).length;
  const effectiveMaxHeight = maxHeight ?? maxVisibleItems * OPTION_ROW_HEIGHT;
  const scrollRegionStyle =
    optionRowCount > maxVisibleItems || maxHeight != null
      ? { maxHeight: effectiveMaxHeight, overflowY: "auto" as const }
      : undefined;

  // Select All / Clear All row: always visible when not searching; while searching,
  // only keep it when at least 2 options match the query.
  const showSelectAllRow = showSelectAllClearAll && (!hasSearchQuery || optionRowCount >= 2);

  // Single-select Clear All row: visible whenever a value is selected.
  const showSingleClearAllRow =
    selectionMode === "single" && showClearAll && selectedValues.length > 0;

  // Values of the options currently visible (respecting the search filter).
  const visibleSelectableValues = displayedItems
    .filter((item) => item.kind !== "section" && item.kind !== "divider" && item.selectable)
    .map((item) => item.value ?? item.label);

  // While searching, the Select All checkbox reflects only the visible options;
  // otherwise it uses the caller-provided checked/indeterminate props.
  const allVisibleSelected =
    visibleSelectableValues.length > 0 &&
    visibleSelectableValues.every((value) => selectedValues.includes(value));
  const someVisibleSelected = visibleSelectableValues.some((value) => selectedValues.includes(value));
  const effectiveSelectAllChecked = hasSearchQuery ? allVisibleSelected : selectAllChecked;
  const effectiveSelectAllIndeterminate = hasSearchQuery
    ? someVisibleSelected && !allVisibleSelected
    : selectAllIndeterminate;

  // While searching, Clear All only acts on visible options → disable it when none
  // of the visible options are currently selected; otherwise use the caller's prop.
  const effectiveClearAllDisabled = hasSearchQuery ? !someVisibleSelected : clearAllDisabled;

  // Combo box popup min-height (Figma):
  //  - search only: 212px
  //  - search + Select All row + Show Selected row: 252px
  // 252px only while the Select All row is actually shown; when it's hidden
  // (no results, or fewer than 2 matches) the extra rows collapse → 212px.
  const popupMinHeight = showSearch
    ? showSelectAllRow
      ? 252
      : 212
    : undefined;

  // Width policy (Figma: menu width follows the container or the longest item):
  //  - "trigger" (default): menu matches the trigger/field width.
  //  - "content": menu grows to its widest option (CSS `.popupContentWidth`),
  //    clamped between the trigger width and 700px.
  // `--dropdown-trigger-width` aliases Base UI's `--anchor-width` (kept in sync
  // live by the positioner via floating-ui), so the CSS width rules resolve to
  // the current trigger width — no JS measurement, pixel-accurate, and it tracks
  // container resizes automatically.
  const contentWidthMode = menuWidth === "content";
  const popupStyle = {
    ...(matchTriggerWidth ? { "--dropdown-trigger-width": "var(--anchor-width)" } : {}),
    ...(popupMinHeight ? { minHeight: `${popupMinHeight}px` } : {}),
  };

  // Cross-section arrow-key navigation. Up/Down move between focusable popup
  // sections; Left/Right move within horizontal sections such as Select All /
  // Clear All and the Show Selected tags. Tab still visits every control.
  const handlePopupKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      return;
    }
    const popup = popupRef.current;
    if (!popup) return;
    const active = popup.ownerDocument.activeElement as HTMLElement | null;
    if (!active || !popup.contains(active)) return;

    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusables = (root: Element) => {
      const descendants = Array.from(
        root.querySelectorAll<HTMLElement>(focusableSelector),
      );
      if (root !== popup && root.matches(focusableSelector)) {
        descendants.unshift(root as HTMLElement);
      }
      return descendants;
    };

    const section = active.closest<HTMLElement>("[data-focus-section]");
    const sections = Array.from(popup.querySelectorAll<HTMLElement>("[data-focus-section]"));
    const sectionIndex = section ? sections.indexOf(section) : -1;
    if (sectionIndex === -1 || !section) return;

    const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const dir = horizontal
      ? event.key === "ArrowRight"
        ? 1
        : -1
      : event.key === "ArrowDown"
        ? 1
        : -1;

    // Horizontal: move within a multi-control row (Select All / Clear All) or
    // between Show Selected tags. Leave search input arrow keys for caret/ghost.
    if (horizontal) {
      const sectionId = section.dataset.focusSection;
      if (sectionId === "selectAllClearAll") {
        const focusables = getFocusables(section);
        const idx = focusables.indexOf(active);
        if (idx === -1) return;
        const next = focusables[idx + dir];
        if (next) {
          event.preventDefault();
          event.stopPropagation();
          next.focus();
        }
      } else if (sectionId === "showSelected" && active !== getFocusables(section)[0]) {
        const tagRow = section.querySelector<HTMLElement>('[data-focus-row="showSelectedTags"]');
        const tags = tagRow ? getFocusables(tagRow) : [];
        const idx = tags.indexOf(active);
        if (idx !== -1) {
          const next = tags[idx + dir];
          if (next) {
            event.preventDefault();
            event.stopPropagation();
            next.focus();
          }
        }
      }
      return;
    }

    // Vertical: navigate inside the option list and the Show Selected panel
    // (toggle → tags); at the ends jump to the adjacent popup section.
    if (section.dataset.focusSection === "options" || section.dataset.focusSection === "showSelected") {
      const focusables = getFocusables(section);
      const idx = focusables.indexOf(active);
      if (idx !== -1) {
        const nextIdx = idx + dir;
        if (nextIdx >= 0 && nextIdx < focusables.length) {
          event.preventDefault();
          event.stopPropagation();
          focusables[nextIdx].focus();
          return;
        }
      }
    }

    const nextSectionIndex = sectionIndex + dir;
    if (nextSectionIndex < 0 || nextSectionIndex >= sections.length) return;
    const nextSection = sections[nextSectionIndex];
    const nextFocusables = getFocusables(nextSection);
    const next =
      dir > 0 ? nextFocusables[0] : nextFocusables[nextFocusables.length - 1];
    if (next) {
      event.preventDefault();
      event.stopPropagation();
      next.focus();
    }
  };

  return (
    <Menu.Root
      modal={portalContainer != null ? false : undefined}
      open={open}
      onOpenChange={(nextOpen) => {
        if (disabled) {
          setOpen(false);
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <Menu.Trigger
        ref={triggerRef}
        className={fullWidth ? `${styles.triggerReset} ${styles.triggerFull}` : styles.triggerReset}
        disabled={disabled}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <span className={styles.triggerMeasure}>
          {trigger}
        </span>
      </Menu.Trigger>
      <Menu.Portal container={portalContainer ?? undefined}>
        <Menu.Positioner
          sideOffset={sideOffset}
          align="start"
          /* Field-attached combobox: keep left edge and side glued to the trigger.
             Default align-shift repositions the popup when Show Selected expands and
             briefly changes intrinsic width/height — perceived as screen drift. */
          collisionAvoidance={{ side: "none", align: "none", fallbackAxisSide: "none" }}
        >
          <Menu.Popup
            className={contentWidthMode ? `${styles.popup} ${styles.popupContentWidth}` : styles.popup}
            style={popupStyle}
          >
            {showSearch ? (
              <>
                <div className={styles.searchRow}>
                  <div className={styles.searchField}>
                    <span
                      className={styles.searchIcon}
                      aria-hidden="true"
                      style={{
                        WebkitMaskImage: `url('${search16Icon}')`,
                        maskImage: `url('${search16Icon}')`,
                      }}
                    />
                    <div className={styles.searchInputWrap}>
                      <div className={styles.searchInputBox}>
                        <input
                          ref={searchInputRef}
                          className={styles.searchInput}
                          type="text"
                          value={currentSearch}
                          placeholder={searchPlaceholder}
                          onChange={(event) => {
                            const value = event.target.value;
                            const nativeEvent = event.nativeEvent as Partial<InputEvent>;
                            // While an IME (e.g. Vietnamese Telex) is composing, the
                            // text isn't committed yet — never autocomplete into a
                            // half-composed value or the compositionend commit will
                            // duplicate it. Just track the value; the ghost is
                            // computed in onCompositionEnd once composition settles.
                            if (nativeEvent.isComposing) {
                              setSearch(value);
                              setGhostSuffix("");
                              return;
                            }
                            const inputType = nativeEvent.inputType;
                            // Autocomplete on typing, never on deleting. Prefer the
                            // InputEvent's inputType; fall back to a length compare
                            // when it is unavailable (older browsers).
                            const isDeletion =
                              typeof inputType === "string"
                                ? inputType.startsWith("delete")
                                : value.length < currentSearch.length;
                            handleSearchInput(value, !isDeletion);
                          }}
                          onCompositionEnd={(event) => {
                            // Composition committed — now it's safe to suggest.
                            const value = event.currentTarget.value;
                            setSearch(value);
                            setGhostSuffix(computeGhostSuffix(value));
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation();
                            // Ignore keys while the IME is composing (keyCode 229 /
                            // isComposing): Tab/→ then belong to the IME candidate UI,
                            // and mutating the value mid-composition corrupts it.
                            if (event.nativeEvent.isComposing || event.keyCode === 229) {
                              return;
                            }
                            // Accept the greyed-out ghost suggestion. Recompute the
                            // suffix from the live DOM value (not the ghostSuffix /
                            // currentSearch closures) so a fast type-then-Tab can
                            // never commit a stale value.
                            if (
                              event.key === "Tab" ||
                              event.key === "ArrowRight" ||
                              event.key === "End"
                            ) {
                              const input = event.currentTarget;
                              const typed = input.value;
                              const atEnd =
                                input.selectionStart === typed.length &&
                                input.selectionStart === input.selectionEnd;
                              if (event.key === "Tab" || atEnd) {
                                const suffix = computeGhostSuffix(typed);
                                if (suffix) {
                                  event.preventDefault();
                                  setSearch(typed + suffix);
                                  setGhostSuffix("");
                                }
                              }
                            }
                          }}
                        />
                        {ghostSuffix ? (
                          <span className={styles.searchGhost} aria-hidden="true">
                            <span className={styles.searchGhostTyped}>{currentSearch}</span>
                            <span className={styles.searchGhostSuffix}>{ghostSuffix}</span>
                          </span>
                        ) : null}
                      </div>
                      {showSearchClear ? (
                        <button
                          type="button"
                          className={styles.searchClearButton}
                          aria-label="Clear search"
                          tabIndex={-1}
                          onClick={() => setSearch("")}
                        >
                          <Icon
                            shapeName="shape-x-thick"
                            className={styles.searchClearIcon}
                            color="var(--color-icon-gray-neutral-accessible)"
                            style={{ width: 10, height: 10 }}
                          />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {showSelectAllRow ? (
              <div className={styles.selectAllClearAllRow}>
                <button
                  type="button"
                  className={styles.selectAllButton}
                  data-checked={effectiveSelectAllChecked ? "true" : undefined}
                  data-indeterminate={effectiveSelectAllIndeterminate ? "true" : undefined}
                  onClick={() => onSelectAllClick?.(hasSearchQuery ? visibleSelectableValues : undefined)}
                >
                  <span className={`${styles.checkboxOuter} ${styles.selectAllCheckbox}`} aria-hidden="true">
                    {effectiveSelectAllIndeterminate ? (
                      <span className={styles.checkboxDash} />
                    ) : effectiveSelectAllChecked ? (
                      <span className={styles.checkboxTick} />
                    ) : null}
                  </span>
                  <span>{selectAllLabel}</span>
                </button>
                <button
                  type="button"
                  className={styles.clearAllButton}
                  onClick={() => {
                    onClearAllClick?.(hasSearchQuery ? visibleSelectableValues : undefined);
                    // Clear All collapses the dropdown menu (Figma combo-box behavior 3d/4e).
                    setOpen(false);
                  }}
                  disabled={effectiveClearAllDisabled}
                >
                  {clearAllLabel}
                </button>
              </div>
            ) : null}
            {/* Single-select Clear All — below the search row, like the
               multi-select Select All / Clear All row. */}
            {showSingleClearAllRow ? (
              <button
                type="button"
                className={styles.clearAllAction}
                data-focus-section="singleClearAll"
                onClick={() => onClearAllClick?.()}
              >
                <span className={styles.footerActionButton}>{clearAllLabel}</span>
              </button>
            ) : null}
            {showSelectedPanel &&
            selectionMode === "multi" &&
            selectedValues.length > 0 &&
            !showNoResults ? (
              <div
                className={styles.showSelectedPanel}
                data-expanded={isShowSelectedExpanded ? "true" : undefined}
                data-focus-section="showSelected"
              >
                <div className={styles.showSelectedHeader}>
                  <button
                    type="button"
                    className={styles.showSelectedToggle}
                    aria-expanded={isShowSelectedExpanded}
                    onClick={() => setShowSelectedExpanded(!isShowSelectedExpanded)}
                  >
                    <span>{isShowSelectedExpanded ? hideSelectedLabel : showSelectedLabel}</span>
                    <Icon
                      shapeName="arrow-drop-tri-caret"
                      className={styles.showSelectedCaret}
                      color="var(--color-icon-brand-base)"
                      style={{
                        width: 10,
                        height: 10,
                        transform: isShowSelectedExpanded ? "rotate(180deg)" : undefined,
                      }}
                    />
                  </button>
                </div>
                {isShowSelectedExpanded ? (
                  <ScrollArea.Root className={styles.showSelectedTagsRoot}>
                    <ScrollArea.Viewport className={styles.showSelectedTags}>
                      {selectedTagItems.map((tag) => (
                        <Tag
                          key={tag.value}
                          label={tag.label}
                          type="editable"
                          size="lg"
                          closable
                          maxWidth="100%"
                          onDismiss={() => onRemoveSelectedTag?.(tag.value)}
                        />
                      ))}
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar className={styles.optionsScrollbar} orientation="vertical">
                      <ScrollArea.Thumb className={styles.optionsScrollThumb} />
                    </ScrollArea.Scrollbar>
                  </ScrollArea.Root>
                ) : null}
              </div>
            ) : null}
            <ScrollArea.Root className={styles.optionsScrollRoot}>
              <ScrollArea.Viewport className={styles.optionsScrollViewport} style={scrollRegionStyle}>
              {showNoResults ? (
                <div className={styles.noResults} role="presentation">
                  {noResultsLabel}
                </div>
              ) : null}
              {displayedItems.map((item, i) => {
                if (item.kind === "section") {
                  return (
                    <div key={item.id ?? i} className={styles.sectionHeader} role="presentation">
                      {item.label}
                    </div>
                  );
                }
                if (item.kind === "divider") {
                  return <div key={item.id ?? i} className={styles.sectionDivider} role="presentation" />;
                }
                const isSelectable = item.selectable && (selectionMode === "single" || selectionMode === "multi");
                const isIndeterminate = item.indeterminate ?? false;
                const isSelected =
                  item.selected ??
                  (item.value ? selectedValues.includes(item.value) : false);
                if (isSelectable) {
                  return (
                    <button
                      key={item.id ?? i}
                      type="button"
                      className={styles.item}
                      disabled={item.disabled}
                      data-disabled={item.disabled ? "true" : undefined}
                      data-selectable="true"
                      data-selection-mode={selectionMode}
                      data-selected={isSelected ? "true" : undefined}
                      data-indeterminate={isIndeterminate ? "true" : undefined}
                      onClick={() => {
                        item.onClick?.();
                        // Multi-select keeps the menu open for further selection;
                        // single-select closes after picking one option.
                        if (selectionMode !== "multi") {
                          setOpen(false);
                        }
                      }}
                      role={selectionMode === "multi" ? "menuitemcheckbox" : "menuitemradio"}
                      aria-checked={selectionMode === "multi" && isIndeterminate ? "mixed" : isSelected}
                    >
                      {selectionMode === "multi" ? (
                        <span className={styles.leadingControl} aria-hidden="true">
                          <span className={styles.checkboxOuter}>
                            {isIndeterminate ? (
                              <span className={styles.checkboxDash} />
                            ) : isSelected ? (
                              <span className={styles.checkboxTick} />
                            ) : null}
                          </span>
                        </span>
                      ) : null}
                      {selectionMode === "single" && showSingleSelectRadio ? (
                        <span className={styles.leadingControl} aria-hidden="true">
                          <span className={styles.radioOuter}>
                            {isSelected ? <span className={styles.radioInner} /> : null}
                          </span>
                        </span>
                      ) : null}
                      <span className={styles.itemLabel}>{item.label}</span>
                    </button>
                  );
                }
                return (
                  <Menu.Item
                    key={item.id ?? i}
                    className={styles.item}
                    onSelect={() => item.onClick?.()}
                    disabled={item.disabled}
                    data-selectable="false"
                    data-selected={isSelected ? "true" : undefined}
                  >
                    <span className={styles.itemLabel}>{item.label}</span>
                  </Menu.Item>
                );
              })}
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar className={styles.optionsScrollbar} orientation="vertical">
                <ScrollArea.Thumb className={styles.optionsScrollThumb} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
            {footerActionLabel ? (
              <button
                type="button"
                className={styles.footerAction}
                data-focus-section="footer"
                onClick={() => onFooterActionClick?.()}
              >
                <span className={styles.footerActionButton}>{footerActionLabel}</span>
              </button>
            ) : null}
            </div>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
