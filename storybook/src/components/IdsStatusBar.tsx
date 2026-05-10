import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import { Icon } from "./Icon";
import styles from "./IdsStatusBar.module.css";
import type {
  IdsStatusBarItemContract,
  IdsStatusBarItemState,
  IdsStatusBarSeverity,
  IdsStatusBarType,
} from "../spec-contracts/ids-status-bar.contract";

const severityIconBySlug: Record<IdsStatusBarSeverity, string> = {
  critical: "status-critical-square-solid",
  warning: "status-warn-tri-solid",
  success: "status-ok-circ-solid",
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

export interface IdsStatusBarProps extends ComponentProps<"section"> {
  type?: IdsStatusBarType;
  items?: IdsStatusBarItemContract[];
  total?: number | string;
  totalLabel?: string;
  totalCategory?: string;
  overflowState?: "auto" | "beginning" | "middle" | "end";
}

function resolveItemState(state: IdsStatusBarItemState | undefined): IdsStatusBarItemState {
  return state ?? "default";
}

export function IdsStatusBar({
  type = "status-large",
  items,
  total,
  totalLabel = "Total",
  totalCategory,
  overflowState = "auto",
  className,
  ...rest
}: IdsStatusBarProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
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
            {totalCategory ? <span className={styles.category}>{totalCategory}</span> : null}
            <span className={styles.label}>{totalLabel}</span>
          </span>
          <span className={[styles.divider, styles.rightDivider].join(" ")} aria-hidden="true" />
        </div>
      ) : null}

      <div className={styles.contentWrap}>
        <div className={styles.content} ref={contentRef}>
          {resolvedItems.map((item, index) => {
            const state = resolveItemState(item.state);
            const severity = item.severity;
            const iconShapeName =
              isInventory ? (item.iconShapeName ?? "docs-bundle") : severity ? severityIconBySlug[severity] : "docs-bundle";
            const label = item.label || (severity ? severityLabelByDefault[severity] : "");

            return (
              <article
                key={item.id}
                className={[styles.item, styles[state], isInventory ? styles.inventoryItem : styles.statusItem]
                  .filter(Boolean)
                  .join(" ")}
              >
                {index === 0 ? <span className={[styles.divider, styles.leftDivider].join(" ")} aria-hidden="true" /> : null}
                <span className={styles.iconStack}>
                  <span className={styles.mainIcon}>
                    <Icon shapeName={isInventory ? item.iconShapeName ?? "docs-bundle" : iconShapeName} className={styles.icon} />
                  </span>
                  {isInventory && severity ? (
                    <span className={styles.badgeIcon}>
                      <Icon shapeName={severityIconBySlug[severity]} className={styles.icon} />
                    </span>
                  ) : null}
                </span>
                <span className={styles.value}>{item.value}</span>
                <span className={styles.meta}>
                  {item.category ? <span className={styles.category}>{item.category}</span> : null}
                  <span className={styles.label}>{label}</span>
                </span>
                <span className={[styles.divider, styles.rightDivider].join(" ")} aria-hidden="true" />
              </article>
            );
          })}
        </div>

        {hasTotal ? (
          <div className={styles.overflowLayer} aria-hidden="true">
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
