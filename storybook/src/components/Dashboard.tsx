import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import type { CardSize } from "./Card";
import styles from "./Dashboard.module.css";

export interface DashboardProps {
  children: ReactNode;
  /**
   * When `true`, nested Card items are draggable and can be reordered
   * (HTML5 drag-and-drop). Default `false`.
   */
  enableDragAndDrop?: boolean;
  /** @deprecated Use `enableDragAndDrop` */
  cardsDraggable?: boolean;
  /** Fires after a successful drag reorder with ordered child keys. */
  onCardsReorder?: (orderedKeys: string[]) => void;
  className?: string;
}

const SPAN_CLASS: Record<CardSize, string> = {
  "span-1": styles.span1,
  "span-2": styles.span2,
  "span-3": styles.span3,
};

function childKey(child: ReactElement, index: number): string {
  if (child.key != null && String(child.key) !== "") {
    return String(child.key).replace(/^\.\$/, "");
  }
  return `dashboard-card-${index}`;
}

function readCardSize(child: ReactElement): CardSize {
  const size = (child.props as { size?: CardSize }).size;
  if (size === "span-2" || size === "span-3" || size === "span-1") return size;
  return "span-1";
}

/**
 * IDS Dashboard — wrapper for a responsive grid of IDS Cards.
 * Optional card drag-reorder. Page title and page-level actions are
 * owned by the host layout, not Dashboard.
 */
export function Dashboard({
  children,
  enableDragAndDrop,
  cardsDraggable,
  onCardsReorder,
  className,
}: DashboardProps) {
  const dragEnabled = enableDragAndDrop ?? cardsDraggable ?? false;

  const childList = useMemo(
    () => Children.toArray(children).filter(isValidElement) as ReactElement[],
    [children],
  );

  const keyedChildren = useMemo(
    () =>
      childList.map((child, index) => ({
        key: childKey(child, index),
        child,
        size: readCardSize(child),
      })),
    [childList],
  );

  const defaultOrder = useMemo(
    () => keyedChildren.map((entry) => entry.key),
    [keyedChildren],
  );

  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  useEffect(() => {
    setOrder((prev) => {
      const nextKeys = new Set(defaultOrder);
      const kept = prev.filter((k) => nextKeys.has(k));
      const added = defaultOrder.filter((k) => !kept.includes(k));
      return [...kept, ...added];
    });
  }, [defaultOrder]);

  const byKey = useMemo(() => {
    const map = new Map<
      string,
      { child: ReactElement; size: CardSize }
    >();
    keyedChildren.forEach((entry) => {
      map.set(entry.key, { child: entry.child, size: entry.size });
    });
    return map;
  }, [keyedChildren]);

  const reorder = useCallback(
    (fromKey: string, toKey: string) => {
      if (fromKey === toKey) return;
      setOrder((prev) => {
        const next = [...prev];
        const from = next.indexOf(fromKey);
        const to = next.indexOf(toKey);
        if (from < 0 || to < 0) return prev;
        next.splice(from, 1);
        next.splice(to, 0, fromKey);
        onCardsReorder?.(next);
        return next;
      });
    },
    [onCardsReorder],
  );

  const onDragStart = (key: string) => (event: DragEvent) => {
    if (!dragEnabled) return;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
    setDragKey(key);
  };

  const onDragOver = (key: string) => (event: DragEvent) => {
    if (!dragEnabled || dragKey == null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setOverKey(key);
  };

  const onDrop = (key: string) => (event: DragEvent) => {
    if (!dragEnabled) return;
    event.preventDefault();
    const from = event.dataTransfer.getData("text/plain") || dragKey;
    if (from) reorder(from, key);
    setDragKey(null);
    setOverKey(null);
  };

  const onDragEnd = () => {
    setDragKey(null);
    setOverKey(null);
  };

  return (
    <section
      className={[styles.dashboard, className].filter(Boolean).join(" ")}
      aria-label="Dashboard"
      data-enable-drag-and-drop={dragEnabled ? "true" : "false"}
      data-cards-draggable={dragEnabled ? "true" : "false"}
    >
      <div className={styles.grid} data-dashboard-grid>
        {order.map((key) => {
          const entry = byKey.get(key);
          if (!entry) return null;
          const spanClass = SPAN_CLASS[entry.size] ?? SPAN_CLASS["span-1"];
          return (
            <div
              key={key}
              className={[
                styles.gridItem,
                spanClass,
                dragKey === key ? styles.gridItemDragging : "",
                overKey === key && dragKey !== key
                  ? styles.gridItemDropTarget
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              draggable={dragEnabled}
              onDragStart={onDragStart(key)}
              onDragOver={onDragOver(key)}
              onDrop={onDrop(key)}
              onDragEnd={onDragEnd}
              data-dashboard-item={key}
              data-card-size={entry.size}
              data-card-draggable={dragEnabled ? "true" : "false"}
            >
              {entry.child}
            </div>
          );
        })}
      </div>
    </section>
  );
}
