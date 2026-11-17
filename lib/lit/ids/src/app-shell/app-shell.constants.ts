/**
 * IDS App Shell — shell-owned types + helpers only.
 * Spec: `components/ids/app-shell/design-spec.md`
 *
 * Not for Masthead / Main Menu / Footer props or Spec Accurate demo data
 * (those live on the projected children / Storybook).
 */
import type { TemplateResult } from "lit";
import type { MainMenuLeftNavigationTarget } from "../main-menu-left/main-menu-left.constants.js";

/** Viewport ≥ this width → suggested Main Menu expanded (host binds `.expanded`). */
export const MENU_EXPANDED_BREAKPOINT_PX = 1600;

/** `sessionStorage` key when `persistMenuExpanded` is true. */
export const MENU_EXPANDED_STORAGE_KEY = "ids.app-shell.menuExpanded";

export const APP_SHELL_PAGE_DESCRIPTION_ID = "page-description";
export const APP_SHELL_MAIN_CONTENT_ID = "main-content";

export type IdsAppShellBreakpointPreset =
  | "fluid"
  | "1920"
  | "1600"
  | "1366"
  | "1024";

export type IdsAppShellPageTitleLevel = 1 | 2;

/** Shell page catalog — design-spec `AppShellPage`. */
export interface AppShellPage {
  id: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  content?: TemplateResult | string | null;
  menuItemId?: string;
}

export const APP_SHELL_API_DEFAULTS = {
  persistMenuExpanded: false,
  showPageDescription: true,
  focusManagementOnNavigate: true,
  pageTitleLevel: 1 as IdsAppShellPageTitleLevel,
  breakpointPreset: "fluid" as IdsAppShellBreakpointPreset,
} as const;

export function isDev(): boolean {
  try {
    return Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV);
  } catch {
    return true;
  }
}

export function readPersistedMenuExpanded(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MENU_EXPANDED_STORAGE_KEY);
    if (raw === "true") return true;
    if (raw === "false") return false;
    return null;
  } catch {
    return null;
  }
}

export function writePersistedMenuExpanded(expanded: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      MENU_EXPANDED_STORAGE_KEY,
      expanded ? "true" : "false",
    );
  } catch {
    /* quota / private-mode */
  }
}

export function resolveBreakpointPreset(
  value: unknown,
): IdsAppShellBreakpointPreset {
  if (
    value === "1920" ||
    value === "1600" ||
    value === "1366" ||
    value === "1024" ||
    value === "fluid"
  ) {
    return value;
  }
  return "fluid";
}

/** Pinned QA presets → Main Menu expanded suggestion (`null` = use viewport). */
export function presetMenuExpandedDefault(
  preset: IdsAppShellBreakpointPreset,
): boolean | null {
  if (preset === "1920" || preset === "1600") return true;
  if (preset === "1366" || preset === "1024") return false;
  return null;
}

/**
 * Host helper for projected `ids-main-menu-left.expanded`
 * (shell breakpoint / persist — not a Main Menu prop on the shell).
 */
export function resolveMenuExpandedDefault(
  preset: IdsAppShellBreakpointPreset | string,
  options?: {
    defaultMenuExpanded?: boolean;
    persistMenuExpanded?: boolean;
  },
): boolean {
  if (options?.defaultMenuExpanded !== undefined) {
    return options.defaultMenuExpanded;
  }
  if (options?.persistMenuExpanded) {
    const stored = readPersistedMenuExpanded();
    if (stored !== null) return stored;
  }
  const resolved = resolveBreakpointPreset(preset);
  const pinned = presetMenuExpandedDefault(resolved);
  if (pinned !== null) return pinned;
  if (typeof window === "undefined") return true;
  return window.matchMedia(
    `(min-width: ${MENU_EXPANDED_BREAKPOINT_PX}px)`,
  ).matches;
}

export function resolvePageIdFromTarget(
  target: MainMenuLeftNavigationTarget,
  pages: AppShellPage[],
): string | null {
  const direct = pages.find(
    (page) => page.id === target.itemId || page.menuItemId === target.itemId,
  );
  if (direct) return direct.id;
  if (target.parentItemId) {
    const parentPage = pages.find((page) => page.id === target.parentItemId);
    if (parentPage) return parentPage.id;
  }
  return null;
}

export function resolvePageTitle(page: AppShellPage | undefined): string {
  if (!page) return "";
  if (page.title == null || page.title === "") {
    if (isDev()) {
      console.error(
        '[AppShell] pages[].title is required; rendering "Untitled".',
      );
    }
    return "Untitled";
  }
  return page.title;
}

export type { MainMenuLeftNavigationTarget };
