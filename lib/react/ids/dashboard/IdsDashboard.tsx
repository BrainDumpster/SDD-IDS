/**
 * IDS Dashboard — React implementation generated from design-spec.
 *
 * Path: `lib/react/ids/dashboard`
 * Source: `components/ids/dashboard/design-spec.md`
 * Theme: `components/ids-theme.css`
 *
 * Anatomy (deterministic child order — root is Dashboard / IdsDashboard, not DashboardRoot).
 * Public names are Ids camelCase identifiers, not dotted compounds (Dashboard.Grid).
 *   IdsDashboard
 *     IdsDashboardGrid
 *       IdsDashboardItem+ → IdsCard (size span-1|2|3, showDivider=showDividerInCard)
 *
 * Nested Card chrome follows Card design-spec except:
 *   --card-border-color: var(--color-border-gray-neutral-light) on IdsDashboard
 *   showDivider injected from showDividerInCard (Dashboard wins)
 *
 * Prop-driven IdsCard children emit this tree. Compound children fill the same slots.
 * No @base-ui-components dependency.
 */

import React, {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  isIdsCardElement,
  type IdsCardProps,
  type IdsCardSize,
} from "../card";
import {
  childKey,
  collectMainSlots,
  getDashboardSlot,
  markDashboardSlot,
  readCardSize,
  readSizeFromChildren,
  readSizeFromItem,
} from "./IdsDashboard.compose";
import styles from "./IdsDashboard.module.css";

const s = {
  root: styles["IdsDashboard"],
  grid: styles["IdsDashboardGrid"],
  item: styles["IdsDashboardItem"],
};

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function resolveBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function injectShowDivider(node: ReactNode, showDivider: boolean): ReactNode {
  return React.Children.map(node, (child) => {
    if (!isValidElement(child)) return child;
    if (isIdsCardElement(child)) {
      return cloneElement(child as ReactElement<IdsCardProps>, { showDivider });
    }
    return child;
  });
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

interface IdsDashboardContextValue {
  showDividerInCard: boolean;
  dragEnabled: boolean;
  dragKey: string | null;
  overKey: string | null;
  onItemDragStart: (itemKey: string) => (event: DragEvent) => void;
  onItemDragOver: (itemKey: string) => (event: DragEvent) => void;
  onItemDrop: (itemKey: string) => (event: DragEvent) => void;
  onItemDragEnd: () => void;
}

const IdsDashboardContext = createContext<IdsDashboardContextValue | null>(null);

function useDashboard(slot: string): IdsDashboardContextValue {
  const ctx = useContext(IdsDashboardContext);
  if (!ctx) {
    throw new Error(`${slot} must be used within Dashboard.`);
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/* Slots                                                                      */
/* -------------------------------------------------------------------------- */

export interface IdsDashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function IdsDashboardGrid({
  children,
  className,
  ...rest
}: IdsDashboardGridProps) {
  useDashboard("IdsDashboardGrid");
  return (
    <div
      className={cx(s.grid, className)}
      data-ids="IdsDashboardGrid"
      {...rest}
    >
      {children}
    </div>
  );
}
IdsDashboardGrid.displayName = "IdsDashboardGrid";
markDashboardSlot(IdsDashboardGrid, "grid");

export interface IdsDashboardItemProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Column span in the Dashboard grid. Inherited from nested IdsCard `size` when omitted. */
  size?: IdsCardSize;
  /** Stable identity for drag reorder. Falls back to React `key` then index. */
  itemKey?: string;
}

export function IdsDashboardItem({
  children,
  className,
  size: sizeProp,
  itemKey,
  ...rest
}: IdsDashboardItemProps) {
  const ctx = useDashboard("IdsDashboardItem");
  const size = readSizeFromChildren(children, sizeProp);
  const resolvedKey = itemKey ?? "dashboard-item";
  const dragging = ctx.dragEnabled && ctx.dragKey === resolvedKey;
  const dropTarget =
    ctx.dragEnabled && ctx.overKey === resolvedKey && ctx.dragKey !== resolvedKey;

  return (
    <div
      className={cx(s.item, className)}
      data-ids="IdsDashboardItem"
      data-card-size={size}
      data-dashboard-item={resolvedKey}
      data-card-draggable={ctx.dragEnabled ? "true" : "false"}
      data-dragging={dragging ? "true" : "false"}
      data-drop-target={dropTarget ? "true" : "false"}
      {...rest}
      draggable={ctx.dragEnabled}
      onDragStart={ctx.onItemDragStart(resolvedKey)}
      onDragOver={ctx.onItemDragOver(resolvedKey)}
      onDrop={ctx.onItemDrop(resolvedKey)}
      onDragEnd={ctx.onItemDragEnd}
    >
      {injectShowDivider(children, ctx.showDividerInCard)}
    </div>
  );
}
IdsDashboardItem.displayName = "IdsDashboardItem";
markDashboardSlot(IdsDashboardItem, "item");

/* -------------------------------------------------------------------------- */
/* Root                                                                       */
/* -------------------------------------------------------------------------- */

export interface IdsDashboardProps {
  children: ReactNode;
  /**
   * When `true` (default), nested Cards keep body dividers (`showDivider`).
   * When `false`, injects `showDivider={false}` onto each nested Card.
   * Dashboard injection wins over any `showDivider` on the JSX Card child.
   */
  showDividerInCard?: boolean;
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

interface PreparedItem {
  key: string;
  size: IdsCardSize;
  node: ReactElement;
}

function prepareItems(children: ReactNode): PreparedItem[] {
  const slots = collectMainSlots(children);
  const sources: ReactElement[] =
    slots.items.length > 0 ? slots.items : slots.tiles;

  return sources.map((child, index) => {
    const key = childKey(child, index);
    if (getDashboardSlot(child.type) === "item") {
      const size = readSizeFromItem(child);
      const next = cloneElement(child as ReactElement<IdsDashboardItemProps>, {
        itemKey: (child.props as IdsDashboardItemProps).itemKey ?? key,
        size: (child.props as IdsDashboardItemProps).size ?? size,
      });
      return { key, size, node: next };
    }
    const size = isIdsCardElement(child) ? readCardSize(child) : "span-1";
    return {
      key,
      size,
      node: (
        <IdsDashboardItem key={key} itemKey={key} size={size}>
          {child}
        </IdsDashboardItem>
      ),
    };
  });
}

export function IdsDashboard({
  children,
  showDividerInCard,
  enableDragAndDrop,
  cardsDraggable,
  onCardsReorder,
  className,
}: IdsDashboardProps) {
  const dividerOn = resolveBoolean(showDividerInCard, true);
  const dragEnabled = resolveBoolean(enableDragAndDrop ?? cardsDraggable, false);
  const slots = collectMainSlots(children);
  const prepared = useMemo(() => prepareItems(children), [children]);

  const defaultOrder = useMemo(
    () => prepared.map((entry) => entry.key),
    [prepared],
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
    const map = new Map<string, PreparedItem>();
    prepared.forEach((entry) => {
      map.set(entry.key, entry);
    });
    return map;
  }, [prepared]);

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

  const onItemDragStart = useCallback(
    (itemKey: string) => (event: DragEvent) => {
      if (!dragEnabled) return;
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", itemKey);
      setDragKey(itemKey);
    },
    [dragEnabled],
  );

  const onItemDragOver = useCallback(
    (itemKey: string) => (event: DragEvent) => {
      if (!dragEnabled || dragKey == null) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      setOverKey(itemKey);
    },
    [dragEnabled, dragKey],
  );

  const onItemDrop = useCallback(
    (itemKey: string) => (event: DragEvent) => {
      if (!dragEnabled) return;
      event.preventDefault();
      const from = event.dataTransfer.getData("text/plain") || dragKey;
      if (from) reorder(from, itemKey);
      setDragKey(null);
      setOverKey(null);
    },
    [dragEnabled, dragKey, reorder],
  );

  const onItemDragEnd = useCallback(() => {
    setDragKey(null);
    setOverKey(null);
  }, []);

  const ctx: IdsDashboardContextValue = {
    showDividerInCard: dividerOn,
    dragEnabled,
    dragKey,
    overKey,
    onItemDragStart,
    onItemDragOver,
    onItemDrop,
    onItemDragEnd,
  };

  const orderedNodes = order.map((key) => {
    const entry = byKey.get(key);
    if (!entry) return null;
    return cloneElement(entry.node, { key });
  });

  const grid =
    slots.grid != null ? (
      cloneElement(slots.grid as ReactElement<IdsDashboardGridProps>, undefined, orderedNodes)
    ) : (
      <IdsDashboardGrid>{orderedNodes}</IdsDashboardGrid>
    );

  return (
    <IdsDashboardContext.Provider value={ctx}>
      <section
        className={cx(s.root, className)}
        aria-label="Dashboard"
        data-ids="IdsDashboard"
        data-show-divider-in-card={dividerOn ? "true" : "false"}
        data-enable-drag-and-drop={dragEnabled ? "true" : "false"}
        data-cards-draggable={dragEnabled ? "true" : "false"}
      >
        {grid}
      </section>
    </IdsDashboardContext.Provider>
  );
}

IdsDashboard.displayName = "IdsDashboard";

export const IdsDashboardCompound = Object.assign(IdsDashboard, {
  Grid: IdsDashboardGrid,
  Item: IdsDashboardItem,
});

/** Anatomy alias — root is Dashboard, not DashboardRoot. */
export const Dashboard = IdsDashboardCompound;

export default IdsDashboardCompound;
