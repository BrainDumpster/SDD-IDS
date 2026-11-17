import { registerElementSafely } from "../internal/registration.js";
import { IdsMainMenuLeftItem } from "./main-menu-left-parts.element.js";
import { IdsMainMenuLeft } from "./main-menu-left.element.js";
import "../icon/register.js";
import "../tooltip/register.js";

registerElementSafely("ids-main-menu-left-item", IdsMainMenuLeftItem);
registerElementSafely("ids-main-menu-left", IdsMainMenuLeft);

export { IdsMainMenuLeft, IdsMainMenuLeftItem };
