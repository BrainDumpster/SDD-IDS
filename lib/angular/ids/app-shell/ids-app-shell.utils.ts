import type {
  IdsAppShellBreakpointPreset,
  IdsAppShellPage,
  MainMenuLeftNavigationTarget,
} from "./ids-app-shell.types";

/** design-spec: viewport ≥ 1600px → expanded default. */
export const MENU_EXPANDED_BREAKPOINT_PX = 1600;

/** design-spec: `sessionStorage` key `ids.app-shell.menuExpanded`. */
export const MENU_EXPANDED_STORAGE_KEY = "ids.app-shell.menuExpanded";

export function isDevBuild(): boolean {
  try {
    return typeof ngDevMode !== "undefined" ? Boolean(ngDevMode) : true;
  } catch {
    return true;
  }
}

declare const ngDevMode: boolean | undefined;

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
    window.sessionStorage.setItem(MENU_EXPANDED_STORAGE_KEY, expanded ? "true" : "false");
  } catch {
    /* quota / private-mode — breakpoint default applies next mount */
  }
}

export function resolveBreakpointPreset(value: unknown): IdsAppShellBreakpointPreset {
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

export function presetMenuExpandedDefault(
  preset: IdsAppShellBreakpointPreset,
): boolean | null {
  if (preset === "1920" || preset === "1600") return true;
  if (preset === "1366" || preset === "1024") return false;
  return null;
}

export function resolvePageIdFromTarget(
  target: MainMenuLeftNavigationTarget,
  pages: IdsAppShellPage[],
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

export function resolvePageTitle(page: IdsAppShellPage | undefined): string {
  if (!page) return "";
  if (page.title == null || page.title === "") {
    if (isDevBuild()) {
      console.error('[AppShell] pages[].title is required; rendering "Untitled".');
    }
    return "Untitled";
  }
  return page.title;
}

export function shallowMergeDefined<T extends object>(
  base: T,
  overlay?: Partial<T> | null,
): T {
  if (!overlay) return base;
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (value !== undefined) {
      (out as Record<string, unknown>)[key] = value;
    }
  }
  return out;
}
