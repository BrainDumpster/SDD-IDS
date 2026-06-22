import { Menu } from "@base-ui-components/react/menu";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
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
  selectAllLabel?: string;
  clearAllLabel?: string;
  selectAllChecked?: boolean;
  selectAllIndeterminate?: boolean;
  onSelectAllClick?: () => void;
  onClearAllClick?: () => void;
  clearAllDisabled?: boolean;
  footerActionLabel?: string;
  onFooterActionClick?: () => void;
  selectedValues?: string[];
  maxHeight?: number;
  sideOffset?: number;
  matchTriggerWidth?: boolean;
  defaultOpen?: boolean;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchValueChange?: (value: string) => void;
  /** Multi-select: Show Selected / Hide Selected panel with dismissible tag chips (Figma `12730:120316`). */
  showSelectedPanel?: boolean;
  showSelectedExpanded?: boolean;
  defaultShowSelectedExpanded?: boolean;
  onShowSelectedExpandedChange?: (expanded: boolean) => void;
  showSelectedLabel?: string;
  hideSelectedLabel?: string;
  onRemoveSelectedTag?: (value: string) => void;
  /** Clears all selections from the selection panel row dismiss control. Defaults to `onClearAllClick`. */
  onShowSelectedPanelClear?: () => void;
  /** When true the trigger stretches to fill its parent container. */
  fullWidth?: boolean;
}

export function DropdownMenu({
  trigger,
  items,
  disabled = false,
  selectionMode = "none",
  showSingleSelectRadio = false,
  showSelectAllClearAll = false,
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
  sideOffset = 0,
  matchTriggerWidth = true,
  defaultOpen = false,
  showSearch = false,
  searchValue,
  searchPlaceholder = "Search",
  onSearchValueChange,
  showSelectedPanel = false,
  showSelectedExpanded,
  defaultShowSelectedExpanded = false,
  onShowSelectedExpandedChange,
  showSelectedLabel = "Show Selected",
  hideSelectedLabel = "Hide Selected",
  onRemoveSelectedTag,
  onShowSelectedPanelClear,
  fullWidth = false,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(defaultOpen && !disabled);
  const [internalShowSelectedExpanded, setInternalShowSelectedExpanded] = useState(defaultShowSelectedExpanded);
  const triggerMeasureRef = useRef<HTMLSpanElement | null>(null);
  const [triggerWidth, setTriggerWidth] = useState<number>();

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

  const showSearchClear = Boolean(searchValue && searchValue.length > 0);

  useLayoutEffect(() => {
    const el = triggerMeasureRef.current;
    if (!el) return;

    const updateWidth = () => {
      const nextWidth = Math.round(el.getBoundingClientRect().width);
      setTriggerWidth((prev) => (prev === nextWidth ? prev : nextWidth));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const popupStyle = {
    ...(matchTriggerWidth && triggerWidth
      ? {
          width: `${triggerWidth}px`,
          minWidth: `${triggerWidth}px`,
          maxWidth: `${triggerWidth}px`,
          "--dropdown-trigger-width": `${triggerWidth}px`,
        }
      : {}),
  };
  const positionerStyle = matchTriggerWidth && triggerWidth
    ? {
        width: `${triggerWidth}px`,
        minWidth: `${triggerWidth}px`,
        maxWidth: `${triggerWidth}px`,
        "--dropdown-trigger-width": `${triggerWidth}px`,
      }
    : undefined;

  return (
    <Menu.Root
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
        className={fullWidth ? `${styles.triggerReset} ${styles.triggerFull}` : styles.triggerReset}
        disabled={disabled}
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
      >
        <span ref={triggerMeasureRef} className={styles.triggerMeasure}>
          {trigger}
        </span>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={sideOffset} alignment="start" style={positionerStyle}>
          <Menu.Popup className={styles.popup} style={popupStyle}>
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
                      <input
                        className={styles.searchInput}
                        type="text"
                        value={searchValue}
                        placeholder={searchPlaceholder}
                        onChange={(event) => onSearchValueChange?.(event.target.value)}
                        onKeyDown={(event) => event.stopPropagation()}
                      />
                      {showSearchClear ? (
                        <button
                          type="button"
                          className={styles.searchClearButton}
                          aria-label="Clear search"
                          onClick={() => onSearchValueChange?.("")}
                        >
                          <Icon
                            shapeName="shape-x-thick"
                            className={styles.searchClearIcon}
                            color="var(--color-icon-accessible)"
                            style={{ width: 10, height: 10 }}
                          />
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {showSelectAllClearAll ? (
              <div className={styles.selectAllClearAllRow}>
                <button
                  type="button"
                  className={styles.selectAllButton}
                  data-checked={selectAllChecked ? "true" : undefined}
                  data-indeterminate={selectAllIndeterminate ? "true" : undefined}
                  onClick={() => onSelectAllClick?.()}
                >
                  <span className={`${styles.checkboxOuter} ${styles.selectAllCheckbox}`} aria-hidden="true">
                    {selectAllIndeterminate ? (
                      <span className={styles.checkboxDash} />
                    ) : selectAllChecked ? (
                      <span className={styles.checkboxTick} />
                    ) : null}
                  </span>
                  <span>{selectAllLabel}</span>
                </button>
                <button
                  type="button"
                  className={styles.clearAllButton}
                  onClick={() => onClearAllClick?.()}
                  disabled={clearAllDisabled}
                >
                  {clearAllLabel}
                </button>
              </div>
            ) : null}
            {showSelectedPanel && selectionMode === "multi" && selectedValues.length > 0 ? (
              <div
                className={styles.showSelectedPanel}
                data-expanded={isShowSelectedExpanded ? "true" : undefined}
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
                  <button
                    type="button"
                    className={styles.showSelectedClear}
                    aria-label="Clear all selected items"
                    onClick={() => (onShowSelectedPanelClear ?? onClearAllClick)?.()}
                  >
                    <Icon
                      shapeName="shape-x-thick"
                      className={styles.showSelectedClearIcon}
                      color="var(--color-icon-accessible)"
                      style={{ width: 10, height: 10 }}
                    />
                  </button>
                </div>
                {isShowSelectedExpanded ? (
                  <div className={styles.showSelectedTags}>
                    {selectedTagItems.map((tag) => (
                      <Tag
                        key={tag.value}
                        label={tag.label}
                        type="editable"
                        size="lg"
                        closable
                        onDismiss={() => onRemoveSelectedTag?.(tag.value)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div
              className={styles.optionsScrollRegion}
              style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
            >
              {items.map((item, i) => {
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
                      onClick={() => item.onClick?.()}
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
                      {item.label}
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
                    {item.label}
                  </Menu.Item>
                );
              })}
            </div>
            {footerActionLabel ? (
              <button
                type="button"
                className={styles.footerAction}
                onClick={() => onFooterActionClick?.()}
              >
                <span className={styles.footerActionButton}>{footerActionLabel}</span>
              </button>
            ) : null}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
