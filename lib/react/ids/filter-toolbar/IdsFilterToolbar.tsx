/**
 * IDS Filter Toolbar — React implementation from design-spec.
 *
 * Path: `lib/react/ids/filter-toolbar`
 * Source: `components/ids/filter-toolbar/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Composition:
 *   IdsFilterToolbar
 *     IdsFilterChip*   (separate child component)
 *     Add Filters / Clear All / Select Saved Filter / Overflow Menu
 *
 * Canonical Figma pattern instances:
 *   Empty `52206:272710` · Two filters `52206:272715`
 *   Overflow `52206:272717` · Filter selected `52206:272711`
 */

import React, {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { IdsIcon } from "../icon";
import { IdsFilterChip, type IdsFilterChipProps } from "./IdsFilterChip";
import styles from "./IdsFilterToolbar.module.css";

export interface IdsFilterToolbarOption {
  id: string;
  label: string;
}

export interface IdsFilterToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children?: ReactNode;
  addFiltersLabel?: string;
  clearFiltersLabel?: string;
  /** When omitted, Clear shows only if at least one IdsFilterChip child is present. */
  showClearFilters?: boolean;
  savedFilterLabel?: string;
  savedFilterValue?: string | null;
  savedFilterOptions?: IdsFilterToolbarOption[];
  addFilterOptions?: IdsFilterToolbarOption[];
  overflowOptions?: IdsFilterToolbarOption[];
  disabled?: boolean;
  ariaLabel?: string;
  onClearFilters?: () => void;
  onAddFilterSelect?: (id: string) => void;
  onAddFiltersClick?: () => void;
  onSavedFilterChange?: (id: string | null) => void;
  onSavedFilterClick?: () => void;
  onOverflowAction?: (id: string) => void;
  onOverflowClick?: () => void;
}

function countFilterChips(children: ReactNode): number {
  let count = 0;
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === IdsFilterChip) count += 1;
  });
  return count;
}

export function IdsFilterToolbar({
  children,
  addFiltersLabel = "Add Filters",
  clearFiltersLabel = "Clear All",
  showClearFilters,
  savedFilterLabel = "Select Saved Filter",
  savedFilterValue = null,
  disabled = false,
  ariaLabel = "Filter toolbar",
  onClearFilters,
  onAddFiltersClick,
  onSavedFilterClick,
  onOverflowClick,
  className,
  ...rest
}: IdsFilterToolbarProps) {
  const chipCount = countFilterChips(children);
  const clearVisible = showClearFilters ?? chipCount > 0;
  const savedSelected = Boolean(savedFilterValue?.trim());
  const savedLabel = savedSelected ? savedFilterValue!.trim() : savedFilterLabel;

  const chips: ReactElement[] = [];
  const other: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === IdsFilterChip) {
      const chip = child as ReactElement<IdsFilterChipProps>;
      chips.push(
        React.cloneElement(chip, {
          disabled: chip.props.disabled || disabled,
          key: chip.key ?? chips.length,
        }),
      );
    } else if (child != null && child !== false) {
      other.push(child);
    }
  });

  return (
    <div
      {...rest}
      className={[styles.IdsFilterToolbar, className].filter(Boolean).join(" ")}
      data-ids="IdsFilterToolbar"
      data-filter-count={chipCount}
      role="toolbar"
      aria-label={ariaLabel}
    >
      <div
        className={styles.IdsFilterToolbarLeadingCluster}
        data-ids="IdsFilterToolbarLeadingCluster"
      >
        <div className={styles.IdsFilterToolbarChipsSlot} data-ids="IdsFilterToolbarChipsSlot">
          {chips}
          {other}
        </div>
        <div
          className={styles.IdsFilterToolbarLeftActions}
          data-ids="IdsFilterToolbarLeftActions"
        >
          <button
            type="button"
            className={styles.IdsFilterToolbarTextButton}
            data-ids="IdsFilterToolbarAddFilters"
            disabled={disabled}
            onClick={() => onAddFiltersClick?.()}
          >
            <span className={styles.IdsFilterToolbarTextButtonIcon} aria-hidden>
              <IdsIcon shape="shape-plus" size={16} />
            </span>
            {addFiltersLabel}
          </button>
          {clearVisible ? (
            <button
              type="button"
              className={styles.IdsFilterToolbarTextButton}
              data-ids="IdsFilterToolbarClearFilters"
              disabled={disabled}
              onClick={() => onClearFilters?.()}
            >
              {clearFiltersLabel}
            </button>
          ) : null}
        </div>
      </div>
      <div
        className={styles.IdsFilterToolbarTrailingActions}
        data-ids="IdsFilterToolbarTrailingActions"
      >
        <button
          type="button"
          className={styles.IdsFilterToolbarSavedFilter}
          data-ids="IdsFilterToolbarSavedFilter"
          data-selected={savedSelected ? "true" : undefined}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={false}
          onClick={() => onSavedFilterClick?.()}
        >
          {savedLabel}
          <IdsIcon shape="arrow-drop-tri-caret" size={10} />
        </button>
        <button
          type="button"
          className={styles.IdsFilterToolbarOverflowButton}
          data-ids="IdsFilterToolbarOverflowMenu"
          disabled={disabled}
          aria-label="More filter actions"
          aria-haspopup="menu"
          onClick={() => onOverflowClick?.()}
        >
          <IdsIcon shape="overflow-menu-dots" size={16} />
        </button>
      </div>
    </div>
  );
}

IdsFilterToolbar.displayName = "IdsFilterToolbar";
