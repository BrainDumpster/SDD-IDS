import type { TemplateRef } from "@angular/core";
import type {
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftSelectionDetail,
} from "@component-contracts/ids/main-menu-left.contract";

/** Matches React `IdsAppShellBreakpointPreset` / design-spec variants. */
export type IdsAppShellBreakpointPreset = "fluid" | "1920" | "1600" | "1366" | "1024";

/** Matches React `IdsAppShellPageTitleLevel`. */
export type IdsAppShellPageTitleLevel = 1 | 2;

/**
 * Page catalog entry — design-spec `AppShellPage`.
 * Angular: `content` is a `TemplateRef` (React uses `ReactNode`).
 */
export interface IdsAppShellPage {
  id: string;
  title: string;
  description?: string;
  showDescription?: boolean;
  content?: TemplateRef<unknown> | null;
  menuItemId?: string;
}

/** Masthead bundle — design-spec composed child input. */
export interface IdsAppShellMastheadBundle {
  productName?: string;
  logoSlug?: string;
  showLogo?: boolean;
}

/** Main Menu bundle — design-spec composed child input. */
export interface IdsAppShellMainMenuBundle {
  items?: MainMenuLeftPrimaryItem[];
  logo?: MainMenuLeftLogo;
  expanded?: boolean;
  defaultSelectedItemId?: string;
  ariaLabel?: string;
}

/** Footer flat/bundle fields — design-spec Footer passthrough. */
export interface IdsAppShellFooterBundle {
  hostname?: string;
  swid?: string;
  currentDateTime?: string;
  timeZoneLabel?: string;
  showHostname?: boolean;
  showCurrentDateAndTime?: boolean;
  showTimeZone?: boolean;
  copyDisabled?: boolean;
  timeZoneDisabled?: boolean;
}

export type {
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftSelectionDetail,
};
