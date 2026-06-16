/** Figma `.Menu-Single-Select-DD` sample width (`42136:57443`). */
export const MAIN_MENU_TOP_DROPDOWN_MIN_WIDTH = 181;

/** Gap between primary dropdown panel and nested submenu flyout. */
export const MAIN_MENU_TOP_SUBMENU_SIDE_OFFSET = 4;

export type SubmenuSide = "left" | "right";

export function submenuSideFromDataAttribute(value: string | null): SubmenuSide | null {
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
