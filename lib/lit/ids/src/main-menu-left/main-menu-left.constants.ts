/**
 * IDS Main Menu/Left — constants + types (React `IdsMainMenuLeft` parity).
 *
 * Spec: `components/ids/main-menu-left/design-spec.md`
 * Figma: `0bHk3XhrjFhowgFkz9yLr4` — Expanded `11099:56218`, Collapsed `11099:56206`
 */

export type MainMenuLeftPrimaryState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "default-focus"
  | "selected-focus";

/** Discriminated navigation target (host maps to `<a>`, router, or action). */
export type MainMenuLeftLink =
  | {
      type: "href";
      href: string;
      target?: "_self" | "_blank";
      rel?: string;
    }
  | {
      type: "routerLink";
      routerLink: string | readonly string[];
      queryParams?: Record<string, unknown>;
      fragment?: string;
    }
  | { type: "action" };

export interface MainMenuLeftLogo {
  alt: string;
  src?: string;
  iconName?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
}

export interface MainMenuLeftSecondaryItem {
  id?: string;
  name?: string;
  label?: string;
  tooltip?: string;
  link?: MainMenuLeftLink;
  /** @deprecated Use `link: { type: 'href', href }`. */
  href?: string;
  /** @deprecated Use `link: { type: 'routerLink', routerLink }`. */
  routeRef?: string;
}

export interface MainMenuLeftPrimaryItem {
  id?: string;
  name?: string;
  label?: string;
  tooltip?: string;
  iconName?: string;
  link?: MainMenuLeftLink;
  children?: MainMenuLeftSecondaryItem[];
  /** When `forceStates` is true: pins open/closed of `children` list. */
  childrenMenu?: "expanded" | "collapsed";
  state?: MainMenuLeftPrimaryState;
  /** @deprecated Use `link: { type: 'href', href }`. */
  href?: string;
  /** @deprecated Use `link: { type: 'routerLink', routerLink }`. */
  routeRef?: string;
}

export interface MainMenuLeftNavigationTarget {
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
  href?: string;
  routeRef?: string;
}

export interface MainMenuLeftSelectionDetail {
  level: "primary" | "secondary";
  itemId: string;
  parentItemId?: string;
  name: string;
  link?: MainMenuLeftLink;
  href?: string;
  routeRef?: string;
}

export const MAIN_MENU_LEFT_RUNTIME_DEFAULTS = {
  expanded: true,
  forceStates: false,
  ariaLabel: "Main menu left",
  defaultIconName: "home",
} as const;

/** Figma expanded frame `11099:56218` sample nav (Spec Accurate Design). */
export const MAIN_MENU_LEFT_SPEC_DEMO_ITEMS: MainMenuLeftPrimaryItem[] = [
  { id: "dashboard", name: "Dashboard", iconName: "home", routeRef: "/dashboard" },
  {
    id: "infrastructure",
    name: "Infrastructure",
    iconName: "network-share",
    routeRef: "/infrastructure",
    childrenMenu: "collapsed",
    children: [
      { id: "secondary-a", name: "Secondary Item", routeRef: "/infrastructure/a" },
      { id: "secondary-b", name: "Secondary Item", routeRef: "/infrastructure/b" },
    ],
  },
  { id: "protection", name: "Protection", iconName: "shield-encrypt-alt", routeRef: "/protection" },
  { id: "recovery", name: "Recovery", iconName: "arrows-spin", routeRef: "/recovery" },
  { id: "alerts", name: "Alerts and Events", iconName: "alert-bell", routeRef: "/alerts" },
  { id: "reports", name: "Reports", iconName: "productivity-alt", routeRef: "/reports" },
  {
    id: "administration",
    name: "Administration",
    iconName: "user-settings",
    routeRef: "/administration",
  },
  { id: "jobs", name: "Jobs", iconName: "time-detail", routeRef: "/jobs" },
];

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

export function resolvePrimaryId(
  item: MainMenuLeftPrimaryItem,
  index: number,
): string {
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
    if (resolvePrimaryId(list[i]!, i) === defaultSelectedItemId) {
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
