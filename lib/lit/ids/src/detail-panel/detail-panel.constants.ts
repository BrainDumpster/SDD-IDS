/**
 * IDS Detail Panel — constants from design-spec / React IdsDetailPanel.
 * Spec: `components/ids/detail-panel/design-spec.md`
 */

export type IdsDetailPanelAttachMode = "datagrid" | "page";

/** Data grid panel width limits (IDS guideline): docked or floating, 240–480px. */
export const DATAGRID_MIN_WIDTH = 240;
export const DATAGRID_MAX_WIDTH = 480;
/** Page panel width (IDS guideline): at most 384px, which is also the default. */
export const PAGE_MAX_WIDTH = 384;
/** Floating (detached) panel height limit (IDS guideline). */
export const FLOATING_MAX_HEIGHT = 1280;
export const FLOATING_MIN_HEIGHT = 160;
/** Gap kept between a floating panel and the viewport edges. */
export const FLOATING_VIEWPORT_MARGIN = 16;
/** Part of a dragged floating panel that must stay on screen (its header band). */
export const FLOATING_DRAG_HANDLE = 48;

export const DETAIL_PANEL_EXPANDED_ICON = "double-chev-right" as const;
export const DETAIL_PANEL_COLLAPSED_ICON = "double-chev-left" as const;
export const DETAIL_PANEL_DETACH_ICON = "popout-window-arrow" as const;

export const DETAIL_PANEL_API_DEFAULTS = {
  attachMode: "datagrid" as IdsDetailPanelAttachMode,
  defaultExpanded: true,
  defaultDetached: false,
  collapsedWidth: 40,
  ariaLabelExpand: "Expand details panel",
  ariaLabelCollapse: "Collapse details panel",
  ariaLabelDetach: "Pop out details panel",
  ariaLabelAttach: "Dock details panel",
} as const;

export function resolveAttachMode(mode: unknown): IdsDetailPanelAttachMode {
  return mode === "page" ? "page" : "datagrid";
}

export function resolveWidth(value: number | undefined | null, fallback: number): number {
  if (value == null || !(value > 0)) return fallback;
  return value;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export interface FloatingRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
