import { registerElementSafely } from "../internal/registration.js";
import { IdsAnchorMenu } from "./anchor-menu.element.js";
import "../tooltip/register.js";

registerElementSafely("ids-anchor-menu", IdsAnchorMenu);

export { IdsAnchorMenu };
