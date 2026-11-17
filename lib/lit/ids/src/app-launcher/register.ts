import { registerElementSafely } from "../internal/registration.js";
import {
  IdsAppLauncher,
  IdsAppLauncherProductTile,
} from "./app-launcher.element.js";
import "../icon/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-app-launcher", IdsAppLauncher);
registerElementSafely(
  "ids-app-launcher-product-tile",
  IdsAppLauncherProductTile,
);

export { IdsAppLauncher, IdsAppLauncherProductTile };
