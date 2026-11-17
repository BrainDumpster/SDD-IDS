import { registerElementSafely } from "../internal/registration.js";
import {
  IdsMainMenuTopItem,
  IdsMainMenuTopMenu,
  IdsMainMenuTopMenuGroup,
  IdsMainMenuTopMenuItem,
  IdsMainMenuTopSubmenu,
} from "./main-menu-top-parts.element.js";
import { IdsMainMenuTop } from "./main-menu-top.element.js";
import "../icon/register.js";

// Register parts before root so Mode B composition upgrades cleanly.
registerElementSafely("ids-main-menu-top-menu-item", IdsMainMenuTopMenuItem);
registerElementSafely("ids-main-menu-top-menu-group", IdsMainMenuTopMenuGroup);
registerElementSafely("ids-main-menu-top-submenu", IdsMainMenuTopSubmenu);
registerElementSafely("ids-main-menu-top-menu", IdsMainMenuTopMenu);
registerElementSafely("ids-main-menu-top-item", IdsMainMenuTopItem);
registerElementSafely("ids-main-menu-top", IdsMainMenuTop);

export {
  IdsMainMenuTop,
  IdsMainMenuTopItem,
  IdsMainMenuTopMenu,
  IdsMainMenuTopMenuGroup,
  IdsMainMenuTopMenuItem,
  IdsMainMenuTopSubmenu,
};
