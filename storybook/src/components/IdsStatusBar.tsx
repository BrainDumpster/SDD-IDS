import { useCallback, useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { Icon } from "./Icon";
import styles from "./IdsStatusBar.module.css";
import type {
  IdsStatusBarBarType,
  IdsStatusBarInventoryStatus,
  IdsStatusBarItemContract,
  IdsStatusBarItemData,
  IdsStatusBarItemState,
  IdsStatusBarOverflowScenario,
  IdsStatusBarSelectionChangeDetail,
  IdsStatusBarSelectionMode,
  IdsStatusBarSeverity,
  IdsStatusBarTotalData,
  IdsStatusBarType,
} from "../spec-contracts/ids-status-bar.contract";
import { fromLegacyStatusBarType } from "../spec-contracts/ids-status-bar.contract";

const severityIconBySlug: Record<IdsStatusBarSeverity, string> = {
  critical: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  success: "status-ok-circ-solid",
  informational: "info-circ-solid",
  "in-progress": "state-progress-circle",
  scheduled: "state-standby-clock-solid",
  canceling: "state-cancelled-solid",
  canceled: "state-remove-solid",
  skipped: "skip-to-end",
  unknown: "status-unknown-diamond-solid",
};

const severityLabelByDefault: Record<IdsStatusBarSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  success: "Success",
  informational: "Informational",
  "in-progress": "In Progress",
  scheduled: "Scheduled",
  canceling: "Canceling",
  canceled: "Canceled",
  skipped: "Skipped",
  unknown: "Unknown",
};

const inventoryBadgeByStatus: Record<Exclude<IdsStatusBarInventoryStatus, "default">, string> = {
  critical: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  "in-progress": "state-progress-circle",
};

const sampleSeverityItems: IdsStatusBarItemData[] = [
  { kind: "severity", id: "critical", value: 10, category: "Alerts", label: "Critical", severity: "critical" },
  { kind: "severity", id: "warning", value: 10, category: "Alerts", label: "Warning", severity: "warning" },
  { kind: "severity", id: "success", value: 10, category: "Alerts", label: "Success", severity: "success" },
];

const sampleInventoryItems: IdsStatusBarItemData[] = [
  { kind: "inventory", id: "in-progress", value: 10, label: "Category", iconShapeName: "docs-bundle", status: "in-progress" },
  {
    kind: "inventory",
    id: "warning",
    value: 10,
    label: "Category 2",
    iconShapeName: "docs-bundle",
    status: "warning",
  },
  {
    kind: "inventory",
    id: "critical",
    value: 10,
    label: "Category 3",
    iconShapeName: "docs-bundle",
    status: "critical",
  },
  {
    kind: "inventory",
    id: "warning-2",
    value: 10,
    label: "Category 4",
    iconShapeName: "docs-bundle",
    status: "warning",
  },
];

function resolveItemVisualState(
  item: IdsStatusBarItemData,
  selectedIds: string[],
  selectionMode: IdsStatusBarSelectionMode
): IdsStatusBarItemState {
  if (item.disabled) return "disabled";
  if (item.state) return item.state;
  if (selectionMode !== "none" && selectedIds.includes(item.id)) return "selected";
  if (item.selected) return "selected";
  return "default";
}

function nextSelectedIds(
  mode: IdsStatusBarSelectionMode,
  current: string[],
  itemId: string
): string[] {
  if (mode === "none") return current;
  if (mode === "single") {
    return current.includes(itemId) ? current : [itemId];
  }
  return current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId];
}

function mapLegacySeverityToInventoryStatus(
  severity: IdsStatusBarSeverity | undefined
): IdsStatusBarInventoryStatus | undefined {
  if (!severity) return undefined;
  if (severity === "critical") return "critical";
  if (severity === "warning") return "warning";
  if (severity === "in-progress") return "in-progress";
  return "default";
}

function normalizeBarType(
  barType: IdsStatusBarBarType | undefined,
  type: IdsStatusBarType | undefined
): IdsStatusBarBarType {
  if (barType) return barType;
  if (type) return fromLegacyStatusBarType(type);
  return "severity-health-large";
}

function normalizeItems(
  items: (IdsStatusBarItemData | IdsStatusBarItemContract)[] | undefined,
  barType: IdsStatusBarBarType
): IdsStatusBarItemData[] {
  if (!items?.length) {
    return barType === "inventory" ? sampleInventoryItems : sampleSeverityItems;
  }

  return items.map((item) => {
    if ("kind" in item && (item.kind === "severity" || item.kind === "inventory")) {
      return item as IdsStatusBarItemData;
    }

    const legacy = item as IdsStatusBarItemContract;
    if (barType === "inventory") {
      return {
        kind: "inventory",
        id: legacy.id,
        value: legacy.value,
        label: legacy.label || legacy.category || "Category",
        state: legacy.state,
        iconShapeName: legacy.iconShapeName,
        status: mapLegacySeverityToInventoryStatus(legacy.severity),
      };
    }

    return {
      kind: "severity",
      id: legacy.id,
      value: legacy.value,
      label: legacy.label || (legacy.severity ? severityLabelByDefault[legacy.severity] : ""),
      category: legacy.category,
      severity: legacy.severity ?? "unknown",
      state: legacy.state,
    };
  });
}

function normalizeTotal(
  total: number | string | IdsStatusBarTotalData | undefined,
  totalLabel: string,
  totalCategory: string | undefined
): IdsStatusBarTotalData | undefined {
  if (total == null) return undefined;
  if (typeof total === "object") return total;
  return { value: total, label: totalLabel, category: totalCategory };
}

export interface IdsStatusBarProps extends ComponentProps<"section"> {
  /** Preferred API — see design-spec.md */
  barType?: IdsStatusBarBarType;
  /** @deprecated Use barType */
  type?: IdsStatusBarType;
  items?: (IdsStatusBarItemData | IdsStatusBarItemContract)[];
  total?: number | string | IdsStatusBarTotalData;
  totalLabel?: string;
  totalCategory?: string;
  showIcons?: boolean;
  /** @deprecated Use overflowScenario */
  overflowState?: IdsStatusBarOverflowScenario;
  overflowScenario?: IdsStatusBarOverflowScenario;
  scrollStepPx?: number;
  ariaLabel?: string;
  /** `none` (default) | `single` (radio-like) | `multiple` (checkbox-like). */
  selectionMode?: IdsStatusBarSelectionMode;
  /** Controlled selected ids when `selectionMode` is not `none`. */
  selectedItemIds?: string[];
  /** Uncontrolled initial selected ids. */
  defaultSelectedItemIds?: string[];
  /** Fires when selection changes; includes full output payload. */
  onSelectionChange?: (detail: IdsStatusBarSelectionChangeDetail) => void;
  /** @deprecated Prefer `onSelectionChange`. */
  onItemSelect?: (item: IdsStatusBarItemData) => void;
}

function StatusBarSelectionCorner({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <span className={styles.selectedCornerTriangle} />
      <Icon shapeName="shape-check-thick" className={styles.selectedCornerCheck} color="var(--color-icon-inverse)" />
    </span>
  );
}

function OverflowSide({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const isLeft = side === "left";
  return (
    <div className={styles.overflowSide} data-side={side}>
      {isLeft ? (
        <>
          <button
            type="button"
            className={styles.overflowChevronButton}
            onClick={onClick}
            aria-label="Scroll status bar left"
          >
            <Icon shapeName="chev-left-thick" className={styles.overflowIcon} />
          </button>
          <span className={styles.overflowGradient} aria-hidden="true" />
        </>
      ) : (
        <>
          <span className={styles.overflowGradientWrap} aria-hidden="true">
            <span className={styles.overflowGradientFill} />
          </span>
          <button
            type="button"
            className={styles.overflowChevronButton}
            onClick={onClick}
            aria-label="Scroll status bar right"
          >
            <Icon shapeName="chev-right-thick" className={styles.overflowIcon} />
          </button>
        </>
      )}
    </div>
  );
}

export function IdsStatusBar({
  barType: barTypeProp,
  type = "status-large",
  items,
  total,
  totalLabel = "Total",
  totalCategory,
  showIcons = true,
  overflowState,
  overflowScenario: overflowScenarioProp = "auto",
  scrollStepPx = 200,
  ariaLabel = "Status bar",
  className,
  selectionMode = "none",
  selectedItemIds,
  defaultSelectedItemIds = [],
  onSelectionChange,
  onItemSelect,
  ...rest
}: IdsStatusBarProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedItemIds);
  const overflowScenario = overflowState ?? overflowScenarioProp;

  const resolvedSelectedIds = selectedItemIds ?? internalSelectedIds;
  const isSelectable = selectionMode !== "none";

  const resolvedBarType = normalizeBarType(barTypeProp, type);
  const isInventory = resolvedBarType === "inventory";
  const isSmall = resolvedBarType === "severity-health-small";
  const resolvedTotal = normalizeTotal(total, totalLabel, totalCategory);
  const hasTotal = resolvedTotal != null;
  const resolvedItems = useMemo(() => normalizeItems(items, resolvedBarType), [items, resolvedBarType]);

  const updateOverflow = useCallback(() => {
    const node = contentRef.current;
    if (!node) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const max = node.scrollWidth - node.clientWidth;
    const hasOverflow = max > 1;
    setCanScrollLeft(hasOverflow && node.scrollLeft > 1);
    setCanScrollRight(hasOverflow && node.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    updateOverflow();
    const node = contentRef.current;
    if (!node) return;
    const onScroll = () => updateOverflow();
    node.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateOverflow);
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOverflow) : null;
    observer?.observe(node);
    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateOverflow);
      observer?.disconnect();
    };
  }, [resolvedBarType, resolvedItems.length, hasTotal, showIcons, updateOverflow]);

  const classes = useMemo(
    () =>
      [
        styles.root,
        isSmall ? styles.small : styles.large,
        isInventory ? styles.inventory : "",
        hasTotal ? styles.withTotal : styles.fitContent,
        isInventory && !showIcons ? styles.inventoryNoIcons : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className, hasTotal, isInventory, isSmall, showIcons]
  );

  const scrollByDirection = (direction: "left" | "right") => {
    const node = contentRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === "left" ? -scrollStepPx : scrollStepPx, behavior: "smooth" });
  };

  const hasTrackOverflow = canScrollLeft || canScrollRight;
  const showOverflowUi = overflowScenario !== "auto" || hasTrackOverflow;

  const showLeft =
    showOverflowUi &&
    (overflowScenario === "middle" || overflowScenario === "end" || (overflowScenario === "auto" && canScrollLeft));
  const showRight =
    showOverflowUi &&
    (overflowScenario === "beginning" ||
      overflowScenario === "middle" ||
      (overflowScenario === "auto" && canScrollRight));

  const handleItemActivate = useCallback(
    (item: IdsStatusBarItemData) => {
      if (item.disabled || item.state === "disabled") return;

      if (isSelectable) {
        const nextIds = nextSelectedIds(selectionMode, resolvedSelectedIds, item.id);
        if (selectedItemIds === undefined) {
          setInternalSelectedIds(nextIds);
        }
        const selectedItems = resolvedItems.filter((entry) => nextIds.includes(entry.id));
        const detail: IdsStatusBarSelectionChangeDetail = {
          selectedIds: nextIds,
          selectedItems,
          changedItem: item,
          selected: nextIds.includes(item.id),
        };
        onSelectionChange?.(detail);
      }

      onItemSelect?.(item);
    },
    [
      isSelectable,
      onItemSelect,
      onSelectionChange,
      resolvedItems,
      resolvedSelectedIds,
      selectedItemIds,
      selectionMode,
    ]
  );

  return (
    <section className={classes} aria-label={ariaLabel} {...rest}>
      {hasTotal ? (
        <div className={styles.totalItem}>
          <span className={[styles.divider, styles.leftDivider].join(" ")} aria-hidden="true" />
          <span className={styles.value}>{resolvedTotal.value}</span>
          <span className={styles.meta}>
            {resolvedTotal.category ? <span className={styles.category}>{resolvedTotal.category}</span> : null}
            <span className={styles.label}>{resolvedTotal.label ?? "Total"}</span>
          </span>
          <span className={[styles.divider, styles.rightDivider].join(" ")} aria-hidden="true" />
        </div>
      ) : null}

      <div className={styles.contentWrap}>
        {showOverflowUi && showLeft ? (
          <OverflowSide side="left" onClick={() => scrollByDirection("left")} />
        ) : null}
        <div
          className={styles.content}
          ref={contentRef}
          role="list"
          aria-multiselectable={selectionMode === "multiple" ? true : undefined}
        >
          {resolvedItems.map((item, index) => {
            const state = resolveItemVisualState(item, resolvedSelectedIds, selectionMode);
            const isSeverityItem = item.kind === "severity";
            const label =
              item.label ||
              (isSeverityItem && item.severity ? severityLabelByDefault[item.severity] : "Category");

            const isForcedState = Boolean(item.state);
            const isItemSelected = isSelectable && resolvedSelectedIds.includes(item.id);

            return (
              <article
                key={item.id}
                role="listitem"
                className={[
                  styles.item,
                  isInventory ? styles.inventoryItem : styles.statusItem,
                  index < resolvedItems.length - 1 ? styles.itemOverlap : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-state={state}
                data-force-state={isForcedState ? "" : undefined}
                aria-disabled={state === "disabled" ? true : undefined}
                aria-selected={isSelectable ? isItemSelected : undefined}
                tabIndex={state === "disabled" ? undefined : isSelectable ? 0 : undefined}
                onClick={() => handleItemActivate(item)}
                onKeyDown={(event) => {
                  if (state === "disabled") return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleItemActivate(item);
                  }
                }}
              >
                <span className={[styles.divider, styles.leftDivider].join(" ")} aria-hidden="true" />

                {isSeverityItem ? (
                  <>
                    <span className={styles.severityIcon}>
                      <Icon
                        shapeName={severityIconBySlug[item.severity]}
                        className={styles.severityIconGlyph}
                        variant="img"
                      />
                    </span>
                    <span className={styles.value}>{item.value}</span>
                    <span className={styles.meta}>
                      {item.category ? <span className={styles.category}>{item.category}</span> : null}
                      <span className={styles.label}>{label}</span>
                    </span>
                  </>
                ) : (
                  <>
                    {showIcons ? (
                      <span className={styles.iconStack}>
                        <span className={styles.inventoryDisc} aria-hidden="true" />
                        <span className={styles.mainIcon}>
                          <Icon shapeName={item.iconShapeName ?? "docs-bundle"} className={styles.inventoryMainIcon} />
                        </span>
                        {item.status && item.status !== "default" ? (
                          <span className={styles.badgeIcon}>
                            <Icon
                              shapeName={inventoryBadgeByStatus[item.status]}
                              className={styles.badgeIconGlyph}
                              variant="img"
                            />
                          </span>
                        ) : null}
                      </span>
                    ) : null}
                    <span className={styles.inventoryCounter}>
                      <span className={styles.inventoryValue}>{item.value}</span>
                      <span className={styles.inventoryLabel}>{label}</span>
                    </span>
                  </>
                )}

                {state === "selected" ? <StatusBarSelectionCorner className={styles.selectedMarker} /> : null}
              </article>
            );
          })}
        </div>

        {showOverflowUi && showRight ? (
          <OverflowSide side="right" onClick={() => scrollByDirection("right")} />
        ) : null}
      </div>
    </section>
  );
}
