import { InjectionToken } from "@angular/core";
import type { IdsFooterBundleFields } from "./ids-app-shell-footer.model";
import type {
  IdsAppShellMainMenuBundle,
  IdsAppShellPage,
  IdsAppShellPageTitleLevel,
  MainMenuLeftNavigationTarget,
  MainMenuLeftSelectionDetail,
} from "./ids-app-shell.types";

export interface IdsAppShellContext {
  readonly pages: IdsAppShellPage[];
  readonly activePage: IdsAppShellPage | undefined;
  readonly showDescription: boolean;
  readonly pageTitleLevel: IdsAppShellPageTitleLevel;
  readonly focusManagementOnNavigate: boolean;
  readonly resolvedFooter: IdsFooterBundleFields;
  readonly resolvedMenuExpanded: boolean;
  readonly resolvedMainMenu: IdsAppShellMainMenuBundle;
  readonly resolvedMastheadProductName: string;
  readonly resolvedMastheadProductIconSlug: string | null;
  handleMenuExpandedChange(expanded: boolean): void;
  handleNavigate(target: MainMenuLeftNavigationTarget): void;
  handleMenuSelected(detail: MainMenuLeftSelectionDetail): void;
  handleCopySwid(swid: string): void;
  handleTimeZoneClick(): void;
}

export const IDS_APP_SHELL_CONTEXT = new InjectionToken<IdsAppShellContext>(
  "IDS_APP_SHELL_CONTEXT",
);
