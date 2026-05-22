import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { MainMenuTopMenuNode } from "./MainMenuTop.types";

export const MAIN_MENU_TOP_MENU = "MainMenuTop.Menu";
export const MAIN_MENU_TOP_MENU_ITEM = "MainMenuTop.MenuItem";
export const MAIN_MENU_TOP_MENU_GROUP = "MainMenuTop.MenuGroup";
export const MAIN_MENU_TOP_SUBMENU = "MainMenuTop.Submenu";

function elementTypeName(child: ReactElement): string | undefined {
  const type = child.type as { displayName?: string; name?: string };
  return type.displayName ?? type.name;
}

export function parseMenuChildren(children: ReactNode): MainMenuTopMenuNode[] {
  const nodes: MainMenuTopMenuNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    const name = elementTypeName(child);
    const props = child.props as {
      id: string;
      label: string;
      disabled?: boolean;
      children?: ReactNode;
    };

    if (name === MAIN_MENU_TOP_MENU_ITEM) {
      nodes.push({
        kind: "item",
        id: props.id,
        label: props.label,
        disabled: props.disabled,
      });
      return;
    }

    if (name === MAIN_MENU_TOP_MENU_GROUP) {
      nodes.push({
        kind: "group",
        id: props.id,
        label: props.label,
        children: parseMenuChildren(props.children),
      });
      return;
    }

    if (name === MAIN_MENU_TOP_SUBMENU) {
      nodes.push({
        kind: "submenu",
        id: props.id,
        label: props.label,
        disabled: props.disabled,
        children: parseMenuChildren(props.children),
      });
    }
  });

  return nodes;
}

export function extractMenuNodesFromItemChildren(
  children: ReactNode,
): MainMenuTopMenuNode[] | undefined {
  let nodes: MainMenuTopMenuNode[] | undefined;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (elementTypeName(child) === MAIN_MENU_TOP_MENU) {
      nodes = parseMenuChildren(
        (child.props as { children?: ReactNode }).children,
      );
    }
  });

  return nodes;
}
