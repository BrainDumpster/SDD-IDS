import type {
  MainMenuLeftLink,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftPrimaryState,
  MainMenuLeftSecondaryItem,
  MainMenuLeftSelectionDetail,
} from "./MainMenuLeft.types";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function primaryDisplayName(item: MainMenuLeftPrimaryItem): string {
  return item.name ?? item.label ?? "";
}

export function secondaryDisplayName(child: MainMenuLeftSecondaryItem): string {
  return child.name ?? child.label ?? "";
}

export function resolvePrimaryId(item: MainMenuLeftPrimaryItem, index: number): string {
  if (item.id) return item.id;
  const base = slugify(primaryDisplayName(item));
  return base || `primary-${index}`;
}

export function resolveSecondaryId(
  child: MainMenuLeftSecondaryItem,
  parentId: string,
  index: number,
): string {
  if (child.id) return child.id;
  const base = slugify(secondaryDisplayName(child));
  return base ? `${parentId}-${base}` : `${parentId}-child-${index}`;
}

export function resolveLink(
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftLink | undefined {
  if (link) return link;
  if (legacy.href) return { type: "href", href: legacy.href };
  if (legacy.routeRef) return { type: "routerLink", routerLink: legacy.routeRef };
  return undefined;
}

export function buildNavigateTarget(
  itemId: string,
  name: string,
  parentItemId: string | undefined,
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftNavigationTarget {
  const resolved = resolveLink(link, legacy);
  return {
    itemId,
    parentItemId,
    name,
    link: resolved,
    href: legacy.href,
    routeRef: legacy.routeRef,
  };
}

export function buildSelectionDetail(
  level: "primary" | "secondary",
  itemId: string,
  parentItemId: string | undefined,
  name: string,
  link: MainMenuLeftLink | undefined,
  legacy: { href?: string; routeRef?: string },
): MainMenuLeftSelectionDetail {
  const resolved = resolveLink(link, legacy);
  return {
    level,
    itemId,
    parentItemId,
    name,
    link: resolved,
    href: legacy.href,
    routeRef: legacy.routeRef,
  };
}

export function resolveInitialSelectedKey(
  list: MainMenuLeftPrimaryItem[],
  defaultSelectedItemId?: string,
): string | null {
  if (!defaultSelectedItemId) return null;
  for (let i = 0; i < list.length; i++) {
    if (resolvePrimaryId(list[i], i) === defaultSelectedItemId) {
      return defaultSelectedItemId;
    }
  }
  return null;
}

export function toPascalState(value: MainMenuLeftPrimaryState): string {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}
