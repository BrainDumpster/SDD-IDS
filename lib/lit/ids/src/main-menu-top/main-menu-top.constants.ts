/**
 * IDS Main Menu/Top — constants + types
 * (API parity: storybook/src/components/MainMenuTop.types.ts —
 *  `lib/react/ids/main-menu-top` is not present in this repo.)
 *
 * Spec: `components/ids/main-menu-top/design-spec.md`
 * Figma: `0bHk3XhrjFhowgFkz9yLr4` — Main `10189:30280`, Element `11099:56576`,
 *        Use cases `42136:57443`
 */

export type MainMenuTopSize = "Large" | "Small";

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

/** Hierarchical dropdown node (data-driven). */
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

export type SubmenuSide = "left" | "right";

/** Figma `.Menu-Single-Select-DD` sample width (`42136:57443`). */
export const MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH = 181;

/** Gap between primary dropdown panel and nested submenu flyout. */
export const MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET = 4;

/** Dropdown panel offset below the top-menu trigger (Figma / React). */
export const MAIN_MENU_TOP_DROPDOWN_SIDE_OFFSET = 10;

export const MAIN_MENU_TOP_RUNTIME_DEFAULTS = {
  size: "Large" as MainMenuTopSize,
  ariaLabel: "Main menu top",
  defaultIconName: "home",
} as const;

/** Spec Accurate Design defaults — Figma `10189:30280`. */
export const MAIN_MENU_TOP_SPEC_DEMO_ITEMS: MainMenuTopItem[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: `top-${i + 1}`,
    name: "Menu Option",
    iconName: "home",
    dropdown: true,
  }),
);

export function normalizeMenuOption(
  option: MainMenuTopMenuOption,
): MainMenuTopMenuNode {
  if (option.kind === "group") {
    return {
      kind: "group",
      id: option.id,
      label: option.label,
      children: (option.children ?? []).map(normalizeMenuOption),
    };
  }
  if (option.children?.length || option.kind === "submenu") {
    return {
      kind: "submenu",
      id: option.id,
      label: option.label,
      disabled: option.disabled,
      children: (option.children ?? []).map(normalizeMenuOption),
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

export function resolveMainMenuTopSize(value: unknown): MainMenuTopSize {
  return value === "Small" ? "Small" : "Large";
}

export function submenuSideFromDataAttribute(
  value: string | null,
): SubmenuSide | null {
  if (!value) return null;
  if (value === "left" || value === "inline-start") return "left";
  if (value === "right" || value === "inline-end") return "right";
  return null;
}

/** Compare submenu popup vs trigger in viewport (fallback when `data-side` is unset). */
export function resolveSubmenuSideFromRects(
  triggerEl: HTMLElement | null,
  popupEl: HTMLElement | null,
  menuWidth = MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
): SubmenuSide {
  if (triggerEl && popupEl) {
    const triggerRect = triggerEl.getBoundingClientRect();
    const popupRect = popupEl.getBoundingClientRect();
    if (popupRect.left + 4 < triggerRect.left) return "left";
    if (popupRect.left > triggerRect.right - 4) return "right";
  }
  return resolveSubmenuSide(triggerEl, menuWidth);
}

export function resolveSubmenuSide(
  triggerEl: HTMLElement | null,
  menuWidth = MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH,
  padding = 8,
): SubmenuSide {
  if (!triggerEl) return "right";
  const rect = triggerEl.getBoundingClientRect();
  const spaceRight = window.innerWidth - rect.right - padding;
  const spaceLeft = rect.left - padding;
  if (spaceRight >= menuWidth) return "right";
  if (spaceLeft >= menuWidth) return "left";
  return spaceRight >= spaceLeft ? "right" : "left";
}

export function itemFocusId(id: string): string {
  return `main-menu-top-item-${id}`;
}
