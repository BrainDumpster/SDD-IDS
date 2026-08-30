import type { LeftNavSecondaryContextMenuOption } from "./LeftNavSecondaryContextMenu";

export type MainMenuLeftContextMenuOption = LeftNavSecondaryContextMenuOption;

export type MainMenuLeftPrimaryState =
  | "default"
  | "hover"
  | "press"
  | "selected"
  | "default-focus"
  | "selected-focus";

export type MainMenuLeftItemLevel = "primary" | "secondary";

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
  contextMenuOptions?: MainMenuLeftContextMenuOption[];
  contextMenuDefaultOpen?: boolean;
}

export interface MainMenuLeftPrimaryItem {
  id?: string;
  name?: string;
  label?: string;
  tooltip?: string;
  iconName?: string;
  link?: MainMenuLeftLink;
  children?: MainMenuLeftSecondaryItem[];
  childrenContextMenu?: boolean;
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

export interface MainMenuLeftSecondaryContextMenuDetail {
  parentItemId: string;
  childId: string;
  name: string;
}

export interface MainMenuLeftProps {
  logo?: MainMenuLeftLogo;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  items?: MainMenuLeftPrimaryItem[];
  defaultSelectedItemId?: string;
  defaultExpandedChildrenItemId?: string;
  defaultSelectedSecondaryItemId?: { parentItemId: string; childId: string };
  forceStates?: boolean;
  onNavigate?: (target: MainMenuLeftNavigationTarget) => void;
  onSecondaryContextMenu?: (detail: MainMenuLeftSecondaryContextMenuDetail) => void;
  getSecondaryContextMenuOptions?: (
    detail: MainMenuLeftSecondaryContextMenuDetail,
  ) => MainMenuLeftContextMenuOption[];
  onSelected?: (detail: MainMenuLeftSelectionDetail) => void;
  ariaLabel?: string;
  programme?: "ids" | "synapse";
  menuLead?: { label?: string; onAction?: () => void };
}
