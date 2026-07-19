import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Icon } from "./Icon";
import styles from "./IdsStatusBar.module.css";
import {
  INVENTORY_BADGE_SEVERITIES,
  type IdsStatusBarItemContract,
  type IdsStatusBarItemState,
  type IdsStatusBarSeverity,
  type IdsStatusBarType,
} from "../spec-contracts/ids-status-bar.contract";
import { STATUS_BAR_SEVERITY_SVG } from "./severityIcons";

const severityLabelByDefault: Record<IdsStatusBarSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  success: "Success",
  "in-progress": "In Progress",
  scheduled: "Scheduled",
  canceling: "Canceling",
  canceled: "Canceled",
  skipped: "Skipped",
  unknown: "Unknown",
};

const sampleStatusItems: IdsStatusBarItemContract[] = [
  { id: "critical", value: 10, category: "<Category>", label: "Critical", severity: "critical" },
  { id: "warning", value: 10, category: "<Category>", label: "Warning", severity: "warning" },
  { id: "success", value: 10, category: "<Category>", label: "Success", severity: "success" },
];

const sampleInventoryItems: IdsStatusBarItemContract[] = [
  { id: "default", value: 10, category: "Category", label: "Default", iconShapeName: "docs-bundle" },
  { id: "warning", value: 10, category: "Category", label: "Warning", severity: "warning", iconShapeName: "docs-bundle" },
  { id: "critical", value: 10, category: "Category", label: "Critical", severity: "critical", iconShapeName: "docs-bundle" },
  {
    id: "in-progress",
    value: 10,
    category: "Category",
    label: "In Progress",
    severity: "in-progress",
    iconShapeName: "docs-bundle",
  },
];

/**
 * Renders a theme-adaptive severity glyph. Most severities are tokenized inline
 * SVGs (see severityIcons.ts) so their fills follow the active theme.
 * `skipped` is the exception: Figma composes it from a solid circle plus the
 * skip arrows layered on top, so we rebuild that stack from two masked mono
 * icons tinted via the Icon `color` prop.
 */
function SeverityGlyph({ severity }: { severity: IdsStatusBarSeverity }) {
  if (severity === "skipped") {
    return (
      <span className={styles.skipComposite}>
        <Icon
          shapeName="shape-circ-solid"
          color="var(--color-icon-neutral-light)"
          style={{ width: "100%", height: "100%" }}
        />
        <Icon
          shapeName="skip-to-end"
          className={styles.skipGlyph}
          color="var(--color-icon-inverse)"
          style={{ width: "60%", height: "60%" }}
        />
      </span>
    );
  }
  return (
    <span
      className={styles.severityGlyph}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: STATUS_BAR_SEVERITY_SVG[severity] }}
    />
  );
}

export interface IdsStatusBarProps extends ComponentProps<"section"> {
  type?: IdsStatusBarType;
  items?: IdsStatusBarItemContract[];
  total?: number | string;
  totalLabel?: string;
  totalCategory?: string;
  overflowState?: "auto" | "beginning" | "middle" | "end";
  /** Selected item id (controlled). Omit for uncontrolled internal selection. */
  selectedId?: string | null;
  /** Fired when selection changes (item id, or null when cleared). */
  onItemSelect?: (id: string | null) => void;
}

export function IdsStatusBar({
  type = "status-large",
  items,
  total,
  totalLabel = "Total",
  totalCategory,
  overflowState = "auto",
  selectedId,
  onItemSelect,
  className,
  ...rest
}: IdsStatusBarProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const isSelectionControlled = selectedId !== undefined;
  const currentSelected = isSelectionControlled ? selectedId : internalSelected;

  const selectItem = (id: string) => {
    const next = currentSelected === id ? null : id;
    if (!isSelectionControlled) setInternalSelected(next);
    onItemSelect?.(next);
  };
  const hasTotal = total != null;
  const isInventory = type === "inventory";
  const isSmall = type === "status-small";
  const defaultItems = isInventory ? sampleInventoryItems : sampleStatusItems;
  const resolvedItems = items && items.length > 0 ? items : defaultItems;

  const updateOverflow = () => {
    if (!hasTotal || !contentRef.current) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const node = contentRef.current;
    const max = node.scrollWidth - node.clientWidth;
    setCanScrollLeft(node.scrollLeft > 1);
    setCanScrollRight(node.scrollLeft < max - 1);
  };

  useEffect(() => {
    updateOverflow();
    const node = contentRef.current;
    if (!node) return;
    const onScroll = () => updateOverflow();
    node.addEventListener("scroll", onScroll);
    window.addEventListener("resize", updateOverflow);
    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateOverflow);
    };
  }, [hasTotal, type, resolvedItems.length]);

  const classes = useMemo(
    () =>
      [
        styles.root,
        isSmall ? styles.small : styles.large,
        isInventory ? styles.inventory : "",
        hasTotal ? styles.withTotal : "",
        className,
      ]
        .filter(Boolean)
        .join(" "),
    [className, hasTotal, isInventory, isSmall]
  );

  const scrollByDirection = (direction: "left" | "right") => {
    const node = contentRef.current;
    if (!node) return;
    node.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  const showLeft =
    hasTotal &&
    (overflowState === "middle" || overflowState === "end" || (overflowState === "auto" && canScrollLeft));
  const showRight =
    hasTotal &&
    (overflowState === "beginning" || overflowState === "middle" || (overflowState === "auto" && canScrollRight));

  return (
    <section className={classes} aria-label="Status Bar" {...rest}>
      {hasTotal ? (
        <div className={styles.totalItem}>
          <span className={[styles.divider, styles.leftDivider].join(" ")} aria-hidden="true" />
          <span className={styles.value}>{total}</span>
          <span className={styles.meta}>
            {totalCategory && !isSmall ? <span className={styles.category}>{totalCategory}</span> : null}
            <span className={styles.label}>{totalLabel}</span>
          </span>
          <span className={[styles.divider, styles.rightDivider].join(" ")} aria-hidden="true" />
        </div>
      ) : null}

      <div className={styles.contentWrap}>
        <div className={styles.content} ref={contentRef}>
          {resolvedItems.map((item, index) => {
            const severity = item.severity;
            // An explicit `state` prop forces the state (showcase); otherwise the
            // item is live: selectable by click, with real hover/press via CSS.
            const forcedState = item.state;
            const isSelected = forcedState == null && currentSelected === item.id;
            const state: IdsStatusBarItemState = forcedState ?? (isSelected ? "selected" : "default");
            const interactive = forcedState == null;
            // Fallback icon rendered only when there is no severity glyph: the
            // inventory main icon (user-defined, defaults to docs-bundle) or the
            // status default when an item has no severity.
            const iconShapeName = isInventory ? (item.iconShapeName ?? "docs-bundle") : "docs-bundle";
            const label = item.label || (severity ? severityLabelByDefault[severity] : "");

            return (
              <article
                key={item.id}
                className={[
                  styles.item,
                  styles[state],
                  interactive ? styles.interactive : "",
                  isInventory ? styles.inventoryItem : styles.statusItem,
                ]
                  .filter(Boolean)
                  .join(" ")}
                {...(interactive
                  ? {
                      role: "button",
                      tabIndex: 0,
                      "aria-pressed": isSelected,
                      onClick: () => selectItem(item.id),
                      onKeyDown: (event: ReactKeyboardEvent) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          selectItem(item.id);
                        }
                      },
                    }
                  : {})}
              >
                {index === 0 ? <span className={[styles.divider, styles.leftDivider].join(" ")} aria-hidden="true" /> : null}
                <span className={styles.iconStack}>
                  <span className={styles.mainIcon}>
                    {!isInventory && severity ? (
                      <SeverityGlyph severity={severity} />
                    ) : isInventory ? (
                      // Inventory main icon: 16px docs-bundle centered in the tile. Its color
                      // (and the tile border) follow the item state via CSS (grey → brand).
                      <Icon shapeName={iconShapeName} className={styles.inventoryIcon} />
                    ) : (
                      <Icon shapeName={iconShapeName} className={styles.icon} />
                    )}
                  </span>
                  {isInventory && severity && INVENTORY_BADGE_SEVERITIES.includes(severity) ? (
                    <span className={styles.badgeIcon}>
                      <SeverityGlyph severity={severity} />
                    </span>
                  ) : null}
                </span>
                {isInventory ? (
                  // Inventory "Counter": value (count) stacked over the category label
                  // (both smaller than status items) → drives the 78px hug height.
                  <span className={styles.counter}>
                    <span className={styles.value}>{item.value}</span>
                    <span className={styles.label}>{item.category}</span>
                  </span>
                ) : (
                  <>
                    <span className={styles.value}>{item.value}</span>
                    <span className={styles.meta}>
                      {/* Small items show value + label only (no category) per Figma. */}
                      {item.category && !isSmall ? (
                        <span className={styles.category}>{item.category}</span>
                      ) : null}
                      <span className={styles.label}>{label}</span>
                    </span>
                  </>
                )}
                {state === "selected" ? (
                  <span className={styles.selectedRibbon} aria-hidden="true">
                    <Icon
                      shapeName="shape-check-thick"
                      className={styles.ribbonCheck}
                      style={{ width: 12, height: 12 }}
                    />
                  </span>
                ) : null}
                <span className={[styles.divider, styles.rightDivider].join(" ")} aria-hidden="true" />
              </article>
            );
          })}
        </div>

        {hasTotal ? (
          <div className={styles.overflowLayer}>
            {showLeft ? (
              <button
                type="button"
                className={[styles.overflowButton, styles.left].join(" ")}
                onClick={() => scrollByDirection("left")}
                aria-label="Scroll status bar left"
              >
                <Icon shapeName="chev-left-thick" className={styles.overflowIcon} />
              </button>
            ) : null}
            {showRight ? (
              <button
                type="button"
                className={[styles.overflowButton, styles.right].join(" ")}
                onClick={() => scrollByDirection("right")}
                aria-label="Scroll status bar right"
              >
                <Icon shapeName="chev-right-thick" className={styles.overflowIcon} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
