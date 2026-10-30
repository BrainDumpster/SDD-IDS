import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { isIdsCardElement, type IdsCardSize } from "../card";

/** Slot identity for Dashboard anatomy (root is Dashboard, not DashboardRoot). */
export const DASHBOARD_SLOT = Symbol.for("ids.dashboard.slot");

export type DashboardSlotName = "grid" | "item";

export function getDashboardSlot(type: unknown): DashboardSlotName | undefined {
  if (typeof type !== "function" && typeof type !== "object") return undefined;
  return (type as { [DASHBOARD_SLOT]?: DashboardSlotName })[DASHBOARD_SLOT];
}

export function markDashboardSlot<T>(fn: T, name: DashboardSlotName): T {
  (fn as { [DASHBOARD_SLOT]?: DashboardSlotName })[DASHBOARD_SLOT] = name;
  return fn;
}

export function resolveCardSize(value: unknown): IdsCardSize {
  if (value === "span-2" || value === "span-3") return value;
  return "span-1";
}

export function readCardSize(child: ReactElement): IdsCardSize {
  return resolveCardSize((child.props as { size?: IdsCardSize }).size);
}

export function childKey(child: ReactElement, index: number): string {
  if (child.key != null && String(child.key) !== "") {
    return String(child.key).replace(/^\.\$/, "");
  }
  return `dashboard-item-${index}`;
}

export function validElements(children: ReactNode): ReactElement[] {
  return Children.toArray(children).filter(isValidElement) as ReactElement[];
}

export interface DashboardMainSlots {
  grid?: ReactElement;
  items: ReactElement[];
  tiles: ReactElement[];
}

/**
 * Collect anatomy slots from `IdsDashboard` children.
 *
 * Accepted trees:
 *   IdsDashboard → IdsCard+                         (tiles)
 *   IdsDashboard → IdsDashboardItem+                (items)
 *   IdsDashboard → IdsDashboardGrid → IdsDashboardItem+|IdsCard+
 */
export function collectMainSlots(children: ReactNode): DashboardMainSlots {
  let grid: ReactElement | undefined;
  const items: ReactElement[] = [];
  const tiles: ReactElement[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const slot = getDashboardSlot(child.type);
    if (slot === "grid") grid = child;
    else if (slot === "item") items.push(child);
    else tiles.push(child);
  });

  if (grid) {
    const gridKids = validElements(
      (grid.props as { children?: ReactNode }).children,
    );
    const gridItems: ReactElement[] = [];
    const gridTiles: ReactElement[] = [];
    for (const kid of gridKids) {
      if (getDashboardSlot(kid.type) === "item") gridItems.push(kid);
      else gridTiles.push(kid);
    }
    if (gridItems.length > 0) {
      items.push(...gridItems);
    } else {
      tiles.push(...gridTiles);
    }
  }

  return { grid, items, tiles };
}

export function hasDashboardAnatomyChildren(children: ReactNode): boolean {
  const slots = collectMainSlots(children);
  return Boolean(slots.grid || slots.items.length > 0);
}

export function readSizeFromChildren(
  children: ReactNode,
  fallback?: IdsCardSize,
): IdsCardSize {
  if (fallback === "span-1" || fallback === "span-2" || fallback === "span-3") {
    return fallback;
  }
  const nested = validElements(children);
  const card = nested.find(isIdsCardElement);
  return card ? readCardSize(card) : "span-1";
}

export function readSizeFromItem(item: ReactElement): IdsCardSize {
  return readSizeFromChildren(
    (item.props as { children?: ReactNode }).children,
    (item.props as { size?: IdsCardSize }).size,
  );
}
