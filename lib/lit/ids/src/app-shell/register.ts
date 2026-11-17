import { registerElementSafely } from "../internal/registration.js";
import { IdsAppShell } from "./app-shell.element.js";
import {
  IdsAppShellBodyContentSlot,
  IdsAppShellBodyRow,
  IdsAppShellBodyViewport,
  IdsAppShellFooterSlot,
  IdsAppShellHeaderActions,
  IdsAppShellMainColumn,
  IdsAppShellMainMenuSlot,
  IdsAppShellMastheadSlot,
  IdsAppShellPageDescription,
  IdsAppShellPageHeader,
  IdsAppShellPagePanel,
  IdsAppShellPageTitle,
} from "./app-shell-parts.element.js";

registerElementSafely(
  "ids-app-shell-header-actions",
  IdsAppShellHeaderActions,
);
registerElementSafely("ids-app-shell-page-panel", IdsAppShellPagePanel);
registerElementSafely("ids-app-shell-masthead-slot", IdsAppShellMastheadSlot);
registerElementSafely("ids-app-shell-body-row", IdsAppShellBodyRow);
registerElementSafely("ids-app-shell-main-menu-slot", IdsAppShellMainMenuSlot);
registerElementSafely("ids-app-shell-main-column", IdsAppShellMainColumn);
registerElementSafely("ids-app-shell-page-header", IdsAppShellPageHeader);
registerElementSafely("ids-app-shell-page-title", IdsAppShellPageTitle);
registerElementSafely(
  "ids-app-shell-page-description",
  IdsAppShellPageDescription,
);
registerElementSafely("ids-app-shell-body-viewport", IdsAppShellBodyViewport);
registerElementSafely(
  "ids-app-shell-body-content-slot",
  IdsAppShellBodyContentSlot,
);
registerElementSafely("ids-app-shell-footer-slot", IdsAppShellFooterSlot);
registerElementSafely("ids-app-shell", IdsAppShell);

export {
  IdsAppShell,
  IdsAppShellHeaderActions,
  IdsAppShellPagePanel,
  IdsAppShellMastheadSlot,
  IdsAppShellBodyRow,
  IdsAppShellMainMenuSlot,
  IdsAppShellMainColumn,
  IdsAppShellPageHeader,
  IdsAppShellPageTitle,
  IdsAppShellPageDescription,
  IdsAppShellBodyViewport,
  IdsAppShellBodyContentSlot,
  IdsAppShellFooterSlot,
};
export {
  APP_SHELL_API_DEFAULTS,
  resolveMenuExpandedDefault,
  type AppShellPage,
  type IdsAppShellBreakpointPreset,
} from "./app-shell.constants.js";
