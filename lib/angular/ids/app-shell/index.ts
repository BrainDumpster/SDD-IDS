import { IdsAppShellComponent } from "./ids-app-shell.component";
import {
  IdsAppShellBodyContentSlotComponent,
  IdsAppShellBodyRowComponent,
  IdsAppShellBodyViewportComponent,
  IdsAppShellFooterSlotComponent,
  IdsAppShellHeaderActionsComponent,
  IdsAppShellMainColumnComponent,
  IdsAppShellMainMenuSlotComponent,
  IdsAppShellMastheadSlotComponent,
  IdsAppShellPageDescriptionComponent,
  IdsAppShellPageHeaderComponent,
  IdsAppShellPagePanelComponent,
  IdsAppShellPageTitleComponent,
} from "./ids-app-shell-slots.component";
import { IdsAppShellDemoHostComponent } from "./ids-app-shell-demo-host.component";
import { IDS_APP_LAUNCHER_IMPORTS } from "../app-launcher/index";
import { IDS_FOOTER_IMPORTS } from "../footer/index";
import { IDS_ICON_IMPORTS } from "../icon/index";
import { IDS_MAIN_MENU_LEFT_IMPORTS } from "../main-menu-left/index";
import { IDS_MASTHEAD_IMPORTS } from "../masthead/index";

export const IDS_APP_SHELL_IMPORTS = [
  IdsAppShellComponent,
  IdsAppShellHeaderActionsComponent,
  IdsAppShellPagePanelComponent,
  IdsAppShellMastheadSlotComponent,
  IdsAppShellBodyRowComponent,
  IdsAppShellMainMenuSlotComponent,
  IdsAppShellMainColumnComponent,
  IdsAppShellPageHeaderComponent,
  IdsAppShellPageTitleComponent,
  IdsAppShellPageDescriptionComponent,
  IdsAppShellBodyViewportComponent,
  IdsAppShellBodyContentSlotComponent,
  IdsAppShellFooterSlotComponent,
  IdsAppShellDemoHostComponent,
  ...IDS_APP_LAUNCHER_IMPORTS,
  ...IDS_MASTHEAD_IMPORTS,
  ...IDS_MAIN_MENU_LEFT_IMPORTS,
  ...IDS_FOOTER_IMPORTS,
  ...IDS_ICON_IMPORTS,
] as const;

export {
  IdsAppShellComponent,
  IdsAppShellHeaderActionsComponent,
  IdsAppShellPagePanelComponent,
  IdsAppShellMastheadSlotComponent,
  IdsAppShellBodyRowComponent,
  IdsAppShellMainMenuSlotComponent,
  IdsAppShellMainColumnComponent,
  IdsAppShellPageHeaderComponent,
  IdsAppShellPageTitleComponent,
  IdsAppShellPageDescriptionComponent,
  IdsAppShellBodyViewportComponent,
  IdsAppShellBodyContentSlotComponent,
  IdsAppShellFooterSlotComponent,
  IdsAppShellDemoHostComponent,
};

export type {
  IdsAppShellBreakpointPreset,
  IdsAppShellFooterBundle,
  IdsAppShellMainMenuBundle,
  IdsAppShellMastheadBundle,
  IdsAppShellPage,
  IdsAppShellPageTitleLevel,
  MainMenuLeftLogo,
  MainMenuLeftNavigationTarget,
  MainMenuLeftPrimaryItem,
  MainMenuLeftSelectionDetail,
} from "./ids-app-shell.types";
