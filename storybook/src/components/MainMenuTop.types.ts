import type { ReactNode } from "react";

export type MainMenuTopLink =
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
    }
  | { type: "action" };

/** Hierarchical dropdown node (composable + data-driven). */
export type MainMenuTopMenuNode =
  | {
      kind?: "item";
      id: string;
      label: string;
      disabled?: boolean;
    }
  | {
      kind: "group";
      id?: string;
      label: string;
      children: MainMenuTopMenuNode[];
    }
  | {
      kind: "submenu";
      id: string;
      label: string;
      disabled?: boolean;
      children: MainMenuTopMenuNode[];
    };

/** @deprecated Use `MainMenuTopMenuNode`; kept for `items` prop compatibility. */
export interface MainMenuTopMenuOption {
  id: string;
  label: string;
  disabled?: boolean;
  kind?: "item" | "group" | "submenu";
  children?: MainMenuTopMenuOption[];
}

export interface MainMenuTopItem {
  id: string;
  name: string;
  iconName?: string;
  dropdown?: boolean;
  showIcon?: boolean;
  tooltip?: string;
  link?: MainMenuTopLink;
  menuOptions?: MainMenuTopMenuOption[];
}

export interface MainMenuTopSelectDetail {
  id: string;
  name: string;
  selected: boolean;
  link?: MainMenuTopLink;
  menuOptionId?: string;
}

export interface MainMenuTopProps {
  children?: ReactNode;
  items?: MainMenuTopItem[];
  selectedId?: string;
  defaultSelectedId?: string;
  size?: "Large" | "Small";
  onMenuItemSelect?: (detail: MainMenuTopSelectDetail) => void;
  ariaLabel?: string;
  className?: string;
}

export function normalizeMenuOption(option: MainMenuTopMenuOption): MainMenuTopMenuNode {
  if (option.kind === "group") {
    return {
      kind: "group",
      id: option.id,
      label: option.label,
      children: (option.children ?? []).map(normalizeMenuOption),
    };
  }
  if (option.children?.length) {
    return {
      kind: "submenu",
      id: option.id,
      label: option.label,
      disabled: option.disabled,
      children: option.children.map(normalizeMenuOption),
    };
  }
  return {
    kind: "item",
    id: option.id,
    label: option.label,
    disabled: option.disabled,
  };
}

export function normalizeMenuNodes(
  options?: MainMenuTopMenuOption[],
): MainMenuTopMenuNode[] | undefined {
  if (!options?.length) return undefined;
  return options.map(normalizeMenuOption);
}
