/**
 * IDS Main Menu/Left — framework-agnostic spec contract.
 * Source: `components/ids/main-menu-left/design-spec.md`
 */
export const IDS_MAIN_MENU_LEFT_DESIGN_SPEC_PATH =
  "components/ids/main-menu-left/design-spec.md" as const;

/** Deterministic composition order (preferred API). */
export const MAIN_MENU_LEFT_COMPOSITION_ANATOMY = [
  "MainMenuLeftRoot",
  "MainMenuLeftLogo?",
  "MainMenuList",
  "MainMenuLeftItem | MainMenuLeftGroup",
  "MainMenuLeftExpandCollapse",
] as const;

export const MAIN_MENU_LEFT_GROUP_ANATOMY = [
  "MainMenuLeftGroup",
  "MainMenuLeftItem",
  "MainMenuLeftChildren",
  "MainMenuLeftItem",
] as const;

export const MAIN_MENU_LEFT_ITEM_ANATOMY = [
  "MainMenuLeftItem",
  "linkHost",
  "MainMenuLeftItemIcon?",
  "label",
] as const;

export type MainMenuLeftItemLevel = "primary" | "secondary";

export type MainMenuLeftPrimaryState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "default-focus"
  | "selected-focus";

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
  href?: string;
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
  childrenMenu?: "expanded" | "collapsed";
  state?: MainMenuLeftPrimaryState;
  href?: string;
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

/** Sample nav from Figma MainMenu-Left-Main expanded (`11099:56218`). */
export const MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS: MainMenuLeftPrimaryItem[] = [
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

export const MAIN_MENU_LEFT_SPEC_ACCURATE_DEFAULTS = {
  expanded: true,
  defaultSelectedItemId: "dashboard",
  ariaLabel: "Main menu left",
  items: MAIN_MENU_LEFT_SPEC_ACCURATE_ITEMS,
} as const;

export const MAIN_MENU_LEFT_PRIMARY_STATE_MATRIX: MainMenuLeftPrimaryItem[] = [
  { id: "default", name: "Default", iconName: "home", state: "default" },
  { id: "hover", name: "Hover", iconName: "home", state: "hover" },
  { id: "press", name: "Press", iconName: "home", state: "press" },
  { id: "selected", name: "Selected", iconName: "home", state: "selected" },
  {
    id: "default-focus",
    name: "Default focus",
    iconName: "home",
    state: "default-focus",
  },
  {
    id: "selected-focus",
    name: "Selected focus",
    iconName: "home",
    state: "selected-focus",
  },
];
